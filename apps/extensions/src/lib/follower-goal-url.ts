import { isClassic } from '#/features/presets/registry';
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

export const FOLLOWER_GOAL_STYLES = ['bar', 'thin'] as const;
export type FollowerGoalStyle = (typeof FOLLOWER_GOAL_STYLES)[number];

export const FOLLOWER_GOAL_COLORS = ['purple', 'green', 'red', 'gold', 'cyan', 'pink'] as const;
export type FollowerGoalColor = (typeof FOLLOWER_GOAL_COLORS)[number];

export const FOLLOWER_GOAL_ENDS = ['stay', 'hide'] as const;
export type FollowerGoalEnd = (typeof FOLLOWER_GOAL_ENDS)[number];

export interface FollowerGoalSettings {
  platforms: ChannelPlatforms;
  /** Preset id; any preset but classic brings its own colors and fonts. */
  preset: string;
  style: FollowerGoalStyle;
  color: FollowerGoalColor;
  /** Shown above the bar; empty hides it. */
  title: string;
  /** An emoji for the goal instead of the star; empty uses the star. */
  icon: string;
  /** A channel emote image for the goal; empty falls back to the icon above. */
  iconUrl: string;
  /** Where the count starts, e.g. the follower count the streamer's dashboard shows. */
  start: number;
  /** The count the goal is reached at. */
  target: number;
  /** What stays on screen once the goal is reached. */
  end: FollowerGoalEnd;
  /** Seconds the completed goal stays up before hiding; 0 hides it right away. */
  endHold: number;
  /** A rising "+1" with the viewer's name for every follow. */
  pops: boolean;
}

export const DEFAULT_FOLLOWER_GOAL_SETTINGS: FollowerGoalSettings = {
  platforms: 'both',
  preset: CLASSIC_PRESET,
  style: 'bar',
  color: 'purple',
  title: 'FOLLOWER GOAL',
  icon: '',
  iconUrl: '',
  start: 0,
  target: 100,
  end: 'stay',
  endHold: 0,
  pops: true,
};

export const MAX_FOLLOWER_GOAL_COUNT = 10_000_000;
export const TITLE_MAX_LENGTH = 32;
export const ICON_MAX_LENGTH = 8;
const ICON_URL_MAX_LENGTH = 500;
export const MAX_END_HOLD_SECONDS = 600;

export const WIDGET_PATH = '/widgets/follower-goal';

function buildParams(
  settings: FollowerGoalSettings,
  twitchChannel: string,
  kickChannel: string,
  token?: string,
) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_FOLLOWER_GOAL_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
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
  const tok = token?.trim();
  if (tok) params.set('token', tok);
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildFollowerGoalUrl(
  origin: string,
  settings: FollowerGoalSettings,
  twitchChannel: string,
  kickChannel: string,
  token?: string,
): string {
  return channelWidgetUrl(origin, WIDGET_PATH, buildParams(settings, twitchChannel, kickChannel, token));
}

/** Plays simulated follows with the same settings and never touches a channel or saved count. */
export function buildFollowerGoalPreviewUrl(
  origin: string,
  settings: FollowerGoalSettings,
  previewId: string,
): string {
  const params = buildParams(settings, '', '');
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readFollowerGoalSettings(
  params: URLSearchParams,
): Omit<FollowerGoalSettings, 'platforms'> {
  const defaults = DEFAULT_FOLLOWER_GOAL_SETTINGS;
  const style = params.get('style') as FollowerGoalStyle;
  const color = params.get('color') as FollowerGoalColor;
  const end = params.get('end') as FollowerGoalEnd;
  const title = params.get('title');
  return {
    preset: readPreset(params),
    style: FOLLOWER_GOAL_STYLES.includes(style) ? style : defaults.style,
    color: FOLLOWER_GOAL_COLORS.includes(color) ? color : defaults.color,
    title: title === null ? defaults.title : title.slice(0, TITLE_MAX_LENGTH),
    icon: Array.from((params.get('icon') ?? '').trim())
      .slice(0, ICON_MAX_LENGTH)
      .join(''),
    iconUrl: (params.get('iconUrl') ?? '').trim().slice(0, ICON_URL_MAX_LENGTH),
    start: readWhole(params.get('start'), defaults.start, { max: MAX_FOLLOWER_GOAL_COUNT }),
    target: readWhole(params.get('target'), defaults.target, {
      min: 1,
      max: MAX_FOLLOWER_GOAL_COUNT,
    }),
    end: FOLLOWER_GOAL_ENDS.includes(end) ? end : defaults.end,
    endHold: readWhole(params.get('endHold'), defaults.endHold, { max: MAX_END_HOLD_SECONDS }),
    pops: readFlag(params.get('pops'), defaults.pops),
  };
}

/** Reverse of buildFollowerGoalUrl; null for anything that isn't a Follower Goal URL. */
export function parseFollowerGoalUrl(text: string): {
  settings: FollowerGoalSettings;
  twitchChannel: string;
  kickChannel: string;
  token?: string;
} | null {
  const pasted = readWidgetUrl(text, WIDGET_PATH);
  if (!pasted) return null;
  const { params, platforms, ...channels } = pasted;
  const token = params.get('token')?.trim() || undefined;
  return {
    ...channels,
    token,
    settings: { platforms, ...readFollowerGoalSettings(params) },
  };
}
