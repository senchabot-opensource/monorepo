import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RetryableFetchError } from '#/lib/fetch-json';
import { createWalker, seededRandom, stepWalker } from './map-graph';
import {
  cacheKey,
  loadRealMap,
  MAP_RADIUS_M,
  NEXT_SERVER_MS,
  OVERPASS_URL,
  OVERPASS_URLS,
  overpassQuery,
  PREFETCH_PAUSE_MS,
  PX_PER_M,
  parseOverpass,
  prefetchRealMaps,
  pruneCachedMaps,
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

  it('likes footpaths best and big roads least', () => {
    const { graph, start } = realGraph(parseOverpass(OVERPASS, LAT, LON));
    const east = graph.nodes.find(
      (node) => Math.abs(node.x - 100 * PX_PER_M) < 1 && Math.abs(node.y) < 1,
    );
    const weights = east?.links.map((link) => link.weight).sort();
    // From the east end: back along the street (1) or on along the footway (2.5).
    expect(weights).toEqual([1, 2.5]);
    const crossing = graph.nodes[start].links.map((link) => link.weight).sort();
    expect(crossing).toEqual([0.4, 0.4, 1, 1]);
  });

  it('has nowhere to start without walkable roads', () => {
    expect(realGraph({ roads: [], areas: [] }).start).toBe(-1);
  });
});

describe('stayNearMiddle', () => {
  it('lets the walk go anywhere near the place, and back in, but hardly further out', () => {
    const m = (meters: number) => meters * PX_PER_M;
    expect(stayNearMiddle({ x: m(10), y: 0 }, { x: m(100), y: 0 })).toBe(1);
    expect(stayNearMiddle({ x: m(200), y: 0 }, { x: m(180), y: 0 })).toBe(1);
    expect(stayNearMiddle({ x: m(120), y: 0 }, { x: m(0), y: m(-200) })).toBeLessThan(0.1);
    expect(stayNearMiddle({ x: m(200), y: 0 }, { x: m(250), y: 0 })).toBeLessThan(0.1);
  });

  it('keeps a long walk near the place on a real map', () => {
    // A grid of streets 60 m apart, 600 m wide: plenty of ways to wander off.
    const step = 60;
    const lines = Array.from({ length: 11 }, (_, i) => (i - 5) * step);
    const elements = lines.flatMap((at) => [
      way({ highway: 'residential' }, ...lines.map((x): [number, number] => [x, at])),
      way({ highway: 'residential' }, ...lines.map((y): [number, number] => [at, y])),
    ]);
    const { graph, start } = realGraph(parseOverpass({ elements }, LAT, LON));
    const walker = createWalker(graph, start, seededRandom(3), stayNearMiddle);
    if (!walker) throw new Error('no walker');
    let farthest = 0;
    for (let frame = 0; frame < 30 * 600; frame++) {
      const pose = stepWalker(walker, 1 / 30, 14);
      farthest = Math.max(farthest, Math.hypot(pose.x, pose.y));
    }
    // 10 minutes of walking stays within the limit plus one block.
    expect(farthest / PX_PER_M).toBeLessThan(140 + step * 1.5);
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

  it('takes an answer a server error cut short for none, and saves no part of a map', async () => {
    const cut = new Response(
      JSON.stringify({
        remark: 'runtime error: Query timed out in "query" at line 1 after 31 seconds.',
        elements: [OVERPASS.elements[0]],
      }),
    );
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(cut)
      .mockResolvedValueOnce(new Response(JSON.stringify(OVERPASS)));
    vi.stubGlobal('fetch', fetchMock);
    expect((await loadRealMap(LAT, LON)).roads).toHaveLength(4);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    localStorage.clear();
    const timedOut = { remark: 'runtime error: Query run out of memory.', elements: [] };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => new Response(JSON.stringify(timedOut))),
    );
    await expect(loadRealMap(LAT, LON)).rejects.toBeInstanceOf(RetryableFetchError);
    expect(readCachedMap(LAT, LON)).toBeNull();
  });
});

describe('loadRealMap from a slow server', () => {
  it('asks the next server too when the first is slow, takes its answer and drops the other', async () => {
    vi.useFakeTimers();
    try {
      const signals: AbortSignal[] = [];
      const fetchMock = vi.fn((url: string, init: RequestInit) => {
        if (init.signal) signals.push(init.signal);
        // The main server never answers; the next one does.
        return url.startsWith(OVERPASS_URLS[0])
          ? new Promise<Response>(() => {})
          : Promise.resolve(new Response(JSON.stringify(OVERPASS)));
      });
      vi.stubGlobal('fetch', fetchMock);
      const loading = loadRealMap(LAT, LON);
      await vi.advanceTimersByTimeAsync(NEXT_SERVER_MS - 1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      await vi.advanceTimersByTimeAsync(1);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect((await loading).roads).toHaveLength(4);
      expect(signals[0].aborted).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('asks for a place once while it loads', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(OVERPASS)));
    vi.stubGlobal('fetch', fetchMock);
    const [first, second] = await Promise.all([loadRealMap(LAT, LON), loadRealMap(LAT, LON)]);
    expect(second).toBe(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('asks one server at a time in the background, and the next at once when the place shows', async () => {
    vi.useFakeTimers();
    try {
      const fetchMock = vi.fn((url: string) =>
        url.startsWith(OVERPASS_URLS[0])
          ? new Promise<Response>(() => {})
          : Promise.resolve(new Response(JSON.stringify(OVERPASS))),
      );
      vi.stubGlobal('fetch', fetchMock);
      const background = loadRealMap(LAT, LON, true);
      await vi.advanceTimersByTimeAsync(NEXT_SERVER_MS * 3);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const shown = loadRealMap(LAT, LON);
      expect(shown).toBe(background);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect((await shown).roads).toHaveLength(4);
    } finally {
      vi.useRealTimers();
    }
  });

  it('gives a slow server up to a minute', async () => {
    vi.useFakeTimers();
    try {
      const fetchMock = vi.fn(
        (_url: string, init: RequestInit) =>
          new Promise<Response>((resolve, reject) => {
            const timer = setTimeout(() => resolve(new Response(JSON.stringify(OVERPASS))), 50_000);
            init.signal?.addEventListener('abort', () => {
              clearTimeout(timer);
              reject(new DOMException('Dropped', 'AbortError'));
            });
          }),
      );
      vi.stubGlobal('fetch', fetchMock);
      const map = loadRealMap(LAT, LON, true);
      await vi.advanceTimersByTimeAsync(50_000);
      expect((await map).roads).toHaveLength(4);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('prefetchRealMaps', () => {
  /** The latitudes Overpass was asked about, in order. */
  const askedAbout = (fetchMock: ReturnType<typeof vi.fn>) =>
    fetchMock.mock.calls.map(([url]) =>
      Number(/around:\d+,([\d.]+),/.exec(decodeURIComponent(String(url)))?.[1]),
    );

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('loads the places not saved yet one at a time, a pause apart, and stops once Overpass refuses', async () => {
    localStorage.setItem(
      cacheKey(51, 10),
      JSON.stringify({ at: Date.now(), roads: [], areas: [] }),
    );
    const fetchMock = vi.fn((url: string) =>
      Promise.resolve(
        decodeURIComponent(url).includes(',52,')
          ? new Response('', { status: 429 })
          : new Response(JSON.stringify({ elements: [] })),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);
    const places = [50, 51, 52, 53].map((lat) => ({ lat, lon: 10 }));
    const done = prefetchRealMaps(places, new AbortController().signal);
    await vi.advanceTimersByTimeAsync(PREFETCH_PAUSE_MS);
    expect(askedAbout(fetchMock)).toEqual([50]);
    // 51 was saved; 52 waits a pause after 50, then both servers turn it away, one after the
    // other, so 53 waits for its turn on screen.
    await vi.advanceTimersByTimeAsync(PREFETCH_PAUSE_MS - 1);
    expect(askedAbout(fetchMock)).toEqual([50]);
    await vi.advanceTimersByTimeAsync(1);
    await done;
    expect(askedAbout(fetchMock)).toEqual([50, 52, 52]);
    expect(readCachedMap(50, 10)).not.toBeNull();
    expect(readCachedMap(53, 10)).toBeNull();
  });

  it('waits for the place on screen, and asks nothing while another place loads', async () => {
    let answer = (_: Response) => {};
    const fetchMock = vi.fn(
      (url: string) =>
        new Promise<Response>((resolve) => {
          if (decodeURIComponent(url).includes(',70,')) answer = resolve;
          else resolve(new Response(JSON.stringify({ elements: [] })));
        }),
    );
    vi.stubGlobal('fetch', fetchMock);
    // On screen, from the radar.
    const shown = loadRealMap(70, 10);
    const done = prefetchRealMaps(
      [70, 71].map((lat) => ({ lat, lon: 10 })),
      new AbortController().signal,
    );
    await vi.advanceTimersByTimeAsync(PREFETCH_PAUSE_MS * 3);
    // The place on screen hasn't answered yet: nothing else is asked meanwhile.
    expect(askedAbout(fetchMock)).toEqual([70, 70]);
    answer(new Response(JSON.stringify({ elements: [] })));
    await shown;
    await vi.advanceTimersByTimeAsync(PREFETCH_PAUSE_MS);
    await done;
    expect(askedAbout(fetchMock)).toEqual([70, 70, 71]);
  });

  it('asks nothing once stopped', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const stop = new AbortController();
    stop.abort();
    await prefetchRealMaps([{ lat: 60, lon: 10 }], stop.signal);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('pruneCachedMaps', () => {
  it("drops the first format's maps and those past two weeks, and keeps the rest", () => {
    const day = 86_400_000;
    const now = 100 * day;
    localStorage.setItem('senchabot.irl-hud.osm:1,2', JSON.stringify({ at: now, roads: [] }));
    localStorage.setItem(cacheKey(1, 2), JSON.stringify({ at: now - 15 * day, roads: [] }));
    localStorage.setItem(cacheKey(3, 4), JSON.stringify({ at: now - day, roads: [], areas: [] }));
    localStorage.setItem(cacheKey(5, 6), 'garbage');
    localStorage.setItem('senchabot.queue:a:', '{}');
    pruneCachedMaps(now);
    const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i));
    expect(keys.sort()).toEqual([cacheKey(3, 4), 'senchabot.queue:a:']);
  });
});
