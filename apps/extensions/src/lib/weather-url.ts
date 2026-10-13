import { isValidLocale, LANG_PARAM, type Locale } from '#/lib/i18n/locales';
import { HUD_STYLES } from '#/lib/irl-hud-url';
import { isTimeZone } from '#/lib/time-zones';
import { readFlag, readWhole } from '#/lib/url-params';

/** `card`: the place, a big icon and the temperature over a forecast row. `pill`: one line. */
export const WEATHER_LAYOUTS = ['card', 'pill'] as const;
export type WeatherLayout = (typeof WEATHER_LAYOUTS)[number];

/**
 * `app`: round figures on the `theme`'s background, like a weather app. `retro` and `modern`: the
 * IRL HUD's styles, outlined text right on the scene, so the weather matches a HUD beside it.
 */
export const WEATHER_STYLES = ['app', ...HUD_STYLES] as const;
export type WeatherStyle = (typeof WEATHER_STYLES)[number];

/** A dark or light panel, or `clear`: no panel, white text with a shadow. */
export const WEATHER_THEMES = ['dark', 'light', 'clear'] as const;
export type WeatherTheme = (typeof WEATHER_THEMES)[number];

/** °C and km/h, or °F and mph. */
export const WEATHER_UNITS = ['metric', 'imperial'] as const;
export type WeatherUnits = (typeof WEATHER_UNITS)[number];

/** The card's bottom row: the coming hours, the coming days, or nothing. */
export const WEATHER_FORECASTS = ['hours', 'days', 'off'] as const;
export type WeatherForecast = (typeof WEATHER_FORECASTS)[number];

/** A corner of the scene, in the IRL HUD's order, so both setup pages list them alike. */
export const WEATHER_CORNERS = ['tr', 'tl', 'br', 'bl'] as const;
export type WeatherCorner = (typeof WEATHER_CORNERS)[number];

export interface WeatherSettings {
  /** Where the weather is for; both null until a place is picked. */
  lat: number | null;
  lon: number | null;
  /** The place's name as the overlay shows it; empty shows none. */
  place: string;
  units: WeatherUnits;
  style: WeatherStyle;
  layout: WeatherLayout;
  /** The background in the `app` style; the HUD styles have none. */
  theme: WeatherTheme;
  corner: WeatherCorner;
  /** Size in percent of the design size, which fits a 1080p scene. */
  size: number;
  /** Wind and humidity under the temperature. */
  details: boolean;
  forecast: WeatherForecast;
  /** 12-hour forecast times (3 PM) instead of 24-hour ones (15:00). */
  h12: boolean;
  /** IANA time zone for the forecast's hours and days; empty uses the computer OBS runs on. */
  tz: string;
}

export const DEFAULT_WEATHER_SETTINGS: WeatherSettings = {
  lat: null,
  lon: null,
  place: '',
  units: 'metric',
  style: 'app',
  layout: 'card',
  theme: 'dark',
  // Clear of the IRL HUD's cash (top right) and mini-map (bottom left), so both fit one scene.
  corner: 'tl',
  size: 100,
  details: true,
  forecast: 'hours',
  h12: false,
  tz: '',
};

export const PLACE_MAX_LENGTH = 40;
export const MIN_SIZE = 50;
export const MAX_SIZE = 200;
const TZ_MAX_LENGTH = 64;
// MET Norway asks for at most four decimals, about 10 m, so its cache can answer.
const COORD_DECIMALS = 4;

const WIDGET_PATH = '/widgets/weather';

/** A latitude or longitude at the precision the weather service takes. */
export const roundWeatherCoord = (value: number) =>
  Math.round(value * 10 ** COORD_DECIMALS) / 10 ** COORD_DECIMALS;

/** A latitude (`max` 90) or longitude (`max` 180) from text, rounded; null when it isn't one. */
function readCoord(value: string | null, max: number): number | null {
  if (value === null || value.trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && Math.abs(n) <= max ? roundWeatherCoord(n) : null;
}

const hasPlace = (settings: WeatherSettings) => settings.lat !== null && settings.lon !== null;

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(settings: WeatherSettings, locale: Locale) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_WEATHER_SETTINGS;
  if (settings.lat !== null && settings.lon !== null) {
    params.set('lat', String(roundWeatherCoord(settings.lat)));
    params.set('lon', String(roundWeatherCoord(settings.lon)));
  }
  const place = settings.place.trim();
  if (place) params.set('place', place);
  if (settings.units !== defaults.units) params.set('units', settings.units);
  if (settings.style !== defaults.style) params.set('style', settings.style);
  if (settings.layout !== defaults.layout) params.set('layout', settings.layout);
  if (settings.theme !== defaults.theme) params.set('theme', settings.theme);
  if (settings.corner !== defaults.corner) params.set('corner', settings.corner);
  if (settings.size !== defaults.size) params.set('size', String(settings.size));
  if (settings.details !== defaults.details) params.set('details', settings.details ? '1' : '0');
  if (settings.forecast !== defaults.forecast) params.set('forecast', settings.forecast);
  if (settings.h12 !== defaults.h12) params.set('h12', settings.h12 ? '1' : '0');
  if (settings.tz) params.set('tz', settings.tz);
  // Always written: the overlay names the weather in words, and OBS shouldn't pick their language.
  params.set(LANG_PARAM, locale);
  return params;
}

/** The URL for OBS. Empty until a place is picked; it reads no chat, so it needs no channel. */
export function buildWeatherUrl(origin: string, settings: WeatherSettings, locale: Locale): string {
  if (!hasPlace(settings)) return '';
  return `${origin}${WIDGET_PATH}?${buildParams(settings, locale).toString()}`;
}

/**
 * The setup page's preview: the real weather once a place is picked, sample weather before.
 * `previewId` lets the page's test buttons show other weather in it.
 */
export function buildWeatherPreviewUrl(
  origin: string,
  settings: WeatherSettings,
  locale: Locale,
  previewId: string,
) {
  const params = buildParams(settings, locale);
  if (!hasPlace(settings)) params.set('demo', '1');
  params.set('preview', previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

function readChoice<T extends string>(value: string | null, choices: readonly T[], fallback: T): T {
  return choices.includes(value as T) ? (value as T) : fallback;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readWeatherSettings(params: URLSearchParams): WeatherSettings {
  const defaults = DEFAULT_WEATHER_SETTINGS;
  const lat = readCoord(params.get('lat'), 90);
  const lon = readCoord(params.get('lon'), 180);
  const tz = (params.get('tz') ?? '').trim().slice(0, TZ_MAX_LENGTH);
  return {
    // Half a place is no place.
    lat: lon === null ? null : lat,
    lon: lat === null ? null : lon,
    place: (params.get('place') ?? '').trim().slice(0, PLACE_MAX_LENGTH),
    units: readChoice(params.get('units'), WEATHER_UNITS, defaults.units),
    style: readChoice(params.get('style'), WEATHER_STYLES, defaults.style),
    layout: readChoice(params.get('layout'), WEATHER_LAYOUTS, defaults.layout),
    theme: readChoice(params.get('theme'), WEATHER_THEMES, defaults.theme),
    corner: readChoice(params.get('corner'), WEATHER_CORNERS, defaults.corner),
    size: readWhole(params.get('size'), defaults.size, {
      min: MIN_SIZE,
      max: MAX_SIZE,
      below: 'clamp',
    }),
    details: readFlag(params.get('details'), defaults.details),
    forecast: readChoice(params.get('forecast'), WEATHER_FORECASTS, defaults.forecast),
    h12: readFlag(params.get('h12'), defaults.h12),
    tz: isTimeZone(tz) ? tz : '',
  };
}

/** Reverse of buildWeatherUrl; null for anything that isn't a Weather URL. */
export function parseWeatherUrl(
  text: string,
): { settings: WeatherSettings; locale: Locale | null } | null {
  let url: URL;
  try {
    url = new URL(text.trim());
  } catch {
    return null;
  }
  if (!url.pathname.replace(/\/+$/, '').endsWith(WIDGET_PATH)) return null;
  const lang = url.searchParams.get(LANG_PARAM);
  return {
    settings: readWeatherSettings(url.searchParams),
    locale: isValidLocale(lang) ? lang : null,
  };
}
