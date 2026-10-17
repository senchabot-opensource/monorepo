import { type CSSProperties, Fragment, useMemo } from 'react';
import { rgba, shade } from '../color';
import type { Skin } from '../skin';
import { between, motionOk, rng, seedOf } from './primitives';
import type { BurstFxProps, EffectModule, PanelFxProps, PulseFxProps, TrackFxProps } from './types';

// Boost: speed. A bar's new edge boosts forward under a white flare while speed lines stream
// back over the fill and a short flame trail burns behind it, and a rocket takes off from it; a
// win goes off as a shockwave that sends a volley of rockets flying. Panels streak in, and now and
// then a bright streak runs along their top edge.

const ROCKET = '🚀';

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
.pfx-boost-rocket{position:absolute;display:flex;align-items:center;justify-content:center;width:var(--s,28px);height:var(--s,28px);margin:calc(var(--s,28px)*-.5) 0 0 calc(var(--s,28px)*-.5);opacity:0;font:calc(var(--s,28px)*.86)/1 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;text-shadow:0 0 calc(var(--s,28px)*.25) var(--pfx-l6)}
.pfx-boost-rocket.pfx-boost-hot{text-shadow:0 0 calc(var(--s,28px)*.3) var(--pfx-w6)}
${motionOk(`@keyframes pfx-boost-launch{0%{opacity:0;transform:translate(0,0) rotate(var(--r)) scale(.3);animation-timing-function:cubic-bezier(.2,.8,.4,1)}8%{opacity:1;transform:translate(calc(var(--dx)*-.04),calc(var(--dy)*-.04)) rotate(var(--r)) scale(1.1);animation-timing-function:ease-in-out}16%{transform:translate(0,0) rotate(var(--r)) scale(1);animation-timing-function:cubic-bezier(.45,0,.8,.55)}80%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r)) scale(.85)}}
.pfx-boost-a-launch{animation:pfx-boost-launch var(--t,1.1s) linear var(--d,0s) backwards}
@keyframes pfx-boost-ride{0%{transform:translateX(var(--x0));animation-timing-function:cubic-bezier(.2,.9,.3,1.1)}${RIDE_MS / 10}%,100%{transform:translateX(var(--x1))}}
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

/** The rocket's turn to fly at `angle` degrees (0 is right, -90 up): it's drawn pointing up-right. */
const turn = (angle: number) => `${Math.round(angle + 45)}deg`;

interface Launch {
  id: number;
  /** Where it takes off: stage px, or a percentage of the box. */
  x: number | string;
  y: number | string;
  size: number;
  /** Its flight: the angle it flies at and where it ends up, in px from where it took off. */
  angle: number;
  dx: number;
  dy: number;
  t: number;
  d: number;
}

interface Takeoff {
  count: number;
  x: number | string;
  y: number | string;
  size: [number, number];
  /** The angles they fly at, spread evenly across the range, in degrees. */
  angle: [number, number];
  reach: [number, number];
  ms: [number, number];
  delay: number;
  /** Extra random delay, up to this many ms. */
  jitter: number;
}

/** Rockets taking off from one point, each along its own angle. */
function launches(next: () => number, spec: Takeoff): Launch[] {
  const [low, high] = spec.angle;
  return Array.from({ length: spec.count }, (_, id) => {
    const angle =
      spec.count === 1
        ? between(next, low, high)
        : low + ((high - low) * (id + between(next, 0.25, 0.75))) / spec.count;
    const radians = (angle * Math.PI) / 180;
    const reach = between(next, spec.reach[0], spec.reach[1]);
    return {
      id,
      x: spec.x,
      y: spec.y,
      size: between(next, spec.size[0], spec.size[1]),
      angle,
      dx: Math.cos(radians) * reach,
      dy: Math.sin(radians) * reach,
      t: between(next, spec.ms[0], spec.ms[1]),
      d: spec.delay + between(next, 0, spec.jitter),
    };
  });
}

/** Rockets that rise a little, kick back, then blast off along their angle and fade. */
function Rockets({ list, hot }: { list: readonly Launch[]; hot?: boolean }) {
  return list.map((rocket) => (
    <span
      key={rocket.id}
      className={`pfx-boost-rocket${hot ? ' pfx-boost-hot' : ''} pfx-boost-a-launch`}
      style={
        {
          left: rocket.x,
          top: rocket.y,
          '--s': px(rocket.size),
          '--r': turn(rocket.angle),
          '--dx': px(rocket.dx),
          '--dy': px(rocket.dy),
          '--t': ms(rocket.t),
          '--d': ms(rocket.d),
        } as Vars
      }
    >
      {ROCKET}
    </span>
  ));
}

/** Two puffs of flame left behind as each rocket blasts off, blown back the way it came. */
function Puffs({ list }: { list: readonly Launch[] }) {
  return list.flatMap((rocket) => {
    const radians = (rocket.angle * Math.PI) / 180;
    return [0, 1].map((puff) => {
      const size = Math.round(rocket.size * (puff ? 0.32 : 0.44));
      const back = 14 + puff * 12;
      return (
        <span
          key={`${rocket.id}:${puff}`}
          className="pfx-boost-flame pfx-boost-a-flame"
          style={
            {
              left: rocket.x,
              top: rocket.y,
              width: size,
              height: size,
              margin: `${-size / 2}px 0 0 ${-size / 2}px`,
              '--dx': px(-Math.cos(radians) * back),
              '--dy': px(-Math.sin(radians) * back),
              '--t': ms(420 + puff * 80),
              // As it blasts off, a sixth of the way into its flight.
              '--d': ms(rocket.d + rocket.t * 0.16 + puff * 40),
            } as Vars
          }
        />
      );
    });
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
  // Around a webcam, rockets would fly over the picture: the frame keeps to its lines and glows.
  const liftoff = useMemo(() => {
    if (ring) return [];
    const next = rng(seedOf(`${seed}:r${pulse}`));
    return launches(next, {
      count: 1,
      x: pct(between(next, 0.2, 0.8)),
      y: 0,
      size: [20 * size, 24 * size],
      angle: [-110, -70],
      reach: [40 * size, 64 * size],
      ms: [850, 1050],
      delay: 40,
      jitter: 40,
    });
  }, [seed, pulse, ring, size]);
  const volley = useMemo(
    () =>
      ring
        ? []
        : launches(rng(seedOf(`${seed}:rw${win}`)), {
            count: 4,
            x: '50%',
            y: 0,
            size: [22 * size, 26 * size],
            angle: [-160, -20],
            reach: [70 * size, 130 * size],
            ms: [1100, 1400],
            delay: 80,
            jitter: 220,
          }),
    [seed, win, ring, size],
  );
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
          <Puffs list={liftoff} />
          <Rockets list={liftoff} />
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
              <Rockets list={volley} hot />
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
  const takeoff = useMemo(() => {
    if (!hit) return [];
    return launches(rng(seedOf(`${seed}:r${hit.key}`)), {
      count: 1,
      x: Math.round(left + (right - left) * hit.to),
      y: Math.round(y),
      size: [height * 0.85, height],
      angle: [-75, -50],
      reach: [120, 170],
      ms: [1000, 1250],
      // As the sliding fill gets to its new edge.
      delay: RIDE_MS * 0.55,
      jitter: 60,
    });
  }, [seed, hit, left, right, y, height]);
  const volley = useMemo(
    () =>
      launches(rng(seedOf(`${seed}:rw${win}`)), {
        count: 6,
        x: Math.round((left + right) / 2),
        y: Math.round(y),
        size: [height * 0.8, height],
        angle: [-165, -15],
        reach: [150, 260],
        ms: [1200, 1600],
        delay: 80,
        jitter: 260,
      }),
    [seed, win, left, right, y, height],
  );
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
          <Puffs list={takeoff} />
          <Rockets list={takeoff} />
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
          <Rockets list={volley} hot />
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
  // A chat line: a little rocket zooms off its end.
  const zoom = useMemo(
    () =>
      launches(rng(seedOf(`${seed}:zoom`)), {
        count: 1,
        x: 'calc(100% - 10px)',
        y: '55%',
        size: [14, 14],
        angle: [-32, -20],
        reach: [30, 40],
        ms: [800, 900],
        delay: 140,
        jitter: 0,
      }),
    [seed],
  );
  const liftoff = useMemo(
    () =>
      launches(rng(seedOf(`${seed}:r${pulse}`)), {
        count: 1,
        x: '50%',
        y: round ? '35%' : '30%',
        size: round ? [18, 20] : [24, 28],
        angle: [-105, -75],
        reach: round ? [26, 36] : [44, 64],
        ms: [850, 1050],
        delay: 30,
        jitter: 30,
      }),
    [seed, pulse, round],
  );
  const volley = useMemo(
    () =>
      launches(rng(seedOf(`${seed}:rw${win}`)), {
        count: 5,
        x: '50%',
        y: '45%',
        size: round ? [18, 22] : [24, 30],
        angle: [-160, -20],
        reach: round ? [28, 44] : [60, 110],
        ms: [1100, 1400],
        delay: 60,
        jitter: 200,
      }),
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
          <Rockets list={zoom} />
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
          <Puffs list={liftoff} />
          <Rockets list={liftoff} />
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
          <Rockets list={volley} hot />
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
