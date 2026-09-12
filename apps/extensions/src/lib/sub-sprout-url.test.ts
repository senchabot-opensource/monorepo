import { describe, expect, it } from 'vitest';
import {
  buildSubSproutPreviewUrl,
  buildSubSproutUrl,
  DEFAULT_SUB_SPROUT_SETTINGS,
  parseSubSproutUrl,
  type SubSproutSettings,
} from './sub-sprout-url';

const ORIGIN = 'https://extensions.senchabot.com';
const WIDGET = `${ORIGIN}/widgets/sub-sprout-widget`;

const url = (overrides: Partial<SubSproutSettings>, twitch = 'Sencha', kick = '') =>
  buildSubSproutUrl(ORIGIN, { ...DEFAULT_SUB_SPROUT_SETTINGS, ...overrides }, twitch, kick);

const roundTrip = (text: string) => {
  const parsed = parseSubSproutUrl(text);
  if (!parsed) throw new Error(`not parsed: ${text}`);
  return buildSubSproutUrl(ORIGIN, parsed.settings, parsed.twitchChannel, parsed.kickChannel);
};

describe('buildSubSproutUrl', () => {
  it('omits every setting that equals the widget default', () => {
    expect(url({})).toBe(`${WIDGET}?twitch=sencha`);
  });

  it('writes countfx=0 and potlabel=1 only when changed from the default', () => {
    expect(
      url(
        {
          variety: 'rose',
          pick: 'cycle',
          water: 'rain',
          countFx: false,
          potLabel: true,
        },
        ' Sencha ',
        'Kicker',
      ),
    ).toBe(
      `${WIDGET}?twitch=sencha&kick=kicker&variety=rose&pick=cycle&water=rain&countfx=0&potlabel=1`,
    );
  });

  it('is empty until a channel on a picked platform is filled in', () => {
    expect(url({}, '', '')).toBe('');
    expect(url({}, '   ', '')).toBe('');
    expect(url({ platforms: 'kick' }, 'sencha', '')).toBe('');
    expect(url({ platforms: 'twitch' }, '', 'kicker')).toBe('');
  });

  it('drops the channel of the platform that is not picked', () => {
    expect(url({ platforms: 'kick' }, 'sencha', 'kicker')).toBe(`${WIDGET}?kick=kicker`);
    expect(url({ platforms: 'twitch' }, 'sencha', 'kicker')).toBe(`${WIDGET}?twitch=sencha`);
  });

  it('never carries simulate', () => {
    expect(url({ variety: 'lotus' })).not.toContain('simulate');
  });
});

describe('buildSubSproutPreviewUrl', () => {
  it('always simulates and never names a channel', () => {
    expect(buildSubSproutPreviewUrl(ORIGIN, DEFAULT_SUB_SPROUT_SETTINGS)).toBe(
      `${WIDGET}?simulate=1`,
    );
    expect(
      buildSubSproutPreviewUrl(ORIGIN, {
        ...DEFAULT_SUB_SPROUT_SETTINGS,
        variety: 'cactus',
        countFx: false,
      }),
    ).toBe(`${WIDGET}?variety=cactus&countfx=0&simulate=1`);
  });

  it('adds simspeed only when the preview is sped up', () => {
    expect(buildSubSproutPreviewUrl(ORIGIN, DEFAULT_SUB_SPROUT_SETTINGS, 1)).toBe(
      `${WIDGET}?simulate=1`,
    );
    expect(buildSubSproutPreviewUrl(ORIGIN, DEFAULT_SUB_SPROUT_SETTINGS, 5)).toBe(
      `${WIDGET}?simulate=1&simspeed=5`,
    );
  });
});

describe('parseSubSproutUrl', () => {
  it('rejects text that is not a Sub Sprout URL', () => {
    expect(parseSubSproutUrl('')).toBeNull();
    expect(parseSubSproutUrl('sencha')).toBeNull();
    expect(parseSubSproutUrl(`${ORIGIN}/widgets/emote-wall?twitch=sencha`)).toBeNull();
    expect(parseSubSproutUrl(`${ORIGIN}/setup/sub-growing-plant`)).toBeNull();
  });

  it('accepts any origin, a trailing slash and surrounding whitespace', () => {
    expect(
      parseSubSproutUrl('  http://localhost:3000/widgets/sub-sprout-widget/?kick=a  '),
    ).toMatchObject({ kickChannel: 'a', settings: { platforms: 'kick' } });
  });

  it('loads the defaults for a URL with only channels', () => {
    expect(parseSubSproutUrl(`${WIDGET}?twitch=foo&kick=bar`)).toEqual({
      settings: DEFAULT_SUB_SPROUT_SETTINGS,
      twitchChannel: 'foo',
      kickChannel: 'bar',
    });
  });

  it('restores every setting the setup page writes', () => {
    const settings: SubSproutSettings = {
      platforms: 'twitch',
      variety: 'vine',
      pick: 'random',
      water: 'sparkle',
      countFx: false,
      potLabel: true,
    };
    expect(parseSubSproutUrl(buildSubSproutUrl(ORIGIN, settings, 'foo', ''))).toEqual({
      settings,
      twitchChannel: 'foo',
      kickChannel: '',
    });
  });

  it('reads the legacy channel and platform pair', () => {
    expect(parseSubSproutUrl(`${WIDGET}?channel=Foo`)).toMatchObject({
      twitchChannel: 'Foo',
      kickChannel: '',
      settings: { platforms: 'twitch' },
    });
    expect(parseSubSproutUrl(`${WIDGET}?channel=bar&platform=kick`)).toMatchObject({
      twitchChannel: '',
      kickChannel: 'bar',
      settings: { platforms: 'kick' },
    });
    expect(parseSubSproutUrl(`${WIDGET}?channel=foo&platform=youtube`)).toMatchObject({
      twitchChannel: 'foo',
    });
    expect(roundTrip(`${WIDGET}?channel=bar&platform=kick&variety=rose`)).toBe(
      `${WIDGET}?kick=bar&variety=rose`,
    );
  });

  it('prefers twitch and kick over the legacy channel', () => {
    expect(parseSubSproutUrl(`${WIDGET}?channel=old&twitch=new`)).toMatchObject({
      twitchChannel: 'new',
      kickChannel: '',
    });
    expect(parseSubSproutUrl(`${WIDGET}?channel=old&platform=kick&kick=new`)).toMatchObject({
      kickChannel: 'new',
    });
  });

  it('reads flags the way the widget does', () => {
    const settingsOf = (query: string) =>
      parseSubSproutUrl(`${WIDGET}?twitch=foo&${query}`)?.settings;
    expect(settingsOf('countfx=false&potlabel=true')).toMatchObject({
      countFx: false,
      potLabel: true,
    });
    expect(settingsOf('countfx=1&potlabel=off')).toMatchObject({ countFx: true, potLabel: false });
  });

  it('falls back to defaults for values the widget would not accept', () => {
    expect(
      parseSubSproutUrl(`${WIDGET}?twitch=foo&variety=oak&pick=shuffle&water=snow`)?.settings,
    ).toEqual({ ...DEFAULT_SUB_SPROUT_SETTINGS, platforms: 'twitch' });
  });

  it('drops simulate and unknown params', () => {
    expect(roundTrip(`${WIDGET}?twitch=foo&simulate=1&lang=tr`)).toBe(`${WIDGET}?twitch=foo`);
  });

  it('rebuilds the same URL it was given', () => {
    const urls = [
      `${WIDGET}?twitch=foo`,
      `${WIDGET}?kick=bar&variety=sunflower`,
      `${WIDGET}?twitch=foo&kick=bar&pick=cycle&water=rain`,
      `${WIDGET}?twitch=foo&variety=vine&pick=random&countfx=0`,
      `${WIDGET}?kick=bar&variety=palm&water=sparkle&potlabel=1`,
      `${WIDGET}?twitch=foo&kick=bar&variety=rose&pick=cycle&water=rain&countfx=0&potlabel=1`,
    ];
    for (const text of urls) expect(roundTrip(text)).toBe(text);
  });
});
