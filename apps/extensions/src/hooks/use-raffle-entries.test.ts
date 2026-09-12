import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RaffleConfig } from '#/types/raffle';
import {
  extractSubMonths,
  getKickSubStatus,
  isKeywordMatch,
  isSubscriber,
  shouldAcceptEntry,
  useRaffleChat,
} from './use-raffle-chat';

vi.mock('#/lib/kick', () => ({ getKickChannelInfo: vi.fn() }));

describe('isKeywordMatch', () => {
  it.each([
    ['!join', '!join'],
    ['!JOIN', '!join'],
    ['!join', ' !Join '],
    ['  !join  ', '!join'],
    ['!join please', '!join'],
    ['!join raffle now', '!join raffle'],
    ['çekiliş', 'çekiliş'],
  ])('matches %j for the keyword %j', (message, keyword) => {
    expect(isKeywordMatch(message, keyword)).toBe(true);
  });

  it.each([
    ['!joinme', '!join'],
    ['please !join', '!join'],
    ['!joi', '!join'],
    ['!join', '!join raffle'],
    ['', '!join'],
    ['!join', ''],
    ['!join', '   '],
  ])('does not match %j for the keyword %j', (message, keyword) => {
    expect(isKeywordMatch(message, keyword)).toBe(false);
  });
});

type Viewer = { name: string; isSub: boolean; months: number } & (
  | { tags: Record<string, string> }
  | { badges: { type: string; count?: number }[] }
);

// How each platform reports a chatter, and the sub status the raffle reads from it.
const VIEWERS: Viewer[] = [
  { name: 'twitch viewer', tags: {}, isSub: false, months: -1 },
  { name: 'twitch mod', tags: { badges: 'moderator/1' }, isSub: false, months: -1 },
  { name: 'twitch gifter', tags: { badges: 'sub-gifter/5' }, isSub: false, months: -1 },
  { name: 'twitch sub 0', tags: { badges: 'subscriber/0' }, isSub: true, months: 0 },
  {
    name: 'twitch sub 1',
    tags: { 'badge-info': 'subscriber/1', badges: 'subscriber/0' },
    isSub: true,
    months: 1,
  },
  {
    name: 'twitch sub 3',
    tags: { 'badge-info': 'subscriber/3', badges: 'subscriber/3', subscriber: '1' },
    isSub: true,
    months: 3,
  },
  {
    name: 'twitch sub 12',
    tags: { 'badge-info': 'subscriber/12', badges: 'subscriber/12,sub-gifter/1' },
    isSub: true,
    months: 12,
  },
  {
    name: 'twitch founder 2',
    tags: { 'badge-info': 'founder/2', badges: 'founder/0' },
    isSub: true,
    months: 2,
  },
  { name: 'twitch broadcaster', tags: { badges: 'broadcaster/1' }, isSub: true, months: -1 },
  { name: 'kick viewer', badges: [], isSub: false, months: -1 },
  { name: 'kick mod', badges: [{ type: 'moderator' }], isSub: false, months: -1 },
  { name: 'kick gifter', badges: [{ type: 'sub_gifter', count: 5 }], isSub: false, months: -1 },
  { name: 'kick sub 1', badges: [{ type: 'subscriber', count: 1 }], isSub: true, months: 1 },
  { name: 'kick sub 6', badges: [{ type: 'subscriber', count: 6 }], isSub: true, months: 6 },
  { name: 'kick founder 2', badges: [{ type: 'founder', count: 2 }], isSub: true, months: 2 },
  {
    name: 'kick gifter sub 3',
    badges: [
      { type: 'sub_gifter', count: 50 },
      { type: 'subscriber', count: 3 },
    ],
    isSub: true,
    months: 3,
  },
  { name: 'kick broadcaster', badges: [{ type: 'broadcaster' }], isSub: true, months: 1 },
];

const subStatus = (viewer: Viewer) =>
  'tags' in viewer
    ? { isSub: isSubscriber(viewer.tags), months: extractSubMonths(viewer.tags) }
    : (({ isSub, subMonths }) => ({ isSub, months: subMonths }))(getKickSubStatus(viewer.badges));

const ALL = VIEWERS.map((v) => v.name);
const ANY_SUB = [
  'twitch sub 0',
  'twitch sub 1',
  'twitch sub 3',
  'twitch sub 12',
  'twitch founder 2',
  'twitch broadcaster',
  'kick sub 1',
  'kick sub 6',
  'kick founder 2',
  'kick gifter sub 3',
  'kick broadcaster',
];

describe('raffle entry rules', () => {
  it('reads the sub status from Twitch tags and Kick badges', () => {
    expect(VIEWERS.map((v) => ({ name: v.name, ...subStatus(v) }))).toEqual(
      VIEWERS.map(({ name, isSub, months }) => ({ name, isSub, months })),
    );
  });

  it.each([
    [false, 0, ALL],
    [false, 1, ALL],
    [false, 12, ALL],
    // A 0 or 1 month minimum means any subscriber, the broadcaster included.
    [true, 0, ANY_SUB],
    [true, 1, ANY_SUB],
    [
      true,
      2,
      [
        'twitch sub 3',
        'twitch sub 12',
        'twitch founder 2',
        'kick sub 6',
        'kick founder 2',
        'kick gifter sub 3',
      ],
    ],
    [true, 3, ['twitch sub 3', 'twitch sub 12', 'kick sub 6', 'kick gifter sub 3']],
    [true, 6, ['twitch sub 12', 'kick sub 6']],
    [true, 12, ['twitch sub 12']],
  ])('subs only %s, minimum %i months: lets in %j', (subscribersOnly, minSubMonths, accepted) => {
    const config = { subscribersOnly, minSubMonths };
    const entered = VIEWERS.filter((v) => {
      const { isSub, months } = subStatus(v);
      return shouldAcceptEntry(isSub, months, config);
    }).map((v) => v.name);
    expect(entered).toEqual(accepted);
  });
});

describe('useRaffleChat entries', () => {
  class FakeSocket {
    static OPEN = 1;
    readyState = FakeSocket.OPEN;
    onopen: (() => void) | null = null;
    onmessage: ((event: { data: string }) => void) | null = null;
    onerror: (() => void) | null = null;
    onclose: (() => void) | null = null;
    send = vi.fn();
    close = vi.fn();
    constructor(readonly url: string) {
      sockets.push(this);
    }
  }
  let sockets: FakeSocket[] = [];

  const config = (overrides: Partial<RaffleConfig>): RaffleConfig => ({
    platform: 'twitch',
    channel: 'streamer',
    keyword: '!join',
    subscribersOnly: false,
    minSubMonths: 1,
    maxWinsPerUser: 1,
    minRaffleDurationSec: 0,
    ...overrides,
  });

  const entrants = (raffle: RaffleConfig, messages: string[]) => {
    const onParticipant = vi.fn();
    renderHook(() => useRaffleChat(raffle, onParticipant, true));
    const socket = sockets[0];
    socket.onopen?.();
    for (const data of messages) socket.onmessage?.({ data });
    return onParticipant.mock.calls.map(([p]) => `${p.username}:${p.subMonths}`);
  };

  const twitch = (user: string, text: string, tags = '') =>
    `@display-name=${user};${tags} :${user.toLowerCase()}!u@u.tmi.twitch.tv PRIVMSG #streamer :${text}`;

  const kick = (user: string, text: string, badges: { type: string; count?: number }[] = []) =>
    JSON.stringify({
      event: 'App\\Events\\ChatMessageEvent',
      data: JSON.stringify({
        id: `${user}-${text}`,
        sender: { username: user, identity: { badges } },
        content: text,
        created_at: '2026-01-01T00:00:00Z',
      }),
    });

  beforeEach(() => {
    sockets = [];
    vi.stubGlobal('WebSocket', FakeSocket);
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('enters Twitch chatters who send the keyword, in any case, and ignores bots', () => {
    expect(
      entrants(config({}), [
        twitch('Nightbot', '!join'),
        twitch('StreamElements', '!join'),
        twitch('Senchabot', '!join'),
        twitch('Alice', '!JOIN'),
        twitch('Bob', '!join me too'),
        twitch('Carol', '!joinme'),
        twitch('Dave', 'hello'),
      ]),
    ).toEqual(['alice:-1', 'bob:-1']);
  });

  it('applies the subs-only minimum to Twitch chatters', () => {
    expect(
      entrants(config({ subscribersOnly: true, minSubMonths: 3 }), [
        twitch('Viewer', '!join'),
        twitch('Gifter', '!join', 'badges=sub-gifter/5'),
        twitch('NewSub', '!join', 'badge-info=subscriber/1;badges=subscriber/0'),
        twitch('OldSub', '!join', 'badge-info=subscriber/14;badges=subscriber/12'),
      ]),
    ).toEqual(['oldsub:14']);
  });

  it('enters Kick chatters who send the keyword and ignores bots', () => {
    expect(
      entrants(config({ platform: 'kick', channel: '12345' }), [
        kick('BotRix', '!join'),
        kick('KickUser', ' !Join '),
        kick('Other', 'nope'),
      ]),
    ).toEqual(['kickuser:-1']);
    expect(sockets[0].url).toContain('pusher.com');
  });

  it('applies the subs-only minimum to Kick badges, not counting gifted subs', () => {
    expect(
      entrants(
        config({ platform: 'kick', channel: '12345', subscribersOnly: true, minSubMonths: 2 }),
        [
          kick('Gifter', '!join', [{ type: 'sub_gifter', count: 20 }]),
          kick('NewSub', '!join', [{ type: 'subscriber', count: 1 }]),
          kick('Founder', '!join', [{ type: 'founder', count: 2 }]),
          kick('LongSub', '!join', [
            { type: 'sub_gifter', count: 3 },
            { type: 'subscriber', count: 9 },
          ]),
        ],
      ),
    ).toEqual(['founder:2', 'longsub:9']);
  });
});
