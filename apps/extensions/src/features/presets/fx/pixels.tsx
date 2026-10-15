import { type CSSProperties, Fragment, useMemo } from 'react';
import { shade } from '../color';
import type { Skin } from '../skin';
import {
  between,
  motionOk,
  rng,
  type SparkSpec,
  Sparks,
  type SparkThrow,
  seedOf,
  throwSparks,
} from './primitives';
import type {
  BurstFxProps,
  EffectModule,
  FxHit,
  PanelFxProps,
  PulseFxProps,
  TrackFxProps,
} from './types';

// Pixels: Blocks' world of cubes, where nothing moves smoothly. What a bar gains is placed block by
// block and knocks loose bits that tumble down frame by frame; a goal reached spills glowing orbs.
// Panels put their border together in three hard steps, and now and then a faint enchanted glint
// steps across them.

/** The idle loop; each panel plays it at its own moment. */
const IDLE_MS = 12_000;
/** A goal bar's track is about this big, in px: enough to cut a gain into near-square cells. */
const BAR_W = 740;
const BAR_H = 40;
/** The narrowest stretch a gain is built on, in px, so a vote or a 1% step still shows. */
const SLIVER = 24;
/** The pixel frame's border, in px. */
const PIXEL = 3;
/** The grids a gain can be cut into, as [rows, columns]: 4 to 8 cells. */
const GRIDS: ReadonlyArray<readonly [number, number]> = [
  [1, 4],
  [1, 5],
  [1, 6],
  [1, 7],
  [1, 8],
  [2, 2],
  [2, 3],
  [2, 4],
];

/** A solid bar in the border's color: `at` is the corner it sits in, `w` and `h` its size. */
const solid = (at: string, w: string, h: string) =>
  `linear-gradient(var(--pfx-hi),var(--pfx-hi)) ${at}/${w} ${h} no-repeat`;
/** An L in each corner, as thick as the border. */
const CORNER_BG = ['0 0', '100% 0', '0 100%', '100% 100%']
  .flatMap((at) => [solid(at, 'var(--l)', 'var(--k)'), solid(at, 'var(--k)', 'var(--l)')])
  .join(',');
const dashes = (angle: number) =>
  `repeating-linear-gradient(${angle}deg,var(--pfx-hi) 0 var(--m),transparent var(--m) calc(var(--m)*2))`;
/** Every other block of the four edges. */
const EDGE_BG = [
  `${dashes(90)} 0 0/100% var(--k) no-repeat`,
  `${dashes(90)} 0 100%/100% var(--k) no-repeat`,
  `${dashes(180)} 0 0/var(--k) 100% no-repeat`,
  `${dashes(180)} 100% 0/var(--k) 100% no-repeat`,
].join(',');

// Every animation steps (steps(1,end) holds each keyframe until the next one), so a bit hops
// along its arc in ten frames: up to its peak at 30%, then falling faster and faster.
const css = `.pfx-pixels-seg{position:absolute;top:0;bottom:0}
.pfx-pixels-cell{position:absolute;opacity:0;background:var(--pfx-hi);box-shadow:inset 2px 2px 0 rgba(255,255,255,.75),inset -2px -2px 0 var(--pfx-lo)}
.pfx-pixels-bit{position:absolute;opacity:0;box-shadow:inset 1px 1px 0 rgba(255,255,255,.35),inset -2px -2px 0 rgba(0,0,0,.35)}
.pfx-pixels-orb{border-radius:50%;background:radial-gradient(circle at 34% 30%,#fffff2 0 15%,#ecff74 28%,#a2f02e 58%,#3f9214);box-shadow:0 0 6px 1px rgba(170,255,60,.7)}
.pfx-pixels-flash{position:absolute;inset:0;opacity:0;border-radius:inherit;background:#fff}
.pfx-pixels-c,.pfx-pixels-d,.pfx-pixels-s{position:absolute;inset:0;opacity:0}
.pfx-pixels-c{background:${CORNER_BG}}
.pfx-pixels-d{background:${CORNER_BG},${EDGE_BG}}
.pfx-pixels-s{border:var(--k) solid var(--pfx-hi);border-radius:inherit}
.pfx-pixels-clip{position:absolute;overflow:hidden}
.pfx-pixels-glint{position:absolute;top:0;bottom:0;left:0;width:100%;opacity:0;background:linear-gradient(115deg,transparent 35%,rgba(196,150,255,.16) 42%,rgba(255,255,255,.26) 48%,rgba(196,150,255,.16) 54%,transparent 61%)}
.pfx-pixels-line{position:absolute;bottom:0;height:3px;opacity:0;background:repeating-linear-gradient(90deg,var(--pfx-a) 0 6px,var(--pfx-ad) 6px 8px)}
.pfx-pixels-spot{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side,#fff,rgba(220,255,150,.55) 50%,rgba(200,255,100,0))}
${motionOk(`@keyframes pfx-pixels-pop{0%{opacity:0;transform:scale(.55)}1%{opacity:1;transform:scale(.55)}18%{transform:scale(1.12)}36%{transform:none}56%{opacity:.7}74%{opacity:.4}90%{opacity:.15}100%{opacity:0}}
@keyframes pfx-pixels-fly{0%{opacity:1;transform:none}10%{transform:translate(calc(var(--dx)*.1),calc(var(--up)*.56))}20%{transform:translate(calc(var(--dx)*.2),calc(var(--up)*.89))}30%{transform:translate(calc(var(--dx)*.3),var(--up))}40%{transform:translate(calc(var(--dx)*.4),calc(var(--up)*.98 + var(--down)*.02))}50%{transform:translate(calc(var(--dx)*.5),calc(var(--up)*.92 + var(--down)*.08))}60%{transform:translate(calc(var(--dx)*.6),calc(var(--up)*.82 + var(--down)*.18))}70%{transform:translate(calc(var(--dx)*.7),calc(var(--up)*.67 + var(--down)*.33))}80%{opacity:.7;transform:translate(calc(var(--dx)*.8),calc(var(--up)*.49 + var(--down)*.51))}90%{opacity:.4;transform:translate(calc(var(--dx)*.9),calc(var(--up)*.27 + var(--down)*.73))}100%{opacity:0;transform:translate(var(--dx),var(--down))}}
@keyframes pfx-pixels-flash{0%{opacity:.75}16%{opacity:.5}32%{opacity:.28}48%{opacity:.12}64%,100%{opacity:0}}
@keyframes pfx-pixels-s1{0%{opacity:1}12%,100%{opacity:0}}
@keyframes pfx-pixels-s2{0%{opacity:0}12%{opacity:1}24%,100%{opacity:0}}
@keyframes pfx-pixels-s3{0%{opacity:0}24%{opacity:1}64%{opacity:.6}76%{opacity:.3}88%,100%{opacity:0}}
@keyframes pfx-pixels-blink{0%{opacity:1}25%{opacity:0}50%{opacity:1}75%{opacity:.4}100%{opacity:0}}
@keyframes pfx-pixels-glint{0%,96.4%{opacity:0;transform:translateX(-53%)}96.5%{opacity:1;transform:translateX(-53%)}97.1%{transform:translateX(-31%)}97.7%{transform:translateX(-9%)}98.3%{transform:translateX(13%)}98.9%{transform:translateX(35%)}99.5%{transform:translateX(57%)}100%{opacity:0;transform:translateX(57%)}}
@keyframes pfx-pixels-tick{0%{opacity:0}1%{opacity:1}55%{opacity:.6}75%{opacity:.25}92%,100%{opacity:0}}
.pfx-pixels-a-pop{animation:pfx-pixels-pop var(--t,.42s) steps(1,end) var(--d,0s) backwards}
.pfx-pixels-a-fly{animation:pfx-pixels-fly var(--t,.8s) steps(1,end) var(--d,0s) backwards}
.pfx-pixels-a-flash{animation:pfx-pixels-flash var(--t,.75s) steps(1,end) var(--d,0s) backwards}
.pfx-pixels-a-s1{animation:pfx-pixels-s1 var(--t,1s) steps(1,end) backwards}
.pfx-pixels-a-s2{animation:pfx-pixels-s2 var(--t,1s) steps(1,end) backwards}
.pfx-pixels-a-s3{animation:pfx-pixels-s3 var(--t,1s) steps(1,end) backwards}
.pfx-pixels-a-blink{animation:pfx-pixels-blink var(--t,.4s) steps(1,end) var(--d,0s) backwards}
.pfx-pixels-a-glint{animation:pfx-pixels-glint ${IDLE_MS}ms steps(1,end) var(--sync,0s) infinite}
.pfx-pixels-a-tick{animation:pfx-pixels-tick var(--t,.7s) steps(1,end) var(--d,0s) backwards}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;
/** Grass, dirt and the bar's own green: what a broken block is made of. */
const BIT_COLORS = ['var(--pfx-f)', 'var(--pfx-f2)', 'var(--pfx-a)', 'var(--pfx-ad)'];
/** The quarters of a chat line's underline, lit one after another. */
const TICKS = [0, 1, 2, 3];
/** The four corners, as which way is out: left or right, then up or down. */
const CORNER_SIDES = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
] as const;

/** A spot `inset` px in from a panel's left (or top) edge, or from its right (or bottom). */
const along = (side: -1 | 1, inset: number) =>
  side < 0 ? `${Math.round(inset)}px` : `calc(100% - ${Math.round(inset)}px)`;

interface Cell {
  id: number;
  style: Vars;
}

/**
 * The cells a gain is built from, column by column and bottom row first like stacked blocks: 4 to
 * 8 of them, in the grid that comes out squarest on a goal bar. A gain too thin to cut is built
 * on a short stretch ending at the bar's edge.
 */
function cellsFor(hit: FxHit): { box: CSSProperties; cells: Cell[] } {
  const from = Math.min(hit.from, hit.to);
  const to = Math.max(hit.from, hit.to);
  const thin = (to - from) * BAR_W < SLIVER;
  const width = thin ? SLIVER : (to - from) * BAR_W;
  const squareness = ([rows, cols]: readonly [number, number]) =>
    Math.abs(Math.log(width / cols / (BAR_H / rows)));
  const [rows, cols] = GRIDS.reduce((best, grid) =>
    squareness(grid) < squareness(best) ? grid : best,
  );
  const step = thin ? 40 : 55;
  const cells: Cell[] = [];
  for (let col = 0; col < cols; col++) {
    for (let row = rows - 1; row >= 0; row--) {
      cells.push({
        id: cells.length,
        style: {
          left: pct(col / cols),
          top: pct(row / rows),
          width: pct(1 / cols),
          height: pct(1 / rows),
          '--t': thin ? '300ms' : '420ms',
          '--d': `${cells.length * step}ms`,
        },
      });
    }
  }
  return {
    box: thin
      ? { left: `calc(${pct(to)} - ${SLIVER}px)`, width: SLIVER }
      : { left: pct(from), width: pct(to - from) },
    cells,
  };
}

interface Bit {
  id: number;
  x: number | string;
  y: number | string;
  size: number;
  color: string;
  dx: number;
  up: number;
  down: number;
  t: number;
  d: number;
}

interface BitThrow {
  count: number;
  x: number | string;
  y: number | string;
  /** Sideways travel, from -spread to +spread px; `side` keeps it to one side. */
  spread: number;
  side?: 1 | -1;
  /** How high they hop and how far below the start they land, in px, as ranges. */
  rise: [number, number];
  fall: [number, number];
  ms: [number, number];
  delay?: number;
  jitter?: number;
  size: number;
}

/** Square bits knocked loose from one point, the same every time for the same generator. */
function bits(next: () => number, spec: BitThrow, firstId = 0): Bit[] {
  return Array.from({ length: spec.count }, (_, index) => {
    const raw = between(next, -spec.spread, spec.spread);
    return {
      id: firstId + index,
      x: spec.x,
      y: spec.y,
      size: Math.max(2, Math.round(between(next, 4, 6.5) * spec.size)),
      color: BIT_COLORS[Math.floor(next() * BIT_COLORS.length)],
      dx: spec.side ? Math.abs(raw) * spec.side : raw,
      up: -between(next, spec.rise[0], spec.rise[1]),
      down: between(next, spec.fall[0], spec.fall[1]),
      t: between(next, spec.ms[0], spec.ms[1]),
      d: (spec.delay ?? 0) + between(next, 0, spec.jitter ?? 0),
    };
  });
}

/** Bits hopping frame by frame: one element each, its whole arc in its stepped keyframes. */
function Bits({ list }: { list: readonly Bit[] }) {
  return list.map((bit) => (
    <span
      key={bit.id}
      className="pfx-pixels-bit pfx-pixels-a-fly"
      style={
        {
          left: bit.x,
          top: bit.y,
          width: bit.size,
          height: bit.size,
          marginLeft: -Math.round(bit.size / 2),
          marginTop: -Math.round(bit.size / 2),
          background: bit.color,
          '--dx': `${Math.round(bit.dx)}px`,
          '--up': `${Math.round(bit.up)}px`,
          '--down': `${Math.round(bit.down)}px`,
          '--t': `${Math.round(bit.t)}ms`,
          '--d': `${Math.round(bit.d)}ms`,
        } as Vars
      }
    />
  ));
}

/** Glowing orbs on smooth arcs: the one round, soft thing in a world of blocks. */
function orbs(next: () => number, spec: SparkThrow, firstId = 0): SparkSpec[] {
  return throwSparks(next, spec, firstId).map((orb) => {
    const size = Math.max(3, Math.round(between(next, 6, 9) * (spec.size ?? 1)));
    return { ...orb, w: size, h: size, r: 0 };
  });
}

/** The idle glint: across the whole panel, or along a frame's top and bottom bands only. */
function Glint({ sync, ring }: { sync: string; ring: number }) {
  const strip = (edge: 'top' | 'bottom') => (
    <span
      className="pfx-pixels-clip"
      style={{ left: 0, right: 0, [edge]: 0, height: ring, '--sync': sync } as Vars}
    >
      <span className="pfx-pixels-glint pfx-pixels-a-glint" />
    </span>
  );
  if (ring) {
    return (
      <>
        {strip('top')}
        {strip('bottom')}
      </>
    );
  }
  return (
    <span
      className="pfx-pixels-clip"
      style={{ inset: 0, borderRadius: 'inherit', '--sync': sync } as Vars}
    >
      <span className="pfx-pixels-glint pfx-pixels-a-glint" />
    </span>
  );
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const big = mode === 'hero';
  const size = Math.min(1.4, Math.max(0.5, scale));
  const band = ring ? Math.round(ring) : 0;
  const enterMs = big ? 1400 : 1000;
  // The overlay border sits on the pixel frame's own; on a frame, it keeps to the band's edge.
  const k = band ? Math.max(2, Math.round(band / 4)) : PIXEL;
  const border = { '--k': `${k}px`, '--m': `${2 * k}px`, '--l': `${4 * k}px` } as Vars;
  // Bits sit in the corners while the border assembles, and hop off as its last step lands.
  const corners = useMemo(() => {
    const next = rng(seed);
    return CORNER_SIDES.flatMap(([sx, sy], corner) =>
      bits(
        next,
        band
          ? {
              count: 1,
              x: along(sx, band / 2),
              y: along(sy, band / 2),
              spread: band * 1.5,
              side: sx < 0 ? 1 : -1,
              rise: [band * 0.15, band * 0.3],
              fall: [0, band * 0.3],
              ms: [480, 680],
              delay: enterMs * 0.24,
              jitter: 80,
              size: band / 16,
            }
          : {
              count: big ? 3 : 1,
              x: along(sx, 0),
              y: along(sy, 0),
              spread: (big ? 30 : 18) * size,
              side: sx,
              rise: sy < 0 ? [8 * size, (big ? 28 : 18) * size] : [4 * size, 12 * size],
              fall: [6 * size, (big ? 30 : 20) * size],
              ms: big ? [620, 900] : [480, 680],
              delay: enterMs * 0.24,
              jitter: big ? 160 : 80,
              size,
            },
        corner * 3,
      ),
    );
  }, [seed, big, size, band, enterMs]);
  const knocked = useMemo(() => {
    const next = rng(seedOf(`${seed}:${pulse}`));
    const x = pct(between(next, 0.2, 0.8));
    return bits(
      next,
      band
        ? {
            count: 4,
            x,
            y: `${band / 2}px`,
            spread: band * 1.6,
            rise: [band * 0.15, band * 0.3],
            fall: [0, band * 0.3],
            ms: [460, 640],
            jitter: 60,
            size: band / 16,
          }
        : {
            count: 4,
            x,
            y: '0%',
            spread: 28 * size,
            rise: [10 * size, 26 * size],
            fall: [8 * size, 30 * size],
            ms: [480, 700],
            jitter: 60,
            size,
          },
    );
  }, [seed, pulse, size, band]);
  const spill = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    if (band) {
      // On a frame the orbs hop along the top band and never fall into the picture.
      return Array.from({ length: 6 }, (_, index) =>
        orbs(
          next,
          {
            count: 1,
            x: pct(between(next, 0.06, 0.94)),
            y: band / 2,
            spread: band,
            rise: [band * 0.2, band * 0.35],
            fall: [0, band * 0.25],
            ms: [600, 900],
            jitter: 300,
            size: band / 16,
          },
          index,
        ),
      ).flat();
    }
    return [0.25, 0.5, 0.75].flatMap((at, index) =>
      orbs(
        next,
        {
          count: 4,
          x: pct(at),
          y: '0%',
          spread: 50 * size,
          rise: [20 * size, 56 * size],
          fall: [30 * size, 90 * size],
          ms: [750, 1100],
          delay: index * 80,
          jitter: 180,
          size,
        },
        index * 4,
      ),
    );
  }, [seed, win, size, band]);
  const steps = { ...border, '--t': `${enterMs}ms` } as Vars;
  return (
    <>
      {/* The border assembles: its corners, then every other block, then all of it. */}
      <span className="pfx-pixels-c pfx-pixels-a-s1" style={steps} />
      <span className="pfx-pixels-d pfx-pixels-a-s2" style={steps} />
      <span className="pfx-pixels-s pfx-pixels-a-s3" style={steps} />
      <Bits list={corners} />
      {mode === 'full' && <Glint sync={`${-Math.round(seed * IDLE_MS)}ms`} ring={band} />}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span className="pfx-pixels-s pfx-pixels-a-blink" style={border} />
          <Bits list={knocked} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-pixels-flash pfx-pixels-a-flash"
            style={
              band
                ? { background: 'none', boxShadow: `inset 0 0 0 ${band}px rgba(255,255,255,.85)` }
                : undefined
            }
          />
          <Sparks sparks={spill} className="pfx-pixels-orb" />
        </Fragment>
      )}
    </>
  );
}

function Track({ seed, hit, hits, win }: TrackFxProps) {
  const built = useMemo(() => (hit ? cellsFor(hit) : null), [hit]);
  // Orbs pop up from the bar's floor and drop back: a poll's winning row has no stage to fly to.
  const spill = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return Array.from({ length: 6 }, (_, index) =>
      orbs(
        next,
        {
          count: 1,
          x: pct(between(next, 0.06, 0.94)),
          y: '100%',
          spread: 14,
          rise: [16, 30],
          fall: [0, 12],
          ms: [600, 900],
          jitter: 380,
        },
        index,
      ),
    ).flat();
  }, [seed, win]);
  return (
    <>
      {built && hits > 0 && (
        <span key={`h${hits}`} className="pfx-pixels-seg" style={built.box}>
          {built.cells.map((cell) => (
            <span key={cell.id} className="pfx-pixels-cell pfx-pixels-a-pop" style={cell.style} />
          ))}
        </span>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span className="pfx-pixels-flash pfx-pixels-a-flash" />
          <Sparks sparks={spill} className="pfx-pixels-orb" />
        </Fragment>
      )}
    </>
  );
}

function Burst({ seed, hit, hits, win, left, right, y, height }: BurstFxProps) {
  const broken = useMemo(() => {
    if (!hit) return [];
    const next = rng(seedOf(`${seed}:${hit.key}`));
    const x = left + (right - left) * hit.to;
    return Array.from({ length: 7 }, (_, index) =>
      bits(
        next,
        {
          count: 1,
          x,
          y: y + between(next, -height / 4, height / 4),
          spread: 60,
          rise: [24, 64],
          fall: [24, 72],
          ms: [620, 880],
          jitter: 140,
          size: 1.4,
        },
        index,
      ),
    ).flat();
  }, [seed, hit, left, right, y, height]);
  const spill = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return [0.2, 0.4, 0.6, 0.8].flatMap((at, index) =>
      orbs(
        next,
        {
          count: 3,
          x: left + (right - left) * at,
          y,
          spread: 70,
          rise: [50, 120],
          fall: [10, 60],
          ms: [800, 1150],
          delay: index * 70,
          jitter: 260,
          size: 1.4,
        },
        index * 3,
      ),
    );
  }, [seed, win, left, right, y]);
  return (
    <>
      {hits > 0 && (
        <Fragment key={`h${hits}`}>
          <Bits list={broken} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <Sparks sparks={spill} className="pfx-pixels-orb" />
        </Fragment>
      )}
    </>
  );
}

function Pulse({ seed, pulse, win, enter, round }: PulseFxProps) {
  const popped = useMemo(
    () =>
      bits(rng(seedOf(`${seed}:${pulse}`)), {
        count: 4,
        x: '50%',
        y: '45%',
        spread: round ? 16 : 30,
        rise: round ? [8, 18] : [14, 34],
        fall: round ? [4, 12] : [8, 30],
        ms: [520, 720],
        jitter: 60,
        size: 1,
      }),
    [seed, pulse, round],
  );
  const spill = useMemo(
    () =>
      orbs(rng(seedOf(`${seed}:w${win}`)), {
        count: round ? 6 : 10,
        x: '50%',
        y: '40%',
        spread: round ? 28 : 60,
        rise: round ? [10, 24] : [24, 60],
        fall: round ? [4, 16] : [8, 40],
        ms: [650, 950],
        jitter: 260,
      }),
    [seed, win, round],
  );
  return (
    <>
      {enter &&
        // A chat line comes in with a pixel underline, lit a quarter at a time.
        TICKS.map((tick) => (
          <span
            key={tick}
            className="pfx-pixels-line pfx-pixels-a-tick"
            style={{ left: `${tick * 25}%`, width: '25%', '--d': `${tick * 70}ms` } as Vars}
          />
        ))}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <Bits list={popped} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-pixels-spot pfx-pixels-a-flash"
            style={{ inset: round ? 0 : '-20%' }}
          />
          <Sparks sparks={spill} className="pfx-pixels-orb" />
        </Fragment>
      )}
    </>
  );
}

export const pixels: EffectModule = {
  id: 'pixels',
  css,
  vars: (skin: Skin) => ({
    '--pfx-a': skin.colors.accent,
    '--pfx-ad': shade(skin.accent, 30),
    '--pfx-hi': shade(skin.accent, 84),
    '--pfx-lo': shade(skin.accent, 34, 0.7),
    '--pfx-f': skin.colors.frame,
    '--pfx-f2': skin.colors.frame2,
  }),
  Panel,
  Track,
  Burst,
  Pulse,
};
