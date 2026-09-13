import type { ChannelPlatforms } from '#/components/channel-fields';

export const SUBATHON_STYLES = ['bar', 'clock', 'ring'] as const;
export type SubathonStyle = (typeof SUBATHON_STYLES)[number];

/** `hp` shifts from green to red as time runs out; the rest are fixed accents. */
export const SUBATHON_COLORS = ['hp', 'green', 'purple', 'red', 'gold', 'cyan', 'pink'] as const;
export type SubathonColor = (typeof SUBATHON_COLORS)[number];

export interface SubathonSettings {
  platforms: ChannelPlatforms;
  style: SubathonStyle;
  color: SubathonColor;
  /** Shown above the clock; empty hides it. */
  title: string;
  /** Starting time, seconds. */
  start: number;
  /** Most time the clock can hold, seconds; 0 means no limit. */
  cap: number;
  /** Seconds added per sub (Tier 1 or Prime on Twitch). */
  sub: number;
  /** Seconds added per gifted sub. */
  gift: number;
  /** Seconds added per 100 Bits on Twitch or 100 Kicks on Kick. */
  bits: number;
  /** Twitch Tier 2 and Tier 3 subs count as 2 and 5 subs, like their price. */
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
  sub: 60,
  gift: 60,
  bits: 20,
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

export const WIDGET_PATH = '/widgets/subathon';

type NumberKey = 'start' | 'cap' | 'sub' | 'gift' | 'bits';
type FlagKey = 'tiers' | 'autostart' | 'percent' | 'pops';
const NUMBER_KEYS: NumberKey[] = ['start', 'cap', 'sub', 'gift', 'bits'];
// URL name of each on/off setting.
const FLAG_PARAMS: Record<FlagKey, string> = {
  tiers: 'tiers',
  autostart: 'autostart',
  percent: 'pct',
  pops: 'pops',
};
// Starting time is `time` in the URL, the other numbers keep their name.
const NUMBER_PARAMS: Record<NumberKey, string> = {
  start: 'time',
  cap: 'cap',
  sub: 'sub',
  gift: 'gift',
  bits: 'bits',
};

/** Every settings param the widget reads, channels aside. */
export const SUBATHON_PARAMS = [
  'style',
  'color',
  'title',
  ...Object.values(NUMBER_PARAMS),
  ...Object.values(FLAG_PARAMS),
];

/** Only settings that differ from the defaults are written, so URLs stay short. */
export function buildSubathonParams(
  settings: SubathonSettings,
  twitchChannel: string,
  kickChannel: string,
): URLSearchParams {
  const params = new URLSearchParams();
  const twitch = twitchChannel.trim().toLowerCase();
  const kick = kickChannel.trim().toLowerCase();
  const defaults = DEFAULT_SUBATHON_SETTINGS;
  if (settings.platforms !== 'kick' && twitch) params.set('twitch', twitch);
  if (settings.platforms !== 'twitch' && kick) params.set('kick', kick);
  if (settings.style !== defaults.style) params.set('style', settings.style);
  if (settings.color !== defaults.color) params.set('color', settings.color);
  if (settings.title !== defaults.title) params.set('title', settings.title);
  for (const key of NUMBER_KEYS) {
    if (settings[key] !== defaults[key]) params.set(NUMBER_PARAMS[key], String(settings[key]));
  }
  for (const key of Object.keys(FLAG_PARAMS) as FlagKey[]) {
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
  const params = buildSubathonParams(settings, twitchChannel, kickChannel);
  if (!params.has('twitch') && !params.has('kick')) return '';
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/**
 * Plays simulated subs with the same settings and never touches a channel or saved clock.
 * `speed` runs its clock faster than real time, e.g. 60 for a minute per second.
 */
export function buildSubathonPreviewUrl(
  origin: string,
  settings: SubathonSettings,
  speed?: number,
): string {
  const params = buildSubathonParams(settings, '', '');
  params.set('simulate', '1');
  if (speed) params.set('simspeed', String(speed));
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

const OFF_FLAGS = ['0', 'false', 'off', 'no'];

/** Reads one on/off param the way the widget does: anything but an "off" word is on. */
export function readFlag(value: string | null | undefined, fallback: boolean): boolean {
  if (value === null || value === undefined) return fallback;
  return !OFF_FLAGS.includes(value.trim().toLowerCase());
}

/** A whole number of seconds from 0 to MAX_SECONDS, or `fallback`. */
export function readSeconds(value: string | null | undefined, fallback: number): number {
  if (value === null || value === undefined || value.trim() === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.min(MAX_SECONDS, Math.round(n)) : fallback;
}

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
    (Object.keys(FLAG_PARAMS) as FlagKey[]).map((key) => [
      key,
      readFlag(params.get(FLAG_PARAMS[key]), defaults[key]),
    ]),
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

export interface ParsedSubathonUrl {
  settings: SubathonSettings;
  twitchChannel: string;
  kickChannel: string;
}

/** Reverse of buildSubathonUrl; null for anything that isn't a Subathon URL. */
export function parseSubathonUrl(text: string): ParsedSubathonUrl | null {
  let url: URL;
  try {
    url = new URL(text.trim());
  } catch {
    return null;
  }
  if (!url.pathname.replace(/\/+$/, '').endsWith(WIDGET_PATH)) return null;
  const twitchChannel = url.searchParams.get('twitch')?.trim() ?? '';
  const kickChannel = url.searchParams.get('kick')?.trim() ?? '';
  return {
    twitchChannel,
    kickChannel,
    settings: {
      platforms:
        twitchChannel && !kickChannel ? 'twitch' : kickChannel && !twitchChannel ? 'kick' : 'both',
      ...readSubathonSettings(url.searchParams),
    },
  };
}
