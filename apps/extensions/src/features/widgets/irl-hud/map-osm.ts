import { RetryableFetchError } from '#/lib/fetch-json';
import type { MapGraph, MapNode, Pt, Steer } from './map-graph';

/**
 * A real place's mini-map, drawn from OpenStreetMap data (© OpenStreetMap contributors, ODbL):
 * the streets, paths, buildings, parks and water around a point, in px around it. Overpass is
 * asked once; the result is kept in the browser source, so reloads and restarts don't ask again.
 */
export const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
/**
 * Public Overpass servers, asked in turn: the main one is often busy (504) at peak hours. Both
 * answer cross-origin requests; they turn away requests without a Referer, which browsers send.
 */
export const OVERPASS_URLS = [
  OVERPASS_URL,
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];
/** How far around the point the map reaches, in meters. */
export const MAP_RADIUS_M = 350;
/** px per meter: the mini-map shows about 175 m across, close enough to follow a park's paths. */
export const PX_PER_M = 1.6;
// Past this distance from the place the walk turns back toward it, so the place stays on the
// mini-map (and the mini-map never runs off the edge of what was loaded).
const STAY_WITHIN_M = 140;
const STAY_WITHIN_PX = STAY_WITHIN_M * PX_PER_M;
// The walk keeps to footpaths where it can, like someone strolling a park, and shies from big
// roads.
const ROAD_PREFERENCE: Record<RoadClass, number> = { path: 2.5, minor: 1, major: 0.4 };
// osm2: maps saved since the zoom-in; older entries were drawn at another scale.
const CACHE_PREFIX = 'senchabot.irl-hud.osm2:';
const OLD_CACHE_PREFIX = 'senchabot.irl-hud.osm:';
const CACHE_DAYS = 14;
const CACHE_MS = CACHE_DAYS * 86_400_000;
// The main server has taken 47 s for a city center at a busy hour; past this a request counts as
// failed.
const FETCH_TIMEOUT_MS = 60_000;
/**
 * How long a server gets before the next one is asked too, for the place on screen. Overpass
 * answers within a few seconds, or when busy not for half a minute: the map then comes from
 * whichever server answers first.
 */
export const NEXT_SERVER_MS = 6000;
/**
 * The pause before a background load, after the last load ended. Overpass gives each IP only a
 * couple of queries at once, and a dropped request keeps running there, so places loaded back to
 * back would get the place on screen turned away (429).
 */
export const PREFETCH_PAUSE_MS = 30_000;
// A dense city center has thousands; past this the mini-map is a solid grey block anyway.
const MAX_BUILDINGS = 4000;

export type RoadClass = 'major' | 'minor' | 'path';
export type AreaKind = 'building' | 'park' | 'water';

export interface RealRoad {
  cls: RoadClass;
  /** Whether a person may walk it: not a motorway or a trunk road. */
  walk: boolean;
  /** x, y, x, y… in px, rounded to 0.1. */
  pts: number[];
}
export interface RealArea {
  kind: AreaKind;
  pts: number[];
}
export interface RealMap {
  roads: RealRoad[];
  areas: RealArea[];
}

const MAJOR = new Set([
  'motorway',
  'trunk',
  'primary',
  'secondary',
  'motorway_link',
  'trunk_link',
  'primary_link',
  'secondary_link',
]);
const NOT_WALKABLE = new Set(['motorway', 'trunk', 'motorway_link', 'trunk_link']);
const PATHS = new Set([
  'footway',
  'path',
  'pedestrian',
  'steps',
  'cycleway',
  'track',
  'bridleway',
  'corridor',
]);
const SKIPPED = new Set([
  'proposed',
  'construction',
  'raceway',
  'bus_guideway',
  'platform',
  'elevator',
]);
const PARK_LEISURE = new Set(['park', 'garden', 'playground', 'pitch', 'dog_park']);
const PARK_LANDUSE = new Set([
  'grass',
  'meadow',
  'recreation_ground',
  'village_green',
  'forest',
  'cemetery',
]);

/** The Overpass query: ways with their geometry, within the radius of the point. */
export function overpassQuery(lat: number, lon: number): string {
  const around = `(around:${MAP_RADIUS_M},${lat},${lon})`;
  return `[out:json][timeout:30];(way["highway"]${around};way["building"]${around};way["leisure"~"^(park|garden|playground|pitch|dog_park)$"]${around};way["landuse"~"^(grass|meadow|recreation_ground|village_green|forest|cemetery|reservoir|basin)$"]${around};way["natural"~"^(water|wood)$"]${around};way["waterway"="riverbank"]${around};);out geom;`;
}

interface OverpassWay {
  type: string;
  tags?: Record<string, string>;
  geometry?: { lat: number; lon: number }[];
}

// `|| 0` turns -0 into 0, which is what it is once saved as JSON anyway.
const round = (n: number) => Math.round(n * 10) / 10 || 0;

/** Overpass ways as roads and areas, in px around (lat, lon) with north up. */
export function parseOverpass(data: unknown, lat: number, lon: number): RealMap {
  const elements = (data as { elements?: OverpassWay[] })?.elements ?? [];
  const metersPerLon = 111_320 * Math.cos((lat * Math.PI) / 180);
  const project = (geometry: { lat: number; lon: number }[]) =>
    geometry.flatMap((g) => [
      round((g.lon - lon) * metersPerLon * PX_PER_M),
      round(-(g.lat - lat) * 110_540 * PX_PER_M),
    ]);
  const roads: RealRoad[] = [];
  const areas: RealArea[] = [];
  let buildings = 0;
  for (const way of elements) {
    const tags = way.tags ?? {};
    const geometry = way.geometry ?? [];
    if (way.type !== 'way' || geometry.length < 2) continue;
    const first = geometry[0];
    const last = geometry[geometry.length - 1];
    const closed = geometry.length > 3 && first.lat === last.lat && first.lon === last.lon;
    const highway = tags.highway;
    if (highway) {
      if (SKIPPED.has(highway) || tags.tunnel === 'yes' || tags.area === 'yes') continue;
      const cls: RoadClass = MAJOR.has(highway) ? 'major' : PATHS.has(highway) ? 'path' : 'minor';
      roads.push({ cls, walk: !NOT_WALKABLE.has(highway), pts: project(geometry) });
      continue;
    }
    if (!closed) continue;
    let kind: AreaKind | null = null;
    if (tags.building) kind = 'building';
    else if (
      tags.natural === 'water' ||
      tags.waterway === 'riverbank' ||
      tags.landuse === 'reservoir' ||
      tags.landuse === 'basin'
    )
      kind = 'water';
    else if (
      PARK_LEISURE.has(tags.leisure ?? '') ||
      PARK_LANDUSE.has(tags.landuse ?? '') ||
      tags.natural === 'wood'
    )
      kind = 'park';
    if (!kind || (kind === 'building' && ++buildings > MAX_BUILDINGS)) continue;
    areas.push({ kind, pts: project(geometry) });
  }
  return { roads, areas };
}

/**
 * The walkable roads as a graph: a junction wherever a road ends or roads meet (OpenStreetMap
 * roads share their junction points, so they meet at the very same coordinates).
 */
export function realGraph(map: RealMap): { graph: MapGraph; start: number } {
  const walkable = map.roads.filter((road) => road.walk && road.pts.length >= 4);
  const key = (x: number, y: number) => `${x},${y}`;
  const uses = new Map<string, number>();
  for (const road of walkable) {
    for (let k = 0; k < road.pts.length; k += 2) {
      const at = key(road.pts[k], road.pts[k + 1]);
      const ends = k === 0 || k === road.pts.length - 2;
      uses.set(at, (uses.get(at) ?? 0) + (ends ? 2 : 1));
    }
  }
  const nodes: MapNode[] = [];
  const ids = new Map<string, number>();
  const nodeAt = (x: number, y: number) => {
    const at = key(x, y);
    let id = ids.get(at);
    if (id === undefined) {
      id = nodes.length;
      ids.set(at, id);
      nodes.push({ x, y, links: [] });
    }
    return id;
  };
  for (const road of walkable) {
    let from = nodeAt(road.pts[0], road.pts[1]);
    let points: Pt[] = [{ x: road.pts[0], y: road.pts[1] }];
    for (let k = 2; k < road.pts.length; k += 2) {
      const x = road.pts[k];
      const y = road.pts[k + 1];
      points.push({ x, y });
      const end = k === road.pts.length - 2;
      if (!end && (uses.get(key(x, y)) ?? 0) < 2) continue;
      const to = nodeAt(x, y);
      if (points.length >= 2 && to !== from) {
        const weight = ROAD_PREFERENCE[road.cls];
        nodes[from].links.push({ to, dx: 0, dy: 0, points, weight });
        nodes[to].links.push({ to: from, dx: 0, dy: 0, points: [...points].reverse(), weight });
      }
      from = to;
      points = [{ x, y }];
    }
  }
  // Start in the biggest connected network, at its junction nearest the middle, so the walk
  // doesn't get stuck on a lone footpath.
  const component = new Array<number>(nodes.length).fill(-1);
  const sizes: number[] = [];
  nodes.forEach((_, startId) => {
    if (component[startId] !== -1) return;
    const id = sizes.length;
    const stack = [startId];
    component[startId] = id;
    let size = 0;
    while (stack.length > 0) {
      const current = stack.pop() as number;
      size++;
      for (const link of nodes[current].links) {
        if (component[link.to] === -1) {
          component[link.to] = id;
          stack.push(link.to);
        }
      }
    }
    sizes.push(size);
  });
  const biggest = sizes.indexOf(Math.max(...sizes));
  let start = -1;
  let best = Number.POSITIVE_INFINITY;
  nodes.forEach((node, id) => {
    const distance = Math.hypot(node.x, node.y);
    if (component[id] === biggest && node.links.length > 0 && distance < best) {
      best = distance;
      start = id;
    }
  });
  return { graph: { nodes, tile: null }, start };
}

/**
 * Keeps the walk near the place: a way that ends within the limit, or closer in than here, is
 * fine; past the limit, ways that end farther out are all but closed. Judged by where a way ends,
 * as a winding park path's first step says little about where it goes.
 */
export const stayNearMiddle: Steer = (from, to) => {
  const end = Math.hypot(to.x, to.y);
  if (end <= STAY_WITHIN_PX || end < Math.hypot(from.x, from.y)) return 1;
  return 0.02;
};

/** Storage key per point, rounded like the URL keeps it. */
export const cacheKey = (lat: number, lon: number) => `${CACHE_PREFIX}${lat},${lon}`;

export function readCachedMap(lat: number, lon: number, now = Date.now()): RealMap | null {
  try {
    const saved = JSON.parse(window.localStorage.getItem(cacheKey(lat, lon)) ?? 'null');
    if (
      saved &&
      Array.isArray(saved.roads) &&
      Array.isArray(saved.areas) &&
      now - Number(saved.at) < CACHE_MS
    )
      return { roads: saved.roads, areas: saved.areas };
  } catch {
    // Storage blocked or garbage: ask Overpass again.
  }
  return null;
}

/**
 * Drops the maps no load will read again: the first format's, and any older than CACHE_DAYS. A
 * streamer on the road saves new places for months, and a full storage would save none.
 */
export function pruneCachedMaps(now = Date.now()) {
  try {
    const storage = window.localStorage;
    for (let i = storage.length - 1; i >= 0; i--) {
      const key = storage.key(i);
      if (!key) continue;
      if (key.startsWith(OLD_CACHE_PREFIX)) {
        storage.removeItem(key);
      } else if (key.startsWith(CACHE_PREFIX)) {
        // Saved as {"at":…, so the time is read without parsing the whole map.
        const at = Number(/^\{"at":(\d+)/.exec(storage.getItem(key) ?? '')?.[1]);
        if (!(now - at < CACHE_MS)) storage.removeItem(key);
      }
    }
  } catch {
    // Storage blocked: nothing to tidy.
  }
}

let pruned = false;

function cacheMap(lat: number, lon: number, map: RealMap) {
  if (!pruned) {
    pruned = true;
    pruneCachedMaps();
  }
  try {
    window.localStorage.setItem(cacheKey(lat, lon), JSON.stringify({ at: Date.now(), ...map }));
  } catch {
    // Storage full or blocked: the map still shows, it just gets asked for again next time.
  }
}

/**
 * One Overpass server's answer, parsed; throws RetryableFetchError when it doesn't give one.
 * `stop` drops the request once another server has answered.
 */
async function askOverpass(url: string, query: string, stop: AbortSignal): Promise<unknown> {
  // Not AbortSignal.any, which OBS 30's Chromium 103 doesn't have.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const drop = () => controller.abort();
  stop.addEventListener('abort', drop);
  try {
    let response: Response;
    try {
      response = await fetch(`${url}?data=${encodeURIComponent(query)}`, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
    } catch (error) {
      throw new RetryableFetchError(`Overpass ${url}: ${error}`);
    }
    if (!response.ok) throw new RetryableFetchError(`Overpass ${url}: ${response.status}`);
    const data = await response.json();
    // A query that ran out of time or memory still answers 200, with what it found so far and a
    // remark. Saved, part of a map would stand for two weeks, so it counts as no answer.
    const remark = (data as { remark?: unknown } | null)?.remark;
    if (typeof remark === 'string' && /runtime error/i.test(remark)) {
      throw new RetryableFetchError(`Overpass ${url}: ${remark}`);
    }
    return data;
  } finally {
    clearTimeout(timer);
    stop.removeEventListener('abort', drop);
  }
}

interface Asking {
  answer: Promise<unknown>;
  /** Asks the next server now, for a background load whose place came on screen. */
  hurry: () => void;
}

/**
 * The first answer from the Overpass servers. Each is asked as soon as the one before fails, and
 * for the place on screen also once it has had NEXT_SERVER_MS; the others are dropped once one
 * answers. A background load asks one server at a time, so it never takes two of the IP's slots.
 */
function askServers(query: string, background: boolean): Asking {
  let hurry = () => {};
  const answer = new Promise((resolve, reject) => {
    const done = new AbortController();
    let asked = 0;
    let failed = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const askNext = () => {
      clearTimeout(timer);
      if (done.signal.aborted || asked === OVERPASS_URLS.length) return;
      const url = OVERPASS_URLS[asked++];
      if (!background && asked < OVERPASS_URLS.length) timer = setTimeout(askNext, NEXT_SERVER_MS);
      askOverpass(url, query, done.signal).then(
        (data) => {
          if (done.signal.aborted) return;
          clearTimeout(timer);
          done.abort();
          resolve(data);
        },
        (error) => {
          if (done.signal.aborted) return;
          if (++failed < OVERPASS_URLS.length) {
            askNext();
            return;
          }
          done.abort();
          reject(
            error instanceof RetryableFetchError ? error : new RetryableFetchError(String(error)),
          );
        },
      );
    };
    hurry = () => {
      if (asked > 0) askNext();
    };
    askNext();
  });
  return { answer, hurry: () => hurry() };
}

// Places on their way from Overpass, so the radar and a prefetch of the same place ask once.
const loading = new Map<
  string,
  { map: Promise<RealMap>; hurry: () => void; background: boolean }
>();
// When the last load ended, so background loads keep their distance from it.
let lastLoadAt = Number.NEGATIVE_INFINITY;

/**
 * The map around (lat, lon), from the cache or Overpass. Throws RetryableFetchError to retry.
 * `background` loads it for later: one server at a time, never two at once.
 */
export function loadRealMap(lat: number, lon: number, background = false): Promise<RealMap> {
  const cached = readCachedMap(lat, lon);
  if (cached) return Promise.resolve(cached);
  const key = cacheKey(lat, lon);
  const asked = loading.get(key);
  if (asked) {
    // Loading in the background and now on screen: the next server is asked at once.
    if (!background && asked.background) {
      asked.background = false;
      asked.hurry();
    }
    return asked.map;
  }
  const { answer, hurry } = askServers(overpassQuery(lat, lon), background);
  const map = answer
    .then((data) => {
      const parsed = parseOverpass(data, lat, lon);
      cacheMap(lat, lon, parsed);
      return parsed;
    })
    .finally(() => {
      loading.delete(key);
      lastLoadAt = Date.now();
    });
  loading.set(key, { map, hurry, background });
  return map;
}

/** Resolves after `ms`, or as soon as `stop` aborts. */
const pause = (ms: number, stop: AbortSignal) =>
  new Promise<void>((resolve) => {
    const end = () => {
      clearTimeout(timer);
      stop.removeEventListener('abort', end);
      resolve();
    };
    const timer = setTimeout(end, ms);
    stop.addEventListener('abort', end);
    if (stop.aborted) end();
  });

/** Waits until no place is loading, and none has for PREFETCH_PAUSE_MS. */
async function waitForQuiet(stop: AbortSignal) {
  while (!stop.aborted) {
    if (loading.size > 0) {
      await Promise.allSettled([...loading.values()].map((entry) => entry.map));
      continue;
    }
    const now = Date.now();
    // A clock set back can't hold the loads off for longer than the pause.
    if (lastLoadAt > now) lastLoadAt = now;
    const wait = lastLoadAt + PREFETCH_PAUSE_MS - now;
    if (wait <= 0) return;
    await pause(wait, stop);
  }
}

/**
 * Loads the saved places' maps one after another, so a mod's !hud map switch shows its place
 * at once. The place on screen comes first; each of the others waits until nothing has loaded for
 * PREFETCH_PAUSE_MS, and asks one server at a time. Only what isn't saved yet is asked for; the
 * first refusal ends it, and so does `stop`.
 */
export async function prefetchRealMaps(
  places: readonly { lat: number; lon: number }[],
  stop: AbortSignal,
): Promise<void> {
  for (const place of places) {
    if (stop.aborted) return;
    if (readCachedMap(place.lat, place.lon)) continue;
    // The place on screen is on its way already; the others wait their turn.
    if (!loading.has(cacheKey(place.lat, place.lon))) {
      await waitForQuiet(stop);
      if (stop.aborted) return;
      if (readCachedMap(place.lat, place.lon)) continue;
    }
    try {
      await loadRealMap(place.lat, place.lon, true);
    } catch {
      // Overpass is busy: the place loads when it's shown, with its retries.
      return;
    }
  }
}
