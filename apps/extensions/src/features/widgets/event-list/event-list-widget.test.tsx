import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_EVENT_LIST_SETTINGS, type EventListSettings } from '#/lib/event-list-url';
import { FakeWebSocket } from '#/test/browser';
import { renderWithProviders } from '#/test/render';
import { storageKey } from './event-list-state';
import { EventListWidget } from './event-list-widget';
import { PREVIEW_CHANNEL } from './use-event-list';

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
const notice = (tags: string) =>
  receive('twitch', `@${tags};room-id=1 :tmi.twitch.tv USERNOTICE #streamer`);
const modSays = (text: string) =>
  receive(
    'twitch',
    `@badges=moderator/1;mod=1;room-id=1 :mod!mod@mod.tmi.twitch.tv PRIVMSG #streamer :${text}`,
  );

const rows = () =>
  screen.queryAllByTestId('event-row').map((row) => ({
    kind: row.dataset.kind,
    platform: row.dataset.platform,
    name: row.querySelector('[data-testid="event-name"]')?.textContent,
    detail: row.querySelector('[data-testid="event-detail"]')?.textContent,
  }));

const { platforms: _, ...DEFAULTS } = DEFAULT_EVENT_LIST_SETTINGS;
const settings = (overrides: Partial<Omit<EventListSettings, 'platforms'>> = {}) => ({
  ...DEFAULTS,
  ...overrides,
});
const render = (ui: React.ReactNode, url = '/widgets/event-list') => renderWithProviders(ui, url);

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(KICK_42);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('EventListWidget', () => {
  it('lists Twitch subs, gifts, Bits and raids, newest on top', async () => {
    await render(<EventListWidget twitchChannel="streamer" settings={settings()} />);
    notice('display-name=Subber;msg-id=sub;msg-param-sub-plan=1000;msg-param-cumulative-months=1');
    notice('display-name=Old;msg-id=resub;msg-param-sub-plan=1000;msg-param-cumulative-months=14');
    notice(
      'display-name=Gifter;msg-id=submysterygift;msg-param-mass-gift-count=5;msg-param-community-gift-id=1;msg-param-sub-plan=1000',
    );
    receive(
      'twitch',
      '@display-name=Cheery;bits=500;room-id=1 :cheery!cheery@cheery.tmi.twitch.tv PRIVMSG #streamer :Cheer500 gg',
    );
    notice('display-name=Raider;msg-id=raid;msg-param-displayName=Raider;msg-param-viewerCount=42');
    expect(rows()).toEqual([
      { kind: 'raid', platform: 'twitch', name: 'Raider', detail: 'Raided with 42 viewers' },
      { kind: 'bits', platform: 'twitch', name: 'Cheery', detail: 'Cheered 500 Bits' },
      { kind: 'gift', platform: 'twitch', name: 'Gifter', detail: 'Gifted 5 subs' },
      { kind: 'sub', platform: 'twitch', name: 'Old', detail: 'Resubscribed, 14 months' },
      { kind: 'sub', platform: 'twitch', name: 'Subber', detail: 'Subscribed' },
    ]);
  });

  it('adds Kick events, Kicks by name, and fills in the months of a Kick sub', async () => {
    await render(
      <EventListWidget kickChannel="kicker" settings={settings({ newest: 'bottom' })} />,
    );
    await act(async () => {});
    act(() => socket('pusher').open());
    pusher('channel_7', 'KicksGifted', {
      gift_transaction_id: 't1',
      sender: { username: 'Kicker' },
      gift: { amount: 100 },
    });
    pusher('channel_7', 'App\\Events\\ChannelSubscriptionEvent', {
      username: 'Fan',
      user_ids: [1],
    });
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'Fan', months: 3 });
    expect(rows()).toEqual([
      { kind: 'bits', platform: 'kick', name: 'Kicker', detail: 'Sent 100 Kicks' },
      { kind: 'sub', platform: 'kick', name: 'Fan', detail: 'Resubscribed, 3 months' },
    ]);
  });

  it('shows only the picked kinds over their minimums, as many as asked', async () => {
    await render(
      <EventListWidget
        twitchChannel="streamer"
        settings={settings({
          rows: 3,
          minRaid: 10,
          kinds: { sub: true, gift: false, bits: true, raid: true },
        })}
      />,
    );
    notice('display-name=Gifter;msg-id=subgift;msg-param-sub-plan=1000');
    notice('display-name=Tiny;msg-id=raid;msg-param-displayName=Tiny;msg-param-viewerCount=3');
    for (const name of ['A', 'B', 'C', 'D']) {
      notice(
        `display-name=${name};msg-id=sub;msg-param-sub-plan=1000;msg-param-cumulative-months=1`,
      );
    }
    expect(rows().map((row) => row.name)).toEqual(['D', 'C', 'B']);
  });

  it('keeps the list through a reload, and a mod clears it', async () => {
    const first = await render(<EventListWidget twitchChannel="streamer" settings={settings()} />);
    notice('display-name=Raider;msg-id=raid;msg-param-displayName=Raider;msg-param-viewerCount=9');
    expect(JSON.parse(localStorage.getItem(storageKey('streamer')) ?? '[]')).toHaveLength(1);
    first.unmount();

    await render(<EventListWidget twitchChannel="streamer" settings={settings()} />);
    expect(rows().map((row) => row.name)).toEqual(['Raider']);
    modSays('!events clear');
    expect(rows()).toEqual([]);
  });

  it('fades rows out after the hold time', async () => {
    await render(<EventListWidget twitchChannel="streamer" settings={settings({ fade: 5 })} />);
    notice('display-name=Raider;msg-id=raid;msg-param-displayName=Raider;msg-param-viewerCount=9');
    expect(rows()).toHaveLength(1);
    act(() => vi.advanceTimersByTime(6000));
    expect(rows()).toHaveLength(0);
  });

  it('writes its words in the language of the URL', async () => {
    await render(
      <EventListWidget twitchChannel="streamer" settings={settings({ title: 'Son Olaylar' })} />,
      '/widgets/event-list?lang=tr',
    );
    notice('display-name=Raider;msg-id=raid;msg-param-displayName=Raider;msg-param-viewerCount=9');
    expect(screen.getByTestId('event-list-title').textContent).toBe('Son Olaylar');
    expect(rows()[0].detail).not.toBe('Raided with 9 viewers');
  });

  it('opens a preview with a few events, never connects or saves, and plays its test events', async () => {
    await render(
      <EventListWidget twitchChannel="streamer" settings={settings()} simulate previewId="p1" />,
    );
    expect(FakeWebSocket.instances).toHaveLength(0);
    expect(rows()).toHaveLength(4);
    act(() => vi.advanceTimersByTime(700));
    expect(rows()).toHaveLength(5);
    // The names come in turn, so the short list never shows anyone twice.
    expect(new Set(rows().map((row) => row.name)).size).toBe(5);
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channel.postMessage({
      type: 'event',
      preview: 'p1',
      event: { kind: 'raid', platform: 'kick', name: 'Tester', viewers: 77 },
    });
    await vi.waitFor(() => expect(rows()[0].name).toBe('Tester'));
    channel.close();
    expect(localStorage.getItem(storageKey('streamer'))).toBeNull();
  });

  it('draws no dots on the top and bottom edges of its rows, whatever the preset', async () => {
    // Rift's diamonds, Realm's rivets and gem, Glitch's square: the frames that have dots.
    for (const preset of ['rift', 'realm', 'glitch']) {
      const { container, unmount } = await render(
        <EventListWidget settings={settings({ preset })} simulate previewId="p1" />,
      );
      expect(rows().length, preset).toBeGreaterThan(0);
      expect(container.querySelectorAll('[data-stud]'), preset).toHaveLength(0);
      unmount();
    }
  });
});
