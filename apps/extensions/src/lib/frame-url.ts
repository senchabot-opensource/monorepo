import { isClassic } from '#/features/presets/registry';
import { CLASSIC_PRESET, readPreset, writePreset } from './preset-url';
import { readFlag } from './url-params';
import type { SourceSize } from './widgets';

/** What a frame goes around: a webcam, a chat, or the whole stream. */
export const FRAME_PIECES = ['camera', 'chat', 'screen'] as const;
export type FramePiece = (typeof FRAME_PIECES)[number];

export const FRAME_COLORS = ['purple', 'green', 'red', 'gold', 'cyan', 'pink'] as const;
export type FrameColor = (typeof FRAME_COLORS)[number];

export interface FrameSettings {
  /** Preset id; any preset but classic brings its own frame art, colors and fonts. */
  preset: string;
  piece: FramePiece;
  /** Classic frames' accent. */
  color: FrameColor;
  /** Text on the frame's tab, e.g. the channel name; empty leaves the tab bare. */
  label: string;
  /** Glows, sweeps and other small animations. */
  motion: boolean;
}

export const DEFAULT_FRAME_SETTINGS: FrameSettings = {
  preset: CLASSIC_PRESET,
  piece: 'camera',
  color: 'purple',
  label: '',
  motion: true,
};

export const LABEL_MAX_LENGTH = 32;

/**
 * Browser source size per piece. The frame fills whatever size OBS gives it, so these only set
 * the shape: a 16:9 webcam, a tall chat column, a full canvas.
 */
export const FRAME_SIZES: Record<FramePiece, SourceSize> = {
  camera: { width: 640, height: 360 },
  chat: { width: 420, height: 720 },
  screen: { width: 1920, height: 1080 },
};

const WIDGET_PATH = '/widgets/frame';

/** Only settings that differ from the defaults are written, so URLs stay short. */
function buildParams(settings: FrameSettings) {
  const params = new URLSearchParams();
  const defaults = DEFAULT_FRAME_SETTINGS;
  // Always written, so a pasted URL says what it frames.
  params.set('piece', settings.piece);
  writePreset(params, settings.preset);
  if (isClassic(settings.preset) && settings.color !== defaults.color)
    params.set('color', settings.color);
  const label = settings.label.trim();
  if (label) params.set('label', label);
  if (!settings.motion) params.set('motion', '0');
  return params;
}

/** The URL for OBS. A frame reads no chat, so it needs no channel. */
export function buildFrameUrl(origin: string, settings: FrameSettings): string {
  return `${origin}${WIDGET_PATH}?${buildParams(settings).toString()}`;
}

/** The same frame with a stand-in webcam or chat inside, for the setup page. */
export function buildFramePreviewUrl(origin: string, settings: FrameSettings): string {
  const params = buildParams(settings);
  params.set('demo', '1');
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

/** Settings from URL params, each falling back to its default when missing or invalid. */
export function readFrameSettings(params: URLSearchParams): FrameSettings {
  const defaults = DEFAULT_FRAME_SETTINGS;
  const piece = params.get('piece') as FramePiece;
  const color = params.get('color') as FrameColor;
  return {
    preset: readPreset(params),
    piece: FRAME_PIECES.includes(piece) ? piece : defaults.piece,
    color: FRAME_COLORS.includes(color) ? color : defaults.color,
    label: (params.get('label') ?? '').trim().slice(0, LABEL_MAX_LENGTH),
    motion: readFlag(params.get('motion'), defaults.motion),
  };
}

/** Reverse of buildFrameUrl; null for anything that isn't a Frames URL. */
export function parseFrameUrl(text: string): FrameSettings | null {
  let url: URL;
  try {
    url = new URL(text.trim());
  } catch {
    return null;
  }
  if (!url.pathname.replace(/\/+$/, '').endsWith(WIDGET_PATH)) return null;
  return readFrameSettings(url.searchParams);
}
