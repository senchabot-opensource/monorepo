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

/** What the list shows. `bits` is Bits on Twitch and Kicks on Kick. */
export const EVENT_KINDS = ['sub', 'gift', 'bits', 'raid'] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

/** `platform` tints each row Twitch purple or Kick green. */
export const EVENT_LIST_COLORS = [
  'platform',
  'purple',
  'green',
  'red',
  'gold',
  'cyan',
  'pink',
] as const;
export type EventListColor = (typeof EVENT_LIST_COLORS)[number];

/** Where a new event comes in: on top, pushing the others down, or at the bottom like chat. */
export const EVENT_LIST_NEWEST = ['top', 'bottom'] as const;
export type EventListNewest = (typeof EVENT_LIST_NEWEST)[number];

export interface EventListSettings {
  platforms: ChannelPlatforms;
  /** Preset id; any preset but classic brings its own colors and fonts. */
  preset: string;
  /** Off (`fx=0`) stills the preset's effect; missing means on. */
  fx?: boolean;
  /** A site font to draw the preset in instead of its own; missing keeps the preset's. */
  font?: SiteFont;
  color: EventListColor;
  /** Which events make the list. */
  kinds: Record<EventKind, boolean>;
  /** How many events show at once. */
  rows: number;
  newest: EventListNewest;
  /** Seconds an event stays on screen; 0 keeps it until newer ones push it out. */
  fade: number;
  /** The fewest Bits or Kicks a cheer needs to make the list. */
  minBits: number;
  /** The fewest viewers a raid needs to make the list. */
  minRaid: number;
  /** Above the list; empty shows none. */
  title: string;
}

export const MIN_ROWS = 3;
export const MAX_ROWS = 10;
export const MAX_FADE_SECONDS = 600;
export const MAX_MIN_BITS = 100_000;
export const MAX_MIN_RAID = 10_000;
export const TITLE_MAX_LENGTH = 32;

export const DEFAULT_EVENT_LIST_SETTINGS: EventListSettings = {
  platforms: 'both',
  preset: CLASSIC_PRESET,
  color: 'platform',
  kinds: { sub: true, gift: true, bits: true, raid: true },
  rows: 5,
  newest: 'top',
  fade: 0,
  minBits: 1,
  minRaid: 1,
  title: '',
};

/** Design size; the overlay scales to whatever browser source size it gets. */
export const EVENT_LIST_STAGE = { width: 420, height: 520 };

/** The stage for this many rows: the default size holds six, and each row past that adds 70px. */
export const eventListStage = (rows: number) => ({
  width: EVENT_LIST_STAGE.width,
  height: Math.max(EVENT_LIST_STAGE.height, 60 + 70 * rows),
});

const WIDGET_PATH = '/widgets/event-list';

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(
  settings: EventListSettings,
  twitchChannel: string,
  kickChannel: string,
  locale: Locale,
) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_EVENT_LIST_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  writePreset(params, settings.preset, settings.fx, settings.font);
  if (isClassic(settings.preset) && settings.color !== defaults.color)
    params.set('color', settings.color);
  for (const kind of EVENT_KINDS) if (!settings.kinds[kind]) params.set(kind, '0');
  if (settings.rows !== defaults.rows) params.set('rows', String(settings.rows));
  if (settings.newest !== defaults.newest) params.set('newest', settings.newest);
  if (settings.fade !== defaults.fade) params.set('fade', String(settings.fade));
  if (settings.minBits !== defaults.minBits) params.set('minbits', String(settings.minBits));
  if (settings.minRaid !== defaults.minRaid) params.set('minraid', String(settings.minRaid));
  const title = settings.title.trim().slice(0, TITLE_MAX_LENGTH);
  if (title) params.set('title', title);
  // Always written: the rows are words, and OBS shouldn't pick their language.
  params.set(LANG_PARAM, locale);
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildEventListUrl(
  origin: string,
  settings: EventListSettings,
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

/** Plays simulated events with the same settings and never touches a channel or saved list. */
export function buildEventListPreviewUrl(
  origin: string,
  settings: EventListSettings,
  locale: Locale,
  previewId: string,
): string {
  const params = buildParams(settings, '', '', locale);
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readEventListSettings(
  params: URLSearchParams,
): Omit<EventListSettings, 'platforms'> {
  const defaults = DEFAULT_EVENT_LIST_SETTINGS;
  const color = params.get('color') as EventListColor;
  const newest = params.get('newest') as EventListNewest;
  return {
    preset: readPreset(params),
    ...readFx(params),
    ...readFont(params),
    color: EVENT_LIST_COLORS.includes(color) ? color : defaults.color,
    kinds: Object.fromEntries(
      EVENT_KINDS.map((kind) => [kind, readFlag(params.get(kind), true)]),
    ) as Record<EventKind, boolean>,
    rows: readWhole(params.get('rows'), defaults.rows, {
      min: MIN_ROWS,
      max: MAX_ROWS,
      below: 'clamp',
    }),
    newest: EVENT_LIST_NEWEST.includes(newest) ? newest : defaults.newest,
    fade: readWhole(params.get('fade'), defaults.fade, { max: MAX_FADE_SECONDS }),
    minBits: readWhole(params.get('minbits'), defaults.minBits, { min: 1, max: MAX_MIN_BITS }),
    minRaid: readWhole(params.get('minraid'), defaults.minRaid, { min: 1, max: MAX_MIN_RAID }),
    title: (params.get('title') ?? '').trim().slice(0, TITLE_MAX_LENGTH),
  };
}

/** Reverse of buildEventListUrl; null for anything that isn't an Event List URL. */
export function parseEventListUrl(text: string): {
  settings: EventListSettings;
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
    settings: { platforms, ...readEventListSettings(params) },
  };
}
