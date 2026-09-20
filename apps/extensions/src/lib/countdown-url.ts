import { isClassic } from '#/features/presets/registry';
import { LANG_PARAM, type Locale } from '#/lib/i18n';
import { CLASSIC_PRESET, readPreset, writePreset } from './preset-url';
import {
  type ChannelPlatforms,
  readFlag,
  readWhole,
  readWidgetUrl,
  setChannels,
  setPreview,
} from './url-params';

/** Which break the countdown covers; it only picks the default wording and icon. */
export const COUNTDOWN_SCENES = ['starting', 'break', 'ending'] as const;
export type CountdownScene = (typeof COUNTDOWN_SCENES)[number];

export const COUNTDOWN_COLORS = ['purple', 'green', 'red', 'gold', 'cyan', 'pink'] as const;
export type CountdownColor = (typeof COUNTDOWN_COLORS)[number];

/** `card`: a panel behind the clock. `plain`: the text straight on the scene. */
export const COUNTDOWN_LOOKS = ['card', 'plain'] as const;
export type CountdownLook = (typeof COUNTDOWN_LOOKS)[number];

/** What is on screen once the clock is out of time. */
export const COUNTDOWN_ENDINGS = ['text', 'hold', 'hide'] as const;
export type CountdownEnding = (typeof COUNTDOWN_ENDINGS)[number];

export interface CountdownSettings {
  platforms: ChannelPlatforms;
  /** Preset id; any preset but classic brings its own colors, fonts and frame. */
  preset: string;
  scene: CountdownScene;
  /** Starting time in seconds. Ignored while `at` is set. */
  time: number;
  /** Clock time to count down to, "HH:MM" in the streamer's own time zone; empty counts `time`. */
  at: string;
  /** Headline; empty uses the scene's own wording in the widget's language. */
  title: string;
  /** A line under the clock, e.g. what the break is for; empty leaves it out. */
  note: string;
  /** What the headline becomes at zero; empty uses the scene's own wording. */
  done: string;
  ending: CountdownEnding;
  look: CountdownLook;
  color: CountdownColor;
  /** A bar under the clock that drains with the time left. */
  bar: boolean;
  /** The clock's pulse in the last minute and the preset's own small motion. */
  motion: boolean;
}

export const DEFAULT_COUNTDOWN_SETTINGS: CountdownSettings = {
  platforms: 'both',
  preset: CLASSIC_PRESET,
  scene: 'starting',
  time: 600,
  at: '',
  title: '',
  note: '',
  done: '',
  ending: 'text',
  look: 'card',
  color: 'purple',
  bar: true,
  motion: true,
};

export const TITLE_MAX_LENGTH = 32;
export const NOTE_MAX_LENGTH = 64;
/** A day; past that the clock would pass the same wall-clock time twice. */
export const MAX_COUNTDOWN_TIME = 24 * 3600;

const AT_PATTERN = /^([01]?\d|2\d):([0-5]\d)$/;

/** "9:05" or "21:00" as "09:05"; empty for anything that isn't a time of day. */
export function readAtTime(value: string | null | undefined): string {
  const match = AT_PATTERN.exec((value ?? '').trim());
  if (!match) return '';
  const hours = Number(match[1]);
  return hours > 23 ? '' : `${String(hours).padStart(2, '0')}:${match[2]}`;
}

const WIDGET_PATH = '/widgets/countdown';

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(
  settings: CountdownSettings,
  twitchChannel: string,
  kickChannel: string,
  locale: Locale,
) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_COUNTDOWN_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  // Always written, so a pasted URL says which break it covers.
  params.set('scene', settings.scene);
  const at = readAtTime(settings.at);
  if (at) params.set('at', at);
  else if (settings.time !== defaults.time) params.set('time', String(settings.time));
  writePreset(params, settings.preset);
  if (isClassic(settings.preset) && settings.color !== defaults.color)
    params.set('color', settings.color);
  if (settings.look !== defaults.look) params.set('look', settings.look);
  const title = settings.title.trim();
  const note = settings.note.trim();
  const done = settings.done.trim();
  if (title) params.set('title', title);
  if (note) params.set('note', note);
  if (done) params.set('done', done);
  if (settings.ending !== defaults.ending) params.set('end', settings.ending);
  if (!settings.bar) params.set('bar', '0');
  if (!settings.motion) params.set('motion', '0');
  // Always written: the countdown is mostly words, and OBS shouldn't pick their language.
  params.set(LANG_PARAM, locale);
  return params;
}

/** The URL for OBS. A countdown runs without a channel, so this is never empty. */
export function buildCountdownUrl(
  origin: string,
  settings: CountdownSettings,
  twitchChannel: string,
  kickChannel: string,
  locale: Locale,
): string {
  return `${origin}${WIDGET_PATH}?${buildParams(settings, twitchChannel, kickChannel, locale).toString()}`;
}

/** The same countdown on a fast clock, with no channel and no saved time. */
export function buildCountdownPreviewUrl(
  origin: string,
  settings: CountdownSettings,
  previewId: string,
  locale: Locale,
): string {
  const params = buildParams(settings, '', '', locale);
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readCountdownSettings(
  params: URLSearchParams,
): Omit<CountdownSettings, 'platforms'> {
  const defaults = DEFAULT_COUNTDOWN_SETTINGS;
  const scene = params.get('scene') as CountdownScene;
  const color = params.get('color') as CountdownColor;
  const look = params.get('look') as CountdownLook;
  const ending = params.get('end') as CountdownEnding;
  const text = (key: string, max: number) => (params.get(key) ?? '').trim().slice(0, max);
  return {
    preset: readPreset(params),
    scene: COUNTDOWN_SCENES.includes(scene) ? scene : defaults.scene,
    // A 0 second countdown is over before it starts, so it falls back like any other garbage.
    time: readWhole(params.get('time'), defaults.time, { min: 1, max: MAX_COUNTDOWN_TIME }),
    at: readAtTime(params.get('at')),
    title: text('title', TITLE_MAX_LENGTH),
    note: text('note', NOTE_MAX_LENGTH),
    done: text('done', TITLE_MAX_LENGTH),
    ending: COUNTDOWN_ENDINGS.includes(ending) ? ending : defaults.ending,
    look: COUNTDOWN_LOOKS.includes(look) ? look : defaults.look,
    color: COUNTDOWN_COLORS.includes(color) ? color : defaults.color,
    bar: readFlag(params.get('bar'), defaults.bar),
    motion: readFlag(params.get('motion'), defaults.motion),
  };
}

/** Reverse of buildCountdownUrl; null for anything that isn't a Stream Countdown URL. */
export function parseCountdownUrl(text: string): {
  settings: CountdownSettings;
  twitchChannel: string;
  kickChannel: string;
} | null {
  const pasted = readWidgetUrl(text, WIDGET_PATH);
  if (!pasted) return null;
  const { params, platforms, ...channels } = pasted;
  return { ...channels, settings: { platforms, ...readCountdownSettings(params) } };
}
