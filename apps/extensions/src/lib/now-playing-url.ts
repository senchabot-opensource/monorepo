import { isClassic } from '#/features/presets/registry';
import { isValidLocale, LANG_PARAM, type Locale } from '#/lib/i18n/locales';
import { CLASSIC_PRESET, readPreset, writePreset } from './preset-url';
import { readFlag, readWhole } from './url-params';

/** Where the song comes from. Both are public profiles, read without an account. */
export const NOW_PLAYING_SOURCES = ['listenbrainz', 'lastfm'] as const;
export type NowPlayingSource = (typeof NOW_PLAYING_SOURCES)[number];

/** `card`: the cover beside the title, artist and album. `pill`: one line. */
export const NOW_PLAYING_LAYOUTS = ['card', 'pill'] as const;
export type NowPlayingLayout = (typeof NOW_PLAYING_LAYOUTS)[number];

export const NOW_PLAYING_COLORS = ['green', 'purple', 'red', 'gold', 'cyan', 'pink'] as const;
export type NowPlayingColor = (typeof NOW_PLAYING_COLORS)[number];

export interface NowPlayingSettings {
  source: NowPlayingSource;
  /** The profile on that service; empty until the streamer types one. */
  user: string;
  layout: NowPlayingLayout;
  /** The cover beside the song; off, the text starts at the edge. */
  art: boolean;
  /** The album under the artist, in the card. */
  album: boolean;
  /** Seconds the last song stays up once the music stops; 0 keeps it up, dimmed. */
  hide: number;
  /** Preset id; any preset but classic brings its own colors and fonts. */
  preset: string;
  color: NowPlayingColor;
}

export const USER_MAX_LENGTH = 64;
export const MAX_HIDE = 60;

export const DEFAULT_NOW_PLAYING_SETTINGS: NowPlayingSettings = {
  source: 'listenbrainz',
  user: '',
  layout: 'card',
  art: true,
  album: true,
  hide: 10,
  preset: CLASSIC_PRESET,
  color: 'green',
};

/** Design size; the overlay scales to whatever browser source size it gets. */
export const NOW_PLAYING_STAGE = { width: 640, height: 160 };

const WIDGET_PATH = '/widgets/now-playing';

// listenbrainz.org/user/name, last.fm/user/name and its local domains (lastfm.de, …).
const PROFILE_LINK = /(?:listenbrainz\.org|last\.fm|lastfm\.[a-z.]+)\/user\/([^/?#\s]+)/i;

/** The username in what was typed: a name, an @name, or a pasted profile link. */
export function cleanUsername(text: string): string {
  const typed = text.trim();
  const linked = PROFILE_LINK.exec(typed)?.[1];
  let name = typed;
  if (linked) {
    try {
      name = decodeURIComponent(linked);
    } catch {
      name = linked;
    }
  }
  return name.replace(/^@/, '').trim().slice(0, USER_MAX_LENGTH);
}

function readChoice<T extends string>(value: string | null, choices: readonly T[], fallback: T): T {
  return choices.includes(value as T) ? (value as T) : fallback;
}

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(settings: NowPlayingSettings, locale: Locale) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_NOW_PLAYING_SETTINGS;
  if (settings.source !== defaults.source) params.set('source', settings.source);
  const user = cleanUsername(settings.user);
  if (user) params.set('user', user);
  if (settings.layout !== defaults.layout) params.set('layout', settings.layout);
  if (settings.art !== defaults.art) params.set('art', settings.art ? '1' : '0');
  if (settings.album !== defaults.album) params.set('album', settings.album ? '1' : '0');
  if (settings.hide !== defaults.hide) params.set('hide', String(settings.hide));
  writePreset(params, settings.preset);
  if (isClassic(settings.preset) && settings.color !== defaults.color)
    params.set('color', settings.color);
  // Always written: the card's label is a word, and OBS shouldn't pick its language.
  params.set(LANG_PARAM, locale);
  return params;
}

/** The URL for OBS. Empty until a username is filled in; it reads no chat, so it needs no channel. */
export function buildNowPlayingUrl(
  origin: string,
  settings: NowPlayingSettings,
  locale: Locale,
): string {
  if (!cleanUsername(settings.user)) return '';
  return `${origin}${WIDGET_PATH}?${buildParams(settings, locale).toString()}`;
}

/**
 * The setup page's preview: sample songs, or with `live` and a username, what that profile is
 * playing now. `previewId` lets the page's test buttons reach it.
 */
export function buildNowPlayingPreviewUrl(
  origin: string,
  settings: NowPlayingSettings,
  locale: Locale,
  previewId: string,
  live = false,
): string {
  const params = buildParams(settings, locale);
  if (!live || !params.has('user')) params.set('demo', '1');
  params.set('preview', previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readNowPlayingSettings(params: URLSearchParams): NowPlayingSettings {
  const defaults = DEFAULT_NOW_PLAYING_SETTINGS;
  return {
    source: readChoice(params.get('source'), NOW_PLAYING_SOURCES, defaults.source),
    user: cleanUsername(params.get('user') ?? ''),
    layout: readChoice(params.get('layout'), NOW_PLAYING_LAYOUTS, defaults.layout),
    art: readFlag(params.get('art'), defaults.art),
    album: readFlag(params.get('album'), defaults.album),
    hide: readWhole(params.get('hide'), defaults.hide, { min: 0, max: MAX_HIDE }),
    preset: readPreset(params),
    color: readChoice(params.get('color'), NOW_PLAYING_COLORS, defaults.color),
  };
}

/** Reverse of buildNowPlayingUrl; null for anything that isn't a Now Playing URL. */
export function parseNowPlayingUrl(
  text: string,
): { settings: NowPlayingSettings; locale: Locale | null } | null {
  let url: URL;
  try {
    url = new URL(text.trim());
  } catch {
    return null;
  }
  if (!url.pathname.replace(/\/+$/, '').endsWith(WIDGET_PATH)) return null;
  const lang = url.searchParams.get(LANG_PARAM);
  return {
    settings: readNowPlayingSettings(url.searchParams),
    locale: isValidLocale(lang) ? lang : null,
  };
}
