import { describe, expect, it } from 'vitest';
import {
  buildEmoteComboPreviewUrl,
  buildEmoteComboUrl,
  DEFAULT_EMOTE_COMBO_SETTINGS,
  EMOTE_COMBO_STAGE,
  type EmoteComboSettings,
  parseEmoteComboUrl,
  readEmoteComboSettings,
} from './emote-combo-url';
import { getWidget } from './widgets';

const ORIGIN = 'https://extensions.senchabot.com';
const CUSTOM: EmoteComboSettings = {
  platforms: 'both',
  preset: 'classic',
  color: 'cyan',
  window: 12,
  min: 5,
  size: 130,
  best: false,
  sevenTv: false,
  bttv: true,
  ffz: true,
};
const read = (query: string) => readEmoteComboSettings(new URLSearchParams(query));
const { platforms: _, ...DEFAULTS } = DEFAULT_EMOTE_COMBO_SETTINGS;

describe('buildEmoteComboUrl', () => {
  it('is empty until a channel on a picked platform is filled in', () => {
    expect(buildEmoteComboUrl(ORIGIN, DEFAULT_EMOTE_COMBO_SETTINGS, '', '', 'en')).toBe('');
    expect(
      buildEmoteComboUrl(
        ORIGIN,
        { ...DEFAULT_EMOTE_COMBO_SETTINGS, platforms: 'kick' },
        'me',
        '',
        'en',
      ),
    ).toBe('');
  });

  it('writes only the channels and the language for default settings', () => {
    const url = new URL(
      buildEmoteComboUrl(ORIGIN, DEFAULT_EMOTE_COMBO_SETTINGS, ' Streamer ', 'KickName', 'tr'),
    );
    expect(url.pathname).toBe('/widgets/emote-combo');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      twitch: 'streamer',
      kick: 'kickname',
      lang: 'tr',
    });
  });

  it('writes every changed setting', () => {
    const url = new URL(buildEmoteComboUrl(ORIGIN, CUSTOM, 'streamer', '', 'en'));
    expect(Object.fromEntries(url.searchParams)).toEqual({
      twitch: 'streamer',
      color: 'cyan',
      window: '12',
      min: '5',
      size: '130',
      best: '0',
      sevenTv: '0',
      bttv: '1',
      ffz: '1',
      lang: 'en',
    });
  });

  it('writes a preset instead of the color, which the preset brings', () => {
    const url = new URL(
      buildEmoteComboUrl(ORIGIN, { ...CUSTOM, preset: 'rift' }, 'streamer', '', 'en'),
    );
    expect(url.searchParams.get('preset')).toBe('rift');
    expect(url.searchParams.has('color')).toBe(false);
  });

  it('builds a preview that never names a channel and is paired with its page', () => {
    const url = new URL(buildEmoteComboPreviewUrl(ORIGIN, CUSTOM, 'de', 'abc123'));
    expect(url.searchParams.get('simulate')).toBe('1');
    expect(url.searchParams.get('preview')).toBe('abc123');
    expect(url.searchParams.has('twitch')).toBe(false);
    expect(url.searchParams.get('min')).toBe('5');
    expect(url.searchParams.get('lang')).toBe('de');
    const kickOnly = new URL(
      buildEmoteComboPreviewUrl(ORIGIN, { ...CUSTOM, platforms: 'kick' }, 'en', 'x'),
    );
    expect(kickOnly.searchParams.get('simplatform')).toBe('kick');
  });
});

describe('readEmoteComboSettings', () => {
  it('falls back to the defaults', () => {
    expect(read('')).toEqual(DEFAULTS);
  });

  it('reads every setting back', () => {
    const { platforms: __, ...custom } = CUSTOM;
    expect(read(new URL(buildEmoteComboUrl(ORIGIN, CUSTOM, 'me', '', 'en')).search)).toEqual(
      custom,
    );
  });

  it('clamps numbers into range and ignores garbage', () => {
    expect(read('window=1&min=1&size=10')).toMatchObject({ window: 3, min: 2, size: 50 });
    expect(read('window=99&min=99&size=999')).toMatchObject({ window: 30, min: 20, size: 150 });
    expect(read('window=soon&min=&size=big&color=plaid')).toMatchObject({
      window: 8,
      min: 3,
      size: 100,
      color: 'gold',
    });
  });

  it('reads the provider flags the way the Emote Wall writes them', () => {
    expect(read('sevenTv=false&bttv=true&ffz=true')).toMatchObject({
      sevenTv: false,
      bttv: true,
      ffz: true,
    });
  });
});

describe('parseEmoteComboUrl', () => {
  it('round-trips a built URL', () => {
    const url = buildEmoteComboUrl(ORIGIN, CUSTOM, 'streamer', 'kicker', 'fr');
    expect(parseEmoteComboUrl(url)).toEqual({
      settings: CUSTOM,
      twitchChannel: 'streamer',
      kickChannel: 'kicker',
      locale: 'fr',
    });
  });

  it('reads one channel as one platform', () => {
    const url = buildEmoteComboUrl(ORIGIN, CUSTOM, '', 'kicker', 'en');
    expect(parseEmoteComboUrl(url)?.settings.platforms).toBe('kick');
  });

  it('turns down other widgets and text that is no URL', () => {
    expect(parseEmoteComboUrl(`${ORIGIN}/widgets/emote-wall?twitch=me`)).toBeNull();
    expect(parseEmoteComboUrl('emote combo')).toBeNull();
  });
});

describe('EMOTE_COMBO_STAGE', () => {
  it('is the browser source size the registry recommends', () => {
    expect(EMOTE_COMBO_STAGE).toEqual(getWidget('emote-combo').sourceSize);
  });
});
