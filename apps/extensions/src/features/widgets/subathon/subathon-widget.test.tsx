import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_SUBATHON_SETTINGS, type SubathonSettings } from '#/lib/subathon-url';
import { SubathonWidget } from './subathon-widget';
import { storageKey } from './use-subathon';

const kickLookup = vi.hoisted(() => vi.fn());
vi.mock('#/lib/kick', () => ({ getKickChannelInfo: kickLookup }));

class FakeWebSocket {
  static OPEN = 1;
  static all: FakeWebSocket[] = [];
  readyState = 1;
  sent: string[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;
  constructor(readonly url: string) {
    FakeWebSocket.all.push(this);
  }
  send(data: string) {
    this.sent.push(data);
  }
  close() {}
}

// The newest one: an unanswered connect or heartbeat makes the client swap in a new socket.
const socket = (host: string) => {
  const found = [...FakeWebSocket.all].reverse().find((ws) => ws.url.includes(host));
  if (!found) throw new Error(`no ${host} socket`);
  return found;
};
const receive = (ws: FakeWebSocket, data: string) => act(() => ws.onmessage?.({ data }));
const pusher = (channel: string, event: string, data: unknown) =>
  receive(socket('pusher'), JSON.stringify({ event, channel, data: JSON.stringify(data) }));
const clock = () => screen.getByTestId('subathon').textContent ?? '';

const { platforms: _, ...DEFAULTS } = DEFAULT_SUBATHON_SETTINGS;
const settings = (overrides: Partial<SubathonSettings> = {}) => ({ ...DEFAULTS, ...overrides });

const SUB =
  '@display-name=Subber;login=subber;msg-id=sub;msg-param-sub-plan=1000 :tmi.twitch.tv USERNOTICE #streamer';
const MOD_SAYS = (text: string) =>
  `@badges=moderator/1;display-name=Mod;mod=1 :mod!mod@mod.tmi.twitch.tv PRIVMSG #streamer :${text}`;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));
  vi.stubGlobal('WebSocket', FakeWebSocket);
  vi.spyOn(console, 'log').mockImplementation(() => {});
  FakeWebSocket.all = [];
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('SubathonWidget', () => {
  it('waits paused at the starting time until a mod starts it', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings()} />);
    act(() => socket('twitch').onopen?.());
    expect(clock()).toContain('01:00:00');
    act(() => vi.advanceTimersByTime(60_000));
    expect(clock()).toContain('01:00:00');

    receive(socket('twitch'), MOD_SAYS('!subathon start'));
    act(() => vi.advanceTimersByTime(60_000));
    expect(clock()).toContain('00:59:00');
  });

  it('adds the sub value, shows who it was from and saves the clock', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ sub: 300 })} />);
    receive(socket('twitch'), SUB);
    expect(clock()).toContain('01:05:00');
    expect(clock()).toContain('+5:00');
    expect(clock()).toContain('Subber');

    const saved = JSON.parse(localStorage.getItem(storageKey('streamer')) ?? 'null');
    expect(saved).toMatchObject({ left: 3_900_000, peak: 3_900_000 });
  });

  it('comes back from a reload with the saved time', () => {
    const { unmount } = render(
      <SubathonWidget twitchChannel="streamer" settings={settings({ autostart: true })} />,
    );
    act(() => vi.advanceTimersByTime(10 * 60_000));
    unmount();
    vi.setSystemTime(Date.now() + 5 * 60_000);

    render(<SubathonWidget twitchChannel="streamer" settings={settings({ autostart: true })} />);
    expect(clock()).toContain('00:45:00');
  });

  it('follows a changed starting time while the clock is untouched', () => {
    const { unmount } = render(<SubathonWidget twitchChannel="streamer" settings={settings()} />);
    unmount();
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ start: 7200 })} />);
    expect(clock()).toContain('02:00:00');
  });

  it('keeps time added before the start when the starting time changes', () => {
    const { unmount } = render(<SubathonWidget twitchChannel="streamer" settings={settings()} />);
    receive(socket('twitch'), SUB);
    unmount();
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ start: 7200 })} />);
    expect(clock()).toContain('02:01:00');
  });

  it('shows no added time when the cap lets none through', () => {
    render(
      <SubathonWidget twitchChannel="streamer" settings={settings({ start: 3600, cap: 3600 })} />,
    );
    receive(socket('twitch'), SUB);
    expect(clock()).toContain('01:00:00');
    expect(clock()).not.toContain('+1:00');
  });

  it('stops taking subs at zero until a mod adds time', () => {
    render(
      <SubathonWidget
        twitchChannel="streamer"
        settings={settings({ start: 60, autostart: true })}
      />,
    );
    act(() => vi.advanceTimersByTime(61_000));
    expect(clock()).toContain('K.O.');
    receive(socket('twitch'), SUB);
    expect(clock()).toContain('00:00:00');

    receive(socket('twitch'), MOD_SAYS('!subathon add 10m'));
    expect(clock()).toContain('00:10:00');
    expect(clock()).not.toContain('K.O.');
  });

  it('listens to Kick subs, gifts and Kicks on the channels kick.com uses', () => {
    render(
      <SubathonWidget
        kickChannel="kicker"
        kickIds={{ chatroomId: '42', channelId: '7' }}
        settings={settings({ sub: 60, gift: 60, bits: 30 })}
      />,
    );
    act(() => socket('pusher').onopen?.());
    const channels = socket('pusher').sent.map((s) => JSON.parse(s).data.channel);
    expect(channels).toEqual(['chatrooms.42.v2', 'chatroom_42', 'channel_7']);

    pusher('channel_7', 'App\\Events\\ChannelSubscriptionEvent', {
      username: 'Fan',
      user_ids: [1],
    });
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'Fan', months: 1 });
    expect(clock()).toContain('01:01:00');

    pusher('chatroom_42', 'GiftedSubscriptionsEvent', {
      gifter_username: 'Gifter',
      gifted_usernames: ['a', 'b', 'c'],
      gifted_total: 3,
      chunk_details: null,
    });
    expect(clock()).toContain('01:04:00');

    pusher('channel_7', 'KicksGifted', {
      gift_transaction_id: 't1',
      sender: { username: 'Kicker' },
      gift: { amount: 200 },
    });
    expect(clock()).toContain('01:05:00');
  });

  it('keeps looking the Kick channel up until kick.com answers', async () => {
    const missing = { chatroomId: null, channelId: null, userId: null, subscriberBadges: [] };
    kickLookup
      .mockResolvedValueOnce(missing)
      .mockResolvedValue({ ...missing, chatroomId: '42', channelId: '7' });
    render(<SubathonWidget kickChannel="kicker" settings={settings()} />);
    await act(async () => {});
    expect(FakeWebSocket.all).toHaveLength(0);

    await act(async () => vi.advanceTimersByTime(5_000));
    expect(kickLookup).toHaveBeenCalledTimes(2);
    act(() => socket('pusher').onopen?.());
    expect(socket('pusher').sent.map((s) => JSON.parse(s).data.channel)).toContain('channel_7');
  });

  it('flashes when time is added to a full bar', () => {
    const { container } = render(<SubathonWidget twitchChannel="streamer" settings={settings()} />);
    expect(container.querySelector('[style*="sa-flash"]')).toBeNull();
    receive(socket('twitch'), SUB);
    expect(clock()).toContain('100%');
    expect(container.querySelector('[style*="sa-flash"]')).not.toBeNull();
    act(() => vi.advanceTimersByTime(1_000));
    expect(container.querySelector('[style*="sa-flash"]')).toBeNull();
  });

  it('skips events whose value is turned off, and the cap holds', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ sub: 0, cap: 3700 })} />);
    receive(socket('twitch'), SUB);
    expect(clock()).toContain('01:00:00');
    receive(socket('twitch'), MOD_SAYS('!subathon add 1h'));
    expect(clock()).toContain('01:01:40');
  });

  it('never connects or saves in a preview', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings()} simulate />);
    expect(FakeWebSocket.all).toHaveLength(0);
    act(() => vi.advanceTimersByTime(10_000));
    expect(localStorage.getItem(storageKey('streamer'))).toBeNull();
  });
});
