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

// Blossom: Flower's blossoms. Little flowers (🌸 🌺 🌼 🌷) and pink petals float in the air around a
// bar all the time. What the bar gains catches a pink sheen as the fill grows, and a cherry
// blossom opens where the fill stops and lets a few petals go. A win blooms a row of flowers in a
// flurry of petals. Panels come in with a blossom on a corner, a pulse pops one on the top edge,
// and now and then a single petal drifts across them.

/** The idle loop; each panel plays it at its own moment. */
const IDLE_MS = 12_000;
/** How many flowers and petals float around a bar, each on a loop of its own. */
const AIR = 8;
/** The flowers that bloom and float; a blossom opens where a bar's fill stops. */
const FLOWERS = ['🌸', '🌺', '🌼', '🌷'] as const;

const css = `.pfx-blossom-petal{position:absolute;width:calc(var(--s,14px)*.5);height:var(--s,14px);margin:calc(var(--s,14px)*-.5) 0 0 calc(var(--s,14px)*-.25);opacity:0;border-radius:50%/42% 42% 58% 58%;background:linear-gradient(0deg,#f6a3ad,#f7cee0 36%,#fff3f8 74%);box-shadow:0 0 1.5px rgba(122,40,74,.5)}
.pfx-blossom-flower{position:absolute;display:flex;align-items:center;justify-content:center;width:var(--s,40px);height:var(--s,40px);margin:calc(var(--s,40px)*-.5) 0 0 calc(var(--s,40px)*-.5);opacity:0;font:calc(var(--s,40px)*.86)/1 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;text-shadow:0 1px 2px rgba(74,12,46,.4)}
.pfx-blossom-sheen{position:absolute;top:0;bottom:0;opacity:0;transform-origin:0 50%;background:linear-gradient(90deg,rgba(255,240,247,0),rgba(255,240,247,.38) 62%,rgba(255,255,255,.8)),linear-gradient(180deg,rgba(255,255,255,.5),rgba(255,255,255,.12) 45%,rgba(249,183,255,.34) 80%,rgba(246,163,173,.16))}
.pfx-blossom-ride{position:absolute;top:0;bottom:0}
.pfx-blossom-head{position:absolute;top:0;bottom:0;right:100%;width:26px;opacity:0;background:linear-gradient(90deg,rgba(249,183,255,0),rgba(255,226,240,.55) 55%,rgba(255,255,255,.95) 88%,rgba(255,255,255,0))}
.pfx-blossom-pollen{position:absolute;width:var(--s,5px);height:var(--s,5px);margin:calc(var(--s,5px)*-.5) 0 0 calc(var(--s,5px)*-.5);opacity:0;border-radius:50%;background:radial-gradient(circle at 36% 32%,#fffbe2 0 20%,var(--pfx-p) 46%,var(--pfx-p0) 76%);box-shadow:0 0 4px var(--pfx-y6)}
.pfx-blossom-rim{position:absolute;inset:0;opacity:0;border-radius:inherit;box-shadow:inset 0 0 14px 1px var(--pfx-y6)}
.pfx-blossom-rim.pfx-blossom-win{box-shadow:inset 0 0 18px 2px var(--pfx-g5)}
.pfx-blossom-wash{position:absolute;inset:0;opacity:0;background:linear-gradient(180deg,rgba(255,244,248,.4),var(--pfx-g4) 55%,rgba(255,244,248,.22))}
.pfx-blossom-carrier{position:absolute;left:0;right:0;height:0}
.pfx-blossom-glow{position:absolute;inset:-15%;opacity:0;border-radius:50%;background:radial-gradient(closest-side,rgba(255,252,240,.5),var(--pfx-g4) 50%,var(--pfx-g0))}
${motionOk(`@keyframes pfx-blossom-bloom{0%{opacity:0;transform:rotate(calc(var(--rot,0deg) - 90deg)) scale(0);animation-timing-function:cubic-bezier(.25,.75,.4,1)}6%{opacity:1}19%{transform:rotate(calc(var(--rot,0deg) + 3deg)) scale(1.15);animation-timing-function:ease-in-out}28%{transform:rotate(var(--rot,0deg)) scale(1)}72%{opacity:1;transform:rotate(calc(var(--rot,0deg) + 5deg)) scale(1);animation-timing-function:cubic-bezier(.45,0,.8,.5)}100%{opacity:0;transform:rotate(calc(var(--rot,0deg) + 12deg)) scale(.45)}}
@keyframes pfx-blossom-sheen{0%{opacity:1;transform:scaleX(0);animation-timing-function:cubic-bezier(.2,.9,.3,1.1)}55%{opacity:1;transform:scaleX(1);animation-timing-function:ease-in}100%{opacity:0;transform:scaleX(1)}}
@keyframes pfx-blossom-ride{0%{transform:translateX(0);animation-timing-function:cubic-bezier(.2,.9,.3,1.1)}55%,100%{transform:translateX(100%)}}
@keyframes pfx-blossom-head{0%{opacity:0}5%,50%{opacity:1}100%{opacity:0}}
@keyframes pfx-blossom-pollen{0%{opacity:0;transform:translate(0,0) scale(.3)}20%{opacity:1;transform:translate(calc(var(--dx)*.2),calc(var(--dy)*.2)) scale(1.15)}60%{opacity:.95}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.6)}}
@keyframes pfx-blossom-fall{0%{opacity:0;transform:translate(0,0) rotate(var(--r0)) scaleX(1)}8%{opacity:1}24%{transform:translate(calc(var(--dx)*.2 + var(--sw)),calc(var(--dy)*.14 + var(--lift))) rotate(calc(var(--r0) + var(--spin)*.24)) scaleX(.5)}50%{transform:translate(calc(var(--dx)*.48 - var(--sw)),calc(var(--dy)*.45)) rotate(calc(var(--r0) + var(--spin)*.5)) scaleX(1)}76%{opacity:.95;transform:translate(calc(var(--dx)*.75 + var(--sw)),calc(var(--dy)*.74)) rotate(calc(var(--r0) + var(--spin)*.76)) scaleX(.55)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(calc(var(--r0) + var(--spin))) scaleX(1)}}
@keyframes pfx-blossom-float{0%{opacity:0;transform:translate(0,0) rotate(var(--r0)) scaleX(1)}12.5%{opacity:var(--o);transform:translate(calc(var(--dx)*.125),calc(var(--a)*.71 + var(--sink)*.125)) rotate(calc(var(--r0) + var(--spin)*.125)) scaleX(.8)}25%{transform:translate(calc(var(--dx)*.25),calc(var(--a) + var(--sink)*.25)) rotate(calc(var(--r0) + var(--spin)*.25)) scaleX(.6)}37.5%{transform:translate(calc(var(--dx)*.375),calc(var(--a)*.71 + var(--sink)*.375)) rotate(calc(var(--r0) + var(--spin)*.375)) scaleX(.82)}50%{transform:translate(calc(var(--dx)*.5),calc(var(--sink)*.5)) rotate(calc(var(--r0) + var(--spin)*.5)) scaleX(1)}62.5%{transform:translate(calc(var(--dx)*.625),calc(var(--a)*-.71 + var(--sink)*.625)) rotate(calc(var(--r0) + var(--spin)*.625)) scaleX(.8)}75%{transform:translate(calc(var(--dx)*.75),calc(var(--a)*-1 + var(--sink)*.75)) rotate(calc(var(--r0) + var(--spin)*.75)) scaleX(.6)}87.5%{opacity:var(--o);transform:translate(calc(var(--dx)*.875),calc(var(--a)*-.71 + var(--sink)*.875)) rotate(calc(var(--r0) + var(--spin)*.875)) scaleX(.82)}100%{opacity:0;transform:translate(var(--dx),var(--sink)) rotate(calc(var(--r0) + var(--spin))) scaleX(1)}}
@keyframes pfx-blossom-drift{0%{opacity:0;transform:translate(0,0) rotate(var(--r0))}12.5%{opacity:var(--o);transform:translate(calc(var(--dx)*.125),calc(var(--a)*.71 + var(--sink)*.125)) rotate(calc(var(--r0) + var(--spin)*.125))}25%{transform:translate(calc(var(--dx)*.25),calc(var(--a) + var(--sink)*.25)) rotate(calc(var(--r0) + var(--spin)*.25))}37.5%{transform:translate(calc(var(--dx)*.375),calc(var(--a)*.71 + var(--sink)*.375)) rotate(calc(var(--r0) + var(--spin)*.375))}50%{transform:translate(calc(var(--dx)*.5),calc(var(--sink)*.5)) rotate(calc(var(--r0) + var(--spin)*.5))}62.5%{transform:translate(calc(var(--dx)*.625),calc(var(--a)*-.71 + var(--sink)*.625)) rotate(calc(var(--r0) + var(--spin)*.625))}75%{transform:translate(calc(var(--dx)*.75),calc(var(--a)*-1 + var(--sink)*.75)) rotate(calc(var(--r0) + var(--spin)*.75))}87.5%{opacity:var(--o);transform:translate(calc(var(--dx)*.875),calc(var(--a)*-.71 + var(--sink)*.875)) rotate(calc(var(--r0) + var(--spin)*.875))}100%{opacity:0;transform:translate(var(--dx),var(--sink)) rotate(calc(var(--r0) + var(--spin)))}}
@keyframes pfx-blossom-glow{0%{opacity:0}20%{opacity:1}100%{opacity:0}}
@keyframes pfx-blossom-carry{0%,80%{transform:translateX(0)}100%{transform:translateX(var(--run))}}
@keyframes pfx-blossom-idle{0%,80%{opacity:0;transform:translate(0,0) rotate(0deg) scaleX(1)}83%{opacity:.85}87%{transform:translate(0,calc(var(--dy)*.3)) rotate(calc(var(--spin)*.3)) scaleX(.5)}92%{transform:translate(0,calc(var(--dy)*.62)) rotate(calc(var(--spin)*.6)) scaleX(1)}96%{opacity:.85;transform:translate(0,calc(var(--dy)*.85)) rotate(calc(var(--spin)*.85)) scaleX(.55)}99%,100%{opacity:0;transform:translate(0,var(--dy)) rotate(var(--spin)) scaleX(1)}}
.pfx-blossom-a-bloom{animation:pfx-blossom-bloom var(--t,1.6s) linear var(--d,0s) backwards}
.pfx-blossom-a-sheen{animation:pfx-blossom-sheen var(--t,1.3s) linear var(--d,0s) backwards}
.pfx-blossom-a-ride{animation:pfx-blossom-ride var(--t,1.3s) linear var(--d,0s) backwards}
.pfx-blossom-a-head{animation:pfx-blossom-head var(--t,1.3s) ease-in var(--d,0s) backwards}
.pfx-blossom-a-pollen{animation:pfx-blossom-pollen var(--t,1s) ease-out var(--d,0s) backwards}
.pfx-blossom-a-fall{animation:pfx-blossom-fall var(--t,1.8s) ease-in-out var(--d,0s) backwards}
.pfx-blossom-a-float{animation:pfx-blossom-float var(--t,11s) linear var(--sync,0s) infinite}
.pfx-blossom-a-drift{animation:pfx-blossom-drift var(--t,11s) linear var(--sync,0s) infinite}
.pfx-blossom-a-glow{animation:pfx-blossom-glow var(--t,1s) ease-out var(--d,0s) backwards}
.pfx-blossom-a-carry{animation:pfx-blossom-carry ${IDLE_MS}ms linear var(--sync,0s) infinite}
.pfx-blossom-a-idle{animation:pfx-blossom-idle ${IDLE_MS}ms ease-in-out var(--sync,0s) infinite}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;
const px = (value: number) => `${Math.round(value * 10) / 10}px`;
const ms = (value: number) => `${Math.round(value)}ms`;
const deg = (value: number) => `${Math.round(value)}deg`;
const sign = (next: () => number) => (next() < 0.5 ? -1 : 1);

/** A spot on a layer: a share of its size, plus px. */
type Spot = readonly [share: number, offset: number];

function place([share, offset]: Spot): string {
  if (share === 0) return px(offset);
  if (Math.abs(offset) < 0.05) return pct(share);
  return `calc(${pct(share)} + ${px(offset)})`;
}

/** What a hit lights: its new segment, or a sliver at the edge when nothing grew (a poll vote). */
function segment(hit: FxHit): CSSProperties {
  const width = Math.abs(hit.to - hit.from);
  return width > 0.004
    ? { left: pct(Math.min(hit.from, hit.to)), width: pct(width) }
    : { left: `calc(${pct(hit.to)} - 5px)`, width: 10 };
}

interface Bloom {
  id: number;
  x: string;
  y: string;
  size: number;
  flower: string;
  /** How it's tilted once open, in degrees. */
  tilt: number;
  t: number;
  d: number;
}

/** A flower that opens with a quarter turn, overshoots a little, holds, then closes and fades. */
function bloom(
  next: () => number,
  id: number,
  x: Spot,
  y: Spot,
  size: number,
  t: number,
  d: number,
  flower: string = FLOWERS[0],
): Bloom {
  return { id, x: place(x), y: place(y), size, flower, tilt: between(next, -15, 15), t, d };
}

function Flowers({ list }: { list: readonly Bloom[] }) {
  return list.map((bloom) => (
    <span
      key={bloom.id}
      className="pfx-blossom-flower pfx-blossom-a-bloom"
      style={
        {
          left: bloom.x,
          top: bloom.y,
          '--s': px(bloom.size),
          '--rot': deg(bloom.tilt),
          '--t': ms(bloom.t),
          '--d': ms(bloom.d),
        } as Vars
      }
    >
      {bloom.flower}
    </span>
  ));
}

interface Petal {
  id: number;
  x: number | string;
  y: number | string;
  dx: number;
  dy: number;
  lift: number;
  sway: number;
  r0: number;
  spin: number;
  /** Its length, in px. */
  size: number;
  t: number;
  d: number;
}

interface PetalDrift {
  count: number;
  /** Where each one comes loose: px, or a percentage of the layer it's drawn in. */
  from: (next: () => number) => [number | string, number | string];
  /** Where it drifts to, in px, as ranges; down is positive. */
  dx: [number, number];
  dy: [number, number];
  /** How far it's lifted first, in px (negative is up), as a range. */
  lift: [number, number];
  /** How far it sways from side to side, in px. */
  sway: number;
  /** How far it turns over the whole drift, at most, in degrees. */
  spin: number;
  size: [number, number];
  ms: [number, number];
  delay?: number;
  /** Extra random delay, up to this many ms. */
  jitter?: number;
}

/** Petals drifting on the air with a sway and a slow turn, the same for the same generator. */
function petals(next: () => number, drift: PetalDrift): Petal[] {
  return Array.from({ length: drift.count }, (_, id) => {
    const [x, y] = drift.from(next);
    return {
      id,
      x,
      y,
      dx: between(next, drift.dx[0], drift.dx[1]),
      dy: between(next, drift.dy[0], drift.dy[1]),
      lift: between(next, drift.lift[0], drift.lift[1]),
      sway: between(next, drift.sway / 2, drift.sway) * sign(next),
      r0: between(next, 0, 360),
      spin: between(next, drift.spin / 2, drift.spin) * sign(next),
      size: between(next, drift.size[0], drift.size[1]),
      t: between(next, drift.ms[0], drift.ms[1]),
      d: (drift.delay ?? 0) + between(next, 0, drift.jitter ?? 0),
    };
  });
}

interface Shed {
  /** The flower they come loose from: its center and size. */
  x: Spot;
  y: Spot;
  size: number;
  count: number;
  /** The directions they leave it in, in degrees (0 is right, 90 is down), spread evenly. */
  angle: [number, number];
  /** How far they're carried out from it and how far they sink, in px, as ranges. */
  out: [number, number];
  fall: [number, number];
  /** A breeze carrying them all one way, in px; negative is left. */
  wind: number;
  sway: number;
  /** How long a petal is, as a share of the flower's size. */
  length: number;
  ms: [number, number];
  delay: number;
  jitter: number;
}

/** Petals coming loose from a flower, each pointing out the way it grew, then drifting off. */
function shed(next: () => number, spec: Shed): Petal[] {
  const ring = spec.size * 0.27;
  const [first, last] = spec.angle;
  return Array.from({ length: spec.count }, (_, id) => {
    const angle = first + ((last - first) * (id + between(next, 0.2, 0.8))) / spec.count;
    const cos = Math.cos((angle * Math.PI) / 180);
    const sin = Math.sin((angle * Math.PI) / 180);
    const out = between(next, spec.out[0], spec.out[1]);
    const turn = sign(next);
    return {
      id,
      x: place([spec.x[0], spec.x[1] + cos * ring]),
      y: place([spec.y[0], spec.y[1] + sin * ring]),
      dx: cos * out + spec.wind * between(next, 0.6, 1),
      dy: sin * out * 0.6 + between(next, spec.fall[0], spec.fall[1]),
      // One that leaves upward rises a little before it sinks.
      lift: Math.min(0, sin) * out * 0.3,
      sway: between(next, spec.sway / 2, spec.sway) * turn,
      r0: angle + 90,
      spin: between(next, 110, 220) * turn,
      size: spec.size * spec.length * between(next, 0.9, 1.08),
      t: between(next, spec.ms[0], spec.ms[1]),
      d: spec.delay + between(next, 0, spec.jitter),
    };
  });
}

function Petals({ list }: { list: readonly Petal[] }) {
  return list.map((petal) => (
    <span
      key={petal.id}
      className="pfx-blossom-petal pfx-blossom-a-fall"
      style={
        {
          left: petal.x,
          top: petal.y,
          '--s': px(petal.size),
          '--dx': px(petal.dx),
          '--dy': px(petal.dy),
          '--lift': px(petal.lift),
          '--sw': px(petal.sway),
          '--r0': deg(petal.r0),
          '--spin': deg(petal.spin),
          '--t': ms(petal.t),
          '--d': ms(petal.d),
        } as Vars
      }
    />
  ));
}

/** Flowers and the petals around them, played together. */
interface Scene {
  blooms: Bloom[];
  petals: Petal[];
}

function Scenery({ scene }: { scene: Scene }) {
  return (
    <>
      <Flowers list={scene.blooms} />
      <Petals list={scene.petals} />
    </>
  );
}

/** The idle petal's path: its height on the panel, which way it crosses, how far it turns. */
interface Drift {
  top: number | string;
  /** How far its carrier moves, as a percentage of the panel's width. */
  run: string;
  left: string;
  spin: number;
}

/** Around a webcam, petals keep to the frame's top and bottom bands and drift along them. */
function banded(next: () => number, count: number, band: number, size: number, jitter: number) {
  return petals(next, {
    count,
    from: (n) => [
      pct(between(n, 0.05, 0.85)),
      n() < 0.5 ? band / 2 : `calc(100% - ${px(band / 2)})`,
    ],
    dx: [30 * size, 90 * size],
    dy: [-band * 0.12, band * 0.12],
    lift: [0, 0],
    sway: band * 0.15,
    spin: 240,
    size: [band * 0.6, band * 0.85],
    ms: [1400, 2200],
    jitter,
  });
}

/** A panel comes in with a blossom on its bottom right corner, which lets two petals go. */
function cornerEntrance(next: () => number, size: number): Scene {
  const head = Math.round(34 * size);
  const spot: Spot = [1, -Math.round(head * 0.22)];
  return {
    blooms: [bloom(next, 0, spot, spot, head, 1600, 0)],
    petals: shed(next, {
      x: spot,
      y: spot,
      size: head,
      count: 2,
      angle: [-30, 100],
      out: [10 * size, 20 * size],
      fall: [12 * size, 24 * size],
      wind: 8 * size,
      sway: 4 * size,
      length: 0.4,
      ms: [1300, 1800],
      delay: 520,
      jitter: 300,
    }),
  };
}

/** A card that comes in big: a large blossom on the corner, three small flowers beside it, and petals
 * blown off across the card. */
function heroEntrance(next: () => number, size: number): Scene {
  const large = Math.round(60 * size);
  const small = Math.round(30 * size);
  const corner = -Math.round(large * 0.14);
  const beside = corner - large * 0.6 - small * 0.5;
  return {
    blooms: [
      bloom(next, 0, [1, corner], [1, corner], large, 2200, 0),
      bloom(next, 1, [1, beside], [1, -small * 0.12], small, 1900, 170, FLOWERS[3]),
      bloom(next, 2, [1, -small * 0.12], [1, beside], small, 1900, 280, FLOWERS[2]),
      bloom(
        next,
        3,
        [1, beside - small * 1.15],
        [1, small * 0.04],
        small * 0.86,
        1900,
        400,
        FLOWERS[1],
      ),
    ],
    petals: petals(next, {
      count: 10,
      from: (n) => [
        place([1, -between(n, 0, large * 1.5)]),
        place([1, -between(n, large * 0.1, large * 0.9)]),
      ],
      dx: [-240 * size, -110 * size],
      dy: [-30 * size, 16 * size],
      lift: [-26 * size, -8 * size],
      sway: 9 * size,
      spin: 300,
      size: [13 * size, 18 * size],
      ms: [1800, 2600],
      delay: 450,
      jitter: 1000,
    }),
  };
}

/** Around a webcam the flowers stay inside the frame's band, at its bottom right corner. */
function bandEntrance(next: () => number, band: number, size: number, big: boolean): Scene {
  const mid = -band / 2;
  const head = Math.max(6, Math.round(band * 0.85));
  const blooms = [bloom(next, 0, [1, mid], [1, mid], head, big ? 2200 : 1600, 0)];
  if (big) {
    blooms.push(
      bloom(next, 1, [1, mid - band * 1.1], [1, mid], head * 0.75, 1900, 170, FLOWERS[3]),
      bloom(next, 2, [1, mid], [1, mid - band * 1.1], head * 0.75, 1900, 280, FLOWERS[2]),
    );
  }
  return {
    blooms,
    petals: petals(next, {
      count: big ? 5 : 2,
      from: (n) => [place([1, mid - between(n, 0, band)]), place([1, mid])],
      dx: [-90 * size, -30 * size],
      dy: [-band * 0.1, band * 0.1],
      lift: [0, 0],
      sway: band * 0.12,
      spin: 240,
      size: [band * 0.55, band * 0.8],
      ms: [1400, 2100],
      delay: 450,
      jitter: big ? 900 : 300,
    }),
  };
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const big = mode === 'hero';
  const size = Math.min(1.4, Math.max(0.5, scale));
  const band = ring ? Math.round(ring) : 0;
  const [entrance, idle] = useMemo((): [Scene, Drift] => {
    const next = rng(seed);
    const right = next() < 0.5;
    const drift: Drift = {
      top: band ? band / 2 : pct(between(next, 0.12, 0.42)),
      run: right ? '94%' : '-94%',
      left: right ? '3%' : '97%',
      spin: between(next, 160, 260) * (right ? 1 : -1),
    };
    if (band) return [bandEntrance(next, band, size, big), drift];
    return [big ? heroEntrance(next, size) : cornerEntrance(next, size), drift];
  }, [seed, band, big, size]);
  // A pulse pops a small blossom on the top edge, and two of its petals fall.
  const popped = useMemo((): Scene => {
    const next = rng(seedOf(`${seed}:${pulse}`));
    const x: Spot = [between(next, 0.15, 0.85), 0];
    if (band) {
      const y: Spot = [0, band / 2];
      return {
        blooms: [bloom(next, 0, x, y, Math.max(6, Math.round(band * 0.8)), 1200, 0)],
        petals: petals(next, {
          count: 2,
          from: () => [place(x), place(y)],
          dx: [-70 * size, 70 * size],
          dy: [-band * 0.1, band * 0.1],
          lift: [0, 0],
          sway: band * 0.12,
          spin: 220,
          size: [band * 0.55, band * 0.8],
          ms: [1100, 1600],
          delay: 330,
          jitter: 200,
        }),
      };
    }
    const y: Spot = [0, 0];
    const head = Math.round(24 * size);
    return {
      blooms: [bloom(next, 0, x, y, head, 1200, 0)],
      petals: shed(next, {
        x,
        y,
        size: head,
        count: 2,
        angle: [25, 155],
        out: [6 * size, 12 * size],
        fall: [16 * size, 30 * size],
        wind: 0,
        sway: 5 * size,
        length: 0.42,
        ms: [1100, 1600],
        delay: 330,
        jitter: 200,
      }),
    };
  }, [seed, pulse, band, size]);
  // A win blooms a row of flowers along the top edge, one after another, in a flurry of petals.
  const field = useMemo((): Scene => {
    const next = rng(seedOf(`${seed}:w${win}`));
    const head = band ? Math.max(6, Math.round(band * 0.85)) : Math.round(32 * size);
    return {
      blooms: Array.from({ length: 5 }, (_, id) =>
        bloom(
          next,
          id,
          [(id + 0.5) / 5 + between(next, -0.04, 0.04), 0],
          [0, band ? band / 2 : between(next, -3, 3) * size],
          head * between(next, 0.86, 1),
          1900,
          id * 150 + between(next, 0, 60),
          FLOWERS[id % FLOWERS.length],
        ),
      ),
      petals: band
        ? banded(next, 10, band, size, 700)
        : petals(next, {
            count: 16,
            from: (n) => [pct(between(n, -0.05, 0.8)), pct(between(n, -0.12, 0.3))],
            dx: [60 * size, 150 * size],
            dy: [40 * size, 90 * size],
            lift: [0, 0],
            sway: 10 * size,
            spin: 300,
            size: [12 * size, 18 * size],
            ms: [1600, 2600],
            delay: 200,
            jitter: 900,
          }),
    };
  }, [seed, win, band, size]);
  const rim = band
    ? { boxShadow: `inset 0 0 ${Math.round(band * 0.8)}px var(--pfx-y6)` }
    : undefined;
  const petal = band ? Math.min(14 * size, band * 0.8) : 14 * size;
  return (
    <>
      <Scenery scene={entrance} />
      {mode === 'full' && (
        // Now and then one petal drifts across the panel, carried by a layer as wide as it.
        <span
          className="pfx-blossom-carrier pfx-blossom-a-carry"
          style={{ top: idle.top, '--run': idle.run, '--sync': ms(-seed * IDLE_MS) } as Vars}
        >
          <span
            className="pfx-blossom-petal pfx-blossom-a-idle"
            style={
              {
                left: idle.left,
                '--s': px(petal),
                '--dy': px(band ? band * 0.15 : 22 * size),
                '--spin': deg(idle.spin),
              } as Vars
            }
          />
        </span>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span
            className="pfx-blossom-rim pfx-blossom-a-glow"
            style={{ ...rim, '--t': '.8s' } as Vars}
          />
          <Scenery scene={popped} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-blossom-rim pfx-blossom-win pfx-blossom-a-glow"
            style={
              {
                ...(band
                  ? { boxShadow: `inset 0 0 ${Math.round(band * 0.8)}px var(--pfx-g5)` }
                  : {}),
                '--t': '1.8s',
              } as Vars
            }
          />
          <Scenery scene={field} />
        </Fragment>
      )}
    </>
  );
}

interface Speck {
  id: number;
  x: string;
  y: string;
  dx: number;
  dy: number;
  size: number;
  t: number;
  d: number;
}

/** Golden pollen along what a bar gained, each speck showing as the sheen passes it. */
function pollen(next: () => number, hit: FxHit, count: number): Speck[] {
  const start = Math.min(hit.from, hit.to);
  const span = Math.abs(hit.to - hit.from);
  return Array.from({ length: count }, (_, id) => {
    const along = (id + between(next, 0.15, 0.85)) / count;
    return {
      id,
      x: pct(start + span * along),
      y: pct(between(next, 0.22, 0.78)),
      dx: between(next, -6, 8),
      dy: -between(next, 4, 12),
      size: between(next, 4, 6),
      t: between(next, 900, 1300),
      // The fill's edge covers most of the way early on, and the sheen rides it.
      d: 60 + 380 * along * along,
    };
  });
}

function Pollen({ list }: { list: readonly Speck[] }) {
  return list.map((speck) => (
    <span
      key={speck.id}
      className="pfx-blossom-pollen pfx-blossom-a-pollen"
      style={
        {
          left: speck.x,
          top: speck.y,
          '--s': px(speck.size),
          '--dx': px(speck.dx),
          '--dy': px(speck.dy),
          '--t': ms(speck.t),
          '--d': ms(speck.d),
        } as Vars
      }
    />
  ));
}

/** A glow that rides the fill's edge across what it gained, as the fill slides there. */
function Sweep({ style }: { style: CSSProperties }) {
  return (
    <>
      <span className="pfx-blossom-sheen pfx-blossom-a-sheen" style={style} />
      <span className="pfx-blossom-ride pfx-blossom-a-ride" style={style}>
        <span className="pfx-blossom-head pfx-blossom-a-head" />
      </span>
    </>
  );
}

function Track({ seed, hit, hits, win }: TrackFxProps) {
  const strike = useMemo(() => {
    if (!hit) return null;
    const next = rng(seedOf(`${seed}:${hit.key}`));
    return {
      specks: pollen(next, hit, 4),
      // A poll's vote grows nothing and has no stage: a little blossom pops at the fill's edge.
      mini: [bloom(next, 0, [hit.to, 0], [0.5, 0], 30, 800, 0)],
    };
  }, [seed, hit]);
  const flurry = useMemo(
    () =>
      petals(rng(seedOf(`${seed}:w${win}`)), {
        count: 6,
        from: (n) => [pct(between(n, -0.05, 0.7)), pct(between(n, 0.15, 0.85))],
        dx: [90, 200],
        dy: [-8, 10],
        lift: [0, 0],
        sway: 5,
        spin: 280,
        size: [13, 17],
        ms: [1400, 2200],
        delay: 150,
        jitter: 700,
      }),
    [seed, win],
  );
  const thin = hit ? Math.abs(hit.to - hit.from) <= 0.004 : false;
  return (
    <>
      {hit && strike && hits > 0 && (
        <Fragment key={`h${hits}`}>
          {thin ? (
            <>
              <span
                className="pfx-blossom-sheen pfx-blossom-a-sheen"
                style={{ ...segment(hit), '--t': '.5s' } as Vars}
              />
              <Flowers list={strike.mini} />
            </>
          ) : (
            <>
              <Sweep style={segment(hit)} />
              <Pollen list={strike.specks} />
            </>
          )}
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span className="pfx-blossom-wash pfx-blossom-a-glow" style={{ '--t': '1.8s' } as Vars} />
          <Sweep style={{ left: 0, width: '100%', '--t': '1.9s' } as Vars} />
          <Petals list={flurry} />
        </Fragment>
      )}
    </>
  );
}

interface Floater {
  id: number;
  x: number;
  y: number;
  dx: number;
  /** How far it rises and falls on the way, and how far it sinks over the whole drift, in px. */
  wave: number;
  sink: number;
  r0: number;
  spin: number;
  size: number;
  opacity: number;
  t: number;
  /** Where in its loop it is when it mounts, in ms. */
  phase: number;
}

/** The rows the floating petals keep to, as shares of the bar's height from its center. */
const ROWS: readonly [number, number][] = [
  [-1.3, -0.95],
  [-0.65, -0.15],
  [0.2, 0.55],
];

/** Which way the breeze blows around a bar: the same for its floating petals and loose ones. */
const breezeOf = (seed: number) => (seedOf(`${seed}:breeze`) < 0.5 ? -1 : 1);

/** Petals floating in the air around a bar, each on a slow loop of its own with the breeze. */
function floating(
  next: () => number,
  breeze: number,
  left: number,
  right: number,
  y: number,
  height: number,
): Floater[] {
  return Array.from({ length: AIR }, (_, id) => {
    const t = between(next, 8000, 14000);
    // Never slower than 8px a second, so none of them rests over a label for long.
    const dx = ((between(next, 8, 16) * t) / 1000) * breeze;
    const slot = left + ((right - left) * (id + between(next, 0.2, 0.8))) / AIR;
    const lowest = left - 12 - Math.min(dx, 0);
    const highest = right + 12 - Math.max(dx, 0);
    const [top, bottom] = ROWS[id % ROWS.length];
    return {
      id,
      // Its whole drift stays over the bar's length.
      x: Math.min(Math.max(slot - dx / 2, lowest), highest),
      y: y + height * between(next, top, bottom),
      dx,
      wave: height * between(next, 0.1, 0.2) * sign(next),
      sink: height * between(next, -0.08, 0.08),
      // A flower turns a little as it drifts; a petal tumbles.
      r0: id % 2 === 0 ? between(next, -20, 20) : between(next, 0, 360),
      spin: (id % 2 === 0 ? between(next, 30, 90) : between(next, 120, 280)) * sign(next),
      // Big enough to read on stream, not a speck: the flowers are what catches the eye.
      size: id % 2 === 0 ? between(next, 28, 36) : between(next, 22, 30),
      // Flowers stay bright. Petals in the highest row float over the overlay's labels, so they're
      // the faintest.
      opacity:
        id % 2 === 0
          ? between(next, 0.92, 1)
          : id % ROWS.length === 0
            ? between(next, 0.7, 0.82)
            : between(next, 0.85, 0.97),
      t,
      phase: between(next, 0, t),
    };
  });
}

function Air({ list }: { list: readonly Floater[] }) {
  return list.map((petal) => (
    <span
      key={petal.id}
      className={
        petal.id % 2 === 0
          ? 'pfx-blossom-flower pfx-blossom-a-drift'
          : 'pfx-blossom-petal pfx-blossom-a-float'
      }
      style={
        {
          left: px(petal.x),
          top: px(petal.y),
          '--s': px(petal.size),
          '--dx': px(petal.dx),
          '--a': px(petal.wave),
          '--sink': px(petal.sink),
          '--r0': deg(petal.r0),
          '--spin': deg(petal.spin),
          '--o': String(Math.round(petal.opacity * 100) / 100),
          '--t': ms(petal.t),
          '--sync': ms(-petal.phase),
        } as Vars
      }
    >
      {petal.id % 2 === 0 ? FLOWERS[(petal.id / 2) % FLOWERS.length] : null}
    </span>
  ));
}

function Burst({ seed, hit, hits, win, left, right, y, height }: BurstFxProps) {
  // Always there while the bar is, and never replayed: hits and wins leave it as it is.
  const air = useMemo(
    () => floating(rng(seedOf(`${seed}:air`)), breezeOf(seed), left, right, y, height),
    [seed, left, right, y, height],
  );
  const bloomed = useMemo((): Scene | null => {
    if (!hit) return null;
    const next = rng(seedOf(`${seed}:${hit.key}`));
    const x: Spot = [0, left + (right - left) * hit.to];
    const at: Spot = [0, y];
    const size = Math.round(height * 1.3);
    const first = between(next, -180, 180);
    return {
      // It opens as the fill's edge gets there.
      blooms: [bloom(next, 0, x, at, size, 1600, 160)],
      petals: shed(next, {
        x,
        y: at,
        size,
        count: next() < 0.5 ? 3 : 4,
        angle: [first, first + 360],
        out: [16, 34],
        fall: [26, 52],
        wind: 18 * breezeOf(seed),
        sway: 8,
        length: 0.3,
        ms: [1500, 2300],
        delay: 680,
        jitter: 330,
      }),
    };
  }, [seed, hit, left, right, y, height]);
  const field = useMemo((): Scene => {
    const next = rng(seedOf(`${seed}:w${win}`));
    const breeze = breezeOf(seed);
    const size = Math.round(height * 1.15);
    return {
      blooms: Array.from({ length: 6 }, (_, id) =>
        bloom(
          next,
          id,
          [0, left + ((right - left) * (id + 0.5)) / 6 + between(next, -14, 14)],
          [0, y + between(next, -0.12, 0.12) * height],
          size * between(next, 0.88, 1.04),
          1900,
          id * 170 + between(next, 0, 50),
          FLOWERS[id % FLOWERS.length],
        ),
      ),
      petals: petals(next, {
        count: 16,
        from: (n) => [
          breeze > 0 ? between(n, left - 30, right - 140) : between(n, left + 140, right + 30),
          y - height / 2 - between(n, 0, 80),
        ],
        dx: [80 * breeze, 170 * breeze],
        dy: [50, 110],
        lift: [0, 0],
        sway: 12,
        spin: 300,
        size: [13, 19],
        ms: [1700, 2600],
        delay: 250,
        jitter: 900,
      }),
    };
  }, [seed, win, left, right, y, height]);
  return (
    <>
      <Air list={air} />
      {bloomed && hits > 0 && (
        <Fragment key={`h${hits}`}>
          <Scenery scene={bloomed} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <Scenery scene={field} />
        </Fragment>
      )}
    </>
  );
}

function Pulse({ seed, pulse, win, enter, round }: PulseFxProps) {
  const drifting = useMemo(
    () =>
      // A chat line: one petal drifts off its end.
      petals(rng(seed), {
        count: 1,
        from: () => ['calc(100% - 6px)', '60%'],
        dx: [24, 36],
        dy: [12, 20],
        lift: [-6, -2],
        sway: 4,
        spin: 200,
        size: [12, 15],
        ms: [1300, 1600],
        delay: 150,
      }),
    [seed],
  );
  // A blossom pops over the number and two of its petals fall.
  const popped = useMemo((): Scene => {
    const next = rng(seedOf(`${seed}:${pulse}`));
    const x: Spot = [0.5, 0];
    const y: Spot = [round ? 0.3 : 0.22, 0];
    const size = round ? 30 : 40;
    return {
      blooms: [bloom(next, 0, x, y, size, 1000, 0)],
      petals: shed(next, {
        x,
        y,
        size,
        count: 2,
        angle: [30, 150],
        out: [6, 12],
        fall: round ? [10, 18] : [22, 38],
        wind: 0,
        sway: 5,
        length: 0.36,
        ms: [1000, 1400],
        delay: 280,
        jitter: 160,
      }),
    };
  }, [seed, pulse, round]);
  const field = useMemo((): Scene => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return {
      blooms: [bloom(next, 0, [0.5, 0], [round ? 0.5 : 0.42, 0], round ? 44 : 60, 1900, 0)],
      petals: petals(next, {
        count: 10,
        from: (n) => [pct(between(n, 0.4, 0.6)), pct(between(n, 0.35, 0.55))],
        dx: round ? [-30, 30] : [-60, 60],
        dy: round ? [10, 30] : [30, 70],
        lift: round ? [-20, -10] : [-40, -20],
        sway: 8,
        spin: 280,
        size: [12, 17],
        ms: [1400, 2200],
        delay: 200,
        jitter: 300,
      }),
    };
  }, [seed, win, round]);
  return (
    <>
      {enter && <Petals list={drifting} />}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <Scenery scene={popped} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-blossom-glow pfx-blossom-a-glow"
            style={{ ...(round ? { inset: 0 } : {}), '--t': '1.4s' } as Vars}
          />
          <Scenery scene={field} />
        </Fragment>
      )}
    </>
  );
}

export const blossom: EffectModule = {
  id: 'blossom',
  css,
  vars: (skin: Skin) => ({
    // Glows in the accent; pollen a little deeper, so it shows on the fill.
    '--pfx-y6': rgba(skin.colors.accent, 0.6),
    '--pfx-p': shade(skin.accent, 48),
    '--pfx-p0': shade(skin.accent, 48, 0),
    // A win's glows, in the win color.
    '--pfx-g5': rgba(skin.colors.win, 0.5),
    '--pfx-g4': rgba(skin.colors.win, 0.4),
    '--pfx-g0': rgba(skin.colors.win, 0),
  }),
  Panel,
  Track,
  Burst,
  Pulse,
};
