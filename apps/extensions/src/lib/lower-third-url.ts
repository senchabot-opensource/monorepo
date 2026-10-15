import { isClassic } from '#/features/presets/registry';
import { CLASSIC_PRESET, readFont, readFx, readPreset, writePreset } from './preset-url';
import type { SiteFont } from './site-fonts';
import {
  type ChannelPlatforms,
  readWhole,
  readWidgetUrl,
  setChannels,
  setPreview,
} from './url-params';

export const LOWER_THIRD_COLORS = ['purple', 'green', 'red', 'gold', 'cyan', 'pink'] as const;
export type LowerThirdColor = (typeof LOWER_THIRD_COLORS)[number];

export const CORNERS = ['bl', 'br', 'tl', 'tr'] as const;
export type Corner = (typeof CORNERS)[number];

export interface LowerThirdSettings {
  /** Only for the mods' !lt commands; the bar runs without a channel. */
  platforms: ChannelPlatforms;
  /** Preset id; any preset but classic brings its own colors and fonts. */
  preset: string;
  /** Off (`fx=0`) stills the preset's effect; missing means on. */
  fx?: boolean;
  /** A site font to draw the preset in instead of its own; missing keeps the preset's. */
  font?: SiteFont;
  color: LowerThirdColor;
  corner: Corner;
  /** The big line: a name, a show title. */
  title: string;
  /** The small lines under it, taking turns. */
  lines: string[];
  /** Seconds each line stays before the next one. */
  rotate: number;
  /** Seconds the bar stays on screen each time; 0 keeps it up. */
  hold: number;
  /** Seconds it stays away between two appearances, when it doesn't stay up. */
  pause: number;
  /** Percent of its design size. */
  size: number;
}

export const TITLE_MAX_LENGTH = 40;
export const LINE_MAX_LENGTH = 80;
export const MAX_LINES = 6;
export const MIN_ROTATE = 3;
export const MAX_ROTATE = 120;
export const MAX_HOLD = 600;
export const MIN_PAUSE = 5;
export const MAX_PAUSE = 3600;
export const MIN_SIZE = 50;
export const MAX_SIZE = 200;

export const DEFAULT_LOWER_THIRD_SETTINGS: LowerThirdSettings = {
  platforms: 'both',
  preset: CLASSIC_PRESET,
  color: 'purple',
  corner: 'bl',
  title: '',
  lines: [],
  rotate: 10,
  hold: 0,
  pause: 60,
  size: 100,
};

/** Design size: a whole 1080p scene, the bar in a corner of it. */
export const LOWER_THIRD_STAGE = { width: 1920, height: 1080 };

const WIDGET_PATH = '/widgets/lower-third';

// A line can't hold the "|" that joins them in the URL.
const cleanLine = (line: string) => line.replace(/\|/g, '/').trim().slice(0, LINE_MAX_LENGTH);

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(settings: LowerThirdSettings, twitchChannel: string, kickChannel: string) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_LOWER_THIRD_SETTINGS;
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  writePreset(params, settings.preset, settings.fx, settings.font);
  if (isClassic(settings.preset) && settings.color !== defaults.color)
    params.set('color', settings.color);
  if (settings.corner !== defaults.corner) params.set('corner', settings.corner);
  const title = settings.title.trim().slice(0, TITLE_MAX_LENGTH);
  if (title) params.set('title', title);
  const lines = settings.lines.map(cleanLine).filter(Boolean).slice(0, MAX_LINES);
  if (lines.length > 0) params.set('lines', lines.join('|'));
  if (settings.rotate !== defaults.rotate) params.set('rotate', String(settings.rotate));
  if (settings.hold !== defaults.hold) params.set('hold', String(settings.hold));
  if (settings.pause !== defaults.pause) params.set('pause', String(settings.pause));
  if (settings.size !== defaults.size) params.set('size', String(settings.size));
  return params;
}

/** True when there's something to show: a title or a line. */
export const hasText = (settings: Pick<LowerThirdSettings, 'title' | 'lines'>) =>
  Boolean(settings.title.trim() || settings.lines.some((line) => line.trim()));

/**
 * The URL for OBS. It needs no channel, only something to show; a channel adds the mods'
 * commands.
 */
export function buildLowerThirdUrl(
  origin: string,
  settings: LowerThirdSettings,
  twitchChannel: string,
  kickChannel: string,
): string {
  if (!hasText(settings)) return '';
  return `${origin}${WIDGET_PATH}?${buildParams(settings, twitchChannel, kickChannel).toString()}`;
}

/** The bar with the same settings, paired with its setup page, never touching a channel. */
export function buildLowerThirdPreviewUrl(
  origin: string,
  settings: LowerThirdSettings,
  previewId: string,
): string {
  const params = buildParams(settings, '', '');
  setPreview(params, settings.platforms, previewId);
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readLowerThirdSettings(
  params: URLSearchParams,
): Omit<LowerThirdSettings, 'platforms'> {
  const defaults = DEFAULT_LOWER_THIRD_SETTINGS;
  const color = params.get('color') as LowerThirdColor;
  const corner = params.get('corner') as Corner;
  return {
    preset: readPreset(params),
    ...readFx(params),
    ...readFont(params),
    color: LOWER_THIRD_COLORS.includes(color) ? color : defaults.color,
    corner: CORNERS.includes(corner) ? corner : defaults.corner,
    title: (params.get('title') ?? '').trim().slice(0, TITLE_MAX_LENGTH),
    lines: (params.get('lines') ?? '')
      .split('|')
      .map(cleanLine)
      .filter(Boolean)
      .slice(0, MAX_LINES),
    rotate: readWhole(params.get('rotate'), defaults.rotate, {
      min: MIN_ROTATE,
      max: MAX_ROTATE,
      below: 'clamp',
    }),
    hold: readWhole(params.get('hold'), defaults.hold, { max: MAX_HOLD }),
    pause: readWhole(params.get('pause'), defaults.pause, {
      min: MIN_PAUSE,
      max: MAX_PAUSE,
      below: 'clamp',
    }),
    size: readWhole(params.get('size'), defaults.size, {
      min: MIN_SIZE,
      max: MAX_SIZE,
      below: 'clamp',
    }),
  };
}

/** Reverse of buildLowerThirdUrl; null for anything that isn't a Lower Thirds URL. */
export function parseLowerThirdUrl(
  text: string,
): { settings: LowerThirdSettings; twitchChannel: string; kickChannel: string } | null {
  const pasted = readWidgetUrl(text, WIDGET_PATH);
  if (!pasted) return null;
  const { params, platforms, ...channels } = pasted;
  return { ...channels, settings: { platforms, ...readLowerThirdSettings(params) } };
}
