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

/** How the mini-map's arrow moves; mods change it with !hud walk, !hud run and !hud stay. */
export const HUD_MOVES = ['walk', 'run', 'stay'] as const;
export type HudMove = (typeof HUD_MOVES)[number];

/** Something mods buy from chat with !hud buy and its name; `price` comes off the cash. */
export interface HudItem {
  name: string;
  price: number;
}

/** A real place the mini-map can draw; mods switch to it from chat by `name`. */
export interface HudPlace {
  name: string;
  lat: number;
  lon: number;
}

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
  /** What the mini-map starts with; `real` starts at the first saved place. */
  map: HudMap;
  /** Saved real places, for `map: 'real'` and for switching from chat with !hud map. */
  places: HudPlace[];
  /** How the arrow moves when the overlay starts. */
  move: HudMove;
  /** The market: what !hud buy can buy, and for how much. */
  items: HudItem[];
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
  places: [],
  move: 'walk',
  items: [],
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
export const MAX_PLACES = 10;
const PLACE_NAME_MAX = 20;
// One word mods can type after !hud map: letters in any script, digits, - and _.
const PLACE_NAME = new RegExp(`^[\\p{L}\\p{N}_-]{1,${PLACE_NAME_MAX}}$`, 'u');
/** Words !hud map already means something by, so no place can be called them. */
export const RESERVED_PLACE_NAMES = ['urban', 'park', 'reset'];
// A place written into the URL as "name:lat,lon"; places are joined with ";".
const PLACE_SEPARATOR = ';';
// Old URLs had one real place as lat and lon; it reads back as a place with this name.
const LEGACY_PLACE_NAME = 'place1';
export const MAX_ITEMS = 20;
export const ITEM_NAME_MAX = 24;
// Words with spaces between them, - and _, and at least one letter so "3" stays a count.
const ITEM_NAME = new RegExp(`^(?=.*\\p{L})[\\p{L}\\p{N} _-]{1,${ITEM_NAME_MAX}}$`, 'u');
// Items written into the URL as "name:price", joined with ";".
const ITEM_SEPARATOR = ';';

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

/** Whether `name` can name a place: one short word that isn't a !hud map word. */
export const isPlaceName = (name: string) =>
  PLACE_NAME.test(name) && !RESERVED_PLACE_NAMES.includes(name.toLowerCase());

/** Places as "park1:41.02561,28.97436;park2:…". */
const writePlaces = (places: HudPlace[]) =>
  places
    .map((place) => `${place.name}:${roundCoord(place.lat)},${roundCoord(place.lon)}`)
    .join(PLACE_SEPARATOR);

/** Places back from the URL: the valid ones, each name once (in any case), up to the limit. */
function readPlaces(value: string | null): HudPlace[] {
  const places: HudPlace[] = [];
  for (const part of (value ?? '').split(PLACE_SEPARATOR)) {
    const match = part.trim().match(/^(.+):([^:,]+),([^:,]+)$/);
    if (!match || places.length >= MAX_PLACES) continue;
    const [, name, latText, lonText] = match;
    const lat = readCoord(latText, 90);
    const lon = readCoord(lonText, 180);
    const taken = places.some((place) => place.name.toLowerCase() === name.toLowerCase());
    if (isPlaceName(name) && lat !== null && lon !== null && !taken)
      places.push({ name, lat, lon });
  }
  return places;
}

/** An item name, trimmed and with single spaces, as the URL keeps it and chat matches it. */
export const tidyItemName = (name: string) => name.trim().replace(/\s+/g, ' ');

/** Whether `name` (tidied) can name a market item. */
export const isItemName = (name: string) => ITEM_NAME.test(tidyItemName(name));

const writeItems = (items: HudItem[]) =>
  items.map((item) => `${item.name}:${item.price}`).join(ITEM_SEPARATOR);

/** Items back from the URL: valid names with a price of $1 or more, each name once. */
function readItems(value: string | null): HudItem[] {
  const items: HudItem[] = [];
  for (const part of (value ?? '').split(ITEM_SEPARATOR)) {
    const match = part.match(/^(.+):(\d+)$/);
    if (!match || items.length >= MAX_ITEMS) continue;
    const name = tidyItemName(match[1]);
    const price = Number(match[2]);
    const taken = items.some((item) => item.name.toLowerCase() === name.toLowerCase());
    if (isItemName(name) && price >= 1 && price <= MAX_EVENT_MONEY && !taken)
      items.push({ name, price });
  }
  return items;
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
    if (settings.places.length > 0) params.set('places', writePlaces(settings.places));
    if (settings.move !== defaults.move) params.set('move', settings.move);
  }
  if (settings.items.length > 0) params.set('items', writeItems(settings.items));
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
  const move = params.get('move') as HudMove;
  const lat = readCoord(params.get('lat'), 90);
  const lon = readCoord(params.get('lon'), 180);
  const places = params.has('places')
    ? readPlaces(params.get('places'))
    : lat !== null && lon !== null
      ? [{ name: LEGACY_PLACE_NAME, lat, lon }]
      : [];
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
    places,
    move: HUD_MOVES.includes(move) ? move : defaults.move,
    items: readItems(params.get('items')),
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
