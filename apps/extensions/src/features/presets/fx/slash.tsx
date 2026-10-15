import { type CSSProperties, Fragment, useMemo } from 'react';
import { rgba, shade } from '../color';
import type { Skin } from '../skin';
import { between, motionOk, rng, seedOf } from './primitives';
import type {
  BurstFxProps,
  EffectModule,
  FxHit,
  PanelFxProps,
  PulseFxProps,
  TrackFxProps,
} from './types';

// Slash: Agent's knife work. What a bar gains is cut in by a thin white slash that leaves a red
// afterglow and flings a few shards off the edge. A reached goal charges a row of pips one by one,
// they flash together, and a cut in the win color crosses the bar. Panels come in with a knife-cut
// wipe, and now and then their red left edge flickers.

/** The idle loop; each panel plays it at its own moment. */
const IDLE_MS = 9000;
/** How long a cut takes to cross what a bar gained, in ms; its shards fly off as it lands. */
const CUT_MS = 180;
/** The win: pips light one by one, flash together at PIP_FLASH, then the cut strikes. */
const PIP_MS = 1500;
const PIP_LIT = [120, 230, 340, 450, 560];
const PIP_FLASH = 760;
const STRIKE_MS = 800;

const at = (ms: number) => `${Math.round((ms / PIP_MS) * 1000) / 10}%`;
const diamond = (scale: number) => `transform:rotate(45deg) scale(${scale})`;
const round2 = (value: number) => Math.round(value * 100) / 100;

/**
 * Each pip lights at its own moment and all of them flash at the same one, so each has its own
 * keyframes over the same span, and its own class to play them.
 */
function litFrames(lit: number, index: number): string {
  const name = `pfx-slash-lit${index}`;
  const lighting = `0%,${at(lit)}{opacity:0;${diamond(1.8)}}${at(lit + 70)}{opacity:1;${diamond(1)}}`;
  const flashing = `${at(PIP_FLASH)}{opacity:1;${diamond(1)}}${at(PIP_FLASH + 70)}{opacity:1;${diamond(1.55)}}${at(PIP_FLASH + 400)},100%{opacity:0;${diamond(1.2)}}`;
  return `@keyframes ${name}{${lighting}${flashing}}
.pfx-slash-a-lit${index}{animation:${name} ${PIP_MS}ms ease-out var(--d,0s) backwards}`;
}

/** The bar's charge: it glows up a little with every pip and peaks as they flash. */
function chargeFrames(): string {
  const steps = PIP_LIT.map((lit, index) => {
    const peak = round2(0.3 + index * 0.08);
    return `${at(lit)}{opacity:${peak}}${at(lit + 60)}{opacity:${round2(peak - 0.16 - index * 0.02)}}`;
  });
  return `@keyframes pfx-slash-charge{0%{opacity:0}${steps.join('')}${at(PIP_FLASH)}{opacity:.55}${at(PIP_FLASH + 60)}{opacity:1}${at(1300)},100%{opacity:0}}`;
}

const blade = (from: string, to: string, angle: number) =>
  `linear-gradient(${angle}deg,${from} 0,${from} calc(100% - var(--trail,60px)),${to} calc(100% - 14px),rgba(255,255,255,.8) calc(100% - 6px),#fff calc(100% - 3px))`;

const css = `.pfx-slash-clip{position:absolute;overflow:hidden;border-radius:inherit}
.pfx-slash-blade{position:absolute;top:0;bottom:0;left:0;width:100%;opacity:0;background:${blade('var(--pfx-a0)', 'var(--pfx-a6)', 90)}}
.pfx-slash-blade.pfx-slash-back{background:${blade('var(--pfx-a0)', 'var(--pfx-a6)', 270)}}
.pfx-slash-blade.pfx-slash-w{background:${blade('var(--pfx-w0)', 'var(--pfx-w6)', 90)}}
.pfx-slash-after{position:absolute;top:0;bottom:0;opacity:0;transform-origin:0 50%;background:linear-gradient(180deg,var(--pfx-h),var(--pfx-a) 75%)}
.pfx-slash-shard{position:absolute;opacity:0;background:#fff}
.pfx-slash-shard.pfx-slash-r{background:var(--pfx-a)}
.pfx-slash-shard.pfx-slash-w{background:var(--pfx-w)}
.pfx-slash-pip{position:absolute;box-sizing:border-box;opacity:0;border:1.5px solid var(--pfx-f);background:var(--pfx-p)}
.pfx-slash-lit{position:absolute;opacity:0;background:linear-gradient(135deg,#fff,var(--pfx-w) 55%);box-shadow:0 0 8px 2px var(--pfx-w6)}
.pfx-slash-charge{position:absolute;inset:0;opacity:0;border-radius:inherit;box-shadow:inset 0 0 12px 2px var(--pfx-w)}
.pfx-slash-flash{position:absolute;inset:0;opacity:0;border-radius:inherit;background:#fff}
.pfx-slash-bar{position:absolute;left:0;top:0;bottom:0;opacity:0;background:linear-gradient(180deg,var(--pfx-h),var(--pfx-a) 40%);box-shadow:0 0 8px 1px var(--pfx-a6)}
.pfx-slash-rot{position:absolute;left:12%;width:76%;top:50%;height:0}
.pfx-slash-stroke{position:absolute;left:0;width:100%;top:-1.5px;height:3px;opacity:0;background:linear-gradient(90deg,var(--pfx-a0),var(--pfx-a) 22%,#fff 62%);box-shadow:0 0 6px var(--pfx-a6)}
.pfx-slash-stroke.pfx-slash-w{background:linear-gradient(90deg,var(--pfx-w0),var(--pfx-w) 22%,#fff 62%);box-shadow:0 0 6px var(--pfx-w6)}
.pfx-slash-scar{position:absolute;left:0;width:100%;top:-5px;height:10px;opacity:0;background:linear-gradient(180deg,var(--pfx-a0),var(--pfx-a6) 50%,var(--pfx-a0))}
.pfx-slash-scar.pfx-slash-w{background:linear-gradient(180deg,var(--pfx-w0),var(--pfx-w6) 50%,var(--pfx-w0))}
.pfx-slash-spot{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side,var(--pfx-w6),var(--pfx-w0))}
.pfx-slash-under{position:absolute;left:0;right:0;bottom:0;height:2px;opacity:0;transform-origin:0 50%;background:linear-gradient(90deg,var(--pfx-a6),var(--pfx-a) 70%,#fff)}
${motionOk(`@keyframes pfx-slash-cut{0%{opacity:0;transform:translateX(-100%) skewX(var(--k,-24deg))}2%{opacity:1}70%{opacity:1;transform:translateX(0) skewX(var(--k,-24deg))}100%{opacity:0;transform:translateX(0) skewX(var(--k,-24deg))}}
@keyframes pfx-slash-wipe{0%{opacity:0;transform:translateX(-100%) skewX(var(--k,-20deg))}3%{opacity:1}78%{opacity:1}100%{opacity:0;transform:translateX(16%) skewX(var(--k,-20deg))}}
@keyframes pfx-slash-wipe-back{0%{opacity:0;transform:translateX(100%) skewX(var(--k,20deg))}3%{opacity:1}78%{opacity:1}100%{opacity:0;transform:translateX(-16%) skewX(var(--k,20deg))}}
@keyframes pfx-slash-after{0%{opacity:0;transform:scaleX(0)}2%{opacity:.9}28%{opacity:.9;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1)}}
@keyframes pfx-slash-shard{0%{opacity:0;transform:translate(0,0) rotate(var(--r0))}6%{opacity:1}55%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r1))}}
@keyframes pfx-slash-pip{0%{opacity:0;${diamond(0.4)}}6%{opacity:.9;${diamond(1)}}52%{opacity:.9;${diamond(1)}}74%,100%{opacity:0;${diamond(1)}}}
${PIP_LIT.map(litFrames).join('\n')}
${chargeFrames()}
@keyframes pfx-slash-flash{0%{opacity:0}8%{opacity:.45}100%{opacity:0}}
@keyframes pfx-slash-blink{0%{opacity:1}30%{opacity:.1}55%{opacity:1}100%{opacity:0}}
@keyframes pfx-slash-idle{0%,95.4%{opacity:0}95.5%{opacity:1}96.4%{opacity:.1}97.2%{opacity:1}98.1%,100%{opacity:0}}
@keyframes pfx-slash-stroke{0%{opacity:1;transform:translateX(-50%) scaleX(0)}40%{opacity:1;transform:translateX(0) scaleX(1)}100%{opacity:0;transform:translateX(0) scaleX(1)}}
@keyframes pfx-slash-scar{0%{opacity:0;transform:translateX(-50%) scaleX(0)}35%{opacity:.95;transform:translateX(0) scaleX(1)}100%{opacity:0;transform:translateX(0) scaleX(1)}}
@keyframes pfx-slash-spot{0%{opacity:0;transform:scale(.6)}25%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.1)}}
@keyframes pfx-slash-under{0%{opacity:1;transform:scaleX(0)}45%{opacity:1;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1)}}
.pfx-slash-a-cut{animation:pfx-slash-cut var(--t,.26s) cubic-bezier(.3,.4,.3,1) var(--d,0s) backwards}
.pfx-slash-a-wipe{animation:pfx-slash-wipe var(--t,.44s) cubic-bezier(.55,.05,.3,1) var(--d,0s) backwards}
.pfx-slash-a-back{animation:pfx-slash-wipe-back var(--t,.44s) cubic-bezier(.55,.05,.3,1) var(--d,0s) backwards}
.pfx-slash-a-after{animation:pfx-slash-after var(--t,.65s) ease-out var(--d,0s) backwards}
.pfx-slash-a-shard{animation:pfx-slash-shard var(--t,.6s) cubic-bezier(.12,.75,.3,1) var(--d,0s) backwards}
.pfx-slash-a-pip{animation:pfx-slash-pip ${PIP_MS}ms ease-out var(--d,0s) backwards}
.pfx-slash-a-charge{animation:pfx-slash-charge ${PIP_MS}ms linear var(--d,0s) backwards}
.pfx-slash-a-flash{animation:pfx-slash-flash var(--t,.42s) ease-out var(--d,0s) backwards}
.pfx-slash-a-blink{animation:pfx-slash-blink var(--t,.4s) steps(1,end) var(--d,0s) backwards}
.pfx-slash-a-idle{animation:pfx-slash-idle ${IDLE_MS}ms steps(1,end) var(--sync,0s) infinite}
.pfx-slash-a-stroke{animation:pfx-slash-stroke var(--t,.42s) cubic-bezier(.2,.7,.3,1) var(--d,0s) backwards}
.pfx-slash-a-scar{animation:pfx-slash-scar var(--t,.7s) ease-out var(--d,0s) backwards}
.pfx-slash-a-spot{animation:pfx-slash-spot var(--t,.9s) ease-out var(--d,0s) backwards}
.pfx-slash-a-under{animation:pfx-slash-under var(--t,.42s) cubic-bezier(.2,.7,.3,1) var(--d,0s) backwards}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;
const px = (value: number) => `${Math.round(value * 10) / 10}px`;
/** A position: px, or a percentage as it was given. */
const place = (value: number | string) => (typeof value === 'number' ? px(value) : value);

/** What a hit cuts: its new segment, or a sliver at the edge when nothing grew. */
function segment(hit: FxHit): CSSProperties {
  const width = Math.abs(hit.to - hit.from);
  return width > 0.004
    ? { left: pct(Math.min(hit.from, hit.to)), width: pct(width) }
    : { left: `calc(${pct(hit.to)} - 5px)`, width: 10 };
}

/** Triangles, still shapes on small elements. */
const SHAPES = [
  'polygon(0 0,100% 50%,0 100%)',
  'polygon(0 100%,45% 0,100% 100%)',
  'polygon(0 0,100% 20%,35% 100%)',
  'polygon(10% 30%,100% 0,55% 100%)',
];

interface Shard {
  id: number;
  x: number | string;
  y: number | string;
  /** Where it ends up, in px, and its spin from r0 to r1 in degrees. */
  dx: number;
  dy: number;
  r0: number;
  r1: number;
  w: number;
  h: number;
  /** Duration and delay, in ms. */
  t: number;
  d: number;
}

interface Fling {
  /** Directions in radians, 0 straight ahead and negative up, as a range. */
  angle: [number, number];
  /** How far it flies, in px, as a range. */
  reach: [number, number];
  size: number;
  ms: [number, number];
  delay: number;
}

/** A shard knocked off where a cut ends, flying on and spinning. */
function shard(
  next: () => number,
  id: number,
  x: number | string,
  y: number | string,
  spec: Fling,
): Shard {
  const angle = between(next, spec.angle[0], spec.angle[1]);
  const reach = between(next, spec.reach[0], spec.reach[1]);
  const r0 = between(next, 0, 360);
  return {
    id,
    x,
    y,
    dx: Math.cos(angle) * reach,
    dy: Math.sin(angle) * reach,
    r0,
    r1: r0 + between(next, 220, 540) * (next() < 0.5 ? -1 : 1),
    w: between(next, 7, 11) * spec.size,
    h: between(next, 4.5, 7) * spec.size,
    t: between(next, spec.ms[0], spec.ms[1]),
    d: spec.delay + between(next, 0, 70),
  };
}

function Shards({ list, win = false }: { list: readonly Shard[]; win?: boolean }) {
  return list.map((item) => {
    // White and red by turns, or all in the win color.
    const tone = win ? ' pfx-slash-w' : item.id % 2 ? ' pfx-slash-r' : '';
    return (
      <span
        key={item.id}
        className={`pfx-slash-shard${tone} pfx-slash-a-shard`}
        style={
          {
            left: place(item.x),
            top: place(item.y),
            width: px(item.w),
            height: px(item.h),
            marginLeft: px(-item.w / 2),
            marginTop: px(-item.h / 2),
            clipPath: SHAPES[item.id % SHAPES.length],
            '--dx': px(item.dx),
            '--dy': px(item.dy),
            '--r0': `${Math.round(item.r0)}deg`,
            '--r1': `${Math.round(item.r1)}deg`,
            '--t': `${Math.round(item.t)}ms`,
            '--d': `${Math.round(item.d)}ms`,
          } as Vars
        }
      />
    );
  });
}

interface PipSpot {
  key: number;
  left: number | string;
  top: number;
}

/** The win's row of diamonds: an outline each, and the light that fills it. */
function Pips({ spots, size }: { spots: readonly PipSpot[]; size: number }) {
  const box = {
    width: px(size),
    height: px(size),
    marginLeft: px(-size / 2),
    marginTop: px(-size / 2),
  };
  return spots.map((spot, index) => (
    <Fragment key={spot.key}>
      <span
        className="pfx-slash-pip pfx-slash-a-pip"
        style={
          {
            ...box,
            left: spot.left,
            top: spot.top,
            borderWidth: px(Math.max(1, size / 6)),
            '--d': `${index * 30}ms`,
          } as Vars
        }
      />
      <span
        className={`pfx-slash-lit pfx-slash-a-lit${index}`}
        style={{ ...box, left: spot.left, top: spot.top }}
      />
    </Fragment>
  ));
}

/** A knife cut across a panel; on a stream frame, along its top and bottom bands only. */
function Cut({
  size,
  ring,
  t,
  d = 0,
  trail,
  win = false,
  back = false,
}: {
  size: number;
  ring?: number;
  t: number;
  d?: number;
  /** The red streak behind the blade, in px at scale 1. */
  trail: number;
  win?: boolean;
  /** Right to left, slanted the other way. */
  back?: boolean;
}) {
  const style = {
    '--trail': `${Math.round(trail * size)}px`,
    '--t': `${t}ms`,
    '--d': `${d}ms`,
  } as Vars;
  const blade = (reverse: boolean) => {
    let tone = '';
    if (win) tone = ' pfx-slash-w';
    else if (reverse) tone = ' pfx-slash-back';
    return (
      <span
        className={`pfx-slash-blade${tone} ${reverse ? 'pfx-slash-a-back' : 'pfx-slash-a-wipe'}`}
        style={style}
      />
    );
  };
  if (!ring) {
    return (
      <span className="pfx-slash-clip" style={{ inset: 0 }}>
        {blade(back && !win)}
      </span>
    );
  }
  // Round the frame: the bottom band's cut runs the other way.
  return (
    <>
      <span className="pfx-slash-clip" style={{ left: 0, right: 0, top: 0, height: ring }}>
        {blade(back && !win)}
      </span>
      <span className="pfx-slash-clip" style={{ left: 0, right: 0, bottom: 0, height: ring }}>
        {blade(!back && !win)}
      </span>
    </>
  );
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const big = mode === 'hero';
  const size = Math.min(1.4, Math.max(0.5, scale));
  // The red left edge, and on a stream frame everything kept inside the band.
  const edge = ring
    ? {
        width: Math.max(2, Math.min(5 * size, ring / 2.5)),
        boxShadow: `0 0 ${Math.round(ring / 3)}px 0 var(--pfx-a6)`,
      }
    : { width: Math.max(2, Math.round(5 * size)) };
  const charge = ring
    ? {
        boxShadow: `inset 0 0 ${Math.round(ring * 0.8)}px ${Math.round(ring / 6)}px var(--pfx-w)`,
      }
    : undefined;
  const pip = ring ? Math.max(4, Math.min(7 * size, ring * 0.45)) : 7 * size;
  // Inside the top edge: a tactical panel's box is clipped, nothing shows above it.
  const spots = PIP_LIT.map((lit, index) => ({
    key: lit,
    left: `calc(50% + ${px((index - 2) * pip * 2.3)})`,
    top: ring ? ring / 2 : 10 * size,
  }));
  return (
    <>
      <Cut size={size} ring={ring} t={big ? 560 : 440} trail={big ? 110 : 70} />
      {big && (
        <>
          {/* A card that comes in big is cut twice, in an X, with a flash. */}
          <Cut size={size} ring={ring} t={520} d={130} trail={90} back />
          {!ring && (
            <span
              className="pfx-slash-flash pfx-slash-a-flash"
              style={{ '--d': '170ms', '--t': '380ms' } as Vars}
            />
          )}
        </>
      )}
      <span
        className="pfx-slash-bar pfx-slash-a-blink"
        style={{ ...edge, '--t': '420ms' } as Vars}
      />
      {mode === 'full' && (
        <span
          className="pfx-slash-bar pfx-slash-a-idle"
          style={{ ...edge, '--sync': `${-Math.round(seed * IDLE_MS)}ms` } as Vars}
        />
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <Cut size={size} ring={ring} t={300} trail={50} />
          <span
            className="pfx-slash-bar pfx-slash-a-blink"
            style={{ ...edge, '--t': '260ms' } as Vars}
          />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <Pips spots={spots} size={pip} />
          <span className="pfx-slash-charge pfx-slash-a-charge" style={charge} />
          <Cut size={size} ring={ring} t={460} d={STRIKE_MS} trail={120} win />
          {!ring && (
            <span
              className="pfx-slash-flash pfx-slash-a-flash"
              style={{ '--d': `${STRIKE_MS + 160}ms` } as Vars}
            />
          )}
        </Fragment>
      )}
    </>
  );
}

function Track({ hit, hits, win }: TrackFxProps) {
  return (
    <>
      {hit && hits > 0 && (
        <Fragment key={`h${hits}`}>
          <span className="pfx-slash-after pfx-slash-a-after" style={segment(hit)} />
          <span
            className="pfx-slash-blade pfx-slash-a-cut"
            style={
              { ...segment(hit), '--trail': '26px', '--t': `${Math.round(CUT_MS / 0.7)}ms` } as Vars
            }
          />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          {/* Charged up with the pips, then one cut in the win color down the whole bar. */}
          <span className="pfx-slash-charge pfx-slash-a-charge" />
          <span
            className="pfx-slash-blade pfx-slash-w pfx-slash-a-cut"
            style={{ '--trail': '120px', '--t': '330ms', '--d': `${STRIKE_MS}ms` } as Vars}
          />
          <span
            className="pfx-slash-flash pfx-slash-a-flash"
            style={{ '--d': `${STRIKE_MS + 160}ms` } as Vars}
          />
        </Fragment>
      )}
    </>
  );
}

function Burst({ skin, seed, hit, hits, win, left, right, y, height }: BurstFxProps) {
  // The bar is slanted: above its middle, its edge sits further right.
  const slant = Math.tan((skin.skew * Math.PI) / 180);
  const shards = useMemo(() => {
    if (!hit) return [];
    const next = rng(seedOf(`${seed}:${hit.key}`));
    const x = left + (right - left) * hit.to;
    return Array.from({ length: 4 }, (_, id) => {
      const rise = height * between(next, -0.3, 0.3);
      return shard(next, id, x + slant * rise, y + rise, {
        angle: [-1.3, 0.9],
        reach: [30, 66],
        size: 1.3,
        ms: [480, 720],
        delay: CUT_MS - 30,
      });
    });
  }, [seed, hit, left, right, y, height, slant]);
  // Just above the bar's far end: clear of the goal's cup in the middle and under the count.
  const top = Math.round(y - height / 2 - 8);
  const spots = PIP_LIT.map((lit, index) => ({
    key: lit,
    left: place(right - 14 - (PIP_LIT.length - 1 - index) * 18 + slant * (top - y)),
    top,
  }));
  return (
    <>
      {hits > 0 && (
        <Fragment key={`h${hits}`}>
          <Shards list={shards} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <Pips spots={spots} size={8} />
        </Fragment>
      )}
    </>
  );
}

/** A slash drawn across the middle, end to end, with shards flung off its far end. */
function Slash({
  angle,
  shards,
  win = false,
  d = 0,
}: {
  angle: number;
  shards: readonly Shard[];
  win?: boolean;
  d?: number;
}) {
  const tone = win ? ' pfx-slash-w' : '';
  return (
    <span
      className="pfx-slash-rot"
      style={{ transform: `rotate(${angle}deg)`, '--d': `${d}ms` } as Vars}
    >
      <span className={`pfx-slash-scar${tone} pfx-slash-a-scar`} />
      <span className={`pfx-slash-stroke${tone} pfx-slash-a-stroke`} />
      <Shards list={shards} win={win} />
    </span>
  );
}

function Pulse({ seed, pulse, win, enter, round }: PulseFxProps) {
  // Inside a ring the shards stay close, so nothing leaves the circle.
  const cut = useMemo(() => {
    const next = rng(seedOf(`${seed}:${pulse}`));
    return Array.from({ length: 2 }, (_, id) =>
      shard(next, id, '100%', 0, {
        angle: [-0.7, 0.7],
        reach: round ? [6, 14] : [12, 28],
        size: 0.8,
        ms: [380, 560],
        delay: 150,
      }),
    );
  }, [seed, pulse, round]);
  const cross = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return [0, 1].map((stroke) =>
      Array.from({ length: 2 }, (_, id) =>
        shard(next, stroke * 2 + id, '100%', 0, {
          angle: [-0.7, 0.7],
          reach: round ? [6, 14] : [14, 32],
          size: 0.9,
          ms: [420, 620],
          delay: 150 + stroke * 110,
        }),
      ),
    );
  }, [seed, win, round]);
  return (
    <>
      {enter && <span className="pfx-slash-under pfx-slash-a-under" />}
      {pulse > 0 && <Slash key={`p${pulse}`} angle={-28} shards={cut} />}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-slash-spot pfx-slash-a-spot"
            style={round ? { inset: '14%' } : { inset: '-15%' }}
          />
          <Slash angle={-28} shards={cross[0]} win />
          <Slash angle={28} shards={cross[1]} win d={110} />
        </Fragment>
      )}
    </>
  );
}

export const slash: EffectModule = {
  id: 'slash',
  css,
  vars: (skin: Skin) => ({
    '--pfx-a': skin.colors.accent,
    '--pfx-a6': rgba(skin.colors.accent, 0.6),
    '--pfx-a0': rgba(skin.colors.accent, 0),
    // A light tint of the accent: a red-hot glow that still shows over a red bar.
    '--pfx-h': shade(skin.accent, 82),
    '--pfx-w': skin.colors.win,
    '--pfx-w6': rgba(skin.colors.win, 0.6),
    '--pfx-w0': rgba(skin.colors.win, 0),
    '--pfx-f': skin.colors.frame,
    '--pfx-p': rgba(skin.colors.panel2, 0.7),
  }),
  Panel,
  Track,
  Burst,
  Pulse,
};
