import { describe, expect, it } from 'vitest';
import {
  buildGoalPreviewUrl,
  buildGoalUrl,
  DEFAULT_GOAL_SETTINGS,
  type GoalSettings,
  MAX_END_HOLD_SECONDS,
  MAX_GOAL_COUNT,
  parseGoalUrl,
  readGoalSettings,
  TITLE_MAX_LENGTH,
} from './goal-url';

const ORIGIN = 'https://extensions.senchabot.com';
const CUSTOM: GoalSettings = {
  platforms: 'both',
  preset: 'classic',
  style: 'thin',
  color: 'gold',
  title: 'ROAD TO 500',
  start: 431,
  target: 500,
  end: 'stay',
  endHold: 0,
  icon: '',
  iconUrl: '',
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
      style: 'thin',
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

  it('writes a preset instead of the color, which the preset brings', () => {
    const url = new URL(buildGoalUrl(ORIGIN, { ...CUSTOM, preset: 'rift' }, 'streamer', ''));
    expect(url.searchParams.get('preset')).toBe('rift');
    expect(url.searchParams.has('color')).toBe(false);
  });
});

describe('goal presets', () => {
  it('reads a known preset and drops an unknown one to classic', () => {
    expect(readGoalSettings(new URLSearchParams('preset=rift')).preset).toBe('rift');
    expect(readGoalSettings(new URLSearchParams('preset=nope')).preset).toBe('classic');
  });

  it('keeps the picked color through a preset, for going back to classic', () => {
    const parsed = parseGoalUrl(`${ORIGIN}/widgets/goal?twitch=s&preset=rift&color=gold`);
    expect(parsed?.settings).toMatchObject({ preset: 'rift', color: 'gold' });
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

  it('cuts a long title to the length the setup page allows', () => {
    const title = 'x'.repeat(TITLE_MAX_LENGTH + 10);
    expect(readGoalSettings(new URLSearchParams({ title })).title).toHaveLength(TITLE_MAX_LENGTH);
  });

  it('reads the off words in any case, and a goal of 1 at the least', () => {
    const settings = readGoalSettings(new URLSearchParams('pops=OFF&target=1&start=0'));
    expect(settings).toMatchObject({ pops: false, target: 1, start: 0 });
    expect(readGoalSettings(new URLSearchParams('target=0.4')).target).toBe(10);
  });

  it('keeps an empty title, which hides it', () => {
    expect(readGoalSettings(new URLSearchParams('title=')).title).toBe('');
  });

  it('writes the icon and emote image only when set, and reads them back', () => {
    const url = buildGoalUrl(
      ORIGIN,
      {
        ...DEFAULT_GOAL_SETTINGS,
        icon: '⭐',
        iconUrl: 'https://cdn.7tv.app/emote/e1/2x.webp',
      },
      'streamer',
      '',
    );
    expect(Object.fromEntries(new URL(url).searchParams)).toMatchObject({
      icon: '⭐',
      iconUrl: 'https://cdn.7tv.app/emote/e1/2x.webp',
    });
    expect(parseGoalUrl(url)?.settings).toMatchObject({
      icon: '⭐',
      iconUrl: 'https://cdn.7tv.app/emote/e1/2x.webp',
    });
  });
  it('writes the end behavior and hold only when set, and reads them back', () => {
    expect(
      Object.fromEntries(
        new URL(buildGoalUrl(ORIGIN, DEFAULT_GOAL_SETTINGS, 'streamer', '')).searchParams,
      ),
    ).toEqual({ twitch: 'streamer' });
    const url = buildGoalUrl(
      ORIGIN,
      { ...DEFAULT_GOAL_SETTINGS, end: 'hide', endHold: 90 },
      'streamer',
      '',
    );
    expect(Object.fromEntries(new URL(url).searchParams)).toMatchObject({
      end: 'hide',
      endHold: '90',
    });
    expect(parseGoalUrl(url)?.settings).toMatchObject({ end: 'hide', endHold: 90 });
  });

  it('falls back for a bad end value and clamps the hold', () => {
    expect(readGoalSettings(new URLSearchParams('end=maybe')).end).toBe('stay');
    expect(readGoalSettings(new URLSearchParams('endHold=99999')).endHold).toBe(
      MAX_END_HOLD_SECONDS,
    );
    expect(readGoalSettings(new URLSearchParams('endHold=-5')).endHold).toBe(
      DEFAULT_GOAL_SETTINGS.endHold,
    );
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

  it('reads back a title with URL characters, the top of the scale and a goal of 1', () => {
    const settings: GoalSettings = {
      ...CUSTOM,
      title: 'a&b=c %20 #1 ?',
      start: MAX_GOAL_COUNT,
      target: 1,
      pops: true,
    };
    expect(parseGoalUrl(buildGoalUrl(ORIGIN, settings, 'streamer', ''))?.settings).toEqual({
      ...settings,
      platforms: 'twitch',
    });
  });

  it("returns null for text that isn't a Sub Goal URL", () => {
    expect(parseGoalUrl('not a url')).toBeNull();
    expect(parseGoalUrl(`${ORIGIN}/widgets/subathon?twitch=streamer`)).toBeNull();
  });
});
