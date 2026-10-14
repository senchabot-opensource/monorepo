import { isClassic } from '#/features/presets/registry';
import { isValidLocale, LANG_PARAM, type Locale } from '#/lib/i18n/locales';
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

export const FEATURED_COLORS = ['purple', 'green', 'red', 'gold', 'cyan', 'pink'] as const;
export type FeaturedColor = (typeof FEATURED_COLORS)[number];

/** Which chat commands are on: `!feature` for mods, `!q` questions, or both. */
export const FEATURED_MODES = ['both', 'feature', 'qa'] as const;
export type FeaturedMode = (typeof FEATURED_MODES)[number];

export interface FeaturedSettings {
  platforms: ChannelPlatforms;
  /** Preset id; any preset but classic brings its own colors and fonts. */
  preset: string;
  color: FeaturedColor;
  mode: FeaturedMode;
  /**
   * Seconds a message stays on screen. 0, the default, keeps it until a mod hides or replaces
   * it: a question can take a while to answer, and it shouldn't go mid-answer.
   */
  hide: number;
  /** The "N questions waiting" badge, when questions are on. */
  waiting: boolean;
  /** Text size in percent of the design size. */
  size: number;
}

export const MAX_HIDE_SECONDS = 600;
export const MIN_SIZE = 50;
export const MAX_SIZE = 150;

export const DEFAULT_FEATURED_SETTINGS: FeaturedSettings = {
  platforms: 'both',
  preset: CLASSIC_PRESET,
  color: 'purple',
  mode: 'both',
  hide: 0,
  waiting: true,
  size: 100,
};

/** Design size; the overlay scales to whatever browser source size it gets. */
export const FEATURED_STAGE = { width: 720, height: 240 };

const WIDGET_PATH = '/widgets/featured';

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(
  settings: FeaturedSettings,
  twitchChannel: string,
  kickChannel: string,
  locale: Locale,
) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_FEATURED_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  writePreset(params, settings.preset);
  if (isClassic(settings.preset) && settings.color !== defaults.color)
    params.set('color', settings.color);
  if (settings.mode !== defaults.mode) params.set('mode', settings.mode);
  if (settings.hide !== defaults.hide) params.set('hide', String(settings.hide));
  if (settings.waiting !== defaults.waiting) params.set('waiting', settings.waiting ? '1' : '0');
  if (settings.size !== defaults.size) params.set('size', String(settings.size));
  // Always written: the labels are words, and OBS shouldn't pick their language.
  params.set(LANG_PARAM, locale);
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildFeaturedUrl(
  origin: string,
  settings: FeaturedSettings,
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

/** Plays simulated chat with the same settings and never touches a channel or saved queue. */
export function buildFeaturedPreviewUrl(
  origin: string,
  settings: FeaturedSettings,
  locale: Locale,
  previewId: string,
): string {
  const params = buildParams(settings, '', '', locale);
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readFeaturedSettings(params: URLSearchParams): Omit<FeaturedSettings, 'platforms'> {
  const defaults = DEFAULT_FEATURED_SETTINGS;
  const color = params.get('color') as FeaturedColor;
  const mode = params.get('mode') as FeaturedMode;
  return {
    preset: readPreset(params),
    color: FEATURED_COLORS.includes(color) ? color : defaults.color,
    mode: FEATURED_MODES.includes(mode) ? mode : defaults.mode,
    hide: readWhole(params.get('hide'), defaults.hide, { max: MAX_HIDE_SECONDS }),
    waiting: readFlag(params.get('waiting'), defaults.waiting),
    size: readWhole(params.get('size'), defaults.size, {
      min: MIN_SIZE,
      max: MAX_SIZE,
      below: 'clamp',
    }),
  };
}

/** Reverse of buildFeaturedUrl; null for anything that isn't a Featured Message URL. */
export function parseFeaturedUrl(text: string): {
  settings: FeaturedSettings;
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
    settings: { platforms, ...readFeaturedSettings(params) },
  };
}
