import { isClassic } from '#/features/presets/registry';
import { MAX_GOAL_COUNT } from './goal-url';
import { CLASSIC_PRESET, readPreset, writePreset } from './preset-url';
import {
  type ChannelPlatforms,
  channelWidgetUrl,
  readFlag,
  readWhole,
  readWidgetUrl,
  setChannels,
  setPreview,
} from './url-params';

export const COUNTER_LAYOUTS = ['row', 'stack'] as const;
export type CounterLayout = (typeof COUNTER_LAYOUTS)[number];

export const COUNTER_COLORS = ['purple', 'green', 'red', 'gold', 'cyan', 'pink'] as const;
export type CounterColor = (typeof COUNTER_COLORS)[number];

/** One number on screen and the chat command that changes it. */
export interface CounterSpec {
  /** Shown with the number; empty shows only the icon and the number. */
  label: string;
  /** What mods type after the "!", lowercased: `wins` for !wins. */
  command: string;
  /** An emoji or a few characters next to the label; empty shows none. */
  icon: string;
  /** A channel emote image instead of the icon; empty falls back to the icon. */
  iconUrl: string;
  /** Where the count starts. A new one in the URL starts that counter over. */
  start: number;
}

export interface CounterSettings {
  platforms: ChannelPlatforms;
  /** Preset id; any preset but classic brings its own colors and fonts. */
  preset: string;
  color: CounterColor;
  /** `row` puts the counters side by side, `stack` one under another. */
  layout: CounterLayout;
  /** A rising "+1" or "−1" on every change from chat. */
  pops: boolean;
  /** One to MAX_COUNTERS, each with its own command. */
  counters: CounterSpec[];
}

export const MAX_COUNTERS = 4;
/** Upper bound for every count, the same as the Sub Goal's. */
export const MAX_COUNT = MAX_GOAL_COUNT;
/** Cut by code point, like the icon, so an emoji in a label is never split in half. */
export const LABEL_MAX_LENGTH = 24;
export const COMMAND_MAX_LENGTH = 20;
/** Long enough for a few emoji. */
export const ICON_MAX_LENGTH = 8;
/** Cap for an emote image URL: long enough for any CDN link, short enough to stay sane. */
const ICON_URL_MAX_LENGTH = 500;

export const DEFAULT_COUNTER: CounterSpec = {
  label: 'Wins',
  command: 'wins',
  icon: '🏆',
  iconUrl: '',
  start: 0,
};

export const DEFAULT_COUNTER_SETTINGS: CounterSettings = {
  platforms: 'both',
  preset: CLASSIC_PRESET,
  color: 'purple',
  layout: 'row',
  pops: true,
  counters: [DEFAULT_COUNTER],
};

/** Design size of each layout. The overlay scales to whatever browser source size it gets. */
export const COUNTER_STAGES: Record<CounterLayout, { width: number; height: number }> = {
  row: { width: 800, height: 260 },
  stack: { width: 440, height: 400 },
};

const WIDGET_PATH = '/widgets/counter';

const cut = (text: string, max: number) => Array.from(text.trim()).slice(0, max).join('');

/**
 * A command the way mods type it, without the "!": letters, digits and underscores, lowercased.
 * The Turkish İ and ı fold to i, so "!İYİ_OYUN" and "!iyi_oyun" are the same command.
 */
export function normalizeCommand(text: string): string {
  const folded = text
    .normalize('NFC')
    .replace(/[İIı]/g, 'i')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}_]/gu, '');
  return cut(folded, COMMAND_MAX_LENGTH);
}

/**
 * Every counter with a command of its own. An empty command, or one an earlier counter already
 * has, becomes `count2` for the second counter and so on, so one chat command never moves two.
 */
export function uniqueCommands(counters: readonly CounterSpec[]): CounterSpec[] {
  const taken = new Set<string>();
  return counters.map((counter, index) => {
    let command = counter.command;
    if (!command || taken.has(command)) {
      command = `count${index + 1}`;
      for (let extra = 2; taken.has(command); extra++) command = `count${index + 1}_${extra}`;
    }
    taken.add(command);
    return command === counter.command ? counter : { ...counter, command };
  });
}

const clampCount = (n: number) => Math.min(MAX_COUNT, Math.max(0, Math.round(n)));

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(settings: CounterSettings, twitchChannel: string, kickChannel: string) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_COUNTER_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  writePreset(params, settings.preset);
  if (isClassic(settings.preset) && settings.color !== defaults.color)
    params.set('color', settings.color);
  if (settings.layout !== defaults.layout) params.set('layout', settings.layout);
  if (settings.pops !== defaults.pops) params.set('pops', settings.pops ? '1' : '0');
  settings.counters.slice(0, MAX_COUNTERS).forEach((counter, index) => {
    const n = index + 1;
    // Always written, even empty: it's what makes the counter exist.
    params.set(`c${n}`, cut(counter.label, LABEL_MAX_LENGTH));
    const command = normalizeCommand(counter.command);
    if (command) params.set(`c${n}cmd`, command);
    const icon = cut(counter.icon, ICON_MAX_LENGTH);
    if (icon) params.set(`c${n}icon`, icon);
    const iconUrl = counter.iconUrl.trim().slice(0, ICON_URL_MAX_LENGTH);
    if (iconUrl) params.set(`c${n}iconUrl`, iconUrl);
    if (counter.start !== 0) params.set(`c${n}start`, String(clampCount(counter.start)));
  });
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildCounterUrl(
  origin: string,
  settings: CounterSettings,
  twitchChannel: string,
  kickChannel: string,
): string {
  return channelWidgetUrl(origin, WIDGET_PATH, buildParams(settings, twitchChannel, kickChannel));
}

/** Plays simulated counts with the same settings and never touches a channel or saved count. */
export function buildCounterPreviewUrl(
  origin: string,
  settings: CounterSettings,
  previewId: string,
): string {
  const params = buildParams(settings, '', '');
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** The counters in the URL, `c1` to `c4`, skipping gaps; the Wins counter when there are none. */
function readCounters(params: URLSearchParams): CounterSpec[] {
  const counters: CounterSpec[] = [];
  for (let n = 1; n <= MAX_COUNTERS; n++) {
    const label = params.get(`c${n}`);
    if (label === null) continue;
    counters.push({
      label: cut(label, LABEL_MAX_LENGTH),
      // A URL typed by hand may leave the command out: the label is the command then.
      command: normalizeCommand(params.get(`c${n}cmd`) ?? '') || normalizeCommand(label),
      icon: cut(params.get(`c${n}icon`) ?? '', ICON_MAX_LENGTH),
      iconUrl: (params.get(`c${n}iconUrl`) ?? '').trim().slice(0, ICON_URL_MAX_LENGTH),
      start: readWhole(params.get(`c${n}start`), 0, { max: MAX_COUNT }),
    });
  }
  return counters.length > 0 ? uniqueCommands(counters) : [DEFAULT_COUNTER];
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readCounterSettings(params: URLSearchParams): Omit<CounterSettings, 'platforms'> {
  const defaults = DEFAULT_COUNTER_SETTINGS;
  const color = params.get('color') as CounterColor;
  const layout = params.get('layout') as CounterLayout;
  return {
    preset: readPreset(params),
    color: COUNTER_COLORS.includes(color) ? color : defaults.color,
    layout: COUNTER_LAYOUTS.includes(layout) ? layout : defaults.layout,
    pops: readFlag(params.get('pops'), defaults.pops),
    counters: readCounters(params),
  };
}

/** Reverse of buildCounterUrl; null for anything that isn't a Counter URL. */
export function parseCounterUrl(
  text: string,
): { settings: CounterSettings; twitchChannel: string; kickChannel: string } | null {
  const pasted = readWidgetUrl(text, WIDGET_PATH);
  if (!pasted) return null;
  const { params, platforms, ...channels } = pasted;
  return { ...channels, settings: { platforms, ...readCounterSettings(params) } };
}
