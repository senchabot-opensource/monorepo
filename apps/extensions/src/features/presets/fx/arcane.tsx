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

// Arcane: Rift's magic. A teal pulse of energy runs along what a bar gains and ends in a rune
// flashing at its edge, while motes of it float off the bar. Panels come in with gold light
// running along their borders and now and then catch a slow gold glint; a win rings out in gold
// from the middle.

/** The idle loop; each panel plays it at its own moment. */
const IDLE_MS = 11_000;

const css = `.pfx-arcane-run{position:absolute;top:0;bottom:0;overflow:hidden}
.pfx-arcane-bolt{position:absolute;inset:0;opacity:0;background:radial-gradient(28px 50% at calc(100% - 3px) 50%,#fff,var(--pfx-l7) 35%,var(--pfx-l0)),linear-gradient(90deg,var(--pfx-l0) 10%,rgba(255,255,255,.8)) 0 50%/100% 2px no-repeat,linear-gradient(90deg,var(--pfx-l0),var(--pfx-l3) 45%,var(--pfx-l7)) 0 50%/100% 50% no-repeat}
.pfx-arcane-rune,.pfx-arcane-core,.pfx-arcane-mote{position:absolute;width:var(--s,18px);height:var(--s,18px);margin:calc(var(--s,18px)*-.5) 0 0 calc(var(--s,18px)*-.5);opacity:0}
.pfx-arcane-rune{border:2px solid var(--pfx-l);box-shadow:0 0 8px 1px var(--pfx-t),inset 0 0 5px var(--pfx-t6)}
.pfx-arcane-core{background:#fff;box-shadow:0 0 6px 2px var(--pfx-t)}
.pfx-arcane-mote{background:linear-gradient(135deg,#fff,var(--pfx-l) 30%,var(--pfx-t) 75%);box-shadow:0 0 6px 1px var(--pfx-t6)}
.pfx-arcane-rune.pfx-arcane-gold{border-color:var(--pfx-gl);box-shadow:0 0 8px 1px var(--pfx-g),inset 0 0 5px var(--pfx-g6)}
.pfx-arcane-core.pfx-arcane-gold{box-shadow:0 0 6px 2px var(--pfx-g)}
.pfx-arcane-mote.pfx-arcane-gold{background:linear-gradient(135deg,#fff,var(--pfx-gl) 30%,var(--pfx-g) 75%);box-shadow:0 0 6px 1px var(--pfx-g6)}
.pfx-arcane-wash{position:absolute;inset:0;opacity:0;background:linear-gradient(180deg,var(--pfx-g3),var(--pfx-g6) 50%,var(--pfx-g3))}
.pfx-arcane-halo{position:absolute;opacity:0;border-radius:50%;border:2px solid var(--pfx-gl);box-shadow:0 0 10px 1px var(--pfx-g6),inset 0 0 8px var(--pfx-g6)}
.pfx-arcane-rim{position:absolute;inset:0;opacity:0;border-radius:inherit;border:1px solid var(--pfx-l);box-shadow:inset 0 0 14px 2px var(--pfx-t6),0 0 8px var(--pfx-t3)}
.pfx-arcane-rim.pfx-arcane-gold{border-color:var(--pfx-gl);box-shadow:inset 0 0 16px 2px var(--pfx-g6),0 0 10px var(--pfx-g3)}
.pfx-arcane-clip{position:absolute;inset:0;overflow:hidden;border-radius:inherit}
.pfx-arcane-glint{position:absolute;inset:0;opacity:0;background:linear-gradient(110deg,transparent 40%,var(--pfx-g3) 46%,rgba(255,250,232,.75) 50%,var(--pfx-g3) 54%,transparent 60%)}
.pfx-arcane-trace{position:absolute;opacity:0}
.pfx-arcane-top{left:0;right:0;top:0;height:var(--h,8px);transform-origin:0 0;background:linear-gradient(90deg,var(--pfx-g0),var(--pfx-gl) 70%,#fff) 0 0/100% var(--w,2px) no-repeat,radial-gradient(100% 100% at 100% 0,var(--pfx-g4),var(--pfx-g0))}
.pfx-arcane-bottom{left:0;right:0;bottom:0;height:var(--h,8px);transform-origin:100% 100%;background:linear-gradient(270deg,var(--pfx-g0),var(--pfx-gl) 70%,#fff) 0 100%/100% var(--w,2px) no-repeat,radial-gradient(100% 100% at 0 100%,var(--pfx-g4),var(--pfx-g0))}
.pfx-arcane-right{top:0;bottom:0;right:0;width:var(--h,8px);transform-origin:100% 0;background:linear-gradient(180deg,var(--pfx-g0),var(--pfx-gl) 70%,#fff) 100% 0/var(--w,2px) 100% no-repeat,radial-gradient(100% 100% at 100% 100%,var(--pfx-g4),var(--pfx-g0))}
.pfx-arcane-left{top:0;bottom:0;left:0;width:var(--h,8px);transform-origin:0 100%;background:linear-gradient(0deg,var(--pfx-g0),var(--pfx-gl) 70%,#fff) 0 0/var(--w,2px) 100% no-repeat,radial-gradient(100% 100% at 0 0,var(--pfx-g4),var(--pfx-g0))}
.pfx-arcane-line{position:absolute;left:0;right:0;bottom:0;height:2px;opacity:0;transform-origin:0 50%;background:linear-gradient(90deg,var(--pfx-t0),var(--pfx-t) 55%,var(--pfx-l) 90%,#fff)}
${motionOk(`@keyframes pfx-arcane-bolt{0%{opacity:1;transform:translateX(-100%);animation-timing-function:cubic-bezier(.5,.1,.35,1)}48%{opacity:1;transform:none}100%{opacity:0;transform:none}}
@keyframes pfx-arcane-rune{0%{opacity:0;transform:rotate(45deg) scale(.3)}18%{opacity:1}100%{opacity:0;transform:rotate(45deg) scale(1.6)}}
@keyframes pfx-arcane-core{0%{opacity:0;transform:rotate(45deg) scale(.2)}22%{opacity:1;transform:rotate(45deg) scale(1)}100%{opacity:0;transform:rotate(45deg) scale(2)}}
@keyframes pfx-arcane-float{0%{opacity:0;transform:translate(0,0) rotate(45deg) scale(.3)}15%{opacity:1;transform:translate(calc(var(--dx)*.1),calc(var(--up)*.12)) rotate(45deg) scale(1)}55%{opacity:.9;transform:translate(calc(var(--dx)*.55 + var(--sw)),calc(var(--up)*.6)) rotate(45deg) scale(.9)}100%{opacity:0;transform:translate(var(--dx),var(--up)) rotate(45deg) scale(.5)}}
@keyframes pfx-arcane-ring{0%{opacity:0;transform:scale(.06)}14%{opacity:1}70%{opacity:.75}100%{opacity:0;transform:scale(1)}}
@keyframes pfx-arcane-glow{0%{opacity:0}18%{opacity:1}100%{opacity:0}}
@keyframes pfx-arcane-sweep{0%{opacity:1;transform:translateX(-70%)}100%{opacity:1;transform:translateX(70%)}}
@keyframes pfx-arcane-tx{0%{opacity:1;transform:scaleX(0);animation-timing-function:cubic-bezier(.45,0,.25,1)}55%{opacity:1;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1)}}
@keyframes pfx-arcane-ty{0%{opacity:1;transform:scaleY(0);animation-timing-function:cubic-bezier(.45,0,.25,1)}55%{opacity:1;transform:scaleY(1)}100%{opacity:0;transform:scaleY(1)}}
@keyframes pfx-arcane-idle{0%,88%{opacity:0;transform:translateX(-70%)}89%{opacity:.5}98%{opacity:.5;transform:translateX(70%)}99%,100%{opacity:0;transform:translateX(70%)}}
.pfx-arcane-a-bolt{animation:pfx-arcane-bolt var(--t,.8s) linear var(--d,0s) backwards}
.pfx-arcane-a-rune{animation:pfx-arcane-rune var(--t,.6s) ease-out var(--d,0s) backwards}
.pfx-arcane-a-core{animation:pfx-arcane-core var(--t,.6s) ease-out var(--d,0s) backwards}
.pfx-arcane-a-float{animation:pfx-arcane-float var(--t,1.2s) cubic-bezier(.4,.1,.6,.9) var(--d,0s) backwards}
.pfx-arcane-a-ring{animation:pfx-arcane-ring var(--t,1.1s) cubic-bezier(.2,.7,.3,1) var(--d,0s) backwards}
.pfx-arcane-a-glow{animation:pfx-arcane-glow var(--t,1.2s) ease-out var(--d,0s) backwards}
.pfx-arcane-a-sweep{animation:pfx-arcane-sweep var(--t,.9s) ease-in-out var(--d,0s) backwards}
.pfx-arcane-a-tx{animation:pfx-arcane-tx var(--t,1s) linear var(--d,0s) backwards}
.pfx-arcane-a-ty{animation:pfx-arcane-ty var(--t,1s) linear var(--d,0s) backwards}
.pfx-arcane-a-idle{animation:pfx-arcane-idle ${IDLE_MS}ms ease-in-out var(--sync,0s) infinite}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;
const px = (value: number) => `${Math.round(value * 10) / 10}px`;
const ms = (value: number) => `${Math.round(value)}ms`;

/** What a hit lights: its new segment, or a sliver at the edge when nothing grew (a poll vote). */
function segment(hit: FxHit): CSSProperties {
  const width = Math.abs(hit.to - hit.from);
  return width > 0.004
    ? { left: pct(Math.min(hit.from, hit.to)), width: pct(width) }
    : { left: `calc(${pct(hit.to)} - 5px)`, width: 10 };
}

interface Mote {
  id: number;
  x: number | string;
  y: number | string;
  dx: number;
  up: number;
  sway: number;
  size: number;
  t: number;
  d: number;
}

interface MoteFlight {
  count: number;
  /** Where each one starts: px, or a percentage of the layer it's drawn in. */
  from: (next: () => number) => [number | string, number | string];
  /** How high it floats, in px, as a range. */
  rise: [number, number];
  /** Sideways drift, from -drift to +drift px. */
  drift: number;
  size: [number, number];
  ms: [number, number];
  delay?: number;
  /** Extra random delay, up to this many ms. */
  jitter?: number;
}

/** Motes of light that float up and drift: magic, not thrown sparks. */
function motes(next: () => number, flight: MoteFlight): Mote[] {
  return Array.from({ length: flight.count }, (_, id) => {
    const [x, y] = flight.from(next);
    return {
      id,
      x,
      y,
      dx: between(next, -flight.drift, flight.drift),
      up: -between(next, flight.rise[0], flight.rise[1]),
      sway: between(next, -flight.drift, flight.drift) / 2,
      size: between(next, flight.size[0], flight.size[1]),
      t: between(next, flight.ms[0], flight.ms[1]),
      d: (flight.delay ?? 0) + between(next, 0, flight.jitter ?? 0),
    };
  });
}

function Motes({ list, gold }: { list: readonly Mote[]; gold?: boolean }) {
  return list.map((mote) => (
    <span
      key={mote.id}
      className={`pfx-arcane-mote ${gold ? 'pfx-arcane-gold ' : ''}pfx-arcane-a-float`}
      style={
        {
          left: mote.x,
          top: mote.y,
          '--s': px(mote.size),
          '--dx': px(mote.dx),
          '--up': px(mote.up),
          '--sw': px(mote.sway),
          '--t': ms(mote.t),
          '--d': ms(mote.d),
        } as Vars
      }
    />
  ));
}

/** A rune flashing: a diamond outline round a small bright diamond, both opening out as they fade. */
function Rune({
  x,
  y,
  size,
  t = 600,
  d = 0,
  gold,
}: {
  x: number | string;
  y: number | string;
  size: number;
  t?: number;
  d?: number;
  gold?: boolean;
}) {
  const tone = gold ? 'pfx-arcane-gold ' : '';
  const at = { left: x, top: y, '--t': ms(t), '--d': ms(d) };
  return (
    <>
      <span
        className={`pfx-arcane-rune ${tone}pfx-arcane-a-rune`}
        style={{ ...at, '--s': px(size) } as Vars}
      />
      <span
        className={`pfx-arcane-core ${tone}pfx-arcane-a-core`}
        style={{ ...at, '--s': px(size * 0.42) } as Vars}
      />
    </>
  );
}

/**
 * A gold glint crossing the panel, clipped to it: the whole panel, or one band of a frame. With
 * `sync` it's the idle loop at that phase, otherwise one sweep at `timing`.
 */
function Glint({
  band,
  edge = 'top',
  sync,
  timing,
}: {
  band?: number;
  edge?: 'top' | 'bottom';
  sync?: number;
  timing?: Vars;
}) {
  const strip: CSSProperties = band
    ? edge === 'top'
      ? { bottom: 'auto', height: band }
      : { top: 'auto', height: band }
    : {};
  const idle = sync !== undefined;
  return (
    <span
      className="pfx-arcane-clip"
      style={idle ? ({ ...strip, '--sync': ms(sync) } as Vars) : strip}
    >
      <span
        className={`pfx-arcane-glint ${idle ? 'pfx-arcane-a-idle' : 'pfx-arcane-a-sweep'}`}
        style={idle ? undefined : timing}
      />
    </span>
  );
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const big = mode === 'hero';
  const size = Math.min(1.4, Math.max(0.5, scale));
  // A border light and its glow stay inside a frame's band, off the webcam it surrounds.
  const glow = Math.round((big ? 12 : 8) * size);
  const trace = {
    '--h': px(ring ? Math.min(glow, ring) : glow),
    '--w': px(Math.max(1, Math.round((big ? 3 : 2) * size))),
  };
  const rise = useMemo(
    () =>
      big
        ? motes(rng(seed), {
            count: 6,
            from: (next) => [pct(between(next, 0.08, 0.92)), '100%'],
            rise: [30 * size, 64 * size],
            drift: 16 * size,
            size: [6 * size, 9 * size],
            ms: [1000, 1500],
            delay: 350,
            jitter: 500,
          })
        : [],
    [seed, big, size],
  );
  const lift = useMemo(
    () =>
      motes(rng(seedOf(`${seed}:${pulse}`)), {
        count: 3,
        from: (next) => [pct(between(next, 0.36, 0.64)), 0],
        rise: [16 * size, 34 * size],
        drift: 12 * size,
        size: [5 * size, 7 * size],
        ms: [800, 1200],
        delay: 100,
        jitter: 200,
      }),
    [seed, pulse, size],
  );
  const crown = useMemo(
    () =>
      motes(rng(seedOf(`${seed}:w${win}`)), {
        count: 6,
        from: (next) => [pct(between(next, 0.1, 0.9)), '100%'],
        rise: [30 * size, 70 * size],
        drift: 14 * size,
        size: [6 * size, 9 * size],
        ms: [1000, 1500],
        delay: 250,
        jitter: 600,
      }),
    [seed, win, size],
  );
  const band = ring ? Math.round(ring) : 0;
  const phase = -seed * IDLE_MS;
  // Around a webcam, a flash's inner glow reaches no deeper than the frame's band.
  const rim = (color: string) =>
    band ? { boxShadow: `inset 0 0 ${Math.round(band * 0.8)}px ${color}` } : undefined;
  return (
    <>
      {big ? (
        // An alert or a winner's card: light runs round all four sides from the corners, a gold
        // ring opens from its middle and a glint crosses it.
        <>
          <span
            className="pfx-arcane-trace pfx-arcane-top pfx-arcane-a-tx"
            style={{ ...trace, '--t': '1.1s' } as Vars}
          />
          <span
            className="pfx-arcane-trace pfx-arcane-right pfx-arcane-a-ty"
            style={{ ...trace, '--t': '1.1s' } as Vars}
          />
          <span
            className="pfx-arcane-trace pfx-arcane-bottom pfx-arcane-a-tx"
            style={{ ...trace, '--t': '1.1s' } as Vars}
          />
          <span
            className="pfx-arcane-trace pfx-arcane-left pfx-arcane-a-ty"
            style={{ ...trace, '--t': '1.1s' } as Vars}
          />
          <Rune x="50%" y={band ? band / 2 : 0} size={band ? band * 0.55 : 22 * size} d={500} />
          {!band && (
            <>
              <span
                className="pfx-arcane-halo pfx-arcane-a-ring"
                style={
                  { left: '-6%', right: '-6%', top: '-25%', bottom: '-25%', '--t': '1.4s' } as Vars
                }
              />
              <Glint timing={{ '--t': '1.1s', '--d': '.45s' } as Vars} />
              <Motes list={rise} />
            </>
          )}
        </>
      ) : (
        // Gold light runs along the top border left to right, then the bottom right to left.
        <>
          <span
            className="pfx-arcane-trace pfx-arcane-top pfx-arcane-a-tx"
            style={{ ...trace, '--t': '1s' } as Vars}
          />
          <span
            className="pfx-arcane-trace pfx-arcane-bottom pfx-arcane-a-tx"
            style={{ ...trace, '--t': '1s', '--d': '.22s' } as Vars}
          />
        </>
      )}
      {mode === 'full' &&
        // Now and then a slow gold glint crosses the panel; a frame's only along its bands.
        (band ? (
          <>
            <Glint band={band} sync={phase} />
            <Glint band={band} edge="bottom" sync={phase} />
          </>
        ) : (
          <Glint sync={phase} />
        ))}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span
            className="pfx-arcane-rim pfx-arcane-a-glow"
            style={{ ...rim('var(--pfx-t6)'), '--t': '.7s' } as Vars}
          />
          <Rune x="50%" y={band ? band / 2 : 0} size={band ? band * 0.55 : 16 * size} />
          {!band && <Motes list={lift} />}
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-arcane-rim pfx-arcane-gold pfx-arcane-a-glow"
            style={{ ...rim('var(--pfx-g6)'), '--t': '1.6s' } as Vars}
          />
          {band ? (
            <>
              <Glint band={band} timing={{ '--t': '1s', '--d': '.1s' } as Vars} />
              <Glint band={band} edge="bottom" timing={{ '--t': '1s', '--d': '.25s' } as Vars} />
            </>
          ) : (
            <>
              <span
                className="pfx-arcane-halo pfx-arcane-a-ring"
                style={
                  { left: '-6%', right: '-6%', top: '-25%', bottom: '-25%', '--t': '1.3s' } as Vars
                }
              />
              <Glint timing={{ '--t': '1s', '--d': '.25s' } as Vars} />
              <Motes list={crown} gold />
            </>
          )}
        </Fragment>
      )}
    </>
  );
}

function Track({ hit, hits, win }: TrackFxProps) {
  // A poll's vote strikes the edge every half second or so: its pulse is a quick flash.
  const thin = hit ? Math.abs(hit.to - hit.from) <= 0.004 : false;
  return (
    <>
      {hit && hits > 0 && (
        <Fragment key={`h${hits}`}>
          <span className="pfx-arcane-run" style={segment(hit)}>
            <span
              className="pfx-arcane-bolt pfx-arcane-a-bolt"
              style={thin ? ({ '--t': '.45s' } as Vars) : undefined}
            />
          </span>
          <Rune x={pct(hit.to)} y="50%" size={18} t={thin ? 450 : 600} d={thin ? 60 : 300} />
        </Fragment>
      )}
      {win > 0 && (
        // Gold fills the bar, a ring ripples out from its middle and a glint sweeps across it.
        <Fragment key={`w${win}`}>
          <span className="pfx-arcane-wash pfx-arcane-a-glow" style={{ '--t': '1.6s' } as Vars} />
          <span
            className="pfx-arcane-halo pfx-arcane-a-ring"
            style={{ left: '-2%', right: '-2%', top: 0, bottom: 0 }}
          />
          <span
            className="pfx-arcane-glint pfx-arcane-a-sweep"
            style={{ '--t': '.9s', '--d': '.3s' } as Vars}
          />
        </Fragment>
      )}
    </>
  );
}

function Burst({ seed, hit, hits, win, left, right, y, height }: BurstFxProps) {
  const drift = useMemo(() => {
    if (!hit) return [];
    const next = rng(seedOf(`${seed}:${hit.key}`));
    const x = left + (right - left) * hit.to;
    return motes(next, {
      count: 6,
      from: (n) => [x + between(n, -6, 6), y + between(n, -height / 3, height / 4)],
      rise: [34, 80],
      drift: 26,
      size: [7, 10],
      ms: [900, 1500],
      delay: 260,
      jitter: 260,
    });
  }, [seed, hit, left, right, y, height]);
  const crown = useMemo(
    () =>
      motes(rng(seedOf(`${seed}:w${win}`)), {
        count: 8,
        from: (n) => [
          between(n, left + 20, right - 20),
          y - height / 2 + between(n, 0, height / 3),
        ],
        rise: [40, 96],
        drift: 22,
        size: [7, 10],
        ms: [1000, 1600],
        delay: 250,
        jitter: 700,
      }),
    [seed, win, left, right, y, height],
  );
  // The win's ring opens round the whole bar, from its middle to just past its ends.
  const wide = (right - left) * 1.04;
  const tall = height * 1.9;
  return (
    <>
      {hits > 0 && (
        <Fragment key={`h${hits}`}>
          <Motes list={drift} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-arcane-halo pfx-arcane-a-ring"
            style={
              {
                left: (left + right) / 2 - wide / 2,
                top: y - tall / 2,
                width: wide,
                height: tall,
                borderWidth: 3,
                '--t': '1.3s',
                '--d': '.12s',
              } as Vars
            }
          />
          <Motes list={crown} gold />
        </Fragment>
      )}
    </>
  );
}

function Pulse({ seed, pulse, win, enter, round }: PulseFxProps) {
  const lift = useMemo(
    () =>
      motes(rng(seedOf(`${seed}:${pulse}`)), {
        count: 3,
        from: (next) => [pct(between(next, 0.38, 0.62)), pct(between(next, 0.3, 0.5))],
        rise: round ? [14, 26] : [22, 44],
        drift: 14,
        size: [6, 8],
        ms: [800, 1200],
        delay: 120,
        jitter: 160,
      }),
    [seed, pulse, round],
  );
  const crown = useMemo(
    () =>
      motes(rng(seedOf(`${seed}:w${win}`)), {
        count: 5,
        from: (next) => [pct(between(next, 0.3, 0.7)), pct(between(next, 0.3, 0.6))],
        rise: round ? [16, 30] : [30, 60],
        drift: 18,
        size: [6, 9],
        ms: [900, 1400],
        delay: 150,
        jitter: 400,
      }),
    [seed, win, round],
  );
  return (
    <>
      {/* A chat line comes in with a thin teal line drawn along its bottom. */}
      {enter && (
        <span className="pfx-arcane-line pfx-arcane-a-tx" style={{ '--t': '.9s' } as Vars} />
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <Rune x="50%" y="50%" size={30} t={650} />
          <Motes list={lift} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-arcane-halo pfx-arcane-a-ring"
            style={
              round ? { inset: '6%' } : { left: '-20%', right: '-20%', top: '-30%', bottom: '-30%' }
            }
          />
          <Rune x="50%" y="50%" size={36} t={800} gold />
          <Motes list={crown} gold />
        </Fragment>
      )}
    </>
  );
}

export const arcane: EffectModule = {
  id: 'arcane',
  css,
  vars: (skin: Skin) => ({
    '--pfx-t': skin.colors.accent,
    '--pfx-t6': rgba(skin.colors.accent, 0.6),
    '--pfx-t3': rgba(skin.colors.accent, 0.3),
    '--pfx-t0': rgba(skin.colors.accent, 0),
    // The energy's bright core: the accent lifted toward white, so it reads over a teal fill.
    '--pfx-l': shade(skin.accent, 84),
    '--pfx-l7': shade(skin.accent, 84, 0.7),
    '--pfx-l3': shade(skin.accent, 84, 0.3),
    '--pfx-l0': shade(skin.accent, 84, 0),
    '--pfx-g': skin.colors.win,
    '--pfx-gl': shade(skin.win, 86),
    '--pfx-g6': rgba(skin.colors.win, 0.6),
    '--pfx-g4': rgba(skin.colors.win, 0.4),
    '--pfx-g3': rgba(skin.colors.win, 0.3),
    '--pfx-g0': rgba(skin.colors.win, 0),
  }),
  Panel,
  Track,
  Burst,
  Pulse,
};
