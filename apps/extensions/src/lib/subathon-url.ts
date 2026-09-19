import {
  type ChannelPlatforms,
  channelWidgetUrl,
  readFlag,
  readWhole,
  readWidgetUrl,
  setChannels,
  setPreview,
} from '#/lib/url-params';

export const SUBATHON_STYLES = ['bar', 'clock', 'ring'] as const;
export type SubathonStyle = (typeof SUBATHON_STYLES)[number];

/** `hp` shifts from green to red as time runs out; the rest are fixed accents. */
export const SUBATHON_COLORS = ['hp', 'green', 'purple', 'red', 'gold', 'cyan', 'pink'] as const;
export type SubathonColor = (typeof SUBATHON_COLORS)[number];

/** Seconds each event adds, per platform. 0 turns that event off. */
export interface SubathonTimeValues {
  /** Twitch Tier 1 or Prime sub, resubs included. */
  tsub: number;
  /** Per gifted Twitch sub. */
  tgift: number;
  /** Per 500 Bits, about one sub; other amounts add their share. */
  bits: number;
  ksub: number;
  kgift: number;
  /** Per 500 Kicks. */
  kicks: number;
}

const TIME_KEYS = ['tsub', 'tgift', 'bits', 'ksub', 'kgift', 'kicks'] as const;
export type SubathonTimeKey = keyof SubathonTimeValues;

export interface SubathonSettings extends SubathonTimeValues {
  platforms: ChannelPlatforms;
  style: SubathonStyle;
  color: SubathonColor;
  /** Shown with the clock; empty hides it. */
  title: string;
  /** Starting time, seconds. */
  start: number;
  /** Most time the clock can hold, seconds; 0 means no limit. */
  cap: number;
  /** Twitch Tier 2 and Tier 3 subs and gifts count as 2 and 5, like their price. */
  tiers: boolean;
  /** Run as soon as the overlay first loads, instead of waiting for !subathon start. */
  autostart: boolean;
  percent: boolean;
  pops: boolean;
}

export const DEFAULT_SUBATHON_SETTINGS: SubathonSettings = {
  platforms: 'both',
  style: 'bar',
  color: 'hp',
  title: 'SUBATHON',
  start: 3600,
  cap: 0,
  tsub: 60,
  tgift: 60,
  bits: 60,
  ksub: 60,
  kgift: 60,
  kicks: 60,
  tiers: true,
  autostart: false,
  percent: true,
  pops: true,
};

/** Upper bound for every time setting: 30 days. */
export const MAX_SECONDS = 30 * 24 * 3600;
// A timer that starts at zero would be over before it began.
const MIN_START_SECONDS = 60;
export const TITLE_MAX_LENGTH = 32;

const WIDGET_PATH = '/widgets/subathon';

type NumberKey = 'start' | 'cap' | SubathonTimeKey;
type FlagKey = 'tiers' | 'autostart' | 'percent' | 'pops';
// URL name of each setting; the time values use their own key.
const NUMBER_PARAMS: Record<NumberKey, string> = {
  start: 'time',
  cap: 'cap',
  ...(Object.fromEntries(TIME_KEYS.map((key) => [key, key])) as Record<SubathonTimeKey, string>),
};
const FLAG_PARAMS: Record<FlagKey, string> = {
  tiers: 'tiers',
  autostart: 'autostart',
  percent: 'pct',
  pops: 'pops',
};
const NUMBER_KEYS = Object.keys(NUMBER_PARAMS) as NumberKey[];
const FLAG_KEYS = Object.keys(FLAG_PARAMS) as FlagKey[];

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(settings: SubathonSettings, twitchChannel: string, kickChannel: string) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_SUBATHON_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  if (settings.style !== defaults.style) params.set('style', settings.style);
  if (settings.color !== defaults.color) params.set('color', settings.color);
  if (settings.title !== defaults.title) params.set('title', settings.title);
  for (const key of NUMBER_KEYS) {
    if (settings[key] !== defaults[key]) params.set(NUMBER_PARAMS[key], String(settings[key]));
  }
  for (const key of FLAG_KEYS) {
    if (settings[key] !== defaults[key]) params.set(FLAG_PARAMS[key], settings[key] ? '1' : '0');
  }
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildSubathonUrl(
  origin: string,
  settings: SubathonSettings,
  twitchChannel: string,
  kickChannel: string,
): string {
  return channelWidgetUrl(origin, WIDGET_PATH, buildParams(settings, twitchChannel, kickChannel));
}

/**
 * Plays simulated subs with the same settings and never touches a channel or saved clock.
 * `speed` runs its clock faster than real time, e.g. 60 for a minute per second.
 */
export function buildSubathonPreviewUrl(
  origin: string,
  settings: SubathonSettings,
  previewId: string,
  speed?: number,
): string {
  const params = buildParams(settings, '', '');
  setPreview(params, settings.platforms, previewId);
  if (speed) params.set('simspeed', String(speed));
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** A whole number of seconds from 0 to MAX_SECONDS, or `fallback`. */
const readSeconds = (value: string | null, fallback: number) =>
  readWhole(value, fallback, { max: MAX_SECONDS });

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readSubathonSettings(params: URLSearchParams): Omit<SubathonSettings, 'platforms'> {
  const defaults = DEFAULT_SUBATHON_SETTINGS;
  const style = params.get('style') as SubathonStyle;
  const color = params.get('color') as SubathonColor;
  const title = params.get('title');
  const numbers = Object.fromEntries(
    NUMBER_KEYS.map((key) => [key, readSeconds(params.get(NUMBER_PARAMS[key]), defaults[key])]),
  ) as Record<NumberKey, number>;
  const flags = Object.fromEntries(
    FLAG_KEYS.map((key) => [key, readFlag(params.get(FLAG_PARAMS[key]), defaults[key])]),
  ) as Record<FlagKey, boolean>;
  return {
    style: SUBATHON_STYLES.includes(style) ? style : defaults.style,
    color: SUBATHON_COLORS.includes(color) ? color : defaults.color,
    title: title === null ? defaults.title : title.slice(0, TITLE_MAX_LENGTH),
    ...numbers,
    start: Math.max(MIN_START_SECONDS, numbers.start),
    ...flags,
  };
}

/** Reverse of buildSubathonUrl; null for anything that isn't a Subathon URL. */
export function parseSubathonUrl(
  text: string,
): { settings: SubathonSettings; twitchChannel: string; kickChannel: string } | null {
  const pasted = readWidgetUrl(text, WIDGET_PATH);
  if (!pasted) return null;
  const { params, platforms, ...channels } = pasted;
  return { ...channels, settings: { platforms, ...readSubathonSettings(params) } };
}
