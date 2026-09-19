import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeWebSocket } from '#/test/browser';
import type { PollChatEvent } from './poll-chat';
import { TwitchPollSource } from './poll-sources';

beforeEach(() => {
  FakeWebSocket.instances = [];
  vi.stubGlobal('WebSocket', FakeWebSocket);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('TwitchPollSource', () => {
  it('joins again on a new connection right away when Twitch announces a RECONNECT', () => {
    const events: PollChatEvent[] = [];
    const source = new TwitchPollSource('streamer', (event) => events.push(event));
    const [first] = FakeWebSocket.instances;
    first.open();
    first.receive(':tmi.twitch.tv RECONNECT');
    expect(FakeWebSocket.instances).toHaveLength(2);

    const second = FakeWebSocket.instances[1];
    second.open();
    expect(second.sent).toContain('JOIN #streamer');
    second.receive('@badges=;display-name=Fan;room-id=1 :fan!fan@fan.tmi.twitch.tv PRIVMSG #streamer :2');
    expect(events).toMatchObject([{ kind: 'message', login: 'fan', text: '2' }]);
    source.disconnect();
  });
});
