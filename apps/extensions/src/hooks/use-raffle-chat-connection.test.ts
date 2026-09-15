import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getKickChannelInfo } from '#/lib/kick';
import { FakeWebSocket } from '#/test/browser';
import type { RaffleConfig } from '#/types/raffle';
import { useRaffleChat } from './use-raffle-chat';

vi.mock('#/lib/kick', async (importOriginal) => ({
  ...(await importOriginal<typeof import('#/lib/kick')>()),
  getKickChannelInfo: vi.fn(),
}));

const baseConfig: RaffleConfig = {
  platform: 'twitch',
  channel: 'Streamer',
  keyword: '!join',
  subscribersOnly: false,
  minSubMonths: 1,
  maxWinsPerUser: 1,
  minRaffleDurationSec: 0,
};

const latest = () => FakeWebSocket.instances[FakeWebSocket.instances.length - 1];
const twitchJoin = (name: string) =>
  `@badge-info=subscriber/5;badges=subscriber/3;display-name=${name};subscriber=1 :${name.toLowerCase()}!v@v.tmi.twitch.tv PRIVMSG #streamer :!join me\r\n`;

let onParticipant: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  onParticipant = vi.fn();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const renderRaffleChat = (config: Partial<RaffleConfig> = {}) =>
  renderHook(() => useRaffleChat({ ...baseConfig, ...config }, onParticipant, true));

describe('useRaffleChat on Twitch', () => {
  it('joins the channel anonymously and turns a keyword message into a participant', () => {
    renderRaffleChat();
    const socket = latest();
    expect(socket.url).toBe('wss://irc-ws.chat.twitch.tv:443');
    socket.open();
    expect(socket.sent).toEqual([
      'CAP REQ :twitch.tv/tags twitch.tv/commands',
      'PASS SCHMOOPIIE',
      expect.stringMatching(/^NICK justinfan\d+$/),
      'JOIN #streamer',
    ]);

    socket.receive(
      `${twitchJoin('Viewer')}:nightbot!n@n.tmi.twitch.tv PRIVMSG #streamer :!join\r\n:other!o@o.tmi.twitch.tv PRIVMSG #streamer :hello\r\n`,
    );
    expect(onParticipant).toHaveBeenCalledTimes(1);
    expect(onParticipant).toHaveBeenCalledWith({
      id: 'twitch-viewer',
      username: 'viewer',
      displayName: 'Viewer',
      platform: 'twitch',
      subMonths: 5,
      timestamp: expect.any(Number),
    });
  });

  it('answers a server PING', () => {
    renderRaffleChat();
    latest().open();
    latest().receive('PING :tmi.twitch.tv\r\n');
    expect(latest().sent.at(-1)).toBe('PONG');
  });

  it('opens a new socket right away when Twitch sends RECONNECT, and keeps reading', () => {
    renderRaffleChat();
    const old = latest();
    old.open();
    old.receive(':tmi.twitch.tv RECONNECT\r\n');

    expect(FakeWebSocket.instances).toHaveLength(2);
    expect(old.onmessage).toBeNull();

    latest().open();
    expect(latest().sent.at(-1)).toBe('JOIN #streamer');
    latest().receive(twitchJoin('Viewer'));
    expect(onParticipant).toHaveBeenCalledTimes(1);
  });

  it('keeps retrying through a long outage', () => {
    renderRaffleChat();
    // The old reader gave up for good after 10 retries, about three minutes of outage.
    for (let failures = 1; failures <= 12; failures++) {
      latest().onclose?.(new CloseEvent('close'));
      vi.runOnlyPendingTimers();
      expect(FakeWebSocket.instances).toHaveLength(failures + 1);
    }

    latest().open();
    latest().receive(twitchJoin('Viewer'));
    expect(onParticipant).toHaveBeenCalledTimes(1);
  });

  it('pings a quiet connection and replaces it when the ping goes unanswered', () => {
    renderRaffleChat();
    const socket = latest();
    socket.open();

    vi.advanceTimersByTime(30_000);
    expect(socket.sent.at(-1)).toBe('PING :tmi.twitch.tv');

    // A dropped network sends no close event, only silence.
    vi.advanceTimersByTime(11_000);
    expect(FakeWebSocket.instances).toHaveLength(2);
  });

  it('stops reconnecting once unmounted', () => {
    const { unmount } = renderRaffleChat();
    latest().open();
    unmount();

    window.dispatchEvent(new Event('online'));
    vi.advanceTimersByTime(120_000);
    expect(FakeWebSocket.instances).toHaveLength(1);
    expect(latest().onmessage).toBeNull();
  });
});

describe('useRaffleChat on Kick', () => {
  const kickChat = (content: string, username = 'Viewer') =>
    JSON.stringify({
      event: 'App\\Events\\ChatMessageEvent',
      data: JSON.stringify({
        id: 'm1',
        chatroom_id: 668,
        content,
        type: 'message',
        created_at: '2026-09-15T12:00:00+00:00',
        sender: {
          id: 1,
          username,
          slug: username.toLowerCase(),
          identity: {
            color: '#FF0000',
            badges: [{ type: 'subscriber', text: 'Subscriber', count: 4 }],
          },
        },
      }),
      channel: 'chatrooms.668.v2',
    });

  it('subscribes to a numeric chatroom and turns a keyword message into a participant', () => {
    renderRaffleChat({ platform: 'kick', channel: '668' });
    const socket = latest();
    expect(socket.url).toContain('wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679');
    socket.open();
    expect(JSON.parse(socket.sent[0])).toEqual({
      event: 'pusher:subscribe',
      data: { channel: 'chatrooms.668.v2' },
    });

    socket.receive(kickChat('!join'));
    socket.receive(kickChat('!join', 'BotRix'));
    socket.receive(kickChat('hello'));
    expect(onParticipant).toHaveBeenCalledTimes(1);
    expect(onParticipant).toHaveBeenCalledWith({
      id: 'kick-viewer',
      username: 'viewer',
      displayName: 'Viewer',
      platform: 'kick',
      subMonths: 4,
      timestamp: expect.any(Number),
    });
    expect(getKickChannelInfo).not.toHaveBeenCalled();
  });

  it('resolves a channel name to its chatroom first', async () => {
    vi.mocked(getKickChannelInfo).mockResolvedValue({
      chatroomId: '668',
      channelId: '1',
      userId: '2',
      subscriberBadges: [],
      notFound: false,
    });
    renderRaffleChat({ platform: 'kick', channel: 'streamer' });
    await act(async () => {});

    expect(getKickChannelInfo).toHaveBeenCalledWith('streamer');
    latest().open();
    expect(JSON.parse(latest().sent[0]).data.channel).toBe('chatrooms.668.v2');
  });

  it('keeps looking the channel up while kick.com fails, then reads its chat', async () => {
    const failed = { chatroomId: null, channelId: null, userId: null, subscriberBadges: [] };
    vi.mocked(getKickChannelInfo)
      .mockReset()
      .mockResolvedValueOnce({ ...failed, notFound: false })
      .mockResolvedValue({ ...failed, chatroomId: '668', notFound: false });
    const sockets = FakeWebSocket.instances.length;
    renderRaffleChat({ platform: 'kick', channel: 'streamer' });
    await act(async () => {});
    expect(FakeWebSocket.instances).toHaveLength(sockets);

    await act(async () => vi.advanceTimersByTime(5_000));
    latest().open();
    expect(JSON.parse(latest().sent[0]).data.channel).toBe('chatrooms.668.v2');
  });

  it('pings a quiet connection with pusher:ping', () => {
    renderRaffleChat({ platform: 'kick', channel: '668' });
    latest().open();
    vi.advanceTimersByTime(30_000);
    expect(JSON.parse(latest().sent.at(-1) ?? '')).toEqual({ event: 'pusher:ping', data: {} });
  });

  it('keeps retrying through a long outage', () => {
    renderRaffleChat({ platform: 'kick', channel: '668' });
    for (let failures = 1; failures <= 12; failures++) {
      latest().onclose?.(new CloseEvent('close'));
      vi.runOnlyPendingTimers();
      expect(FakeWebSocket.instances).toHaveLength(failures + 1);
    }
  });
});
