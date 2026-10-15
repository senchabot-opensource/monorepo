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

export const QUEUE_COLORS = ['purple', 'green', 'red', 'gold', 'cyan', 'pink'] as const;
export type QueueColor = (typeof QUEUE_COLORS)[number];

export interface QueueSettings {
  platforms: ChannelPlatforms;
  /** Preset id; any preset but classic brings its own colors and fonts. */
  preset: string;
  /** Off (`fx=0`) stills the preset's effect; missing means on. */
  fx?: boolean;
  /** A site font to draw the preset in instead of its own; missing keeps the preset's. */
  font?: SiteFont;
  color: QueueColor;
  /** Above the queue. */
  title: string;
  /** What viewers type to join, like !join. */
  join: string;
  /** Only subscribers may join. */
  subsOnly: boolean;
  /** Most viewers waiting at once; 0 for no limit. */
  max: number;
  /** Waiting viewers shown by name; the rest are counted. */
  rows: number;
  /** How many viewers one !next calls up. */
  group: number;
}

export const TITLE_MAX_LENGTH = 32;
export const JOIN_MAX_LENGTH = 20;
export const MAX_QUEUE = 500;
export const MIN_ROWS = 3;
export const MAX_ROWS = 15;
export const MAX_GROUP = 10;

export const DEFAULT_JOIN = '!join';

export const DEFAULT_QUEUE_SETTINGS: QueueSettings = {
  platforms: 'both',
  preset: CLASSIC_PRESET,
  color: 'purple',
  title: 'Viewer Queue',
  join: DEFAULT_JOIN,
  subsOnly: false,
  max: 0,
  rows: 8,
  group: 1,
};

/** Design size; the overlay scales to whatever browser source size it gets. */
export const QUEUE_STAGE = { width: 440, height: 600 };

/** The stage for this many names: the default size holds eight, and each name past that adds 40px. */
export const queueStage = (rows: number) => ({
  width: QUEUE_STAGE.width,
  height: Math.max(QUEUE_STAGE.height, 250 + 40 * rows),
});

const WIDGET_PATH = '/widgets/queue';

/** A join word as viewers type it: one word, starting with "!", lowercased. */
export function normalizeJoin(text: string): string {
  const word = text.trim().split(/\s+/)[0]?.toLowerCase() ?? '';
  const bare = word.replace(/^!+/, '').slice(0, JOIN_MAX_LENGTH - 1);
  return bare ? `!${bare}` : '';
}

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(
  settings: QueueSettings,
  twitchChannel: string,
  kickChannel: string,
  locale: Locale,
) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_QUEUE_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  writePreset(params, settings.preset, settings.fx, settings.font);
  if (isClassic(settings.preset) && settings.color !== defaults.color)
    params.set('color', settings.color);
  // Always written: the default is in the page's language.
  params.set('title', settings.title.trim().slice(0, TITLE_MAX_LENGTH));
  const join = normalizeJoin(settings.join);
  if (join && join !== defaults.join) params.set('join', join);
  if (settings.subsOnly) params.set('subs', '1');
  if (settings.max !== defaults.max) params.set('max', String(settings.max));
  if (settings.rows !== defaults.rows) params.set('rows', String(settings.rows));
  if (settings.group !== defaults.group) params.set('group', String(settings.group));
  // Always written: the queue's labels are words, and OBS shouldn't pick their language.
  params.set(LANG_PARAM, locale);
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildQueueUrl(
  origin: string,
  settings: QueueSettings,
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

/** Plays a simulated queue with the same settings and never touches a channel or saved queue. */
export function buildQueuePreviewUrl(
  origin: string,
  settings: QueueSettings,
  locale: Locale,
  previewId: string,
): string {
  const params = buildParams(settings, '', '', locale);
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readQueueSettings(params: URLSearchParams): Omit<QueueSettings, 'platforms'> {
  const defaults = DEFAULT_QUEUE_SETTINGS;
  const color = params.get('color') as QueueColor;
  const title = params.get('title');
  return {
    preset: readPreset(params),
    ...readFx(params),
    ...readFont(params),
    color: QUEUE_COLORS.includes(color) ? color : defaults.color,
    title: title === null ? defaults.title : title.trim().slice(0, TITLE_MAX_LENGTH),
    join: normalizeJoin(params.get('join') ?? '') || defaults.join,
    subsOnly: readFlag(params.get('subs'), false),
    max: readWhole(params.get('max'), defaults.max, { max: MAX_QUEUE }),
    rows: readWhole(params.get('rows'), defaults.rows, {
      min: MIN_ROWS,
      max: MAX_ROWS,
      below: 'clamp',
    }),
    group: readWhole(params.get('group'), defaults.group, {
      min: 1,
      max: MAX_GROUP,
      below: 'clamp',
    }),
  };
}

/** Reverse of buildQueueUrl; null for anything that isn't a Viewer Queue URL. */
export function parseQueueUrl(text: string): {
  settings: QueueSettings;
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
    settings: { platforms, ...readQueueSettings(params) },
  };
}
