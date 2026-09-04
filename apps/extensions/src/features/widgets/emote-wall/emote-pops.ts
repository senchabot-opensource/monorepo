export type EmoteWallMode = 'calm' | 'chaos' | 'bounce';

export const EMOTE_WALL_MODES: readonly EmoteWallMode[] = ['calm', 'chaos', 'bounce'];

export function isEmoteWallMode(value: unknown): value is EmoteWallMode {
  return value === 'calm' || value === 'chaos' || value === 'bounce';
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

export type EmotePop = CalmPop | ChaosPop | BouncePop;

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
