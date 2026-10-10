import { describe, expect, it } from 'vitest';
import {
  buildFollowerGoalPreviewUrl,
  buildFollowerGoalUrl,
  DEFAULT_FOLLOWER_GOAL_SETTINGS,
  type FollowerGoalSettings,
  MAX_END_HOLD_SECONDS,
  MAX_FOLLOWER_GOAL_COUNT,
  parseFollowerGoalUrl,
  readFollowerGoalSettings,
  TITLE_MAX_LENGTH,
} from './follower-goal-url';

const ORIGIN = 'https://extensions.senchabot.com';
const CUSTOM: FollowerGoalSettings = {
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

describe('buildFollowerGoalUrl', () => {
  it('is empty until a channel on a picked platform is filled in', () => {
    expect(buildFollowerGoalUrl(ORIGIN, DEFAULT_FOLLOWER_GOAL_SETTINGS, '', '')).toBe('');
    expect(
      buildFollowerGoalUrl(
        ORIGIN,
        { ...DEFAULT_FOLLOWER_GOAL_SETTINGS, platforms: 'kick' },
        'streamer',
        '',
      ),
    ).toBe('');
  });

  it('writes channels and token', () => {
    expect(
      buildFollowerGoalUrl(
        ORIGIN,
        DEFAULT_FOLLOWER_GOAL_SETTINGS,
        ' Streamer ',
        'KickName',
        'valid-token',
      ),
    ).toBe(`${ORIGIN}/widgets/follower-goal?twitch=streamer&kick=kickname&token=valid-token`);
  });

  it('writes every changed setting', () => {
    const url = new URL(buildFollowerGoalUrl(ORIGIN, CUSTOM, 'streamer', '', 'jwt.token.val'));
    expect(Object.fromEntries(url.searchParams)).toEqual({
      twitch: 'streamer',
      style: 'thin',
      color: 'gold',
      title: 'ROAD TO 500',
      start: '431',
      target: '500',
      pops: '0',
      token: 'jwt.token.val',
    });
  });

  it('builds a preview that never names a channel and is paired with its page', () => {
    const url = new URL(buildFollowerGoalPreviewUrl(ORIGIN, CUSTOM, 'abc123'));
    expect(url.searchParams.get('simulate')).toBe('1');
    expect(url.searchParams.get('preview')).toBe('abc123');
    expect(url.searchParams.has('twitch')).toBe(false);
    expect(url.searchParams.has('token')).toBe(false);
    expect(url.searchParams.get('target')).toBe('500');
  });
});

describe('follower goal presets', () => {
  it('reads a known preset and drops an unknown one to classic', () => {
    expect(readFollowerGoalSettings(new URLSearchParams('preset=rift')).preset).toBe('rift');
    expect(readFollowerGoalSettings(new URLSearchParams('preset=nope')).preset).toBe('classic');
  });

  it('keeps the picked color through a preset, for going back to classic', () => {
    const parsed = parseFollowerGoalUrl(
      `${ORIGIN}/widgets/follower-goal?twitch=s&preset=rift&color=gold&token=xyz`,
    );
    expect(parsed?.settings).toMatchObject({ preset: 'rift', color: 'gold' });
    expect(parsed?.token).toBe('xyz');
  });
});

describe('readFollowerGoalSettings', () => {
  it('falls back to the defaults for missing or invalid values', () => {
    const params = new URLSearchParams('color=rainbow&start=-4&target=0&pops=maybe');
    const { platforms: _, ...defaults } = DEFAULT_FOLLOWER_GOAL_SETTINGS;
    expect(readFollowerGoalSettings(params)).toEqual({ ...defaults, pops: true });
  });

  it('rounds counts and holds them to the top of the scale', () => {
    const params = new URLSearchParams(`start=12.6&target=${MAX_FOLLOWER_GOAL_COUNT * 10}`);
    expect(readFollowerGoalSettings(params)).toMatchObject({
      start: 13,
      target: MAX_FOLLOWER_GOAL_COUNT,
    });
  });

  it('cuts a long title to the length the setup page allows', () => {
    const title = 'x'.repeat(TITLE_MAX_LENGTH + 10);
    const params = new URLSearchParams(`title=${title}`);
    expect(readFollowerGoalSettings(params).title).toBe(title.slice(0, TITLE_MAX_LENGTH));
  });

  it('limits custom icons and allows emote URLs', () => {
    const params = new URLSearchParams('icon=⭐⭐⭐ExtraGlyphs&iconUrl=https://cdn.example/emote.png');
    const settings = readFollowerGoalSettings(params);
    expect(settings.icon).toBe('⭐⭐⭐Extra');
    expect(settings.iconUrl).toBe('https://cdn.example/emote.png');
  });

  it('caps the end hold seconds', () => {
    const params = new URLSearchParams(`end=hide&endHold=${MAX_END_HOLD_SECONDS * 2}`);
    expect(readFollowerGoalSettings(params)).toMatchObject({
      end: 'hide',
      endHold: MAX_END_HOLD_SECONDS,
    });
  });
});

describe('parseFollowerGoalUrl', () => {
  it('returns null for an unrelated widget URL', () => {
    expect(parseFollowerGoalUrl(`${ORIGIN}/widgets/chat-widget?twitch=streamer`)).toBeNull();
    expect(parseFollowerGoalUrl('not a url')).toBeNull();
  });

  it('reads channels and token from a full URL', () => {
    const parsed = parseFollowerGoalUrl(
      `${ORIGIN}/widgets/follower-goal?twitch=streamer&kick=kickname&token=secret123`,
    );
    expect(parsed?.twitchChannel).toBe('streamer');
    expect(parsed?.kickChannel).toBe('kickname');
    expect(parsed?.token).toBe('secret123');
    expect(parsed?.settings.platforms).toBe('both');
  });
});
