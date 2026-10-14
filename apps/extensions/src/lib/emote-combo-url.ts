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

export const EMOTE_COMBO_COLORS = ['gold', 'purple', 'green', 'red', 'cyan', 'pink'] as const;
export type EmoteComboColor = (typeof EMOTE_COMBO_COLORS)[number];

export interface EmoteComboSettings {
  platforms: ChannelPlatforms;
  /** Preset id; any preset but classic brings its own colors and fonts. */
  preset: string;
  color: EmoteComboColor;
  /** Seconds a combo waits for the next chatter before it ends. */
  window: number;
  /** Chatters it takes before the combo shows. */
  min: number;
  /** The combo's size on the stage, in percent. */
  size: number;
  /** The stream's best combo, small under the counter. */
  best: boolean;
  /** Third-party emotes that count, the Emote Wall's way: 7TV on both chats, BTTV and FFZ on Twitch. */
  sevenTv: boolean;
  bttv: boolean;
  ffz: boolean;
}

export const MIN_WINDOW = 3;
export const MAX_WINDOW = 30;
export const MIN_CHATTERS = 2;
export const MAX_CHATTERS = 20;
export const MIN_SIZE = 50;
export const MAX_SIZE = 150;

export const DEFAULT_EMOTE_COMBO_SETTINGS: EmoteComboSettings = {
  platforms: 'both',
  preset: CLASSIC_PRESET,
  color: 'gold',
  window: 8,
  min: 3,
  size: 100,
  best: true,
  sevenTv: true,
  bttv: false,
  ffz: false,
};

/** Design size; the overlay scales to whatever browser source size it gets. */
export const EMOTE_COMBO_STAGE = { width: 600, height: 400 };

const WIDGET_PATH = '/widgets/emote-combo';

const flag = (on: boolean) => (on ? '1' : '0');

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(
  settings: EmoteComboSettings,
  twitchChannel: string,
  kickChannel: string,
  locale: Locale,
) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_EMOTE_COMBO_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  writePreset(params, settings.preset);
  if (isClassic(settings.preset) && settings.color !== defaults.color)
    params.set('color', settings.color);
  if (settings.window !== defaults.window) params.set('window', String(settings.window));
  if (settings.min !== defaults.min) params.set('min', String(settings.min));
  if (settings.size !== defaults.size) params.set('size', String(settings.size));
  if (settings.best !== defaults.best) params.set('best', flag(settings.best));
  if (settings.sevenTv !== defaults.sevenTv) params.set('sevenTv', flag(settings.sevenTv));
  if (settings.bttv !== defaults.bttv) params.set('bttv', flag(settings.bttv));
  if (settings.ffz !== defaults.ffz) params.set('ffz', flag(settings.ffz));
  // Always written: "COMBO" and "Best" are words, and OBS shouldn't pick their language.
  params.set(LANG_PARAM, locale);
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildEmoteComboUrl(
  origin: string,
  settings: EmoteComboSettings,
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

/** Plays simulated combos with the same settings and never touches a channel or a saved best. */
export function buildEmoteComboPreviewUrl(
  origin: string,
  settings: EmoteComboSettings,
  locale: Locale,
  previewId: string,
): string {
  const params = buildParams(settings, '', '', locale);
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readEmoteComboSettings(
  params: URLSearchParams,
): Omit<EmoteComboSettings, 'platforms'> {
  const defaults = DEFAULT_EMOTE_COMBO_SETTINGS;
  const color = params.get('color') as EmoteComboColor;
  return {
    preset: readPreset(params),
    color: EMOTE_COMBO_COLORS.includes(color) ? color : defaults.color,
    window: readWhole(params.get('window'), defaults.window, {
      min: MIN_WINDOW,
      max: MAX_WINDOW,
      below: 'clamp',
    }),
    min: readWhole(params.get('min'), defaults.min, {
      min: MIN_CHATTERS,
      max: MAX_CHATTERS,
      below: 'clamp',
    }),
    size: readWhole(params.get('size'), defaults.size, {
      min: MIN_SIZE,
      max: MAX_SIZE,
      below: 'clamp',
    }),
    best: readFlag(params.get('best'), defaults.best),
    sevenTv: readFlag(params.get('sevenTv'), defaults.sevenTv),
    bttv: readFlag(params.get('bttv'), defaults.bttv),
    ffz: readFlag(params.get('ffz'), defaults.ffz),
  };
}

/** Reverse of buildEmoteComboUrl; null for anything that isn't an Emote Combo URL. */
export function parseEmoteComboUrl(text: string): {
  settings: EmoteComboSettings;
  twitchChannel: string;
  kickChannel: string;
  locale: Locale | null;
} | null {
  const pasted = readWidgetUrl(text, WIDGET_PATH);
  if (!pasted) return null;
  const { params, platforms, ...channels } = pasted;
  const lang = params.get(LANG_PARAM);
  return {
    twitchChannel: channels.twitchChannel,
    kickChannel: channels.kickChannel,
    locale: isValidLocale(lang) ? lang : null,
    // A YouTube channel in the URL means nothing here: this widget reads Twitch and Kick.
    settings: {
      platforms: platforms === 'youtube' ? 'both' : platforms,
      ...readEmoteComboSettings(params),
    },
  };
}
