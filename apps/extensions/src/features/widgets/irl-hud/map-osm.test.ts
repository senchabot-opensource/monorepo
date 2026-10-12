import { afterEach, describe, expect, it, vi } from 'vitest';
import { RetryableFetchError } from '#/lib/fetch-json';
import {
  cacheKey,
  loadRealMap,
  MAP_RADIUS_M,
  OVERPASS_URL,
  OVERPASS_URLS,
  overpassQuery,
  PX_PER_M,
  parseOverpass,
  readCachedMap,
  realGraph,
  stayNearMiddle,
} from './map-osm';

const LAT = 41;
const LON = 29;
// About 1 m north and east at this latitude.
const M_LAT = 1 / 110_540;
const M_LON = 1 / (111_320 * Math.cos((LAT * Math.PI) / 180));
const at = (eastM: number, northM: number) => ({
  lat: LAT + northM * M_LAT,
  lon: LON + eastM * M_LON,
});
const way = (tags: Record<string, string>, ...points: [number, number][]) => ({
  type: 'way',
  tags,
  geometry: points.map(([east, north]) => at(east, north)),
});

// A crossing of two streets, a footpath off one of them, a motorway, a building, a park and a
// pond, plus things that are skipped.
const OVERPASS = {
  elements: [
    way({ highway: 'residential' }, [-100, 0], [0, 0], [100, 0]),
    way({ highway: 'primary' }, [0, -100], [0, 0], [0, 100]),
    way({ highway: 'footway' }, [100, 0], [150, 50]),
    way({ highway: 'motorway' }, [-100, 200], [100, 200]),
    way({ highway: 'construction' }, [0, 300], [10, 300]),
    way({ highway: 'service', tunnel: 'yes' }, [0, 400], [10, 400]),
    way({ building: 'yes' }, [10, 10], [30, 10], [30, 30], [10, 10]),
    way({ leisure: 'park' }, [-60, -60], [-20, -60], [-20, -20], [-60, -60]),
    way({ natural: 'water' }, [50, -50], [70, -50], [70, -30], [50, -50]),
    way({ building: 'yes' }, [0, 0], [5, 5]),
    { type: 'node', lat: LAT, lon: LON },
  ],
};

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('overpassQuery', () => {
  it('asks for ways with their geometry around the point', () => {
    const query = overpassQuery(LAT, LON);
    expect(query).toContain(`way["highway"](around:${MAP_RADIUS_M},${LAT},${LON})`);
    expect(query).toContain('way["building"]');
    expect(query).toMatch(/out geom;$/);
  });
});

describe('parseOverpass', () => {
  const map = parseOverpass(OVERPASS, LAT, LON);

  it('puts north up, in px around the point', () => {
    const [street] = map.roads;
    expect(street.pts[0]).toBeCloseTo(-100 * PX_PER_M, 0);
    expect(street.pts[1]).toBeCloseTo(0, 0);
    const primary = map.roads[1];
    // 100 m south is down the screen.
    expect(primary.pts[1]).toBeCloseTo(100 * PX_PER_M, 0);
  });

  it('sorts roads by size and keeps motorways off the walk', () => {
    expect(map.roads.map((road) => [road.cls, road.walk])).toEqual([
      ['minor', true],
      ['major', true],
      ['path', true],
      ['major', false],
    ]);
  });

  it('keeps closed buildings, parks and water, and nothing open', () => {
    expect(map.areas.map((area) => area.kind)).toEqual(['building', 'park', 'water']);
  });

  it('reads an empty or broken answer as an empty map', () => {
    expect(parseOverpass(null, LAT, LON)).toEqual({ roads: [], areas: [] });
    expect(parseOverpass({ elements: 'x' }, LAT, LON)).toEqual({ roads: [], areas: [] });
  });
});

describe('realGraph', () => {
  it('makes junctions where roads meet or end, and starts at the one in the middle', () => {
    const { graph, start } = realGraph(parseOverpass(OVERPASS, LAT, LON));
    const middle = graph.nodes[start];
    expect(Math.hypot(middle.x, middle.y)).toBeLessThan(1);
    // The crossing joins four street ends.
    expect(middle.links).toHaveLength(4);
    // The footway hangs off the east end; the motorway is nowhere.
    const east = graph.nodes.find(
      (node) => Math.abs(node.x - 100 * PX_PER_M) < 1 && Math.abs(node.y) < 1,
    );
    expect(east?.links).toHaveLength(2);
    expect(graph.nodes.some((node) => Math.abs(node.y + 200 * PX_PER_M) < 1)).toBe(false);
  });

  it('has nowhere to start without walkable roads', () => {
    expect(realGraph({ roads: [], areas: [] }).start).toBe(-1);
  });
});

describe('stayNearMiddle', () => {
  it('lets the walk go anywhere near the middle and pulls it back from the edge', () => {
    expect(stayNearMiddle({ x: 10, y: 0 }, { x: 1, y: 0 })).toBe(1);
    const edge = { x: MAP_RADIUS_M * PX_PER_M * 0.8, y: 0 };
    expect(stayNearMiddle(edge, { x: -1, y: 0 })).toBeGreaterThan(
      stayNearMiddle(edge, { x: 1, y: 0 }) * 10,
    );
  });
});

describe('loadRealMap', () => {
  it('asks Overpass once, then reads the saved map', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(OVERPASS)));
    vi.stubGlobal('fetch', fetchMock);
    const first = await loadRealMap(LAT, LON);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain(`${OVERPASS_URL}?data=`);
    expect(first.roads).toHaveLength(4);
    expect(readCachedMap(LAT, LON)).toEqual(first);
    await loadRealMap(LAT, LON);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('asks again once the saved map is two weeks old', () => {
    localStorage.setItem(cacheKey(LAT, LON), JSON.stringify({ at: 0, roads: [], areas: [] }));
    expect(readCachedMap(LAT, LON, 15 * 86_400_000)).toBeNull();
    expect(readCachedMap(LAT, LON, 13 * 86_400_000)).toEqual({ roads: [], areas: [] });
  });

  it('asks the next server when the first one is busy', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 504 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(OVERPASS)));
    vi.stubGlobal('fetch', fetchMock);
    expect((await loadRealMap(LAT, LON)).roads).toHaveLength(4);
    expect(String(fetchMock.mock.calls[1][0])).toContain(OVERPASS_URLS[1]);
  });

  it('retries when Overpass is busy or the network is down', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 429 })));
    await expect(loadRealMap(LAT, LON)).rejects.toBeInstanceOf(RetryableFetchError);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    await expect(loadRealMap(LAT, LON)).rejects.toBeInstanceOf(RetryableFetchError);
  });
});
