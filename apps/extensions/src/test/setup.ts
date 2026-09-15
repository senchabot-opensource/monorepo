import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { FakeWebSocket, resetBrowserStubs } from './browser';

// The alerts route pulls in a Cloudflare server function, and the route tree imports every route.
vi.mock('#/lib/pusher-auth', () => ({ pusherAuth: vi.fn() }));
// Vitest resolves the root route's `?url` stylesheet import to "", which React warns about.
vi.mock('../styles.css?url', () => ({ default: '/styles.css' }));

// Testing Library drains a setTimeout(0) after every user-event action and only advances it
// under fake timers when it finds `jest`, so with Vitest's fake timers it would wait forever.
Object.assign(globalThis, { jest: { advanceTimersByTime: vi.advanceTimersByTime } });

// Tests that stub their own WebSocket and call vi.unstubAllGlobals() get this one back.
globalThis.WebSocket = FakeWebSocket as unknown as typeof WebSocket;

beforeEach(() => {
  resetBrowserStubs();
});

afterEach(() => {
  cleanup();
});
