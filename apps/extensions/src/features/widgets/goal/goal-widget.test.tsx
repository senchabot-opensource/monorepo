import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_GOAL_SETTINGS, type GoalSettings } from '#/lib/goal-url';
import { FakeWebSocket } from '#/test/browser';
import { GoalWidget } from './goal-widget';
import { CELEBRATE_MS, storageKey } from './use-goal';

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
const goal = () => screen.getByTestId('goal');
const shown = () => goal().textContent ?? '';
const celebration = () => screen.queryByTestId('goal-celebration');

const { platforms: _, ...DEFAULTS } = DEFAULT_GOAL_SETTINGS;
const settings = (overrides: Partial<GoalSettings> = {}) => ({ ...DEFAULTS, ...overrides });

const SUB =
  '@display-name=Subber;login=subber;msg-id=sub;msg-param-sub-plan=3000;room-id=1 :tmi.twitch.tv USERNOTICE #streamer';
const MOD_SAYS = (text: string) =>
  `@badges=moderator/1;display-name=Mod;mod=1;room-id=1 :mod!mod@mod.tmi.twitch.tv PRIVMSG #streamer :${text}`;
const bundle = (type: 'submysterygift' | 'subgift') =>
  `@display-name=Gifter;msg-id=${type};msg-param-community-gift-id=9;msg-param-mass-gift-count=3;msg-param-sub-plan=1000;room-id=1 :tmi.twitch.tv USERNOTICE #streamer`;

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(KICK_42);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('GoalWidget', () => {
  it('starts at the starting count and adds one per sub, whatever the tier', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 4 })} />);
    expect(shown()).toContain('4/ 10');
    receive('twitch', SUB);
    expect(shown()).toContain('5/ 10');
    expect(shown()).toContain('+1');
    expect(shown()).toContain('Subber');
    expect(JSON.parse(localStorage.getItem(storageKey('streamer')) ?? 'null')).toEqual({
      count: 5,
      start: 4,
    });
  });

  it('adds a gift bundle once, by its size', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings()} />);
    receive('twitch', bundle('submysterygift'));
    for (let i = 0; i < 3; i++) receive('twitch', bundle('subgift'));
    expect(shown()).toContain('3/ 10');
    expect(shown()).toContain('+3');
  });

  it('keeps the count through a reload, and starts over from a new starting count', () => {
    const { unmount } = render(<GoalWidget twitchChannel="streamer" settings={settings()} />);
    receive('twitch', SUB);
    receive('twitch', SUB);
    unmount();

    const again = render(<GoalWidget twitchChannel="streamer" settings={settings()} />);
    expect(shown()).toContain('2/ 10');
    again.unmount();

    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 7 })} />);
    expect(shown()).toContain('7/ 10');
  });

  it('celebrates once when the goal is reached and keeps counting past it', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 9 })} />);
    expect(celebration()).toBeNull();
    receive('twitch', SUB);
    expect(goal().dataset.reached).toBe('true');
    expect(celebration()).not.toBeNull();
    act(() => vi.advanceTimersByTime(CELEBRATE_MS));
    expect(celebration()).toBeNull();

    receive('twitch', SUB);
    expect(shown()).toContain('11/ 10');
    expect(celebration()).toBeNull();
  });

  it('keeps the completed goal up by default', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 5, target: 6 })} />);
    receive('twitch', SUB);
    expect(goal().dataset.reached).toBe('true');
    expect(celebration()).not.toBeNull();
    act(() => vi.advanceTimersByTime(60_000));
    expect(goal().querySelector('.sg-stage')).not.toBeNull();
  });

  it('hides the completed goal after its hold time', () => {
    render(
      <GoalWidget
        twitchChannel="streamer"
        settings={settings({ start: 15, target: 16, end: 'hide', endHold: 30 })}
      />,
    );
    receive('twitch', SUB);
    expect(goal().dataset.reached).toBe('true');
    expect(celebration()).not.toBeNull();
    act(() => vi.advanceTimersByTime(29_000));
    expect(goal().querySelector('.sg-stage')).not.toBeNull();
    act(() => vi.advanceTimersByTime(1000));
    expect(goal().querySelector('.sg-stage')).toBeNull();
  });

  it('hides the completed goal right away with a zero hold', () => {
    render(
      <GoalWidget
        twitchChannel="streamer"
        settings={settings({ start: 25, target: 26, end: 'hide', endHold: 0 })}
      />,
    );
    receive('twitch', SUB);
    expect(goal().dataset.reached).toBe('true');
    expect(goal().querySelector('.sg-stage')).toBeNull();
  });

  it('names who filled it on the cup when one sub completes the goal', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 59, target: 60 })} />);
    receive('twitch', SUB);
    expect(goal().dataset.reached).toBe('true');
    expect(screen.getByTestId('goal-celebration-name').textContent).toBe('Subber');
  });

  it('names the gifter on the cup when one gift completes the goal', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 57, target: 60 })} />);
    receive('twitch', bundle('submysterygift'));
    for (let i = 0; i < 3; i++) receive('twitch', bundle('subgift'));
    expect(goal().dataset.reached).toBe('true');
    expect(screen.getByTestId('goal-celebration-name').textContent).toBe('Gifter');
  });

  it('shows no name on the cup when a mod command completes the goal', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 79, target: 80 })} />);
    receive('twitch', MOD_SAYS('!goal set 80'));
    expect(goal().dataset.reached).toBe('true');
    expect(celebration()).not.toBeNull();
    expect(screen.queryByTestId('goal-celebration-name')).toBeNull();
  });

  it('takes mod commands to fix the count', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 3 })} />);
    receive('twitch', MOD_SAYS('!goal add 4'));
    expect(shown()).toContain('7/ 10');
    receive('twitch', MOD_SAYS('!goal remove'));
    expect(shown()).toContain('6/ 10');
    receive('twitch', MOD_SAYS('!goal set 10'));
    expect(celebration()).not.toBeNull();
    receive('twitch', MOD_SAYS('!goal reset'));
    expect(shown()).toContain('3/ 10');
    // Another widget's command, and a viewer's, change nothing.
    receive('twitch', MOD_SAYS('!subathon add 5m'));
    receive(
      'twitch',
      '@badges=subscriber/1;mod=0;room-id=1 :v!v@v.tmi.twitch.tv PRIVMSG #streamer :!goal set 99',
    );
    expect(shown()).toContain('3/ 10');
  });

  it('counts Kick subs once and gifts by their size, but not a resub shared later', async () => {
    render(<GoalWidget kickChannel="kicker" settings={settings()} />);
    await act(async () => {});
    act(() => socket('pusher').open());

    pusher('channel_7', 'App\\Events\\ChannelSubscriptionEvent', {
      username: 'Fan',
      user_ids: [1],
    });
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'Fan', months: 2 });
    expect(shown()).toContain('1/ 10');
    pusher('chatrooms.42.v2', 'App\\Events\\ChatMessageEvent', {
      content: 'love it',
      type: 'celebration',
      sender: { username: 'Fan', identity: { badges: [{ type: 'subscriber', count: 2 }] } },
      metadata: { celebration: { type: 'subscription_renewed', total_months: 2 } },
    });
    expect(shown()).toContain('1/ 10');

    pusher('chatroom_42', 'GiftedSubscriptionsEvent', {
      gifter_username: 'Gifter',
      gifted_usernames: ['a', 'b', 'c', 'd'],
      gifted_total: 4,
      chunk_details: null,
    });
    expect(shown()).toContain('5/ 10');
    pusher('channel_7', 'KicksGifted', {
      gift_transaction_id: 't1',
      sender: { username: 'Kicker' },
      gift: { amount: 500 },
    });
    expect(shown()).toContain('5/ 10');
  });

  it('adds both platforms into one count', async () => {
    render(<GoalWidget twitchChannel="streamer" kickChannel="kicker" settings={settings()} />);
    await act(async () => {});
    act(() => socket('pusher').open());
    receive('twitch', SUB);
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'Fan', months: 1 });
    expect(shown()).toContain('2/ 10');
  });

  it('hides the pops when they are turned off', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ pops: false })} />);
    receive('twitch', SUB);
    expect(shown()).not.toContain('Subber');
  });

  it('shows a custom emoji instead of the star', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings({ start: 2, icon: '⭐' })} />);
    expect(screen.getByTestId('goal-icon').textContent).toBe('⭐');
  });

  it('shows a channel emote image over the emoji', () => {
    render(
      <GoalWidget
        twitchChannel="streamer"
        settings={settings({
          start: 6,
          icon: '⭐',
          iconUrl: 'https://cdn.7tv.app/emote/e1/2x.webp',
        })}
      />,
    );
    const img = screen.getByTestId('goal-icon') as HTMLImageElement;
    expect(img.tagName).toBe('IMG');
    expect(img.src).toBe('https://cdn.7tv.app/emote/e1/2x.webp');
  });

  it('still lands the trophy on a custom icon when the goal is reached', () => {
    render(
      <GoalWidget
        twitchChannel="streamer"
        settings={settings({ start: 8, target: 9, icon: '⭐' })}
      />,
    );
    receive('twitch', SUB);
    expect(goal().dataset.reached).toBe('true');
    expect(celebration()).not.toBeNull();
  });

  it('never connects or saves in a preview', () => {
    render(<GoalWidget twitchChannel="streamer" settings={settings()} simulate />);
    expect(FakeWebSocket.instances).toHaveLength(0);
    act(() => vi.advanceTimersByTime(10_000));
    expect(localStorage.getItem(storageKey('streamer'))).toBeNull();
    expect(kickLookup).not.toHaveBeenCalled();
  });

  it('plays simulated subs in a preview until the goal is reached, then starts over', () => {
    // Every simulated event is then a single sub, 1.2 s in and 2.2 s apart.
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<GoalWidget settings={settings({ target: 3 })} simulate />);
    expect(shown()).toContain('0/ 3');
    act(() => vi.advanceTimersByTime(1200 + 2 * 2200));
    expect(shown()).toContain('3/ 3');
    expect(celebration()).not.toBeNull();
    act(() => vi.advanceTimersByTime(2200 + CELEBRATE_MS + 1500));
    expect(shown()).toContain('0/ 3');
  });

  it('renders in thin style with embedded title and count', () => {
    render(
      <GoalWidget
        twitchChannel="streamer"
        settings={settings({ style: 'thin', title: 'COMMUNITY GOAL', start: 4, target: 10 })}
      />,
    );
    expect(goal().dataset.style).toBe('thin');
    expect(shown()).toContain('COMMUNITY GOAL');
    expect(shown()).toContain('4/ 10');
  });
});
