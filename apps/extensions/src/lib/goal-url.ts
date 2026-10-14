import { isClassic } from '#/features/presets/registry';
import { CLASSIC_PRESET, readPreset, writePreset } from './preset-url';
import {
  type ChannelPlatforms,
  channelWidgetUrl,
  platformsOf,
  readFlag,
  readWhole,
  readWidgetUrl,
  setChannels,
  setPreview,
} from './url-params';

/**
 * What fills the goal: subs, or Bits and Kicks. Only `bits` is written to the URL; every goal URL
 * from before the Bits & Kicks Goal has no type and stays a Sub Goal.
 */
export const GOAL_TYPES = ['subs', 'bits'] as const;
export type GoalType = (typeof GOAL_TYPES)[number];

export const GOAL_STYLES = ['bar', 'thin'] as const;
export type GoalStyle = (typeof GOAL_STYLES)[number];

export const GOAL_COLORS = ['purple', 'green', 'red', 'gold', 'cyan', 'pink'] as const;
export type GoalColor = (typeof GOAL_COLORS)[number];

/** What stays on screen once the goal is reached. */
export const GOAL_ENDS = ['stay', 'hide'] as const;
export type GoalEnd = (typeof GOAL_ENDS)[number];

export interface GoalSettings {
  /** Left out for a Sub Goal; `bits` for a Bits & Kicks Goal. */
  type?: GoalType;
  platforms: ChannelPlatforms;
  /** Preset id; any preset but classic brings its own colors and fonts. */
  preset: string;
  style: GoalStyle;
  color: GoalColor;
  /** Shown above the bar; empty hides it. */
  title: string;
  /** An emoji for the goal instead of the star; empty uses the star. */
  icon: string;
  /** A channel emote image for the goal; empty falls back to the icon above. */
  iconUrl: string;
  /** Where the count starts, e.g. the sub count the streamer's dashboard shows. */
  start: number;
  /** The count the goal is reached at. */
  target: number;
  /** What stays on screen once the goal is reached. */
  end: GoalEnd;
  /** Seconds the completed goal stays up before hiding; 0 hides it right away. */
  endHold: number;
  /** A rising "+1" with the viewer's name for every sub and gift. */
  pops: boolean;
}

export const DEFAULT_GOAL_SETTINGS: GoalSettings = {
  platforms: 'both',
  preset: CLASSIC_PRESET,
  style: 'bar',
  color: 'purple',
  title: 'SUB GOAL',
  icon: '',
  iconUrl: '',
  start: 0,
  target: 10,
  end: 'stay',
  endHold: 0,
  pops: true,
};

/** A Bits & Kicks Goal: its own title, and a target counted in Bits and Kicks. */
export const DEFAULT_BITS_GOAL_SETTINGS: GoalSettings = {
  ...DEFAULT_GOAL_SETTINGS,
  type: 'bits',
  title: 'BITS & KICKS GOAL',
  target: 1000,
};

/** What a Bits & Kicks Goal counts: Bits on Twitch, Kicks on Kick, or both. */
export type CheerPlatforms = 'both' | 'twitch' | 'kick';

export const cheerPlatformsFor = (platforms: ChannelPlatforms): CheerPlatforms =>
  platforms === 'twitch' || platforms === 'kick' ? platforms : 'both';

/** A Bits & Kicks Goal's default title names only what its platforms send. */
export const BITS_GOAL_TITLES: Record<CheerPlatforms, string> = {
  both: DEFAULT_BITS_GOAL_SETTINGS.title,
  twitch: 'BITS GOAL',
  kick: 'KICKS GOAL',
};

/** The defaults a URL of this type, on these platforms, falls back to. */
export const goalDefaults = (
  type: GoalType = 'subs',
  platforms: ChannelPlatforms = 'both',
): GoalSettings =>
  type === 'bits'
    ? { ...DEFAULT_BITS_GOAL_SETTINGS, title: BITS_GOAL_TITLES[cheerPlatformsFor(platforms)] }
    : DEFAULT_GOAL_SETTINGS;

/** The platforms a goal URL counts on: its channels, or in a preview, the one it plays. */
function urlPlatforms(params: URLSearchParams): ChannelPlatforms {
  const simulated = params.get('simplatform');
  if (simulated === 'twitch' || simulated === 'kick') return simulated;
  return platformsOf(params.get('twitch') ?? '', params.get('kick') ?? '');
}

/** Upper bound for every count: bigger than any channel's subs, small enough to stay exact. */
export const MAX_GOAL_COUNT = 1_000_000;
export const TITLE_MAX_LENGTH = 32;
/** Long enough for a few emoji; cut by code point so one is never split in half. */
export const ICON_MAX_LENGTH = 8;
/** Cap for an emote image URL: long enough for any CDN link, short enough to stay sane. */
const ICON_URL_MAX_LENGTH = 500;
/** How long the completed goal may stay up. */
export const MAX_END_HOLD_SECONDS = 600;

const WIDGET_PATH = '/widgets/goal';

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(settings: GoalSettings, twitchChannel: string, kickChannel: string) {
  const params = new URLSearchParams();
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  // Measured against the default the overlay picks: from the channels this URL names, or in a
  // preview, which names none, from the platform it plays.
  const named = params.has('twitch') || params.has('kick');
  const defaults = goalDefaults(
    settings.type,
    named ? platformsOf(params.get('twitch') ?? '', params.get('kick') ?? '') : settings.platforms,
  );
  if (settings.type === 'bits') params.set('type', 'bits');
  writePreset(params, settings.preset);
  if (settings.style && settings.style !== defaults.style) params.set('style', settings.style);
  if (isClassic(settings.preset) && settings.color !== defaults.color)
    params.set('color', settings.color);
  if (settings.title !== defaults.title) params.set('title', settings.title);
  const icon = Array.from(settings.icon.trim()).slice(0, ICON_MAX_LENGTH).join('');
  if (icon) params.set('icon', icon);
  const iconUrl = settings.iconUrl.trim().slice(0, ICON_URL_MAX_LENGTH);
  if (iconUrl) params.set('iconUrl', iconUrl);
  if (settings.start !== defaults.start) params.set('start', String(settings.start));
  if (settings.target !== defaults.target) params.set('target', String(settings.target));
  if (settings.end !== defaults.end) params.set('end', settings.end);
  if (settings.endHold !== defaults.endHold)
    params.set('endHold', String(Math.min(MAX_END_HOLD_SECONDS, Math.max(0, settings.endHold))));
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
  return channelWidgetUrl(origin, WIDGET_PATH, buildParams(settings, twitchChannel, kickChannel));
}

/** Plays simulated subs (or cheers) with the same settings and never touches a channel or saved count. */
export function buildGoalPreviewUrl(
  origin: string,
  settings: GoalSettings,
  previewId: string,
): string {
  const params = buildParams(settings, '', '');
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** The goal type a URL's params name; anything but `bits` is a Sub Goal, as before types. */
export const readGoalType = (params: URLSearchParams): GoalType =>
  params.get('type') === 'bits' ? 'bits' : 'subs';

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readGoalSettings(params: URLSearchParams): Omit<GoalSettings, 'platforms'> {
  const type = readGoalType(params);
  const defaults = goalDefaults(type, urlPlatforms(params));
  const style = params.get('style') as GoalStyle;
  const color = params.get('color') as GoalColor;
  const end = params.get('end') as GoalEnd;
  const title = params.get('title');
  return {
    // A Sub Goal's settings carry no type, exactly as they did before there were types.
    ...(type === 'bits' ? { type } : {}),
    preset: readPreset(params),
    style: GOAL_STYLES.includes(style) ? style : defaults.style,
    color: GOAL_COLORS.includes(color) ? color : defaults.color,
    title: title === null ? defaults.title : title.slice(0, TITLE_MAX_LENGTH),
    icon: Array.from((params.get('icon') ?? '').trim())
      .slice(0, ICON_MAX_LENGTH)
      .join(''),
    iconUrl: (params.get('iconUrl') ?? '').trim().slice(0, ICON_URL_MAX_LENGTH),
    start: readWhole(params.get('start'), defaults.start, { max: MAX_GOAL_COUNT }),
    // A goal of 0 would be reached before it began.
    target: readWhole(params.get('target'), defaults.target, { min: 1, max: MAX_GOAL_COUNT }),
    end: GOAL_ENDS.includes(end) ? end : defaults.end,
    endHold: readWhole(params.get('endHold'), defaults.endHold, { max: MAX_END_HOLD_SECONDS }),
    pops: readFlag(params.get('pops'), defaults.pops),
  };
}

/** The type of a pasted goal URL; null for text that isn't a goal URL at all. */
export function goalUrlType(text: string): GoalType | null {
  const pasted = readWidgetUrl(text, WIDGET_PATH);
  return pasted ? readGoalType(pasted.params) : null;
}

/**
 * Reverse of buildGoalUrl; null for anything that isn't a goal URL of `type` (a Sub Goal by
 * default), so a Sub Goal page never loads a Bits & Kicks Goal and the other way round.
 */
export function parseGoalUrl(
  text: string,
  type: GoalType = 'subs',
): { settings: GoalSettings; twitchChannel: string; kickChannel: string } | null {
  const pasted = readWidgetUrl(text, WIDGET_PATH);
  if (!pasted || readGoalType(pasted.params) !== type) return null;
  const { params, platforms, ...channels } = pasted;
  return { ...channels, settings: { platforms, ...readGoalSettings(params) } };
}
