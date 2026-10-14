import { describe, expect, it } from 'vitest';
import {
  buildWeatherPreviewUrl,
  buildWeatherUrl,
  DEFAULT_WEATHER_SETTINGS,
  MAX_SIZE,
  parseWeatherUrl,
  readWeatherSettings,
  WEATHER_SETUP_SETTINGS,
  type WeatherSettings,
  weatherHudStyle,
} from './weather-url';

const ORIGIN = 'https://extensions.senchabot.com';
const ISTANBUL = { lat: 41.0082, lon: 28.9784 };
const settings = (overrides: Partial<WeatherSettings> = {}): WeatherSettings => ({
  ...DEFAULT_WEATHER_SETTINGS,
  ...ISTANBUL,
  ...overrides,
});
const params = (url: string) => Object.fromEntries(new URL(url).searchParams);

describe('buildWeatherUrl', () => {
  it('stays empty until a place is picked, since it needs no channel', () => {
    expect(buildWeatherUrl(ORIGIN, DEFAULT_WEATHER_SETTINGS, 'en')).toBe('');
    expect(buildWeatherUrl(ORIGIN, settings(), 'en')).toBe(
      `${ORIGIN}/widgets/weather?lat=41.0082&lon=28.9784&lang=en`,
    );
  });

  it('writes coordinates with at most four decimals, as MET Norway asks', () => {
    const url = buildWeatherUrl(ORIGIN, settings({ lat: 41.008238, lon: -28.97843 }), 'en');
    expect(params(url)).toMatchObject({ lat: '41.0082', lon: '-28.9784' });
  });

  it('writes only what differs from the defaults, and always the language', () => {
    const url = buildWeatherUrl(
      ORIGIN,
      settings({
        place: '  Kadıköy ',
        units: 'imperial',
        style: 'retro',
        layout: 'pill',
        theme: 'clear',
        corner: 'br',
        size: 150,
        details: false,
        forecast: 'days',
        h12: true,
        tz: 'Europe/Istanbul',
      }),
      'tr',
    );
    expect(params(url)).toEqual({
      lat: '41.0082',
      lon: '28.9784',
      place: 'Kadıköy',
      units: 'imperial',
      style: 'retro',
      layout: 'pill',
      theme: 'clear',
      corner: 'br',
      size: '150',
      details: '0',
      forecast: 'days',
      h12: '1',
      tz: 'Europe/Istanbul',
      lang: 'tr',
    });
  });

  it('leaves the style out for a card, which always looks like a weather app', () => {
    const card = settings({ style: 'retro' });
    expect(params(buildWeatherUrl(ORIGIN, card, 'en')).style).toBeUndefined();
    expect(weatherHudStyle(card)).toBeNull();
    expect(weatherHudStyle({ ...card, layout: 'pill' })).toBe('retro');
  });
});

describe('buildWeatherPreviewUrl', () => {
  it('shows sample weather until a place is picked, then the real one', () => {
    const before = params(buildWeatherPreviewUrl(ORIGIN, DEFAULT_WEATHER_SETTINGS, 'en', 'abc'));
    expect(before).toMatchObject({ demo: '1', preview: 'abc', lang: 'en' });
    const after = params(buildWeatherPreviewUrl(ORIGIN, settings(), 'en', 'abc'));
    expect(after).toMatchObject({ lat: '41.0082', preview: 'abc' });
    expect(after.demo).toBeUndefined();
  });
});

describe('readWeatherSettings', () => {
  it('reads nothing as the defaults', () => {
    expect(readWeatherSettings(new URLSearchParams())).toEqual(DEFAULT_WEATHER_SETTINGS);
  });

  it('keeps a URL without a layout on the card, while the setup page starts on the pill', () => {
    // URLs made before the setup page started on the pill have no `layout` and show a card.
    expect(readWeatherSettings(new URLSearchParams('lat=41.0082&lon=28.9784')).layout).toBe('card');
    const url = buildWeatherUrl(ORIGIN, { ...WEATHER_SETUP_SETTINGS, ...ISTANBUL }, 'en');
    expect(params(url).layout).toBe('pill');
    expect(readWeatherSettings(new URL(url).searchParams)).toEqual({
      ...WEATHER_SETUP_SETTINGS,
      ...ISTANBUL,
    });
  });

  it('never half-reads a place', () => {
    const read = (query: string) => readWeatherSettings(new URLSearchParams(query));
    expect(read('lat=41.0082')).toMatchObject({ lat: null, lon: null });
    expect(read('lat=91&lon=28')).toMatchObject({ lat: null, lon: null });
    expect(read('lat=abc&lon=28')).toMatchObject({ lat: null, lon: null });
    expect(read('lat=-33.86882&lon=151.20929')).toMatchObject({ lat: -33.8688, lon: 151.2093 });
  });

  it('falls back on garbage and clamps the size', () => {
    const read = readWeatherSettings(
      new URLSearchParams(
        `units=kelvin&style=gold&layout=huge&theme=neon&corner=middle&forecast=weeks&size=999&tz=Mars/Base&place=${'x'.repeat(60)}`,
      ),
    );
    expect(read).toMatchObject({
      units: 'metric',
      style: 'app',
      layout: 'card',
      theme: 'dark',
      corner: 'tl',
      forecast: 'hours',
      size: MAX_SIZE,
      tz: '',
    });
    expect(read.place).toHaveLength(40);
  });
});

describe('parseWeatherUrl', () => {
  it('reads back what buildWeatherUrl wrote, language included', () => {
    const picked = settings({
      place: 'Kadıköy',
      units: 'imperial',
      style: 'modern',
      layout: 'pill',
      forecast: 'off',
      h12: true,
    });
    expect(parseWeatherUrl(buildWeatherUrl(ORIGIN, picked, 'ja'))).toEqual({
      settings: picked,
      locale: 'ja',
    });
  });

  it('turns down other widgets and text that is no URL', () => {
    expect(parseWeatherUrl(`${ORIGIN}/widgets/irl-hud?lat=1&lon=2`)).toBeNull();
    expect(parseWeatherUrl('Istanbul')).toBeNull();
  });
});
