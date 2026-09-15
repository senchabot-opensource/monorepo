import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeWebSocket } from '#/test/browser';
import type { SubathonEvent } from './subathon-events';
import { TwitchEventSource } from './subathon-sources';

beforeEach(() => {
  FakeWebSocket.instances = [];
  vi.stubGlobal('WebSocket', FakeWebSocket);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('TwitchEventSource', () => {
  it('joins again on a new connection right away when Twitch announces a RECONNECT', () => {
    const events: SubathonEvent[] = [];
    const source = new TwitchEventSource('streamer', (event) => events.push(event));
    const [first] = FakeWebSocket.instances;
    first.open();
    first.receive(':tmi.twitch.tv RECONNECT');
    expect(FakeWebSocket.instances).toHaveLength(2);

    const second = FakeWebSocket.instances[1];
    second.open();
    expect(second.sent).toContain('JOIN #streamer');
    second.receive(
      '@badges=;display-name=Fan;id=b1;room-id=1;bits=100 :fan!fan@fan.tmi.twitch.tv PRIVMSG #streamer :Cheer100',
    );
    expect(events).toMatchObject([{ kind: 'bits', name: 'Fan', amount: 100 }]);
    source.disconnect();
  });
});
