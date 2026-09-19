import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_GOAL_SETTINGS, type GoalSettings, MAX_GOAL_COUNT } from '#/lib/goal-url';
import { FakeWebSocket } from '#/test/browser';
import { GoalWidget } from './goal-widget';
import { CELEBRATE_MS, POP_MS, PREVIEW_CHANNEL, storageKey } from './use-goal';

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
const goal = () => screen.getByTestId('goal');
const shown = () => goal().textContent ?? '';
const celebration = () => screen.queryByTestId('goal-celebration');
const saved = (twitch = 'streamer', kick = '') =>
  JSON.parse(localStorage.getItem(storageKey(twitch, kick)) ?? 'null');

const { platforms: _, ...DEFAULTS } = DEFAULT_GOAL_SETTINGS;
const settings = (overrides: Partial<GoalSettings> = {}) => ({ ...DEFAULTS, ...overrides });

const notice = (tags: string) => `@${tags};room-id=1 :tmi.twitch.tv USERNOTICE #streamer`;
const SUB = notice('display-name=Subber;login=subber;msg-id=sub;msg-param-sub-plan=Prime');
const RESUB = notice(
  'display-name=Old;login=old;msg-id=resub;msg-param-cumulative-months=12;msg-param-sub-plan=2000',
);
const MYSTERY = (id: string, count: number) =>
  notice(
    `display-name=Gifter;msg-id=submysterygift;msg-param-community-gift-id=${id};msg-param-mass-gift-count=${count};msg-param-sub-plan=1000`,
  );
const BUNDLED = (id: string, to: string) =>
  notice(
    `display-name=Gifter;msg-id=subgift;msg-param-community-gift-id=${id};msg-param-recipient-user-name=${to};msg-param-sub-plan=1000`,
  );
const SAYS = (tags: string, text: string) =>
  `@${tags};room-id=1 :u!u@u.tmi.twitch.tv PRIVMSG #streamer :${text}`;
const kickChat = (content: string, badges: string[]) =>
  pusher('chatrooms.42.v2', 'App\\Events\\ChatMessageEvent', {
    id: `m-${Math.random()}`,
    content,
    type: 'message',
    sender: { username: 'Someone', identity: { badges: badges.map((type) => ({ type })) } },
  });

async function renderKick(overrides: Partial<GoalSettings> = {}) {
  const view = render(<GoalWidget kickChannel="kicker" settings={settings(overrides)} />);
  await act(async () => {});
  act(() => socket('pusher').open());
  return view;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(KICK_42);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('Sub Goal counting on Twitch', () => {
  it('reads several notices from one IRC frame, a bundle counted once by its size', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ target: 20 })} />);
    const frame = [
      SUB,
      RESUB,
      MYSTERY('b1', 3),
      BUNDLED('b1', 'a'),
      BUNDLED('b1', 'b'),
      BUNDLED('b1', 'c'),
    ].join('\r\n');
    receive('twitch', frame);
    expect(shown()).toContain('5/ 20');
    expect(saved()).toEqual({ count: 5, start: 0 });
  });

  it('counts two bundles that overlap once each', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ target: 20 })} />);
    receive('twitch', MYSTERY('x', 2));
    receive('twitch', MYSTERY('y', 3));
    for (const line of [
      BUNDLED('x', 'a'),
      BUNDLED('y', 'b'),
      BUNDLED('y', 'c'),
      BUNDLED('x', 'd'),
      BUNDLED('y', 'e'),
    ]) {
      receive('twitch', line);
    }
    expect(shown()).toContain('5/ 20');
  });

  it("ignores a Shared Chat partner's sub notice and its mods", () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings()} />);
    receive(
      'twitch',
      '@display-name=P;msg-id=sharedchatnotice;source-msg-id=sub;source-room-id=2;room-id=1 :tmi.twitch.tv USERNOTICE #streamer',
    );
    receive('twitch', SAYS('badges=moderator/1;mod=1;source-room-id=2', '!goal set 9'));
    expect(shown()).toContain('0/ 10');
  });

  it("ignores Bits, raids and a gifted sub's later paid upgrade", () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings()} />);
    receive('twitch', SAYS('bits=500;display-name=C;mod=0', 'Cheer500'));
    receive('twitch', notice('msg-id=raid;msg-param-displayName=R;msg-param-viewerCount=50'));
    receive('twitch', notice('display-name=U;msg-id=giftpaidupgrade'));
    expect(shown()).toContain('0/ 10');
    expect(localStorage.getItem(storageKey('streamer'))).toBe('{"count":0,"start":0}');
  });
});

describe('Sub Goal counting on Kick', () => {
  it('counts a sub once when SubscriptionEvent comes first and the channel event after', async () => {
    await renderKick();
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'Fan', months: 3 });
    pusher('channel_7', 'App\\Events\\ChannelSubscriptionEvent', {
      username: 'Fan',
      user_ids: [1],
    });
    expect(shown()).toContain('1/ 10');
  });

  it('counts a gift Kick delivers twice once', async () => {
    await renderKick();
    const gift = {
      correlation_id: 'c-1',
      gifter_username: 'Gifter',
      gifted_usernames: ['a', 'b', 'c'],
      gifted_total: 3,
      chunk_details: null,
    };
    pusher('chatroom_42', 'GiftedSubscriptionsEvent', gift);
    pusher('chatroom_42', 'GiftedSubscriptionsEvent', gift);
    expect(shown()).toContain('3/ 10');
  });

  it("takes a Kick mod's or the broadcaster's command, not a VIP's or a viewer's", async () => {
    await renderKick();
    kickChat('!goal set 8', ['vip', 'subscriber']);
    kickChat('!goal set 8', []);
    expect(shown()).toContain('0/ 10');
    kickChat('!goal add 2', ['moderator']);
    kickChat('!goal add', ['broadcaster']);
    expect(shown()).toContain('3/ 10');
  });

  it('keeps counting on a new socket after the old one goes silent', async () => {
    await renderKick();
    const first = socket('pusher');
    act(() => vi.advanceTimersByTime(45_000));
    expect(socket('pusher')).not.toBe(first);
    act(() => socket('pusher').open());
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'Fan', months: 1 });
    expect(shown()).toContain('1/ 10');
  });
});

describe('Sub Goal mod commands', () => {
  it("takes the broadcaster's command without a mod tag, and no VIP's", () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 2 })} />);
    receive('twitch', SAYS('badges=vip/1;mod=0', '!goal set 7'));
    receive('twitch', SAYS('badges=subscriber/12,premium/1;mod=0', '!goal add 3'));
    expect(shown()).toContain('2/ 10');
    receive('twitch', SAYS('badges=broadcaster/1;mod=0', '!goal add 3'));
    expect(shown()).toContain('5/ 10');
  });

  it('ignores malformed arguments and numbers past the top of the scale', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 4 })} />);
    for (const text of [
      '!goal add -3',
      '!goal set',
      '!goal set 1e3',
      '!goal add 2.5',
      '!goal remove all',
      `!goal set ${MAX_GOAL_COUNT + 1}`,
      '!goal reset now',
      '!goals add 1',
      'goal add 1',
    ]) {
      receive('twitch', SAYS('badges=moderator/1;mod=1', text));
    }
    expect(shown()).toContain('4/ 10');
  });

  it('reads a command repeated with a chat client suffix', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings()} />);
    receive('twitch', SAYS('badges=moderator/1;mod=1', '!goal add 2 \u{E0000}'));
    expect(shown()).toContain('2/ 10');
  });

  it('never goes below zero and holds at the top of the scale', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 1 })} />);
    receive('twitch', SAYS('mod=1', '!goal remove 50'));
    expect(shown()).toContain('0/ 10');
    receive('twitch', SAYS('mod=1', `!goal set ${MAX_GOAL_COUNT}`));
    receive('twitch', SUB);
    expect(shown()).toContain(`${MAX_GOAL_COUNT}/ 10`);
    expect(saved()).toEqual({ count: MAX_GOAL_COUNT, start: 1 });
  });

  it('shows no pop for a command, only for subs', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings()} />);
    receive('twitch', SAYS('mod=1', '!goal add 4'));
    expect(shown()).not.toContain('+4');
  });
});

describe('Sub Goal celebration', () => {
  it('plays once for a gift that jumps past the goal', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 8 })} />);
    receive('twitch', MYSTERY('g', 5));
    expect(shown()).toContain('13/ 10');
    expect(screen.getAllByTestId('goal-celebration')).toHaveLength(1);
    act(() => vi.advanceTimersByTime(CELEBRATE_MS));
    expect(celebration()).toBeNull();
    receive('twitch', SUB);
    expect(celebration()).toBeNull();
  });

  it('does not play again when OBS reloads a goal already reached', () => {
    const first = render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 9 })} />);
    receive('twitch', SUB);
    expect(celebration()).not.toBeNull();
    first.unmount();

    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 9 })} />);
    expect(shown()).toContain('10/ 10');
    expect(goal().dataset.reached).toBe('true');
    expect(celebration()).toBeNull();
  });

  it('never plays for a starting count already past the goal', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 25 })} />);
    receive('twitch', SUB);
    expect(shown()).toContain('26/ 10');
    expect(celebration()).toBeNull();
  });
});

describe('Sub Goal saved count', () => {
  it('shares one count for channel names that differ only in case', () => {
    const first = render(<GoalWidget twitchChannel="Streamer" settings={settings()} />);
    receive('twitch', SUB);
    first.unmount();
    render(<GoalWidget twitchChannel="streamer" settings={settings()} />);
    expect(shown()).toContain('1/ 10');
  });

  it('keeps the count when only the goal changes', () => {
    localStorage.setItem(storageKey('streamer'), JSON.stringify({ count: 40, start: 30 }));
    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 30, target: 100 })} />);
    expect(shown()).toContain('40/ 100');
  });

  it('starts over from the URL for saved data it cannot trust', () => {
    for (const value of [
      'not json',
      '[]',
      '"5"',
      '{"count":"5","start":0}',
      '{"count":5}',
      '{"count":null,"start":0}',
      '{"count":-2,"start":0}',
      '{"count":1.5,"start":0}',
    ]) {
      localStorage.setItem(storageKey('streamer'), value);
      const view = render(
        <GoalWidget twitchChannel="streamer" settings={settings({ start: 3 })} />,
      );
      expect(shown(), value).toContain('3/ 10');
      view.unmount();
    }
  });

  it('still counts when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 2 })} />);
    receive('twitch', SUB);
    expect(shown()).toContain('3/ 10');
  });
});

describe('Sub Goal pops and cleanup', () => {
  it('shows at most three pops and clears each after its time', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ target: 50 })} />);
    for (let i = 0; i < 5; i++) {
      receive('twitch', SUB.replace('Subber', `Fan${i}`));
    }
    expect(shown()).not.toContain('Fan1');
    expect(shown()).toContain('Fan2');
    expect(shown()).toContain('Fan4');
    act(() => vi.advanceTimersByTime(POP_MS));
    expect(shown()).not.toContain('Fan4');
  });

  it('closes both chats when it unmounts, and nothing it left behind throws', async () => {
    const view = render(
      <GoalWidget twitchChannel="streamer" kickChannel="kicker" settings={settings()} />,
    );
    await act(async () => {});
    act(() => socket('pusher').open());
    receive('twitch', SUB);
    view.unmount();
    expect(FakeWebSocket.instances.every((ws) => ws.readyState === FakeWebSocket.CLOSED)).toBe(
      true,
    );
    const count = FakeWebSocket.instances.length;
    act(() => vi.advanceTimersByTime(120_000));
    expect(FakeWebSocket.instances).toHaveLength(count);
  });
});

describe('Sub Goal preview', () => {
  it("plays only its own page's test events, and never saves them", async () => {
    vi.useRealTimers();
    // No simulated events: every roll is past the 1.2 s first step within this test.
    render(<GoalWidget settings={settings()} simulate previewId="mine" />);
    const page = new BroadcastChannel(PREVIEW_CHANNEL);
    page.postMessage({
      type: 'event',
      preview: 'other',
      event: { kind: 'gift', platform: 'twitch', name: 'X', tier: 1, count: 5 },
    });
    page.postMessage({
      type: 'event',
      preview: 'mine',
      event: { kind: 'gift', platform: 'kick', name: 'Y', tier: 1, count: 2 },
    });
    await vi.waitFor(() => expect(shown()).toContain('2/ 10'));
    expect(shown()).not.toContain('+5');
    page.close();
    expect(localStorage.length).toBe(0);
  });

  it('only simulates the picked platform', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    render(<GoalWidget settings={settings({ target: 100 })} simulate simPlatform="kick" />);
    act(() => vi.advanceTimersByTime(1200 + 4 * 4200));
    // Platform colors, as jsdom writes them back.
    expect(document.body.innerHTML).toContain('rgb(83, 252, 24)');
    expect(document.body.innerHTML).not.toContain('rgb(169, 112, 255)');
  });
});
