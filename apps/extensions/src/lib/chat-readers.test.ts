import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeWebSocket } from '#/test/browser';
import { KickPusherReader, kickChatroomChannel, TwitchIrcReader } from './chat-readers';
import type { IrcLine } from './twitch';

let reader: { disconnect: () => void } | null;

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  reader = null;
});

afterEach(() => {
  reader?.disconnect();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const latest = () => FakeWebSocket.instances[FakeWebSocket.instances.length - 1];

describe('TwitchIrcReader', () => {
  const lines: IrcLine[] = [];
  const open = (channel = ' Streamer ') => {
    lines.length = 0;
    reader = new TwitchIrcReader(
      channel,
      (line) => (line.command === 'PRIVMSG' ? line : null),
      (line) => lines.push(line),
    );
    latest().open();
  };

  it('joins the channel lowercased and trimmed', () => {
    open();
    expect(latest().sent.at(-1)).toBe('JOIN #streamer');
  });

  it('passes each line of a frame to the parser and drops what it returns null for', () => {
    open();
    latest().receive(
      '@id=1 :a!a@a PRIVMSG #streamer :one\r\n@room-id=1 :tmi.twitch.tv ROOMSTATE #streamer\r\n@id=2 :b!b@b PRIVMSG #streamer :two\r\n',
    );
    expect(lines.map((l) => l.params[1])).toEqual(['one', 'two']);
  });

  it('answers PING itself', () => {
    open();
    latest().receive('PING :tmi.twitch.tv\r\n');
    expect(latest().sent.at(-1)).toBe('PONG');
  });

  it('moves to a new connection on RECONNECT and joins again there', () => {
    open();
    const first = latest();
    first.receive(':tmi.twitch.tv RECONNECT\r\n@id=3 :a!a@a PRIVMSG #streamer :stale\r\n');
    expect(lines).toEqual([]);
    expect(latest()).not.toBe(first);
    expect(first.onmessage).toBeNull();
    latest().open();
    expect(latest().sent.at(-1)).toBe('JOIN #streamer');
  });

  it('joins again after a dropped connection comes back', () => {
    open();
    latest().onclose?.(new CloseEvent('close'));
    vi.advanceTimersByTime(1_000);
    latest().open();
    expect(FakeWebSocket.instances).toHaveLength(2);
    expect(latest().sent.at(-1)).toBe('JOIN #streamer');
  });
});

describe('KickPusherReader', () => {
  const events: [string, unknown][] = [];
  const open = (channels = [kickChatroomChannel('9'), 'channel_8']) => {
    events.length = 0;
    reader = new KickPusherReader(
      channels,
      (name, data) => (name.startsWith('App\\') ? ([name, data] as [string, unknown]) : null),
      (event) => events.push(event),
    );
    latest().open();
  };

  it('subscribes to every channel on each connection', () => {
    open();
    const subs = () => latest().sent.map((s) => JSON.parse(s).data.channel);
    expect(subs()).toEqual(['chatrooms.9.v2', 'channel_8']);
    latest().onclose?.(new CloseEvent('close'));
    vi.advanceTimersByTime(1_000);
    latest().open();
    expect(subs()).toEqual(['chatrooms.9.v2', 'channel_8']);
  });

  it('decodes the data string of an event, and takes an object as it is', () => {
    open();
    latest().receive(JSON.stringify({ event: 'App\\Events\\A', data: '{"x":1}' }));
    latest().receive(JSON.stringify({ event: 'App\\Events\\B', data: { y: 2 } }));
    expect(events).toEqual([
      ['App\\Events\\A', { x: 1 }],
      ['App\\Events\\B', { y: 2 }],
    ]);
  });

  it('ignores frames that are not JSON, or have no event name', () => {
    open();
    latest().receive('oops');
    latest().receive('null');
    latest().receive(JSON.stringify({ event: 'App\\Events\\C', data: '{bad' }));
    latest().receive(JSON.stringify({ data: '{}' }));
    expect(events).toEqual([]);
  });
});
