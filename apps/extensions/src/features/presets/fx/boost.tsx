import { type CSSProperties, Fragment, useMemo } from 'react';
import { rgba, shade } from '../color';
import type { Skin } from '../skin';
import { between, motionOk, rng, seedOf } from './primitives';
import type { BurstFxProps, EffectModule, PanelFxProps, PulseFxProps, TrackFxProps } from './types';

// Boost: speed. A bar's new edge boosts forward under a white flare while speed lines stream
// back over the fill and a short flame trail burns behind it; a win goes off as a shockwave.
// Panels streak in, and now and then a bright streak runs along their top edge.

/** The idle loop; each panel plays it at its own moment. */
const IDLE_MS = 9000;
/**
 * How long the bars slide their fill to a new edge (Sub Goal .7 s, Subathon .6 s, both on
 * cubic-bezier(.2,.9,.3,1.1)): the flare rides the edge and the flames drop behind it.
 */
const RIDE_MS = 650;
/** Where the flames drop along the last stretch of the slide; the last two burn at the edge. */
const TRAIL = [0, 0.25, 0.5, 0.75, 1, 1];

const css = `.pfx-boost-ride{position:absolute;top:0;bottom:0;left:0;width:100%}
.pfx-boost-flare{position:absolute;top:-12%;bottom:-12%;left:0;width:96px;margin-left:-60px;opacity:0;transform-origin:60px 50%;background:radial-gradient(closest-side,#fff,rgba(255,255,255,.9) 22%,var(--pfx-l6) 52%,var(--pfx-l0))}
.pfx-boost-beam{position:absolute;top:50%;left:0;width:230px;height:2px;margin:-1px 0 0 -160px;opacity:0;transform-origin:160px 50%;background:linear-gradient(90deg,var(--pfx-l0),var(--pfx-l6) 45%,#fff 70%,var(--pfx-l0))}
.pfx-boost-streak{position:absolute;right:100%;opacity:0;border-radius:2px;transform-origin:100% 50%;background:linear-gradient(90deg,var(--pfx-l0),var(--pfx-l6) 55%,#fff)}
.pfx-boost-flame{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side,#fff,#ffe7b0 30%,rgba(255,150,40,.85) 56%,rgba(255,104,24,0))}
.pfx-boost-flash{position:absolute;inset:0;opacity:0;border-radius:inherit;background:rgba(255,255,255,.85)}
.pfx-boost-wash{position:absolute;inset:0;opacity:0;border-radius:inherit;background:radial-gradient(closest-side,var(--pfx-w6),var(--pfx-w0))}
.pfx-boost-wave{position:absolute;opacity:0;border-radius:50%;border:3px solid #fff;box-shadow:0 0 12px 2px var(--pfx-w),inset 0 0 12px 2px var(--pfx-w)}
.pfx-boost-glow{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side,#fff,rgba(255,255,255,.7) 30%,var(--pfx-w5) 62%,var(--pfx-w0))}
.pfx-boost-ray{position:absolute;opacity:0;border-radius:2px;background:linear-gradient(90deg,var(--pfx-w0),var(--pfx-w) 50%,#fff)}
.pfx-boost-wave.pfx-boost-cool{box-shadow:0 0 12px 2px var(--pfx-a),inset 0 0 12px 2px var(--pfx-a)}
.pfx-boost-ray.pfx-boost-cool{background:linear-gradient(90deg,var(--pfx-l0),var(--pfx-l) 50%,#fff)}
.pfx-boost-clip{position:absolute;inset:0;overflow:hidden;border-radius:inherit}
.pfx-boost-line{position:absolute;left:0;opacity:0;border-radius:2px;background:linear-gradient(90deg,#fff,var(--pfx-l6) 30%,var(--pfx-l0))}
.pfx-boost-line.pfx-boost-hot{background:linear-gradient(90deg,#fff,var(--pfx-w) 30%,var(--pfx-w0))}
.pfx-boost-rim{position:absolute;inset:0;opacity:0;border-radius:inherit;border:2px solid var(--pfx-l);box-shadow:inset 0 0 10px var(--pfx-a6)}
.pfx-boost-rim.pfx-boost-hot{border-color:#fff}
.pfx-boost-zip{position:absolute;top:0;left:0;width:22%;opacity:0;background:linear-gradient(90deg,var(--pfx-l0),var(--pfx-l6) 50%,#fff 90%,var(--pfx-l0))}
.pfx-boost-wake{position:absolute;left:0;right:0;bottom:0;height:2px;opacity:0;transform-origin:100% 50%;background:linear-gradient(90deg,var(--pfx-l6),var(--pfx-l0))}
.pfx-boost-dash{position:absolute;left:0;bottom:0;width:30%;height:2px;opacity:0;background:linear-gradient(90deg,#fff,var(--pfx-l) 25%,var(--pfx-l0))}
${motionOk(`@keyframes pfx-boost-ride{0%{transform:translateX(var(--x0));animation-timing-function:cubic-bezier(.2,.9,.3,1.1)}${RIDE_MS / 10}%,100%{transform:translateX(var(--x1))}}
@keyframes pfx-boost-flare{0%{opacity:0;transform:scaleX(.3)}16%{opacity:1;transform:scaleX(1.15)}100%{opacity:0;transform:scaleX(.8)}}
@keyframes pfx-boost-beam{0%{opacity:0;transform:scaleX(0)}22%{opacity:1;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1.3)}}
@keyframes pfx-boost-streak{0%{opacity:0;transform:translateX(0) scaleX(.12)}14%{opacity:1}100%{opacity:0;transform:translateX(var(--dx)) scaleX(1)}}
@keyframes pfx-boost-flame{0%{opacity:0;transform:translate(0,0) scale(.45)}12%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.4)}}
@keyframes pfx-boost-fade{0%{opacity:1}100%{opacity:0}}
@keyframes pfx-boost-wave{0%{opacity:1;transform:scale(.1)}55%{opacity:.9}100%{opacity:0;transform:scale(1)}}
@keyframes pfx-boost-glow{0%{opacity:0;transform:scale(.4)}14%{opacity:1}100%{opacity:0;transform:scale(1.2)}}
@keyframes pfx-boost-ray{0%{opacity:0;transform:translate(var(--x0),var(--y0)) rotate(var(--r)) scaleX(.3)}18%{opacity:1}100%{opacity:0;transform:translate(var(--x1),var(--y1)) rotate(var(--r)) scaleX(1)}}
@keyframes pfx-boost-cross{0%{opacity:1;transform:translateX(var(--x0))}70%{opacity:1}100%{opacity:0;transform:translateX(-100%)}}
@keyframes pfx-boost-dash{0%{opacity:0;transform:translateX(var(--x0))}12%{opacity:1}100%{opacity:0;transform:translateX(0)}}
@keyframes pfx-boost-wake{0%{opacity:1;transform:scaleX(0);animation-timing-function:ease-out}45%{opacity:.8;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1)}}
@keyframes pfx-boost-zip{0%,95.4%{opacity:0;transform:translateX(0);animation-timing-function:cubic-bezier(.45,0,.25,1)}96%{opacity:1}99.3%{opacity:.9}100%{opacity:0;transform:translateX(355%)}}
.pfx-boost-a-ride{animation:pfx-boost-ride 1s linear backwards}
.pfx-boost-a-flare{animation:pfx-boost-flare var(--t,.55s) ease-out var(--d,0s) backwards}
.pfx-boost-a-beam{animation:pfx-boost-beam var(--t,.45s) ease-out var(--d,0s) backwards}
.pfx-boost-a-streak{animation:pfx-boost-streak var(--t,.5s) cubic-bezier(.2,.7,.3,1) var(--d,0s) backwards}
.pfx-boost-a-flame{animation:pfx-boost-flame var(--t,.5s) ease-out var(--d,0s) backwards}
.pfx-boost-a-fade{animation:pfx-boost-fade var(--t,.4s) ease-out var(--d,0s) backwards}
.pfx-boost-a-wave{animation:pfx-boost-wave var(--t,.75s) cubic-bezier(.15,.6,.3,1) var(--d,0s) backwards}
.pfx-boost-a-glow{animation:pfx-boost-glow var(--t,.5s) ease-out var(--d,0s) backwards}
.pfx-boost-a-ray{animation:pfx-boost-ray var(--t,.5s) cubic-bezier(.2,.7,.3,1) var(--d,0s) backwards}
.pfx-boost-a-cross{animation:pfx-boost-cross var(--t,.45s) linear var(--d,0s) backwards}
.pfx-boost-a-dash{animation:pfx-boost-dash var(--t,.45s) ease-out var(--d,0s) backwards}
.pfx-boost-a-wake{animation:pfx-boost-wake var(--t,1s) linear var(--d,0s) backwards}
.pfx-boost-a-zip{animation:pfx-boost-zip ${IDLE_MS}ms linear var(--sync,0s) infinite}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;
const px = (value: number) => `${Math.round(value)}px`;
const ms = (value: number) => `${Math.round(value)}ms`;
const degrees = (radians: number) => Math.round((radians * 180) / Math.PI);

/** A shockwave's box: around a panel or a number, `grow` times the usual, or inside a ring. */
function around(grow: number, round = false): Vars {
  if (round) return { inset: pct(Math.max(0.04, 0.3 - 0.17 * grow)) };
  const side = pct(-0.1 * grow);
  const end = pct(-0.25 * grow);
  return { left: side, right: side, top: end, bottom: end };
}

/** An ellipse's box on the stage, in px. */
const ellipse = (cx: number, cy: number, rx: number, ry: number): Vars => ({
  left: Math.round(cx - rx),
  top: Math.round(cy - ry),
  width: Math.round(rx * 2),
  height: Math.round(ry * 2),
});

/** When, in ms, the bars' sliding fill has come `share` of the way to its new edge. */
function rideAt(share: number): number {
  const curve = (p1: number, p2: number, s: number) =>
    3 * (1 - s) ** 2 * s * p1 + 3 * (1 - s) * s ** 2 * p2 + s ** 3;
  let low = 0;
  let high = 0.75;
  for (let step = 0; step < 12; step++) {
    const mid = (low + high) / 2;
    if (curve(0.9, 1.1, mid) < share) low = mid;
    else high = mid;
  }
  return RIDE_MS * curve(0.2, 0.3, low);
}

interface Line {
  id: number;
  /** Where it runs: a percentage of the box, or px into a frame's band. */
  top: string;
  /** Its length, as a fraction of the box's width. */
  width: number;
  h: number;
  t: number;
  d: number;
}

/** Speed lines spread down a box, each to cross it right to left. */
function speedLines(next: () => number, count: number, size: number, spread: number): Line[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    top: pct(0.1 + (0.8 * (id + 0.5 + between(next, -0.35, 0.35))) / count),
    width: between(next, 0.26, 0.5),
    h: Math.max(1, Math.round(between(next, 1.6, 3) * size)),
    t: between(next, 340, 520),
    d: between(next, 0, spread),
  }));
}

/** The same in a frame's band, top and bottom, never across the picture inside it. */
function bandLines(
  next: () => number,
  ring: number,
  size: number,
  perBand: number,
  spread: number,
): Line[] {
  const h = Math.max(1, Math.min(Math.round(2 * size), Math.floor(ring / 4)));
  return Array.from({ length: perBand * 2 }, (_, id) => {
    const depth = Math.round(((((id % perBand) + 0.5) / perBand) * 0.8 + 0.1) * ring);
    return {
      id,
      top: id < perBand ? `${depth}px` : `calc(100% - ${depth}px)`,
      width: between(next, 0.22, 0.4),
      h,
      t: between(next, 380, 560),
      d: between(next, 0, spread),
    };
  });
}

function Lines({ list, hot }: { list: readonly Line[]; hot?: boolean }) {
  return (
    <span className="pfx-boost-clip">
      {list.map((line) => (
        <span
          key={line.id}
          className={`pfx-boost-line${hot ? ' pfx-boost-hot' : ''} pfx-boost-a-cross`}
          style={
            {
              top: line.top,
              width: pct(line.width),
              height: line.h,
              marginTop: -line.h / 2,
              // From just past the right edge, in its own widths, to just past the left.
              '--x0': `${Math.round(100 / line.width)}%`,
              '--t': ms(line.t),
              '--d': ms(line.d),
            } as Vars
          }
        />
      ))}
    </span>
  );
}

interface Ray {
  id: number;
  /** Where it's thrown from: stage px, or a percentage of the box. */
  x: number | string;
  y: number | string;
  /** Where it flies, in px from there. */
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  r: number;
  length: number;
  h: number;
  t: number;
  d: number;
}

/** Short speed lines flung off a box's edge, straight out from where they start. */
function boxRays(next: () => number, count: number, size: number, delay: number): Ray[] {
  return Array.from({ length: count }, (_, id) => {
    const angle = ((id + between(next, -0.3, 0.3)) / count) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const reach = between(next, 22, 40) * size;
    const x1 = cos * reach;
    const y1 = sin * reach * 0.8;
    return {
      id,
      x: pct(0.5 + 0.5 * cos),
      y: pct(0.5 + 0.5 * sin),
      x0: 0,
      y0: 0,
      x1,
      y1,
      r: degrees(Math.atan2(y1, x1)),
      length: between(next, 14, 26) * size,
      h: Math.max(1.5, Math.round(4 * size) / 2),
      t: between(next, 420, 600),
      d: delay + between(next, 0, 120),
    };
  });
}

/** Speed lines thrown off a bar's shockwave as it passes them, square to the ring. */
function ringRays(
  next: () => number,
  count: number,
  cx: number,
  cy: number,
  a: number,
  b: number,
): Ray[] {
  return Array.from({ length: count }, (_, id) => {
    const angle = ((id + between(next, -0.3, 0.3)) / count) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const at = between(next, 0.42, 0.58);
    // The ring's normal there, so a line off the bar's long side flies straight up or down.
    const nx = cos / a;
    const ny = sin / b;
    const norm = Math.hypot(nx, ny);
    const reach = between(next, 30, 56);
    const x0 = a * at * cos;
    const y0 = b * at * sin;
    return {
      id,
      x: cx,
      y: cy,
      x0,
      y0,
      x1: x0 + (nx / norm) * reach,
      y1: y0 + (ny / norm) * reach,
      r: degrees(Math.atan2(ny, nx)),
      length: between(next, 20, 34),
      h: 2.5,
      t: between(next, 440, 620),
      d: between(next, 80, 200),
    };
  });
}

function Rays({ list, cool }: { list: readonly Ray[]; cool?: boolean }) {
  return list.map((ray) => {
    const length = Math.round(ray.length);
    return (
      <span
        key={ray.id}
        className={`pfx-boost-ray${cool ? ' pfx-boost-cool' : ''} pfx-boost-a-ray`}
        style={
          {
            left: ray.x,
            top: ray.y,
            width: length,
            height: ray.h,
            margin: `${-ray.h / 2}px 0 0 ${-length / 2}px`,
            '--x0': px(ray.x0),
            '--y0': px(ray.y0),
            '--x1': px(ray.x1),
            '--y1': px(ray.y1),
            '--r': `${ray.r}deg`,
            '--t': ms(ray.t),
            '--d': ms(ray.d),
          } as Vars
        }
      />
    );
  });
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const size = Math.min(1.4, Math.max(0.5, scale));
  const hero = mode === 'hero' && !ring;
  const entrance = useMemo(() => {
    const next = rng(seed);
    if (ring) return { lines: bandLines(next, ring, size, 2, 200), rays: [] };
    if (hero) {
      return { lines: speedLines(next, 8, size * 1.25, 240), rays: boxRays(next, 8, size, 300) };
    }
    return { lines: speedLines(next, scale < 0.8 ? 3 : 5, size, 180), rays: [] };
  }, [seed, ring, hero, scale, size]);
  const boosted = useMemo(() => {
    const next = rng(seedOf(`${seed}:p${pulse}`));
    return ring ? bandLines(next, ring, size, 1, 80) : speedLines(next, 3, size, 90);
  }, [seed, pulse, ring, size]);
  const shock = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return ring
      ? { lines: bandLines(next, ring, size, 2, 160), rays: [] }
      : { lines: [], rays: boxRays(next, 10, size, 70) };
  }, [seed, win, ring, size]);
  // A frame around a webcam keeps its glow inside its band, off the picture.
  const rim = ring
    ? { boxShadow: `inset 0 0 ${Math.min(10, Math.round(ring))}px var(--pfx-a6)` }
    : {};
  return (
    <>
      <Lines list={entrance.lines} />
      {hero && (
        // A card that comes in big lands with a shockwave.
        <>
          <span
            className="pfx-boost-wave pfx-boost-cool pfx-boost-a-wave"
            style={{ ...around(1.6), '--t': '.7s', '--d': '.3s' } as Vars}
          />
          <Rays list={entrance.rays} cool />
        </>
      )}
      {mode === 'full' && (
        <span
          className="pfx"
          style={{ inset: 0, '--sync': `${-Math.round(seed * IDLE_MS)}ms` } as Vars}
        >
          <span
            className="pfx-boost-zip pfx-boost-a-zip"
            style={{ height: Math.max(2, Math.round(3 * size)) }}
          />
        </span>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span
            className="pfx-boost-rim pfx-boost-a-fade"
            style={{ ...rim, '--t': '.4s' } as Vars}
          />
          <Lines list={boosted} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          {ring ? (
            <>
              <span
                className="pfx-boost-rim pfx-boost-hot pfx-boost-a-fade"
                style={
                  {
                    boxShadow: `inset 0 0 ${Math.round(ring * 0.8)}px ${Math.round(ring / 5)}px var(--pfx-w6)`,
                    '--t': '1.1s',
                  } as Vars
                }
              />
              <Lines list={shock.lines} hot />
            </>
          ) : (
            <>
              <span
                className="pfx-boost-glow pfx-boost-a-glow"
                style={{ inset: '-8%', '--t': '.55s' } as Vars}
              />
              <span
                className="pfx-boost-wave pfx-boost-a-wave"
                style={{ ...around(1.6), '--t': '.8s' } as Vars}
              />
              <span
                className="pfx-boost-wave pfx-boost-a-wave"
                style={{ ...around(0.8), borderWidth: 2, '--t': '.65s', '--d': '.12s' } as Vars}
              />
              <Rays list={shock.rays} />
            </>
          )}
        </Fragment>
      )}
    </>
  );
}

interface Streak {
  id: number;
  top: number;
  width: number;
  h: number;
  dx: number;
  t: number;
  d: number;
}

function Track({ seed, hit, hits, win }: TrackFxProps) {
  const streaks = useMemo((): Streak[] => {
    if (!hit) return [];
    const next = rng(seedOf(`${seed}:${hit.key}`));
    // A poll's vote moves nothing and can come every half second: one line fewer.
    const count = Math.abs(hit.to - hit.from) > 0.004 ? 4 : 3;
    return Array.from({ length: count }, (_, id) => ({
      id,
      top: 0.14 + (0.72 * (id + 0.5 + between(next, -0.3, 0.3))) / count,
      width: between(next, 70, 150),
      h: Math.round(between(next, 2, 3) * 2) / 2,
      dx: -between(next, 30, 90),
      t: between(next, 380, 560),
      d: id * 45 + between(next, 0, 90),
    }));
  }, [seed, hit]);
  return (
    <>
      {hit && hits > 0 && (
        <Fragment key={`h${hits}`}>
          {/* Rides the fill's edge as it slides to its new place, streaming lines behind it. */}
          <span
            className="pfx-boost-ride pfx-boost-a-ride"
            style={{ '--x0': pct(hit.from), '--x1': pct(hit.to) } as Vars}
          >
            {streaks.map((streak) => (
              <span
                key={streak.id}
                className="pfx-boost-streak pfx-boost-a-streak"
                style={
                  {
                    top: pct(streak.top),
                    width: Math.round(streak.width),
                    height: streak.h,
                    marginTop: -streak.h / 2,
                    '--dx': px(streak.dx),
                    '--t': ms(streak.t),
                    '--d': ms(streak.d),
                  } as Vars
                }
              />
            ))}
            <span className="pfx-boost-flare pfx-boost-a-flare" />
            <span className="pfx-boost-beam pfx-boost-a-beam" />
          </span>
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span className="pfx-boost-flash pfx-boost-a-fade" style={{ '--t': '.35s' } as Vars} />
          <span className="pfx-boost-wash pfx-boost-a-fade" style={{ '--t': '1.3s' } as Vars} />
          {/* The shockwave's ring, cut by the bar into two fronts racing to its ends. */}
          <span
            className="pfx-boost-wave pfx-boost-a-wave"
            style={{ left: '4%', right: '4%', top: '-150%', bottom: '-150%' }}
          />
        </Fragment>
      )}
    </>
  );
}

interface Flame {
  id: number;
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  t: number;
  d: number;
}

function Burst({ seed, hit, hits, win, left, right, y, height }: BurstFxProps) {
  const flames = useMemo((): Flame[] => {
    if (!hit) return [];
    const next = rng(seedOf(`${seed}:${hit.key}`));
    const start = left + (right - left) * hit.from;
    const end = left + (right - left) * hit.to;
    const gain = Math.abs(end - start);
    const back = end < start ? 1 : -1;
    // A short trail: each flame drops as the sliding edge passes, the last two burn at the edge.
    const trail = Math.min(gain, 72);
    return TRAIL.map((at, id) => {
      const x = end + back * trail * (1 - at);
      const when = gain < 1 ? id * 50 : rideAt(Math.abs(x - start) / gain);
      return {
        id,
        x: x + between(next, -3, 3),
        y: y + between(next, -0.18, 0.18) * height,
        size: between(next, 10, 16),
        dx: back * between(next, 16, 40),
        dy: between(next, -8, 6),
        t: between(next, 340, 540),
        d: when + (id === TRAIL.length - 1 ? 120 : 0) + between(next, 0, 30),
      };
    });
  }, [seed, hit, left, right, y, height]);
  const shock = useMemo(() => {
    const cx = (left + right) / 2;
    const a = ((right - left) * 1.1) / 2;
    const b = height * 1.7;
    return { cx, a, b, rays: ringRays(rng(seedOf(`${seed}:w${win}`)), 12, cx, y, a, b) };
  }, [seed, win, left, right, y, height]);
  const { cx, a, b } = shock;
  return (
    <>
      {hits > 0 && (
        <Fragment key={`h${hits}`}>
          {flames.map((flame) => {
            const size = Math.round(flame.size);
            return (
              <span
                key={flame.id}
                className="pfx-boost-flame pfx-boost-a-flame"
                style={
                  {
                    left: Math.round(flame.x),
                    top: Math.round(flame.y),
                    width: size,
                    height: size,
                    margin: `${-size / 2}px 0 0 ${-size / 2}px`,
                    '--dx': px(flame.dx),
                    '--dy': px(flame.dy),
                    '--t': ms(flame.t),
                    '--d': ms(flame.d),
                  } as Vars
                }
              />
            );
          })}
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-boost-glow pfx-boost-a-glow"
            style={{ ...ellipse(cx, y, a * 0.45, b * 0.6), '--t': '.55s' } as Vars}
          />
          <span
            className="pfx-boost-wave pfx-boost-a-wave"
            style={{ ...ellipse(cx, y, a, b), '--t': '.85s' } as Vars}
          />
          <span
            className="pfx-boost-wave pfx-boost-a-wave"
            style={
              {
                ...ellipse(cx, y, a * 0.7, b * 0.7),
                borderWidth: 2,
                '--t': '.7s',
                '--d': '.12s',
              } as Vars
            }
          />
          <Rays list={shock.rays} />
        </Fragment>
      )}
    </>
  );
}

function Pulse({ seed, pulse, win, enter, round }: PulseFxProps) {
  const rays = useMemo(
    () => (round ? [] : boxRays(rng(seedOf(`${seed}:w${win}`)), 8, 0.9, 50)),
    [seed, win, round],
  );
  // Inside a ring the shockwave keeps to its circle, glow and all.
  const halo = (color: string) => (round ? { boxShadow: `inset 0 0 10px 2px ${color}` } : {});
  return (
    <>
      {enter && (
        // A chat line comes in with a speed streak along its bottom edge.
        <>
          <span className="pfx-boost-wake pfx-boost-a-wake" />
          <span className="pfx-boost-dash pfx-boost-a-dash" style={{ '--x0': '233%' } as Vars} />
        </>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span
            className="pfx-boost-wave pfx-boost-cool pfx-boost-a-wave"
            style={{ ...around(1, round), ...halo('var(--pfx-a)'), '--t': '.55s' } as Vars}
          />
          <span
            className="pfx-boost-wave pfx-boost-cool pfx-boost-a-wave"
            style={
              {
                ...around(0.6, round),
                ...halo('var(--pfx-a)'),
                borderWidth: 2,
                '--t': '.45s',
                '--d': '.08s',
              } as Vars
            }
          />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-boost-glow pfx-boost-a-glow"
            style={{ ...around(0.8, round), '--t': '.6s' } as Vars}
          />
          <span
            className="pfx-boost-wave pfx-boost-a-wave"
            style={{ ...around(1.5, round), ...halo('var(--pfx-w)'), '--t': '.8s' } as Vars}
          />
          <span
            className="pfx-boost-wave pfx-boost-a-wave"
            style={
              {
                ...around(1, round),
                ...halo('var(--pfx-w)'),
                borderWidth: 2,
                '--t': '.65s',
                '--d': '.12s',
              } as Vars
            }
          />
          <Rays list={rays} />
        </Fragment>
      )}
    </>
  );
}

export const boost: EffectModule = {
  id: 'boost',
  css,
  vars: (skin: Skin) => ({
    '--pfx-a': skin.colors.accent,
    '--pfx-a6': rgba(skin.colors.accent, 0.6),
    // The accent lit up: streaks, flares and speed lines.
    '--pfx-l': shade(skin.accent, 76),
    '--pfx-l6': shade(skin.accent, 72, 0.6),
    '--pfx-l0': shade(skin.accent, 72, 0),
    '--pfx-w': skin.colors.win,
    '--pfx-w6': rgba(skin.colors.win, 0.6),
    '--pfx-w5': rgba(skin.colors.win, 0.5),
    '--pfx-w0': rgba(skin.colors.win, 0),
  }),
  Panel,
  Track,
  Burst,
  Pulse,
};
