import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_STREAM_ALERTS_SETTINGS, type StreamAlertsSettings } from '#/lib/stream-alerts-url';
import { FakeWebSocket } from '#/test/browser';
import { renderWithProviders } from '#/test/render';
import { playAlertSound } from './alert-sound';
import { StreamAlertsWidget } from './stream-alerts-widget';
import { ALERT_GAP_MS, KICK_MONTHS_WAIT_MS, PREVIEW_CHANNEL } from './use-stream-alerts';

vi.mock('./alert-sound', () => ({ playAlertSound: vi.fn() }));

const kickLookup = vi.hoisted(() => vi.fn());
vi.mock('#/lib/kick', async (importOriginal) => ({
  ...(await importOriginal<typeof import('#/lib/kick')>()),
  getKickChannelInfo: kickLookup,
}));

const KICK_42 = { chatroomId: '42', channelId: '7', userId: null, subscriberBadges: [] };

// The newest one: an unanswered connect or heartbeat makes the client swap in a new socket.
const socket = (host: string) => {
  const found = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes(host));
  if (!found) throw new Error(`no ${host} socket`);
  return found;
};
const receive = (host: string, data: string) => act(() => socket(host).receive(data));
const pusher = (channel: string, event: string, data: unknown) =>
  receive('pusher', JSON.stringify({ event, channel, data: JSON.stringify(data) }));
// The widget needs the locale provider for its words.
const render = (ui: React.ReactNode) => renderWithProviders(ui, '/widgets/stream-alerts');
const alert = () => screen.queryByTestId('stream-alert');
const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms));

const { platforms: _, ...DEFAULTS } = DEFAULT_STREAM_ALERTS_SETTINGS;
const settings = (overrides: Partial<StreamAlertsSettings> = {}) => ({ ...DEFAULTS, ...overrides });
const DURATION_MS = DEFAULTS.duration * 1000;

const SUB = (name: string) =>
  `@display-name=${name};login=${name.toLowerCase()};msg-id=sub;msg-param-sub-plan=1000;room-id=1 :tmi.twitch.tv USERNOTICE #streamer`;
const bundle = (type: 'submysterygift' | 'subgift') =>
  `@display-name=Gifter;msg-id=${type};msg-param-community-gift-id=9;msg-param-mass-gift-count=3;msg-param-sub-plan=1000;room-id=1 :tmi.twitch.tv USERNOTICE #streamer`;
const CHEER =
  '@bits=100;display-name=Cheerer;room-id=1 :cheerer!cheerer@cheerer.tmi.twitch.tv PRIVMSG #streamer :Cheer100 love this';

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(KICK_42);
  vi.mocked(playAlertSound).mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('StreamAlertsWidget', () => {
  it('shows a Twitch sub with its heading and words, then clears it', async () => {
    await render(<StreamAlertsWidget twitchChannel="streamer" settings={settings()} />);
    act(() => socket('twitch').open());
    expect(alert()).toBeNull();

    receive('twitch', SUB('Subber'));
    expect(alert()?.dataset.kind).toBe('sub');
    expect(alert()?.textContent).toContain('Subber');
    expect(alert()?.textContent).toContain('just subscribed');
    expect(alert()?.textContent).toContain('New Subscriber');

    wait(DURATION_MS);
    expect(alert()).toBeNull();
  });

  it("shows a resub's months and the viewer's message", async () => {
    await render(<StreamAlertsWidget twitchChannel="streamer" settings={settings()} />);
    act(() => socket('twitch').open());
    receive(
      'twitch',
      '@display-name=Loyal;msg-id=resub;msg-param-cumulative-months=14;msg-param-sub-plan=1000;room-id=1 :tmi.twitch.tv USERNOTICE #streamer :still here',
    );
    expect(alert()?.textContent).toContain('subscribed for 14 months');
    expect(alert()?.textContent).toContain('still here');
  });

  it('shows alerts one at a time, in the order they came', async () => {
    await render(<StreamAlertsWidget twitchChannel="streamer" settings={settings()} />);
    act(() => socket('twitch').open());
    receive('twitch', SUB('First'));
    receive('twitch', SUB('Second'));
    expect(alert()?.textContent).toContain('First');

    wait(DURATION_MS);
    expect(alert()).toBeNull();
    wait(ALERT_GAP_MS);
    expect(alert()?.textContent).toContain('Second');
  });

  it('shows a gift bundle once, with its count', async () => {
    await render(<StreamAlertsWidget twitchChannel="streamer" settings={settings()} />);
    act(() => socket('twitch').open());
    receive('twitch', bundle('submysterygift'));
    for (let i = 0; i < 3; i++) receive('twitch', bundle('subgift'));
    expect(alert()?.textContent).toContain('gifted 3 subs');

    wait(DURATION_MS + ALERT_GAP_MS);
    expect(alert()).toBeNull();
  });

  it('skips alerts that are off or under their minimum', async () => {
    await render(
      <StreamAlertsWidget
        twitchChannel="streamer"
        settings={settings({ enabled: { ...DEFAULTS.enabled, sub: false }, minBits: 500 })}
      />,
    );
    act(() => socket('twitch').open());
    receive('twitch', SUB('Subber'));
    receive('twitch', CHEER);
    expect(alert()).toBeNull();
  });

  it("shows a cheer with the viewer's message, or without it when turned off", async () => {
    const { unmount } = await render(
      <StreamAlertsWidget twitchChannel="streamer" settings={settings()} />,
    );
    act(() => socket('twitch').open());
    receive('twitch', CHEER);
    expect(alert()?.textContent).toContain('cheered 100 Bits');
    expect(alert()?.textContent).toContain('love this');
    expect(alert()?.textContent).not.toContain('Cheer100');
    unmount();

    await render(
      <StreamAlertsWidget twitchChannel="streamer" settings={settings({ message: false })} />,
    );
    act(() => socket('twitch').open());
    receive('twitch', CHEER);
    expect(alert()?.textContent).not.toContain('love this');
  });

  it('shows a Kick raid and Kicks, tagged by platform when both are on', async () => {
    await render(
      <StreamAlertsWidget twitchChannel="streamer" kickChannel="kicker" settings={settings()} />,
    );
    act(() => socket('pusher').open());
    pusher('chatrooms.42.v2', 'App\\Events\\StreamHostEvent', {
      chatroom_id: 42,
      optional_message: '',
      number_viewers: 9,
      host_username: 'raider',
    });
    expect(alert()?.dataset.kind).toBe('raid');
    expect(alert()?.textContent).toContain('is raiding with 9 viewers');
    expect(alert()?.textContent).toContain('KICK');

    pusher('channel_7', 'KicksGifted', {
      gift_transaction_id: 't1',
      message: 'gg',
      sender: { username: 'Fan' },
      gift: { amount: 50 },
    });
    wait(DURATION_MS);
    wait(ALERT_GAP_MS);
    expect(alert()?.textContent).toContain('sent 50 Kicks');
  });

  it("waits a moment for a Kick sub's months, and shows it without them if none come", async () => {
    await render(<StreamAlertsWidget kickChannel="kicker" settings={settings()} />);
    act(() => socket('pusher').open());
    pusher('channel_7', 'App\\Events\\ChannelSubscriptionEvent', {
      username: 'Fan',
      user_ids: [1],
    });
    expect(alert()).toBeNull();
    wait(300);
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'Fan', months: 19 });
    expect(alert()?.textContent).toContain('subscribed for 19 months');
    wait(DURATION_MS);
    wait(ALERT_GAP_MS);

    pusher('channel_7', 'App\\Events\\ChannelSubscriptionEvent', {
      username: 'Quiet',
      user_ids: [2],
    });
    expect(alert()).toBeNull();
    wait(KICK_MONTHS_WAIT_MS);
    expect(alert()?.textContent).toContain('just subscribed');
    // Its months turning up after the wait don't make a second alert.
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'Quiet', months: 3 });
    wait(DURATION_MS);
    wait(ALERT_GAP_MS);
    expect(alert()).toBeNull();
  });

  it("shows a Kick resub shared in chat with its months and the viewer's text", async () => {
    await render(<StreamAlertsWidget kickChannel="kicker" settings={settings()} />);
    act(() => socket('pusher').open());
    pusher('chatrooms.42.v2', 'App\\Events\\ChatMessageEvent', {
      content: 'love it',
      type: 'celebration',
      sender: { username: 'Fan', identity: { badges: [{ type: 'subscriber', count: 19 }] } },
      metadata: { celebration: { type: 'subscription_renewed', total_months: 19 } },
    });
    expect(alert()?.textContent).toContain('subscribed for 19 months');
    expect(alert()?.textContent).toContain('love it');
  });

  it('shows a Kick host that came without a viewer count', async () => {
    await render(<StreamAlertsWidget kickChannel="kicker" settings={settings()} />);
    act(() => socket('pusher').open());
    pusher('chatrooms.42.v2', 'App\\Events\\StreamHostEvent', {
      host_username: 'small',
      number_viewers: 0,
    });
    expect(alert()?.dataset.kind).toBe('raid');
    expect(alert()?.textContent).toContain('is raiding');
    expect(alert()?.textContent).not.toContain('0 viewers');
  });

  it('writes "Anonymous" for an anonymous gift', async () => {
    await render(<StreamAlertsWidget kickChannel="kicker" settings={settings()} />);
    act(() => socket('pusher').open());
    pusher('chatroom_42', 'GiftedSubscriptionsEvent', {
      gifter_username: 'Anonymous',
      gifted_usernames: ['a', 'b'],
      gifted_total: 2,
    });
    expect(alert()?.textContent).toContain('Anonymous');
    expect(alert()?.textContent).toContain('gifted 2 subs');
  });

  it('draws the alert in the picked theme', async () => {
    await render(
      <StreamAlertsWidget twitchChannel="streamer" settings={settings({ theme: 'celestial' })} />,
    );
    act(() => socket('twitch').open());
    receive('twitch', SUB('Subber'));
    expect(alert()?.dataset.theme).toBe('celestial');
    expect(alert()?.textContent).toContain('Subber');
  });

  it("plays each live alert's sound with the theme and volume", async () => {
    const { unmount } = await render(
      <StreamAlertsWidget twitchChannel="streamer" settings={settings()} />,
    );
    act(() => socket('twitch').open());
    receive('twitch', SUB('Subber'));
    expect(playAlertSound).toHaveBeenCalledWith('neon', 'sub', DEFAULTS.volume / 100);
    unmount();
    vi.mocked(playAlertSound).mockClear();

    await render(
      <StreamAlertsWidget twitchChannel="streamer" settings={settings({ volume: 0 })} />,
    );
    act(() => socket('twitch').open());
    receive('twitch', SUB('Subber'));
    expect(alert()).not.toBeNull();
    expect(playAlertSound).toHaveBeenCalledWith('neon', 'sub', 0);
  });

  it('in the preview, plays a test alert at once with sound, and sample alerts silently', async () => {
    await render(<StreamAlertsWidget simulate previewId="p1" settings={settings()} />);
    wait(1500 + 250);
    expect(alert()).not.toBeNull();
    expect(playAlertSound).not.toHaveBeenCalled();

    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    const test = (name: string, preview: string) => ({
      type: 'alert',
      preview,
      alert: { kind: 'raid', platform: 'kick', name, viewers: 42 },
    });
    // Another page's test click is for its own preview.
    channel.postMessage(test('Elsewhere', 'p2'));
    channel.postMessage(test('Tester', 'p1'));
    await vi.waitFor(() => expect(alert()?.textContent).toContain('Tester'));
    expect(playAlertSound).toHaveBeenCalledTimes(1);
    expect(playAlertSound).toHaveBeenCalledWith('neon', 'raid', DEFAULTS.volume / 100);
    channel.close();
  });

  it('uses a custom heading', async () => {
    await render(
      <StreamAlertsWidget
        twitchChannel="streamer"
        settings={settings({ headings: { ...DEFAULTS.headings, sub: 'Welcome!' } })}
      />,
    );
    act(() => socket('twitch').open());
    receive('twitch', SUB('Subber'));
    expect(alert()?.textContent).toContain('Welcome!');
    expect(alert()?.textContent).not.toContain('New Subscriber');
  });
});
