import type { ChatMessagesType } from "#/features/widgets/chat-widget/chat-messages";
import { BaseChatClient, type BanUserCallback, type ChatMessageCallback, type ClearAllCallback, type DeleteMessageCallback } from "./basechat";

export interface KickChannelInfo {
  chatroomId: string | null;
  channelId: string | null;
  subscriberBadges: any[];
}

export const getKickChannelInfo = async (
  username: string,
): Promise<KickChannelInfo> => {
  try {
    const response = await fetch(
      `https://kick.com/api/v1/channels/${username}`,
    );
    if (!response.ok) throw new Error("Channel not found");
    const data = (await response.json()) as {
      id?: unknown;
      chatroom?: {
        id?: unknown;
      };
      subscriber_badges?: any[];
    };

    return {
      chatroomId: data.chatroom?.id == null ? null : String(data.chatroom.id),
      channelId: data.id == null ? null : String(data.id),
      subscriberBadges: data.subscriber_badges || [],
    };
  } catch (error) {
    console.error("Error while fething channel:", error);
    return { chatroomId: null, channelId: null, subscriberBadges: [] };
  }
};

export const getKickId = async (username: string): Promise<string | null> => {
  const info = await getKickChannelInfo(username);
  return info.chatroomId;
};

export class KickChat extends BaseChatClient {
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
