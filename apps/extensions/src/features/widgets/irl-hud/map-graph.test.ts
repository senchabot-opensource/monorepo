import { describe, expect, it } from 'vitest';
import { createWalker, type MapGraph, type Pt, seededRandom, stepWalker } from './map-graph';
import { cityTile, parkTile, TILE } from './map-made-up';

const mod = (n: number, m: number) => ((n % m) + m) % m;

/** How far `p` is from the nearest way of `graph`, with the map repeating every `TILE`. */
function offPath(graph: MapGraph, p: Pt): number {
  const here = graph.tile ? { x: mod(p.x, TILE), y: mod(p.y, TILE) } : p;
  let best = Number.POSITIVE_INFINITY;
  for (const node of graph.nodes) {
    for (const link of node.links) {
      for (const [ox, oy] of [
        [0, 0],
        [-TILE, 0],
        [0, -TILE],
        [-TILE, -TILE],
        [TILE, 0],
        [0, TILE],
      ]) {
        link.points.slice(1).forEach((b, k) => {
          const a = link.points[k];
          const lx = b.x - a.x;
          const ly = b.y - a.y;
          const t = Math.max(
            0,
            Math.min(
              1,
              ((here.x - a.x - ox) * lx + (here.y - a.y - oy) * ly) / (lx * lx + ly * ly || 1),
            ),
          );
          best = Math.min(
            best,
            Math.hypot(here.x - (a.x + ox + lx * t), here.y - (a.y + oy + ly * t)),
          );
        });
      }
    }
  }
  return best;
}

describe('walker', () => {
  it('only ever walks on the streets of the made-up city, across tiles', () => {
    const { graph } = cityTile(11);
    const walker = createWalker(graph, 0, seededRandom(1));
    if (!walker) throw new Error('no walker');
    let far = 0;
    for (let frame = 0; frame < 3000; frame++) {
      const pose = stepWalker(walker, 1 / 30, 40);
      expect(offPath(graph, pose)).toBeLessThan(0.01);
      far = Math.max(far, Math.abs(pose.x), Math.abs(pose.y));
    }
    // 100 s at 40 px a second goes well past the first tile.
    expect(far).toBeGreaterThan(TILE);
  });

  it('only ever walks on the paths of the made-up park', () => {
    const { graph } = parkTile(3);
    const walker = createWalker(graph, 0, seededRandom(2));
    if (!walker) throw new Error('no walker');
    for (let frame = 0; frame < 2000; frame++) {
      expect(offPath(graph, stepWalker(walker, 1 / 30, 40))).toBeLessThan(0.01);
    }
  });

  it('turns back only at a dead end', () => {
    // A T: from the middle, west and east keep going, north is a dead end.
    const graph: MapGraph = {
      tile: null,
      nodes: [
        { x: 0, y: 0, links: [] },
        { x: -50, y: 0, links: [] },
        { x: 50, y: 0, links: [] },
        { x: 0, y: -50, links: [] },
      ],
    };
    for (const end of [1, 2, 3]) {
      const p = graph.nodes[end];
      graph.nodes[0].links.push({
        to: end,
        dx: 0,
        dy: 0,
        points: [
          { x: 0, y: 0 },
          { x: p.x, y: p.y },
        ],
      });
      graph.nodes[end].links.push({
        to: 0,
        dx: 0,
        dy: 0,
        points: [
          { x: p.x, y: p.y },
          { x: 0, y: 0 },
        ],
      });
    }
    const walker = createWalker(graph, 3, seededRandom(4));
    if (!walker) throw new Error('no walker');
    const visits: number[] = [];
    let last = -1;
    for (let frame = 0; frame < 600; frame++) {
      const pose = stepWalker(walker, 0.04, 25);
      const at = graph.nodes.findIndex((n) => Math.hypot(n.x - pose.x, n.y - pose.y) < 1.3);
      if (at > 0 && at !== last) visits.push(at);
      if (at >= 0) last = at;
    }
    expect(visits.length).toBeGreaterThan(5);
    // Leaving the dead end it always reaches the middle and goes on, never straight back.
    visits.forEach((end, k) => {
      if (k > 0) expect(end).not.toBe(visits[k - 1]);
    });
  });

  it('turns the arrow smoothly toward the way ahead', () => {
    const { graph } = cityTile(11);
    const walker = createWalker(graph, 0, seededRandom(5));
    if (!walker) throw new Error('no walker');
    let heading = stepWalker(walker, 0, 40).heading;
    for (let frame = 0; frame < 1000; frame++) {
      const next = stepWalker(walker, 1 / 60, 40).heading;
      const change = Math.abs(((next - heading + 540) % 360) - 180);
      expect(change).toBeLessThanOrEqual(160 / 60 + 1e-9);
      heading = next;
    }
  });

  it("can't start where no way leads", () => {
    expect(createWalker({ tile: null, nodes: [{ x: 0, y: 0, links: [] }] }, 0)).toBeNull();
    expect(createWalker({ tile: null, nodes: [] }, 0)).toBeNull();
  });
});
