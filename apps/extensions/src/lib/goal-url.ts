import {
  type ChannelPlatforms,
  channelWidgetUrl,
  readFlag,
  readWhole,
  readWidgetUrl,
  setChannels,
  setPreview,
} from './url-params';

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
  const defaults = DEFAULT_GOAL_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
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
  return channelWidgetUrl(origin, WIDGET_PATH, buildParams(settings, twitchChannel, kickChannel));
}

/** Plays simulated subs with the same settings and never touches a channel or saved count. */
export function buildGoalPreviewUrl(
  origin: string,
  settings: GoalSettings,
  previewId: string,
): string {
  const params = buildParams(settings, '', '');
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readGoalSettings(params: URLSearchParams): Omit<GoalSettings, 'platforms'> {
  const defaults = DEFAULT_GOAL_SETTINGS;
  const color = params.get('color') as GoalColor;
  const title = params.get('title');
  return {
    color: GOAL_COLORS.includes(color) ? color : defaults.color,
    title: title === null ? defaults.title : title.slice(0, TITLE_MAX_LENGTH),
    start: readWhole(params.get('start'), defaults.start, { max: MAX_GOAL_COUNT }),
    // A goal of 0 would be reached before it began.
    target: readWhole(params.get('target'), defaults.target, { min: 1, max: MAX_GOAL_COUNT }),
    pops: readFlag(params.get('pops'), defaults.pops),
  };
}

/** Reverse of buildGoalUrl; null for anything that isn't a Sub Goal URL. */
export function parseGoalUrl(
  text: string,
): { settings: GoalSettings; twitchChannel: string; kickChannel: string } | null {
  const pasted = readWidgetUrl(text, WIDGET_PATH);
  if (!pasted) return null;
  const { params, platforms, ...channels } = pasted;
  return { ...channels, settings: { platforms, ...readGoalSettings(params) } };
}
