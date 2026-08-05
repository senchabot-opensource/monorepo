import type { ChatMessagesType } from "#/features/widgets/chat-widget/chat-messages";

export type ChatMessageCallback = (message: ChatMessagesType) => void;
export type DeleteMessageCallback = (id: string) => void;
export type BanUserCallback = (usernameLower: string) => void;
export type ClearAllCallback = () => void;

export type Disconnectable = {
  disconnect: () => void;
};

const MAX_RECONNECT_DELAY_MS = 30000;

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
    this.url = url;
    this.handlers = handlers;
    this.disposed = false;
    this.openSocket();
  }

  private openSocket() {
    if (this.disposed || !this.url || !this.handlers) {
      return;
    }

    const ws = new WebSocket(this.url);
    this.ws = ws;
    const handlers = this.handlers;

    ws.onopen = () => {
      if (this.disposed || ws !== this.ws) {
        return;
      }
      this.reconnectAttempts = 0;
      handlers.onOpen?.();
      console.log(`${this.label} chat connected.`);
    };

    ws.onmessage = event => {
      if (this.disposed || ws !== this.ws) {
        return;
      }
      handlers.onMessage(event);
    };

    ws.onerror = error => {
      console.error(`${this.label} WebSocket Error:`, error);
    };

    ws.onclose = () => {
      console.log(`${this.label} chat connection closed.`);
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect() {
    if (this.disposed) {
      return;
    }

    const delay = Math.min(
      1000 * 2 ** this.reconnectAttempts,
      MAX_RECONNECT_DELAY_MS,
    );
    this.reconnectAttempts += 1;
    console.log(
      `${this.label} chat disconnected, reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`,
    );
    this.reconnectTimer = setTimeout(() => this.openSocket(), delay);
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
    this.disposed = true;
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
