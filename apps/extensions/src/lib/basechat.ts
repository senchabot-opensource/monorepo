import type { ChatMessagesType } from "#/features/widgets/chat-widget/chat-messages";

export type ChatMessageCallback = (message: ChatMessagesType) => void;
export type DeleteMessageCallback = (id: string) => void;
export type BanUserCallback = (usernameLower: string) => void;
export type ClearAllCallback = () => void;

export type Disconnectable = {
  disconnect: () => void;
};

export class BaseChatClient implements Disconnectable {
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