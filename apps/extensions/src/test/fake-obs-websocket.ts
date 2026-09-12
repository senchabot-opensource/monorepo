type Handler = (...args: unknown[]) => void;

/**
 * Stand-in for obs-websocket-js's OBSWebSocket: `connect()` stays pending until the test
 * calls `accept()` or `refuse()`, and `emit()` fires the library's events.
 */
export class OBSWebSocket {
  static instances: OBSWebSocket[] = [];

  /** Scene names GetSceneList answers with. */
  scenes: string[] = [];
  connectArgs: unknown[][] = [];
  calls: [request: string, data: unknown][] = [];
  private handlers = new Map<string, Handler[]>();
  private pending: { resolve: () => void; reject: (error: Error) => void } | null = null;

  constructor() {
    OBSWebSocket.instances.push(this);
  }

  static get latest(): OBSWebSocket {
    const obs = OBSWebSocket.instances.at(-1);
    if (!obs) throw new Error('No OBSWebSocket was created');
    return obs;
  }

  on(event: string, handler: Handler) {
    this.handlers.set(event, [...(this.handlers.get(event) ?? []), handler]);
  }

  emit(event: string, ...args: unknown[]) {
    for (const handler of this.handlers.get(event) ?? []) handler(...args);
  }

  connect(...args: unknown[]) {
    this.connectArgs.push(args);
    return new Promise<void>((resolve, reject) => {
      this.pending = { resolve, reject };
    });
  }

  /** OBS accepts the connection and identifies, like obs-websocket 5 does. */
  accept() {
    this.pending?.resolve();
    this.pending = null;
  }

  refuse() {
    this.pending?.reject(new Error('connection refused'));
    this.pending = null;
  }

  async call(request: string, data?: unknown) {
    this.calls.push([request, data]);
    if (request === 'GetSceneList') {
      return { scenes: this.scenes.map((sceneName) => ({ sceneName })) };
    }
    return {};
  }

  async disconnect() {}
}
