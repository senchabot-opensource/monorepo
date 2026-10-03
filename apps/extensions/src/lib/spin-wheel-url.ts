import {
  assignColors,
  MAX_LABEL_LENGTH,
  MAX_SLICES,
  parseOptions,
} from '#/features/widgets/spin-wheel/spin-logic';
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

export const SPIN_COMMAND = '!spin';

export const SPIN_PERMISSIONS = ['all', 'subs', 'mods'] as const;
export type SpinPermission = (typeof SPIN_PERMISSIONS)[number];

export interface SpinWheelSettings {
  platforms: ChannelPlatforms;
  /** Seconds chat must wait between spins; 0 turns the cooldown off. */
  cooldownSec: number;
  /** Who may spin from chat. */
  permission: SpinPermission;
  /** Tick and victory sounds on the overlay. */
  sound: boolean;
  /** Wheel options; blanks are dropped when the URL is written. */
  options: string[];
}

export const DEFAULT_SPIN_WHEEL_SETTINGS: SpinWheelSettings = {
  platforms: 'both',
  cooldownSec: 30,
  permission: 'all',
  sound: true,
  options: [],
};

export const MAX_COOLDOWN_SECONDS = 300;
export { MAX_LABEL_LENGTH, MAX_SLICES };

const WIDGET_PATH = '/widgets/spin-wheel';
const OPTION_SEPARATOR = '|';

/** Non-empty trimmed options, capped like the editor; `|` can't survive the URL join below. */
export function cleanSpinOptions(options: readonly string[]): string[] {
  return parseOptions(options.map((option) => option.replaceAll('|', '')).join('\n'));
}

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(
  settings: SpinWheelSettings,
  twitchChannel: string,
  kickChannel: string,
  locale: Locale,
) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_SPIN_WHEEL_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  const options = cleanSpinOptions(settings.options);
  // One param, like Chat Poll: the router drops repeated params, and an option
  // can't hold a "|" since the URL joins on it. The shorthand (`2x Tetris`)
  // travels as written and expands back into slices on read; a lone weighted
  // line still counts when it makes two slices.
  if (assignColors(options).length >= 2) params.set('o', options.join(OPTION_SEPARATOR));
  if (settings.cooldownSec !== defaults.cooldownSec) params.set('cd', String(settings.cooldownSec));
  if (settings.permission !== defaults.permission) params.set('perm', settings.permission);
  if (settings.sound !== defaults.sound) params.set('sound', '0');
  // Always written: the overlay shows words, and OBS shouldn't pick their language.
  params.set(LANG_PARAM, locale);
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildSpinWheelUrl(
  origin: string,
  settings: SpinWheelSettings,
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

/** Plays simulated spins with the same options and never touches a channel. */
export function buildSpinWheelPreviewUrl(
  origin: string,
  settings: SpinWheelSettings,
  locale: Locale,
  previewId: string,
): string {
  const params = buildParams(settings, '', '', locale);
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readSpinWheelSettings(
  params: URLSearchParams,
): Omit<SpinWheelSettings, 'platforms'> {
  const defaults = DEFAULT_SPIN_WHEEL_SETTINGS;
  const permission = params.get('perm') as SpinPermission;
  return {
    // The setup page shows an empty box; the overlay spins its sample list instead.
    options: cleanSpinOptions((params.get('o') ?? '').split(OPTION_SEPARATOR)),
    cooldownSec: readWhole(params.get('cd'), defaults.cooldownSec, {
      max: MAX_COOLDOWN_SECONDS,
    }),
    permission: SPIN_PERMISSIONS.includes(permission) ? permission : defaults.permission,
    sound: readFlag(params.get('sound'), defaults.sound),
  };
}

/** Reverse of buildSpinWheelUrl; null for anything that isn't a Spin Wheel URL. */
export function parseSpinWheelUrl(text: string): {
  settings: SpinWheelSettings;
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
    settings: { platforms, ...readSpinWheelSettings(params) },
  };
}
