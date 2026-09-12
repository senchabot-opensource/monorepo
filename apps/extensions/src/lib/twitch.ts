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

export type IrcLine = {
  tags: Record<string, string>;
  source: string;
  command: string;
  params: string[];
};

// "[@tags] [:source] COMMAND [params] [:trailing]", matched from the start of the line. Viewers
// write the trailing part, so it must never be searched for commands or another line.
const IRC_LINE = /^(?:@(\S+) )?(?::(\S+) )?(\S+)((?: [^:\s]\S*)*)(?: :(.*))?$/;

export function parseIrcLine(raw: string): IrcLine | null {
  const match = raw.match(IRC_LINE);
  if (!match) {
    return null;
  }

  const [, tagsStr, source = "", command, middle, trailing] = match;
  const params = middle.split(" ").filter(Boolean);
  if (trailing !== undefined) {
    params.push(trailing);
  }
  return { tags: parseTags(tagsStr), source, command, params };
}

export function parseTags(tagsStr?: string): Record<string, string> {
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

    for (const raw of event.data.split("\r\n")) {
      const line = parseIrcLine(raw);
      if (!line) {
        continue;
      }

      switch (line.command) {
        case "PING":
          this.send("PONG");
          break;
        case "CLEARMSG": {
          const targetId = line.tags["target-msg-id"];
          if (targetId) {
            this.onDeleteMessageCallback(targetId);
          }
          break;
        }
        case "CLEARCHAT": {
          // A timeout or ban names the user after the channel; without one the whole chat was cleared.
          const targetUser = line.params[1];
          if (targetUser) {
            this.onBanUserCallback(targetUser.toLowerCase());
          } else {
            this.onClearAllCallback();
          }
          break;
        }
        case "PRIVMSG":
          this.emit(this.parsePrivmsg(line));
          break;
        case "USERNOTICE":
          this.emit(this.parseAnnouncement(line));
          break;
      }
    }
  }

  private parsePrivmsg({ tags, source, params }: IrcLine): ChatMessagesType | null {
    const username = source.split("!")[0];
    const messageText = params[1];
    if (messageText === undefined) {
      return null;
    }

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
  private parseAnnouncement({ tags, params }: IrcLine): ChatMessagesType | null {
    const text = params[1];
    if (tags["msg-id"] !== "announcement" || text === undefined) {
      return null;
    }
    const message = this.toMessage(tags, tags.login ?? "", text);
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
}

