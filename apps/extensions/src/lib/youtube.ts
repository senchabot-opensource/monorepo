import type { ChatMessagesType } from '#/features/widgets/chat-widget/chat-messages';
import {
  type BanUserCallback,
  BaseChatClient,
  type ChatMessageCallback,
  type ClearAllCallback,
  type DeleteMessageCallback,
} from './basechat';

export function resolveWsBaseUrl(): string {
  if (typeof window !== 'undefined' && (window as unknown as { __SENCHABOT_WS_URL__?: string }).__SENCHABOT_WS_URL__) {
    return (window as unknown as { __SENCHABOT_WS_URL__: string }).__SENCHABOT_WS_URL__;
  }
  try {
    if (import.meta.env?.VITE_SENCHABOT_WS_URL) {
      return import.meta.env.VITE_SENCHABOT_WS_URL;
    }
  } catch {}

  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return 'ws://localhost:3000/api/ws/youtube-chat';
  }
  return 'wss://senchabot.com/api/ws/youtube-chat';
}

export class YouTubeChat extends BaseChatClient {
  private readonly channel: string;
  private readonly token: string;

  constructor(
    channel: string,
    token: string,
    onMessage: ChatMessageCallback,
    onDeleteMessage: DeleteMessageCallback = () => {},
    onBanUser: BanUserCallback = () => {},
    onClearAll: ClearAllCallback = () => {},
  ) {
    super('YouTube', onMessage, onDeleteMessage, onBanUser, onClearAll);
    this.channel = channel.trim();
    this.token = token.trim();

    if (!this.token) {
      console.warn('[YouTube] Token is required for YouTube live chat');
      return;
    }

    const wsUrl = `${resolveWsBaseUrl()}?token=${encodeURIComponent(this.token)}&channel=${encodeURIComponent(this.channel)}`;
    this.connect(wsUrl, {
      onOpen: () => {
        console.log(`[YouTube] Connected to YouTube live chat for channel: ${this.channel}`);
      },
      onMessage: (event) => this.handleSocketMessage(event),
    });
  }

  protected override pingFrame() {
    return JSON.stringify({ type: 'ping' });
  }

  private handleSocketMessage(event: MessageEvent) {
    if (typeof event.data !== 'string') return;
    try {
      const data = JSON.parse(event.data);
      if (!data || typeof data !== 'object') return;

      switch (data.type) {
        case 'message': {
          const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
          const message: ChatMessagesType = {
            id: data.id || `yt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            user: data.user || 'Anonymous',
            userLower: data.userLower || data.user?.toLowerCase() || 'anonymous',
            message: data.message || '',
            platform: 'youtube',
            timestamp: Number.isNaN(timestamp.getTime()) ? new Date() : timestamp,
            receivedAt: new Date(),
            color: data.color || undefined,
            badges: Array.isArray(data.badges) ? data.badges : undefined,
          };
          this.onMessageCallback(message);
          break;
        }
        case 'delete': {
          const id = data.deletedMessageId || data.id;
          if (id) {
            this.onDeleteMessageCallback(id);
          }
          break;
        }
        case 'ban': {
          const userLower = data.bannedUserChannel || data.userLower;
          if (userLower) {
            this.onBanUserCallback(userLower);
          }
          break;
        }
        case 'clear': {
          this.onClearAllCallback();
          break;
        }
        case 'status': {
          if (data.status === 'offline') {
            console.info(`[YouTube] Channel ${data.channel || this.channel} is offline; waiting for stream...`);
          } else if (data.status === 'live') {
            console.info(`[YouTube] Channel ${data.channel || this.channel} is live! Chat active.`);
          } else if (data.status === 'error') {
            console.warn(`[YouTube] Live chat notice: ${data.error}`);
          }
          break;
        }
        case 'pong':
          // Heartbeat pong received
          break;
      }
    } catch (e) {
      console.error('[YouTube] Failed to parse WebSocket message:', e);
    }
  }
}
