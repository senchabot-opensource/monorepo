import type { ComponentType } from 'react';
import type { Effect } from '../preset-schema';
import type { Skin } from '../skin';

export type ActiveEffect = Exclude<Effect, 'none'>;

/**
 * How a panel plays its preset's effect. `full` comes in with it, plays it now and then while
 * idle and on its pulses and wins; `enter` only comes in with it, for rows of a list; `hero`
 * comes in big, for an alert or a winner's card; `off` plays nothing.
 */
export type FrameFxMode = 'full' | 'enter' | 'hero' | 'off';

/** A bar that grew from `from` to `to`, as fractions of the bar. A new key plays it again. */
export interface FxHit {
  key: string | number;
  from: number;
  to: number;
}

interface FxPart {
  skin: Skin;
  /** 0 to 1, fixed for the element: picks its particles and its idle phase. */
  seed: number;
}

/** `pulse` and `win` count changes; a new count plays them again, 0 means never. */
export interface PanelFxProps extends FxPart {
  mode: Exclude<FrameFxMode, 'off'>;
  /** The panel's corner radius, in px. */
  radius: number;
  scale: number;
  pulse: number;
  win: number;
  /** Stream Frames: how thick the frame's band is, so nothing covers the webcam inside it. */
  ring?: number;
}

/** Drawn inside a bar's track, so it's clipped to the bar. */
export interface TrackFxProps extends FxPart {
  /** The latest hit, kept as it was when it came in. */
  hit: FxHit | null;
  hits: number;
  win: number;
}

/** Drawn on the overlay's stage, so particles can leave the bar. Positions are stage px. */
export interface BurstFxProps extends FxPart {
  hit: FxHit | null;
  hits: number;
  win: number;
  left: number;
  right: number;
  /** The bar's vertical center. */
  y: number;
  height: number;
}

/** Drawn over a number, e.g. a counter's value. */
export interface PulseFxProps extends FxPart {
  pulse: number;
  win: number;
  /** Plays once as it mounts, e.g. on a chat line that just came in. */
  enter: boolean;
  /** Keep it round, e.g. inside a ring. */
  round: boolean;
}

export interface EffectModule {
  id: ActiveEffect;
  /** Static keyframes and classes, every name prefixed `pfx-<id>-`; colors come from `vars`. */
  css: string;
  /** The custom properties its CSS reads, made from the skin. */
  vars: (skin: Skin) => Record<`--pfx-${string}`, string>;
  /**
   * A still background layer painted under a panel's content. `opacity` is the panel's own when an
   * overlay sets one, e.g. Chat Box's box opacity, and 1 otherwise; an empty string paints nothing.
   */
  panelLayer?: (skin: Skin, scale: number, opacity: number) => string;
  /**
   * Rules for an overlay's `.<prefix>-title`, with their keyframes; see skinCss. `now` is the
   * clock when the overlay first drew, for loops that keep in step with the panels'.
   */
  titleCss?: (prefix: string, now: number) => string;
  Panel: ComponentType<PanelFxProps>;
  Track: ComponentType<TrackFxProps>;
  Burst?: ComponentType<BurstFxProps>;
  Pulse: ComponentType<PulseFxProps>;
}
