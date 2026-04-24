import React from "react";
import { type ChatMessagesType, chatMessagesCollection } from "./chat-messages";

type ChatMessageCallback = (message: ChatMessagesType) => void;

type Disconnectable = {
  disconnect: () => void;
};

const MAX_CHAT_HISTORY = 100;

class BaseChatClient implements Disconnectable {
  protected ws: WebSocket | null = null;

  constructor(
    private readonly label: string,
    protected readonly onMessageCallback: ChatMessageCallback,
  ) {}

  protected connect(
    url: string,
    handlers: {
      onOpen?: () => void;
      onMessage: (event: MessageEvent) => void;
    },
  ) {
    const ws = new WebSocket(url);
    this.ws = ws;

    ws.onopen = () => {
      handlers.onOpen?.();
      console.log(`${this.label} chat connected.`);
    };

    ws.onmessage = handlers.onMessage;
    ws.onerror = error => {
      console.error(`${this.label} WebSocket Error:`, error);
    };
    ws.onclose = () => {
      console.log(`${this.label} chat connection closed.`);
    };
  }

  protected emit(payload: ChatMessagesType | null) {
    if (payload) {
      this.onMessageCallback(payload);
    }
  }

  protected send(message: string) {
    this.ws?.send(message);
  }

  disconnect() {
    if (!this.ws) {
      return;
    }

    const ws = this.ws;
    this.ws = null;
    ws.onopen = null;
    ws.onmessage = null;
    ws.onerror = null;
    ws.onclose = null;
    ws.close();
    console.log(`${this.label} disconnected.`);
  }
}

class TwitchChat extends BaseChatClient {
  private readonly channel: string;

  constructor(channel: string, onMessage: ChatMessageCallback) {
    super("Twitch", onMessage);
    this.channel = channel.trim();
    this.connect("wss://irc-ws.chat.twitch.tv:443", {
      onOpen: () => {
        this.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
        this.send("PASS SCHMOOPIIE");
        this.send(`NICK justinfan${Math.floor(Math.random() * 1000)}`);
        this.send(`JOIN #${this.channel}`);
      },
      onMessage: event => this.handleSocketMessage(event),
    });
  }

  private handleSocketMessage(event: MessageEvent) {
    if (typeof event.data !== "string") {
      return;
    }

    for (const message of event.data.split("\r\n")) {
      if (!message) {
        continue;
      }

      if (message.startsWith("PING")) {
        this.send("PONG");
        continue;
      }

      this.emit(this.parsePrivmsg(message));
    }
  }

  private parsePrivmsg(rawMessage: string): ChatMessagesType | null {
    const match = rawMessage.match(
      /(?:@([^\s]+) )?:([^\s!]+)![^\s]+ PRIVMSG #[^\s]+ :(.+)/,
    );
    if (!match) {
      return null;
    }

    const [, tagsStr, username, messageText] = match;
    const tags = this.parseTags(tagsStr);
    const sentAt = tags["tmi-sent-ts"];
    const timestamp = sentAt
      ? new Date(Number.parseInt(sentAt, 10))
      : new Date();
    const user = tags["display-name"] || username;
    const message = messageText.trim();

    const badges = tags.badges ? tags.badges.split(",") : [];

    if (!user.trim() || !message) {
      return null;
    }

    return {
      id: tags.id || `twitch-${user}-${timestamp.getTime()}`,
      user,
      message,
      platform: "twitch",
      timestamp,
      color: tags.color || undefined,
      badges,
      emotes: tags.emotes || undefined,
    };
  }

  private parseTags(tagsStr?: string): Record<string, string> {
    if (!tagsStr) {
      return {};
    }

    const tags: Record<string, string> = {};
    for (const tag of tagsStr.split(";")) {
      const [key, value = ""] = tag.split("=");
      if (!key) {
        continue;
      }

      tags[key] = value
        .replace(/\\s/g, " ")
        .replace(/\\:/g, ";")
        .replace(/\\\\/g, "\\")
        .replace(/\\r/g, "\r")
        .replace(/\\n/g, "\n");
    }

    return tags;
  }
}

class KickChat extends BaseChatClient {
  private readonly channelId: string;

  constructor(channelId: string, onMessage: ChatMessageCallback) {
    super("Kick", onMessage);
    this.channelId = channelId.trim();
    this.connect(
      "wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0&flash=false",
      {
        onOpen: () => {
          this.send(
            JSON.stringify({
              event: "pusher:subscribe",
              data: { channel: `chatrooms.${this.channelId}.v2` },
            }),
          );
        },
        onMessage: event => this.handleSocketMessage(event),
      },
    );
  }

  private handleSocketMessage(event: MessageEvent) {
    if (typeof event.data !== "string") {
      return;
    }

    this.emit(this.parseEvent(event.data));
  }

  private parseEvent(rawMessage: string): ChatMessagesType | null {
    let responseData: unknown;
    try {
      responseData = JSON.parse(rawMessage);
    } catch {
      return null;
    }

    const response = responseData as { event?: unknown; data?: unknown };
    if (
      response.event !== "App\\Events\\ChatMessageEvent" ||
      typeof response.data !== "string"
    ) {
      return null;
    }

    let payloadData: unknown;
    try {
      payloadData = JSON.parse(response.data);
    } catch {
      return null;
    }

    const payload = payloadData as {
      id?: unknown;
      sender: {
        username: string;
        identity?: {
          color?: string;
          badges?: { type: string; count?: number }[];
        };
      };
      content: string;
      created_at: string;
    };
    const user = payload.sender.username;
    const message = payload.content;
    const timestamp = new Date(payload.created_at);
    const badges =
      payload.sender.identity?.badges?.map(b =>
        b.count ? `${b.type}/${b.count}` : b.type,
      ) || [];

    return {
      id:
        payload.id == null
          ? `kick-${user}-${timestamp.getTime()}`
          : String(payload.id),
      user,
      message,
      platform: "kick",
      timestamp,
      color: payload.sender.identity?.color,
      badges,
    };
  }
}

export const useUnifiedChat = (
  twitchChannel?: string | null,
  kickChannelId?: string | null,
) => {
  React.useEffect(() => {
    const messageOrder: string[] = [];
    const seenIds = new Set<string>();

    const pushToMessages = (payload: ChatMessagesType) => {
      const message = { ...payload, receivedAt: new Date() };
      chatMessagesCollection.insert(message);

      if (seenIds.has(message.id)) {
        const existingIndex = messageOrder.indexOf(message.id);
        if (existingIndex !== -1) {
          messageOrder.splice(existingIndex, 1);
        }
      } else {
        seenIds.add(message.id);
      }
      messageOrder.push(message.id);

      while (messageOrder.length > MAX_CHAT_HISTORY) {
        const oldestId = messageOrder.shift();
        if (!oldestId) {
          break;
        }

        seenIds.delete(oldestId);
        chatMessagesCollection.delete(oldestId);
      }
    };

    const clients: Disconnectable[] = [];
    const normalizedTwitchChannel = twitchChannel?.trim();
    const normalizedKickChannelId = kickChannelId?.trim();

    if (normalizedTwitchChannel) {
      clients.push(new TwitchChat(normalizedTwitchChannel, pushToMessages));
    }

    if (normalizedKickChannelId) {
      clients.push(new KickChat(normalizedKickChannelId, pushToMessages));
    }

    return () => {
      for (const client of clients) {
        client.disconnect();
      }
    };
  }, [twitchChannel, kickChannelId]);
};
