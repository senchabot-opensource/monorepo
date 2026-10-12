import { describe, expect, it } from 'vitest';
import {
  buildHudPreviewUrl,
  buildHudUrl,
  DEFAULT_HUD_SETTINGS,
  type HudSettings,
  isTimeZone,
  MAX_EVENT_MONEY,
  MAX_MONEY,
  parseHudUrl,
  readHudSettings,
} from './irl-hud-url';

const ORIGIN = 'https://extensions.senchabot.com';
const settings = (overrides: Partial<HudSettings> = {}): HudSettings => ({
  ...DEFAULT_HUD_SETTINGS,
  ...overrides,
});
const read = (query: string) => readHudSettings(new URLSearchParams(query));

describe('buildHudUrl', () => {
  it('is empty until a channel is filled in', () => {
    expect(buildHudUrl(ORIGIN, settings(), '', '')).toBe('');
    expect(buildHudUrl(ORIGIN, settings({ platforms: 'kick' }), 'streamer', '')).toBe('');
  });

  it('writes only the channels at the defaults', () => {
    expect(buildHudUrl(ORIGIN, settings(), ' Streamer ', 'Kicker')).toBe(
      `${ORIGIN}/widgets/irl-hud?twitch=streamer&kick=kicker`,
    );
  });

  it('writes every changed setting and reads it back the same', () => {
    const changed = settings({
      platforms: 'both',
      style: 'modern',
      corner: 'bl',
      size: 150,
      start: 350,
      tsub: 500,
      tgift: 250,
      bits: 0,
      traid: 5,
      ksub: 300,
      kgift: 200,
      kicks: 40,
      kraid: 0,
      tiers: false,
      clock: false,
      h12: true,
      tz: 'Europe/Istanbul',
      radar: true,
      radarCorner: 'tr',
      map: 'real',
      lat: 41.02561,
      lon: 28.97436,
      pops: false,
    });
    const url = buildHudUrl(ORIGIN, changed, 'streamer', 'kicker');
    expect(url).toContain('style=modern');
    expect(url).toContain('radarCorner=tr');
    expect(url).toContain('map=real&lat=41.02561&lon=28.97436');
    expect(url).toContain('tz=Europe%2FIstanbul');
    expect(parseHudUrl(url)).toEqual({
      twitchChannel: 'streamer',
      kickChannel: 'kicker',
      settings: changed,
    });
  });

  it('leaves the mini-map settings out while the mini-map is off', () => {
    const off = settings({ radar: false, radarCorner: 'tr', map: 'real', lat: 1, lon: 2 });
    expect(buildHudUrl(ORIGIN, off, 'x', '')).toBe(`${ORIGIN}/widgets/irl-hud?twitch=x&radar=0`);
  });

  it('writes a place only for the real map, rounded to about a meter', () => {
    const park = settings({ map: 'park', lat: 41, lon: 29 });
    expect(buildHudUrl(ORIGIN, park, 'x', '')).toBe(`${ORIGIN}/widgets/irl-hud?twitch=x&map=park`);
    const real = settings({ map: 'real', lat: 41.0256149, lon: -0.123456789 });
    expect(buildHudUrl(ORIGIN, real, 'x', '')).toContain('lat=41.02561&lon=-0.12346');
    // Without a place yet the real map is asked for anyway; the overlay walks the city until then.
    expect(buildHudUrl(ORIGIN, settings({ map: 'real' }), 'x', '')).toBe(
      `${ORIGIN}/widgets/irl-hud?twitch=x&map=real`,
    );
  });

  it('makes a preview that simulates and never names a channel', () => {
    const url = new URL(buildHudPreviewUrl(ORIGIN, settings({ platforms: 'kick' }), 'abc'));
    expect(url.pathname).toBe('/widgets/irl-hud');
    expect(url.searchParams.get('simulate')).toBe('1');
    expect(url.searchParams.get('preview')).toBe('abc');
    expect(url.searchParams.get('simplatform')).toBe('kick');
    expect(url.searchParams.has('twitch')).toBe(false);
  });
});

describe('readHudSettings', () => {
  it('falls back to the defaults for missing or broken values', () => {
    const { platforms: _, ...defaults } = DEFAULT_HUD_SETTINGS;
    expect(read('')).toEqual(defaults);
    expect(
      read(
        'style=neon&corner=middle&radarCorner=up&map=moon&size=big&start=lots&tsub=x&tz=Mars/Base',
      ),
    ).toEqual(defaults);
  });

  it('clamps numbers into range', () => {
    expect(read('size=10').size).toBe(50);
    expect(read('size=900').size).toBe(200);
    expect(read('start=-500').start).toBe(0);
    expect(read('start=5000000000').start).toBe(MAX_MONEY);
    expect(read('tsub=99999999').tsub).toBe(MAX_EVENT_MONEY);
    expect(read('bits=12.6').bits).toBe(13);
  });

  it('reads a place only as a whole, valid latitude and longitude', () => {
    expect(read('map=real&lat=41.0256&lon=28.9744')).toMatchObject({ lat: 41.0256, lon: 28.9744 });
    expect(read('lat=41&lon=').lat).toBeNull();
    expect(read('lat=95&lon=10')).toMatchObject({ lat: null, lon: null });
    expect(read('lat=10&lon=-181')).toMatchObject({ lat: null, lon: null });
    expect(read('lat=north&lon=10').lat).toBeNull();
  });

  it('reads flags the way the other widgets do', () => {
    expect(read('clock=0&radar=off&pops=false&h12=1&tiers=no')).toMatchObject({
      clock: false,
      radar: false,
      pops: false,
      h12: true,
      tiers: false,
    });
  });
});

describe('parseHudUrl', () => {
  it('rejects other widgets and text that is not a URL', () => {
    expect(parseHudUrl(`${ORIGIN}/widgets/subathon?twitch=streamer`)).toBeNull();
    expect(parseHudUrl('irl hud')).toBeNull();
  });

  it('picks the platform from the channels it has', () => {
    expect(parseHudUrl(`${ORIGIN}/widgets/irl-hud?kick=kicker`)?.settings.platforms).toBe('kick');
  });
});

describe('isTimeZone', () => {
  it('knows IANA zones and nothing else', () => {
    expect(isTimeZone('Asia/Tokyo')).toBe(true);
    expect(isTimeZone('UTC')).toBe(true);
    expect(isTimeZone('')).toBe(false);
    expect(isTimeZone('Mars/Base')).toBe(false);
  });
});
