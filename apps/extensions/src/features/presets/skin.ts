import { presetFontHref, SITE_FONT_STACKS, type SiteFont } from '#/lib/site-fonts';
import { rgba, shade, type Tone, toTone } from './color';
import { fxModule } from './fx/registry';
import type { Effect, Fill, FrameKind, Motion, PresetData } from './preset-schema';
import { findPreset } from './registry';

export type { Tone } from './color';
export { rgba, shade, toTone } from './color';

/** A preset, ready for an overlay to paint with. Overlays get null for the classic look. */
export interface Skin {
  id: string;
  /** CSS font stacks. */
  display: string;
  body: string;
  /** Google Fonts stylesheet for both fonts; empty when they are the viewer's system font. */
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
  /** The preset's signature animation; `none` when it has none or its effects are off. */
  effect: Effect;
  /** The preset's colors as written, for overlays that mix in their own opacity. */
  colors: PresetData['colors'];
}

const fontStack = ({ family, fallback }: PresetData['fonts']['display']) =>
  `'${family}', ${fallback}`;

export function fontHref({ display, body }: PresetData['fonts']): string {
  const fonts = display.family === body.family ? [display] : [display, body];
  const families = fonts.map(
    (font) => `family=${font.family.replaceAll(' ', '+')}:wght@${font.weights}`,
  );
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

/** `fx: false` stills the preset: same look, no effect. */
export function toSkin(data: PresetData, fx = true): Skin {
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
    effect: fx ? (data.effect ?? 'none') : 'none',
    colors,
    textShadow:
      data.shadow === 'hard'
        ? '2px 2px 0 rgba(0,0,0,.75)'
        : '0 2px 0 rgba(0,0,0,.55),0 0 18px rgba(0,0,0,.55)',
  };
}

const SKINS = new Map<string, Skin>();

/** The skin with one of the site's fonts in place of both of its own. */
const withFont = (skin: Skin, font: SiteFont): Skin => ({
  ...skin,
  display: SITE_FONT_STACKS[font],
  body: SITE_FONT_STACKS[font],
  fontHref: presetFontHref(font),
});

/**
 * The skin for a preset id; null for classic or an unknown id. `fx: false` (a URL's `fx=0`)
 * stills its effect, and a `font` (a URL's `font=`) draws it in that font instead of its own.
 * The same object comes back every time, so memoized parts don't redraw.
 */
export function skinFor(
  id: string | null | undefined,
  fx: boolean | undefined = true,
  font?: SiteFont,
): Skin | null {
  const entry = findPreset(id);
  if (!entry) return null;
  const still = !fx && (entry.data.effect ?? 'none') !== 'none';
  const key = `${entry.data.id}${still ? ':still' : ''}${font ? `:${font}` : ''}`;
  let skin = SKINS.get(key);
  if (!skin) {
    const own = toSkin(entry.data, !still);
    skin = font ? withFont(own, font) : own;
    SKINS.set(key, skin);
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
 * Rules that restyle an overlay's `<prefix>-root`, `-shadow` and `-title` classes for a preset,
 * and play its effect on the titles. Empty for classic. `font-synthesis` is off so a one-weight
 * font isn't smeared into fake bold.
 */
export function skinCss(prefix: string, skin: Skin | null): string {
  if (!skin) return '';
  const title = titleStyle(skin);
  return `.${prefix}-root{font-family:${skin.display};color:${skin.text};font-synthesis:none}
.${prefix}-shadow{text-shadow:${skin.textShadow}}
.${prefix}-title{text-transform:${title.textTransform};letter-spacing:${title.letterSpacing};font-style:${title.fontStyle}}${fxCss(prefix, skin)}`;
}

const FX_CSS = new Map<string, string>();

/**
 * The effect's colors on the overlay's root and its title rules. Made once per page and kept:
 * written again on every render, a title's loop would jump.
 */
function fxCss(prefix: string, skin: Skin): string {
  const module = fxModule(skin);
  if (!module) return '';
  const key = `${prefix} ${skin.id} ${skin.effect}`;
  let css = FX_CSS.get(key);
  if (css === undefined) {
    const vars = Object.entries(module.vars(skin))
      .map(([name, value]) => `${name}:${value}`)
      .join(';');
    css = `${vars && `\n.${prefix}-root{${vars}}`}${module.titleCss ? `\n${module.titleCss(prefix, Date.now())}` : ''}`;
    FX_CSS.set(key, css);
  }
  return css;
}

/** Title text: the preset's case, tracking and slant, or the overlay's own. */
export function titleStyle(skin: Skin) {
  return {
    textTransform: skin.title.upper ? 'uppercase' : 'none',
    letterSpacing: `${skin.title.tracking}em`,
    fontStyle: skin.title.italic ? 'italic' : 'normal',
  } as const;
}
