export type EmoteWallMode = 'calm' | 'chaos' | 'bounce' | 'glide' | 'spin' | 'burst' | 'random';

export function isEmoteWallMode(value: unknown): value is EmoteWallMode {
  return (
    value === 'calm' ||
    value === 'chaos' ||
    value === 'bounce' ||
    value === 'glide' ||
    value === 'spin' ||
    value === 'burst' ||
    value === 'random'
  );
}

/** Concrete flights Random can pick (never itself). */
export const RANDOM_WALL_MODES: Exclude<EmoteWallMode, 'random'>[] = [
  'calm',
  'chaos',
  'bounce',
  'glide',
  'spin',
  'burst',
];

export function randomWallMode(): (typeof RANDOM_WALL_MODES)[number] {
  return RANDOM_WALL_MODES[Math.floor(Math.random() * RANDOM_WALL_MODES.length)];
}

/** Calm: pops up at a random spot, drifts gently, fades out. */
export type CalmPop = {
  kind: 'calm';
  id: string;
  src: string;
  /** Human-readable emote name for alt text (when known). */
  name?: string;
  xPct: number;
  yPct: number;
  dx: number;
  dy: number;
  size: number;
  rotation: number;
  duration: number;
};

/**
 * Chaos: zips in from a random screen border and travels linearly
 * across. Vanishes at a random point between halfway and the far side.
 */
export type ChaosPop = {
  kind: 'chaos';
  id: string;
  src: string;
  /** Human-readable emote name for alt text (when known). */
  name?: string;
  size: number;
  startXPct: number;
  startYPct: number;
  /** Travel vector in viewport units so it stays correct at any canvas size. */
  dxVw: number;
  dyVh: number;
  /** Full edge-to-edge travel time in ms (linear motion). */
  travelMs: number;
  /** Fraction of travelMs at which the emote starts fading out (0.5 - 1). */
  vanishAt: number;
};

/**
 * Glide: drifts down from the top of the screen, swaying slightly
 * side to side, and vanishes near the bottom. Same linear flight shape
 * as Chaos, but always top -> bottom with an added sway.
 */
export type GlidePop = {
  kind: 'glide';
  id: string;
  src: string;
  /** Human-readable emote name for alt text (when known). */
  name?: string;
  size: number;
  startXPct: number;
  startYPct: number;
  /** Travel vector in viewport units so it stays correct at any canvas size. */
  dxVw: number;
  dyVh: number;
  /** Full top-to-bottom travel time in ms (linear motion). */
  travelMs: number;
  /** Fraction of travelMs at which the emote starts fading out (0.75 - 1). */
  vanishAt: number;
  /** Side-to-side sway amplitude in px. */
  swayPx: number;
  /** One full sway cycle in ms. */
  swayMs: number;
};

/** Spin: fades in, spins around itself once or twice, then fades out. */
export type SpinPop = {
  kind: 'spin';
  id: string;
  src: string;
  /** Human-readable emote name for alt text (when known). */
  name?: string;
  xPct: number;
  yPct: number;
  size: number;
  /** Total spin around itself in degrees (1-2 full turns, either direction). */
  rotation: number;
  duration: number;
};

/**
 * Burst: appears, lingers, then pops into emote fragments and colored
 * sparks before its time ends. Occasionally just fades out instead.
 */
export type BurstPop = {
  kind: 'burst';
  id: string;
  src: string;
  /** Human-readable emote name for alt text (when known). */
  name?: string;
  xPct: number;
  yPct: number;
  size: number;
  /** Time in ms before the burst (or fade) starts. */
  lingerMs: number;
  /** False when this pop rolls a plain fade-out ending instead. */
  burst: boolean;
  /** Steady drift over lingerMs in px, so it bursts mid-motion. */
  dx: number;
  dy: number;
};

export type EmotePop = CalmPop | ChaosPop | BouncePop | GlidePop | SpinPop | BurstPop;

export const randomIn = (min: number, max: number) =>
  min + Math.random() * (max - min);

/**
 * Bounce: screensaver-style ricochet. Spawns inside the canvas, flies
 * straight, reflects off edges, and every edge hit boosts speed.
 */
export type BouncePop = {
  kind: 'bounce';
  id: string;
  src: string;
  /** Human-readable emote name for alt text (when known). */
  name?: string;
  size: number;
  startXPct: number;
  startYPct: number;
  /** Flight direction in radians. */
  angle: number;
  /** Pixels per second. */
  speed: number;
  /** How long the emote stays visible in ms. */
  visibleMs: number;
};

/** Speed multiplier applied on every edge hit. */
export const BOUNCE_BOOST = 1.3;
/** Hard speed cap (px/s) so boosted bounces stay on screen. */
export const BOUNCE_MAX_SPEED = 1000;

export function createBouncePop(
  src: string,
  baseSize: number,
  durationSec: number,
): Omit<BouncePop, 'id' | 'kind'> {
  return {
    src,
    size: Math.round(baseSize * randomIn(0.8, 1.3)),
    startXPct: randomIn(5, 90),
    startYPct: randomIn(5, 85),
    angle: randomIn(0, Math.PI * 2),
    speed: randomIn(140, 260),
    visibleMs: Math.round(durationSec * 1000),
  };
}

export type BounceStep = {
  x: number;
  y: number;
  angle: number;
  speed: number;
  bounced: boolean;
};

/**
 * One physics step: advance by velocity, reflect off the [0, maxX] x
 * [0, maxY] box, and boost speed on every edge hit (with a small angle
 * jitter so flights never loop in a perfect pattern).
 */
export function bounceStep(
  x: number,
  y: number,
  angle: number,
  speed: number,
  dt: number,
  maxX: number,
  maxY: number,
): BounceStep {
  let vx = Math.cos(angle) * speed;
  let vy = Math.sin(angle) * speed;
  let nx = x + vx * dt;
  let ny = y + vy * dt;
  let bounced = false;

  if (maxX <= 0) {
    nx = 0;
  } else if (nx <= 0) {
    nx = 0;
    vx = Math.abs(vx);
    bounced = true;
  } else if (nx >= maxX) {
    nx = maxX;
    vx = -Math.abs(vx);
    bounced = true;
  }

  if (maxY <= 0) {
    ny = 0;
  } else if (ny <= 0) {
    ny = 0;
    vy = Math.abs(vy);
    bounced = true;
  } else if (ny >= maxY) {
    ny = maxY;
    vy = -Math.abs(vy);
    bounced = true;
  }

  if (!bounced) {
    return { x: nx, y: ny, angle, speed, bounced: false };
  }

  const boosted = Math.min(speed * BOUNCE_BOOST, BOUNCE_MAX_SPEED);
  const reflected = Math.atan2(vy, vx) + randomIn(-0.15, 0.15);
  return { x: nx, y: ny, angle: reflected, speed: boosted, bounced: true };
}

export function createCalmPop(
  src: string,
  baseSize: number,
  duration: number,
): Omit<CalmPop, 'id' | 'kind'> {
  return {
    src,
    // Keep a safe margin so large emotes never spawn half off-screen.
    xPct: randomIn(4, 86),
    yPct: randomIn(8, 70),
    dx: randomIn(-140, 140),
    // Mostly drift upward away from the spawn point.
    dy: randomIn(-190, -40),
    size: Math.round(baseSize * randomIn(0.8, 1.3)),
    rotation: randomIn(-28, 28),
    duration,
  };
}

export function createChaosPop(
  src: string,
  baseSize: number,
  durationSec: number,
): Omit<ChaosPop, 'id' | 'kind'> {
  const border = Math.floor(Math.random() * 4);
  const along = randomIn(2, 98);
  // Slight perpendicular angle so zips aren't perfectly axis-aligned.
  const lateral = randomIn(-22, 22);
  const size = Math.round(baseSize * randomIn(0.8, 1.3));
  // Zippy edge-to-edge travel derived from the visible-duration setting.
  const travelMs = Math.round(durationSec * 1000 * randomIn(0.45, 0.8));
  // Disappears randomly once halfway or when reaching the other side.
  const vanishAt = randomIn(0.5, 1);

  switch (border) {
    case 0: // left -> right
      return { src, size, startXPct: -12, startYPct: along, dxVw: 130, dyVh: lateral, travelMs, vanishAt };
    case 1: // right -> left
      return { src, size, startXPct: 104, startYPct: along, dxVw: -130, dyVh: lateral, travelMs, vanishAt };
    case 2: // top -> bottom
      return { src, size, startXPct: along, startYPct: -14, dxVw: lateral, dyVh: 135, travelMs, vanishAt };
    default: // bottom -> top
      return { src, size, startXPct: along, startYPct: 106, dxVw: lateral, dyVh: -135, travelMs, vanishAt };
  }
}

export function createGlidePop(
  src: string,
  baseSize: number,
  durationSec: number,
): Omit<GlidePop, 'id' | 'kind'> {
  const size = Math.round(baseSize * randomIn(0.8, 1.3));
  return {
    src,
    size,
    startXPct: randomIn(2, 98),
    startYPct: -14,
    // Gentle sideways drift while falling straight down off the bottom.
    dxVw: randomIn(-18, 18),
    dyVh: 135,
    // The fall lasts roughly the visible-duration setting.
    travelMs: Math.round(durationSec * 1000 * randomIn(0.85, 1.15)),
    // Fades out near the bottom edge.
    vanishAt: randomIn(0.75, 1),
    // Sway scales with the emote so it stays slight at any size.
    swayPx: Math.max(8, Math.round(size * randomIn(0.12, 0.3))),
    swayMs: Math.round(randomIn(1400, 2600)),
  };
}

export function createSpinPop(
  src: string,
  baseSize: number,
  duration: number,
): Omit<SpinPop, 'id' | 'kind'> {
  const turns = randomIn(1, 2);
  const direction = Math.random() < 0.5 ? -1 : 1;
  return {
    src,
    // Keep a safe margin so large emotes never spawn half off-screen.
    xPct: randomIn(4, 86),
    yPct: randomIn(8, 70),
    size: Math.round(baseSize * randomIn(0.8, 1.3)),
    // One to two full spins around itself, in either direction.
    rotation: Math.round(turns * 360) * direction,
    duration,
  };
}

export type BurstParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  life: number;
  maxLife: number;
  size: number;
  spark: boolean;
  color: string;
  img: HTMLImageElement | null;
};

export const BURST_SHRAPNEL_COUNT = 14;
export const BURST_SPARK_COUNT = 10;

/** Random ending roll: true = burst into pieces, false = fade out. */
export function rollBurst(chance = 0.5): boolean {
  return Math.random() < chance;
}

const BURST_SPARK_COLORS = ['#ffffff', '#ffd54a', '#ff6b6b', '#7cf29c', '#6cb8ff'];

/**
 * Explosion shrapnel for one burst: emote fragments flying outward plus
 * colored sparks. Pure data — rendering lives in the widget's canvas loop.
 * `inherit` adds the bursting emote's own velocity (px/s) so fragments keep
 * moving with it instead of starting dead.
 */
export function createBurstParticles(
  cx: number,
  cy: number,
  size: number,
  img: HTMLImageElement | null,
  inherit: { vx: number; vy: number } = { vx: 0, vy: 0 },
): BurstParticle[] {
  const parts: BurstParticle[] = [];
  for (let i = 0; i < BURST_SHRAPNEL_COUNT; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = size * randomIn(1.2, 3.4);
    parts.push({
      x: cx,
      y: cy,
      vx: Math.cos(a) * sp + inherit.vx,
      vy: Math.sin(a) * sp - size * 0.6 + inherit.vy,
      rot: randomIn(0, Math.PI * 2),
      vr: randomIn(-6, 6),
      life: 0,
      maxLife: randomIn(0.55, 0.95),
      size: Math.max(4, size * randomIn(0.1, 0.22)),
      spark: false,
      color: '',
      img,
    });
  }
  for (let i = 0; i < BURST_SPARK_COUNT; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = size * randomIn(1.5, 4);
    parts.push({
      x: cx,
      y: cy,
      vx: Math.cos(a) * sp + inherit.vx,
      vy: Math.sin(a) * sp - size * 0.6 + inherit.vy,
      rot: 0,
      vr: 0,
      life: 0,
      maxLife: randomIn(0.4, 0.7),
      size: Math.max(2, size * randomIn(0.04, 0.1)),
      spark: true,
      color: BURST_SPARK_COLORS[i % BURST_SPARK_COLORS.length],
      img: null,
    });
  }
  return parts;
}

export function createBurstPop(
  src: string,
  baseSize: number,
  durationSec: number,
): Omit<BurstPop, 'id' | 'kind'> {
  return {
    src,
    // Keep a safe margin so large emotes never spawn half off-screen.
    xPct: randomIn(4, 86),
    yPct: randomIn(8, 70),
    size: Math.round(baseSize * randomIn(0.8, 1.3)),
    // Appears, lingers, then pops before the visible duration ends.
    lingerMs: Math.round(durationSec * 1000 * randomIn(0.6, 0.8)),
    burst: rollBurst(0.7),
    // Steady upward drift it keeps until the pop, so it bursts mid-motion.
    dx: Math.round(randomIn(-60, 60)),
    dy: Math.round(randomIn(-160, -40)),
  };
}
