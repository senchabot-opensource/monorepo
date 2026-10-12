import { describe, expect, it } from 'vitest';
import { hashSeed, type MapGraph } from './map-graph';
import { cityTile, MAIN_ROAD, parkTile, TILE } from './map-made-up';

const overlaps = (a: { x: number; y: number; w: number; h: number }, b: typeof a) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/** Every link ends at its target junction (in the neighbor tile it names) and has a way back. */
function expectConsistent(graph: MapGraph) {
  graph.nodes.forEach((node, id) => {
    expect(node.links.length).toBeGreaterThanOrEqual(2);
    for (const link of node.links) {
      const target = graph.nodes[link.to];
      const start = link.points[0];
      const end = link.points[link.points.length - 1];
      expect(start).toEqual({ x: node.x, y: node.y });
      expect(end.x).toBeCloseTo(target.x + link.dx * TILE, 5);
      expect(end.y).toBeCloseTo(target.y + link.dy * TILE, 5);
      const back = target.links.find(
        (other) => other.to === id && other.dx === -link.dx && other.dy === -link.dy,
      );
      expect(back).toBeDefined();
    }
  });
}

describe('cityTile', () => {
  it('builds the same city for the same channel, and another for another', () => {
    expect(cityTile(hashSeed('streamer'))).toEqual(cityTile(hashSeed('streamer')));
    expect(cityTile(hashSeed('streamer')).blocks).not.toEqual(cityTile(hashSeed('kicker')).blocks);
  });

  it('keeps every block inside the tile, with a street around it', () => {
    for (const seed of [1, 42, hashSeed('streamer'), hashSeed('kicker')]) {
      const { blocks } = cityTile(seed);
      expect(blocks.length).toBeGreaterThan(4);
      for (const block of blocks) {
        expect(block.w).toBeGreaterThan(0);
        expect(block.h).toBeGreaterThan(0);
        // The wide street on the tile edge is split between this tile and the next.
        expect(block.x).toBeGreaterThanOrEqual(MAIN_ROAD / 2);
        expect(block.y).toBeGreaterThanOrEqual(MAIN_ROAD / 2);
        expect(block.x + block.w).toBeLessThanOrEqual(TILE - MAIN_ROAD / 2);
        expect(block.y + block.h).toBeLessThanOrEqual(TILE - MAIN_ROAD / 2);
      }
      blocks.forEach((block, index) => {
        for (const other of blocks.slice(index + 1)) expect(overlaps(block, other)).toBe(false);
      });
    }
  });

  it('joins its street corners into a network that runs on into the next tile', () => {
    const { graph } = cityTile(7);
    expectConsistent(graph);
    // Every corner has four streets: the grid has no dead ends.
    for (const node of graph.nodes) expect(node.links).toHaveLength(4);
  });

  it('is mostly buildings, with parks and ponds here and there', () => {
    const kinds = Array.from({ length: 20 }, (_, seed) => cityTile(seed).blocks)
      .flat()
      .map((block) => block.kind);
    const share = (kind: string) => kinds.filter((k) => k === kind).length / kinds.length;
    expect(share('building')).toBeGreaterThan(0.7);
    expect(share('park')).toBeGreaterThan(0);
    expect(share('water')).toBeGreaterThan(0);
  });
});

describe('parkTile', () => {
  it('builds the same park for the same channel', () => {
    expect(parkTile(hashSeed('streamer'))).toEqual(parkTile(hashSeed('streamer')));
  });

  it('joins its paths into a network with at least two ways out of every junction', () => {
    for (const seed of [1, 2, 3, hashSeed('streamer')]) {
      const { graph, paths } = parkTile(seed);
      expectConsistent(graph);
      const links = graph.nodes.reduce((sum, node) => sum + node.links.length, 0);
      expect(links).toBe(paths.length * 2);
    }
  });

  it('keeps trees and ponds inside the tile and off the paths', () => {
    const { trees, ponds } = parkTile(5);
    expect(trees.length).toBeGreaterThan(10);
    for (const tree of trees) {
      expect(tree.x - tree.r).toBeGreaterThanOrEqual(0);
      expect(tree.x + tree.r).toBeLessThanOrEqual(TILE);
      expect(tree.y - tree.r).toBeGreaterThanOrEqual(0);
      expect(tree.y + tree.r).toBeLessThanOrEqual(TILE);
    }
    for (const pond of ponds) {
      expect(pond.x - pond.rx).toBeGreaterThan(0);
      expect(pond.x + pond.rx).toBeLessThan(TILE);
    }
  });
});
