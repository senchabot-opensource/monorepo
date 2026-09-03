import { describe, expect, it } from 'vitest';
import {
  createCalmPop,
  createChaosPop,
  isEmoteWallMode,
} from './emote-pops';

describe('isEmoteWallMode', () => {
  it('accepts calm and chaos only', () => {
    expect(isEmoteWallMode('calm')).toBe(true);
    expect(isEmoteWallMode('chaos')).toBe(true);
    expect(isEmoteWallMode('wild')).toBe(false);
    expect(isEmoteWallMode(undefined)).toBe(false);
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
