import { isClassic } from '#/features/presets/registry';
import { isValidLocale, LANG_PARAM, type Locale } from '#/lib/i18n/locales';
import { CLASSIC_PRESET, readFont, readFx, readPreset, writePreset } from './preset-url';
import type { SiteFont } from './site-fonts';
import {
  type ChannelPlatforms,
  channelWidgetUrl,
  readWhole,
  readWidgetUrl,
  setChannels,
  setPreview,
} from './url-params';

/**
 * What the board shows: the top gifters, the top Bits and Kicks givers, or the latest sub, gift,
 * cheer and raid.
 */
export const BOARDS = ['gifts', 'cheers', 'latest'] as const;
export type Board = (typeof BOARDS)[number];

export const LEADERBOARD_COLORS = ['gold', 'purple', 'green', 'red', 'cyan', 'pink'] as const;
export type LeaderboardColor = (typeof LEADERBOARD_COLORS)[number];

export interface LeaderboardSettings {
  platforms: ChannelPlatforms;
  /** Preset id; any preset but classic brings its own colors and fonts. */
  preset: string;
  /** Off (`fx=0`) stills the preset's effect; missing means on. */
  fx?: boolean;
  /** A site font to draw the preset in instead of its own; missing keeps the preset's. */
  font?: SiteFont;
  color: LeaderboardColor;
  board: Board;
  /** Places shown on a top board. */
  rows: number;
  /** Above the board; empty shows none. */
  title: string;
}

export const MIN_ROWS = 3;
export const MAX_ROWS = 10;
export const TITLE_MAX_LENGTH = 32;

export const DEFAULT_LEADERBOARD_SETTINGS: LeaderboardSettings = {
  platforms: 'both',
  preset: CLASSIC_PRESET,
  color: 'gold',
  board: 'gifts',
  rows: 5,
  title: 'Top Gifters',
};

/** Design size; the overlay scales to whatever browser source size it gets. */
export const LEADERBOARD_STAGE = { width: 440, height: 380 };

/**
 * The stage for a board: the default size holds six places, and each place past that makes it
 * 46px taller, so a top 10 isn't cut off at the bottom.
 */
export const leaderboardStage = ({ board, rows }: Pick<LeaderboardSettings, 'board' | 'rows'>) => ({
  width: LEADERBOARD_STAGE.width,
  height:
    board === 'latest'
      ? LEADERBOARD_STAGE.height
      : Math.max(LEADERBOARD_STAGE.height, 96 + 46 * rows),
});

const WIDGET_PATH = '/widgets/leaderboard';

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(
  settings: LeaderboardSettings,
  twitchChannel: string,
  kickChannel: string,
  locale: Locale,
) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_LEADERBOARD_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  writePreset(params, settings.preset, settings.fx, settings.font);
  if (isClassic(settings.preset) && settings.color !== defaults.color)
    params.set('color', settings.color);
  if (settings.board !== defaults.board) params.set('board', settings.board);
  if (settings.rows !== defaults.rows) params.set('rows', String(settings.rows));
  // Always written, even empty: the default is in the page's language.
  params.set('title', settings.title.trim().slice(0, TITLE_MAX_LENGTH));
  // Always written: the labels are words, and OBS shouldn't pick their language.
  params.set(LANG_PARAM, locale);
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildLeaderboardUrl(
  origin: string,
  settings: LeaderboardSettings,
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

/** Plays simulated support with the same settings and never touches a channel or saved board. */
export function buildLeaderboardPreviewUrl(
  origin: string,
  settings: LeaderboardSettings,
  locale: Locale,
  previewId: string,
): string {
  const params = buildParams(settings, '', '', locale);
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readLeaderboardSettings(
  params: URLSearchParams,
): Omit<LeaderboardSettings, 'platforms'> {
  const defaults = DEFAULT_LEADERBOARD_SETTINGS;
  const color = params.get('color') as LeaderboardColor;
  const board = params.get('board') as Board;
  const title = params.get('title');
  return {
    preset: readPreset(params),
    ...readFx(params),
    ...readFont(params),
    color: LEADERBOARD_COLORS.includes(color) ? color : defaults.color,
    board: BOARDS.includes(board) ? board : defaults.board,
    rows: readWhole(params.get('rows'), defaults.rows, {
      min: MIN_ROWS,
      max: MAX_ROWS,
      below: 'clamp',
    }),
    title: title === null ? defaults.title : title.trim().slice(0, TITLE_MAX_LENGTH),
  };
}

/** Reverse of buildLeaderboardUrl; null for anything that isn't a Top Supporters URL. */
export function parseLeaderboardUrl(text: string): {
  settings: LeaderboardSettings;
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
    settings: { platforms, ...readLeaderboardSettings(params) },
  };
}
