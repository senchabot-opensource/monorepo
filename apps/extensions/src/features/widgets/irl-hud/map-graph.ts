/** A point on a mini-map, in px. */
export interface Pt {
  x: number;
  y: number;
}

/**
 * A way from one junction to the next. On a map that repeats (a made-up city or park), it may
 * end in the neighboring tile: `dx` and `dy` say which one. `points` run from the start junction
 * to the end one, in the start junction's tile.
 */
export interface MapLink {
  to: number;
  dx: number;
  dy: number;
  points: Pt[];
}

export interface MapNode extends Pt {
  links: MapLink[];
}

/** Junctions and the ways between them; `tile` is the repeat size of a made-up map, else null. */
export interface MapGraph {
  nodes: MapNode[];
  tile: number | null;
}

/** Where the walker is and where it heads. `heading` is in degrees, 0 up and 90 right. */
export interface WalkerPose {
  x: number;
  y: number;
  heading: number;
}

/** Weighs the ways out of a junction; the real map uses it to keep the walk near its middle. */
export type Steer = (from: Pt, direction: Pt) => number;

interface Walker {
  graph: MapGraph;
  node: number;
  /** The tile the current link starts in. */
  tx: number;
  ty: number;
  link: MapLink;
  segment: number;
  along: number;
  /** The way back to the junction just left, so the walk only turns around at a dead end. */
  back: { node: number; dx: number; dy: number } | null;
  heading: number;
  random: () => number;
  steer?: Steer;
}

const direction = (a: Pt, b: Pt): Pt => {
  const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: (b.x - a.x) / length, y: (b.y - a.y) / length };
};
const headingOf = (d: Pt) => (Math.atan2(d.x, -d.y) * 180) / Math.PI;

/** The first and last steps of a link that actually go somewhere. */
function firstStep(link: MapLink): Pt {
  const [start] = link.points;
  const next = link.points.find((p) => p.x !== start.x || p.y !== start.y) ?? start;
  return direction(start, next);
}
function lastStep(link: MapLink): Pt {
  const end = link.points[link.points.length - 1];
  const before =
    [...link.points].reverse().find((p) => p.x !== end.x || p.y !== end.y) ?? link.points[0];
  return direction(before, end);
}

// Going straight on is likelier than turning, like someone out for a walk.
const STRAIGHT_COS = Math.cos((35 * Math.PI) / 180);
const STRAIGHT_WEIGHT = 3;
const TURN_WEIGHT = 1.5;

/** Picks the way on from the walker's junction: anything but back, unless it's a dead end. */
function chooseLink(walker: Walker, incoming: Pt | null): MapLink {
  const node = walker.graph.nodes[walker.node];
  const { back } = walker;
  const onward = node.links.filter(
    (link) => !back || link.to !== back.node || link.dx !== back.dx || link.dy !== back.dy,
  );
  const options = onward.length > 0 ? onward : node.links;
  const here = { x: node.x, y: node.y };
  const weights = options.map((link) => {
    const out = firstStep(link);
    const turn = incoming ? out.x * incoming.x + out.y * incoming.y : 1;
    const weight = turn >= STRAIGHT_COS ? STRAIGHT_WEIGHT : TURN_WEIGHT;
    return weight * (walker.steer ? walker.steer(here, out) : 1);
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = walker.random() * total;
  for (let i = 0; i < options.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return options[i];
  }
  return options[options.length - 1];
}

/** A walker on `start`, heading off along one of its ways; null when the junction leads nowhere. */
export function createWalker(
  graph: MapGraph,
  start: number,
  random: () => number = Math.random,
  steer?: Steer,
): Walker | null {
  if (!graph.nodes[start]?.links.length) return null;
  const walker = {
    graph,
    node: start,
    tx: 0,
    ty: 0,
    segment: 0,
    along: 0,
    back: null,
    heading: 0,
    random,
    steer,
  } as Omit<Walker, 'link'> as Walker;
  walker.link = chooseLink(walker, null);
  walker.heading = headingOf(firstStep(walker.link));
  return walker;
}

/** Reaches the end of the current link and picks the next one. */
function arrive(walker: Walker) {
  const { link } = walker;
  const incoming = lastStep(link);
  walker.back = { node: walker.node, dx: -link.dx, dy: -link.dy };
  walker.node = link.to;
  walker.tx += link.dx;
  walker.ty += link.dy;
  walker.link = chooseLink(walker, incoming);
  walker.segment = 0;
  walker.along = 0;
}

// The arrow turns toward the way ahead at this many degrees a second, so corners look smooth.
const TURN_RATE = 160;
// Too long a frame (a hidden source) jumps ahead in one go instead of racing through corners.
const MAX_STEP_SECONDS = 0.25;

/** Moves the walker `seconds` ahead at `speed` px a second and returns where it is now. */
export function stepWalker(walker: Walker, seconds: number, speed: number): WalkerPose {
  const dt = Math.min(MAX_STEP_SECONDS, Math.max(0, seconds));
  let distance = dt * speed;
  // A graph of zero-length links can't move; the guard keeps a bad map from looping forever.
  for (let guard = 0; guard < 10_000 && distance > 0; guard++) {
    const { points } = walker.link;
    if (walker.segment >= points.length - 1) {
      arrive(walker);
      continue;
    }
    const a = points[walker.segment];
    const b = points[walker.segment + 1];
    const left = Math.hypot(b.x - a.x, b.y - a.y) - walker.along;
    if (distance < left) {
      walker.along += distance;
      distance = 0;
    } else {
      distance -= Math.max(0, left);
      walker.segment += 1;
      walker.along = 0;
    }
  }
  if (walker.segment >= walker.link.points.length - 1) arrive(walker);

  const { points } = walker.link;
  const a = points[walker.segment];
  const b = points[walker.segment + 1];
  const d = direction(a, b);
  const offset = walker.graph.tile ?? 0;
  const target = headingOf(d);
  const diff = ((target - walker.heading + 540) % 360) - 180;
  const turn = TURN_RATE * dt;
  walker.heading += Math.abs(diff) <= turn ? diff : Math.sign(diff) * turn;
  return {
    x: walker.tx * offset + a.x + d.x * walker.along,
    y: walker.ty * offset + a.y + d.y * walker.along,
    heading: walker.heading,
  };
}

/** mulberry32: the same map for the same seed, on every reload and in every OBS. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a, so a channel name always picks the same made-up map. */
export function hashSeed(text: string): number {
  let hash = 0x811c9dc5;
  for (const char of text) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
