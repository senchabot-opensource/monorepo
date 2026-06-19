import type { ChatMessagesType } from "#/features/widgets/chat-widget/chat-messages";
import { BaseChatClient, type BanUserCallback, type ChatMessageCallback, type ClearAllCallback, type DeleteMessageCallback } from "./basechat";



export class TwitchChat extends BaseChatClient {
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

