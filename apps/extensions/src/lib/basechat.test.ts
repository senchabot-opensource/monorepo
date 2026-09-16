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

  it('stops everything on disconnect', () => {
    const twitch = connectTwitch();
    twitch.disconnect();
    window.dispatchEvent(new Event('online'));
    vi.advanceTimersByTime(60_000);
    expect(FakeWebSocket.instances).toHaveLength(1);
    expect(latest().sent).not.toContain('PING :tmi.twitch.tv');
  });
});
