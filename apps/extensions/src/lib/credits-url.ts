import { isClassic } from '#/features/presets/registry';
import { isValidLocale, LANG_PARAM, type Locale } from '#/lib/i18n/locales';
import { CLASSIC_PRESET, readPreset, writePreset } from './preset-url';
import {
  type ChannelPlatforms,
  channelWidgetUrl,
  readFlag,
  readWidgetUrl,
  setChannels,
  setPreview,
} from './url-params';

/** The roll's sections, in the order they roll. */
export const CREDIT_SECTIONS = ['subs', 'gifts', 'cheers', 'raids', 'mods', 'chatters'] as const;
export type CreditSection = (typeof CREDIT_SECTIONS)[number];

export const CREDITS_COLORS = ['gold', 'purple', 'green', 'red', 'cyan', 'pink'] as const;
export type CreditsColor = (typeof CREDITS_COLORS)[number];

export const CREDITS_SPEEDS = ['slow', 'normal', 'fast'] as const;
export type CreditsSpeed = (typeof CREDITS_SPEEDS)[number];
/** How fast each speed rolls, in px per second of the 1080p stage. */
export const SPEED_PX: Record<CreditsSpeed, number> = { slow: 55, normal: 90, fast: 150 };

export interface CreditsSettings {
  platforms: ChannelPlatforms;
  /** Preset id; any preset but classic brings its own colors and fonts. */
  preset: string;
  color: CreditsColor;
  /** First line of the roll. */
  title: string;
  /** Last line of the roll; empty shows none. */
  outro: string;
  sections: Record<CreditSection, boolean>;
  speed: CreditsSpeed;
  /** Rolls again after a pause; off, the roll ends with the last line. */
  loop: boolean;
}

export const TITLE_MAX_LENGTH = 60;

export const DEFAULT_CREDITS_SETTINGS: CreditsSettings = {
  platforms: 'both',
  preset: CLASSIC_PRESET,
  color: 'gold',
  title: 'Thanks for watching!',
  outro: '',
  sections: { subs: true, gifts: true, cheers: true, raids: true, mods: true, chatters: true },
  speed: 'normal',
  loop: true,
};

/** Design size: a whole 1080p scene, the roll in its middle. */
export const CREDITS_STAGE = { width: 1920, height: 1080 };

const WIDGET_PATH = '/widgets/credits';

const cut = (text: string) => text.trim().slice(0, TITLE_MAX_LENGTH);

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(
  settings: CreditsSettings,
  twitchChannel: string,
  kickChannel: string,
  locale: Locale,
) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_CREDITS_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  writePreset(params, settings.preset);
  if (isClassic(settings.preset) && settings.color !== defaults.color)
    params.set('color', settings.color);
  // Always written: the default is in the page's language.
  params.set('title', cut(settings.title));
  const outro = cut(settings.outro);
  if (outro) params.set('outro', outro);
  for (const section of CREDIT_SECTIONS) if (!settings.sections[section]) params.set(section, '0');
  if (settings.speed !== defaults.speed) params.set('speed', settings.speed);
  if (settings.loop !== defaults.loop) params.set('loop', settings.loop ? '1' : '0');
  // Always written: the section headings are words, and OBS shouldn't pick their language.
  params.set(LANG_PARAM, locale);
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildCreditsUrl(
  origin: string,
  settings: CreditsSettings,
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

/** Rolls sample credits with the same settings and never touches a channel or saved credits. */
export function buildCreditsPreviewUrl(
  origin: string,
  settings: CreditsSettings,
  locale: Locale,
  previewId: string,
): string {
  const params = buildParams(settings, '', '', locale);
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readCreditsSettings(params: URLSearchParams): Omit<CreditsSettings, 'platforms'> {
  const defaults = DEFAULT_CREDITS_SETTINGS;
  const color = params.get('color') as CreditsColor;
  const speed = params.get('speed') as CreditsSpeed;
  const title = params.get('title');
  return {
    preset: readPreset(params),
    color: CREDITS_COLORS.includes(color) ? color : defaults.color,
    title: title === null ? defaults.title : cut(title),
    outro: cut(params.get('outro') ?? ''),
    sections: Object.fromEntries(
      CREDIT_SECTIONS.map((section) => [section, readFlag(params.get(section), true)]),
    ) as Record<CreditSection, boolean>,
    speed: CREDITS_SPEEDS.includes(speed) ? speed : defaults.speed,
    loop: readFlag(params.get('loop'), defaults.loop),
  };
}

/** Reverse of buildCreditsUrl; null for anything that isn't an End Credits URL. */
export function parseCreditsUrl(text: string): {
  settings: CreditsSettings;
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
    settings: { platforms, ...readCreditsSettings(params) },
  };
}
