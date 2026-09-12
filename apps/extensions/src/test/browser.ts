import { vi } from 'vitest';

/** Browser APIs jsdom lacks, installed fresh before every test by setup.ts. */

let reducedMotion = false;

/** Makes `(prefers-reduced-motion: reduce)` match for the rest of the test. */
export function setReducedMotion(value: boolean) {
  reducedMotion = value;
}

function matchMedia(query: string): MediaQueryList {
  return {
    matches: query.includes('prefers-reduced-motion') ? reducedMotion : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  };
}

/** Reports every observed element as on screen, like a preview scrolled into view. */
class FakeIntersectionObserver {
  constructor(private callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

class FakeResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

/** Inert socket so nothing reaches Twitch or Kick; tests drive `instances` by hand. */
export class FakeWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;
  static instances: FakeWebSocket[] = [];

  readyState = FakeWebSocket.CONNECTING;
  sent: string[] = [];
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;

  constructor(readonly url: string) {
    FakeWebSocket.instances.push(this);
  }

  send(data: string) {
    this.sent.push(data);
  }

  close() {
    this.readyState = FakeWebSocket.CLOSED;
  }

  /** Opens the socket, running the client's onopen. */
  open() {
    this.readyState = FakeWebSocket.OPEN;
    this.onopen?.(new Event('open'));
  }

  /** Delivers one frame from the server. */
  receive(data: string) {
    this.onmessage?.(new MessageEvent('message', { data }));
  }
}

/**
 * In-memory clipboard. userEvent.setup() swaps in its own stub with the same two methods, so
 * tests read what was copied with navigator.clipboard.readText() either way.
 */
function createClipboard() {
  let text = '';
  return {
    writeText: async (value: string) => {
      text = value;
    },
    readText: async () => text,
  };
}

export function resetBrowserStubs() {
  reducedMotion = false;
  FakeWebSocket.instances = [];

  window.matchMedia = matchMedia;
  // user-event escapes radio group names with it to walk them with the arrow keys.
  globalThis.CSS ??= {
    escape: (value: string) => value.replace(/[^\w-]/g, (char) => `\\${char}`),
  } as typeof CSS;
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
  globalThis.IntersectionObserver =
    FakeIntersectionObserver as unknown as typeof IntersectionObserver;
  globalThis.ResizeObserver = FakeResizeObserver as unknown as typeof ResizeObserver;
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: createClipboard(),
  });
  // No network in tests: GitHub stars, emote and badge APIs all see a failed request.
  globalThis.fetch = vi.fn(async () => new Response('{}', { status: 503 }));

  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.open = false;
  };

  localStorage.clear();
  const html = document.documentElement;
  html.className = '';
  html.removeAttribute('style');
  html.lang = '';
}
