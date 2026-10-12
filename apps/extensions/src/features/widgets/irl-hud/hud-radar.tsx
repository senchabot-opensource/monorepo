import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { RetryableFetchError } from '#/lib/fetch-json';
import type { HudMap, HudStyle } from '#/lib/irl-hud-url';
import { createWalker, type MapGraph, type Pt, type Steer, stepWalker } from './map-graph';
import { cityTile, parkTile, TILE } from './map-made-up';
import { loadRealMap, type RealMap, realGraph, stayNearMiddle } from './map-osm';

/** The mini-map's width at 100% on a 1080p scene. */
export const RADAR_SIZE = 280;
// A real place's art reaches past its 450 px radius where roads run on; this box holds it all.
const REAL_BOX = 1200;

interface Palette {
  /** Street color, and the ground of the made-up city between its blocks. */
  road: string;
  /** The ground of a real place, under its buildings. */
  land: string;
  building: string;
  path: string;
  park: string;
  lawn: string;
  tree: string;
  water: string;
}

interface RadarLook {
  palette: Palette;
  /** Corner radius: a round map or a rounded square. */
  radius: string;
  border: string;
}

const LOOKS: Record<HudStyle, RadarLook> = {
  retro: {
    palette: {
      road: '#8d969c',
      land: '#2c363b',
      building: '#3b474d',
      path: '#c4b48a',
      park: '#3e6a39',
      lawn: '#46743c',
      tree: '#2a5226',
      water: '#2f5e86',
    },
    radius: '50%',
    border: '0 0 0 3px #8d969c, 0 0 0 9px #000',
  },
  modern: {
    palette: {
      road: '#5d6b77',
      land: '#141d25',
      building: '#1d2832',
      path: '#8a8166',
      park: '#25503a',
      lawn: '#2a5a3b',
      tree: '#173b26',
      water: '#1b4a73',
    },
    radius: '22px',
    border: '0 0 0 2px rgba(255,255,255,.35), 0 6px 18px rgba(0,0,0,.55)',
  },
};

export const RADAR_CSS = `
.ih-radar{position:absolute;overflow:hidden;width:${RADAR_SIZE}px;height:${RADAR_SIZE}px}
.ih-spin,.ih-pan{position:absolute;left:0;top:0;width:0;height:0}
.ih-spin{left:50%;top:50%}
.ih-pan>svg{position:absolute}
.ih-north{position:absolute;left:-13px;top:${-RADAR_SIZE / 2 + 8}px;width:26px;height:26px;border-radius:50%;
  background:#000;color:#fff;font-size:17px;display:grid;place-items:center}
.ih-player{position:absolute;left:50%;top:50%;transform:translate(-50%,-55%)}
.ih-credit{position:absolute;left:0;right:0;bottom:7px;text-align:center;
  font:600 10px/1 ui-sans-serif,system-ui,sans-serif;color:#fff;text-shadow:0 0 3px #000,0 0 3px #000}
`;

/** "M x y L x y …" for a flat list of coordinates, closed with Z for an area. */
const pathData = (pts: number[], close: boolean) => {
  let d = `M${pts[0]} ${pts[1]}`;
  for (let k = 2; k < pts.length; k += 2) d += `L${pts[k]} ${pts[k + 1]}`;
  return close ? `${d}Z` : d;
};
const pointsData = (points: Pt[]) =>
  pathData(
    points.flatMap((p) => [p.x, p.y]),
    false,
  );

interface Scene {
  /** The map art, in map px. */
  art: ReactNode;
  graph: MapGraph | null;
  start: number;
  steer?: Steer;
  /** Repeat size of a made-up map; null for a real place, which is drawn once. */
  tile: number | null;
  /** Real places credit OpenStreetMap, as its license asks. */
  credit: boolean;
}

const OFFSETS = [-TILE, 0, TILE];

/** A repeating tile filling three tiles each way, enough under the radar wherever the walk is. */
const tiled = (pattern: string, tile: ReactNode): ReactNode => (
  <>
    <defs>
      <pattern id={pattern} width={TILE} height={TILE} patternUnits="userSpaceOnUse">
        {tile}
      </pattern>
    </defs>
    <rect x={-TILE} y={-TILE} width={3 * TILE} height={3 * TILE} fill={`url(#${pattern})`} />
  </>
);

function urbanScene(seed: number, palette: Palette, pattern: string): Scene {
  const { blocks, graph } = cityTile(seed);
  const art = tiled(
    pattern,
    <>
      <rect width={TILE} height={TILE} fill={palette.road} />
      {blocks.map((block) => (
        <rect
          key={`${block.x}-${block.y}`}
          x={block.x}
          y={block.y}
          width={block.w}
          height={block.h}
          rx={2}
          fill={block.kind === 'building' ? palette.building : palette[block.kind]}
        />
      ))}
    </>,
  );
  return { art, graph, start: 0, tile: TILE, credit: false };
}

function parkScene(seed: number, palette: Palette, pattern: string): Scene {
  const { paths, trees, ponds, graph } = parkTile(seed);
  // Paths that cross into the next tile are drawn from both sides, so they meet at the seam.
  const all = OFFSETS.flatMap((ox) =>
    OFFSETS.flatMap((oy) =>
      paths.map((points) => pointsData(points.map((p) => ({ x: p.x + ox, y: p.y + oy })))),
    ),
  ).join('');
  const art = tiled(
    pattern,
    <>
      <rect width={TILE} height={TILE} fill={palette.lawn} />
      {ponds.map((pond) => (
        <ellipse
          key={`${pond.x}-${pond.y}`}
          cx={pond.x}
          cy={pond.y}
          rx={pond.rx}
          ry={pond.ry}
          fill={palette.water}
        />
      ))}
      <path d={all} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={11} strokeLinecap="round" />
      <path d={all} fill="none" stroke={palette.path} strokeWidth={8} strokeLinecap="round" />
      {trees.map((tree) => (
        <circle
          key={`${tree.x}-${tree.y}`}
          cx={tree.x}
          cy={tree.y}
          r={tree.r}
          fill={palette.tree}
          stroke="rgba(0,0,0,.3)"
          strokeWidth={1.5}
        />
      ))}
    </>,
  );
  return { art, graph, start: 0, tile: TILE, credit: false };
}

const ROAD_WIDTH = { major: 14, minor: 9, path: 5 } as const;

function realScene(map: RealMap, palette: Palette): Scene {
  const areas = (kind: RealMap['areas'][number]['kind']) =>
    map.areas
      .filter((area) => area.kind === kind)
      .map((area) => pathData(area.pts, true))
      .join('');
  const roads = (cls: RealMap['roads'][number]['cls']) =>
    map.roads
      .filter((road) => road.cls === cls)
      .map((road) => pathData(road.pts, false))
      .join('');
  const art = (
    <>
      <path d={areas('park')} fill={palette.park} />
      <path d={areas('water')} fill={palette.water} />
      <path d={areas('building')} fill={palette.building} />
      {(['path', 'minor', 'major'] as const).map((cls) => (
        <path
          key={cls}
          d={roads(cls)}
          fill="none"
          stroke={cls === 'path' ? palette.path : palette.road}
          strokeWidth={ROAD_WIDTH[cls]}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </>
  );
  const { graph, start } = realGraph(map);
  return { art, graph, start, steer: stayNearMiddle, tile: null, credit: true };
}

type RealState = { map: RealMap | null; failed: boolean };

// Overpass asks clients to wait at least 30 s after it turns a request away, so the retries here
// start there instead of at the 5 s other loaders use, and back off to 5 minutes.
const OVERPASS_RETRY_MS = [30_000, 60_000, 120_000, 300_000];

/** The real place's map: null while it loads, and `failed` while Overpass doesn't answer. */
function useRealMap(lat: number | null, lon: number | null): RealState {
  const [state, setState] = useState<RealState>({ map: null, failed: false });
  useEffect(() => {
    if (lat === null || lon === null) return;
    let current = true;
    let timer: number | undefined;
    const run = async (attempt: number) => {
      try {
        const map = await loadRealMap(lat, lon);
        if (current) setState({ map, failed: false });
      } catch (error) {
        if (!current) return;
        setState((previous) => ({ ...previous, failed: true }));
        if (!(error instanceof RetryableFetchError)) return;
        const delay = OVERPASS_RETRY_MS[Math.min(attempt, OVERPASS_RETRY_MS.length - 1)];
        timer = window.setTimeout(() => run(attempt + 1), delay);
      }
    };
    run(0);
    return () => {
      current = false;
      window.clearTimeout(timer);
    };
  }, [lat, lon]);
  return state;
}

/** What the radar draws: a real place only once it has loaded. */
type SceneKind = 'urban' | 'park' | 'real' | 'loading';

function sceneKind(map: HudMap, wantsReal: boolean, real: RealState): SceneKind {
  if (!wantsReal) return map === 'park' ? 'park' : 'urban';
  if (real.map) return 'real';
  // If Overpass doesn't answer, the made-up city stands in until it does.
  return real.failed ? 'urban' : 'loading';
}

interface HudRadarProps {
  style: HudStyle;
  map: HudMap;
  /** Picks the made-up city or park, so each channel walks its own. */
  seed: number;
  /** The real place, for `map: 'real'`. */
  lat: number | null;
  lon: number | null;
  /** How fast the arrow goes, in px a second; 0 stands still. */
  speed: number;
  place: CSSProperties;
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * The mini-map: an arrow walking streets or park paths, turning at the corners, with the map
 * turning under it so the arrow always points ahead. Urban and Park are made up, so they give
 * nothing of the stream's location away; Real Place draws the streets around a picked spot.
 */
export function HudRadar({ style, map, seed, lat, lon, speed, place }: HudRadarProps) {
  const look = LOOKS[style];
  const pattern = `ih-map-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const wantsReal = map === 'real' && lat !== null && lon !== null;
  const real = useRealMap(wantsReal ? lat : null, wantsReal ? lon : null);
  const kind = sceneKind(map, wantsReal, real);
  const scene = useMemo<Scene | null>(() => {
    if (kind === 'park') return parkScene(seed, look.palette, pattern);
    if (kind === 'urban') return urbanScene(seed, look.palette, pattern);
    if (kind === 'real' && real.map) return realScene(real.map, look.palette);
    return null;
  }, [kind, seed, look.palette, pattern, real.map]);

  // Read on every frame, so walking, running and stopping don't start the walk over.
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const spinRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<HTMLDivElement>(null);
  const northRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!scene?.graph || typeof requestAnimationFrame === 'undefined') return;
    const walker = createWalker(scene.graph, scene.start, Math.random, scene.steer);
    if (!walker) return;
    let last: number | null = null;
    let frame = 0;
    const tick = (now: number) => {
      const pose = stepWalker(walker, last === null ? 0 : (now - last) / 1000, speedRef.current);
      last = now;
      const x = scene.tile ? mod(pose.x, scene.tile) : pose.x;
      const y = scene.tile ? mod(pose.y, scene.tile) : pose.y;
      // The map turns against the walk, so the arrow always points ahead; N keeps upright.
      if (spinRef.current) spinRef.current.style.transform = `rotate(${-pose.heading}deg)`;
      if (panRef.current) panRef.current.style.transform = `translate(${-x}px,${-y}px)`;
      if (northRef.current) northRef.current.style.transform = `rotate(${pose.heading}deg)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [scene]);

  const box = scene?.tile
    ? { at: -scene.tile, size: 3 * scene.tile }
    : { at: -REAL_BOX / 2, size: REAL_BOX };
  const ground = kind === 'real' || kind === 'loading' ? look.palette.land : look.palette.road;
  return (
    <div
      className="ih-radar"
      data-testid="irl-hud-radar"
      data-map={kind}
      style={{ ...place, borderRadius: look.radius, boxShadow: look.border, background: ground }}
    >
      <div className="ih-spin" ref={spinRef}>
        <div className="ih-pan" ref={panRef}>
          {scene && (
            <svg
              aria-hidden="true"
              width={box.size}
              height={box.size}
              viewBox={`${box.at} ${box.at} ${box.size} ${box.size}`}
              style={{ left: box.at, top: box.at }}
            >
              {scene.art}
            </svg>
          )}
        </div>
        <div className="ih-north" aria-hidden="true">
          <span ref={northRef}>N</span>
        </div>
      </div>
      <svg className="ih-player" width="30" height="34" viewBox="0 0 30 34" aria-hidden="true">
        <path
          d="M15 2 28 31 15 24 2 31Z"
          fill="#fff"
          stroke="#000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      {scene?.credit && <span className="ih-credit">© OpenStreetMap</span>}
    </div>
  );
}
