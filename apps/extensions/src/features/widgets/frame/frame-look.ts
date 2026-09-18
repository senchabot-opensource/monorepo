import type { ReactNode } from 'react';
import type { FrameKind } from '#/features/presets/preset-schema';
import { type Skin, shade, type Tone } from '#/features/presets/skin';
import { OVERLAY_FONT_FAMILY } from '#/features/widgets/overlay-style';
import type { FramePiece } from '#/lib/frame-url';
import type { Box, ShapeSpec } from './shape';

/** A color from a tone: lightness, alpha, and how much of the tone's saturation to keep. */
export type Paint = (l: number, a?: number, saturation?: number) => string;

const painter =
  (tone: Tone): Paint =>
  (l, a = 1, saturation = 1) =>
    shade({ h: tone.h, s: Math.round(tone.s * saturation * 10) / 10 }, l, a);

/** The colors and font a frame draws with: a preset's, or classic's from one hue. */
export interface Look {
  kind: FrameKind | 'classic';
  /** Light and dark frame metal. */
  frame: string;
  frame2: string;
  /** Solid panel colors, top and bottom. */
  panel: string;
  panel2: string;
  accent: Paint;
  win: Paint;
  /** The empty part of a bar: a dark neutral. */
  track: string;
  text: string;
  font: string;
  skin: Skin | null;
}

export function lookFor(skin: Skin | null, hue: number): Look {
  if (!skin) {
    return {
      kind: 'classic',
      frame: `hsl(${hue} 90% 68%)`,
      frame2: `hsl(${hue + 40} 90% 58%)`,
      panel: '#1a1624',
      panel2: '#0a080e',
      accent: painter({ h: hue, s: 90 }),
      win: painter({ h: (hue + 40) % 360, s: 90 }),
      track: '#0d0b12',
      text: '#ffffff',
      font: OVERLAY_FONT_FAMILY,
      skin: null,
    };
  }
  return {
    kind: skin.frameKind,
    frame: skin.frame,
    frame2: skin.frame2,
    panel: skin.colors.panel,
    panel2: skin.colors.panel2,
    accent: painter(skin.accent),
    win: painter(skin.win),
    track: skin.track,
    text: skin.text,
    font: skin.display,
    skin,
  };
}

/** A tab pushed out of the body's top edge (camera, chat) for the label. */
export interface Tab {
  cx: number;
  width: number;
  /** How far it rises above the body. */
  out: number;
}

/** Everything an art style needs to draw one frame, in CSS px. */
export interface Geometry {
  w: number;
  h: number;
  /** Size unit: 1 on a 360px-high webcam frame. */
  s: number;
  /** Band thickness. */
  t: number;
  /** The body's outer box, before tabs, trays and wings; room around it is left for them. */
  body: Box;
  /** The see-through middle: the body inset by the band. */
  hole: Box;
  /** The label tab on top; zero-width on the screen piece and on badges. */
  tab: Tab;
  /** `badge` is the small plate that carries the screen piece's label. */
  piece: FramePiece | 'badge';
  look: Look;
  /** Whether animations run; styles can skip animated-only parts when off. */
  motion: boolean;
  /** A gradient or pattern id unique to this frame, so two frames on a page don't share defs. */
  id: (name: string) => string;
}

export interface Art {
  /** The silhouette: corners, tabs, trays and wings, sized from the geometry. */
  shape: (g: Geometry) => ShapeSpec;
  /**
   * Everything that's drawn: the plate between `outline` and `hole` (an empty string on
   * badges), rims, ornaments and animated parts.
   */
  draw: (g: Geometry, paths: { outline: string; hole: string }) => ReactNode;
  /**
   * The streaks that race around the frame: along its outer `edge` or its `hole`, in a color
   * that fits the style. Left out, the frame gets none.
   */
  runner?: (g: Geometry) => {
    path: 'edge' | 'hole';
    /** A path of its own instead, e.g. snapped to a pixel grid. */
    d?: string;
    color: string;
    width: number;
    dur?: number;
    pixel?: boolean;
    steps?: number;
  };
  /** Tab room around the label, in bands; more when the style draws inside the tab. Default 5. */
  labelPad?: number;
  /** Label text color, when the preset's text color doesn't suit the style's tab. */
  labelColor?: (g: Geometry) => string;
  /** Moves the label down from the middle of the tab, in px (e.g. under a roof). */
  labelShift?: (g: Geometry) => number;
}

/** A rect's props from a box. */
export const rectOf = (b: Box) => ({ x: b.x0, y: b.y0, width: b.x1 - b.x0, height: b.y1 - b.y0 });

/** The body's horizontal and vertical middle. */
export const middle = (g: Geometry) => ({
  cx: (g.body.x0 + g.body.x1) / 2,
  cy: (g.body.y0 + g.body.y1) / 2,
});
