import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeWebSocket } from '#/test/browser';
import type { ChatConnectionStatus } from './basechat';
import { KickChat } from './kick';
import { TwitchChat } from './twitch';

let statuses: ChatConnectionStatus['state'][];
let client: TwitchChat | KickChat | null;

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  statuses = [];
  client = null;
});

afterEach(() => {
  client?.disconnect();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const latest = () => FakeWebSocket.instances[FakeWebSocket.instances.length - 1];

function connectTwitch() {
  const twitch = new TwitchChat('streamer', () => {});
  twitch.onStatus = (status) => statuses.push(status.state);
  client = twitch;
  latest().open();
  return twitch;
}

describe('chat connection heartbeat', () => {
  it('pings a quiet connection and replaces it when the ping goes unanswered', () => {
    connectTwitch();
    const socket = latest();

    vi.advanceTimersByTime(30_000);
    expect(socket.sent.at(-1)).toBe('PING :tmi.twitch.tv');

    // A dropped network sends no close event, only silence.
    vi.advanceTimersByTime(10_000);
    expect(statuses.at(-1)).toBe('reconnecting');
    expect(socket.onmessage).toBeNull();

    vi.advanceTimersByTime(1_000);
    expect(FakeWebSocket.instances).toHaveLength(2);
  });

  it('keeps a connection that answers the ping', () => {
    connectTwitch();
    const socket = latest();
    vi.advanceTimersByTime(30_000);
    socket.receive(':tmi.twitch.tv PONG tmi.twitch.tv :tmi.twitch.tv\r\n');
    vi.advanceTimersByTime(20_000);
    expect(statuses.at(-1)).toBe('connected');
    expect(FakeWebSocket.instances).toHaveLength(1);
  });

  it('never pings a busy connection', () => {
    connectTwitch();
    const socket = latest();
    for (let i = 0; i < 12; i++) {
      vi.advanceTimersByTime(10_000);
      socket.receive(':viewer!viewer@viewer.tmi.twitch.tv PRIVMSG #streamer :hi\r\n');
    }
    expect(socket.sent).not.toContain('PING :tmi.twitch.tv');
  });

  it('pings Kick with a pusher:ping event', () => {
    client = new KickChat('668', () => {});
    latest().open();
    vi.advanceTimersByTime(30_000);
    expect(JSON.parse(latest().sent.at(-1) ?? '')).toEqual({ event: 'pusher:ping', data: {} });
  });
});

describe('chat reconnects', () => {
  it('gives up on an attempt that hangs and tries again', () => {
    const twitch = new TwitchChat('streamer', () => {});
    twitch.onStatus = (status) => statuses.push(status.state);
    client = twitch;

    vi.advanceTimersByTime(10_000);
    expect(statuses).toEqual(['reconnecting']);
    vi.advanceTimersByTime(1_000);
    expect(FakeWebSocket.instances).toHaveLength(2);
  });

  it('drops the socket when the browser goes offline and retries at once when it is back', () => {
    connectTwitch();
    window.dispatchEvent(new Event('offline'));
    expect(statuses.at(-1)).toBe('reconnecting');

    // Several failed attempts grow the wait to 8s...
    for (const delay of [1_000, 2_000, 4_000]) {
      vi.advanceTimersByTime(delay);
      latest().onclose?.(new CloseEvent('close'));
    }
    const attempts = FakeWebSocket.instances.length;

    // ...but the network coming back doesn't sit it out.
    window.dispatchEvent(new Event('online'));
    expect(FakeWebSocket.instances).toHaveLength(attempts + 1);
    expect(statuses.at(-1)).toBe('connecting');
  });

  it('checks an open socket when the network comes back', () => {
    connectTwitch();
    window.dispatchEvent(new Event('online'));
    expect(latest().sent.at(-1)).toBe('PING :tmi.twitch.tv');
  });

  it('skips the wait when asked, and only while waiting', () => {
    const twitch = connectTwitch();
    twitch.reconnectNow();
    expect(FakeWebSocket.instances).toHaveLength(1);

    latest().onclose?.(new CloseEvent('close'));
    twitch.reconnectNow();
    expect(FakeWebSocket.instances).toHaveLength(2);
  });

  it('waits twice as long after each failed attempt, up to 30s, and starts over once connected', () => {
    connectTwitch();
    const waits: number[] = [];
    for (let i = 0; i < 7; i++) {
      const before = FakeWebSocket.instances.length;
      latest().onclose?.(new CloseEvent('close'));
      let waited = 0;
      while (FakeWebSocket.instances.length === before) {
        vi.advanceTimersByTime(500);
        waited += 500;
      }
      waits.push(waited);
    }
    expect(waits).toEqual([1_000, 2_000, 4_000, 8_000, 16_000, 30_000, 30_000]);

    latest().open();
    const before = FakeWebSocket.instances.length;
    latest().onclose?.(new CloseEvent('close'));
    vi.advanceTimersByTime(1_000);
    expect(FakeWebSocket.instances).toHaveLength(before + 1);
  });

  it('never keeps two sockets alive, whatever order drops, pings and network events come in', () => {
    connectTwitch();
    const live = () =>
      FakeWebSocket.instances.filter(
        (ws) => ws.onmessage !== null && ws.readyState !== FakeWebSocket.CLOSED,
      );
    const is = (state: number) => latest().readyState === state;
    const steps = [
      () => is(FakeWebSocket.CONNECTING) && latest().open(),
      () => {
        if (is(FakeWebSocket.CLOSED)) return;
        latest().readyState = FakeWebSocket.CLOSED;
        latest().onclose?.(new CloseEvent('close'));
      },
      () => window.dispatchEvent(new Event('offline')),
      () => window.dispatchEvent(new Event('online')),
      () => is(FakeWebSocket.OPEN) && latest().receive(':tmi.twitch.tv RECONNECT\r\n'),
      () => vi.advanceTimersByTime(12_000),
      () => vi.advanceTimersByTime(45_000),
    ];
    let seed = 7;
    for (let i = 0; i < 300; i++) {
      seed = (seed * 16807) % 2147483647;
      steps[seed % steps.length]();
      expect(live().length).toBeLessThanOrEqual(1);
    }
  });

  it('opens a single new socket when an error is followed by a close', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    connectTwitch();
    latest().onerror?.(new Event('error'));
    latest().onclose?.(new CloseEvent('close'));
    vi.advanceTimersByTime(1_500);
    expect(FakeWebSocket.instances).toHaveLength(2);
  });

  it('ignores what a replaced socket still delivers', () => {
    const received: string[] = [];
    client = new TwitchChat('streamer', (m) => received.push(m.message));
    const first = latest();
    first.open();
    const onmessage = first.onmessage;
    first.receive(':tmi.twitch.tv RECONNECT\r\n');
    onmessage?.(new MessageEvent('message', { data: ':v!v@v PRIVMSG #streamer :late\r\n' }));
    expect(received).toEqual([]);
  });

  it('closes an attempt still opening on disconnect, and never opens another', () => {
    const twitch = new TwitchChat('streamer', () => {});
    const socket = latest();
    twitch.disconnect();
    expect(socket.readyState).toBe(FakeWebSocket.CLOSED);
    expect(socket.onopen).toBeNull();
    vi.advanceTimersByTime(60_000);
    expect(FakeWebSocket.instances).toHaveLength(1);
  });

  it('can be disconnected twice', () => {
    const twitch = connectTwitch();
    twitch.disconnect();
    expect(() => twitch.disconnect()).not.toThrow();
  });

  it('reports each state it goes through', () => {
    connectTwitch();
    latest().onclose?.(new CloseEvent('close'));
    vi.advanceTimersByTime(1_000);
    latest().open();
    expect(statuses).toEqual(['connected', 'reconnecting', 'connecting', 'connected']);
  });

  it('stops everything on disconnect', () => {
    const twitch = connectTwitch();
    twitch.disconnect();
    window.dispatchEvent(new Event('online'));
    vi.advanceTimersByTime(60_000);
    expect(FakeWebSocket.instances).toHaveLength(1);
    expect(latest().sent).not.toContain('PING :tmi.twitch.tv');
  });
});
