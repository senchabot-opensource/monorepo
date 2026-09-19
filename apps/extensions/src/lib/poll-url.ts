import type { ChannelPlatforms } from '#/components/channel-fields';
import {
  cleanOptions,
  MAX_OPTIONS,
  MIN_OPTIONS,
  OPTION_MAX_LENGTH,
  QUESTION_MAX_LENGTH,
} from '#/features/widgets/poll/poll-state';
import { isValidLocale, LANG_PARAM, type Locale } from '#/lib/i18n/locales';
import { readFlag } from '#/lib/subathon-url';

export const POLL_COLORS = ['purple', 'green', 'red', 'gold', 'cyan', 'pink'] as const;
export type PollColor = (typeof POLL_COLORS)[number];
export const POLL_POSITIONS = ['top', 'bottom'] as const;
export type PollPosition = (typeof POLL_POSITIONS)[number];
export const SUB_WEIGHTS = [1, 2, 3] as const;

export interface PollSettings {
  platforms: ChannelPlatforms;
  /** The ready-made poll `!poll start` puts up. Its options may hold blanks while typing. */
  question: string;
  options: string[];
  /** Seconds a poll takes votes; 0 keeps it open until a mod ends it. */
  duration: number;
  /** Seconds votes still count after the timer ends, for viewers watching behind live. */
  delay: number;
  /** Seconds results stay up; 0 keeps them up until the next poll. */
  hold: number;
  subsOnly: boolean;
  /** How many votes a sub's vote is worth. */
  subWeight: number;
  /** Whether a viewer can switch to another option. */
  change: boolean;
  /** Hides the bars until voting closes, so early votes don't sway the rest. */
  blind: boolean;
  color: PollColor;
  /** Where the poll sits in the browser source. */
  position: PollPosition;
}

export const DEFAULT_POLL_SETTINGS: PollSettings = {
  platforms: 'both',
  question: '',
  options: ['', ''],
  duration: 60,
  delay: 5,
  hold: 30,
  subsOnly: false,
  subWeight: 1,
  change: true,
  blind: false,
  color: 'purple',
  position: 'top',
};

export const MAX_DURATION_SECONDS = 3600;
export const MAX_DELAY_SECONDS = 30;
export const MAX_HOLD_SECONDS = 600;
export { MAX_OPTIONS, OPTION_MAX_LENGTH, QUESTION_MAX_LENGTH };

const WIDGET_PATH = '/widgets/poll';
const OPTION_SEPARATOR = '|';

/** The ready-made poll, or null while it has fewer than two options. */
export function savedPoll(settings: Pick<PollSettings, 'question' | 'options'>) {
  const options = cleanOptions(settings.options);
  return options.length >= MIN_OPTIONS
    ? { question: settings.question.trim().slice(0, QUESTION_MAX_LENGTH), options }
    : null;
}

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(
  settings: PollSettings,
  twitchChannel: string,
  kickChannel: string,
  locale: Locale,
) {
  const params = new URLSearchParams();
  const twitch = twitchChannel.trim().toLowerCase();
  const kick = kickChannel.trim().toLowerCase();
  const defaults = DEFAULT_POLL_SETTINGS;
  if (settings.platforms !== 'kick' && twitch) params.set('twitch', twitch);
  if (settings.platforms !== 'twitch' && kick) params.set('kick', kick);
  const poll = savedPoll(settings);
  if (poll) {
    if (poll.question) params.set('q', poll.question);
    // One param, split like the chat command: the router drops repeated params, and an option
    // can't hold a "|" since chat commands split on it.
    params.set('o', poll.options.join(OPTION_SEPARATOR));
  }
  if (settings.duration !== defaults.duration) params.set('dur', String(settings.duration));
  if (settings.delay !== defaults.delay) params.set('delay', String(settings.delay));
  if (settings.hold !== defaults.hold) params.set('hold', String(settings.hold));
  if (settings.subsOnly !== defaults.subsOnly) params.set('subs', settings.subsOnly ? '1' : '0');
  if (settings.subWeight !== defaults.subWeight) params.set('subx', String(settings.subWeight));
  if (settings.change !== defaults.change) params.set('change', settings.change ? '1' : '0');
  if (settings.blind !== defaults.blind) params.set('blind', settings.blind ? '1' : '0');
  if (settings.color !== defaults.color) params.set('color', settings.color);
  if (settings.position !== defaults.position) params.set('pos', settings.position);
  // Always written: the poll shows words, and OBS shouldn't pick their language.
  params.set(LANG_PARAM, locale);
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildPollUrl(
  origin: string,
  settings: PollSettings,
  twitchChannel: string,
  kickChannel: string,
  locale: Locale,
): string {
  const params = buildParams(settings, twitchChannel, kickChannel, locale);
  if (!params.has('twitch') && !params.has('kick')) return '';
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/**
 * Plays simulated polls with the same settings and never touches a channel or saved poll. With
 * one platform picked, only that one's viewers vote. `previewId` pairs it with its setup page,
 * whose test buttons would otherwise reach every preview and demo open on the site.
 */
export function buildPollPreviewUrl(
  origin: string,
  settings: PollSettings,
  locale: Locale,
  previewId: string,
): string {
  const params = buildParams(settings, '', '', locale);
  params.set('simulate', '1');
  params.set('preview', previewId);
  if (settings.platforms !== 'both') params.set('simplatform', settings.platforms);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** A whole number from 0 to `max`, or `fallback`. */
function readWhole(value: string | null, fallback: number, max: number): number {
  if (value === null || value.trim() === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.min(max, Math.round(n)) : fallback;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readPollSettings(params: URLSearchParams): Omit<PollSettings, 'platforms'> {
  const defaults = DEFAULT_POLL_SETTINGS;
  const color = params.get('color') as PollColor;
  const position = params.get('pos') as PollPosition;
  const subWeight = Number(params.get('subx'));
  const options = cleanOptions((params.get('o') ?? '').split(OPTION_SEPARATOR));
  return {
    question: (params.get('q') ?? '').trim().slice(0, QUESTION_MAX_LENGTH),
    // The setup page shows at least two boxes.
    options: options.length >= MIN_OPTIONS ? options : [...options, '', ''].slice(0, MIN_OPTIONS),
    duration: readWhole(params.get('dur'), defaults.duration, MAX_DURATION_SECONDS),
    delay: readWhole(params.get('delay'), defaults.delay, MAX_DELAY_SECONDS),
    hold: readWhole(params.get('hold'), defaults.hold, MAX_HOLD_SECONDS),
    subsOnly: readFlag(params.get('subs'), defaults.subsOnly),
    subWeight: (SUB_WEIGHTS as readonly number[]).includes(subWeight)
      ? subWeight
      : defaults.subWeight,
    change: readFlag(params.get('change'), defaults.change),
    blind: readFlag(params.get('blind'), defaults.blind),
    color: POLL_COLORS.includes(color) ? color : defaults.color,
    position: POLL_POSITIONS.includes(position) ? position : defaults.position,
  };
}

/** Reverse of buildPollUrl; null for anything that isn't a Chat Poll URL. */
export function parsePollUrl(text: string): {
  settings: PollSettings;
  twitchChannel: string;
  kickChannel: string;
  locale: Locale | null;
} | null {
  let url: URL;
  try {
    url = new URL(text.trim());
  } catch {
    return null;
  }
  if (!url.pathname.replace(/\/+$/, '').endsWith(WIDGET_PATH)) return null;
  const twitchChannel = url.searchParams.get('twitch')?.trim() ?? '';
  const kickChannel = url.searchParams.get('kick')?.trim() ?? '';
  const lang = url.searchParams.get(LANG_PARAM);
  return {
    twitchChannel,
    kickChannel,
    locale: isValidLocale(lang) ? lang : null,
    settings: {
      platforms:
        twitchChannel && !kickChannel ? 'twitch' : kickChannel && !twitchChannel ? 'kick' : 'both',
      ...readPollSettings(url.searchParams),
    },
  };
}
