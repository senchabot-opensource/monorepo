import { type CSSProperties, Fragment, useMemo } from 'react';
import {
  between,
  motionOk,
  rng,
  type SparkSpec,
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

// Pizza: slices hang in the air around a bar, drifting and turning slowly. Every gain melts
// cheese over what the bar added, dots it with pepperoni and pops a fresh slice out of the fill's
// edge; a goal reached brings a whole pizza that spins in and flies apart into its slices. Panels
// are served a slice in their bottom corners, and now and then one floats across them.

/** The idle loop; each panel plays it at its own moment. */
const IDLE_MS = 12_000;
/** Narrower than this, a hit is a poll's vote striking the fill's edge. */
const THIN = 0.004;
/** The slice that pops inside a poll row, in px. */
const MINI = 26;

const css = `.pfx-pizza-s,.pfx-pizza-pie{position:absolute;opacity:0}
.pfx-pizza-s>svg,.pfx-pizza-pie>svg{display:block;width:100%;height:100%}
.pfx-pizza-air{z-index:-1}
.pfx-pizza-arc{position:absolute;width:0;height:0}
.pfx-pizza-carrier{position:absolute;left:0;right:0;height:0}
.pfx-pizza-pep{border-radius:50%;background:radial-gradient(circle at 36% 32%,rgba(255,196,170,.95) 0 10%,rgba(255,196,170,0) 22%),radial-gradient(circle,#bf3100 0 50%,#7a1f00 60%)}
.pfx-pizza-leaf{border-radius:0 80%;background:linear-gradient(135deg,#7fd37a,#3d9a3d 55%,#25672a)}
.pfx-pizza-crumb{border-radius:35%;background:linear-gradient(160deg,#fff6c8,#fcd959 55%,#e8a856)}
.pfx-pizza-dot{position:absolute;opacity:0;box-shadow:0 1px 2px rgba(60,10,0,.55)}
.pfx-pizza-melt{position:absolute;top:0;bottom:0;opacity:0;transform-origin:0 50%;background:radial-gradient(circle at 30% 35%,rgba(255,250,220,.8) 0 1.5px,rgba(255,250,220,0) 3px) 0 0/19px 15px,radial-gradient(circle at 65% 70%,rgba(205,110,20,.4) 0 1.5px,rgba(205,110,20,0) 3px) 6px 4px/23px 17px,linear-gradient(90deg,rgba(255,250,225,0) calc(100% - 16px),rgba(255,252,236,.95) calc(100% - 4px),rgba(255,250,225,0)),linear-gradient(180deg,#fff2b0,#fcd959 35%,#f2c24a 75%,#e8a856)}
.pfx-pizza-glint{position:absolute;top:0;bottom:0;left:0;width:100%;opacity:0;background:linear-gradient(90deg,rgba(255,252,230,0) 40%,rgba(255,252,230,.85) 50%,rgba(255,252,230,0) 60%)}
.pfx-pizza-rim{position:absolute;inset:0;border-radius:inherit;opacity:0;box-shadow:inset 0 0 16px 2px rgba(255,211,77,.7)}
.pfx-pizza-halo{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side,rgba(255,244,190,.85),rgba(255,211,77,.45) 55%,rgba(255,211,77,0))}
${motionOk(`@keyframes pfx-pizza-float{0%,100%{opacity:var(--o);transform:translate(0,0) rotate(var(--r0))}25%{transform:translate(var(--x1),var(--y1)) rotate(var(--r1))}50%{transform:translate(var(--x2),var(--y2)) rotate(var(--r2))}75%{transform:translate(var(--x3),var(--y3)) rotate(var(--r3))}}
@keyframes pfx-pizza-pop{0%{opacity:1;transform:translateY(0) rotate(0deg) scale(0);animation-timing-function:cubic-bezier(.2,.8,.4,1)}13%{transform:translateY(0) rotate(-12deg) scale(1.2);animation-timing-function:ease-in-out}21%{transform:translateY(0) rotate(9deg) scale(1)}27%{transform:translateY(0) rotate(-5deg) scale(1)}32%{transform:translateY(0) rotate(0deg) scale(1);animation-timing-function:cubic-bezier(.33,.67,.67,1)}58%{transform:translateY(var(--up)) rotate(calc(var(--spin)*.35)) scale(1);animation-timing-function:cubic-bezier(.33,0,.67,.33)}86%{opacity:1}100%{opacity:0;transform:translateY(var(--down)) rotate(var(--spin)) scale(1)}}
@keyframes pfx-pizza-hop{0%,32%{transform:translateX(0)}100%{transform:translateX(var(--dx))}}
@keyframes pfx-pizza-drift{from{transform:translateX(0)}to{transform:translateX(var(--dx))}}
@keyframes pfx-pizza-fly{0%{opacity:0;transform:translateY(0) rotate(var(--r0));animation-timing-function:cubic-bezier(.33,.67,.67,1)}7%{opacity:1}36%{transform:translateY(var(--up)) rotate(calc(var(--r0) + var(--spin)*.35));animation-timing-function:cubic-bezier(.33,0,.67,.33)}80%{opacity:1}100%{opacity:0;transform:translateY(var(--down)) rotate(calc(var(--r0) + var(--spin)))}}
@keyframes pfx-pizza-spin{0%{opacity:0;transform:rotate(-260deg) scale(0);animation-timing-function:cubic-bezier(.2,.7,.3,1)}8%{opacity:1}34%{transform:rotate(12deg) scale(1.12)}44%{transform:rotate(0deg) scale(1)}70%{opacity:1;transform:rotate(0deg) scale(1)}80%,100%{opacity:0;transform:rotate(0deg) scale(1.08)}}
@keyframes pfx-pizza-halo{0%{opacity:0;transform:scale(.3)}30%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.3)}}
@keyframes pfx-pizza-melt{0%{opacity:.92;transform:scaleX(0);animation-timing-function:cubic-bezier(.3,.6,.4,1)}38%{transform:scaleX(1)}55%{opacity:.88}100%{opacity:0;transform:scaleX(1)}}
@keyframes pfx-pizza-dot{0%{opacity:1;transform:scale(0)}25%{transform:scale(1.3)}40%{transform:scale(1)}70%{opacity:1}100%{opacity:0;transform:scale(1)}}
@keyframes pfx-pizza-glint{0%{opacity:1;transform:translateX(-60%) skewX(-20deg)}80%{opacity:1}100%{opacity:0;transform:translateX(60%) skewX(-20deg)}}
@keyframes pfx-pizza-bump{0%{opacity:1;transform:translateY(0) rotate(var(--r,0deg)) scale(0);animation-timing-function:cubic-bezier(.2,.8,.4,1)}24%{transform:translateY(0) rotate(calc(var(--r,0deg) - 12deg)) scale(1.2)}38%{transform:translateY(0) rotate(calc(var(--r,0deg) + 8deg)) scale(1)}50%{transform:translateY(0) rotate(var(--r,0deg)) scale(1);animation-timing-function:ease-in}74%{opacity:1}100%{opacity:0;transform:translateY(var(--lift,-14px)) rotate(var(--r,0deg)) scale(1)}}
@keyframes pfx-pizza-drop{0%{opacity:0;transform:translateY(var(--fall)) rotate(var(--r)) scale(1);animation-timing-function:cubic-bezier(.5,0,.85,.4)}6%{opacity:1}28%{transform:translateY(0) rotate(var(--r)) scale(1.12,.8);animation-timing-function:cubic-bezier(.2,.7,.4,1)}38%{transform:translateY(var(--hop)) rotate(var(--r)) scale(.95,1.06);animation-timing-function:cubic-bezier(.5,0,.8,.5)}47%{transform:translateY(0) rotate(var(--r)) scale(1.04,.94)}54%{transform:translateY(0) rotate(var(--r)) scale(1)}80%{opacity:1}100%{opacity:0;transform:translateY(0) rotate(var(--r)) scale(1)}}
@keyframes pfx-pizza-carry{0%,80%{transform:translateX(0)}100%{transform:translateX(var(--run))}}
@keyframes pfx-pizza-idle{0%,80%{opacity:0;transform:translateY(0) rotate(var(--r0))}84%{opacity:var(--o,.45)}88%{transform:translateY(var(--bob)) rotate(calc(var(--r0) + 9deg))}94%{transform:translateY(0) rotate(calc(var(--r0) - 7deg))}96%{opacity:var(--o,.45)}100%{opacity:0;transform:translateY(var(--bob)) rotate(var(--r0))}}
@keyframes pfx-pizza-slide{0%{opacity:0;transform:translateX(var(--run,-44px)) rotate(-160deg);animation-timing-function:cubic-bezier(.2,.75,.35,1)}12%{opacity:1}52%{transform:translateX(0) rotate(7deg)}62%{transform:translateX(0) rotate(-3deg)}70%{transform:translateX(0) rotate(0deg)}84%{opacity:1}100%{opacity:0;transform:translateX(0) rotate(0deg)}}
@keyframes pfx-pizza-glow{0%{opacity:0}22%{opacity:1}100%{opacity:0}}
.pfx-pizza-a-float{animation:pfx-pizza-float var(--t,12s) cubic-bezier(.45,.05,.55,.95) var(--sync,0s) infinite}
.pfx-pizza-a-pop{animation:pfx-pizza-pop var(--t,1.5s) linear var(--d,0s) backwards}
.pfx-pizza-a-hop{animation:pfx-pizza-hop var(--t,1.5s) linear var(--d,0s) backwards}
.pfx-pizza-a-drift{animation:pfx-pizza-drift var(--t,1.1s) linear var(--d,0s) backwards}
.pfx-pizza-a-fly{animation:pfx-pizza-fly var(--t,1.1s) linear var(--d,0s) backwards}
.pfx-pizza-a-spin{animation:pfx-pizza-spin var(--t,1.05s) linear var(--d,0s) backwards}
.pfx-pizza-a-halo{animation:pfx-pizza-halo var(--t,1.1s) ease-out var(--d,0s) backwards}
.pfx-pizza-a-melt{animation:pfx-pizza-melt var(--t,1.2s) linear var(--d,0s) backwards}
.pfx-pizza-a-dot{animation:pfx-pizza-dot var(--t,.8s) ease-out var(--d,0s) backwards}
.pfx-pizza-a-glint{animation:pfx-pizza-glint var(--t,.9s) ease-in-out var(--d,0s) backwards}
.pfx-pizza-a-bump{animation:pfx-pizza-bump var(--t,1.1s) linear var(--d,0s) backwards}
.pfx-pizza-a-drop{transform-origin:50% 90%;animation:pfx-pizza-drop var(--t,1.4s) linear var(--d,0s) backwards}
.pfx-pizza-a-carry{animation:pfx-pizza-carry ${IDLE_MS}ms linear var(--sync,0s) infinite}
.pfx-pizza-a-idle{animation:pfx-pizza-idle ${IDLE_MS}ms ease-in-out var(--sync,0s) infinite}
.pfx-pizza-a-slide{animation:pfx-pizza-slide var(--t,1.3s) linear var(--d,0s) backwards}
.pfx-pizza-a-glow{animation:pfx-pizza-glow var(--t,1.4s) ease-out var(--d,0s) backwards}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;
const px = (value: number) => `${Math.round(value * 10) / 10}px`;
const ms = (value: number) => `${Math.round(value)}ms`;
const deg = (value: number) => `${Math.round(value)}deg`;

/** A position moved by `offset` px: px as a number, or any CSS length such as a percentage. */
const at = (base: number | string, offset: number): number | string =>
  typeof base === 'number'
    ? Math.round((base + offset) * 10) / 10
    : `calc(${base} + ${px(offset)})`;

/** A square `size` px wide, centered on the point its left and top put it at. */
const square = (size: number): CSSProperties => ({
  width: px(size),
  height: px(size),
  marginLeft: px(-size / 2),
  marginTop: px(-size / 2),
});

// Pizza is pizza, whatever the preset's colors: cheese gold, a golden-brown crust, pepperoni red
// and basil green, the built-in Pizza preset's own palette. Static art, so a slice is drawn once
// and only its holder moves.

/** A slice's cheese: a wedge from the crust down to its tip, with a drip down the left side. */
const WEDGE =
  'M4.5 10.5Q20 4.6 35.5 10.5L21.7 40.8Q20 43.8 18.3 40.8L12.9 29C12.1 32.4 9 33.4 8.9 29.6C8.9 27.9 10.4 26 10.6 24Z';
/** Its crust, along the wide end. */
const CRUST = 'M3.2 11.2Q20 3.4 36.8 11.2';

const SLICE = (
  <svg viewBox="-1 2.5 43 43" aria-hidden="true">
    <g transform="translate(1.3 1.7)" opacity=".4">
      <path d={WEDGE} fill="#1e0a00" />
      <path d={CRUST} fill="none" stroke="#1e0a00" strokeWidth="7" strokeLinecap="round" />
    </g>
    <path d={WEDGE} fill="#fcd959" stroke="#e3a24a" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M10 14.2Q20 10.6 30 14.2Q25.5 18.6 20 17.6Q14.5 18.6 10 14.2Z" fill="#fff0a8" />
    <circle cx="22.6" cy="33.6" r=".9" fill="#e8a856" />
    <circle cx="27.2" cy="24.6" r=".8" fill="#e8a856" />
    <g fill="#bf3100" stroke="#7a1f00" strokeWidth="1.3">
      <circle cx="13.6" cy="16.6" r="3.6" />
      <circle cx="25.4" cy="18.2" r="3.4" />
      <circle cx="19.4" cy="28.6" r="3.3" />
    </g>
    <g fill="#e8653d">
      <circle cx="12.5" cy="15.4" r="1" />
      <circle cx="24.3" cy="17.1" r=".9" />
      <circle cx="18.4" cy="27.5" r=".9" />
    </g>
    <path d="M12 24.4Q13.2 20.6 17.2 21.4Q16.2 25.2 12 24.4Z" fill="#3d9a3d" />
    <path d="M12.9 23.9 16.4 22" stroke="#25672a" strokeWidth=".7" strokeLinecap="round" />
    <path d={CRUST} fill="none" stroke="#a5561c" strokeWidth="7" strokeLinecap="round" />
    <path d={CRUST} fill="none" stroke="#e8a856" strokeWidth="5" strokeLinecap="round" />
    <path
      d="M6 8.9Q20 3.2 34 8.9"
      fill="none"
      stroke="#f7d79f"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="11.5" cy="8.6" r=".9" fill="#b0621f" />
    <circle cx="27.5" cy="8.4" r=".8" fill="#b0621f" />
  </svg>
);

/** The whole pizza's pepperoni, one in the middle of each of its eight slices. */
const PEPPERONI = [
  [47.2, 38.3],
  [36.8, 43.5],
  [25.7, 47.2],
  [20.5, 36.8],
  [16.8, 25.7],
  [27.2, 20.5],
  [38.3, 16.8],
  [43.5, 27.2],
] as const;
/** Basil leaves near the crust of every other slice, lying along it. */
const BASIL = [
  [39.8, 50.9, 157.5],
  [13.1, 39.8, 247.5],
  [24.2, 13.1, 337.5],
  [50.9, 24.2, 67.5],
] as const;

const PIE = (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="33.2" cy="33.6" r="30" fill="#1e0a00" opacity=".4" />
    <circle cx="32" cy="32" r="30" fill="#a5561c" />
    <circle cx="32" cy="32" r="28.6" fill="#e8a856" />
    <path
      d="M7.4 24.8A26 26 0 0 1 24.8 7.4"
      fill="none"
      stroke="#f7d79f"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="32" cy="32" r="24.2" fill="#fcd959" stroke="#e3a24a" strokeWidth="1.2" />
    <ellipse cx="26" cy="25" rx="11" ry="8" fill="#fff0a8" />
    <g fill="#bf3100" stroke="#7a1f00" strokeWidth="1.3">
      {PEPPERONI.map(([x, y]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r="3.6" />
      ))}
    </g>
    <g fill="#e8653d">
      {PEPPERONI.map(([x, y]) => (
        <circle key={`${x},${y}`} cx={x - 1.1} cy={y - 1.1} r="1" />
      ))}
    </g>
    <g fill="#3d9a3d">
      {BASIL.map(([x, y, turn]) => (
        <ellipse
          key={`${x},${y}`}
          cx={x}
          cy={y}
          rx="2.8"
          ry="1.4"
          transform={`rotate(${turn} ${x} ${y})`}
        />
      ))}
    </g>
    {/* Cut into eight. */}
    <path
      d="M4 32H60M32 4V60M12.2 12.2 51.8 51.8M51.8 12.2 12.2 51.8"
      stroke="#a5561c"
      strokeWidth="1.3"
      strokeLinecap="round"
      opacity=".85"
    />
  </svg>
);

type Topping = 'pep' | 'leaf' | 'crumb';

interface Bit extends SparkSpec {
  kind: Topping;
}

const MIX: readonly Topping[] = ['pep', 'crumb', 'leaf', 'pep', 'crumb'];
/** Width and height of each topping at size 1, in px. */
const BIT_SIZE: Record<Topping, [number, number]> = { pep: [8, 8], leaf: [9, 5], crumb: [5, 4] };

/** Toppings knocked loose, thrown like sparks: pepperoni first, then basil and cheese. */
function toppings(next: () => number, spec: SparkThrow, firstId = 0): Bit[] {
  const size = spec.size ?? 1;
  return throwSparks(next, spec, firstId).map((spark, index) => {
    const kind: Topping = index === 0 ? 'pep' : MIX[Math.floor(next() * MIX.length)];
    const [w, h] = BIT_SIZE[kind];
    return { ...spark, kind, w: w * size, h: h * size, r: between(next, -80, 80) };
  });
}

/** Sparks with a topping's look each: the base rules fly them, an arc each. */
function Bits({ list }: { list: readonly Bit[] }) {
  return list.map((bit) => (
    <span
      key={bit.id}
      className="pfx-sp"
      style={
        {
          left: bit.x,
          top: bit.y,
          '--dx': px(bit.dx),
          '--t': ms(bit.t),
          '--d': ms(bit.d),
        } as Vars
      }
    >
      <i
        className={`pfx-pizza-${bit.kind}`}
        style={
          {
            width: px(bit.w),
            height: px(bit.h),
            marginLeft: px(-bit.w / 2),
            marginTop: px(-bit.h / 2),
            '--up': px(bit.up),
            '--down': px(bit.down),
            '--r': deg(bit.r),
          } as Vars
        }
      />
    </span>
  ));
}

interface Flight {
  id: number;
  x: number | string;
  y: number | string;
  size: number;
  dx: number;
  up: number;
  down: number;
  r0: number;
  spin: number;
  t: number;
  d: number;
}

interface Breakup {
  /** The pizza's center and size, in px or any CSS length. */
  x: number | string;
  y: number | string;
  pie: number;
  count: number;
  /** How far each slice flies sideways, how high it's tossed and how far below it lands, px. */
  reach: [number, number];
  toss: [number, number];
  fall: [number, number];
  /** Left and right only, keeping to a band, e.g. along a panel's top edge. */
  flat?: boolean;
  /** Each slice's size, px; about half the pizza when left out. */
  slice?: number;
  ms: [number, number];
  delay: number;
}

/** A pizza flying apart: each slice leaves from where it sat, crust first, then falls. */
function slicesOf(next: () => number, spec: Breakup): Flight[] {
  const size = spec.slice ?? spec.pie * 0.52;
  const [near, far] = spec.reach;
  const pairs = Math.ceil(spec.count / 2);
  return Array.from({ length: spec.count }, (_, id) => {
    const angle = spec.flat
      ? (id % 2 ? 180 : 0) + between(next, -35, 35)
      : 22.5 + (360 / spec.count) * id + between(next, -6, 6);
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const sit = spec.flat ? 0 : spec.pie * 0.23;
    // Along an edge, each side's slices land spread out instead of in a heap.
    const reach = spec.flat
      ? Math.sign(cos) * (near + ((far - near) * (Math.floor(id / 2) + next())) / pairs)
      : cos * between(next, near, far);
    const lift = spec.flat ? 0 : Math.max(0, -sin) * spec.toss[1] * 0.8;
    return {
      id,
      x: at(spec.x, cos * sit),
      y: at(spec.y, sin * sit),
      size,
      dx: reach,
      up: -between(next, spec.toss[0], spec.toss[1]) - lift,
      down: between(next, spec.fall[0], spec.fall[1]),
      r0: angle + 90,
      spin: (next() < 0.5 ? -1 : 1) * between(next, 120, 260),
      t: between(next, spec.ms[0], spec.ms[1]),
      d: spec.delay + between(next, 0, 80),
    };
  });
}

/** Slices in flight: the outer span drifts sideways while the slice rises, turns and falls. */
function Flights({ list }: { list: readonly Flight[] }) {
  return list.map((flight) => (
    <span
      key={flight.id}
      className="pfx-pizza-arc pfx-pizza-a-drift"
      style={
        {
          left: flight.x,
          top: flight.y,
          '--dx': px(flight.dx),
          '--t': ms(flight.t),
          '--d': ms(flight.d),
        } as Vars
      }
    >
      <span
        className="pfx-pizza-s pfx-pizza-a-fly"
        style={
          {
            ...square(flight.size),
            '--up': px(flight.up),
            '--down': px(flight.down),
            '--r0': deg(flight.r0),
            '--spin': deg(flight.spin),
          } as Vars
        }
      >
        {SLICE}
      </span>
    </span>
  ));
}

/** A whole pizza that spins in on a point, sits a moment, then gives way to its slices. */
function Pie({ x, y, size }: { x: number | string; y: number | string; size: number }) {
  return (
    <span className="pfx-pizza-pie pfx-pizza-a-spin" style={{ left: x, top: y, ...square(size) }}>
      {PIE}
    </span>
  );
}

interface Plate {
  id: number;
  /** From the left edge in px, or from the right edge. */
  left?: number;
  right?: number;
  bottom: number;
  size: number;
  r: number;
  d: number;
}

interface Served {
  plates: Plate[];
  /** A hero card's whole pizza, in a top corner. */
  pie: { left?: number; right?: number; top: number; size: number } | null;
  bits: Bit[];
  fall: number;
  hop: number;
  t: number;
}

interface Serving {
  big: boolean;
  count: number;
  /** Each slice's size, px. */
  slice: number;
  size: number;
  band: number;
  /** The toppings' size. */
  bit: number;
}

/**
 * Slices dropped into a panel's bottom corners as it comes in, as if served; a hero card also
 * gets a whole pizza in a top corner. Around a webcam they keep to the frame's band, dropping
 * down its sides.
 */
function serve(next: () => number, { big, count, slice, size, band, bit }: Serving): Served {
  const t = big ? 1500 : 1400;
  const s = band ? Math.min(slice, band * 0.9) : slice;
  // Off the panel a little, sitting on its corner; inside the band around a webcam.
  const off = band ? (band - s) / 2 : -0.16 * s;
  const first = next() < 0.5 ? 'left' : 'right';
  // A third slice sits beside the right one: an alert's or winner's words run along the middle.
  const sides = count === 1 ? [first] : ['left', 'right', 'beside'].slice(0, count);
  const plates = sides.map(
    (side, id): Plate => ({
      id,
      left: side === 'left' ? off : undefined,
      right: side === 'right' ? off : side === 'beside' ? off + s * 0.9 : undefined,
      bottom: off,
      size: s,
      r: (side === 'left' ? -1 : 1) * between(next, 8, 24),
      // A hero card's slices follow its pizza in, one after another.
      d: (big ? 220 : 0) + id * 120 + between(next, 0, 60),
    }),
  );
  // A topping or two bounces off each slice as it lands.
  const landed = plates.flatMap((plate, index) => {
    const x = plate.right !== undefined ? `calc(100% - ${px(plate.right + s / 2)})` : off + s / 2;
    const side = plate.right !== undefined ? -1 : 1;
    const throws: SparkThrow = band
      ? {
          count: 1,
          x,
          y: `calc(100% - ${px(band / 2)})`,
          spread: 34 * size,
          rise: [band * 0.1, band * 0.3],
          fall: [0, band * 0.15],
          ms: [400, 620],
        }
      : {
          count: count <= 2 && index === 0 ? 2 : 1,
          x,
          y: `calc(100% - ${px(off + s * 0.3)})`,
          spread: 30 * size,
          rise: [8 * size, 24 * size],
          fall: [4 * size, 16 * size],
          ms: [450, 700],
        };
    return toppings(
      next,
      { ...throws, side, delay: plate.d + t * 0.28, jitter: 60, size: bit },
      index * 3,
    );
  });
  if (!big) {
    return {
      plates,
      pie: null,
      bits: landed,
      fall: band ? -Math.min(36 * size, band * 2) : -34 * size,
      hop: band ? -Math.min(6 * size, band * 0.25) : -7 * size,
      t,
    };
  }
  // The whole pizza sits on a top corner, off the card a little; in the band's corner around a
  // webcam.
  const whole = band ? Math.min(70 * size, band * 0.95) : 70 * size;
  const inset = band ? (band - whole) / 2 : -0.2 * whole;
  const onRight = next() < 0.5;
  const center = inset + whole / 2;
  const reach: Pick<SparkThrow, 'spread' | 'rise' | 'fall'> = band
    ? { spread: 40 * size, rise: [band * 0.1, band * 0.3], fall: [0, band * 0.15] }
    : { spread: 46 * size, rise: [10 * size, 34 * size], fall: [10 * size, 40 * size] };
  const scattered = toppings(
    next,
    {
      ...reach,
      count: 4,
      x: onRight ? `calc(100% - ${px(center)})` : center,
      y: center,
      side: onRight ? -1 : 1,
      ms: [520, 820],
      delay: 560,
      jitter: 100,
      size: bit,
    },
    20,
  );
  return {
    plates,
    pie: {
      left: onRight ? undefined : inset,
      right: onRight ? inset : undefined,
      top: inset,
      size: whole,
    },
    bits: [...landed, ...scattered],
    fall: band ? -Math.min(36 * size, band * 2) : -44 * size,
    hop: band ? -Math.min(6 * size, band * 0.25) : -8 * size,
    t,
  };
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const big = mode === 'hero';
  const size = Math.min(1.4, Math.max(0.5, scale));
  const band = ring ? Math.round(ring) : 0;
  const bit = band ? Math.min(size, band / 12) : size;
  // A hero card gets three big slices and a pizza; a list row or a chat line, one small slice.
  const count = big ? (band ? 2 : 3) : mode === 'full' && size >= 0.8 ? 2 : 1;
  const plate = (big ? 40 : mode === 'full' ? 32 : 26) * size;
  const served = useMemo(
    () => serve(rng(seed), { big, count, slice: plate, size, band, bit }),
    [seed, big, count, plate, size, band, bit],
  );
  const drift = useMemo(() => {
    const next = rng(seedOf(`${seed}:idle`));
    const toRight = next() < 0.5;
    return {
      top: band ? px(band / 2) : pct(between(next, 0.22, 0.7)),
      left: toRight ? '4%' : '96%',
      run: toRight ? '92%' : '-92%',
      r0: between(next, -35, 35),
    };
  }, [seed, band]);
  const bump = useMemo(() => {
    const next = rng(seedOf(`${seed}:${pulse}`));
    const x = pct(between(next, 0.2, 0.8));
    const top = band ? band / 2 : 0;
    return {
      x,
      top,
      r: between(next, -22, 22),
      bits: toppings(
        next,
        band
          ? {
              count: 2,
              x,
              y: top,
              spread: 36 * size,
              rise: [band * 0.1, band * 0.3],
              fall: [0, band * 0.15],
              ms: [420, 640],
              delay: 110,
              jitter: 60,
              size: bit,
            }
          : {
              count: 2,
              x,
              y: 0,
              spread: 30 * size,
              rise: [12 * size, 30 * size],
              fall: [6 * size, 22 * size],
              ms: [480, 720],
              delay: 110,
              jitter: 60,
              size: bit,
            },
      ),
    };
  }, [seed, pulse, size, band, bit]);
  const party = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    const pie = band ? Math.min(60 * size, band * 0.95) : 60 * size;
    const top = band ? band / 2 : 0;
    return {
      pie,
      top,
      // Along the top edge, out to both sides.
      slices: slicesOf(next, {
        x: '50%',
        y: top,
        pie,
        count: 6,
        flat: true,
        slice: band ? Math.min(pie * 0.52, band * 0.8) : pie * 0.52,
        reach: [50 * size, 200 * size],
        toss: band ? [band * 0.08, band * 0.2] : [8 * size, 26 * size],
        fall: band ? [-band * 0.1, band * 0.1] : [6 * size, 28 * size],
        ms: [900, 1200],
        delay: 700,
      }),
      bits: toppings(next, {
        count: 5,
        x: '50%',
        y: top,
        spread: 90 * size,
        rise: band ? [band * 0.1, band * 0.25] : [10 * size, 30 * size],
        fall: band ? [0, band * 0.12] : [10 * size, 34 * size],
        ms: [600, 900],
        delay: 720,
        jitter: 100,
        size: bit,
      }),
    };
  }, [seed, win, size, band, bit]);
  const slice = band ? Math.min(28 * size, band * 0.85) : 28 * size;
  const floater = band ? Math.min(24 * size, band * 0.8) : 24 * size;
  // A frame around a webcam keeps its glow inside its band, off the picture.
  const rim = band
    ? { boxShadow: `inset 0 0 ${band}px ${Math.round(band / 5)}px rgba(255,211,77,.7)` }
    : undefined;
  return (
    <>
      {served.pie && (
        <span
          className="pfx-pizza-pie pfx-pizza-a-spin"
          style={
            {
              left: served.pie.left,
              right: served.pie.right,
              top: served.pie.top,
              width: px(served.pie.size),
              height: px(served.pie.size),
              '--t': '1.9s',
            } as Vars
          }
        >
          {PIE}
        </span>
      )}
      {served.plates.map((plate) => (
        <span
          key={plate.id}
          className="pfx-pizza-s pfx-pizza-a-drop"
          style={
            {
              left: plate.left,
              right: plate.right,
              bottom: plate.bottom,
              width: px(plate.size),
              height: px(plate.size),
              '--r': deg(plate.r),
              '--fall': px(served.fall),
              '--hop': px(served.hop),
              '--t': ms(served.t),
              '--d': ms(plate.d),
            } as Vars
          }
        >
          {SLICE}
        </span>
      ))}
      <Bits list={served.bits} />
      {mode === 'full' && (
        // Now and then one slice floats across the panel, carried by a layer as wide as it.
        <span
          className="pfx-pizza-carrier pfx-pizza-a-carry"
          style={{ top: drift.top, '--run': drift.run, '--sync': ms(-seed * IDLE_MS) } as Vars}
        >
          <span
            className="pfx-pizza-s pfx-pizza-a-idle"
            style={
              {
                left: drift.left,
                top: 0,
                ...square(floater),
                '--r0': deg(drift.r0),
                '--bob': px(band ? -band * 0.1 : -6 * size),
                '--o': '.45',
              } as Vars
            }
          >
            {SLICE}
          </span>
        </span>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span
            className="pfx-pizza-s pfx-pizza-a-bump"
            style={
              {
                left: bump.x,
                top: bump.top,
                ...square(slice),
                '--r': deg(bump.r),
                '--lift': px(band ? 0 : -10 * size),
              } as Vars
            }
          >
            {SLICE}
          </span>
          <Bits list={bump.bits} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-pizza-rim pfx-pizza-a-glow"
            style={{ ...rim, '--t': '1.6s' } as Vars}
          />
          <Pie x="50%" y={party.top} size={party.pie} />
          <Flights list={party.slices} />
          <Bits list={party.bits} />
        </Fragment>
      )}
    </>
  );
}

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
  d: number;
}

/** Pepperoni along what a bar gained, each popping as the cheese reaches it. */
function pepperoni(next: () => number, hit: FxHit): Dot[] {
  const width = Math.abs(hit.to - hit.from);
  const count = width < 0.025 ? 1 : width < 0.06 ? 2 : width < 0.12 ? 3 : 4;
  return Array.from({ length: count }, (_, id) => {
    const along = (id + 0.5 + between(next, -0.2, 0.2)) / count;
    return {
      id,
      x: Math.min(hit.from, hit.to) + width * along,
      y: count === 1 ? 0.5 : id % 2 ? between(next, 0.56, 0.68) : between(next, 0.32, 0.44),
      size: between(next, 13, 16),
      d: 60 + 380 * along,
    };
  });
}

function Track({ seed, hit, hits, win }: TrackFxProps) {
  const [dots, tilt] = useMemo((): [Dot[], number] => {
    if (!hit) return [[], 0];
    const next = rng(seedOf(`${seed}:${hit.key}`));
    const tilt = between(next, -18, 18);
    return [Math.abs(hit.to - hit.from) > THIN ? pepperoni(next, hit) : [], tilt];
  }, [seed, hit]);
  const thin = hit ? Math.abs(hit.to - hit.from) <= THIN : false;
  return (
    <>
      {hit &&
        hits > 0 &&
        (thin ? (
          // A poll's vote: a mini slice pops inside the row, at the fill's edge.
          <span
            key={`h${hits}`}
            className="pfx-pizza-s pfx-pizza-a-bump"
            style={
              {
                left: pct(hit.to),
                top: '50%',
                ...square(MINI),
                '--t': '.6s',
                '--lift': '-2px',
                '--r': deg(tilt),
              } as Vars
            }
          >
            {SLICE}
          </span>
        ) : (
          <Fragment key={`h${hits}`}>
            {/* Cheese melts across what the bar gained, and pepperoni lands on it. */}
            <span
              className="pfx-pizza-melt pfx-pizza-a-melt"
              style={{
                left: pct(Math.min(hit.from, hit.to)),
                width: pct(Math.abs(hit.to - hit.from)),
              }}
            />
            {dots.map((dot) => (
              <span
                key={dot.id}
                className="pfx-pizza-dot pfx-pizza-pep pfx-pizza-a-dot"
                style={
                  {
                    left: pct(dot.x),
                    top: pct(dot.y),
                    ...square(dot.size),
                    '--d': ms(dot.d),
                  } as Vars
                }
              />
            ))}
          </Fragment>
        ))}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-pizza-melt pfx-pizza-a-melt"
            style={{ left: 0, right: 0, '--t': '1.8s' } as Vars}
          />
          <span className="pfx-pizza-glint pfx-pizza-a-glint" style={{ '--d': '.3s' } as Vars} />
        </Fragment>
      )}
    </>
  );
}

interface Floater {
  id: number;
  x: number;
  y: number;
  size: number;
  o: number;
  t: number;
  sync: number;
  /** Where it drifts to at a quarter, half and three quarters of its loop, px. */
  path: number[];
  /** Its tilt at the start and at each of those points, degrees. */
  turn: number[];
}

/**
 * Slices hanging in the air around a bar, spread along it, each on its own slow loop. Along the
 * bar they take turns: one high above it, one peeking out from under it, one peeking over its
 * top edge, so they never line up along the title.
 */
function hover(next: () => number, left: number, right: number, y: number, height: number) {
  const count = 6;
  const column = (right - left) / count;
  return Array.from({ length: count }, (_, id): Floater => {
    const lane = id % 3;
    const under = lane === 1;
    const rise = under ? 0.1 : 0.2;
    const r0 = between(next, -40, 40);
    const t = between(next, 10_000, 16_000);
    // How far above the bar's center, in bar heights; under it, below.
    const lift =
      lane === 0
        ? between(next, 1.2, 1.5)
        : under
          ? -between(next, 0.55, 0.7)
          : between(next, 0.8, 1);
    return {
      id,
      x: left + column * (id + 0.5 + between(next, -0.28, 0.28)),
      y: y - height * lift,
      size: height * (under ? between(next, 0.6, 0.72) : between(next, 0.62, 0.9)),
      o: between(next, 0.6, 0.9),
      t,
      sync: -between(next, 0, t),
      path: [0, 1, 2].flatMap(() => [
        between(next, -0.35, 0.35) * height,
        between(next, -rise, rise) * height,
      ]),
      turn: [r0, r0 + between(next, 6, 16), r0 - between(next, 6, 16), r0 + between(next, 4, 12)],
    };
  });
}

function Burst({ seed, hit, hits, win, left, right, y, height }: BurstFxProps) {
  const air = useMemo(
    () => hover(rng(seedOf(`${seed}:air`)), left, right, y, height),
    [seed, left, right, y, height],
  );
  const popped = useMemo(() => {
    if (!hit) return null;
    const next = rng(seedOf(`${seed}:${hit.key}`));
    const x = left + (right - left) * hit.to;
    // It hops away from the bar's nearer end, so it stays over the bar.
    const side = hit.to > 0.75 ? -1 : hit.to < 0.25 ? 1 : next() < 0.5 ? -1 : 1;
    return {
      x,
      y: y - height * 0.2,
      size: height * 0.95,
      dx: side * between(next, 24, 60),
      up: -height * between(next, 0.85, 1.25),
      // It falls past the bar as it fades.
      down: height * between(next, 1, 1.5),
      spin: side * between(next, 150, 280),
      bits: toppings(next, {
        count: 3 + Math.floor(next() * 3),
        x,
        y,
        spread: 72,
        rise: [28, 80],
        fall: [10, 50],
        ms: [600, 950],
        delay: 120,
        jitter: 140,
        size: 1.4,
      }),
    };
  }, [seed, hit, left, right, y, height]);
  const party = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    const x = (left + right) / 2;
    const pie = height * 1.8;
    return {
      x,
      pie,
      slices: slicesOf(next, {
        x,
        y,
        pie,
        count: 8,
        reach: [150, 270],
        toss: [28, 56],
        fall: [70, 140],
        ms: [950, 1250],
        delay: 720,
      }),
      bits: toppings(next, {
        count: 5,
        x,
        y,
        spread: 170,
        rise: [50, 120],
        fall: [20, 80],
        ms: [800, 1150],
        delay: 740,
        jitter: 120,
        size: 1.4,
      }),
    };
  }, [seed, win, left, right, y, height]);
  return (
    <>
      {/* Behind the bar and its text, so they stay readable for hours. */}
      {air.map((slice) => (
        <span
          key={slice.id}
          className="pfx-pizza-s pfx-pizza-air pfx-pizza-a-float"
          style={
            {
              left: Math.round(slice.x),
              top: Math.round(slice.y),
              ...square(slice.size),
              '--o': slice.o.toFixed(2),
              '--t': ms(slice.t),
              '--sync': ms(slice.sync),
              '--x1': px(slice.path[0]),
              '--y1': px(slice.path[1]),
              '--x2': px(slice.path[2]),
              '--y2': px(slice.path[3]),
              '--x3': px(slice.path[4]),
              '--y3': px(slice.path[5]),
              '--r0': deg(slice.turn[0]),
              '--r1': deg(slice.turn[1]),
              '--r2': deg(slice.turn[2]),
              '--r3': deg(slice.turn[3]),
            } as Vars
          }
        >
          {SLICE}
        </span>
      ))}
      {popped && hits > 0 && (
        <Fragment key={`h${hits}`}>
          {/* A slice pops out of the fill's edge, wiggles, then hops off and falls away. */}
          <span
            className="pfx-pizza-arc pfx-pizza-a-hop"
            style={
              {
                left: Math.round(popped.x),
                top: Math.round(popped.y),
                '--dx': px(popped.dx),
                '--d': '60ms',
              } as Vars
            }
          >
            <span
              className="pfx-pizza-s pfx-pizza-a-pop"
              style={
                {
                  ...square(popped.size),
                  '--up': px(popped.up),
                  '--down': px(popped.down),
                  '--spin': deg(popped.spin),
                } as Vars
              }
            >
              {SLICE}
            </span>
          </span>
          <Bits list={popped.bits} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-pizza-halo pfx-pizza-a-halo"
            style={{ left: Math.round(party.x), top: Math.round(y), ...square(party.pie * 1.5) }}
          />
          <Pie x={Math.round(party.x)} y={Math.round(y)} size={party.pie} />
          <Flights list={party.slices} />
          <Bits list={party.bits} />
        </Fragment>
      )}
    </>
  );
}

function Pulse({ seed, pulse, win, enter, round }: PulseFxProps) {
  const popped = useMemo(() => {
    const next = rng(seedOf(`${seed}:${pulse}`));
    return {
      r: between(next, -16, 16),
      bits: toppings(next, {
        count: 3,
        x: '50%',
        y: '32%',
        spread: round ? 22 : 36,
        rise: round ? [8, 20] : [14, 36],
        fall: round ? [4, 14] : [6, 26],
        ms: [480, 760],
        delay: 110,
        jitter: 80,
        size: 1.1,
      }),
    };
  }, [seed, pulse, round]);
  const party = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    const pie = round ? 46 : 56;
    return {
      pie,
      slices: slicesOf(next, {
        x: '50%',
        y: '45%',
        pie,
        count: 6,
        reach: round ? [14, 36] : [30, 80],
        toss: round ? [8, 18] : [14, 34],
        fall: round ? [8, 22] : [18, 46],
        ms: [850, 1100],
        delay: 700,
      }),
      bits: toppings(next, {
        count: 4,
        x: '50%',
        y: '45%',
        spread: round ? 26 : 50,
        rise: round ? [10, 24] : [18, 48],
        fall: round ? [6, 18] : [10, 36],
        ms: [600, 900],
        delay: 720,
        jitter: 100,
        size: 1.1,
      }),
    };
  }, [seed, win, round]);
  return (
    <>
      {enter && (
        // A chat line: a tiny slice slides in along its bottom edge and stops at its end.
        <span
          className="pfx-pizza-s pfx-pizza-a-slide"
          style={{ right: 4, bottom: 1, width: 14, height: 14, '--d': '120ms' } as Vars}
        >
          {SLICE}
        </span>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span
            className="pfx-pizza-s pfx-pizza-a-bump"
            style={
              {
                left: '50%',
                top: '32%',
                ...square(round ? 26 : 30),
                '--r': deg(popped.r),
                '--lift': round ? '-8px' : '-16px',
              } as Vars
            }
          >
            {SLICE}
          </span>
          <Bits list={popped.bits} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <Pie x="50%" y="45%" size={party.pie} />
          <Flights list={party.slices} />
          <Bits list={party.bits} />
        </Fragment>
      )}
    </>
  );
}

export const pizza: EffectModule = {
  id: 'pizza',
  css,
  // Pizza is pizza: its colors are its own, whatever the preset's.
  vars: () => ({}),
  Panel,
  Track,
  Burst,
  Pulse,
};
