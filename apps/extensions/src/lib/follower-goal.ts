export interface FollowEvent {
  user: string;
  platform: 'twitch' | 'kick' | 'youtube';
  timestamp?: Date;
}

export type FollowCallback = (event: FollowEvent) => void;
export type StatusCallback = (status: 'connecting' | 'connected' | 'offline' | 'error') => void;

export function resolveFollowerGoalWsUrl(): string {
  if (
    typeof window !== 'undefined' &&
    (window as unknown as { __SENCHABOT_WS_URL__?: string }).__SENCHABOT_WS_URL__
  ) {
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
    return 'ws://localhost:3000/api/ws/follower-goal';
  }
  return 'wss://senchabot.com/api/ws/follower-goal';
}

const HEARTBEAT_IDLE_MS = 30000;
const HEARTBEAT_TIMEOUT_MS = 10000;
const MAX_RECONNECT_DELAY_MS = 30000;

export class FollowerGoalClient {
  private ws: WebSocket | null = null;
  private readonly token: string;
  private readonly channel: string;
  private readonly onFollowCallback: FollowCallback;
  private readonly onStatusCallback: StatusCallback;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private pingTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private disposed = false;

  constructor(
    token: string,
    channel: string,
    onFollow: FollowCallback,
    onStatus: StatusCallback = () => {},
  ) {
    this.token = token.trim();
    this.channel = channel.trim();
    this.onFollowCallback = onFollow;
    this.onStatusCallback = onStatus;

    if (!this.token) {
      console.warn('[FollowerGoal] Token is required for follower goal WebSocket');
      return;
    }

    this.connect();
  }

  private connect() {
    if (this.disposed || !this.token) return;

    this.onStatusCallback('connecting');
    const wsBase = resolveFollowerGoalWsUrl();
    const query = new URLSearchParams();
    query.set('token', this.token);
    if (this.channel) query.set('channel', this.channel);

    const wsUrl = `${wsBase}?${query.toString()}`;

    try {
      const ws = new WebSocket(wsUrl);
      this.ws = ws;

      ws.onopen = () => {
        if (this.disposed || ws !== this.ws) return;
        this.reconnectAttempts = 0;
        this.onStatusCallback('connected');
        this.startHeartbeat();
      };

      ws.onmessage = (event) => this.handleMessage(event);

      ws.onerror = (err) => {
        if (this.disposed || ws !== this.ws) return;
        console.warn('[FollowerGoal] WebSocket error:', err);
        this.onStatusCallback('error');
      };

      ws.onclose = () => {
        if (this.disposed || ws !== this.ws) return;
        this.stopHeartbeat();
        this.onStatusCallback('offline');
        this.scheduleReconnect();
      };
    } catch (e) {
      console.error('[FollowerGoal] Failed to create WebSocket:', e);
      this.scheduleReconnect();
    }
  }

  private handleMessage(event: MessageEvent) {
    if (typeof event.data !== 'string') return;
    try {
      const data = JSON.parse(event.data);
      if (!data || typeof data !== 'object') return;

      switch (data.type) {
        case 'follow': {
          const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
          const platform =
            data.platform === 'twitch' || data.platform === 'kick' || data.platform === 'youtube'
              ? data.platform
              : 'twitch';
          this.onFollowCallback({
            user: data.user || 'Anonymous',
            platform,
            timestamp: Number.isNaN(timestamp.getTime()) ? new Date() : timestamp,
          });
          break;
        }
        case 'status': {
          if (data.status === 'connected' || data.status === 'offline' || data.status === 'error') {
            this.onStatusCallback(data.status);
          }
          break;
        }
        case 'pong': {
          if (this.pingTimeout) {
            clearTimeout(this.pingTimeout);
            this.pingTimeout = null;
          }
          break;
        }
      }
    } catch (e) {
      console.error('[FollowerGoal] Failed to parse WebSocket message:', e);
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({ type: 'ping' }));
          this.pingTimeout = setTimeout(() => {
            console.warn('[FollowerGoal] Heartbeat timed out, reconnecting...');
            this.ws?.close();
          }, HEARTBEAT_TIMEOUT_MS);
        } catch {
          this.ws?.close();
        }
      }
    }, HEARTBEAT_IDLE_MS);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.pingTimeout) {
      clearTimeout(this.pingTimeout);
      this.pingTimeout = null;
    }
  }

  private scheduleReconnect() {
    if (this.disposed || this.reconnectTimer) return;
    this.reconnectAttempts++;
    const delay = Math.min(
      MAX_RECONNECT_DELAY_MS,
      1000 * 2 ** (this.reconnectAttempts - 1) + Math.random() * 1000,
    );
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  public disconnect() {
    this.disposed = true;
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }
  }
}
