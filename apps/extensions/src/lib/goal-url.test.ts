import { describe, expect, it } from 'vitest';
import {
  buildGoalPreviewUrl,
  buildGoalUrl,
  DEFAULT_GOAL_SETTINGS,
  type GoalSettings,
  MAX_GOAL_COUNT,
  parseGoalUrl,
  readGoalSettings,
} from './goal-url';

const ORIGIN = 'https://extensions.senchabot.com';
const CUSTOM: GoalSettings = {
  platforms: 'both',
  color: 'gold',
  title: 'ROAD TO 500',
  start: 431,
  target: 500,
  pops: false,
};

describe('buildGoalUrl', () => {
  it('is empty until a channel on a picked platform is filled in', () => {
    expect(buildGoalUrl(ORIGIN, DEFAULT_GOAL_SETTINGS, '', '')).toBe('');
    expect(
      buildGoalUrl(ORIGIN, { ...DEFAULT_GOAL_SETTINGS, platforms: 'kick' }, 'streamer', ''),
    ).toBe('');
  });

  it('writes only the channels for default settings', () => {
    expect(buildGoalUrl(ORIGIN, DEFAULT_GOAL_SETTINGS, ' Streamer ', 'KickName')).toBe(
      `${ORIGIN}/widgets/goal?twitch=streamer&kick=kickname`,
    );
  });

  it('writes every changed setting', () => {
    const url = new URL(buildGoalUrl(ORIGIN, CUSTOM, 'streamer', ''));
    expect(Object.fromEntries(url.searchParams)).toEqual({
      twitch: 'streamer',
      color: 'gold',
      title: 'ROAD TO 500',
      start: '431',
      target: '500',
      pops: '0',
    });
  });

  it('builds a preview that never names a channel and is paired with its page', () => {
    const url = new URL(buildGoalPreviewUrl(ORIGIN, CUSTOM, 'abc123'));
    expect(url.searchParams.get('simulate')).toBe('1');
    expect(url.searchParams.get('preview')).toBe('abc123');
    expect(url.searchParams.has('twitch')).toBe(false);
    expect(url.searchParams.has('simplatform')).toBe(false);
    expect(url.searchParams.get('target')).toBe('500');
    const kickOnly = new URL(buildGoalPreviewUrl(ORIGIN, { ...CUSTOM, platforms: 'kick' }, 'x'));
    expect(kickOnly.searchParams.get('simplatform')).toBe('kick');
  });
});

describe('readGoalSettings', () => {
  it('falls back to the defaults for missing or invalid values', () => {
    const params = new URLSearchParams('color=rainbow&start=-4&target=0&pops=maybe');
    const { platforms: _, ...defaults } = DEFAULT_GOAL_SETTINGS;
    expect(readGoalSettings(params)).toEqual({ ...defaults, pops: true });
  });

  it('rounds counts and holds them to the top of the scale', () => {
    const params = new URLSearchParams(`start=12.6&target=${MAX_GOAL_COUNT * 10}`);
    expect(readGoalSettings(params)).toMatchObject({ start: 13, target: MAX_GOAL_COUNT });
  });

  it('keeps an empty title, which hides it', () => {
    expect(readGoalSettings(new URLSearchParams('title=')).title).toBe('');
  });
});

describe('parseGoalUrl', () => {
  it('reads back what buildGoalUrl wrote', () => {
    expect(parseGoalUrl(buildGoalUrl(ORIGIN, CUSTOM, 'streamer', 'kicker'))).toEqual({
      settings: CUSTOM,
      twitchChannel: 'streamer',
      kickChannel: 'kicker',
    });
    expect(parseGoalUrl(`${ORIGIN}/widgets/goal?kick=kicker`)?.settings.platforms).toBe('kick');
  });

  it("returns null for text that isn't a Sub Goal URL", () => {
    expect(parseGoalUrl('not a url')).toBeNull();
    expect(parseGoalUrl(`${ORIGIN}/widgets/subathon?twitch=streamer`)).toBeNull();
  });
});
