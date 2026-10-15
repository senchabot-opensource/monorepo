import { isClassic } from '#/features/presets/registry';
import { isValidLocale, LANG_PARAM, type Locale } from '#/lib/i18n/locales';
import { CLASSIC_PRESET, readFont, readFx, readPreset, writePreset } from './preset-url';
import type { SiteFont } from './site-fonts';
import {
  type ChannelPlatforms,
  channelWidgetUrl,
  readFlag,
  readWhole,
  readWidgetUrl,
  setChannels,
  setPreview,
} from './url-params';

export const TASKS_COLORS = ['green', 'purple', 'red', 'gold', 'cyan', 'pink'] as const;
export type TasksColor = (typeof TASKS_COLORS)[number];

export interface TasksSettings {
  platforms: ChannelPlatforms;
  /** Preset id; any preset but classic brings its own colors and fonts. */
  preset: string;
  /** Off (`fx=0`) stills the preset's effect; missing means on. */
  fx?: boolean;
  /** A site font to draw the preset in instead of its own; missing keeps the preset's. */
  font?: SiteFont;
  color: TasksColor;
  /** Above the list. */
  title: string;
  /** Open tasks one viewer may have at once. */
  max: number;
  /** Finished tasks stay on the list, ticked off; off, they go once done. */
  keepDone: boolean;
  /** How fast a list longer than the panel scrolls, in px per second. */
  speed: number;
}

export const TITLE_MAX_LENGTH = 32;
export const MAX_OPEN = 5;
export const MIN_SPEED = 10;
export const MAX_SPEED = 80;

export const DEFAULT_TASKS_SETTINGS: TasksSettings = {
  platforms: 'both',
  preset: CLASSIC_PRESET,
  color: 'green',
  title: 'Today’s Tasks',
  max: 3,
  keepDone: true,
  speed: 25,
};

/** Design size; the overlay scales to whatever browser source size it gets. */
export const TASKS_STAGE = { width: 480, height: 720 };

const WIDGET_PATH = '/widgets/tasks';

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(
  settings: TasksSettings,
  twitchChannel: string,
  kickChannel: string,
  locale: Locale,
) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_TASKS_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  writePreset(params, settings.preset, settings.fx, settings.font);
  if (isClassic(settings.preset) && settings.color !== defaults.color)
    params.set('color', settings.color);
  // Always written: the default is in the page's language.
  params.set('title', settings.title.trim().slice(0, TITLE_MAX_LENGTH));
  if (settings.max !== defaults.max) params.set('max', String(settings.max));
  if (settings.keepDone !== defaults.keepDone) params.set('done', settings.keepDone ? '1' : '0');
  if (settings.speed !== defaults.speed) params.set('speed', String(settings.speed));
  // Always written: the list's labels are words, and OBS shouldn't pick their language.
  params.set(LANG_PARAM, locale);
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildTasksUrl(
  origin: string,
  settings: TasksSettings,
  twitchChannel: string,
  kickChannel: string,
  locale: Locale,
): string {
  return channelWidgetUrl(
    origin,
    WIDGET_PATH,
    buildParams(settings, twitchChannel, kickChannel, locale),
  );
}

/** Plays a simulated list with the same settings and never touches a channel or saved list. */
export function buildTasksPreviewUrl(
  origin: string,
  settings: TasksSettings,
  locale: Locale,
  previewId: string,
): string {
  const params = buildParams(settings, '', '', locale);
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readTasksSettings(params: URLSearchParams): Omit<TasksSettings, 'platforms'> {
  const defaults = DEFAULT_TASKS_SETTINGS;
  const color = params.get('color') as TasksColor;
  const title = params.get('title');
  return {
    preset: readPreset(params),
    ...readFx(params),
    ...readFont(params),
    color: TASKS_COLORS.includes(color) ? color : defaults.color,
    title: title === null ? defaults.title : title.trim().slice(0, TITLE_MAX_LENGTH),
    max: readWhole(params.get('max'), defaults.max, { min: 1, max: MAX_OPEN, below: 'clamp' }),
    keepDone: readFlag(params.get('done'), defaults.keepDone),
    speed: readWhole(params.get('speed'), defaults.speed, {
      min: MIN_SPEED,
      max: MAX_SPEED,
      below: 'clamp',
    }),
  };
}

/** Reverse of buildTasksUrl; null for anything that isn't a Task List URL. */
export function parseTasksUrl(text: string): {
  settings: TasksSettings;
  twitchChannel: string;
  kickChannel: string;
  locale: Locale | null;
} | null {
  const pasted = readWidgetUrl(text, WIDGET_PATH);
  if (!pasted) return null;
  const { params, platforms, ...channels } = pasted;
  const lang = params.get(LANG_PARAM);
  return {
    ...channels,
    locale: isValidLocale(lang) ? lang : null,
    settings: { platforms, ...readTasksSettings(params) },
  };
}
