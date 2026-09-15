import {
  ANNOUNCEMENT_COLORS,
  type AnnouncementColor,
  type ChatMessagesType,
} from "#/features/widgets/chat-widget/chat-messages";
import { BaseChatClient, type BanUserCallback, type ChatMessageCallback, type ClearAllCallback, type DeleteMessageCallback } from "./basechat";

// Twitch starts a reply with "@parent ", which the widget already shows above the message. Emote
// positions count code points from the start of the text, so they move back by the prefix length.
export function stripReplyMention(
  message: string,
  emotes: string | undefined,
  names: (string | undefined)[],
): { message: string; emotes: string | undefined } {
  const name = names.find((n) => n && message.startsWith(`@${n} `));
  if (!name) {
    return { message, emotes };
  }

  const shift = [...`@${name} `].length;
  const shifted = emotes
    ?.split("/")
    .map((part) => {
      const [id, positions = ""] = part.split(":");
      const ranges = positions
        .split(",")
        .map((range) => range.split("-").map((n) => Number(n) - shift))
        .filter(([start]) => start >= 0)
        .map(([start, end]) => `${start}-${end}`);
      return ranges.length > 0 ? `${id}:${ranges.join(",")}` : null;
    })
    .filter(Boolean)
    .join("/");
  return { message: [...message].slice(shift).join(""), emotes: shifted || undefined };
}

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

      this.emit(this.parseAnnouncement(message) ?? this.parsePrivmsg(message));
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
    const message = this.toMessage(tags, username, messageText);
    if (!message) {
      return null;
    }

    const replyUser = tags["reply-parent-display-name"] || tags["reply-parent-user-login"];
    return {
      ...message,
      ...(replyUser
        ? {
            ...stripReplyMention(message.message, message.emotes, [
              replyUser,
              tags["reply-parent-user-login"],
            ]),
            replyTo: { user: replyUser, message: tags["reply-parent-msg-body"] ?? "" },
          }
        : {}),
      firstMessage: tags["first-msg"] === "1" || undefined,
      variant: tags["msg-id"] === "highlighted-message" ? "highlighted" : undefined,
    };
  }

  // Announcements (/announce) arrive as USERNOTICE, not PRIVMSG. Other USERNOTICEs (subs, raids)
  // are left out on purpose.
  private parseAnnouncement(rawMessage: string): ChatMessagesType | null {
    const match = rawMessage.match(/^@(\S+) :tmi\.twitch\.tv USERNOTICE #\S+ :(.+)/);
    if (!match) {
      return null;
    }

    const tags = this.parseTags(match[1]);
    if (tags["msg-id"] !== "announcement") {
      return null;
    }
    const message = this.toMessage(tags, tags.login ?? "", match[2]);
    if (!message) {
      return null;
    }

    const color = tags["msg-param-color"] as AnnouncementColor;
    return {
      ...message,
      variant: "announcement",
      announcementColor: ANNOUNCEMENT_COLORS.includes(color) ? color : "PRIMARY",
    };
  }

  private toMessage(
    tags: Record<string, string>,
    login: string,
    text: string,
  ): ChatMessagesType | null {
    const sentAt = tags["tmi-sent-ts"];
    const timestamp = sentAt
      ? new Date(Number.parseInt(sentAt, 10))
      : new Date();
    const user = tags["display-name"] || login;
    const message = text.trim();

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

