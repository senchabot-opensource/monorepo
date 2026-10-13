import type { ChatMessagesType } from '#/features/widgets/chat-widget/chat-messages';
import {
  type BanUserCallback,
  BaseChatClient,
  type ChatMessageCallback,
  type ClearAllCallback,
  type DeleteMessageCallback,
} from './basechat';
import { withoutBypassSuffix } from './chat-text';
import { getKickPusherApp, type KickPusherApp } from './kick-pusher-app';

export interface KickChannelInfo {
  chatroomId: string | null;
  channelId: string | null;
  userId: string | null;
  subscriberBadges: any[];
  /** kick.com answered 404. Any other failure (403, 5xx, offline, timeout) is worth retrying. */
  notFound: boolean;
}

// A lookup that hangs would otherwise never fail, so nothing would retry it.
const LOOKUP_TIMEOUT_MS = 10_000;

export const getKickChannelInfo = async (username: string): Promise<KickChannelInfo> => {
  let notFound = false;
  try {
    const response = await fetch(
      `https://kick.com/api/v1/channels/${encodeURIComponent(username.trim())}`,
      { signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS) },
    );
    notFound = response.status === 404;
    if (!response.ok) throw new Error(`Kick channel lookup failed: ${response.status}`);
    const data = (await response.json()) as {
      id?: unknown;
      user_id?: unknown;
      chatroom?: {
        id?: unknown;
      };
      subscriber_badges?: any[];
    };

    return {
      chatroomId: data.chatroom?.id == null ? null : String(data.chatroom.id),
      channelId: data.id == null ? null : String(data.id),
      userId: data.user_id == null ? null : String(data.user_id),
      subscriberBadges: data.subscriber_badges || [],
      notFound: false,
    };
  } catch (error) {
    console.error('Error while fetching Kick channel:', error);
    return { chatroomId: null, channelId: null, userId: null, subscriberBadges: [], notFound };
  }
};

// The app kick.com's pages were given on 2026-10-13. Kick changes it from time to time; when Pusher
// refuses it, the clients ask the site's server for the current one.
const BUILT_IN_APP: KickPusherApp = { key: '34bf7a0ff419a2a775b9', cluster: 'us2' };
const APP_LOOKUP_INTERVAL_MS = 60_000;
const APP_LOOKUP_TIMEOUT_MS = 10_000;

let pusherApp = BUILT_IN_APP;
let appLookup: Promise<boolean> | null = null;
let appLookupAt = Number.NEGATIVE_INFINITY;

/** The socket URL of the Pusher app Kick's chat runs on, as far as this page knows. */
export const kickPusherUrl = () =>
  `wss://ws-${pusherApp.cluster}.pusher.com/app/${pusherApp.key}?protocol=7&client=js&version=8.4.0&flash=false`;

/**
 * Asks for the app Kick uses now, at most once a minute for the whole page; true when it differs
 * from the one in use, which every later attempt then connects to.
 */
export function refreshKickPusherApp(): Promise<boolean> {
  if (appLookup) return appLookup;
  if (Date.now() - appLookupAt < APP_LOOKUP_INTERVAL_MS) return Promise.resolve(false);
  appLookupAt = Date.now();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(resolve, APP_LOOKUP_TIMEOUT_MS, null);
  });
  appLookup = Promise.race([getKickPusherApp(), timeout])
    .then(
      (app) => {
        if (!app || (app.key === pusherApp.key && app.cluster === pusherApp.cluster)) return false;
        console.log(`Kick chat moved to Pusher app ${app.key} (${app.cluster}).`);
        pusherApp = app;
        return true;
      },
      () => false,
    )
    .finally(() => {
      clearTimeout(timer);
      appLookup = null;
    });
  return appLookup;
}

/** Puts the built-in app back and forgets the last lookup. For tests. */
export function resetKickPusherApp() {
  pusherApp = BUILT_IN_APP;
  appLookup = null;
  appLookupAt = Number.NEGATIVE_INFINITY;
}

/**
 * True for a pusher:error frame that refuses the connection itself. Pusher's 4000–4099 codes mean
 * the same settings will never connect: 4001 is an app key it doesn't know.
 */
export function isKickPusherRefusal(message: { event?: unknown; data?: unknown }): boolean {
  if (message.event !== 'pusher:error') return false;
  const data = typeof message.data === 'string' ? safeJson(message.data) : message.data;
  const code = (data as { code?: unknown } | null)?.code;
  return typeof code === 'number' && code >= 4000 && code <= 4099;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export class KickChat extends BaseChatClient {
  private readonly channelId: string;

  constructor(
    channelId: string,
    onMessage: ChatMessageCallback,
    onDeleteMessage: DeleteMessageCallback = () => {},
    onBanUser: BanUserCallback = () => {},
    onClearAll: ClearAllCallback = () => {},
  ) {
    super('Kick', onMessage, onDeleteMessage, onBanUser, onClearAll);
    this.channelId = channelId.trim();
    this.connect(kickPusherUrl, {
      onOpen: () => {
        this.send(
          JSON.stringify({
            event: 'pusher:subscribe',
            data: { channel: `chatrooms.${this.channelId}.v2` },
          }),
        );
      },
      onMessage: (event) => this.handleSocketMessage(event),
    });
  }

  // Answered with pusher:pong. Pusher's own liveness pings are protocol frames the page never sees.
  protected override pingFrame() {
    return JSON.stringify({ event: 'pusher:ping', data: {} });
  }

  private handleSocketMessage(event: MessageEvent) {
    if (typeof event.data !== 'string') {
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
    if (isKickPusherRefusal(response)) {
      void refreshKickPusherApp().then((moved) => moved && this.restart());
      return;
    }
    if (!response.event || typeof response.data !== 'string') {
      return;
    }

    let payloadData: unknown;
    try {
      payloadData = JSON.parse(response.data);
    } catch {
      return;
    }
    const payload = payloadData as Record<string, unknown>;

    if (typeof console !== 'undefined' && response.event.startsWith('App\\Events\\')) {
      console.debug(`[chat-widget] Kick event: ${response.event}`, payload);
    }

    switch (response.event) {
      case 'App\\Events\\ChatMessageEvent': {
        const message = this.parseChatMessage(payload);
        if (message) {
          this.emit(message);
        }
        return;
      }
      case 'App\\Events\\ChatMessageDeletedEvent':
      case 'App\\Events\\MessageDeletedEvent': {
        const id = this.extractDeletedMessageId(payload);
        if (id) {
          this.onDeleteMessageCallback(id);
        }
        return;
      }
      case 'App\\Events\\UserBannedEvent':
      case 'App\\Events\\ChatroomBanEvent': {
        const username = this.extractUsername(payload);
        if (username) {
          this.onBanUserCallback(username.toLowerCase());
        }
        return;
      }
      case 'App\\Events\\ChatroomClearEvent': {
        this.onClearAllCallback();
        return;
      }
      default:
        return;
    }
  }

  private parseChatMessage(payload: Record<string, unknown>): ChatMessagesType | null {
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
    const metadata = payload.metadata as
      | {
          original_sender?: { username?: string };
          original_message?: { content?: string };
        }
      | undefined;
    const replyUser = payload.type === 'reply' ? metadata?.original_sender?.username : undefined;

    if (!sender || typeof content !== 'string' || typeof createdAt !== 'string') {
      return null;
    }

    const user = sender.username;
    const timestamp = new Date(createdAt);
    const badges =
      sender.identity?.badges?.map((b) => (b.count ? `${b.type}/${b.count}` : b.type)) || [];

    return {
      id: id == null ? `kick-${user}-${timestamp.getTime()}` : String(id),
      user,
      message: withoutBypassSuffix(content),
      platform: 'kick',
      timestamp,
      receivedAt: timestamp,
      color: sender.identity?.color,
      badges,
      replyTo: replyUser
        ? { user: replyUser, message: metadata?.original_message?.content ?? '' }
        : undefined,
    };
  }

  private extractId(payload: Record<string, unknown>): string | null {
    const message = payload.message as { id?: unknown } | undefined;
    const candidate =
      (payload.id as unknown) ??
      (message?.id as unknown) ??
      (payload.message_id as unknown) ??
      (payload.messageId as unknown);
    if (candidate == null || candidate === '') {
      return null;
    }
    return String(candidate);
  }

  private extractDeletedMessageId(payload: Record<string, unknown>): string | null {
    const message = payload.message as { id?: unknown } | undefined;
    const fromMessage = message?.id;
    if (fromMessage != null && fromMessage !== '') {
      return String(fromMessage);
    }
    return this.extractId(payload);
  }

  private extractUsername(payload: Record<string, unknown>): string | null {
    const direct = (payload.username as unknown) ?? (payload.user as unknown);
    if (typeof direct === 'string' && direct.length > 0) {
      return direct;
    }
    const user = payload.user as { username?: unknown } | undefined;
    if (user && typeof user.username === 'string') {
      return user.username;
    }
    const sender = payload.sender as { username?: unknown } | undefined;
    if (sender && typeof sender.username === 'string') {
      return sender.username;
    }
    return null;
  }
}
