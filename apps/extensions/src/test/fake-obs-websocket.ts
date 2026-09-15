type Handler = (...args: unknown[]) => void;

/**
 * Stand-in for obs-websocket-js's OBSWebSocket: `connect()` stays pending until the test
 * calls `accept()` or `refuse()`, and `emit()` fires the library's events.
 */
export class OBSWebSocket {
  static instances: OBSWebSocket[] = [];

  /** Scene names top to bottom, as OBS's Scenes dock lists them. */
  scenes: string[] = [];
  connectArgs: unknown[][] = [];
  calls: [request: string, data: unknown][] = [];
  /** Requests other than GetSceneList never get an answer, like when OBS goes away mid-request. */
  holdCalls = false;
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

  once(event: string, handler: Handler) {
    const wrapper: Handler = (...args) => {
      this.off(event, handler);
      handler(...args);
    };
    this.on(event, Object.assign(wrapper, { original: handler }));
  }

  off(event: string, handler: Handler) {
    const kept = (this.handlers.get(event) ?? []).filter(
      (h) => h !== handler && (h as { original?: Handler }).original !== handler,
    );
    this.handlers.set(event, kept);
  }

  listenerCount(event: string) {
    return this.handlers.get(event)?.length ?? 0;
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

  /** Rejects like obs-websocket-js in a browser: the close code, 1006 when nothing answered. */
  refuse(code = 1006, reason = '') {
    this.pending?.reject(Object.assign(new Error(reason), { code }));
    this.pending = null;
  }

  async call(request: string, data?: unknown) {
    this.calls.push([request, data]);
    if (request === 'GetSceneList') {
      // Like obs-websocket 5 (Obs_ArrayHelper.cpp): bottom to top, sceneIndex 0 the bottom scene.
      const count = this.scenes.length;
      const scenes = this.scenes.map((sceneName, i) => ({ sceneName, sceneIndex: count - 1 - i }));
      return { scenes: scenes.reverse() };
    }
    if (this.holdCalls) return new Promise<never>(() => {});
    return {};
  }

  async disconnect() {}
}
