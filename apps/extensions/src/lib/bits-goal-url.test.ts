import { describe, expect, it } from 'vitest';
import {
  buildGoalPreviewUrl,
  buildGoalUrl,
  DEFAULT_BITS_GOAL_SETTINGS,
  DEFAULT_GOAL_SETTINGS,
  type GoalSettings,
  goalUrlType,
  parseGoalUrl,
  readGoalSettings,
  readGoalType,
} from './goal-url';

const ORIGIN = 'https://extensions.senchabot.com';
const BITS: GoalSettings = {
  ...DEFAULT_BITS_GOAL_SETTINGS,
  style: 'thin',
  color: 'cyan',
  title: 'ROAD TO 10K',
  start: 2500,
  target: 10_000,
  pops: false,
};

describe('Bits & Kicks Goal URL', () => {
  it('writes type=bits and only the channels for its own defaults', () => {
    expect(buildGoalUrl(ORIGIN, DEFAULT_BITS_GOAL_SETTINGS, ' Streamer ', 'KickName')).toBe(
      `${ORIGIN}/widgets/goal?twitch=streamer&kick=kickname&type=bits`,
    );
  });

  it('is empty until a channel is filled in, like the Sub Goal', () => {
    expect(buildGoalUrl(ORIGIN, DEFAULT_BITS_GOAL_SETTINGS, '', '')).toBe('');
  });

  it('measures title and target against its own defaults, not the Sub Goal’s', () => {
    const subDefaults = { ...DEFAULT_BITS_GOAL_SETTINGS, title: 'SUB GOAL', target: 10 };
    const url = new URL(buildGoalUrl(ORIGIN, subDefaults, 'streamer', ''));
    expect(Object.fromEntries(url.searchParams)).toEqual({
      twitch: 'streamer',
      type: 'bits',
      title: 'SUB GOAL',
      target: '10',
    });
  });

  it('writes every changed setting', () => {
    const url = new URL(buildGoalUrl(ORIGIN, BITS, 'streamer', ''));
    expect(Object.fromEntries(url.searchParams)).toEqual({
      twitch: 'streamer',
      type: 'bits',
      style: 'thin',
      color: 'cyan',
      title: 'ROAD TO 10K',
      start: '2500',
      target: '10000',
      pops: '0',
    });
  });

  it('reads a bare type=bits as the Bits & Kicks defaults', () => {
    const { platforms: _, ...defaults } = DEFAULT_BITS_GOAL_SETTINGS;
    expect(readGoalSettings(new URLSearchParams('type=bits'))).toEqual(defaults);
    expect(defaults).toMatchObject({ type: 'bits', title: 'BITS & KICKS GOAL', target: 1000 });
  });

  it('falls back to its own target for a bad one', () => {
    expect(readGoalSettings(new URLSearchParams('type=bits&target=0')).target).toBe(1000);
    expect(readGoalSettings(new URLSearchParams('type=bits&target=abc')).target).toBe(1000);
  });

  it('reads back what it wrote', () => {
    expect(parseGoalUrl(buildGoalUrl(ORIGIN, BITS, 'streamer', 'kicker'), 'bits')).toEqual({
      settings: BITS,
      twitchChannel: 'streamer',
      kickChannel: 'kicker',
    });
    const defaults = buildGoalUrl(ORIGIN, DEFAULT_BITS_GOAL_SETTINGS, '', 'kicker');
    expect(parseGoalUrl(defaults, 'bits')?.settings).toEqual({
      ...DEFAULT_BITS_GOAL_SETTINGS,
      platforms: 'kick',
    });
  });

  it('names only what its platforms send in its default title', () => {
    const title = (query: string) => readGoalSettings(new URLSearchParams(query)).title;
    expect(title('type=bits&twitch=a&kick=b')).toBe('BITS & KICKS GOAL');
    expect(title('type=bits&twitch=a')).toBe('BITS GOAL');
    expect(title('type=bits&kick=b')).toBe('KICKS GOAL');
    // A preview names no channel, only the platform it plays.
    expect(title('type=bits&simulate=1&simplatform=kick')).toBe('KICKS GOAL');
    expect(title('type=bits&simulate=1')).toBe('BITS & KICKS GOAL');
    // A Sub Goal's title never changes with its platforms.
    expect(title('twitch=a')).toBe('SUB GOAL');

    const twitchOnly = { ...DEFAULT_BITS_GOAL_SETTINGS, platforms: 'twitch' as const };
    const url = (title: string, kick = '') =>
      new URL(buildGoalUrl(ORIGIN, { ...twitchOnly, title }, 'streamer', kick)).searchParams;
    expect(url('BITS GOAL').has('title')).toBe(false);
    expect(url('BITS & KICKS GOAL').get('title')).toBe('BITS & KICKS GOAL');
    // Both picked but one channel typed: the overlay gets one platform, so the title says so.
    const both = { ...DEFAULT_BITS_GOAL_SETTINGS, title: 'KICKS GOAL' };
    expect(new URL(buildGoalUrl(ORIGIN, both, '', 'kicker')).searchParams.has('title')).toBe(false);
  });

  it('keeps type=bits in the preview, so the preview plays cheers', () => {
    const url = new URL(buildGoalPreviewUrl(ORIGIN, BITS, 'abc123'));
    expect(url.searchParams.get('type')).toBe('bits');
    expect(url.searchParams.get('simulate')).toBe('1');
    expect(url.searchParams.has('twitch')).toBe(false);
  });
});

describe('Sub Goal and Bits & Kicks Goal URLs stay apart', () => {
  const subUrl = buildGoalUrl(ORIGIN, DEFAULT_GOAL_SETTINGS, 'streamer', '');
  const bitsUrl = buildGoalUrl(ORIGIN, DEFAULT_BITS_GOAL_SETTINGS, 'streamer', '');

  it('tells the two apart, and anything else is no goal URL', () => {
    expect(goalUrlType(subUrl)).toBe('subs');
    expect(goalUrlType(bitsUrl)).toBe('bits');
    expect(goalUrlType(`${ORIGIN}/widgets/subathon?twitch=streamer&type=bits`)).toBeNull();
    expect(goalUrlType('not a url')).toBeNull();
  });

  it('parses each only as its own type', () => {
    expect(parseGoalUrl(bitsUrl)).toBeNull();
    expect(parseGoalUrl(bitsUrl, 'subs')).toBeNull();
    expect(parseGoalUrl(subUrl, 'bits')).toBeNull();
    expect(parseGoalUrl(subUrl)?.settings).toEqual({
      ...DEFAULT_GOAL_SETTINGS,
      platforms: 'twitch',
    });
  });

  it('reads any other type as a Sub Goal, like the overlay did before types', () => {
    for (const query of ['', 'type=subs', 'type=follows', 'type=']) {
      expect(readGoalType(new URLSearchParams(query)), query).toBe('subs');
      expect('type' in readGoalSettings(new URLSearchParams(query)), query).toBe(false);
    }
  });
});

describe('Sub Goal URLs are unchanged', () => {
  it('writes the same bytes as before, with no type', () => {
    expect(buildGoalUrl(ORIGIN, DEFAULT_GOAL_SETTINGS, 'streamer', 'kicker')).toBe(
      `${ORIGIN}/widgets/goal?twitch=streamer&kick=kicker`,
    );
    expect(
      buildGoalUrl(
        ORIGIN,
        {
          ...DEFAULT_GOAL_SETTINGS,
          style: 'thin',
          color: 'gold',
          title: 'Road to 150',
          start: 120,
          target: 150,
          pops: false,
        },
        'streamer',
        '',
      ),
    ).toBe(
      `${ORIGIN}/widgets/goal?twitch=streamer&style=thin&color=gold&title=Road+to+150&start=120&target=150&pops=0`,
    );
  });

  it('writes the same URL with an explicit subs type as without one', () => {
    const plain = { ...DEFAULT_GOAL_SETTINGS, start: 4 };
    expect(buildGoalUrl(ORIGIN, { ...plain, type: 'subs' }, 'streamer', '')).toBe(
      buildGoalUrl(ORIGIN, plain, 'streamer', ''),
    );
  });

  it('keeps its own defaults: SUB GOAL and a goal of 10', () => {
    expect(readGoalSettings(new URLSearchParams())).toMatchObject({
      title: 'SUB GOAL',
      target: 10,
    });
  });
});
