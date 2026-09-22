import { z } from 'zod';

/** Frame designs a preset can put around panels, bars and cards; see frame.tsx. */
export const FRAMES = ['gilded', 'ornate', 'lacquer', 'iron', 'tactical', 'hud', 'pixel'] as const;
/** How a preset's alert card and poll card come in. */
export const MOTIONS = ['unfold', 'drop', 'scroll', 'slam', 'slide', 'wipe', 'pop'] as const;
/** What sits on top of a bar's fill. */
export const FILLS = ['gloss', 'stripes', 'blocks', 'flat'] as const;
/** Which of Stream Alerts' built-in sound sets the alerts play. */
export const SOUNDS = ['neon', 'celestial'] as const;

const hex = z.string().regex(/^#[0-9a-f]{6}$/i, 'a #rrggbb color');
const blurb = z.string().max(160);

// Names and weights end up in a fonts.googleapis.com URL and a CSS font-family, so only
// letters, digits and spaces get through.
const font = z.object({
  family: z.string().regex(/^[A-Za-z0-9 ]{2,40}$/),
  /** Google Fonts `wght` axis: a range like "400..900" or a list like "400;700". */
  weights: z.string().regex(/^\d{3}(\.\.\d{3}|(;\d{3})*)$/),
  fallback: z.enum(['serif', 'sans-serif', 'monospace']),
});

export const presetSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]{1,23}$/),
  name: z.string().min(2).max(24),
  /** The game it's made for, shown next to the name. */
  game: z.string().min(2).max(40).optional(),
  author: z.object({
    name: z.string().min(1).max(40),
    url: z.url({ protocol: /^https$/ }).optional(),
  }),
  /**
   * One sentence per language; built-in presets keep theirs in the locale files instead. English
   * and Turkish are required, the other languages show English when theirs is missing.
   */
  description: z
    .object({
      en: blurb,
      tr: blurb,
      es: blurb.optional(),
      fr: blurb.optional(),
      ja: blurb.optional(),
      pt: blurb.optional(),
    })
    .optional(),
  fonts: z.object({ display: font, body: font }),
  colors: z.object({
    /** Bar fills, glows and highlights. */
    accent: hex,
    /** A reached goal, a poll's winner, a raffle's "winner!". */
    win: hex,
    text: hex,
    muted: hex,
    /** Panel background, top to bottom. */
    panel: hex,
    panel2: hex,
    /** Frame lines, light and dark. */
    frame: hex,
    frame2: hex,
    /** The empty part of a bar. */
    track: hex,
  }),
  /** Panel background opacity, so the game shows through a little. */
  panelOpacity: z.number().min(0.5).max(1),
  frame: z.enum(FRAMES),
  /** Scales each overlay's own corner radii: 0 is square, 1 keeps them. */
  radius: z.number().min(0).max(1.5),
  /** Bar slant in degrees. */
  skew: z.number().min(-20).max(0),
  title: z.object({
    upper: z.boolean(),
    italic: z.boolean(),
    /** Letter spacing in em. */
    tracking: z.number().min(0).max(0.4),
  }),
  fill: z.enum(FILLS),
  motion: z.enum(MOTIONS),
  sound: z.enum(SOUNDS),
  /** `soft` is the usual dark halo; `hard` a one-step drop shadow, as in pixel games. */
  shadow: z.enum(['soft', 'hard']),
});

export type PresetData = z.infer<typeof presetSchema>;
export type FrameKind = (typeof FRAMES)[number];
export type Motion = (typeof MOTIONS)[number];
export type Fill = (typeof FILLS)[number];
