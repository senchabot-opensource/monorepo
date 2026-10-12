import {
  type ChannelPlatforms,
  channelWidgetUrl,
  readFlag,
  readWhole,
  readWidgetUrl,
  setChannels,
  setPreview,
} from '#/lib/url-params';

/** `retro`: green $00000350 under a grey clock, thick outline. `modern`: white $1,250, soft shadow. */
export const HUD_STYLES = ['retro', 'modern'] as const;
export type HudStyle = (typeof HUD_STYLES)[number];

/**
 * What the mini-map draws: a made-up city or park, or the streets around a real place from
 * OpenStreetMap.
 */
export const HUD_MAPS = ['urban', 'park', 'real'] as const;
export type HudMap = (typeof HUD_MAPS)[number];

/** A corner of the scene, for the money and for the mini-map. */
export const HUD_CORNERS = ['tr', 'tl', 'br', 'bl'] as const;
export type HudCorner = (typeof HUD_CORNERS)[number];

/** Dollars each event adds, per platform. 0 turns that event off. */
export interface HudMoneyValues {
  /** Twitch Tier 1 or Prime sub, resubs included. */
  tsub: number;
  /** Per gifted Twitch sub. */
  tgift: number;
  /** Per 100 Bits; other amounts add their share. */
  bits: number;
  /** Per viewer a Twitch raid brings. */
  traid: number;
  ksub: number;
  kgift: number;
  /** Per 100 Kicks. */
  kicks: number;
  /** Per viewer a Kick raid (host) brings. */
  kraid: number;
}
export type HudMoneyKey = keyof HudMoneyValues;

export interface HudSettings extends HudMoneyValues {
  platforms: ChannelPlatforms;
  style: HudStyle;
  /** Where the money and the clock sit. */
  corner: HudCorner;
  /** HUD and mini-map size in percent of their design size. */
  size: number;
  /** Money the HUD starts with, from 0. */
  start: number;
  /** Twitch Tier 2 and Tier 3 subs and gifts count as 2 and 5, like their price. */
  tiers: boolean;
  clock: boolean;
  /** 12-hour clock with AM/PM instead of a 24-hour one. */
  h12: boolean;
  /** IANA time zone for the clock; empty uses the computer OBS runs on. */
  tz: string;
  /** A mini-map with an arrow walking its streets or paths. */
  radar: boolean;
  /** Where the mini-map sits. */
  radarCorner: HudCorner;
  map: HudMap;
  /** The real place's latitude and longitude for `map: 'real'`; null until one is picked. */
  lat: number | null;
  lon: number | null;
  /** Floats "+$100" with the viewer's name next to the money. */
  pops: boolean;
}

export const DEFAULT_HUD_SETTINGS: HudSettings = {
  platforms: 'both',
  style: 'retro',
  corner: 'tr',
  size: 100,
  start: 0,
  tsub: 100,
  tgift: 100,
  bits: 25,
  traid: 10,
  ksub: 100,
  kgift: 100,
  kicks: 25,
  kraid: 10,
  tiers: true,
  clock: true,
  h12: false,
  tz: '',
  radar: true,
  radarCorner: 'bl',
  map: 'urban',
  lat: null,
  lon: null,
  pops: true,
};

/** The most the money counter holds: nine digits. */
export const MAX_MONEY = 999_999_999;
/** Debt stops here, so a negative Retro counter still fits its eight digits. */
export const MIN_MONEY = -99_999_999;
/** Per-event values past this would be a typo, not a setting. */
export const MAX_EVENT_MONEY = 1_000_000;
export const MIN_SIZE = 50;
export const MAX_SIZE = 200;
const TZ_MAX_LENGTH = 64;
// Five decimals is about a meter: plenty for the middle of a map, and a short URL.
const COORD_DECIMALS = 5;

const WIDGET_PATH = '/widgets/irl-hud';

export const MONEY_KEYS = [
  'tsub',
  'tgift',
  'bits',
  'traid',
  'ksub',
  'kgift',
  'kicks',
  'kraid',
] as const satisfies readonly HudMoneyKey[];

type FlagKey = 'tiers' | 'clock' | 'h12' | 'radar' | 'pops';
const FLAG_KEYS: FlagKey[] = ['tiers', 'clock', 'h12', 'radar', 'pops'];

/** Whether `zone` is a time zone this browser can show the time in. */
export function isTimeZone(zone: string): boolean {
  if (!zone) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

/** A latitude or longitude rounded to about a meter. */
export const roundCoord = (value: number) =>
  Math.round(value * 10 ** COORD_DECIMALS) / 10 ** COORD_DECIMALS;

/** A latitude (`max` 90) or longitude (`max` 180) from text, rounded; null when it isn't one. */
function readCoord(value: string | null, max: number): number | null {
  if (value === null || value.trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && Math.abs(n) <= max ? roundCoord(n) : null;
}

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(settings: HudSettings, twitchChannel: string, kickChannel: string) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_HUD_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  if (settings.style !== defaults.style) params.set('style', settings.style);
  if (settings.corner !== defaults.corner) params.set('corner', settings.corner);
  if (settings.size !== defaults.size) params.set('size', String(settings.size));
  if (settings.start !== defaults.start) params.set('start', String(settings.start));
  for (const key of MONEY_KEYS) {
    if (settings[key] !== defaults[key]) params.set(key, String(settings[key]));
  }
  for (const key of FLAG_KEYS) {
    if (settings[key] !== defaults[key]) params.set(key, settings[key] ? '1' : '0');
  }
  if (settings.tz) params.set('tz', settings.tz);
  if (settings.radar) {
    if (settings.radarCorner !== defaults.radarCorner)
      params.set('radarCorner', settings.radarCorner);
    if (settings.map !== defaults.map) params.set('map', settings.map);
    if (settings.map === 'real' && settings.lat !== null && settings.lon !== null) {
      params.set('lat', String(roundCoord(settings.lat)));
      params.set('lon', String(roundCoord(settings.lon)));
    }
  }
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildHudUrl(
  origin: string,
  settings: HudSettings,
  twitchChannel: string,
  kickChannel: string,
): string {
  return channelWidgetUrl(origin, WIDGET_PATH, buildParams(settings, twitchChannel, kickChannel));
}

/** Plays simulated subs with the same settings and never touches a channel or saved money. */
export function buildHudPreviewUrl(origin: string, settings: HudSettings, previewId: string) {
  const params = buildParams(settings, '', '');
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** A whole number from `min` to `max`, rounded; garbage falls back, out of range is clamped. */
const readClamped = (value: string | null, fallback: number, min: number, max: number) =>
  readWhole(value, fallback, { min, max, below: 'clamp' });

const readCorner = (value: string | null, fallback: HudCorner): HudCorner =>
  HUD_CORNERS.includes(value as HudCorner) ? (value as HudCorner) : fallback;

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readHudSettings(params: URLSearchParams): Omit<HudSettings, 'platforms'> {
  const defaults = DEFAULT_HUD_SETTINGS;
  const style = params.get('style') as HudStyle;
  const map = params.get('map') as HudMap;
  const lat = readCoord(params.get('lat'), 90);
  const lon = readCoord(params.get('lon'), 180);
  const tz = (params.get('tz') ?? '').trim().slice(0, TZ_MAX_LENGTH);
  const money = Object.fromEntries(
    MONEY_KEYS.map((key) => [key, readClamped(params.get(key), defaults[key], 0, MAX_EVENT_MONEY)]),
  ) as Record<HudMoneyKey, number>;
  const flags = Object.fromEntries(
    FLAG_KEYS.map((key) => [key, readFlag(params.get(key), defaults[key])]),
  ) as Record<FlagKey, boolean>;
  return {
    style: HUD_STYLES.includes(style) ? style : defaults.style,
    corner: readCorner(params.get('corner'), defaults.corner),
    size: readClamped(params.get('size'), defaults.size, MIN_SIZE, MAX_SIZE),
    start: readClamped(params.get('start'), defaults.start, 0, MAX_MONEY),
    ...money,
    ...flags,
    tz: isTimeZone(tz) ? tz : '',
    radarCorner: readCorner(params.get('radarCorner'), defaults.radarCorner),
    map: HUD_MAPS.includes(map) ? map : defaults.map,
    // Both or neither: half a place is no place.
    lat: lat !== null && lon !== null ? lat : null,
    lon: lat !== null && lon !== null ? lon : null,
  };
}

/** Reverse of buildHudUrl; null for anything that isn't an IRL HUD URL. */
export function parseHudUrl(text: string): {
  settings: HudSettings;
  twitchChannel: string;
  kickChannel: string;
} | null {
  const pasted = readWidgetUrl(text, WIDGET_PATH);
  if (!pasted) return null;
  const { params, platforms, twitchChannel, kickChannel } = pasted;
  return { twitchChannel, kickChannel, settings: { platforms, ...readHudSettings(params) } };
}
