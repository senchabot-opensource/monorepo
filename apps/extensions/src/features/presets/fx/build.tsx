import { type CSSProperties, Fragment, useMemo } from 'react';
import { rgba, shade } from '../color';
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

// Build: Storm's quick construction. What a bar gains is laid out first as a blue blueprint grid,
// then flashes white and turns solid, knocking off a few building pieces. A goal reached is struck
// by lightning, twice. Panels come in as a blueprint and solidify, and now and then a faint
// blue-violet shimmer slides across them.

/** The idle loop; each panel plays it at its own moment. */
const IDLE_MS = 11_000;
/** A gain thinner than this, as a fraction of the bar, is drawn on a short stretch at its edge. */
const THIN = 0.018;
/** A lightning bolt in three zigzags, its tip at the bottom. */
const BOLT =
  'polygon(59% 0,74% 0,56% 34%,70% 34%,44% 68%,58% 68%,34% 100%,40% 62%,26% 62%,46% 28%,34% 28%)';
/** Blueprint lines every --g px, both ways. */
const GRID =
  'repeating-linear-gradient(90deg,var(--pfx-gl) 0 1px,transparent 1px var(--g,10px)),repeating-linear-gradient(180deg,var(--pfx-gl) 0 1px,transparent 1px var(--g,10px))';

const css = `.pfx-build-bp,.pfx-build-grid{position:absolute;opacity:0;box-shadow:inset 0 0 0 2px var(--pfx-al)}
.pfx-build-bp{background:${GRID},var(--pfx-bp)}
.pfx-build-grid{background:${GRID};box-shadow:inset 0 0 0 2px var(--pfx-al),0 0 10px var(--pfx-a6)}
.pfx-build-flash{position:absolute;opacity:0;background:linear-gradient(180deg,#fff,#dcf3ff)}
.pfx-build-line{position:absolute;inset:0;opacity:0;border-radius:inherit;box-shadow:inset 0 0 0 2px var(--pfx-al),inset 0 0 14px var(--pfx-a6)}
.pfx-build-bit{background:var(--pfx-al);box-shadow:inset 0 0 0 1px rgba(255,255,255,.9),0 0 4px var(--pfx-a6)}
.pfx-build-bolt{position:absolute;opacity:0;clip-path:${BOLT};background:linear-gradient(180deg,#fff,#eef9ff 45%,#9edcff)}
.pfx-build-glow{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.9),rgba(170,225,255,.5) 45%,rgba(120,170,255,0))}
.pfx-build-wash{position:absolute;inset:0;opacity:0;border-radius:inherit;background:linear-gradient(180deg,rgba(236,248,255,.7),rgba(150,205,255,.42))}
.pfx-build-clip{position:absolute;overflow:hidden}
.pfx-build-shim{position:absolute;top:0;bottom:0;left:0;width:100%;opacity:0;background:linear-gradient(110deg,transparent 30%,var(--pfx-a2) 42%,rgba(255,255,255,.12) 48%,var(--pfx-v) 55%,transparent 68%)}
.pfx-build-ug,.pfx-build-us{position:absolute;left:0;bottom:0;width:100%;opacity:0;transform-origin:left}
.pfx-build-ug{--g:4px;height:5px;background:${GRID},var(--pfx-a2);box-shadow:inset 0 0 0 1px var(--pfx-al)}
.pfx-build-us{height:3px;background:var(--pfx-al);box-shadow:0 0 6px var(--pfx-a6)}
${motionOk(`@keyframes pfx-build-plan{0%{opacity:1;transform:scaleX(.6)}10%{transform:none}62%{opacity:1}64%,100%{opacity:0;transform:none}}
@keyframes pfx-build-weld{0%,62%{opacity:0}64%{opacity:.95}100%{opacity:0}}
@keyframes pfx-build-draft{0%,42%{opacity:.92}100%{opacity:0}}
@keyframes pfx-build-set{0%,38%{opacity:0}46%{opacity:.4}100%{opacity:0}}
@keyframes pfx-build-fade{0%{opacity:1}100%{opacity:0}}
@keyframes pfx-build-lock{0%{opacity:0;transform:scale(1.3)}25%{opacity:1;transform:none}45%{opacity:.35}60%{opacity:1}100%{opacity:0;transform:none}}
@keyframes pfx-build-strike{0%{opacity:1}10%{opacity:.15}13%,28%{opacity:0}30%{opacity:1}48%{opacity:.45}100%{opacity:0}}
@keyframes pfx-build-shim{0%,96.4%{opacity:0;transform:translateX(-100%)}96.5%,99.9%{opacity:1}100%{opacity:0;transform:translateX(100%)}}
@keyframes pfx-build-ug{0%{opacity:0;transform:scaleX(0)}8%{opacity:1}30%{transform:none}55%{opacity:1}58%,100%{opacity:0;transform:none}}
@keyframes pfx-build-us{0%,55%{opacity:0}58%{opacity:1}100%{opacity:0}}
.pfx-build-a-plan{transform-origin:left;animation:pfx-build-plan var(--t,.7s) ease-out var(--d,0s) backwards}
.pfx-build-a-weld{animation:pfx-build-weld var(--t,.7s) ease-out var(--d,0s) backwards}
.pfx-build-a-draft{animation:pfx-build-draft var(--t,.8s) ease-in var(--d,0s) backwards}
.pfx-build-a-set{animation:pfx-build-set var(--t,.8s) ease-out var(--d,0s) backwards}
.pfx-build-a-fade{animation:pfx-build-fade var(--t,.5s) ease-out var(--d,0s) backwards}
.pfx-build-a-lock{animation:pfx-build-lock var(--t,.6s) ease-out var(--d,0s) backwards}
.pfx-build-a-strike{animation:pfx-build-strike var(--t,1s) linear var(--d,0s) backwards}
.pfx-build-a-shim{animation:pfx-build-shim ${IDLE_MS}ms linear var(--sync,0s) infinite}
.pfx-build-a-ug{animation:pfx-build-ug var(--t,.9s) ease-out var(--d,0s) backwards}
.pfx-build-a-us{animation:pfx-build-us var(--t,.9s) ease-out var(--d,0s) backwards}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;

/**
 * Where a hit is laid out: its new segment, or a short stretch ending at the edge when nothing
 * (or next to nothing) grew. A short one plays faster, as a poll's votes can come every 450ms.
 */
function stretch(hit: FxHit): Vars {
  const from = Math.min(hit.from, hit.to);
  const to = Math.max(hit.from, hit.to);
  return to - from < THIN
    ? {
        top: 0,
        bottom: 0,
        left: `calc(${pct(to)} - 14px)`,
        width: 14,
        '--t': '450ms',
        '--g': '7px',
      }
    : { top: 0, bottom: 0, left: pct(from), width: pct(to - from), '--t': '700ms' };
}

/** Small light-blue building pieces, thrown like sparks and tilted the way they fly. */
function planks(next: () => number, spec: SparkThrow, firstId = 0): SparkSpec[] {
  const size = spec.size ?? 1;
  return throwSparks(next, spec, firstId).map((piece) => ({
    ...piece,
    w: Math.max(3, Math.round(between(next, 5, 9) * size)),
    h: Math.max(2, Math.round(between(next, 3, 5) * size)),
  }));
}

/** A frame's four bands, each drawn on its own so nothing covers the picture inside. */
function Strips({ band, className, style }: { band: number; className: string; style: Vars }) {
  return (
    <>
      <span className={className} style={{ ...style, left: 0, right: 0, top: 0, height: band }} />
      <span
        className={className}
        style={{ ...style, left: 0, right: 0, bottom: 0, height: band }}
      />
      <span
        className={className}
        style={{ ...style, left: 0, top: band, bottom: band, width: band }}
      />
      <span
        className={className}
        style={{ ...style, right: 0, top: band, bottom: band, width: band }}
      />
    </>
  );
}

/** The idle shimmer: across the whole panel, or along a frame's top and bottom bands only. */
function Shimmer({ sync, band }: { sync: string; band: number }) {
  const strip = (edge: 'top' | 'bottom') => (
    <span
      className="pfx-build-clip"
      style={{ left: 0, right: 0, [edge]: 0, height: band, '--sync': sync } as Vars}
    >
      <span className="pfx-build-shim pfx-build-a-shim" />
    </span>
  );
  if (band) {
    return (
      <>
        {strip('top')}
        {strip('bottom')}
      </>
    );
  }
  return (
    <span
      className="pfx-build-clip"
      style={{ inset: 0, borderRadius: 'inherit', '--sync': sync } as Vars}
    >
      <span className="pfx-build-shim pfx-build-a-shim" />
    </span>
  );
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const big = mode === 'hero';
  const size = Math.min(1.4, Math.max(0.5, scale));
  const band = ring ? Math.round(ring) : 0;
  const enterMs = big ? 1000 : mode === 'enter' ? 650 : 800;
  const grid = `${Math.max(5, Math.round(10 * size))}px`;
  // A card that comes in big knocks a few pieces off its top as it solidifies.
  const pieces = useMemo(() => {
    if (!big || band) return [];
    const next = rng(seed);
    return [0.25, 0.75].flatMap((at, index) =>
      planks(
        next,
        {
          count: 3,
          x: pct(at),
          y: '0%',
          spread: 50 * size,
          rise: [16 * size, 40 * size],
          fall: [20 * size, 60 * size],
          ms: [500, 800],
          delay: enterMs * 0.44,
          jitter: 120,
          size,
        },
        index * 3,
      ),
    );
  }, [seed, big, band, size, enterMs]);
  const bolt = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return { x: between(next, 0.3, 0.7), flip: next() < 0.5 };
  }, [seed, win]);
  const draft = { '--g': grid, '--t': `${enterMs}ms` } as Vars;
  return (
    <>
      {band ? (
        <Strips band={band} className="pfx-build-bp pfx-build-a-draft" style={draft} />
      ) : (
        <>
          <span
            className="pfx-build-bp pfx-build-a-draft"
            style={{ ...draft, inset: 0, borderRadius: 'inherit' }}
          />
          <span
            className="pfx-build-flash pfx-build-a-set"
            style={{ inset: 0, borderRadius: 'inherit', '--t': `${enterMs}ms` } as Vars}
          />
          <Sparks sparks={pieces} className="pfx-build-bit" />
        </>
      )}
      {mode === 'full' && <Shimmer sync={`${-Math.round(seed * IDLE_MS)}ms`} band={band} />}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span
            className="pfx-build-line pfx-build-a-fade"
            style={
              band
                ? {
                    boxShadow: `inset 0 0 0 2px var(--pfx-al),inset 0 0 ${band}px var(--pfx-a6)`,
                  }
                : undefined
            }
          />
          {!band && (
            <span
              className="pfx-build-grid pfx-build-a-fade"
              style={{ inset: 0, borderRadius: 'inherit', '--g': grid, '--t': '.42s' } as Vars}
            />
          )}
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          {band ? (
            // A frame's band lights up with each flash; the picture inside stays clear.
            <span
              className="pfx-build-line pfx-build-a-strike"
              style={{ boxShadow: `inset 0 0 0 ${band}px rgba(225,244,255,.8)` }}
            />
          ) : (
            <>
              <span className="pfx-build-wash pfx-build-a-strike" />
              <span
                className="pfx-build-bolt pfx-build-a-strike"
                style={{
                  left: pct(bolt.x),
                  top: 0,
                  bottom: 0,
                  width: 'clamp(40px, 18%, 120px)',
                  transform: `translateX(-50%)${bolt.flip ? ' scaleX(-1)' : ''}`,
                }}
              />
            </>
          )}
        </Fragment>
      )}
    </>
  );
}

function Track({ hit, hits, win }: TrackFxProps) {
  const plan = useMemo(() => (hit ? stretch(hit) : null), [hit]);
  return (
    <>
      {plan && hits > 0 && (
        <Fragment key={`h${hits}`}>
          {/* Drawn as a plan first, over the fill sliding in under it; then welded solid. */}
          <span className="pfx-build-bp pfx-build-a-plan" style={plan} />
          <span className="pfx-build-flash pfx-build-a-weld" style={plan} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span className="pfx-build-wash pfx-build-a-strike" />
          {/* In the middle, where a goal bar's lightning comes down on the stage. */}
          <span
            className="pfx-build-bolt pfx-build-a-strike"
            style={{ left: '50%', top: 0, bottom: 0, width: 28, marginLeft: -14 }}
          />
        </Fragment>
      )}
    </>
  );
}

/** How far above the bar a goal's lightning starts, and how wide it is, in stage px. */
const SKY = 150;
const BOLT_W = 80;
/** Where the bolt's tip is across its box (see BOLT). */
const TIP = 0.34;

function Burst({ seed, hit, hits, win, left, right, y, height }: BurstFxProps) {
  const pieces = useMemo(() => {
    if (!hit) return [];
    // Knocked off as the plan is welded solid.
    const thin = Math.abs(hit.to - hit.from) < THIN;
    return planks(rng(seedOf(`${seed}:${hit.key}`)), {
      count: 4,
      x: left + (right - left) * hit.to,
      y,
      spread: 50,
      rise: [18, 46],
      fall: [10, 40],
      ms: [460, 720],
      delay: thin ? 280 : 440,
      jitter: 60,
      size: 1.4,
    });
  }, [seed, hit, left, right, y]);
  const x = (left + right) / 2;
  // The second flash knocks pieces off where it lands.
  const shards = useMemo(
    () =>
      planks(rng(seedOf(`${seed}:w${win}`)), {
        count: 6,
        x,
        y,
        spread: 80,
        rise: [30, 80],
        fall: [10, 50],
        ms: [520, 820],
        delay: 300,
        jitter: 120,
        size: 1.4,
      }),
    [seed, win, x, y],
  );
  return (
    <>
      {hits > 0 && (
        <Fragment key={`h${hits}`}>
          <Sparks sparks={pieces} className="pfx-build-bit" />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-build-glow pfx-build-a-strike"
            style={{ left: x - 120, top: y - 70, width: 240, height: 140 }}
          />
          {/* The bolt comes down from above the bar, its tip on the bar's middle. */}
          <span
            className="pfx-build-bolt pfx-build-a-strike"
            style={{
              left: Math.round(x - BOLT_W * TIP),
              top: y - SKY,
              width: BOLT_W,
              height: SKY + height / 2,
            }}
          />
          <Sparks sparks={shards} className="pfx-build-bit" />
        </Fragment>
      )}
    </>
  );
}

function Pulse({ seed, pulse, win, enter, round }: PulseFxProps) {
  const flip = useMemo(() => rng(seedOf(`${seed}:w${win}`))() < 0.5, [seed, win]);
  return (
    <>
      {enter && (
        // A chat line's underline is drawn as a grid, then turns solid.
        <>
          <span className="pfx-build-ug pfx-build-a-ug" />
          <span className="pfx-build-us pfx-build-a-us" />
        </>
      )}
      {pulse > 0 && (
        <span
          key={`p${pulse}`}
          className="pfx-build-grid pfx-build-a-lock"
          style={{ inset: round ? '15%' : -6, '--g': '8px' } as Vars}
        />
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-build-glow pfx-build-a-strike"
            style={{ inset: round ? 0 : '-25%' }}
          />
          <span
            className="pfx-build-bolt pfx-build-a-strike"
            style={{
              left: '50%',
              top: round ? '14%' : '-10%',
              bottom: round ? '14%' : '-10%',
              width: round ? '30%' : 44,
              transform: `translateX(-50%)${flip ? ' scaleX(-1)' : ''}`,
            }}
          />
        </Fragment>
      )}
    </>
  );
}

export const build: EffectModule = {
  id: 'build',
  css,
  vars: (skin: Skin) => ({
    '--pfx-al': shade(skin.accent, 84),
    '--pfx-gl': shade(skin.accent, 80, 0.55),
    '--pfx-bp': shade(skin.accent, 20, 0.88),
    '--pfx-a6': rgba(skin.colors.accent, 0.6),
    '--pfx-a2': rgba(skin.colors.accent, 0.2),
    '--pfx-v': rgba(skin.colors.frame2, 0.22),
  }),
  Panel,
  Track,
  Burst,
  Pulse,
};
