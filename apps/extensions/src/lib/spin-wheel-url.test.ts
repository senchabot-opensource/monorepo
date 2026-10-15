import { describe, expect, it } from 'vitest';
import {
  buildSpinWheelPreviewUrl,
  buildSpinWheelUrl,
  DEFAULT_SPIN_WHEEL_SETTINGS,
  parseSpinWheelUrl,
  readSpinWheelSettings,
  type SpinWheelSettings,
} from './spin-wheel-url';

const ORIGIN = 'https://extensions.senchabot.com';
const settings = (overrides: Partial<SpinWheelSettings> = {}) => ({
  ...DEFAULT_SPIN_WHEEL_SETTINGS,
  ...overrides,
});

describe('buildSpinWheelUrl', () => {
  it('is empty until a picked platform has a channel', () => {
    expect(buildSpinWheelUrl(ORIGIN, settings(), '', '', 'en')).toBe('');
    expect(buildSpinWheelUrl(ORIGIN, settings({ platforms: 'kick' }), 'Streamer', '', 'en')).toBe(
      '',
    );
  });

  it('writes only what differs from the defaults, and always the language', () => {
    expect(buildSpinWheelUrl(ORIGIN, settings(), ' Streamer ', 'kicker', 'tr')).toBe(
      `${ORIGIN}/widgets/spin-wheel?twitch=streamer&kick=kicker&lang=tr`,
    );
  });

  it('writes the options without blanks, and drops a lone option', () => {
    const url = buildSpinWheelUrl(
      ORIGIN,
      settings({ options: ['Zelda', ' ', 'Mario Kart'] }),
      's',
      '',
      'en',
    );
    expect(new URL(url).searchParams.get('o')).toBe('Zelda|Mario Kart');

    const lone = buildSpinWheelUrl(ORIGIN, settings({ options: ['Solo', ' '] }), 's', '', 'en');
    expect(new URL(lone).searchParams.has('o')).toBe(false);
  });

  it('keeps the weight shorthand as written, and counts its slices', () => {
    const url = buildSpinWheelUrl(ORIGIN, settings({ options: ['2x Tetris'] }), 's', '', 'en');
    expect(new URL(url).searchParams.get('o')).toBe('2x Tetris');
  });

  it('writes a changed cooldown and permission', () => {
    const url = buildSpinWheelUrl(
      ORIGIN,
      settings({ cooldownSec: 0, permission: 'subs' }),
      's',
      '',
      'en',
    );
    const params = new URL(url).searchParams;
    expect(params.get('cd')).toBe('0');
    expect(params.get('perm')).toBe('subs');
  });

  it('writes sound=0 when muted, and nothing when on', () => {
    const muted = buildSpinWheelUrl(ORIGIN, settings({ sound: false }), 's', '', 'en');
    expect(new URL(muted).searchParams.get('sound')).toBe('0');
    const loud = buildSpinWheelUrl(ORIGIN, settings(), 's', '', 'en');
    expect(new URL(loud).searchParams.has('sound')).toBe(false);
  });
});

describe('two-color wheel', () => {
  const colorsParam = (overrides: Partial<SpinWheelSettings>) =>
    new URL(buildSpinWheelUrl(ORIGIN, settings(overrides), 's', '', 'en')).searchParams.get(
      'colors',
    );

  it('is off in the classic look and on with a preset, unless the URL says otherwise', () => {
    expect(readSpinWheelSettings(new URLSearchParams('')).twoColors).toBe(false);
    expect(readSpinWheelSettings(new URLSearchParams('preset=rift')).twoColors).toBe(true);
    expect(readSpinWheelSettings(new URLSearchParams('colors=2')).twoColors).toBe(true);
    expect(readSpinWheelSettings(new URLSearchParams('preset=rift&colors=all')).twoColors).toBe(
      false,
    );
    // An unknown preset is classic, so it keeps every color.
    expect(readSpinWheelSettings(new URLSearchParams('preset=gone')).twoColors).toBe(false);
    expect(readSpinWheelSettings(new URLSearchParams('preset=rift&colors=3')).twoColors).toBe(true);
  });

  it("writes colors only against the look's default", () => {
    expect(colorsParam({})).toBeNull();
    expect(colorsParam({ twoColors: true })).toBe('2');
    expect(colorsParam({ preset: 'rift', twoColors: true })).toBeNull();
    expect(colorsParam({ preset: 'rift', twoColors: false })).toBe('all');
  });

  it('reads back either choice with a preset', () => {
    for (const twoColors of [true, false]) {
      const url = buildSpinWheelUrl(
        ORIGIN,
        settings({ preset: 'storm', twoColors }),
        's',
        '',
        'en',
      );
      expect(parseSpinWheelUrl(url)?.settings.twoColors).toBe(twoColors);
    }
  });
});

describe('spin wheel presets', () => {
  it('writes a preset, and nothing for classic', () => {
    const url = new URL(buildSpinWheelUrl(ORIGIN, settings({ preset: 'rift' }), 's', '', 'en'));
    expect(url.searchParams.get('preset')).toBe('rift');
    expect(buildSpinWheelUrl(ORIGIN, settings(), 's', '', 'en')).not.toContain('preset=');
  });

  it('reads a known preset and drops an unknown one to classic', () => {
    expect(readSpinWheelSettings(new URLSearchParams('preset=Blocks')).preset).toBe('blocks');
    expect(readSpinWheelSettings(new URLSearchParams('preset=nope')).preset).toBe('classic');
    expect(
      parseSpinWheelUrl(`${ORIGIN}/widgets/spin-wheel?twitch=s&preset=agent`)?.settings,
    ).toMatchObject({ preset: 'agent' });
  });

  it('carries the preset into the preview', () => {
    const url = buildSpinWheelPreviewUrl(ORIGIN, settings({ preset: 'storm' }), 'en', 'abc');
    expect(new URL(url).searchParams.get('preset')).toBe('storm');
  });
});

describe('spin wheel URL round trip', () => {
  it('reads back every setting', () => {
    const custom = settings({
      platforms: 'twitch',
      options: ['Zelda', 'Mario Kart', 'Tetris'],
      cooldownSec: 60,
      permission: 'mods',
      sound: false,
      twoColors: true,
      preset: 'pizza',
    });
    const url = buildSpinWheelUrl(ORIGIN, custom, 'streamer', '', 'tr');
    expect(parseSpinWheelUrl(url)).toEqual({
      settings: custom,
      twitchChannel: 'streamer',
      kickChannel: '',
      locale: 'tr',
    });
  });

  it('falls back for a bad cooldown and permission', () => {
    const params = new URLSearchParams('o=A|B&cd=abc&perm=vip&lang=en');
    expect(readSpinWheelSettings(params)).toEqual({
      options: ['A', 'B'],
      cooldownSec: DEFAULT_SPIN_WHEEL_SETTINGS.cooldownSec,
      permission: 'all',
      sound: true,
      twoColors: false,
      preset: 'classic',
    });
  });

  it('rejects anything that is not a spin wheel URL', () => {
    expect(parseSpinWheelUrl('https://extensions.senchabot.com/widgets/poll?twitch=s')).toBeNull();
    expect(parseSpinWheelUrl('not a url')).toBeNull();
  });

  it('plays the preview without channels', () => {
    const url = buildSpinWheelPreviewUrl(ORIGIN, settings({ options: ['A', 'B'] }), 'en', 'abc');
    const params = new URL(url).searchParams;
    expect(params.get('simulate')).toBe('1');
    expect(params.get('preview')).toBe('abc');
    expect(params.get('o')).toBe('A|B');
    expect(params.has('twitch')).toBe(false);
  });
});
