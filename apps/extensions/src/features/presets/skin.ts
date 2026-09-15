import type { Fill, FrameKind, Motion, PresetData } from './preset-schema';
import { findPreset } from './registry';

/** A color as hue and saturation; overlays pick the lightness, like they do with their hues. */
export interface Tone {
  h: number;
  s: number;
}

/** A preset, ready for an overlay to paint with. Overlays get null for the classic look. */
export interface Skin {
  id: string;
  /** CSS font stacks. */
  display: string;
  body: string;
  /** Google Fonts stylesheet for both fonts. */
  fontHref: string;
  accent: Tone;
  win: Tone;
  text: string;
  muted: string;
  /** Panel background, top and bottom, with the preset's opacity. */
  panel: string;
  panel2: string;
  frame: string;
  frame2: string;
  track: string;
  frameKind: FrameKind;
  radius: number;
  skew: number;
  title: PresetData['title'];
  fill: Fill;
  motion: Motion;
  sound: PresetData['sound'];
  shadow: PresetData['shadow'];
  /** Text shadow for text drawn straight on the game. */
  textShadow: string;
  /** The preset's colors as written, for overlays that mix in their own opacity. */
  colors: PresetData['colors'];
}

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function toTone(hex: string): Tone {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0 };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: Math.round(((h * 60 + 360) % 360) * 10) / 10, s: Math.round(s * 1000) / 10 };
}

export const rgba = (hex: string, alpha: number) => `rgba(${hexToRgb(hex).join(',')},${alpha})`;

/** A tone at a lightness, the same way the overlays write their own hsl() colors. */
export const shade = (tone: Tone, l: number, a = 1) => `hsl(${tone.h} ${tone.s}% ${l}% / ${a})`;

const fontStack = ({ family, fallback }: PresetData['fonts']['display']) =>
  `'${family}', ${fallback}`;

export function fontHref({ display, body }: PresetData['fonts']): string {
  const fonts = display.family === body.family ? [display] : [display, body];
  const families = fonts.map(
    (font) => `family=${font.family.replaceAll(' ', '+')}:wght@${font.weights}`,
  );
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

export function toSkin(data: PresetData): Skin {
  const { colors } = data;
  return {
    id: data.id,
    display: fontStack(data.fonts.display),
    body: fontStack(data.fonts.body),
    fontHref: fontHref(data.fonts),
    accent: toTone(colors.accent),
    win: toTone(colors.win),
    text: colors.text,
    muted: colors.muted,
    panel: rgba(colors.panel, data.panelOpacity),
    panel2: rgba(colors.panel2, data.panelOpacity),
    frame: colors.frame,
    frame2: colors.frame2,
    track: colors.track,
    frameKind: data.frame,
    radius: data.radius,
    skew: data.skew,
    title: data.title,
    fill: data.fill,
    motion: data.motion,
    sound: data.sound,
    shadow: data.shadow,
    colors,
    textShadow:
      data.shadow === 'hard'
        ? '2px 2px 0 rgba(0,0,0,.75)'
        : '0 2px 0 rgba(0,0,0,.55),0 0 18px rgba(0,0,0,.55)',
  };
}

const SKINS = new Map<string, Skin>();

/** The skin for a preset id; null for classic or an unknown id. */
export function skinFor(id: string | null | undefined): Skin | null {
  const entry = findPreset(id);
  if (!entry) return null;
  let skin = SKINS.get(entry.data.id);
  if (!skin) {
    skin = toSkin(entry.data);
    SKINS.set(entry.data.id, skin);
  }
  return skin;
}

type Paint = (s: number, l: number, a?: number) => string;

/**
 * The overlays' `hsl(hue, s, l, a)`, bound to one hue. With a preset, the preset's tone replaces
 * the hue and its saturation replaces `s`, so every shade an overlay draws follows the preset.
 */
export function painter(skin: Skin | null, hue: number, role: 'accent' | 'win' = 'accent'): Paint {
  if (!skin) return (s, l, a = 1) => `hsl(${hue} ${s}% ${l}% / ${a})`;
  const tone = skin[role];
  return (_s, l, a = 1) => shade(tone, l, a);
}

/**
 * Rules that restyle an overlay's `<prefix>-root`, `-shadow` and `-title` classes for a preset.
 * Empty for classic. `font-synthesis` is off so a one-weight font isn't smeared into fake bold.
 */
export function skinCss(prefix: string, skin: Skin | null): string {
  if (!skin) return '';
  const title = titleStyle(skin);
  return `.${prefix}-root{font-family:${skin.display};color:${skin.text};font-synthesis:none}
.${prefix}-shadow{text-shadow:${skin.textShadow}}
.${prefix}-title{text-transform:${title.textTransform};letter-spacing:${title.letterSpacing};font-style:${title.fontStyle}}`;
}

/** Title text: the preset's case, tracking and slant, or the overlay's own. */
export function titleStyle(skin: Skin) {
  return {
    textTransform: skin.title.upper ? 'uppercase' : 'none',
    letterSpacing: `${skin.title.tracking}em`,
    fontStyle: skin.title.italic ? 'italic' : 'normal',
  } as const;
}
