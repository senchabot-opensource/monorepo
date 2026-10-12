import { type MapGraph, type MapLink, type MapNode, type Pt, seededRandom } from './map-graph';

/** One square of a made-up map, in px; the map repeats it in every direction. */
export const TILE = 480;
// Streets cross the tile edges at 0, so the wide ones line up from tile to tile.
export const MAIN_ROAD = 10;
const SIDE_ROAD = 5;

export type BlockKind = 'building' | 'park' | 'water';
export interface CityBlock {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: BlockKind;
}

export interface CityTile {
  blocks: CityBlock[];
  /** Street junctions and the streets between them, for the walk. */
  graph: MapGraph;
}

/** Where the streets cross one side of the tile: always at 0, then every 40 to 100 px. */
function streets(random: () => number): number[] {
  const at = [0];
  for (let next = 40 + random() * 60; next < TILE - 35; next += 40 + random() * 60) {
    at.push(Math.round(next));
  }
  return at;
}

/**
 * The junctions of a repeating grid, `at(i, j)` placing each one, linked to their neighbors; a
 * link off the last column or row goes to the first one of the next tile.
 */
function gridGraph(
  columns: number,
  rows: number,
  at: (i: number, j: number) => Pt,
  path: (from: Pt, to: Pt, key: string) => Pt[] = (from, to) => [from, to],
  keep: (i: number, j: number, side: 'right' | 'down') => boolean = () => true,
): MapGraph {
  const index = (i: number, j: number) => j * columns + i;
  const nodes: MapNode[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) nodes.push({ ...at(i, j), links: [] });
  }
  const join = (i: number, j: number, side: 'right' | 'down') => {
    if (!keep(i, j, side)) return;
    const right = side === 'right';
    const ni = right ? (i + 1) % columns : i;
    const nj = right ? j : (j + 1) % rows;
    const dx = right && i === columns - 1 ? 1 : 0;
    const dy = !right && j === rows - 1 ? 1 : 0;
    const from = nodes[index(i, j)];
    const target = nodes[index(ni, nj)];
    const to = { x: target.x + dx * TILE, y: target.y + dy * TILE };
    const points = path({ x: from.x, y: from.y }, to, `${i},${j},${side}`);
    from.links.push({ to: index(ni, nj), dx, dy, points });
    // The way back starts in the neighbor's own tile.
    const shift = (p: Pt) => ({ x: p.x - dx * TILE, y: p.y - dy * TILE });
    const reverse: MapLink = {
      to: index(i, j),
      dx: -dx,
      dy: -dy,
      points: [...points].reverse().map(shift),
    };
    target.links.push(reverse);
  };
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) {
      join(i, j, 'right');
      join(i, j, 'down');
    }
  }
  return { nodes, tile: TILE };
}

/** A tile of the made-up city: blocks between the streets, mostly buildings, some parks and ponds. */
export function cityTile(seed: number): CityTile {
  const random = seededRandom(seed);
  const xs = streets(random);
  const ys = streets(random);
  const road = (at: number) => (at === 0 ? MAIN_ROAD : SIDE_ROAD) / 2;
  const blocks: CityBlock[] = [];
  xs.forEach((x0, i) => {
    const x1 = xs[i + 1] ?? TILE;
    ys.forEach((y0, j) => {
      const y1 = ys[j + 1] ?? TILE;
      const roll = random();
      const left = x0 + road(x0);
      const top = y0 + road(y0);
      blocks.push({
        x: left,
        y: top,
        w: x1 - (xs[i + 1] === undefined ? MAIN_ROAD / 2 : road(x1)) - left,
        h: y1 - (ys[j + 1] === undefined ? MAIN_ROAD / 2 : road(y1)) - top,
        kind: roll < 0.12 ? 'park' : roll < 0.18 ? 'water' : 'building',
      });
    });
  });
  const graph = gridGraph(xs.length, ys.length, (i, j) => ({ x: xs[i], y: ys[j] }));
  return { blocks, graph };
}

export interface Tree extends Pt {
  r: number;
}
export interface Pond extends Pt {
  rx: number;
  ry: number;
}
export interface ParkTile {
  /** Each path once, for drawing; the walk uses `graph`, which has both directions. */
  paths: Pt[][];
  trees: Tree[];
  ponds: Pond[];
  graph: MapGraph;
}

// Junctions on a 4x4 grid, each nudged off it, joined by paths that bend.
const PARK_GRID = 4;
const PARK_STEP = TILE / PARK_GRID;
const PARK_JITTER = 28;
const PATH_BEND = 34;
const PATH_SAMPLES = 10;
// Paths dropped to make the grid less even; no junction keeps fewer than this many.
const PARK_DROP = 0.3;
const MIN_PATHS_AT_JUNCTION = 2;
const TREE_TRIES = 70;
const TREE_CLEARANCE = 12;

/** Points along a quadratic curve from `a` to `b` that bows out by `bend` px. */
function bentPath(a: Pt, b: Pt, bend: number): Pt[] {
  const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const control = {
    x: (a.x + b.x) / 2 + (-(b.y - a.y) / length) * bend,
    y: (a.y + b.y) / 2 + ((b.x - a.x) / length) * bend,
  };
  return Array.from({ length: PATH_SAMPLES + 1 }, (_, k) => {
    const t = k / PATH_SAMPLES;
    const u = 1 - t;
    return {
      x: Math.round((u * u * a.x + 2 * u * t * control.x + t * t * b.x) * 10) / 10,
      y: Math.round((u * u * a.y + 2 * u * t * control.y + t * t * b.y) * 10) / 10,
    };
  });
}

const distanceToPaths = (p: Pt, paths: Pt[][]) =>
  Math.min(
    ...paths.flatMap((path) =>
      path.slice(1).map((b, k) => {
        const a = path[k];
        const lx = b.x - a.x;
        const ly = b.y - a.y;
        const t = Math.max(
          0,
          Math.min(1, ((p.x - a.x) * lx + (p.y - a.y) * ly) / (lx * lx + ly * ly || 1)),
        );
        return Math.hypot(p.x - (a.x + lx * t), p.y - (a.y + ly * t));
      }),
    ),
  );

/** A tile of the made-up park: winding paths between lawns, with trees and a pond or two. */
export function parkTile(seed: number): ParkTile {
  const random = seededRandom(seed);
  const jitter = Array.from({ length: PARK_GRID * PARK_GRID }, () => ({
    x: (random() * 2 - 1) * PARK_JITTER,
    y: (random() * 2 - 1) * PARK_JITTER,
  }));
  const bends = new Map<string, number>();
  // Each junction's paths, counting the ones coming in across the tile edge too.
  const degree = new Array(PARK_GRID * PARK_GRID).fill(4);
  const kept = new Set<string>();
  for (let j = 0; j < PARK_GRID; j++) {
    for (let i = 0; i < PARK_GRID; i++) {
      for (const side of ['right', 'down'] as const) {
        const ni = side === 'right' ? (i + 1) % PARK_GRID : i;
        const nj = side === 'right' ? j : (j + 1) % PARK_GRID;
        const a = j * PARK_GRID + i;
        const b = nj * PARK_GRID + ni;
        const drop =
          random() < PARK_DROP &&
          degree[a] > MIN_PATHS_AT_JUNCTION &&
          degree[b] > MIN_PATHS_AT_JUNCTION;
        if (drop) {
          degree[a] -= 1;
          degree[b] -= 1;
        } else {
          kept.add(`${i},${j},${side}`);
        }
        bends.set(`${i},${j},${side}`, (random() * 2 - 1) * PATH_BEND);
      }
    }
  }
  const paths: Pt[][] = [];
  const graph = gridGraph(
    PARK_GRID,
    PARK_GRID,
    (i, j) => ({
      x: Math.round(i * PARK_STEP + jitter[j * PARK_GRID + i].x),
      y: Math.round(j * PARK_STEP + jitter[j * PARK_GRID + i].y),
    }),
    (from, to, key) => {
      const points = bentPath(from, to, bends.get(key) ?? 0);
      paths.push(points);
      return points;
    },
    (i, j, side) => kept.has(`${i},${j},${side}`),
  );

  // Trees and ponds stay inside the tile, so none is cut in half where the tiles meet. Paths
  // that cross into the next tile are checked from both sides.
  const nearby = paths.flatMap((path) =>
    [-TILE, 0, TILE].flatMap((ox) =>
      [-TILE, 0, TILE].map((oy) => path.map((p) => ({ x: p.x + ox, y: p.y + oy }))),
    ),
  );
  const ponds: Pond[] = [];
  for (let tries = 0; tries < 6 && ponds.length < 2; tries++) {
    const pond = {
      x: PARK_STEP * (Math.floor(random() * PARK_GRID) + 0.5),
      y: PARK_STEP * (Math.floor(random() * PARK_GRID) + 0.5),
      rx: 20 + random() * 14,
      ry: 14 + random() * 10,
    };
    const inside =
      pond.x - pond.rx > 0 &&
      pond.x + pond.rx < TILE &&
      pond.y - pond.ry > 0 &&
      pond.y + pond.ry < TILE;
    if (inside && distanceToPaths(pond, nearby) > pond.rx + 8) ponds.push(pond);
  }
  const trees: Tree[] = [];
  for (let tries = 0; tries < TREE_TRIES; tries++) {
    const r = 5 + random() * 6;
    const tree = { x: r + random() * (TILE - 2 * r), y: r + random() * (TILE - 2 * r), r };
    const clear =
      distanceToPaths(tree, nearby) > r + TREE_CLEARANCE &&
      ponds.every((pond) => Math.hypot(tree.x - pond.x, tree.y - pond.y) > pond.rx + r + 4) &&
      trees.every((other) => Math.hypot(tree.x - other.x, tree.y - other.y) > tree.r + other.r);
    if (clear) trees.push({ x: Math.round(tree.x), y: Math.round(tree.y), r: Math.round(r) });
  }
  return { paths, trees, ponds, graph };
}
