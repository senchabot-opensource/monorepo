import type { ChannelPlatforms } from '#/components/channel-fields';
import { readFlag } from './subathon-url';

export const GOAL_COLORS = ['purple', 'green', 'red', 'gold', 'cyan', 'pink'] as const;
export type GoalColor = (typeof GOAL_COLORS)[number];

export interface GoalSettings {
  platforms: ChannelPlatforms;
  color: GoalColor;
  /** Shown above the bar; empty hides it. */
  title: string;
  /** Where the count starts, e.g. the sub count the streamer's dashboard shows. */
  start: number;
  /** The count the goal is reached at. */
  target: number;
  /** A rising "+1" with the viewer's name for every sub and gift. */
  pops: boolean;
}

export const DEFAULT_GOAL_SETTINGS: GoalSettings = {
  platforms: 'both',
  color: 'purple',
  title: 'SUB GOAL',
  start: 0,
  target: 10,
  pops: true,
};

/** Upper bound for every count: bigger than any channel's subs, small enough to stay exact. */
export const MAX_GOAL_COUNT = 1_000_000;
export const TITLE_MAX_LENGTH = 32;

const WIDGET_PATH = '/widgets/goal';

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(settings: GoalSettings, twitchChannel: string, kickChannel: string) {
  const params = new URLSearchParams();
  const twitch = twitchChannel.trim().toLowerCase();
  const kick = kickChannel.trim().toLowerCase();
  const defaults = DEFAULT_GOAL_SETTINGS;
  if (settings.platforms !== 'kick' && twitch) params.set('twitch', twitch);
  if (settings.platforms !== 'twitch' && kick) params.set('kick', kick);
  if (settings.color !== defaults.color) params.set('color', settings.color);
  if (settings.title !== defaults.title) params.set('title', settings.title);
  if (settings.start !== defaults.start) params.set('start', String(settings.start));
  if (settings.target !== defaults.target) params.set('target', String(settings.target));
  if (settings.pops !== defaults.pops) params.set('pops', settings.pops ? '1' : '0');
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildGoalUrl(
  origin: string,
  settings: GoalSettings,
  twitchChannel: string,
  kickChannel: string,
): string {
  const params = buildParams(settings, twitchChannel, kickChannel);
  if (!params.has('twitch') && !params.has('kick')) return '';
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/**
 * Plays simulated subs with the same settings and never touches a channel or saved count. With
 * one platform picked, it only simulates that one's subs. `previewId` pairs it with its setup
 * page, whose test buttons would otherwise reach every preview and demo open on the site.
 */
export function buildGoalPreviewUrl(
  origin: string,
  settings: GoalSettings,
  previewId: string,
): string {
  const params = buildParams(settings, '', '');
  params.set('simulate', '1');
  params.set('preview', previewId);
  if (settings.platforms !== 'both') params.set('simplatform', settings.platforms);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** A whole number from `min` to MAX_GOAL_COUNT, or `fallback`. */
function readCount(value: string | null, fallback: number, min: number): number {
  if (value === null || value.trim() === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= min ? Math.min(MAX_GOAL_COUNT, Math.round(n)) : fallback;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readGoalSettings(params: URLSearchParams): Omit<GoalSettings, 'platforms'> {
  const defaults = DEFAULT_GOAL_SETTINGS;
  const color = params.get('color') as GoalColor;
  const title = params.get('title');
  return {
    color: GOAL_COLORS.includes(color) ? color : defaults.color,
    title: title === null ? defaults.title : title.slice(0, TITLE_MAX_LENGTH),
    start: readCount(params.get('start'), defaults.start, 0),
    // A goal of 0 would be reached before it began.
    target: readCount(params.get('target'), defaults.target, 1),
    pops: readFlag(params.get('pops'), defaults.pops),
  };
}

/** Reverse of buildGoalUrl; null for anything that isn't a Sub Goal URL. */
export function parseGoalUrl(
  text: string,
): { settings: GoalSettings; twitchChannel: string; kickChannel: string } | null {
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
      ...readGoalSettings(url.searchParams),
    },
  };
}
