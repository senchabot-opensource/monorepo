import type { MapGraph, Pt, WalkerPose } from './map-graph';

/**
 * Indoor mode (`!hud indoor`): the arrow goes into the building nearest it and walks around
 * inside its walls until `!hud outdoor`. A room is that building's outline, in map px.
 */
export type Room = Pt[];

/** A building farther than this from the arrow is too far to have walked into. */
export const MAX_ENTER_PX = 90;
/** The stand-in room where there's no building near: the made-up park, or an empty block. */
const STAND_IN = { w: 46, h: 34 };
/** How far from the walls the arrow keeps, at most; a narrow room gets less. */
const WALL_GAP = 4;
/** The room fills about this much of the mini-map, so a small house still reads. */
const ROOM_SHARE = 0.55;
const MAX_ZOOM = 5;
// Indoors people walk slower and stop to look around.
export const INDOOR_SPEED = 0.7;
const PAUSE_S = { min: 0.8, max: 2.6 };
const TURN_RATE = 200;
const TARGET_TRIES = 40;

/** Whether `p` is inside the polygon (even-odd rule). */
export function inside(p: Pt, room: Room): boolean {
  let hit = false;
  for (let i = 0, j = room.length - 1; i < room.length; j = i++) {
    const a = room[i];
    const b = room[j];
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x)
      hit = !hit;
  }
  return hit;
}

/** The point on segment ab nearest `p`. */
function nearestOnSegment(p: Pt, a: Pt, b: Pt): Pt {
  const lx = b.x - a.x;
  const ly = b.y - a.y;
  const t = Math.max(
    0,
    Math.min(1, ((p.x - a.x) * lx + (p.y - a.y) * ly) / (lx * lx + ly * ly || 1)),
  );
  return { x: a.x + lx * t, y: a.y + ly * t };
}

/** The point on the room's walls nearest `p`. */
function nearestOnWalls(p: Pt, room: Room): Pt {
  let best = room[0];
  let distance = Number.POSITIVE_INFINITY;
  for (let i = 0; i < room.length; i++) {
    const q = nearestOnSegment(p, room[i], room[(i + 1) % room.length]);
    const d = Math.hypot(q.x - p.x, q.y - p.y);
    if (d < distance) {
      best = q;
      distance = d;
    }
  }
  return best;
}

/** How far `p` is from the nearest wall. */
export const wallDistance = (p: Pt, room: Room) => {
  const q = nearestOnWalls(p, room);
  return Math.hypot(q.x - p.x, q.y - p.y);
};

/** How far `p` is from the room: 0 inside it. */
export const distanceTo = (p: Pt, room: Room) => (inside(p, room) ? 0 : wallDistance(p, room));

function bounds(room: Room) {
  const xs = room.map((p) => p.x);
  const ys = room.map((p) => p.y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top };
}

/** The building the arrow at `at` walks into: the nearest one within reach, or null. */
export function nearestRoom(rooms: readonly Room[], at: Pt, reach = MAX_ENTER_PX): Room | null {
  let best: Room | null = null;
  let distance = reach;
  for (const room of rooms) {
    if (room.length < 3) continue;
    const d = distanceTo(at, room);
    if (d <= distance) {
      best = room;
      distance = d;
    }
  }
  return best;
}

/** A small building around `at`, for where the map has none near. */
export const standInRoom = (at: Pt): Room => {
  const x = at.x - STAND_IN.w / 2;
  const y = at.y - STAND_IN.h / 2;
  return [
    { x, y },
    { x: x + STAND_IN.w, y },
    { x: x + STAND_IN.w, y: y + STAND_IN.h },
    { x, y: y + STAND_IN.h },
  ];
};

/** The room for an arrow at `at`: the nearest building, else a stand-in around it. */
export const roomFor = (rooms: readonly Room[], at: Pt): Room =>
  nearestRoom(rooms, at) ?? standInRoom(at);

/** How much the mini-map zooms in on `room`; the map turns, so its diagonal has to fit. */
export function roomZoom(room: Room, radarSize: number): number {
  const box = bounds(room);
  const diagonal = Math.hypot(box.width, box.height) || 1;
  return Math.min(MAX_ZOOM, Math.max(1, (radarSize * ROOM_SHARE) / diagonal));
}

/** How far from the walls this room lets the arrow keep: less in a narrow one. */
const gapFor = (room: Room) => {
  const box = bounds(room);
  return Math.min(WALL_GAP, Math.min(box.width, box.height) / 4);
};

const cross = (o: Pt, a: Pt, b: Pt) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

/** Whether segments ab and cd cross or touch. */
function segmentsMeet(a: Pt, b: Pt, c: Pt, d: Pt): boolean {
  const d1 = cross(c, d, a);
  const d2 = cross(c, d, b);
  const d3 = cross(a, b, c);
  const d4 = cross(a, b, d);
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0)))
    return true;
  const on = (p: Pt, q: Pt, r: Pt) =>
    Math.min(p.x, q.x) <= r.x &&
    r.x <= Math.max(p.x, q.x) &&
    Math.min(p.y, q.y) <= r.y &&
    r.y <= Math.max(p.y, q.y);
  return (
    (d1 === 0 && on(c, d, a)) ||
    (d2 === 0 && on(c, d, b)) ||
    (d3 === 0 && on(a, b, c)) ||
    (d4 === 0 && on(a, b, d))
  );
}

/** How close segments ab and cd come. */
function segmentGap(a: Pt, b: Pt, c: Pt, d: Pt): number {
  if (segmentsMeet(a, b, c, d)) return 0;
  const to = (p: Pt, q: Pt, r: Pt) => {
    const n = nearestOnSegment(p, q, r);
    return Math.hypot(n.x - p.x, n.y - p.y);
  };
  return Math.min(to(a, c, d), to(b, c, d), to(c, a, b), to(d, a, b));
}

/**
 * Whether the straight walk from `a` to `b` stays inside the room, `clearance` px from every wall
 * the whole way: in an L-shaped room the line between two spots can cut the inner corner.
 */
export function clearWalk(a: Pt, b: Pt, room: Room, clearance = 0.5): boolean {
  if (!inside(a, room) || !inside(b, room)) return false;
  for (let i = 0; i < room.length; i++) {
    if (segmentGap(a, b, room[i], room[(i + 1) % room.length]) < clearance) return false;
  }
  return true;
}

/**
 * A spot clear of the walls that the arrow at `from` can walk straight to without leaving the
 * room; `from` itself (a moment more of standing) when none turns up.
 */
function spotInside(room: Room, from: Pt, random: () => number): Pt {
  const box = bounds(room);
  const gap = gapFor(room);
  for (let tries = 0; tries < TARGET_TRIES; tries++) {
    const p = { x: box.left + random() * box.width, y: box.top + random() * box.height };
    if (wallDistance(p, room) >= gap && clearWalk(from, p, room, gap / 2)) return p;
  }
  return { x: from.x, y: from.y };
}

// The doorway is looked for on a grid this many points a side over the building.
const DOOR_GRID = 24;

/**
 * Where someone at `from` comes in: the spot clear of the walls nearest the wall they reach first,
 * found on a grid, since in an L-shaped building the middle of its box can be outdoors.
 */
export function doorway(room: Room, from: Pt): Pt {
  const gap = gapFor(room);
  if (inside(from, room) && wallDistance(from, room) >= gap) return from;
  const wall = nearestOnWalls(from, room);
  const box = bounds(room);
  let best: Pt | null = null;
  let distance = Number.POSITIVE_INFINITY;
  for (let i = 0; i <= DOOR_GRID; i++) {
    for (let j = 0; j <= DOOR_GRID; j++) {
      const p = {
        x: box.left + (box.width * i) / DOOR_GRID,
        y: box.top + (box.height * j) / DOOR_GRID,
      };
      const d = Math.hypot(p.x - wall.x, p.y - wall.y);
      if (d < distance && inside(p, room) && wallDistance(p, room) >= gap / 2) {
        best = p;
        distance = d;
      }
    }
  }
  return best ?? wall;
}

/** Walks the arrow to a point, then lets the caller decide what's next. */
export interface StraightWalk {
  x: number;
  y: number;
  heading: number;
  target: Pt;
}

/** Moves toward the target at `speed` px a second, turning smoothly; true once it's there. */
function stepTowards(walk: StraightWalk, dt: number, speed: number): boolean {
  const dx = walk.target.x - walk.x;
  const dy = walk.target.y - walk.y;
  const left = Math.hypot(dx, dy);
  if (left < 0.01) return true;
  const target = (Math.atan2(dx, -dy) * 180) / Math.PI;
  const diff = ((target - walk.heading + 540) % 360) - 180;
  const turn = TURN_RATE * dt;
  walk.heading += Math.abs(diff) <= turn ? diff : Math.sign(diff) * turn;
  const distance = speed * dt;
  if (distance >= left) {
    walk.x = walk.target.x;
    walk.y = walk.target.y;
    return true;
  }
  walk.x += (dx / left) * distance;
  walk.y += (dy / left) * distance;
  return false;
}

/** The arrow inside a room: it walks to a spot, looks around a moment, and picks another. */
export interface RoomWalker extends StraightWalk {
  room: Room;
  /** Seconds left standing at the current spot. */
  pause: number;
  random: () => number;
}

/** A walker coming into `room` from `from`: it walks in through the nearest wall first. */
export function createRoomWalker(
  room: Room,
  from: WalkerPose,
  random: () => number = Math.random,
): RoomWalker {
  return {
    room,
    x: from.x,
    y: from.y,
    heading: from.heading,
    target: doorway(room, from),
    pause: 0,
    random,
  };
}

/** Moves the room walker `seconds` ahead at `speed` px a second and returns where it is now. */
export function stepRoomWalker(walker: RoomWalker, seconds: number, speed: number): WalkerPose {
  let dt = Math.max(0, seconds);
  if (speed > 0) {
    if (walker.pause > 0) {
      const waited = Math.min(walker.pause, dt);
      walker.pause -= waited;
      dt -= waited;
    }
    if (dt > 0 && stepTowards(walker, dt, speed)) {
      walker.target = spotInside(walker.room, walker.target, walker.random);
      walker.pause = PAUSE_S.min + walker.random() * (PAUSE_S.max - PAUSE_S.min);
    }
  }
  return { x: walker.x, y: walker.y, heading: walker.heading };
}

/** Walks back out to `node`; done once it's there. */
export const createExitWalk = (from: WalkerPose, node: Pt): StraightWalk => ({
  x: from.x,
  y: from.y,
  heading: from.heading,
  target: { x: node.x, y: node.y },
});

/** Moves the walk out; returns the pose and whether it has reached the street. */
export function stepExitWalk(
  walk: StraightWalk,
  seconds: number,
  speed: number,
): { pose: WalkerPose; done: boolean } {
  const done = speed <= 0 ? false : stepTowards(walk, Math.max(0, seconds), speed);
  return { pose: { x: walk.x, y: walk.y, heading: walk.heading }, done };
}

/**
 * The junction nearest `at` that leads somewhere, where the walk outside picks up again. On a
 * repeating map `at` is first brought into the tile, and the result says which tile it's in.
 */
export function nearestNode(graph: MapGraph, at: Pt): { node: number; x: number; y: number } {
  const tile = graph.tile;
  const tx = tile ? Math.floor(at.x / tile) : 0;
  const ty = tile ? Math.floor(at.y / tile) : 0;
  const offsets = tile ? [-1, 0, 1] : [0];
  let best = { node: -1, x: at.x, y: at.y };
  let distance = Number.POSITIVE_INFINITY;
  graph.nodes.forEach((node, id) => {
    if (node.links.length === 0) return;
    for (const ox of offsets) {
      for (const oy of offsets) {
        const x = node.x + (tx + ox) * (tile ?? 0);
        const y = node.y + (ty + oy) * (tile ?? 0);
        const d = Math.hypot(x - at.x, y - at.y);
        if (d < distance) {
          best = { node: id, x, y };
          distance = d;
        }
      }
    }
  });
  return best;
}
