import { vi } from 'vitest';

/** Browser APIs jsdom lacks, installed fresh before every test by setup.ts. */

let reducedMotion = false;

/** Makes `(prefers-reduced-motion: reduce)` match for the rest of the test. */
export function setReducedMotion(value: boolean) {
  reducedMotion = value;
}

// The test device prefers dark, the theme site pages have without one stored.
let prefersDark = true;
const colorSchemeListeners = new Set<(event: MediaQueryListEvent) => void>();

/** Switches the device theme, live, like an OS that turns dark in the evening. */
export function setPrefersDark(value: boolean) {
  prefersDark = value;
  for (const listener of colorSchemeListeners) {
    listener({ matches: value, media: '(prefers-color-scheme: dark)' } as MediaQueryListEvent);
  }
}

function matchMedia(query: string): MediaQueryList {
  const colorScheme = query.includes('prefers-color-scheme');
  return {
    get matches() {
      if (query.includes('prefers-reduced-motion')) return reducedMotion;
      if (colorScheme) return query.includes('dark') ? prefersDark : !prefersDark;
      return false;
    },
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      if (colorScheme) colorSchemeListeners.add(listener);
    },
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      colorSchemeListeners.delete(listener);
    },
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList;
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
 * Gives every element this size, since jsdom lays nothing out: scaled previews only mount once
 * they have room to scale into. vi.restoreAllMocks() puts the real getters back.
 */
export function withLayout(width: number, height: number) {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(width);
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(height);
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
  prefersDark = true;
  colorSchemeListeners.clear();
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
