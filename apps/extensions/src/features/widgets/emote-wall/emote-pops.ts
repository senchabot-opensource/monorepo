export type EmoteWallMode = 'calm' | 'chaos';

export const EMOTE_WALL_MODES: readonly EmoteWallMode[] = ['calm', 'chaos'];

export function isEmoteWallMode(value: unknown): value is EmoteWallMode {
  return value === 'calm' || value === 'chaos';
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

export type EmotePop = CalmPop | ChaosPop;

export const randomIn = (min: number, max: number) =>
  min + Math.random() * (max - min);

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
