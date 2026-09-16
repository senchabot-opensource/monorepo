import type { ChatMessagesType } from "#/features/widgets/chat-widget/chat-messages";

export type ChatMessageCallback = (message: ChatMessagesType) => void;
export type DeleteMessageCallback = (id: string) => void;
export type BanUserCallback = (usernameLower: string) => void;
export type ClearAllCallback = () => void;

export type Disconnectable = {
  disconnect: () => void;
};

const MAX_RECONNECT_DELAY_MS = 30000;
// A dropped network doesn't always close the socket: Pusher checks liveness with protocol-level
// pings the page never sees, and Twitch only pings every few minutes. So after this much silence
// the client asks for a reply itself, and a socket that stays silent through the wait is replaced.
const HEARTBEAT_IDLE_MS = 30000;
const HEARTBEAT_TIMEOUT_MS = 10000;
const HEARTBEAT_CHECK_MS = 5000;
// With the router up but no internet, an attempt can hang for minutes before it fails.
const CONNECT_TIMEOUT_MS = 10000;

export type ChatConnectionStatus =
  | { state: "connecting" | "connected" }
  | { state: "reconnecting"; retryAt: number };

export class BaseChatClient implements Disconnectable {
  protected ws: WebSocket | null = null;

  private url: string | null = null;
  private handlers: {
    onOpen?: () => void;
    onMessage: (event: MessageEvent) => void;
  } | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private disposed = false;
  private connectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private lastFrameAt = 0;
  private pingSentAt: number | null = null;

  /** Connection state for pages that show it (the OBS Bridge tool); set after construction. */
  onStatus?: (status: ChatConnectionStatus) => void;

  constructor(
    private readonly label: string,
    protected readonly onMessageCallback: ChatMessageCallback,
    protected readonly onDeleteMessageCallback: DeleteMessageCallback = () => {},
    protected readonly onBanUserCallback: BanUserCallback = () => {},
    protected readonly onClearAllCallback: ClearAllCallback = () => {},
  ) {}

  /** A frame the server always answers, sent to check a quiet connection. */
  protected pingFrame(): string | null {
    return null;
  }

  protected connect(
    url: string,
    handlers: {
      onOpen?: () => void;
      onMessage: (event: MessageEvent) => void;
    },
  ) {
    this.url = url;
    this.handlers = handlers;
    this.disposed = false;
    if (typeof window !== "undefined") {
      window.addEventListener("online", this.handleOnline);
      window.addEventListener("offline", this.handleOffline);
    }
    this.openSocket();
  }

  private openSocket() {
    if (this.disposed || !this.url || !this.handlers) {
      return;
    }

    this.onStatus?.({ state: "connecting" });
    const ws = new WebSocket(this.url);
    this.ws = ws;
    const handlers = this.handlers;
    this.connectTimer = setTimeout(() => {
      this.connectTimer = null;
      if (ws === this.ws) {
        console.log(`${this.label} chat connection timed out.`);
        this.dropSocket();
      }
    }, CONNECT_TIMEOUT_MS);

    ws.onopen = () => {
      if (this.disposed || ws !== this.ws) {
        return;
      }
      this.clearConnectTimer();
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.onStatus?.({ state: "connected" });
      handlers.onOpen?.();
      console.log(`${this.label} chat connected.`);
    };

    ws.onmessage = event => {
      if (this.disposed || ws !== this.ws) {
        return;
      }
      this.lastFrameAt = Date.now();
      this.pingSentAt = null;
      handlers.onMessage(event);
    };

    ws.onerror = error => {
      console.error(`${this.label} WebSocket Error:`, error);
    };

    ws.onclose = () => {
      console.log(`${this.label} chat connection closed.`);
      this.clearConnectTimer();
      this.stopHeartbeat();
      this.scheduleReconnect();
    };
  }

  private clearConnectTimer() {
    if (this.connectTimer !== null) {
      clearTimeout(this.connectTimer);
      this.connectTimer = null;
    }
  }

  private startHeartbeat() {
    const ping = this.pingFrame();
    if (!ping) {
      return;
    }
    this.stopHeartbeat();
    this.lastFrameAt = Date.now();
    this.pingSentAt = null;
    this.heartbeatTimer = setInterval(() => {
      const now = Date.now();
      // Measured from the ping, not from the last frame: a background tab runs this only about
      // once a minute, and a long gap between checks alone must not count as a dead socket.
      if (this.pingSentAt !== null) {
        if (now - this.pingSentAt >= HEARTBEAT_TIMEOUT_MS) {
          console.log(`${this.label} chat stopped answering.`);
          this.dropSocket();
        }
      } else if (now - this.lastFrameAt >= HEARTBEAT_IDLE_MS) {
        this.sendPing();
      }
    }, HEARTBEAT_CHECK_MS);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    this.pingSentAt = null;
  }

  private sendPing() {
    const ping = this.pingFrame();
    if (!ping || this.ws?.readyState !== WebSocket.OPEN) {
      return;
    }
    this.pingSentAt = Date.now();
    this.ws.send(ping);
  }

  /** Detaches the current socket without waiting for its close, which a dead link may never send. */
  private dropSocket() {
    this.clearConnectTimer();
    this.stopHeartbeat();
    const ws = this.ws;
    this.ws = null;
    if (ws) {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;
      ws.close();
    }
    this.scheduleReconnect();
  }

  private scheduleReconnect() {
    if (this.disposed || this.reconnectTimer !== null) {
      return;
    }

    const delay = Math.min(
      1000 * 2 ** this.reconnectAttempts,
      MAX_RECONNECT_DELAY_MS,
    );
    this.reconnectAttempts += 1;
    this.onStatus?.({ state: "reconnecting", retryAt: Date.now() + delay });
    console.log(
      `${this.label} chat disconnected, reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`,
    );
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.openSocket();
    }, delay);
  }

  /** Skips the wait before the next attempt; does nothing while a connection is up or opening. */
  reconnectNow() {
    if (this.disposed || this.reconnectTimer === null) {
      return;
    }
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.openSocket();
  }

  // Back online: retry at once instead of sitting out a backoff that grew during the outage, and
  // check a socket that looks open, since it may have died while the network was gone.
  private handleOnline = () => {
    this.reconnectAttempts = 0;
    if (this.reconnectTimer !== null) {
      this.reconnectNow();
    } else if (this.ws?.readyState === WebSocket.OPEN) {
      this.sendPing();
    }
  };

  private handleOffline = () => {
    if (this.ws) {
      this.dropSocket();
    }
  };

  protected emit(payload: ChatMessagesType | null) {
    if (payload) {
      this.onMessageCallback(payload);
    }
  }

  protected send(message: string) {
    this.ws?.send(message);
  }

  disconnect() {
    this.disposed = true;
    this.clearConnectTimer();
    this.stopHeartbeat();
    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.handleOnline);
      window.removeEventListener("offline", this.handleOffline);
    }
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    const ws = this.ws;
    this.ws = null;
    if (!ws) {
      return;
    }

    ws.onopen = null;
    ws.onmessage = null;
    ws.onerror = null;
    ws.onclose = null;
    ws.close();
    console.log(`${this.label} disconnected.`);
  }
}
