import { RetryableFetchError } from '#/lib/fetch-json';
import type { MapGraph, MapNode, Pt, Steer } from './map-graph';

/**
 * A real place's mini-map, drawn from OpenStreetMap data (© OpenStreetMap contributors, ODbL):
 * the streets, paths, buildings, parks and water around a point, in px around it. Overpass is
 * asked once; the result is kept in the browser source, so reloads and restarts don't ask again.
 */
export const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
/**
 * Public Overpass servers, tried in turn: the main one is often busy (504) at peak hours. Both
 * answer cross-origin requests; they turn away requests without a Referer, which browsers send.
 */
export const OVERPASS_URLS = [
  OVERPASS_URL,
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];
/** How far around the point the map reaches, in meters. */
export const MAP_RADIUS_M = 500;
/** px per meter: the mini-map shows about 300 m across. */
export const PX_PER_M = 0.9;
const MAP_RADIUS_PX = MAP_RADIUS_M * PX_PER_M;
// Past this share of the radius the walk turns back toward the middle, so the mini-map never
// runs off the edge of what was loaded.
const STAY_WITHIN = 0.55;
const CACHE_PREFIX = 'senchabot.irl-hud.osm:';
const CACHE_DAYS = 14;
const FETCH_TIMEOUT_MS = 40_000;
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
        nodes[from].links.push({ to, dx: 0, dy: 0, points });
        nodes[to].links.push({ to: from, dx: 0, dy: 0, points: [...points].reverse() });
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

/** Keeps the walk near the middle: past the limit, ways that head back in weigh more. */
export const stayNearMiddle: Steer = (from, direction) => {
  const distance = Math.hypot(from.x, from.y);
  if (distance < MAP_RADIUS_PX * STAY_WITHIN) return 1;
  const inward = -(from.x * direction.x + from.y * direction.y) / (distance || 1);
  return Math.max(0.05, inward + 1.05) ** 2;
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
      now - Number(saved.at) < CACHE_DAYS * 86_400_000
    )
      return { roads: saved.roads, areas: saved.areas };
  } catch {
    // Storage blocked or garbage: ask Overpass again.
  }
  return null;
}

function cacheMap(lat: number, lon: number, map: RealMap) {
  try {
    window.localStorage.setItem(cacheKey(lat, lon), JSON.stringify({ at: Date.now(), ...map }));
  } catch {
    // Storage full or blocked: the map still shows, it just gets asked for again next time.
  }
}

/** One Overpass server's answer, parsed; throws RetryableFetchError when it doesn't give one. */
async function askOverpass(url: string, query: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(`${url}?data=${encodeURIComponent(query)}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    throw new RetryableFetchError(`Overpass ${url}: ${error}`);
  }
  if (!response.ok) throw new RetryableFetchError(`Overpass ${url}: ${response.status}`);
  return response.json();
}

/** The map around (lat, lon), from the cache or Overpass. Throws RetryableFetchError to retry. */
export async function loadRealMap(lat: number, lon: number): Promise<RealMap> {
  const cached = readCachedMap(lat, lon);
  if (cached) return cached;
  const query = overpassQuery(lat, lon);
  let failure: unknown;
  for (const url of OVERPASS_URLS) {
    try {
      const map = parseOverpass(await askOverpass(url, query), lat, lon);
      cacheMap(lat, lon, map);
      return map;
    } catch (error) {
      failure = error;
    }
  }
  throw failure instanceof RetryableFetchError ? failure : new RetryableFetchError(String(failure));
}
