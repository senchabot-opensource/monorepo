import { type CSSProperties, useState } from 'react';

// Effects run in an OBS browser source next to the game capture, as old as Chromium 103 (OBS 30):
// transforms and opacity only, no filters, no rAF loops. A one-shot animation plays again when
// React remounts its element under a new key.

/** Wraps rules that animate, so a viewer who asks for less motion gets none of them. */
export const motionOk = (css: string) => `@media (prefers-reduced-motion:no-preference){${css}}`;

/**
 * Rules every effect shares. Animated parts start invisible and only show while their animation
 * runs, so with reduced motion nothing is left standing on screen.
 *
 * A spark is two elements: the outer one drifts sideways at a steady speed, the inner one goes up
 * and comes down faster and faster, which together draw a thrown arc.
 */
export const BASE_CSS = `.pfx{position:absolute;pointer-events:none}
.pfx-l{position:absolute;pointer-events:none;opacity:0}
.pfx-sp{position:absolute;width:0;height:0;pointer-events:none}
.pfx-sp>i{position:absolute;display:block;opacity:0}
${motionOk(`@keyframes pfx-sx{from{transform:translateX(0)}to{transform:translateX(var(--dx))}}
@keyframes pfx-sy{0%{opacity:0;transform:translateY(0) rotate(var(--r));animation-timing-function:cubic-bezier(.12,.62,.35,1)}
3%{opacity:1}
38%{transform:translateY(var(--up)) rotate(var(--r));animation-timing-function:cubic-bezier(.55,0,.9,.45)}
72%{opacity:1}
100%{opacity:0;transform:translateY(var(--down)) rotate(var(--r))}}
.pfx-sp{animation:pfx-sx var(--t) linear var(--d) backwards}
.pfx-sp>i{animation:pfx-sy var(--t) linear var(--d) backwards}`)}`;

/** A 0 to 1 number from any text or number (FNV-1a), e.g. from React's useId. */
export function seedOf(value: string | number): number {
  const text = String(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) / 4294967296;
}

/** Numbers from 0 to 1 that repeat for the same seed (mulberry32): particles that never jump. */
export function rng(seed: number): () => number {
  let state = Math.floor(seed * 4294967296) >>> 0 || 1;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A negative animation delay that puts a `period` ms loop in step with the clock: every element
 * that mounts with it, in any browser source on the same PC, reaches the loop's end together.
 */
export function useClockPhase(period: number): number {
  const [delay] = useState(() => -(Date.now() % period));
  return delay;
}

/** The same, for CSS written once per page: the phase at the moment it's asked for. */
export const clockPhase = (period: number) => -(Date.now() % period);

/** A number between `min` and `max` from a generator. */
export const between = (next: () => number, min: number, max: number) => min + (max - min) * next();

export interface SparkSpec {
  id: number;
  /** Where it starts: px, or a percentage of the layer it's drawn in. */
  x: number | string;
  y: number | string;
  /** Sideways travel, the height of its arc (negative is up) and where it lands, in px. */
  dx: number;
  up: number;
  down: number;
  /** Its tilt in degrees, so a streak points the way it was thrown. */
  r: number;
  /** Duration and delay, in ms. */
  t: number;
  d: number;
  w: number;
  h: number;
}

export interface SparkThrow {
  count: number;
  x: number | string;
  y: number | string;
  /** Sideways speed, from -spread to +spread px. */
  spread: number;
  /** How high they fly, in px, as a range. */
  rise: [number, number];
  /** How far below the start they land, in px, as a range. */
  fall: [number, number];
  /** Duration range in ms. */
  ms: [number, number];
  delay?: number;
  /** Extra random delay, up to this many ms. */
  jitter?: number;
  size?: number;
  /** Throws only to one side: 1 to the right, -1 to the left. */
  side?: 1 | -1;
}

/** A handful of sparks thrown from one point, the same every time for the same generator. */
export function throwSparks(next: () => number, spec: SparkThrow, firstId = 0): SparkSpec[] {
  const size = spec.size ?? 1;
  return Array.from({ length: spec.count }, (_, index) => {
    const raw = between(next, -spec.spread, spec.spread);
    const dx = spec.side ? Math.abs(raw) * spec.side : raw;
    const up = -between(next, spec.rise[0], spec.rise[1]);
    const length = between(next, 5, 9) * size;
    return {
      id: firstId + index,
      x: spec.x,
      y: spec.y,
      dx,
      up,
      down: between(next, spec.fall[0], spec.fall[1]),
      // Points along the throw: flat for a sideways spark, steep for one flung up.
      r: (Math.atan2(up, dx || 0.01) * 180) / Math.PI,
      t: between(next, spec.ms[0], spec.ms[1]),
      d: (spec.delay ?? 0) + between(next, 0, spec.jitter ?? 0),
      w: length,
      h: Math.max(1.5, 2 * size),
    };
  });
}

export function Sparks({ sparks, className }: { sparks: readonly SparkSpec[]; className: string }) {
  return sparks.map((spark) => (
    <span
      key={spark.id}
      className="pfx-sp"
      style={
        {
          left: spark.x,
          top: spark.y,
          '--dx': `${spark.dx}px`,
          '--t': `${Math.round(spark.t)}ms`,
          '--d': `${Math.round(spark.d)}ms`,
        } as CSSProperties
      }
    >
      <i
        className={className}
        style={
          {
            width: spark.w,
            height: spark.h,
            marginLeft: -spark.w / 2,
            marginTop: -spark.h / 2,
            '--up': `${spark.up}px`,
            '--down': `${spark.down}px`,
            '--r': `${spark.r}deg`,
          } as CSSProperties
        }
      />
    </span>
  ));
}
