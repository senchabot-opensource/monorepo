import { describe, expect, it } from 'vitest';
import { seededRandom } from './map-graph';
import {
  clearWalk,
  createExitWalk,
  createRoomWalker,
  distanceTo,
  doorway,
  inside,
  MAX_ENTER_PX,
  nearestNode,
  nearestRoom,
  type Room,
  roomFor,
  roomZoom,
  standInRoom,
  stepExitWalk,
  stepRoomWalker,
  wallDistance,
} from './map-indoor';
import { cityTile, TILE } from './map-made-up';

const rect = (x: number, y: number, w: number, h: number): Room => [
  { x, y },
  { x: x + w, y },
  { x: x + w, y: y + h },
  { x, y: y + h },
];
// An L-shaped building: a walk that cuts its inner corner would leave it.
const L_SHAPE: Room = [
  { x: 0, y: 0 },
  { x: 60, y: 0 },
  { x: 60, y: 20 },
  { x: 20, y: 20 },
  { x: 20, y: 60 },
  { x: 0, y: 60 },
];

describe('room geometry', () => {
  it('tells inside from outside, and measures the way to the walls', () => {
    expect(inside({ x: 10, y: 50 }, L_SHAPE)).toBe(true);
    expect(inside({ x: 40, y: 40 }, L_SHAPE)).toBe(false);
    expect(distanceTo({ x: 10, y: 50 }, L_SHAPE)).toBe(0);
    expect(distanceTo({ x: 70, y: 10 }, L_SHAPE)).toBe(10);
    expect(wallDistance({ x: 10, y: 50 }, L_SHAPE)).toBe(10);
  });

  it('picks the building the arrow is in or nearest to, within reach', () => {
    const near = rect(30, 0, 20, 20);
    const far = rect(200, 0, 20, 20);
    expect(nearestRoom([far, near], { x: 0, y: 10 })).toBe(near);
    expect(nearestRoom([far, near], { x: 35, y: 5 })).toBe(near);
    expect(nearestRoom([far], { x: 0, y: 10 })).toBeNull();
    expect(nearestRoom([rect(MAX_ENTER_PX + 1, 0, 5, 5)], { x: 0, y: 0 })).toBeNull();
  });

  it('puts up a small stand-in building where there is none near', () => {
    const room = roomFor([], { x: 100, y: 50 });
    expect(room).toEqual(standInRoom({ x: 100, y: 50 }));
    expect(inside({ x: 100, y: 50 }, room)).toBe(true);
  });

  it('zooms in on small buildings, never out on big ones', () => {
    expect(roomZoom(rect(0, 0, 10, 10), 280)).toBe(5);
    expect(roomZoom(rect(0, 0, 60, 40), 280)).toBeCloseTo(2.14, 2);
    expect(roomZoom(rect(0, 0, 400, 300), 280)).toBe(1);
  });

  it('comes in just inside the wall nearest the arrow', () => {
    const room = rect(0, 0, 40, 40);
    const door = doorway(room, { x: -15, y: 20 });
    expect(inside(door, room)).toBe(true);
    expect(door.x).toBeLessThan(5);
    expect(door.y).toBeCloseTo(20, 0);
    // In an L-shaped one, never the middle of its box, which is outdoors.
    const corner = doorway(L_SHAPE, { x: 45, y: 45 });
    expect(inside(corner, L_SHAPE)).toBe(true);
    // Already well inside: it stays where it is.
    expect(doorway(room, { x: 20, y: 20 })).toEqual({ x: 20, y: 20 });
  });
});

describe('the walk inside', () => {
  it('only walks straight lines that stay inside', () => {
    expect(clearWalk({ x: 10, y: 10 }, { x: 50, y: 10 }, L_SHAPE)).toBe(true);
    expect(clearWalk({ x: 50, y: 10 }, { x: 10, y: 50 }, L_SHAPE)).toBe(false);
  });

  it('walks in from the street, then never leaves the walls', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const walker = createRoomWalker(L_SHAPE, { x: -12, y: 50, heading: 90 }, seededRandom(seed));
      let entered = false;
      let moved = 0;
      let last = { x: walker.x, y: walker.y };
      for (let frame = 0; frame < 3000; frame++) {
        const pose = stepRoomWalker(walker, 0.05, 20);
        moved += Math.hypot(pose.x - last.x, pose.y - last.y);
        last = pose;
        if (inside(pose, L_SHAPE)) entered = true;
        else expect(entered, `seed ${seed} left the room at ${pose.x}, ${pose.y}`).toBe(false);
      }
      expect(entered, `seed ${seed}`).toBe(true);
      // It walks around, with pauses, rather than standing at the door.
      expect(moved, `seed ${seed}`).toBeGreaterThan(300);
    }
  });

  it('stands still when the arrow is told to stay', () => {
    const walker = createRoomWalker(rect(0, 0, 40, 40), { x: 20, y: 20, heading: 0 });
    const pose = stepRoomWalker(walker, 1, 0);
    expect(pose).toEqual({ x: 20, y: 20, heading: 0 });
  });
});

describe('back outside', () => {
  it('finds the street junction nearest the arrow, across a tile edge too', () => {
    const { graph } = cityTile(42);
    // Every made-up city has a junction at the tile's corner, so just past it is nearest there.
    expect(nearestNode(graph, { x: TILE + 1, y: 2 })).toMatchObject({ x: TILE, y: 0 });
    expect(nearestNode(graph, { x: -1, y: -2 })).toMatchObject({ x: 0, y: 0 });
  });

  it('walks out to that junction, then is done', () => {
    const walk = createExitWalk({ x: 0, y: 0, heading: 0 }, { x: 30, y: 40 });
    expect(stepExitWalk(walk, 1, 20).done).toBe(false);
    const { pose, done } = stepExitWalk(walk, 2, 20);
    expect(done).toBe(true);
    expect(pose).toMatchObject({ x: 30, y: 40 });
    // Standing still, it waits there instead.
    expect(stepExitWalk(createExitWalk(pose, { x: 0, y: 0 }), 1, 0).done).toBe(false);
  });
});
