import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_SUBATHON_SETTINGS, type SubathonSettings } from '#/lib/subathon-url';
import { FakeWebSocket } from '#/test/browser';
import { SubathonWidget } from './subathon-widget';
import { PREVIEW_CHANNEL, storageKey } from './use-subathon';

const kickLookup = vi.hoisted(() => vi.fn());
vi.mock('#/lib/kick', async (importOriginal) => ({
  ...(await importOriginal<typeof import('#/lib/kick')>()),
  getKickChannelInfo: kickLookup,
}));

const KICK_42 = { chatroomId: '42', channelId: '7', userId: null, subscriberBadges: [] };
const MIN = 60_000;
const HOUR = 60 * MIN;

const socket = (host: string) => {
  const found = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes(host));
  if (!found) throw new Error(`no ${host} socket`);
  return found;
};
const receive = (host: string, data: string) => act(() => socket(host).receive(data));
const pusher = (channel: string, event: string, data: unknown) =>
  receive('pusher', JSON.stringify({ event, channel, data: JSON.stringify(data) }));
const text = () => screen.getByTestId('subathon').textContent ?? '';
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));
// Long spans jump the system clock and then run one tick: advancing timers through hours would
// also run the chat client's connect timeouts and heartbeats and drop the fake sockets.
const elapse = (ms: number) => {
  vi.setSystemTime(Date.now() + ms - 1000);
  advance(1000);
};

const { platforms: _, ...DEFAULTS } = DEFAULT_SUBATHON_SETTINGS;
const settings = (overrides: Partial<SubathonSettings> = {}) => ({ ...DEFAULTS, ...overrides });
const saved = (twitch = 'streamer', kick = '') =>
  JSON.parse(localStorage.getItem(storageKey(twitch, kick)) ?? 'null');

const SUB =
  '@display-name=Subber;login=subber;msg-id=sub;msg-param-sub-plan=1000;room-id=1 :tmi.twitch.tv USERNOTICE #streamer';
const say = (badges: string, message: string, mod = '0') =>
  `@badges=${badges};display-name=U;mod=${mod};room-id=1 :u!u@u.tmi.twitch.tv PRIVMSG #streamer :${message}`;
const MOD_SAYS = (message: string) => say('moderator/1', message, '1');
const cheer = (bits: number) =>
  `@bits=${bits};display-name=Cheerer;room-id=1 :c!c@c.tmi.twitch.tv PRIVMSG #streamer :Cheer${bits}`;

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

describe('Subathon clock over a long stream', () => {
  it('counts down in real time across hours without drifting', () => {
    render(
      <SubathonWidget
        twitchChannel="streamer"
        settings={settings({ start: 5 * 3600, autostart: true })}
      />,
    );
    elapse(3 * HOUR + 17 * MIN + 1000);
    expect(text()).toContain('01:42:59');
  });

  it('keeps a pause across a reload and resumes from the time it held', () => {
    const first = render(
      <SubathonWidget twitchChannel="streamer" settings={settings({ autostart: true })} />,
    );
    elapse(10 * MIN);
    receive('twitch', MOD_SAYS('!subathon pause'));
    first.unmount();
    vi.setSystemTime(Date.now() + 3 * HOUR);

    render(<SubathonWidget twitchChannel="streamer" settings={settings({ autostart: true })} />);
    expect(text()).toContain('00:50:00');
    advance(MIN);
    expect(text()).toContain('00:50:00');
    receive('twitch', MOD_SAYS('!subathon start'));
    advance(MIN);
    expect(text()).toContain('00:49:00');
  });

  it('comes back ended when it ran out while OBS was closed, and a mod revives it', () => {
    const first = render(
      <SubathonWidget twitchChannel="streamer" settings={settings({ autostart: true })} />,
    );
    first.unmount();
    vi.setSystemTime(Date.now() + 2 * HOUR);
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ autostart: true })} />);
    expect(text()).toContain('00:00:00');
    expect(text()).toContain('K.O.');
    receive('twitch', SUB);
    expect(text()).toContain('00:00:00');
    receive('twitch', MOD_SAYS('!subathon add 30m'));
    advance(MIN);
    expect(text()).toContain('00:29:00');
  });

  it('shows hours past 99 on a clock that holds days', () => {
    render(
      <SubathonWidget
        twitchChannel="streamer"
        settings={settings({ start: 25 * 24 * 3600, style: 'clock' })}
      />,
    );
    expect(text()).toContain('600:00:00');
  });
});

describe('Subathon mod commands', () => {
  it('takes time away down to zero and stops there', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ autostart: true })} />);
    receive('twitch', MOD_SAYS('!subathon remove 2h'));
    expect(text()).toContain('00:00:00');
    expect(text()).toContain('K.O.');
    receive('twitch', SUB);
    expect(text()).toContain('00:00:00');
    receive('twitch', MOD_SAYS('!subathon set 45m'));
    expect(text()).toContain('00:45:00');
    expect(text()).not.toContain('K.O.');
  });

  it('ends at once on set 0', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ autostart: true })} />);
    receive('twitch', MOD_SAYS('!subathon set 0'));
    expect(text()).toContain('K.O.');
  });

  it("ignores viewers', VIPs' and subscribers' commands", () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings()} />);
    receive('twitch', say('vip/1', '!subathon add 5h'));
    receive('twitch', say('subscriber/12', '!subathon set 10h'));
    receive('twitch', say('', '!subathon start'));
    advance(MIN);
    expect(text()).toContain('01:00:00');
  });

  it('ignores malformed commands', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings()} />);
    for (const bad of [
      '!subathon add',
      '!subathon add -5m',
      '!subathon add 5 minutes',
      '!subathon set NaN',
      '!subathon set Infinity',
      '!subathon add 1e9',
      '!subathon remove 0x10',
      '!subathonadd 5m',
      '!subathon add 800h',
    ]) {
      receive('twitch', MOD_SAYS(bad));
    }
    expect(text()).toContain('01:00:00');
  });

  it('resets to the starting time and waits for start again', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings()} />);
    receive('twitch', MOD_SAYS('!subathon start'));
    receive('twitch', SUB);
    elapse(10 * MIN);
    receive('twitch', MOD_SAYS('!subathon reset'));
    advance(MIN);
    expect(text()).toContain('01:00:00');
    expect(text()).toContain('100%');
  });

  it('takes a Kick mod command like a Twitch one', async () => {
    render(<SubathonWidget kickChannel="kicker" settings={settings()} />);
    await act(async () => {});
    act(() => socket('pusher').open());
    pusher('chatrooms.42.v2', 'App\\Events\\ChatMessageEvent', {
      content: '!subathon add 1h30m',
      sender: { username: 'm', identity: { badges: [{ type: 'moderator' }] } },
    });
    expect(text()).toContain('02:30:00');
    pusher('chatrooms.42.v2', 'App\\Events\\ChatMessageEvent', {
      content: '!subathon add 1h',
      sender: { username: 'v', identity: { badges: [{ type: 'vip' }] } },
    });
    expect(text()).toContain('02:30:00');
  });
});

describe('Subathon cap', () => {
  it('stops adding at the cap, then adds again once time has drained', () => {
    render(
      <SubathonWidget
        twitchChannel="streamer"
        settings={settings({ start: 3600, cap: 3660, autostart: true, tsub: 120 })}
      />,
    );
    receive('twitch', SUB);
    expect(text()).toContain('01:01:00');
    expect(text()).toContain('+1:00');
    elapse(5 * MIN);
    receive('twitch', SUB);
    expect(text()).toContain('00:58:00');
  });
});

describe('Subathon events', () => {
  it('counts a Twitch bundle once, and a later gift outside it on its own', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ tgift: 60 })} />);
    const gift = (type: string, extra = '') =>
      `@display-name=G;msg-id=${type};msg-param-community-gift-id=5;msg-param-mass-gift-count=2;msg-param-sub-plan=1000;room-id=1${extra} :tmi.twitch.tv USERNOTICE #streamer`;
    receive('twitch', gift('submysterygift'));
    receive('twitch', gift('subgift'));
    receive('twitch', gift('subgift'));
    expect(text()).toContain('01:02:00');
    receive(
      'twitch',
      '@display-name=G;msg-id=subgift;msg-param-sub-plan=2000;room-id=1 :tmi.twitch.tv USERNOTICE #streamer',
    );
    expect(text()).toContain('01:04:00');
  });

  it('counts a Kick sub that comes on both events once, and Kicks twice sent once', async () => {
    render(<SubathonWidget kickChannel="kicker" settings={settings({ ksub: 60, kicks: 60 })} />);
    await act(async () => {});
    act(() => socket('pusher').open());
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'Fan', months: 3 });
    pusher('channel_7', 'App\\Events\\ChannelSubscriptionEvent', {
      username: 'fan',
      user_ids: [1],
    });
    expect(text()).toContain('01:01:00');
    const kicks = { gift_transaction_id: 'x', sender: { username: 'K' }, gift: { amount: 500 } };
    pusher('channel_7', 'KicksGifted', kicks);
    pusher('chatrooms.42.v2', 'KicksGifted', kicks);
    expect(text()).toContain('01:02:00');
  });

  it('shows added time for the smallest cheer instead of +0:00', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings()} />);
    receive('twitch', cheer(1));
    // 0.12 s, which the clock already shows rounded up as a second more.
    expect(text()).toContain('01:00:01');
    expect(text()).toContain('+0:01');
    expect(text()).not.toContain('+0:00');
  });

  it('weighs a Tier 2 gift bundle by its tier and size', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ tgift: 60 })} />);
    receive(
      'twitch',
      '@display-name=G;msg-id=submysterygift;msg-param-community-gift-id=8;msg-param-mass-gift-count=3;msg-param-sub-plan=2000;room-id=1 :tmi.twitch.tv USERNOTICE #streamer',
    );
    expect(text()).toContain('01:06:00');
    expect(text()).toContain('+6:00');
  });

  it('adds nothing for a raid or for a Kick resub shared in chat later', async () => {
    render(<SubathonWidget twitchChannel="streamer" kickChannel="kicker" settings={settings()} />);
    await act(async () => {});
    receive(
      'twitch',
      '@display-name=Raider;msg-id=raid;msg-param-displayName=Raider;msg-param-viewerCount=50;room-id=1 :tmi.twitch.tv USERNOTICE #streamer',
    );
    pusher('chatrooms.42.v2', 'App\\Events\\ChatMessageEvent', {
      content: 'hi',
      type: 'celebration',
      sender: { username: 'Fan', identity: { badges: [] } },
      metadata: { celebration: { type: 'subscription_renewed', total_months: 3 } },
    });
    expect(text()).toContain('01:00:00');
  });
});

describe('Subathon saved clock', () => {
  it('starts over when the saved clock is garbage', () => {
    for (const junk of [
      '{',
      '"x"',
      '42',
      '{"endsAt":null,"left":"1","peak":1,"base":1,"ran":true}',
    ]) {
      localStorage.setItem(storageKey('streamer'), junk);
      const view = render(<SubathonWidget twitchChannel="streamer" settings={settings()} />);
      expect(text()).toContain('01:00:00');
      view.unmount();
    }
  });

  it('keeps running when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ autostart: true })} />);
    receive('twitch', SUB);
    advance(MIN);
    expect(text()).toContain('01:00:00');
  });

  it('shares one clock between two sources for the same channel', () => {
    render(<SubathonWidget twitchChannel="streamer" settings={settings()} />);
    render(<SubathonWidget twitchChannel="streamer" settings={settings({ style: 'ring' })} />);
    const [first, second] = FakeWebSocket.instances;
    act(() => {
      first.receive(SUB);
      second.receive(SUB);
    });
    for (const view of screen.getAllByTestId('subathon')) {
      expect(view.textContent).toContain('01:01:00');
    }
    expect(saved()).toMatchObject({ left: 61 * MIN });
  });

  it('keeps each channel pair on its own clock', () => {
    const a = render(<SubathonWidget twitchChannel="Streamer" settings={settings()} />);
    receive('twitch', SUB);
    a.unmount();
    render(<SubathonWidget twitchChannel="other" settings={settings()} />);
    expect(text()).toContain('01:00:00');
    expect(saved('streamer')).toMatchObject({ left: 61 * MIN });
  });
});

describe('Subathon cleanup', () => {
  it('closes its sockets and timers when it unmounts', async () => {
    const view = render(
      <SubathonWidget
        twitchChannel="streamer"
        kickChannel="kicker"
        settings={settings({ autostart: true })}
      />,
    );
    await act(async () => {});
    act(() => {
      socket('twitch').open();
      socket('pusher').open();
    });
    receive('twitch', SUB);
    view.unmount();
    expect(FakeWebSocket.instances.every((ws) => ws.readyState === FakeWebSocket.CLOSED)).toBe(
      true,
    );
    advance(5 * 60_000);
    expect(FakeWebSocket.instances).toHaveLength(2);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('opens no socket when it unmounts before kick.com answers', async () => {
    let answer: (value: typeof KICK_42) => void = () => {};
    kickLookup.mockReset().mockReturnValue(
      new Promise((resolve) => {
        answer = resolve;
      }),
    );
    const view = render(<SubathonWidget kickChannel="kicker" settings={settings()} />);
    view.unmount();
    await act(async () => answer(KICK_42));
    expect(FakeWebSocket.instances).toHaveLength(0);
  });
});

describe('Subathon preview', () => {
  it('plays a test event and a reset from its setup page', async () => {
    const off = { ksub: 0, tgift: 0, kgift: 0, bits: 0, kicks: 0 };
    render(<SubathonWidget settings={settings(off)} simulate simSpeed={1} previewId="p" />);
    const page = new BroadcastChannel(PREVIEW_CHANNEL);
    page.postMessage({
      type: 'event',
      preview: 'p',
      event: { kind: 'sub', platform: 'twitch', name: 'You', tier: 1 },
    });
    await vi.waitFor(() => expect(text()).toContain('You'));
    page.close();
  });

  const off = { tsub: 0, ksub: 0, tgift: 0, kgift: 0, bits: 0, kicks: 0 };
  const paused = () => screen.queryByRole('img', { name: 'Paused' }) !== null;

  it('pauses and resumes from the Pause / Resume button', async () => {
    render(<SubathonWidget settings={settings(off)} simulate simSpeed={1} previewId="p" />);
    expect(paused()).toBe(false);
    const page = new BroadcastChannel(PREVIEW_CHANNEL);
    page.postMessage({ type: 'toggle', preview: 'p' });
    await vi.waitFor(() => expect(paused()).toBe(true));
    page.postMessage({ type: 'toggle', preview: 'p' });
    await vi.waitFor(() => expect(paused()).toBe(false));
    page.close();
  });

  it('starts over on its own a while after it runs out', () => {
    render(<SubathonWidget settings={settings({ ...off, start: 60 })} simulate simSpeed={60} />);
    advance(1500);
    expect(text()).toContain('K.O.');
    advance(4000);
    expect(text()).not.toContain('K.O.');
    expect(text()).toContain('100%');
  });
});
