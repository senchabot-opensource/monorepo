import { describe, expect, it } from 'vitest';
import {
  buildFeaturedPreviewUrl,
  buildFeaturedUrl,
  DEFAULT_FEATURED_SETTINGS,
  FEATURED_STAGE,
  type FeaturedSettings,
  MAX_HIDE_SECONDS,
  MAX_SIZE,
  MIN_SIZE,
  parseFeaturedUrl,
  readFeaturedSettings,
} from './featured-url';
import { getWidget } from './widgets';

const ORIGIN = 'https://extensions.senchabot.com';
const CUSTOM: FeaturedSettings = {
  platforms: 'both',
  preset: 'classic',
  color: 'gold',
  mode: 'qa',
  hide: 45,
  waiting: false,
  size: 120,
};
const read = (query: string) => readFeaturedSettings(new URLSearchParams(query));
const { platforms: _, ...DEFAULTS } = DEFAULT_FEATURED_SETTINGS;

describe('buildFeaturedUrl', () => {
  it('is empty until a channel on a picked platform is filled in', () => {
    expect(buildFeaturedUrl(ORIGIN, DEFAULT_FEATURED_SETTINGS, '', '', 'en')).toBe('');
    expect(
      buildFeaturedUrl(ORIGIN, { ...DEFAULT_FEATURED_SETTINGS, platforms: 'kick' }, 'x', '', 'en'),
    ).toBe('');
  });

  it('writes only the channels and the language for default settings', () => {
    expect(buildFeaturedUrl(ORIGIN, DEFAULT_FEATURED_SETTINGS, ' Streamer ', 'Kicker', 'tr')).toBe(
      `${ORIGIN}/widgets/featured?twitch=streamer&kick=kicker&lang=tr`,
    );
  });

  it('writes every changed setting', () => {
    const url = new URL(buildFeaturedUrl(ORIGIN, CUSTOM, 'streamer', '', 'en'));
    expect(Object.fromEntries(url.searchParams)).toEqual({
      twitch: 'streamer',
      color: 'gold',
      mode: 'qa',
      hide: '45',
      waiting: '0',
      size: '120',
      lang: 'en',
    });
  });

  it('builds a preview that never names a channel and is paired with its page', () => {
    const url = new URL(
      buildFeaturedPreviewUrl(ORIGIN, { ...CUSTOM, platforms: 'kick' }, 'de', 'abc'),
    );
    expect(url.pathname).toBe('/widgets/featured');
    expect(url.searchParams.get('simulate')).toBe('1');
    expect(url.searchParams.get('preview')).toBe('abc');
    expect(url.searchParams.get('simplatform')).toBe('kick');
    expect(url.searchParams.has('twitch')).toBe(false);
    expect(url.searchParams.get('lang')).toBe('de');
  });

  it('writes a preset instead of the color, which the preset brings', () => {
    const url = new URL(buildFeaturedUrl(ORIGIN, { ...CUSTOM, preset: 'rift' }, 'x', '', 'en'));
    expect(url.searchParams.get('preset')).toBe('rift');
    expect(url.searchParams.has('color')).toBe(false);
  });
});

describe('readFeaturedSettings', () => {
  it('reads the defaults from an empty URL', () => {
    expect(read('')).toEqual(DEFAULTS);
  });

  it('falls back to the defaults for garbage params', () => {
    expect(read('color=teal&mode=all&hide=-3&size=big&preset=nope')).toEqual(DEFAULTS);
  });

  it('keeps the hide timer and the size in range', () => {
    expect(read('hide=99999').hide).toBe(MAX_HIDE_SECONDS);
    expect(read('size=10').size).toBe(MIN_SIZE);
    expect(read('size=400').size).toBe(MAX_SIZE);
  });

  it('turns the waiting badge off with any off word', () => {
    expect(read('waiting=0').waiting).toBe(false);
    expect(read('waiting=off').waiting).toBe(false);
    expect(read('waiting=1').waiting).toBe(true);
  });
});

describe('parseFeaturedUrl', () => {
  it('reads back what buildFeaturedUrl wrote, with its language', () => {
    const parsed = parseFeaturedUrl(buildFeaturedUrl(ORIGIN, CUSTOM, 'Streamer', 'kicker', 'ja'));
    expect(parsed).toEqual({
      settings: CUSTOM,
      twitchChannel: 'streamer',
      kickChannel: 'kicker',
      locale: 'ja',
    });
  });

  it('reads one channel as one platform', () => {
    const parsed = parseFeaturedUrl(`${ORIGIN}/widgets/featured?kick=kicker`);
    expect(parsed?.settings.platforms).toBe('kick');
    expect(parsed?.locale).toBeNull();
  });

  it('rejects other widgets and text that is no URL', () => {
    expect(parseFeaturedUrl(`${ORIGIN}/widgets/queue?twitch=x`)).toBeNull();
    expect(parseFeaturedUrl('featured')).toBeNull();
  });
});

describe('FEATURED_STAGE', () => {
  it('is the browser source size the registry recommends', () => {
    expect(getWidget('featured').sourceSize).toEqual(FEATURED_STAGE);
  });
});
