import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_SUBATHON_SETTINGS, type SubathonSettings } from '#/lib/subathon-url';
import { FakeWebSocket } from '#/test/browser';
import { renderWithProviders } from '#/test/render';
import { SubathonWidget } from './subathon-widget';
import { PREVIEW_CHANNEL, storageKey } from './use-subathon';

const kickLookup = vi.hoisted(() => vi.fn());
vi.mock('#/lib/kick', async (importOriginal) => ({
  ...(await importOriginal<typeof import('#/lib/kick')>()),
  getKickChannelInfo: kickLookup,
}));

const NO_KICK = { chatroomId: null, channelId: null, userId: null, subscriberBadges: [] };
const KICK_42 = { ...NO_KICK, chatroomId: '42', channelId: '7' };

// The newest one: an unanswered connect or heartbeat makes the client swap in a new socket.
const socket = (host: string) => {
  const found = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes(host));
  if (!found) throw new Error(`no ${host} socket`);
  return found;
};
const receive = (host: string, data: string) => act(() => socket(host).receive(data));
const pusher = (channel: string, event: string, data: unknown) =>
  receive('pusher', JSON.stringify({ event, channel, data: JSON.stringify(data) }));
const clock = () => screen.getByTestId('subathon').textContent ?? '';

const { platforms: _, ...DEFAULTS } = DEFAULT_SUBATHON_SETTINGS;
const settings = (overrides: Partial<SubathonSettings> = {}) => ({ ...DEFAULTS, ...overrides });

const SUB =
  '@display-name=Subber;login=subber;msg-id=sub;msg-param-sub-plan=1000;room-id=1 :tmi.twitch.tv USERNOTICE #streamer';
const MOD_SAYS = (text: string) =>
  `@badges=moderator/1;display-name=Mod;mod=1;room-id=1 :mod!mod@mod.tmi.twitch.tv PRIVMSG #streamer :${text}`;
const bundle = (type: 'submysterygift' | 'subgift') =>
  `@display-name=Gifter;msg-id=${type};msg-param-community-gift-id=9;msg-param-mass-gift-count=3;msg-param-sub-plan=1000;room-id=1 :tmi.twitch.tv USERNOTICE #streamer`;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));
  vi.spyOn(console, 'log').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(KICK_42);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('SubathonWidget', () => {
  it('waits paused at the starting time until a mod starts it', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings()} />);
    act(() => socket('twitch').open());
    expect(clock()).toContain('01:00:00');
    act(() => vi.advanceTimersByTime(60_000));
    expect(clock()).toContain('01:00:00');

    receive('twitch', MOD_SAYS('!subathon start'));
    act(() => vi.advanceTimersByTime(60_000));
    expect(clock()).toContain('00:59:00');
  });

  it('adds the sub value, shows who it was from and saves the clock', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ tsub: 300 })} />);
    receive('twitch', SUB);
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

  it('follows a changed starting time until the clock first runs', () => {
    const { unmount } = render(<SubathonWidget twitchChannel="streamer" settings={settings()} />);
    receive('twitch', SUB);
    unmount();
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ start: 7200 })} />);
    expect(clock()).toContain('02:01:00');
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
    receive('twitch', SUB);
    expect(clock()).toContain('00:00:00');

    receive('twitch', MOD_SAYS('!subathon add 10m'));
    expect(clock()).toContain('00:10:00');
    expect(clock()).not.toContain('K.O.');
  });

  it('ignores a mod command with an absurd duration instead of breaking the clock', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings()} />);
    receive('twitch', MOD_SAYS(`!subathon set ${'9'.repeat(320)}`));
    expect(clock()).toContain('01:00:00');
  });

  it('reads Kick subs, gifts and Kicks with the Kick values', async () => {
    render(
      <SubathonWidget
        kickChannel="kicker"
        settings={settings({ ksub: 60, kgift: 30, kicks: 150, tsub: 999 })}
      />,
    );
    await act(async () => {});
    act(() => socket('pusher').open());
    const channels = socket('pusher').sent.map((s) => JSON.parse(s).data.channel);
    expect(channels).toEqual(['chatrooms.42.v2', 'chatroom_42', 'channel_7']);

    pusher('channel_7', 'App\\Events\\ChannelSubscriptionEvent', {
      username: 'Fan',
      user_ids: [1],
    });
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'Fan', months: 1 });
    expect(clock()).toContain('01:01:00');
    // Sharing the resub in chat later is the same sub, already counted.
    pusher('chatrooms.42.v2', 'App\\Events\\ChatMessageEvent', {
      content: 'love it',
      type: 'celebration',
      sender: { username: 'Fan', identity: { badges: [{ type: 'subscriber', count: 19 }] } },
      metadata: { celebration: { type: 'subscription_renewed', total_months: 19 } },
    });
    expect(clock()).toContain('01:01:00');

    pusher('chatroom_42', 'GiftedSubscriptionsEvent', {
      gifter_username: 'Gifter',
      gifted_usernames: ['a', 'b', 'c', 'd'],
      gifted_total: 4,
      chunk_details: null,
    });
    expect(clock()).toContain('01:03:00');

    pusher('channel_7', 'KicksGifted', {
      gift_transaction_id: 't1',
      sender: { username: 'Kicker' },
      gift: { amount: 200 },
    });
    expect(clock()).toContain('01:04:00');
  });

  it('counts a Twitch Tier 3 sub as 5 subs, or 1 with tiers off', () => {
    const tier3 = SUB.replace('sub-plan=1000', 'sub-plan=3000');
    const { unmount } = render(<SubathonWidget twitchChannel="streamer" settings={settings()} />);
    receive('twitch', tier3);
    expect(clock()).toContain('01:05:00');
    unmount();
    localStorage.clear();
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ tiers: false })} />);
    receive('twitch', tier3);
    expect(clock()).toContain('01:01:00');
  });

  it('adds a share of a second for a tiny cheer', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ bits: 60 })} />);
    const cheer5 =
      '@bits=5;display-name=C;room-id=1 :c!c@c.tmi.twitch.tv PRIVMSG #streamer :Cheer5';
    for (let i = 0; i < 10; i++) receive('twitch', cheer5);
    // 60 s per 500 Bits: 5 Bits add 0.6 s, ten of them 6 s.
    expect(clock()).toContain('01:00:06');
  });

  it('keeps looking the Kick channel up until kick.com answers', async () => {
    kickLookup.mockReset().mockResolvedValueOnce(NO_KICK).mockResolvedValue(KICK_42);
    render(<SubathonWidget kickChannel="kicker" settings={settings()} />);
    await act(async () => {});
    expect(FakeWebSocket.instances).toHaveLength(0);

    await act(async () => vi.advanceTimersByTime(5_000));
    expect(kickLookup).toHaveBeenCalledTimes(2);
    act(() => socket('pusher').open());
    expect(socket('pusher').sent.map((s) => JSON.parse(s).data.channel)).toContain('channel_7');
  });

  it("doesn't restart Twitch when the Kick lookup lands, so a gift bundle counts once", async () => {
    let resolveKick: (value: typeof KICK_42) => void = () => {};
    kickLookup.mockReset().mockReturnValue(
      new Promise((resolve) => {
        resolveKick = resolve;
      }),
    );
    render(
      <SubathonWidget
        twitchChannel="streamer"
        kickChannel="kicker"
        settings={settings({ tgift: 60 })}
      />,
    );
    const twitch = socket('twitch');
    receive('twitch', bundle('submysterygift'));
    receive('twitch', bundle('subgift'));
    await act(async () => resolveKick(KICK_42));
    expect(socket('twitch')).toBe(twitch);
    receive('twitch', bundle('subgift'));
    receive('twitch', bundle('subgift'));
    expect(clock()).toContain('01:03:00');
  });

  it('flashes when time is added to a full bar, and not on a loss right after', () => {
    const { container } = render(<SubathonWidget twitchChannel="streamer" settings={settings()} />);
    const flash = () => container.querySelector('[style*="sa-flash"]');
    expect(flash()).toBeNull();
    receive('twitch', SUB);
    expect(clock()).toContain('100%');
    expect(flash()).not.toBeNull();
    receive('twitch', MOD_SAYS('!subathon remove 5m'));
    expect(flash()).toBeNull();
  });

  it('skips events whose value is off, and holds the cap', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ tsub: 0, cap: 3700 })} />);
    receive('twitch', SUB);
    expect(clock()).toContain('01:00:00');
    receive('twitch', MOD_SAYS('!subathon add 1h'));
    expect(clock()).toContain('01:01:40');
  });

  it('shows no added time when the cap lets none through', () => {
    render(
      <SubathonWidget twitchChannel="streamer" settings={settings({ start: 3600, cap: 3600 })} />,
    );
    receive('twitch', SUB);
    expect(clock()).toContain('01:00:00');
    expect(clock()).not.toContain('+1:00');
  });

  it('plays only the test buttons of the setup page it previews', async () => {
    const off = { tsub: 0, ksub: 0, tgift: 0, kgift: 0, bits: 0, kicks: 0 };
    render(<SubathonWidget settings={settings(off)} simulate simSpeed={1} previewId="mine" />);
    const running = () => {
      const before = clock();
      act(() => vi.advanceTimersByTime(60_000));
      return clock() !== before;
    };
    const wasRunning = running();

    // Another tab's setup page, then this one's: only the second toggles this preview.
    const pages = new BroadcastChannel(PREVIEW_CHANNEL);
    pages.postMessage({ type: 'toggle', preview: 'other' });
    pages.postMessage({ type: 'toggle', preview: 'mine' });
    await vi.waitFor(() => expect(running()).toBe(!wasRunning));
    pages.close();
  });

  it('never connects or saves in a preview', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings()} simulate />);
    expect(FakeWebSocket.instances).toHaveLength(0);
    act(() => vi.advanceTimersByTime(10_000));
    expect(localStorage.getItem(storageKey('streamer'))).toBeNull();
    expect(kickLookup).not.toHaveBeenCalled();
  });

  describe('rates', () => {
    const rates = () => screen.queryByTestId('subathon-rates')?.textContent ?? null;
    const withRates = (overrides: Partial<SubathonSettings>) =>
      settings({ rates: true, ...overrides });
    const DIFFERENT = { tsub: 900, tgift: 600, bits: 1500, ksub: 1800, kgift: 1200, kicks: 1800 };

    it('shows none unless turned on', async () => {
      await renderWithProviders(
        <SubathonWidget settings={settings()} simulate />,
        '/widgets/subathon',
      );
      expect(rates()).toBeNull();
    });

    it('lists what each event adds, in one row when both platforms add the same', async () => {
      await renderWithProviders(
        <SubathonWidget settings={withRates({ tsub: 900, ksub: 900 })} simulate />,
        '/widgets/subathon',
      );
      expect(rates()).toContain('Sub +15 min');
      expect(rates()).toContain('Gift Sub +1 min');
      expect(rates()).toContain('500 Bits/Kicks +1 min');
      act(() => vi.advanceTimersByTime(30_000));
      expect(rates()).toContain('500 Bits/Kicks');
    });

    it('takes turns between Twitch and Kick when their values differ', async () => {
      await renderWithProviders(
        <SubathonWidget settings={withRates(DIFFERENT)} simulate />,
        '/widgets/subathon',
      );
      expect(rates()).toContain('Sub +15 min');
      expect(rates()).toContain('500 Bits +25 min');
      act(() => vi.advanceTimersByTime(6000));
      expect(rates()).toContain('Sub +30 min');
      expect(rates()).toContain('500 Kicks +30 min');
      act(() => vi.advanceTimersByTime(6000));
      expect(rates()).toContain('500 Bits +25 min');
    });

    it('leaves out events set to 0 and platforms the overlay has no channel for', async () => {
      await renderWithProviders(
        <SubathonWidget
          twitchChannel="streamer"
          settings={withRates({ ...DIFFERENT, tgift: 0, bits: 3600 })}
        />,
        '/widgets/subathon',
      );
      expect(rates()).toContain('Sub +15 min');
      expect(rates()).toContain('500 Bits +1 h');
      expect(rates()).not.toContain('Gift');
      act(() => vi.advanceTimersByTime(12_000));
      expect(rates()).not.toContain('Kicks');
    });

    it('shows nothing when every event is off', async () => {
      const off = { tsub: 0, ksub: 0, tgift: 0, kgift: 0, bits: 0, kicks: 0 };
      await renderWithProviders(
        <SubathonWidget settings={withRates(off)} simulate />,
        '/widgets/subathon',
      );
      expect(rates()).toBeNull();
    });

    it("writes the words in the URL's language", async () => {
      await renderWithProviders(
        <SubathonWidget settings={withRates(DIFFERENT)} simulate />,
        '/widgets/subathon?lang=tr',
      );
      expect(rates()).toContain('Hediye Sub +10 dk');
    });
  });

  it('renders in thin style with embedded title and clock', () => {
    render(
      <SubathonWidget
        twitchChannel="streamer"
        settings={settings({ style: 'thin', title: 'MARATHON', start: 3600 })}
      />,
    );
    expect(screen.getByTestId('subathon').dataset.style).toBe('thin');
    expect(clock()).toContain('MARATHON');
    expect(clock()).toContain('01:00:00');
  });

  it('shakes the thin bar from outside, so the bar keeps its slant under the embedded text', () => {
    render(
      <SubathonWidget
        twitchChannel="streamer"
        settings={settings({ style: 'thin', start: 600, autostart: true })}
      />,
    );
    const wrapper = screen.getByTestId('subathon-thin-bar');
    expect(wrapper.style.animation).toBe('');
    // 7% of 10 minutes left is critical.
    act(() => vi.advanceTimersByTime(560_000));
    expect(wrapper.style.animation).toContain('sa-shake');
    const bar = wrapper.firstElementChild as HTMLElement;
    expect(bar.style.animation).not.toContain('sa-shake');
    expect(bar.style.transform).toBe('skewX(-14deg)');
  });

  it('lifts the thin bar off the rates strip', async () => {
    const view = await renderWithProviders(
      <SubathonWidget
        twitchChannel="streamer"
        settings={settings({ style: 'thin', rates: true })}
      />,
      '/widgets/subathon?lang=en',
    );
    const padding = () =>
      Number.parseInt(
        (screen.getByTestId('subathon-thin-bar').parentElement as HTMLElement).style.paddingBottom,
        10,
      );
    const withRates = padding();
    view.unmount();
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ style: 'thin' })} />);
    expect(withRates).toBeGreaterThan(padding());
  });

  it('renders rates in thin style positioned properly', async () => {
    await renderWithProviders(
      <SubathonWidget
        twitchChannel="streamer"
        settings={settings({ style: 'thin', rates: true, tsub: 300 })}
      />,
      '/widgets/subathon?lang=en',
    );
    expect(screen.getByTestId('subathon-rates')).toBeDefined();
    expect(screen.getByTestId('subathon-rates').textContent).toContain('Sub +5 min');
  });
});
