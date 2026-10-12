import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_HUD_SETTINGS, type HudSettings } from '#/lib/irl-hud-url';
import { FakeWebSocket } from '#/test/browser';
import { IrlHudWidget } from './irl-hud-widget';
import { storageKey } from './use-irl-hud';

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
// The counter rolls up to the new amount instead of jumping, so let it finish first.
const settle = () => act(() => vi.advanceTimersByTime(2000));

const hud = () => screen.getByTestId('irl-hud');
const money = () => Number(hud().dataset.money);
const shownMoney = () => screen.getByTestId('irl-hud-money').dataset.value;
const pops = () => screen.queryByTestId('irl-hud-pops')?.textContent ?? '';
const radar = () => screen.getByTestId('irl-hud-radar');
const saved = (twitch = 'streamer', kick = '') =>
  JSON.parse(localStorage.getItem(storageKey(twitch, kick)) ?? 'null');

const { platforms: _, ...DEFAULTS } = DEFAULT_HUD_SETTINGS;
const settings = (overrides: Partial<HudSettings> = {}) => ({ ...DEFAULTS, ...overrides });

const SUB_T3 =
  '@display-name=Subber;login=subber;msg-id=sub;msg-param-sub-plan=3000;room-id=1 :tmi.twitch.tv USERNOTICE #streamer';
const CHEER = (bits: number) =>
  `@bits=${bits};display-name=Cheerer;room-id=1 :cheerer!cheerer@cheerer.tmi.twitch.tv PRIVMSG #streamer :Cheer${bits} gg`;
const RAID =
  '@display-name=Raider;login=raider;msg-id=raid;msg-param-displayName=Raider;msg-param-viewerCount=30;room-id=1 :tmi.twitch.tv USERNOTICE #streamer';
const bundle = (type: 'submysterygift' | 'subgift') =>
  `@display-name=Gifter;msg-id=${type};msg-param-community-gift-id=9;msg-param-mass-gift-count=3;msg-param-sub-plan=1000;room-id=1 :tmi.twitch.tv USERNOTICE #streamer`;
const MOD_SAYS = (text: string) =>
  `@badges=moderator/1;display-name=Mod;mod=1;room-id=1 :mod!mod@mod.tmi.twitch.tv PRIVMSG #streamer :${text}`;
const VIEWER_SAYS = (text: string) =>
  `@display-name=Viewer;room-id=1 :viewer!viewer@viewer.tmi.twitch.tv PRIVMSG #streamer :${text}`;

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(KICK_42);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('IrlHudWidget', () => {
  it('starts at the starting money and rolls a sub in, weighed by its tier', () => {
    render(<IrlHudWidget twitchChannel="streamer" settings={settings({ start: 350 })} />);
    expect(shownMoney()).toBe('$00000350');

    receive('twitch', SUB_T3);
    expect(money()).toBe(850);
    expect(pops()).toContain('+$500');
    expect(pops()).toContain('Subber');
    settle();
    expect(shownMoney()).toBe('$00000850');
    expect(saved()).toEqual({ money: 850, start: 350 });
  });

  it('pays a gift bundle once, cheers by their share and raids per viewer', () => {
    render(<IrlHudWidget twitchChannel="streamer" settings={settings()} />);
    receive('twitch', bundle('submysterygift'));
    for (let i = 0; i < 3; i++) receive('twitch', bundle('subgift'));
    expect(money()).toBe(300);
    receive('twitch', CHEER(200));
    expect(money()).toBe(350);
    receive('twitch', RAID);
    expect(money()).toBe(650);
  });

  it('pays Kick subs once, Kicks gifts and hosts', async () => {
    render(<IrlHudWidget kickChannel="kicker" settings={settings({ ksub: 250 })} />);
    await act(async () => {});
    act(() => socket('pusher').open());

    pusher('channel_7', 'App\\Events\\ChannelSubscriptionEvent', {
      username: 'Fan',
      user_ids: [1],
    });
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'Fan', months: 2 });
    expect(money()).toBe(250);
    pusher('channel_7', 'KicksGifted', {
      gift_transaction_id: 't1',
      sender: { username: 'Kicker' },
      gift: { amount: 500 },
    });
    expect(money()).toBe(375);
    pusher('chatrooms.42.v2', 'App\\Events\\StreamHostEvent', {
      host_username: 'Host',
      number_viewers: 20,
    });
    expect(money()).toBe(575);
  });

  it('lets mods add, take, set and reset the money, and ignores viewers', () => {
    render(<IrlHudWidget twitchChannel="streamer" settings={settings({ start: 1000 })} />);
    receive('twitch', VIEWER_SAYS('!hud cash 999999'));
    expect(money()).toBe(1000);

    receive('twitch', MOD_SAYS('!hud cash +1,500'));
    expect(money()).toBe(2500);
    expect(pops()).toContain('+$1,500');
    receive('twitch', MOD_SAYS('!hud cash remove 3k'));
    expect(money()).toBe(-500);
    settle();
    expect(shownMoney()).toBe('-$0000500');
    receive('twitch', MOD_SAYS('!hud cash 42'));
    expect(money()).toBe(42);
    receive('twitch', MOD_SAYS('!hud cash reset'));
    expect(money()).toBe(1000);
  });

  it('walks a made-up city in the bottom left by default, or a park', () => {
    const first = render(<IrlHudWidget twitchChannel="streamer" settings={settings()} />);
    expect(radar().dataset.map).toBe('urban');
    expect(radar().style.left).not.toBe('');
    expect(radar().style.bottom).not.toBe('');
    expect(radar().querySelector('pattern')).not.toBeNull();
    first.unmount();

    render(<IrlHudWidget twitchChannel="streamer" settings={settings({ map: 'park' })} />);
    expect(radar().dataset.map).toBe('park');
    expect(radar().querySelectorAll('circle').length).toBeGreaterThan(5);
    expect(screen.queryByText('© OpenStreetMap')).toBeNull();
  });

  it('draws the streets around a real place, from OpenStreetMap, with the credit', async () => {
    const answer = {
      elements: [
        {
          type: 'way',
          tags: { highway: 'residential' },
          geometry: [
            { lat: 41, lon: 28.999 },
            { lat: 41, lon: 29.001 },
          ],
        },
      ],
    };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(answer)));
    vi.stubGlobal('fetch', fetchMock);
    render(
      <IrlHudWidget
        twitchChannel="streamer"
        settings={settings({ map: 'real', places: [{ name: 'home', lat: 41, lon: 29 }] })}
      />,
    );
    expect(radar().dataset.map).toBe('loading');
    await act(async () => {});
    expect(radar().dataset.map).toBe('real');
    expect(screen.getByText('© OpenStreetMap')).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });

  it('walks the made-up city while OpenStreetMap does not answer, or without a place', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    const first = render(
      <IrlHudWidget
        twitchChannel="streamer"
        settings={settings({ map: 'real', places: [{ name: 'home', lat: 40, lon: 30 }] })}
      />,
    );
    await act(async () => {});
    expect(radar().dataset.map).toBe('urban');
    first.unmount();
    vi.unstubAllGlobals();

    render(<IrlHudWidget twitchChannel="streamer" settings={settings({ map: 'real' })} />);
    expect(radar().dataset.map).toBe('urban');
  });

  it('waits at least 30 s before asking OpenStreetMap again, as its servers ask', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 429 }));
    vi.stubGlobal('fetch', fetchMock);
    render(
      <IrlHudWidget
        twitchChannel="streamer"
        settings={settings({ map: 'real', places: [{ name: 'home', lat: 39, lon: 32 }] })}
      />,
    );
    await act(async () => {});
    // Both servers were asked once, and both turned it away.
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await act(async () => {
      vi.advanceTimersByTime(29_000);
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await act(async () => {
      vi.advanceTimersByTime(1_000);
    });
    expect(fetchMock).toHaveBeenCalledTimes(4);
    vi.unstubAllGlobals();
  });

  it('switches the mini-map from chat to a saved place or a made-up map, and back', async () => {
    const answer = {
      elements: [
        {
          type: 'way',
          tags: { highway: 'footway' },
          geometry: [
            { lat: 41.0256, lon: 28.9741 },
            { lat: 41.0258, lon: 28.9746 },
          ],
        },
      ],
    };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(answer)));
    vi.stubGlobal('fetch', fetchMock);
    const places = [{ name: 'Galata', lat: 41.0256, lon: 28.9744 }];
    render(<IrlHudWidget twitchChannel="streamer" settings={settings({ places })} />);
    expect(radar().dataset.map).toBe('urban');

    receive('twitch', VIEWER_SAYS('!hud map galata'));
    expect(radar().dataset.map).toBe('urban');
    receive('twitch', MOD_SAYS('!hud map galata'));
    await act(async () => {});
    expect(radar().dataset.map).toBe('real');
    expect(String(fetchMock.mock.calls[0][0])).toContain(encodeURIComponent('41.0256,28.9744'));

    receive('twitch', MOD_SAYS('!hud map nowhere'));
    expect(radar().dataset.map).toBe('real');
    receive('twitch', MOD_SAYS('!hud map park'));
    expect(radar().dataset.map).toBe('park');
    receive('twitch', MOD_SAYS('!hud map reset'));
    expect(radar().dataset.map).toBe('urban');
    vi.unstubAllGlobals();
  });

  it('buys from the market when the cash covers it, and refuses when it does not', () => {
    const items = [
      { name: 'water', price: 100 },
      { name: 'Energy Drink', price: 400 },
    ];
    render(<IrlHudWidget twitchChannel="streamer" settings={settings({ start: 500, items })} />);

    receive('twitch', VIEWER_SAYS('!hud buy water'));
    expect(money()).toBe(500);
    receive('twitch', MOD_SAYS('!hud buy WATER'));
    expect(money()).toBe(400);
    expect(pops()).toContain('-$100');
    expect(pops()).toContain('water');

    receive('twitch', MOD_SAYS('!hud buy energy drink 2'));
    expect(money()).toBe(400);
    const refused = document.querySelector<HTMLElement>('[data-declined]');
    expect(refused?.textContent).toContain('✕ $800');
    expect(refused?.textContent).toContain('Energy Drink x2');

    receive('twitch', MOD_SAYS('!hud buy water 4'));
    expect(money()).toBe(0);
    receive('twitch', MOD_SAYS('!hud buy pizza'));
    expect(money()).toBe(0);
  });

  it('walks, runs and stays on command, and keeps that through a reload', () => {
    const first = render(<IrlHudWidget twitchChannel="streamer" settings={settings()} />);
    expect(hud().dataset.move).toBe('walk');
    receive('twitch', MOD_SAYS('!hud run'));
    expect(hud().dataset.move).toBe('run');
    receive('twitch', MOD_SAYS('!hud stop'));
    expect(hud().dataset.move).toBe('stay');
    receive('twitch', VIEWER_SAYS('!hud walk'));
    expect(hud().dataset.move).toBe('stay');
    first.unmount();

    const again = render(<IrlHudWidget twitchChannel="streamer" settings={settings()} />);
    expect(hud().dataset.move).toBe('stay');
    again.unmount();

    // The setup now starts the arrow standing still: the old chat choice no longer applies.
    render(<IrlHudWidget twitchChannel="streamer" settings={settings({ move: 'stay' })} />);
    expect(hud().dataset.move).toBe('stay');
    receive('twitch', MOD_SAYS('!hud walk'));
    expect(hud().dataset.move).toBe('walk');
  });

  it('keeps the chosen mini-map through a reload, until the URL starts on another one', () => {
    const places = [{ name: 'park1', lat: 41, lon: 29 }];
    const first = render(<IrlHudWidget twitchChannel="streamer" settings={settings({ places })} />);
    receive('twitch', MOD_SAYS('!hud map park'));
    first.unmount();

    const again = render(<IrlHudWidget twitchChannel="streamer" settings={settings({ places })} />);
    expect(radar().dataset.map).toBe('park');
    expect(saved().map).toEqual({ choice: 'park', from: 'urban' });
    again.unmount();

    // The setup now starts the mini-map on the park itself: the old chat choice no longer applies.
    render(<IrlHudWidget twitchChannel="streamer" settings={settings({ places, map: 'park' })} />);
    expect(radar().dataset.map).toBe('park');
    receive('twitch', MOD_SAYS('!hud map urban'));
    expect(radar().dataset.map).toBe('urban');
  });

  it('draws Modern cash with commas and moves the mini-map to its corner', () => {
    render(
      <IrlHudWidget
        twitchChannel="streamer"
        settings={settings({ style: 'modern', start: 1250, radarCorner: 'tr', corner: 'tl' })}
      />,
    );
    expect(shownMoney()).toBe('$1,250');
    expect(radar().style.top).not.toBe('');
    expect(radar().style.right).not.toBe('');
  });

  it('keeps the money through a reload, and starts over from a new starting amount', () => {
    const first = render(<IrlHudWidget twitchChannel="streamer" settings={settings()} />);
    receive('twitch', SUB_T3);
    first.unmount();

    const again = render(<IrlHudWidget twitchChannel="streamer" settings={settings()} />);
    expect(money()).toBe(500);
    again.unmount();

    render(<IrlHudWidget twitchChannel="streamer" settings={settings({ start: 100 })} />);
    expect(money()).toBe(100);
  });

  it('shows the time in the picked time zone, in 24 or 12 hours', () => {
    vi.setSystemTime(new Date('2026-10-12T05:30:00Z'));
    const { unmount } = render(
      <IrlHudWidget twitchChannel="streamer" settings={settings({ tz: 'Asia/Tokyo' })} />,
    );
    expect(screen.getByTestId('irl-hud-clock').dataset.value).toBe('14:30');
    unmount();

    render(
      <IrlHudWidget
        twitchChannel="streamer"
        settings={settings({ tz: 'America/New_York', h12: true })}
      />,
    );
    expect(screen.getByTestId('irl-hud-clock').dataset.value).toBe('1:30 AM');
  });

  it('leaves out the clock, the mini-map and the pops when they are off', () => {
    render(
      <IrlHudWidget
        twitchChannel="streamer"
        settings={settings({ clock: false, radar: false, pops: false })}
      />,
    );
    receive('twitch', SUB_T3);
    expect(screen.queryByTestId('irl-hud-clock')).toBeNull();
    expect(screen.queryByTestId('irl-hud-radar')).toBeNull();
    expect(screen.queryByTestId('irl-hud-pops')).toBeNull();
    expect(money()).toBe(500);
  });

  it('takes no money for an event whose value is off', () => {
    render(<IrlHudWidget twitchChannel="streamer" settings={settings({ traid: 0 })} />);
    receive('twitch', RAID);
    expect(money()).toBe(0);
    expect(pops()).toBe('');
  });

  it('plays simulated events in the preview without reading chat or saving', () => {
    render(<IrlHudWidget settings={settings()} simulate />);
    act(() => vi.advanceTimersByTime(30_000));
    expect(FakeWebSocket.instances.some((ws) => ws.url.includes('twitch'))).toBe(false);
    expect(money()).toBeGreaterThan(0);
    expect(localStorage.getItem(storageKey())).toBeNull();
  });
});
