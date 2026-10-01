import { describe, expect, it } from 'vitest';
import {
  BOUNCE_BOOST,
  BOUNCE_MAX_SPEED,
  bounceStep,
  BURST_SHRAPNEL_COUNT,
  BURST_SPARK_COUNT,
  createBouncePop,
  createBurstParticles,
  createBurstPop,
  createCalmPop,
  createChaosPop,
  createGlidePop,
  createSpinPop,
  isEmoteWallMode,
  randomWallMode,
  RANDOM_WALL_MODES,
  rollBurst,
} from './emote-pops';

describe('isEmoteWallMode', () => {
  it('accepts every animation plus random', () => {
    expect(isEmoteWallMode('calm')).toBe(true);
    expect(isEmoteWallMode('chaos')).toBe(true);
    expect(isEmoteWallMode('bounce')).toBe(true);
    expect(isEmoteWallMode('glide')).toBe(true);
    expect(isEmoteWallMode('spin')).toBe(true);
    expect(isEmoteWallMode('burst')).toBe(true);
    expect(isEmoteWallMode('random')).toBe(true);
    expect(isEmoteWallMode('wild')).toBe(false);
    expect(isEmoteWallMode(undefined)).toBe(false);
  });
});

describe('randomWallMode', () => {
  it('picks a concrete animation, never itself', () => {
    expect(RANDOM_WALL_MODES).toHaveLength(6);
    expect(RANDOM_WALL_MODES).not.toContain('random');
    const seen = new Set(Array.from({ length: 200 }, () => randomWallMode()));
    expect(seen).toEqual(new Set(['calm', 'chaos', 'bounce', 'glide', 'spin', 'burst']));
  });
});

describe('createCalmPop', () => {
  it('spawns inside safe margins', () => {
    for (let i = 0; i < 50; i++) {
      const pop = createCalmPop('src', 112, 5);
      expect(pop.xPct).toBeGreaterThanOrEqual(4);
      expect(pop.xPct).toBeLessThanOrEqual(86);
      expect(pop.yPct).toBeGreaterThanOrEqual(8);
      expect(pop.yPct).toBeLessThanOrEqual(70);
      expect(pop.duration).toBe(5);
    }
  });
});

describe('createChaosPop', () => {
  it('starts off-screen at a border', () => {
    for (let i = 0; i < 100; i++) {
      const pop = createChaosPop('src', 112, 5);
      const offScreen =
        pop.startXPct < 0 ||
        pop.startXPct > 100 ||
        pop.startYPct < 0 ||
        pop.startYPct > 100;
      expect(offScreen).toBe(true);
    }
  });

  it('travel vector crosses the viewport', () => {
    for (let i = 0; i < 100; i++) {
      const pop = createChaosPop('src', 112, 5);
      // Primary axis travel must clear the full screen (>100 units).
      const mainAxis = Math.max(Math.abs(pop.dxVw), Math.abs(pop.dyVh));
      expect(mainAxis).toBeGreaterThan(100);
    }
  });

  it('vanishes between halfway and the far side', () => {
    for (let i = 0; i < 50; i++) {
      const pop = createChaosPop('src', 112, 5);
      expect(pop.vanishAt).toBeGreaterThanOrEqual(0.5);
      expect(pop.vanishAt).toBeLessThanOrEqual(1);
    }
  });

  it('zips faster than the calm visible duration', () => {
    for (let i = 0; i < 50; i++) {
      const pop = createChaosPop('src', 112, 5);
      expect(pop.travelMs).toBeLessThan(5 * 1000);
      expect(pop.travelMs).toBeGreaterThan(0);
    }
  });

  it('covers all four borders over many samples', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const pop = createChaosPop('src', 112, 5);
      if (pop.startXPct < 0) seen.add('left');
      else if (pop.startXPct > 100) seen.add('right');
      else if (pop.startYPct < 0) seen.add('top');
      else seen.add('bottom');
    }
    expect(seen).toEqual(new Set(['left', 'right', 'top', 'bottom']));
  });
});

describe('createBouncePop', () => {
  it('spawns inside the canvas with a sane flight', () => {
    for (let i = 0; i < 50; i++) {
      const pop = createBouncePop('src', 112, 5);
      expect(pop.startXPct).toBeGreaterThanOrEqual(0);
      expect(pop.startXPct).toBeLessThanOrEqual(100);
      expect(pop.startYPct).toBeGreaterThanOrEqual(0);
      expect(pop.startYPct).toBeLessThanOrEqual(100);
      expect(pop.angle).toBeGreaterThanOrEqual(0);
      expect(pop.angle).toBeLessThan(Math.PI * 2);
      expect(pop.speed).toBeGreaterThanOrEqual(140);
      expect(pop.speed).toBeLessThanOrEqual(260);
      expect(pop.visibleMs).toBe(5000);
    }
  });
});

describe('createGlidePop', () => {
  it('starts above the screen and falls past the bottom edge', () => {
    for (let i = 0; i < 50; i++) {
      const pop = createGlidePop('src', 112, 5);
      expect(pop.startYPct).toBeLessThan(0);
      expect(pop.startXPct).toBeGreaterThanOrEqual(2);
      expect(pop.startXPct).toBeLessThanOrEqual(98);
      // Falls straight down off the bottom with only a gentle sideways drift.
      expect(pop.startYPct + pop.dyVh).toBeGreaterThan(100);
      expect(Math.abs(pop.dxVw)).toBeLessThanOrEqual(18);
    }
  });

  it('falls for roughly the visible duration and vanishes near the bottom', () => {
    for (let i = 0; i < 50; i++) {
      const pop = createGlidePop('src', 112, 5);
      expect(pop.travelMs).toBeGreaterThan(0);
      expect(pop.travelMs).toBeGreaterThanOrEqual(Math.round(5 * 1000 * 0.85));
      expect(pop.travelMs).toBeLessThanOrEqual(Math.round(5 * 1000 * 1.15));
      expect(pop.vanishAt).toBeGreaterThanOrEqual(0.75);
      expect(pop.vanishAt).toBeLessThanOrEqual(1);
    }
  });

  it('sways slightly side to side on a 1 to 3 second cycle', () => {
    for (let i = 0; i < 50; i++) {
      const pop = createGlidePop('src', 112, 5);
      expect(pop.swayPx).toBeGreaterThanOrEqual(8);
      expect(pop.swayPx).toBeLessThanOrEqual(60);
      expect(pop.swayMs).toBeGreaterThanOrEqual(1400);
      expect(pop.swayMs).toBeLessThanOrEqual(2600);
    }
  });
});

describe('createSpinPop', () => {
  it('spawns inside safe margins and stays for the full duration', () => {
    for (let i = 0; i < 50; i++) {
      const pop = createSpinPop('src', 112, 5);
      expect(pop.xPct).toBeGreaterThanOrEqual(4);
      expect(pop.xPct).toBeLessThanOrEqual(86);
      expect(pop.yPct).toBeGreaterThanOrEqual(8);
      expect(pop.yPct).toBeLessThanOrEqual(70);
      expect(pop.duration).toBe(5);
    }
  });

  it('spins around itself once or twice, in either direction', () => {
    let clockwise = false;
    let counterClockwise = false;
    for (let i = 0; i < 50; i++) {
      const pop = createSpinPop('src', 112, 5);
      const magnitude = Math.abs(pop.rotation);
      expect(magnitude).toBeGreaterThanOrEqual(360);
      expect(magnitude).toBeLessThanOrEqual(720);
      if (pop.rotation > 0) clockwise = true;
      if (pop.rotation < 0) counterClockwise = true;
    }
    expect(clockwise).toBe(true);
    expect(counterClockwise).toBe(true);
  });
});

describe('rollBurst', () => {
  it('always bursts at chance 1 and never at chance 0', () => {
    for (let i = 0; i < 20; i++) {
      expect(rollBurst(1)).toBe(true);
      expect(rollBurst(0)).toBe(false);
    }
  });

  it('rolls both endings over many samples', () => {
    const results = new Set(Array.from({ length: 100 }, () => rollBurst(0.7)));
    expect(results).toEqual(new Set([true, false]));
  });
});

describe('createBurstParticles', () => {
  it('bursts into shrapnel plus colored sparks', () => {
    const parts = createBurstParticles(100, 100, 112, null);
    expect(parts).toHaveLength(BURST_SHRAPNEL_COUNT + BURST_SPARK_COUNT);
    const shrapnel = parts.filter((p) => !p.spark);
    const sparks = parts.filter((p) => p.spark);
    expect(shrapnel).toHaveLength(BURST_SHRAPNEL_COUNT);
    expect(sparks).toHaveLength(BURST_SPARK_COUNT);
    for (const p of shrapnel) {
      expect(p.maxLife).toBeGreaterThanOrEqual(0.55);
      expect(p.maxLife).toBeLessThanOrEqual(0.95);
      expect(p.size).toBeGreaterThanOrEqual(4);
      expect(p.life).toBe(0);
    }
    for (const p of sparks) {
      expect(p.maxLife).toBeGreaterThanOrEqual(0.4);
      expect(p.maxLife).toBeLessThanOrEqual(0.7);
      expect(p.color).toMatch(/^#[0-9a-f]{6}$/);
      expect(p.img).toBeNull();
    }
  });

  it('carries the bursting emote velocity into every fragment', () => {
    const parts = createBurstParticles(100, 100, 112, null, { vx: 1000, vy: -500 });
    expect(parts).toHaveLength(BURST_SHRAPNEL_COUNT + BURST_SPARK_COUNT);
    // Fastest own speed is size * 4, so a +1000 boost keeps every vx positive.
    for (const p of parts) expect(p.vx).toBeGreaterThan(0);
  });
});

describe('createBurstPop', () => {
  it('spawns inside safe margins and lingers before popping', () => {
    for (let i = 0; i < 50; i++) {
      const pop = createBurstPop('src', 112, 5);
      expect(pop.xPct).toBeGreaterThanOrEqual(4);
      expect(pop.xPct).toBeLessThanOrEqual(86);
      expect(pop.yPct).toBeGreaterThanOrEqual(8);
      expect(pop.yPct).toBeLessThanOrEqual(70);
      // Pops before the visible duration ends, leaving room for the burst.
      expect(pop.lingerMs).toBeGreaterThanOrEqual(Math.round(5 * 1000 * 0.6));
      expect(pop.lingerMs).toBeLessThanOrEqual(Math.round(5 * 1000 * 0.8));
      // Steady upward drift it keeps until the pop.
      expect(pop.dx).toBeGreaterThanOrEqual(-60);
      expect(pop.dx).toBeLessThanOrEqual(60);
      expect(pop.dy).toBeGreaterThanOrEqual(-160);
      expect(pop.dy).toBeLessThanOrEqual(-40);
    }
  });
});

describe('bounceStep', () => {
  it('flies straight without bouncing mid-field', () => {
    const res = bounceStep(100, 100, 0, 200, 0.5, 800, 600);
    expect(res.bounced).toBe(false);
    expect(res.x).toBeCloseTo(200);
    expect(res.y).toBeCloseTo(100);
    expect(res.angle).toBe(0);
    expect(res.speed).toBe(200);
  });

  it('reflects off the right edge and boosts speed', () => {
    const res = bounceStep(790, 100, 0, 200, 0.5, 800, 600);
    expect(res.bounced).toBe(true);
    expect(res.x).toBe(800);
    expect(res.speed).toBeCloseTo(200 * BOUNCE_BOOST);
    // Heading back left (angle near PI, modulo jitter).
    expect(Math.cos(res.angle)).toBeLessThan(0);
  });

  it('reflects off the top edge downward', () => {
    const res = bounceStep(400, 5, -Math.PI / 2, 200, 0.5, 800, 600);
    expect(res.bounced).toBe(true);
    expect(res.y).toBe(0);
    expect(Math.sin(res.angle)).toBeGreaterThan(0);
  });

  it('caps boosted speed at the maximum', () => {
    const res = bounceStep(790, 100, 0, 950, 0.5, 800, 600);
    expect(res.bounced).toBe(true);
    expect(res.speed).toBe(BOUNCE_MAX_SPEED);
  });
});
