import { isValidLocale, LANG_PARAM, type Locale } from '#/lib/i18n/locales';
import {
  type ChannelPlatforms,
  channelWidgetUrl,
  readFlag,
  readWhole,
  readWidgetUrl,
  setChannels,
  setPreview,
} from '#/lib/url-params';

export const ALERT_THEMES = ['neon', 'celestial'] as const;
export type AlertTheme = (typeof ALERT_THEMES)[number];

/** `platform` paints each alert in its platform's color; the rest are fixed accents. */
export const ALERT_COLORS = ['platform', 'blue', 'purple', 'pink', 'red', 'gold', 'green'] as const;
export type AlertColor = (typeof ALERT_COLORS)[number];

/** Alerts both platforms deliver without a login. Follows and donations have no such source. */
export const ALERT_KINDS = ['sub', 'gift', 'bits', 'raid'] as const;
export type AlertKind = (typeof ALERT_KINDS)[number];

export interface StreamAlertsSettings {
  platforms: ChannelPlatforms;
  theme: AlertTheme;
  color: AlertColor;
  /** Which alerts show. */
  enabled: Record<AlertKind, boolean>;
  /** Custom heading per alert; empty uses the language's default. */
  headings: Record<AlertKind, string>;
  /** Smallest gift that shows, in subs. */
  minGift: number;
  /** Smallest cheer that shows, in Bits or Kicks. */
  minBits: number;
  /** Smallest raid that shows, in viewers. 0 lets through raids without a count, like Kick hosts. */
  minRaid: number;
  /** Seconds each alert stays on screen. */
  duration: number;
  /** Sound volume, 0 to 100; 0 is silent. */
  volume: number;
  /** Show what the viewer wrote with their Bits or Kicks. */
  message: boolean;
}

/** What the overlay reads from its URL: everything but which channels the setup page shows. */
export type AlertSettings = Omit<StreamAlertsSettings, 'platforms'>;

export const DEFAULT_STREAM_ALERTS_SETTINGS: StreamAlertsSettings = {
  platforms: 'both',
  theme: 'neon',
  color: 'platform',
  enabled: { sub: true, gift: true, bits: true, raid: true },
  headings: { sub: '', gift: '', bits: '', raid: '' },
  minGift: 1,
  minBits: 1,
  minRaid: 0,
  duration: 7,
  volume: 50,
  message: true,
};

export const HEADING_MAX_LENGTH = 24;
export const MIN_DURATION = 3;
export const MAX_DURATION = 20;
export const MAX_MIN_AMOUNT = 100_000;

const WIDGET_PATH = '/widgets/stream-alerts';

type NumberKey = 'minGift' | 'minBits' | 'minRaid' | 'duration' | 'volume';
const NUMBER_PARAMS: Record<NumberKey, string> = {
  minGift: 'mingift',
  minBits: 'minbits',
  minRaid: 'minraid',
  duration: 'dur',
  volume: 'vol',
};
const NUMBER_RANGES: Record<NumberKey, [number, number]> = {
  minGift: [1, MAX_MIN_AMOUNT],
  minBits: [1, MAX_MIN_AMOUNT],
  minRaid: [0, MAX_MIN_AMOUNT],
  duration: [MIN_DURATION, MAX_DURATION],
  volume: [0, 100],
};
const NUMBER_KEYS = Object.keys(NUMBER_PARAMS) as NumberKey[];
/** URL name of each alert's custom heading, e.g. hsub. */
const headingParam = (kind: AlertKind) => `h${kind}`;

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(
  settings: StreamAlertsSettings,
  twitchChannel: string,
  kickChannel: string,
  locale: Locale,
) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_STREAM_ALERTS_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  if (settings.theme !== defaults.theme) params.set('theme', settings.theme);
  if (settings.color !== defaults.color) params.set('color', settings.color);
  for (const kind of ALERT_KINDS) {
    if (!settings.enabled[kind]) params.set(kind, '0');
    const heading = settings.headings[kind].trim();
    if (heading) params.set(headingParam(kind), heading);
  }
  for (const key of NUMBER_KEYS) {
    if (settings[key] !== defaults[key]) params.set(NUMBER_PARAMS[key], String(settings[key]));
  }
  if (settings.message !== defaults.message) params.set('msg', settings.message ? '1' : '0');
  // Always written: the alerts are mostly words, and OBS shouldn't pick their language.
  params.set(LANG_PARAM, locale);
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildStreamAlertsUrl(
  origin: string,
  settings: StreamAlertsSettings,
  twitchChannel: string,
  kickChannel: string,
  locale: Locale,
): string {
  return channelWidgetUrl(origin, WIDGET_PATH, buildParams(settings, twitchChannel, kickChannel, locale));
}

/** Plays simulated alerts with the same settings and never connects to a channel. */
export function buildStreamAlertsPreviewUrl(
  origin: string,
  settings: StreamAlertsSettings,
  locale: Locale,
  previewId: string,
): string {
  const params = buildParams(settings, '', '', locale);
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

// Unlike the other widgets, a number out of range is clamped, not dropped.
function readNumber(value: string | null, key: NumberKey): number {
  const [min, max] = NUMBER_RANGES[key];
  return readWhole(value, DEFAULT_STREAM_ALERTS_SETTINGS[key], { min, max, below: 'clamp' });
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readStreamAlertsSettings(params: URLSearchParams): AlertSettings {
  const defaults = DEFAULT_STREAM_ALERTS_SETTINGS;
  const theme = params.get('theme') as AlertTheme;
  const color = params.get('color') as AlertColor;
  const perKind = <T>(read: (kind: AlertKind) => T) =>
    Object.fromEntries(ALERT_KINDS.map((kind) => [kind, read(kind)])) as Record<AlertKind, T>;
  return {
    theme: ALERT_THEMES.includes(theme) ? theme : defaults.theme,
    color: ALERT_COLORS.includes(color) ? color : defaults.color,
    enabled: perKind((kind) => readFlag(params.get(kind), true)),
    headings: perKind((kind) =>
      (params.get(headingParam(kind)) ?? '').trim().slice(0, HEADING_MAX_LENGTH),
    ),
    ...(Object.fromEntries(
      NUMBER_KEYS.map((key) => [key, readNumber(params.get(NUMBER_PARAMS[key]), key)]),
    ) as Record<NumberKey, number>),
    message: readFlag(params.get('msg'), defaults.message),
  };
}

/** Reverse of buildStreamAlertsUrl; null for anything that isn't a Stream Alerts URL. */
export function parseStreamAlertsUrl(text: string): {
  settings: StreamAlertsSettings;
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
    settings: { platforms, ...readStreamAlertsSettings(params) },
  };
}
