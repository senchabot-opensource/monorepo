import React from "react";
import { type ChatMessagesType, chatMessagesCollection } from "./chat-messages";

type ChatMessageCallback = (message: ChatMessagesType) => void;
type DeleteMessageCallback = (id: string) => void;
type BanUserCallback = (usernameLower: string) => void;
type ClearAllCallback = () => void;

type Disconnectable = {
  disconnect: () => void;
};

const MAX_CHAT_HISTORY = 100;

class BaseChatClient implements Disconnectable {
  protected ws: WebSocket | null = null;

  constructor(
    private readonly label: string,
    protected readonly onMessageCallback: ChatMessageCallback,
    protected readonly onDeleteMessageCallback: DeleteMessageCallback = () => {},
    protected readonly onBanUserCallback: BanUserCallback = () => {},
    protected readonly onClearAllCallback: ClearAllCallback = () => {},
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

  constructor(
    channel: string,
    onMessage: ChatMessageCallback,
    onDeleteMessage: DeleteMessageCallback = () => {},
    onBanUser: BanUserCallback = () => {},
    onClearAll: ClearAllCallback = () => {},
  ) {
    super("Twitch", onMessage, onDeleteMessage, onBanUser, onClearAll);
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

      if (message.includes(" CLEARMSG ")) {
        const targetId = this.parseClearmsg(message);
        if (targetId) {
          this.onDeleteMessageCallback(targetId);
        }
        continue;
      }

      if (message.includes(" CLEARCHAT ")) {
        const result = this.parseClearchat(message);
        if (result) {
          if (result.targetUserLower) {
            this.onBanUserCallback(result.targetUserLower);
          } else {
            this.onClearAllCallback();
          }
        }
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
      receivedAt: timestamp,
      color: tags.color || undefined,
      badges,
      emotes: tags.emotes || undefined,
    };
  }

  private parseClearmsg(rawMessage: string): string | null {
    const tagsMatch = rawMessage.match(/^@([^\s]+)\s/);
    if (!tagsMatch) {
      return null;
    }
    const tags = this.parseTags(tagsMatch[1]);
    const targetId = tags["target-msg-id"];
    return targetId || null;
  }

  private parseClearchat(
    rawMessage: string,
  ): { targetUserLower: string | null } | null {
    if (!/CLEARCHAT\s+#?[^\s]+/i.test(rawMessage)) {
      return null;
    }

    const tagsMatch = rawMessage.match(/^@([^\s]+)\s/);
    const tags = tagsMatch ? this.parseTags(tagsMatch[1]) : {};
    const targetUser = tags["login"] || "";
    return { targetUserLower: targetUser ? targetUser.toLowerCase() : null };
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

  constructor(
    channelId: string,
    onMessage: ChatMessageCallback,
    onDeleteMessage: DeleteMessageCallback = () => {},
    onBanUser: BanUserCallback = () => {},
    onClearAll: ClearAllCallback = () => {},
  ) {
    super("Kick", onMessage, onDeleteMessage, onBanUser, onClearAll);
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

    this.dispatchEvent(event.data);
  }

  private dispatchEvent(rawMessage: string) {
    let responseData: unknown;
    try {
      responseData = JSON.parse(rawMessage);
    } catch {
      return;
    }

    const response = responseData as {
      event?: string;
      data?: string;
    };
    if (!response.event || typeof response.data !== "string") {
      return;
    }

    let payloadData: unknown;
    try {
      payloadData = JSON.parse(response.data);
    } catch {
      return;
    }
    const payload = payloadData as Record<string, unknown>;

    if (typeof console !== "undefined" && response.event.startsWith("App\\Events\\")) {
      console.debug(`[chat-widget] Kick event: ${response.event}`, payload);
    }

    switch (response.event) {
      case "App\\Events\\ChatMessageEvent": {
        const message = this.parseChatMessage(payload);
        if (message) {
          this.emit(message);
        }
        return;
      }
      case "App\\Events\\ChatMessageDeletedEvent":
      case "App\\Events\\MessageDeletedEvent": {
        const id = this.extractDeletedMessageId(payload);
        if (id) {
          this.onDeleteMessageCallback(id);
        }
        return;
      }
      case "App\\Events\\UserBannedEvent":
      case "App\\Events\\ChatroomBanEvent": {
        const username = this.extractUsername(payload);
        if (username) {
          this.onBanUserCallback(username.toLowerCase());
        }
        return;
      }
      case "App\\Events\\ChatroomClearEvent": {
        this.onClearAllCallback();
        return;
      }
      default:
        return;
    }
  }

  private parseChatMessage(
    payload: Record<string, unknown>,
  ): ChatMessagesType | null {
    const sender = payload.sender as
      | {
          username: string;
          identity?: {
            color?: string;
            badges?: { type: string; count?: number }[];
          };
        }
      | undefined;
    const content = payload.content;
    const createdAt = payload.created_at;
    const id = payload.id;

    if (!sender || typeof content !== "string" || typeof createdAt !== "string") {
      return null;
    }

    const user = sender.username;
    const timestamp = new Date(createdAt);
    const badges =
      sender.identity?.badges?.map(b =>
        b.count ? `${b.type}/${b.count}` : b.type,
      ) || [];

    return {
      id: id == null ? `kick-${user}-${timestamp.getTime()}` : String(id),
      user,
      message: content,
      platform: "kick",
      timestamp,
      receivedAt: timestamp,
      color: sender.identity?.color,
      badges,
    };
  }

  private extractId(payload: Record<string, unknown>): string | null {
    const message = payload.message as { id?: unknown } | undefined;
    const candidate =
      (payload.id as unknown) ??
      (message?.id as unknown) ??
      (payload.message_id as unknown) ??
      (payload.messageId as unknown);
    if (candidate == null || candidate === "") {
      return null;
    }
    return String(candidate);
  }

  private extractDeletedMessageId(payload: Record<string, unknown>): string | null {
    const message = payload.message as { id?: unknown } | undefined;
    const fromMessage = message?.id;
    if (fromMessage != null && fromMessage !== "") {
      return String(fromMessage);
    }
    return this.extractId(payload);
  }

  private extractUsername(payload: Record<string, unknown>): string | null {
    const direct =
      (payload.username as unknown) ?? (payload.user as unknown);
    if (typeof direct === "string" && direct.length > 0) {
      return direct;
    }
    const user = payload.user as { username?: unknown } | undefined;
    if (user && typeof user.username === "string") {
      return user.username;
    }
    const sender = payload.sender as { username?: unknown } | undefined;
    if (sender && typeof sender.username === "string") {
      return sender.username;
    }
    return null;
  }
}

export const useUnifiedChat = (
  twitchChannel?: string | null,
  kickChannelId?: string | null,
) => {
  React.useEffect(() => {
    const messageOrder: string[] = [];
    const seenIds = new Set<string>();
    const userIndex = new Map<string, Set<string>>();

    const pruneUserIndex = (id: string, userLower?: string) => {
      if (!userLower) {
        return;
      }
      const set = userIndex.get(userLower);
      if (!set) {
        return;
      }
      set.delete(id);
      if (set.size === 0) {
        userIndex.delete(userLower);
      }
    };

    const pushToMessages = (payload: ChatMessagesType) => {
      const userLower = payload.user.toLowerCase();
      const message: ChatMessagesType = {
        ...payload,
        receivedAt: new Date(),
        userLower,
      };
      chatMessagesCollection.insert(message);

      if (seenIds.has(message.id)) {
        const existingIndex = messageOrder.indexOf(message.id);
        if (existingIndex !== -1) {
          messageOrder.splice(existingIndex, 1);
        }
        pruneUserIndex(message.id, userLower);
      } else {
        seenIds.add(message.id);
      }
      messageOrder.push(message.id);
      const bucket = userIndex.get(userLower) ?? new Set<string>();
      bucket.add(message.id);
      userIndex.set(userLower, bucket);

      while (messageOrder.length > MAX_CHAT_HISTORY) {
        const oldestId = messageOrder.shift();
        if (!oldestId) {
          break;
        }

        const oldest = chatMessagesCollection.get(oldestId);
        seenIds.delete(oldestId);
        pruneUserIndex(oldestId, oldest?.userLower);
        chatMessagesCollection.delete(oldestId);
      }
    };

    const deleteMessage = (id: string) => {
      /*if (!seenIds.has(id)) {
        return;
      }*/
      const existing = chatMessagesCollection.get(id);
      const hadIt = existing !== undefined;
      if (hadIt) {
        seenIds.delete(id);
        const idx = messageOrder.indexOf(id);
        if (idx !== -1) {
          messageOrder.splice(idx, 1);
        }
        pruneUserIndex(id, existing?.userLower);
        chatMessagesCollection.delete(id);
      }
      if (typeof window !== "undefined") {
        console.debug(
          `[chat-widget] deleteMessage(${id}) hadIt=${hadIt} seenIds.has=${seenIds.has(id)}`,
        );
      }
    };

    const banUser = (usernameLower: string) => {
      const bucket = userIndex.get(usernameLower);
      if (!bucket || bucket.size === 0) {
        return;
      }
      const ids = Array.from(bucket);
      for (const id of ids) {
        if (!seenIds.has(id)) {
          continue;
        }
        seenIds.delete(id);
        const idx = messageOrder.indexOf(id);
        if (idx !== -1) {
          messageOrder.splice(idx, 1);
        }
        chatMessagesCollection.delete(id);
      }
      userIndex.delete(usernameLower);
    };

    const clearAll = () => {
      for (const id of messageOrder) {
        chatMessagesCollection.delete(id);
      }
      messageOrder.length = 0;
      seenIds.clear();
      userIndex.clear();
    };

    const clients: Disconnectable[] = [];
    const normalizedTwitchChannel = twitchChannel?.trim();
    const normalizedKickChannelId = kickChannelId?.trim();

    if (normalizedTwitchChannel) {
      clients.push(
        new TwitchChat(
          normalizedTwitchChannel,
          pushToMessages,
          deleteMessage,
          banUser,
          clearAll,
        ),
      );
    }

    if (normalizedKickChannelId) {
      clients.push(
        new KickChat(
          normalizedKickChannelId,
          pushToMessages,
          deleteMessage,
          banUser,
          clearAll,
        ),
      );
    }

    return () => {
      for (const client of clients) {
        client.disconnect();
      }
    };
  }, [twitchChannel, kickChannelId]);
};
