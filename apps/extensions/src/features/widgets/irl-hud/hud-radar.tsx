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
import {
  createWalker,
  type MapGraph,
  type Pt,
  type Steer,
  stepWalker,
  type WalkerPose,
} from './map-graph';
import {
  createExitWalk,
  createRoomWalker,
  INDOOR_SPEED,
  nearestNode,
  nearestRoom,
  type Room,
  type RoomWalker,
  roomFor,
  roomZoom,
  type StraightWalk,
  stepExitWalk,
  stepRoomWalker,
} from './map-indoor';
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
  /** Indoors: the floor of the building the arrow is in, and its walls. */
  floor: string;
  wall: string;
}

interface RadarLook {
  palette: Palette;
  /** The sweep and the pings while a real place loads. */
  scan: string;
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
      floor: '#4f5c63',
      wall: '#e3dcc0',
    },
    radius: '50%',
    border: '0 0 0 3px #8d969c, 0 0 0 9px #000',
    scan: '132 214 140',
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
      floor: '#2a3a47',
      wall: '#cfe7ff',
    },
    radius: '22px',
    border: '0 0 0 2px rgba(255,255,255,.35), 0 6px 18px rgba(0,0,0,.55)',
    scan: '150 205 255',
  },
  // A map drawn in ink on parchment, in a ring of dark wood and brass.
  medieval: {
    palette: {
      road: '#8a6a40',
      land: '#d9c59c',
      building: '#b7996a',
      path: '#a3835a',
      park: '#a0aa6c',
      lawn: '#adb677',
      tree: '#6f7d40',
      water: '#6f90a6',
      floor: '#ccb88c',
      wall: '#3b2410',
    },
    radius: '50%',
    border: '0 0 0 4px #4a2e14, 0 0 0 7px #b08d57, 0 0 0 10px #2a1708, 0 8px 18px rgba(0,0,0,.5)',
    scan: '176 141 87',
  },
  // A fantasy MMO's round mini-map: grassland and dirt roads in a gold ring.
  mmorpg: {
    palette: {
      road: '#9d8658',
      land: '#43602d',
      building: '#6e5f49',
      path: '#b7a170',
      park: '#4f7c34',
      lawn: '#5b8c3d',
      tree: '#2e5521',
      water: '#2f6c9c',
      floor: '#7c6c54',
      wall: '#f3e7c4',
    },
    radius: '50%',
    border: '0 0 0 3px #17110a, 0 0 0 7px #c9a34a, 0 0 0 10px #3a2a12, 0 8px 18px rgba(0,0,0,.55)',
    scan: '255 209 0',
  },
};

export const RADAR_CSS = `
.ih-radar{position:absolute;overflow:hidden;width:${RADAR_SIZE}px;height:${RADAR_SIZE}px}
.ih-spin,.ih-pan{position:absolute;left:0;top:0;width:0;height:0}
.ih-spin{left:50%;top:50%}
.ih-pan>svg{position:absolute}
.ih-north{position:absolute;left:-13px;top:${-RADAR_SIZE / 2 + 8}px;width:26px;height:26px;border-radius:50%;
  background:#000;color:#fff;font-size:17px;display:grid;place-items:center}
.ih-medieval .ih-north{background:#3b2410;color:#f2c55c;box-shadow:0 0 0 2px #b08d57}
.ih-mmorpg .ih-north{background:#17110a;color:#ffd100;box-shadow:0 0 0 2px #c9a34a}
.ih-player{position:absolute;left:50%;top:50%;transform:translate(-50%,-55%)}
/* While a real place loads: a radar sweep turning, rings, and pings from the middle. */
.ih-loading{position:absolute;inset:0;pointer-events:none}
.ih-sweep{position:absolute;inset:-25%;
  background:conic-gradient(from 0deg,transparent 0 280deg,rgb(var(--ih-scan)/.32) 360deg);
  animation:ih-sweep-turn 1.8s linear infinite}
.ih-ring{position:absolute;left:50%;top:50%;border-radius:50%;border:1px solid rgb(var(--ih-scan)/.18);
  transform:translate(-50%,-50%)}
.ih-ping{position:absolute;left:50%;top:50%;width:10px;height:10px;transform:translate(-50%,-50%);
  border-radius:50%;border:2px solid rgb(var(--ih-scan)/.7);animation:ih-ping-grow 1.8s ease-out infinite}
.ih-ping+.ih-ping{animation-delay:.9s}
@keyframes ih-sweep-turn{to{transform:rotate(360deg)}}
@keyframes ih-ping-grow{from{width:10px;height:10px;opacity:1}to{width:240px;height:240px;opacity:0}}
@media (prefers-reduced-motion:reduce){.ih-sweep,.ih-ping{animation:none}}
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
  /** The buildings the arrow can go into, in map px. */
  rooms: Room[];
  /** Whether a building may go up around the arrow where there's none: made-up maps only. */
  standIn: boolean;
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
  // Every copy around the middle tile, so the arrow walks into the building nearest it even
  // across a tile edge.
  const rooms = blocks
    .filter((block) => block.kind === 'building')
    .flatMap((block) =>
      OFFSETS.flatMap((ox) =>
        OFFSETS.map((oy) => [
          { x: block.x + ox, y: block.y + oy },
          { x: block.x + block.w + ox, y: block.y + oy },
          { x: block.x + block.w + ox, y: block.y + block.h + oy },
          { x: block.x + ox, y: block.y + block.h + oy },
        ]),
      ),
    );
  return { art, graph, start: 0, tile: TILE, credit: false, rooms, standIn: true };
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
  // No buildings in the park: indoors, a stand-in one goes up around the arrow.
  return { art, graph, start: 0, tile: TILE, credit: false, rooms: [], standIn: true };
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
  // The real buildings, for when GPS says which one the streamer is in. The walk around a picked
  // spot can't, so the widget keeps a walked real place outdoors.
  const rooms = map.areas
    .filter((area) => area.kind === 'building')
    .map((area) => {
      const points: Pt[] = [];
      for (let k = 0; k + 1 < area.pts.length; k += 2)
        points.push({ x: area.pts[k], y: area.pts[k + 1] });
      return points;
    });
  return {
    art,
    graph,
    start,
    steer: stayNearMiddle,
    tile: null,
    credit: true,
    rooms,
    standIn: false,
  };
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
  /**
   * Inside the building nearest the arrow, walking within its walls (!hud indoor). The widget
   * sets it on a real place only when GPS moves the arrow.
   */
  indoor?: boolean;
  place: CSSProperties;
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

// Too long a frame (a hidden source) jumps ahead in one go, like the walk outside does.
const MAX_STEP_SECONDS = 0.25;
/** How quickly the map zooms in on a building and back out, a share a second. */
const ZOOM_RATE = 2.5;
/** The lit walls of the building the arrow is in, in screen px. */
const WALL_WIDTH = 3;
/** How often a real place looks again for a building near the arrow, in ms. */
const ROOM_RETRY_MS = 1000;

/** "M x y L x y … Z" for a room's walls. */
const roomPath = (room: Room) =>
  pathData(
    room.flatMap((p) => [p.x, p.y]),
    true,
  );

/**
 * The mini-map: an arrow walking streets or park paths, turning at the corners, with the map
 * turning under it so the arrow always points ahead. Urban and Park are made up, so they give
 * nothing of the stream's location away; Real Place draws the streets around a picked spot.
 */
export function HudRadar({
  style,
  map,
  seed,
  lat,
  lon,
  speed,
  indoor = false,
  place,
}: HudRadarProps) {
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
  const indoorRef = useRef(indoor);
  indoorRef.current = indoor;
  // The building the arrow is in, drawn lit over the dimmed map; null outdoors.
  const [room, setRoom] = useState<Room | null>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<HTMLDivElement>(null);
  const northRef = useRef<HTMLSpanElement>(null);
  const wallsRef = useRef<SVGPathElement>(null);
  useEffect(() => {
    if (!scene || typeof requestAnimationFrame === 'undefined') return;
    const { graph, tile } = scene;
    let walker = graph ? createWalker(graph, scene.start, Math.random, scene.steer) : null;
    let pose: WalkerPose = walker ? stepWalker(walker, 0, 0) : { x: 0, y: 0, heading: 0 };
    // Indoors: walking inside a building. Leaving it: walking out to the street's nearest junction.
    let inRoom: RoomWalker | null = null;
    let leaving: { walk: StraightWalk; node: number } | null = null;
    let zoom = 1;
    // When a real place last had no building near the arrow.
    let missedAt = Number.NEGATIVE_INFINITY;
    let last: number | null = null;
    let frame = 0;
    const tick = (now: number) => {
      const dt = last === null ? 0 : Math.min(MAX_STEP_SECONDS, (now - last) / 1000);
      last = now;
      const speed = speedRef.current;
      if (indoorRef.current && !inRoom && now - missedAt >= ROOM_RETRY_MS) {
        // Into the building nearest the arrow, on the map tile it shows. A made-up map puts up a
        // stand-in where there's none; a real place only has its real buildings, so with none
        // near it stays outdoors and looks again in a moment, as a GPS position moves on.
        const at = tile ? { ...pose, x: mod(pose.x, tile), y: mod(pose.y, tile) } : pose;
        const building = scene.standIn ? roomFor(scene.rooms, at) : nearestRoom(scene.rooms, at);
        if (building) {
          inRoom = createRoomWalker(building, at);
          // Standing still, it can't walk in, so it's just inside.
          if (speed <= 0) Object.assign(inRoom, inRoom.target);
          leaving = null;
          setRoom(building);
        } else {
          missedAt = now;
        }
      } else if (!indoorRef.current && inRoom) {
        inRoom = null;
        setRoom(null);
        if (graph) {
          const street = nearestNode(graph, pose);
          if (street.node >= 0) leaving = { walk: createExitWalk(pose, street), node: street.node };
        }
      }
      // Speeds are on the screen; zoomed in, the same steps cover less of the map.
      if (inRoom) {
        pose = stepRoomWalker(inRoom, dt, (speed * INDOOR_SPEED) / zoom);
      } else if (leaving && graph) {
        const out = stepExitWalk(leaving.walk, dt, speed / zoom);
        pose = out.pose;
        if (out.done) {
          walker = createWalker(graph, leaving.node, Math.random, scene.steer);
          if (walker) walker.heading = pose.heading;
          leaving = null;
        }
      } else if (walker) {
        pose = stepWalker(walker, dt, speed);
      }
      const wanted = inRoom ? roomZoom(inRoom.room, RADAR_SIZE) : 1;
      zoom += (wanted - zoom) * Math.min(1, dt * ZOOM_RATE);
      // Indoors the map stays on the building's own copy, which is drawn lit.
      const x = tile && !inRoom ? mod(pose.x, tile) : pose.x;
      const y = tile && !inRoom ? mod(pose.y, tile) : pose.y;
      // The map turns against the walk, so the arrow always points ahead; N keeps upright.
      if (spinRef.current) spinRef.current.style.transform = `rotate(${-pose.heading}deg)`;
      if (panRef.current)
        panRef.current.style.transform = `scale(${zoom}) translate(${-x}px,${-y}px)`;
      if (northRef.current) northRef.current.style.transform = `rotate(${pose.heading}deg)`;
      // The zoom scales the walls with the map; they keep their width on screen instead.
      if (wallsRef.current) wallsRef.current.style.strokeWidth = String(WALL_WIDTH / zoom);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      setRoom(null);
    };
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
      data-indoor={room ? 'true' : 'false'}
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
              {room && (
                <>
                  <path
                    d={`M${box.at} ${box.at}h${box.size}v${box.size}h${-box.size}Z${roomPath(room)}`}
                    fillRule="evenodd"
                    fill="rgba(0,0,0,.55)"
                  />
                  <path
                    ref={wallsRef}
                    data-testid="irl-hud-room"
                    d={roomPath(room)}
                    fill={look.palette.floor}
                    stroke={look.palette.wall}
                    strokeWidth={WALL_WIDTH}
                    strokeLinejoin="round"
                  />
                </>
              )}
            </svg>
          )}
        </div>
        <div className="ih-north" aria-hidden="true">
          <span ref={northRef}>N</span>
        </div>
      </div>
      {kind === 'loading' && (
        <div
          className="ih-loading"
          data-testid="irl-hud-loading"
          aria-hidden="true"
          style={{ '--ih-scan': look.scan } as CSSProperties}
        >
          <span className="ih-ring" style={{ width: RADAR_SIZE / 3, height: RADAR_SIZE / 3 }} />
          <span className="ih-ring" style={{ width: RADAR_SIZE / 1.5, height: RADAR_SIZE / 1.5 }} />
          <span className="ih-sweep" />
          <span className="ih-ping" />
          <span className="ih-ping" />
        </div>
      )}
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
