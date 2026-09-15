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

const socket = (host: string) => {
  const found = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes(host));
  if (!found) throw new Error(`no ${host} socket`);
  return found;
};
const receive = (host: string, data: string) => act(() => socket(host).receive(data));
const pusher = (channel: string, event: string, data: unknown) =>
  receive('pusher', JSON.stringify({ event, channel, data: JSON.stringify(data) }));
const render = (ui: React.ReactNode) => renderWithProviders(ui, '/widgets/stream-alerts');
const alert = () => screen.queryByTestId('stream-alert');
const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms));

const { platforms: _, ...DEFAULTS } = DEFAULT_STREAM_ALERTS_SETTINGS;
const settings = (overrides: Partial<StreamAlertsSettings> = {}) => ({ ...DEFAULTS, ...overrides });
const DURATION_MS = DEFAULTS.duration * 1000;
/**
 * One alert's full turn: on screen, then the breath before the next. Two steps, since React runs
 * the effect that starts the gap only once act() has flushed the alert's end.
 */
const turn = (times = 1) => {
  for (let i = 0; i < times; i++) {
    wait(DURATION_MS);
    wait(ALERT_GAP_MS);
  }
};
const TURN_MS = DURATION_MS + ALERT_GAP_MS;

const SUB = (name: string) =>
  `@display-name=${name};login=${name.toLowerCase()};msg-id=sub;msg-param-sub-plan=1000;room-id=1 :tmi.twitch.tv USERNOTICE #streamer`;
const RAID = (name: string, viewers: number) =>
  `@display-name=${name};login=${name.toLowerCase()};msg-id=raid;msg-param-displayName=${name};msg-param-viewerCount=${viewers};room-id=1 :tmi.twitch.tv USERNOTICE #streamer`;

/** The names of the alerts shown from now on, each read once while it is up. */
function shownNames(turns: number) {
  const names: string[] = [];
  for (let i = 0; i < turns; i++) {
    const current = alert();
    names.push(current?.querySelector('[lang="und"]')?.textContent ?? '(none)');
    turn();
  }
  return names;
}

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

describe('Stream Alerts queue', () => {
  it('plays a burst from both platforms in arrival order, each once', async () => {
    await render(
      <StreamAlertsWidget twitchChannel="streamer" kickChannel="kicker" settings={settings()} />,
    );
    act(() => socket('twitch').open());
    act(() => socket('pusher').open());
    receive('twitch', SUB('One'));
    pusher('chatrooms.42.v2', 'App\\Events\\StreamHostEvent', {
      host_username: 'Two',
      number_viewers: 5,
    });
    receive('twitch', SUB('Three'));
    pusher('channel_7', 'KicksGifted', {
      gift_transaction_id: 't4',
      sender: { username: 'Four' },
      gift: { amount: 10 },
    });
    expect(shownNames(5)).toEqual(['One', 'Two', 'Three', 'Four', '(none)']);
  });

  it('never has two alerts on screen at once', async () => {
    await render(<StreamAlertsWidget twitchChannel="streamer" settings={settings()} />);
    act(() => socket('twitch').open());
    for (const name of ['A', 'B', 'C']) receive('twitch', SUB(name));
    for (let t = 0; t < 3 * TURN_MS; t += 250) {
      expect(screen.queryAllByTestId('stream-alert').length).toBeLessThanOrEqual(1);
      wait(250);
    }
  });

  it('several lines in one IRC frame each get their alert', async () => {
    await render(<StreamAlertsWidget twitchChannel="streamer" settings={settings()} />);
    act(() => socket('twitch').open());
    receive('twitch', [SUB('A'), SUB('B'), RAID('C', 3)].join('\r\n'));
    expect(shownNames(3)).toEqual(['A', 'B', 'C']);
  });

  it('keeps the queue going after an alert that is off', async () => {
    await render(
      <StreamAlertsWidget
        twitchChannel="streamer"
        settings={settings({ enabled: { ...DEFAULTS.enabled, raid: false } })}
      />,
    );
    act(() => socket('twitch').open());
    receive('twitch', SUB('A'));
    receive('twitch', RAID('Skipped', 100));
    receive('twitch', SUB('B'));
    expect(shownNames(3)).toEqual(['A', 'B', '(none)']);
  });

  it('shows an alert that comes long after the last one right away', async () => {
    await render(<StreamAlertsWidget twitchChannel="streamer" settings={settings()} />);
    act(() => socket('twitch').open());
    receive('twitch', SUB('A'));
    turn(3);
    expect(alert()).toBeNull();
    receive('twitch', SUB('B'));
    expect(alert()?.textContent).toContain('B');
  });

  it('holds an alert that comes during the gap until the gap ends', async () => {
    await render(<StreamAlertsWidget twitchChannel="streamer" settings={settings()} />);
    act(() => socket('twitch').open());
    receive('twitch', SUB('A'));
    wait(DURATION_MS);
    wait(ALERT_GAP_MS / 2);
    receive('twitch', SUB('B'));
    expect(alert()).toBeNull();
    wait(ALERT_GAP_MS / 2);
    expect(alert()?.textContent).toContain('B');
  });

  it('stays up for the duration from the settings', async () => {
    await render(
      <StreamAlertsWidget twitchChannel="streamer" settings={settings({ duration: 3 })} />,
    );
    act(() => socket('twitch').open());
    receive('twitch', SUB('A'));
    wait(2999);
    expect(alert()).not.toBeNull();
    wait(1);
    expect(alert()).toBeNull();
  });

  it('plays one sound per alert, when it shows', async () => {
    await render(<StreamAlertsWidget twitchChannel="streamer" settings={settings()} />);
    act(() => socket('twitch').open());
    receive('twitch', SUB('A'));
    receive('twitch', RAID('B', 3));
    expect(playAlertSound).toHaveBeenCalledTimes(1);
    turn();
    expect(playAlertSound).toHaveBeenCalledTimes(2);
    expect(playAlertSound).toHaveBeenLastCalledWith('neon', 'raid', 0.5);
    turn(2);
    expect(playAlertSound).toHaveBeenCalledTimes(2);
  });

  it('stops everything when removed from the page', async () => {
    const { unmount } = await render(
      <StreamAlertsWidget kickChannel="kicker" settings={settings()} />,
    );
    act(() => socket('pusher').open());
    pusher('channel_7', 'App\\Events\\ChannelSubscriptionEvent', { username: 'Held' });
    const kick = socket('pusher');
    unmount();
    expect(kick.readyState).toBe(FakeWebSocket.CLOSED);
    expect(vi.getTimerCount()).toBe(0);
    wait(KICK_MONTHS_WAIT_MS * 2);
    expect(playAlertSound).not.toHaveBeenCalled();
  });
});

describe('Stream Alerts duplicates', () => {
  it('shows one alert for Kicks that Kick delivers twice', async () => {
    await render(<StreamAlertsWidget kickChannel="kicker" settings={settings()} />);
    act(() => socket('pusher').open());
    const kicks = {
      gift_transaction_id: 'tx-1',
      message: 'gg',
      sender: { username: 'Fan' },
      gift: { amount: 100 },
    };
    pusher('channel_7', 'KicksGifted', kicks);
    pusher('channel_7', 'KicksGifted', kicks);
    expect(shownNames(2)).toEqual(['Fan', '(none)']);
  });

  it('shows one alert for a Kick gift delivered twice', async () => {
    await render(<StreamAlertsWidget kickChannel="kicker" settings={settings()} />);
    act(() => socket('pusher').open());
    const gift = {
      gifter_username: 'Gifter',
      gifted_usernames: ['a', 'b', 'c'],
      gifted_total: 3,
      correlation_id: 'c-1',
      chunk_details: null,
    };
    pusher('chatroom_42', 'GiftedSubscriptionsEvent', gift);
    pusher('chatroom_42', 'GiftedSubscriptionsEvent', gift);
    expect(alert()?.textContent).toContain('gifted 3 subs');
    expect(shownNames(2)).toEqual(['Gifter', '(none)']);
  });

  it('shows one alert for a Kick sub that comes as both of its events, months first', async () => {
    await render(<StreamAlertsWidget kickChannel="kicker" settings={settings()} />);
    act(() => socket('pusher').open());
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'Fan', months: 4 });
    pusher('channel_7', 'App\\Events\\ChannelSubscriptionEvent', { username: 'Fan' });
    expect(alert()?.textContent).toContain('subscribed for 4 months');
    wait(KICK_MONTHS_WAIT_MS);
    expect(shownNames(2)).toEqual(['Fan', '(none)']);
  });

  it('a Twitch gift bundle is one alert even with the next alert waiting', async () => {
    await render(<StreamAlertsWidget twitchChannel="streamer" settings={settings()} />);
    act(() => socket('twitch').open());
    const line = (type: string, name: string, id: string) =>
      `@display-name=${name};msg-id=${type};msg-param-community-gift-id=${id};msg-param-mass-gift-count=2;msg-param-sub-plan=1000;room-id=1 :tmi.twitch.tv USERNOTICE #streamer`;
    receive('twitch', line('submysterygift', 'G1', 'x'));
    receive('twitch', line('subgift', 'G1', 'x'));
    receive('twitch', SUB('Between'));
    receive('twitch', line('subgift', 'G1', 'x'));
    expect(shownNames(3)).toEqual(['G1', 'Between', '(none)']);
  });
});

describe('Stream Alerts preview', () => {
  it("a test alert replaces what's showing and drops the waiting ones", async () => {
    await render(
      <StreamAlertsWidget twitchChannel="streamer" simulate previewId="p1" settings={settings()} />,
    );
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    const test = (name: string) => ({
      type: 'alert',
      preview: 'p1',
      alert: { kind: 'raid', platform: 'twitch', name, viewers: 42 },
    });
    channel.postMessage(test('First'));
    await vi.waitFor(() => expect(alert()?.textContent).toContain('First'));
    channel.postMessage(test('Second'));
    await vi.waitFor(() => expect(alert()?.textContent).toContain('Second'));
    expect(screen.queryAllByTestId('stream-alert')).toHaveLength(1);
    channel.close();
  });

  it('never connects to a chat', async () => {
    await render(
      <StreamAlertsWidget
        twitchChannel="streamer"
        kickChannel="kicker"
        simulate
        settings={settings()}
      />,
    );
    expect(FakeWebSocket.instances).toHaveLength(0);
  });

  it('shows no sample alerts when every alert is off', async () => {
    const off = { sub: false, gift: false, bits: false, raid: false };
    await render(<StreamAlertsWidget simulate settings={settings({ enabled: off })} />);
    wait(10_000);
    expect(alert()).toBeNull();
  });

  it('keeps sample alerts to the kinds that are on and their minimums', async () => {
    await render(
      <StreamAlertsWidget
        simulate
        settings={settings({
          enabled: { sub: false, gift: true, bits: false, raid: false },
          minGift: 50,
        })}
      />,
    );
    for (let i = 0; i < 6; i++) {
      wait(2000);
      const shown = alert();
      if (shown) {
        expect(shown.dataset.kind).toBe('gift');
        expect(shown.textContent).toContain('gifted 50 subs');
      }
      turn();
    }
  });

  it('uses only the picked platform in sample alerts', async () => {
    await render(<StreamAlertsWidget simulate simPlatform="kick" settings={settings()} />);
    for (let i = 0; i < 6; i++) {
      wait(2000);
      // One platform means no platform tag at all.
      expect(alert()?.textContent ?? '').not.toMatch(/TWITCH|KICK/);
      turn();
    }
  });
});
