import { isClassic } from '#/features/presets/registry';
import {
  assignColors,
  MAX_LABEL_LENGTH,
  MAX_SLICES,
  parseOptions,
} from '#/features/widgets/spin-wheel/spin-logic';
import { isValidLocale, LANG_PARAM, type Locale } from '#/lib/i18n/locales';
import { CLASSIC_PRESET, readFont, readFx, readPreset, writePreset } from '#/lib/preset-url';
import type { SiteFont } from '#/lib/site-fonts';
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
  /**
   * Slices take turns between the look's first two colors instead of all of them. On by default
   * with a preset, off in the classic look; see twoColorsByDefault.
   */
  twoColors: boolean;
  /** Preset id; any preset but classic draws the wheel and winner card in its look. */
  preset: string;
  /** Off (`fx=0`) stills the preset's effect; missing means on. */
  fx?: boolean;
  /** A site font to draw the preset in instead of its own; missing keeps the preset's. */
  font?: SiteFont;
}

export const DEFAULT_SPIN_WHEEL_SETTINGS: SpinWheelSettings = {
  platforms: 'both',
  cooldownSec: 30,
  permission: 'all',
  sound: true,
  options: [],
  twoColors: false,
  preset: CLASSIC_PRESET,
};

/** A preset's wheel takes turns between two of its colors unless told otherwise. */
export const twoColorsByDefault = (preset: string) => !isClassic(preset);

/** What the setup page starts with, and what the demo spins. */
export const SAMPLE_SPIN_OPTIONS = ['Zelda', 'Mario Kart', 'Tetris', 'Minecraft'];

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
  // Written only against the look's default: `2` in the classic look, `all` with a preset.
  if (settings.twoColors !== twoColorsByDefault(settings.preset)) {
    params.set('colors', settings.twoColors ? '2' : 'all');
  }
  if (settings.cooldownSec !== defaults.cooldownSec) params.set('cd', String(settings.cooldownSec));
  if (settings.permission !== defaults.permission) params.set('perm', settings.permission);
  if (settings.sound !== defaults.sound) params.set('sound', '0');
  writePreset(params, settings.preset, settings.fx, settings.font);
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

/** `colors=2` and `colors=all` pick; anything else is the look's default. */
function readTwoColors(value: string | null, preset: string): boolean {
  if (value === '2') return true;
  if (value === 'all') return false;
  return twoColorsByDefault(preset);
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readSpinWheelSettings(
  params: URLSearchParams,
): Omit<SpinWheelSettings, 'platforms'> {
  const defaults = DEFAULT_SPIN_WHEEL_SETTINGS;
  const permission = params.get('perm') as SpinPermission;
  const preset = readPreset(params);
  return {
    // The setup page shows an empty box; the overlay spins its sample list instead.
    options: cleanSpinOptions((params.get('o') ?? '').split(OPTION_SEPARATOR)),
    twoColors: readTwoColors(params.get('colors'), preset),
    cooldownSec: readWhole(params.get('cd'), defaults.cooldownSec, {
      max: MAX_COOLDOWN_SECONDS,
    }),
    permission: SPIN_PERMISSIONS.includes(permission) ? permission : defaults.permission,
    sound: readFlag(params.get('sound'), defaults.sound),
    preset,
    ...readFx(params),
    ...readFont(params),
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
