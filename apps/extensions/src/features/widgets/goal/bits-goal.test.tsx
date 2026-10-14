import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_BITS_GOAL_SETTINGS,
  DEFAULT_GOAL_SETTINGS,
  type GoalSettings,
  readGoalSettings,
} from '#/lib/goal-url';
import { FakeWebSocket } from '#/test/browser';
import {
  BITS_COMMAND,
  bitsIn,
  COMMAND,
  goalAmountIn,
  goalCommand,
  parseGoalCommand,
} from './goal-count';
import { GoalWidget } from './goal-widget';
import { CELEBRATE_MS, PREVIEW_CHANNEL, storageKey } from './use-goal';

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
const saved = (type: 'subs' | 'bits', twitch = 'streamer', kick = '') =>
  JSON.parse(localStorage.getItem(storageKey(twitch, kick, type)) ?? 'null');

const { platforms: _b, ...BITS_DEFAULTS } = DEFAULT_BITS_GOAL_SETTINGS;
const { platforms: _s, ...SUB_DEFAULTS } = DEFAULT_GOAL_SETTINGS;
const bits = (overrides: Partial<GoalSettings> = {}) => ({ ...BITS_DEFAULTS, ...overrides });
const subs = (overrides: Partial<GoalSettings> = {}) => ({ ...SUB_DEFAULTS, ...overrides });

const SAYS = (tags: string, text: string) =>
  `@${tags};room-id=1 :u!u@u.tmi.twitch.tv PRIVMSG #streamer :${text}`;
const CHEER = (amount: number, name = 'Cheerer') =>
  SAYS(`bits=${amount};display-name=${name};mod=0`, `Cheer${amount} gg`);
const MOD_SAYS = (text: string) => SAYS('badges=moderator/1;mod=1', text);
const notice = (tags: string) => `@${tags};room-id=1 :tmi.twitch.tv USERNOTICE #streamer`;
const SUB = notice('display-name=Subber;login=subber;msg-id=sub;msg-param-sub-plan=1000');
const GIFT = notice(
  'display-name=Gifter;msg-id=submysterygift;msg-param-community-gift-id=g;msg-param-mass-gift-count=5;msg-param-sub-plan=1000',
);
const RAID = notice('msg-id=raid;msg-param-displayName=R;msg-param-viewerCount=50');
const kicks = (id: string, amount: number, name = 'KickFan') =>
  pusher('channel_7', 'KicksGifted', {
    gift_transaction_id: id,
    sender: { username: name },
    gift: { amount },
  });

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(KICK_42);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('Bits & Kicks Goal counting rules', () => {
  const cheer = { kind: 'bits', platform: 'twitch', name: 'a', amount: 250 } as const;
  const sub = { kind: 'sub', platform: 'kick', name: 'a', tier: 1 } as const;
  const gift = { kind: 'gift', platform: 'twitch', name: 'a', tier: 1, count: 5 } as const;
  const raid = { kind: 'raid', platform: 'twitch', name: 'a', viewers: 50 } as const;

  it('counts a cheer or Kicks gift by its amount, and nothing else', () => {
    expect(bitsIn(cheer)).toBe(250);
    expect(bitsIn({ ...cheer, platform: 'kick' })).toBe(250);
    expect(bitsIn(sub)).toBe(0);
    expect(bitsIn(gift)).toBe(0);
    expect(bitsIn(raid)).toBe(0);
  });

  it('counts by type: cheers for bits, subs and gifts for subs', () => {
    expect(goalAmountIn('bits', cheer)).toBe(250);
    expect(goalAmountIn('bits', gift)).toBe(0);
    expect(goalAmountIn('subs', cheer)).toBe(0);
    expect(goalAmountIn('subs', gift)).toBe(5);
    expect(goalAmountIn('subs', sub)).toBe(1);
  });

  it('answers to !bitsgoal only, and the Sub Goal to !goal only', () => {
    expect(goalCommand('bits')).toBe(BITS_COMMAND);
    expect(goalCommand('subs')).toBe(COMMAND);
    expect(parseGoalCommand('!bitsgoal add 500', BITS_COMMAND)).toEqual({
      action: 'add',
      amount: 500,
    });
    expect(parseGoalCommand('!BitsGoal reset', BITS_COMMAND)).toEqual({ action: 'reset' });
    expect(parseGoalCommand('!goal add 5', BITS_COMMAND)).toBeNull();
    expect(parseGoalCommand('!bitsgoal add 5')).toBeNull();
    expect(parseGoalCommand('!bitsgoals add 5', BITS_COMMAND)).toBeNull();
  });

  it('keeps its count under its own key, apart from the Sub Goal’s', () => {
    expect(storageKey('Streamer', 'Kicker', 'bits')).toBe('senchabot.goal:bits:streamer:kicker');
    expect(storageKey('Streamer', 'Kicker')).toBe('senchabot.goal:streamer:kicker');
    expect(storageKey('Streamer', 'Kicker', 'subs')).toBe(storageKey('Streamer', 'Kicker'));
  });
});

describe('Bits & Kicks Goal overlay', () => {
  it('starts with its own title and a goal of 1000 from a bare type=bits URL', () => {
    render(
      <GoalWidget
        twitchChannel="streamer"
        settings={readGoalSettings(new URLSearchParams('type=bits'))}
      />,
    );
    expect(goal().dataset.type).toBe('bits');
    expect(shown()).toContain('BITS & KICKS GOAL');
    expect(shown()).toContain('0/ 1000');
  });

  it('adds Twitch Bits by their amount and pops the amount with the cheerer and a gem', () => {
    render(<GoalWidget twitchChannel="streamer" settings={bits({ start: 100 })} />);
    receive('twitch', CHEER(500));
    expect(shown()).toContain('600/ 1000');
    expect(shown()).toContain('+500');
    expect(shown()).toContain('Cheerer');
    expect(screen.getByTestId('goal-pop-gem')).not.toBeNull();
    expect(shown()).not.toContain('★');
    expect(saved('bits')).toEqual({ count: 600, start: 100 });
    expect(saved('subs')).toBeNull();
  });

  it('adds Kick Kicks by their amount, once per gift', async () => {
    render(<GoalWidget kickChannel="kicker" settings={bits()} />);
    await act(async () => {});
    act(() => socket('pusher').open());
    kicks('t1', 100);
    kicks('t1', 100);
    kicks('t2', 250);
    expect(shown()).toContain('350/ 1000');
    expect(shown()).toContain('+250');
    expect(shown()).toContain('KickFan');
  });

  it('adds Bits and Kicks from both platforms into one count', async () => {
    render(<GoalWidget twitchChannel="streamer" kickChannel="kicker" settings={bits()} />);
    await act(async () => {});
    act(() => socket('pusher').open());
    receive('twitch', CHEER(300));
    kicks('t1', 200);
    expect(shown()).toContain('500/ 1000');
    expect(saved('bits', 'streamer', 'kicker')).toEqual({ count: 500, start: 0 });
  });

  it('ignores subs, gifted subs and raids', async () => {
    render(<GoalWidget twitchChannel="streamer" kickChannel="kicker" settings={bits()} />);
    await act(async () => {});
    act(() => socket('pusher').open());
    receive('twitch', SUB);
    receive('twitch', GIFT);
    receive('twitch', RAID);
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'Fan', months: 1 });
    pusher('chatroom_42', 'GiftedSubscriptionsEvent', {
      gifter_username: 'Gifter',
      gifted_usernames: ['a', 'b'],
      gifted_total: 2,
      chunk_details: null,
    });
    expect(shown()).toContain('0/ 1000');
    // No pop either: "+" and a number would be one.
    expect(shown()).not.toMatch(/\+\d/);
  });

  it('names the cheerer who crossed the goal on the cup', () => {
    render(<GoalWidget twitchChannel="streamer" settings={bits({ start: 900 })} />);
    receive('twitch', CHEER(50, 'Almost'));
    expect(celebration()).toBeNull();
    receive('twitch', CHEER(100, 'BigCheer'));
    expect(goal().dataset.reached).toBe('true');
    expect(shown()).toContain('1050/ 1000');
    expect(screen.getByTestId('goal-celebration-name').textContent).toBe('BigCheer');
    act(() => vi.advanceTimersByTime(CELEBRATE_MS));
    expect(celebration()).toBeNull();
  });

  it('names the Kick viewer whose Kicks crossed the goal', async () => {
    render(<GoalWidget kickChannel="kicker" settings={bits({ start: 990, target: 1000 })} />);
    await act(async () => {});
    act(() => socket('pusher').open());
    kicks('t9', 10, 'KickHero');
    expect(screen.getByTestId('goal-celebration-name').textContent).toBe('KickHero');
  });

  it('takes !bitsgoal from mods and ignores !goal', () => {
    render(<GoalWidget twitchChannel="streamer" settings={bits({ start: 200 })} />);
    receive('twitch', MOD_SAYS('!goal set 900'));
    receive('twitch', MOD_SAYS('!goal add 5'));
    expect(shown()).toContain('200/ 1000');
    receive('twitch', MOD_SAYS('!bitsgoal add 300'));
    expect(shown()).toContain('500/ 1000');
    receive('twitch', MOD_SAYS('!bitsgoal remove'));
    expect(shown()).toContain('499/ 1000');
    receive('twitch', MOD_SAYS('!bitsgoal set 1000'));
    expect(celebration()).not.toBeNull();
    expect(screen.queryByTestId('goal-celebration-name')).toBeNull();
    receive('twitch', MOD_SAYS('!bitsgoal reset'));
    expect(shown()).toContain('200/ 1000');
    // A viewer's command changes nothing, and a command shows no pop.
    receive('twitch', SAYS('mod=0', '!bitsgoal set 5'));
    expect(shown()).toContain('200/ 1000');
    expect(shown()).not.toContain('+300');
  });

  it('leaves the Sub Goal deaf to !bitsgoal and to cheers, as before', () => {
    render(<GoalWidget twitchChannel="streamer" settings={subs({ start: 2 })} />);
    receive('twitch', MOD_SAYS('!bitsgoal set 9'));
    receive('twitch', CHEER(500));
    expect(shown()).toContain('2/ 10');
    expect(goal().dataset.type).toBeUndefined();
  });

  it('keeps a separate count from a Sub Goal on the same channel', () => {
    localStorage.setItem(storageKey('streamer'), JSON.stringify({ count: 7, start: 0 }));
    const first = render(<GoalWidget twitchChannel="streamer" settings={bits()} />);
    expect(shown()).toContain('0/ 1000');
    receive('twitch', CHEER(400));
    first.unmount();

    const sub = render(<GoalWidget twitchChannel="streamer" settings={subs()} />);
    expect(shown()).toContain('7/ 10');
    sub.unmount();

    render(<GoalWidget twitchChannel="streamer" settings={bits()} />);
    expect(shown()).toContain('400/ 1000');
    expect(saved('subs')).toEqual({ count: 7, start: 0 });
  });

  it('marks the goal with a gem, where the Sub Goal has its star', () => {
    const view = render(<GoalWidget twitchChannel="streamer" settings={bits()} />);
    expect(goal().querySelector('svg path')?.getAttribute('d')).toMatch(/^M7 3\.5/);
    view.unmount();
    render(<GoalWidget twitchChannel="streamer" settings={subs()} />);
    expect(goal().querySelector('svg path')?.getAttribute('d')).toMatch(/^m12 2\.5/);
  });

  it('still lets a custom icon replace the gem', () => {
    render(<GoalWidget twitchChannel="streamer" settings={bits({ icon: '💎' })} />);
    expect(screen.getByTestId('goal-icon').textContent).toBe('💎');
  });

  it('plays simulated cheers in a preview until the goal is reached, then starts over', () => {
    // Every simulated event is then a 100 Bits cheer on Twitch, 1.2 s in and 2.2 s apart.
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<GoalWidget settings={bits({ target: 300 })} simulate />);
    expect(shown()).toContain('0/ 300');
    act(() => vi.advanceTimersByTime(1200));
    expect(shown()).toContain('100/ 300');
    expect(shown()).toContain('+100');
    act(() => vi.advanceTimersByTime(2 * 2200));
    expect(shown()).toContain('300/ 300');
    expect(celebration()).not.toBeNull();
    act(() => vi.advanceTimersByTime(2200 + CELEBRATE_MS + 1500));
    expect(shown()).toContain('0/ 300');
    expect(localStorage.length).toBe(0);
  });

  it('plays the bigger simulated cheers too', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    render(<GoalWidget settings={bits({ target: 100_000 })} simulate />);
    act(() => vi.advanceTimersByTime(1200));
    expect(shown()).toContain('1000/ 100000');
  });

  it("plays its own page's test cheers in the preview", async () => {
    vi.useRealTimers();
    render(<GoalWidget settings={bits()} simulate previewId="mine" />);
    const page = new BroadcastChannel(PREVIEW_CHANNEL);
    page.postMessage({
      type: 'event',
      preview: 'mine',
      event: { kind: 'bits', platform: 'kick', name: 'Y', amount: 500 },
    });
    page.postMessage({
      type: 'event',
      preview: 'mine',
      event: { kind: 'sub', platform: 'twitch', name: 'Z', tier: 1 },
    });
    await vi.waitFor(() => expect(shown()).toContain('500/ 1000'));
    expect(shown()).toContain('+500');
    page.close();
  });
});
