import { type CSSProperties, Fragment, useMemo } from 'react';
import { rgba, shade } from '../color';
import type { Skin } from '../skin';
import { between, motionOk, rng, type SparkThrow, seedOf, throwSparks } from './primitives';
import type {
  BurstFxProps,
  EffectModule,
  FxHit,
  PanelFxProps,
  PulseFxProps,
  TrackFxProps,
} from './types';

// Spooky: Halloween's. Pumpkins, ghosts, bats and candy float in the air around a bar all the time:
// the ghosts fade in and out as they drift, the bats flap. Every gain lights what the bar added like
// a candle and pops a jack-o'-lantern out of the fill's edge, with a ghost rising out of it and
// candy flying. A goal reached brings a big jack-o'-lantern, and ghosts and bats fly out of it.
// Panels come in with a pumpkin dropped on a corner, and now and then a ghost floats across them.

/** The idle loop; each panel plays it at its own moment. */
const IDLE_MS = 12_000;
/** How many things float in the air around a bar, each on a loop of its own. */
const AIR = 8;
/** Narrower than this, a hit is a poll's vote striking the fill's edge. */
const THIN = 0.004;

const PUMPKIN = '🎃';
const GHOST = '👻';
const BAT = '🦇';
const CANDY = ['🍬', '🍭'] as const;

const EMOJI = `'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif`;

const css = `.pfx-spooky-e{position:absolute;display:flex;align-items:center;justify-content:center;width:var(--s,32px);height:var(--s,32px);margin:calc(var(--s,32px)*-.5) 0 0 calc(var(--s,32px)*-.5);opacity:0;font:calc(var(--s,32px)*.86)/1 ${EMOJI};text-shadow:0 0 calc(var(--s,32px)*.22) var(--pfx-o5),0 1px 2px rgba(20,6,32,.55)}
.pfx-spooky-wing{display:block}
.pfx-spooky-bit{text-align:center;font:var(--s,14px)/1 ${EMOJI};text-shadow:0 1px 2px rgba(20,6,32,.5)}
.pfx-spooky-air{z-index:-1}
.pfx-spooky-arc{position:absolute;width:0;height:0}
.pfx-spooky-carrier{position:absolute;left:0;right:0;height:0}
.pfx-spooky-glow{position:absolute;top:0;bottom:0;opacity:0;transform-origin:0 50%;background:linear-gradient(90deg,rgba(255,236,200,0),var(--pfx-o5) 62%,rgba(255,244,214,.9)),linear-gradient(180deg,rgba(255,255,255,.4),rgba(255,255,255,.08) 45%,var(--pfx-w3))}
.pfx-spooky-mote{position:absolute;width:var(--s,5px);height:var(--s,5px);margin:calc(var(--s,5px)*-.5) 0 0 calc(var(--s,5px)*-.5);opacity:0;border-radius:50%;background:radial-gradient(circle at 36% 32%,#fff6dc 0 20%,var(--pfx-o) 46%,var(--pfx-o0) 76%);box-shadow:0 0 5px var(--pfx-o5)}
.pfx-spooky-rim{position:absolute;inset:0;opacity:0;border-radius:inherit;box-shadow:inset 0 0 16px 2px var(--pfx-o6)}
.pfx-spooky-rim.pfx-spooky-win{box-shadow:inset 0 0 18px 2px var(--pfx-w5)}
.pfx-spooky-wash{position:absolute;inset:0;opacity:0;background:linear-gradient(180deg,var(--pfx-w3),var(--pfx-o4) 55%,rgba(26,11,46,.2))}
.pfx-spooky-halo{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side,rgba(255,236,190,.85),var(--pfx-o5) 52%,var(--pfx-o0))}
${motionOk(`@keyframes pfx-spooky-drift{0%{opacity:0;transform:translate(0,0) rotate(var(--r0))}12.5%{opacity:var(--o);transform:translate(calc(var(--dx)*.125),calc(var(--a)*.71 + var(--sink)*.125)) rotate(calc(var(--r0) + var(--spin)*.125))}25%{transform:translate(calc(var(--dx)*.25),calc(var(--a) + var(--sink)*.25)) rotate(calc(var(--r0) + var(--spin)*.25))}37.5%{transform:translate(calc(var(--dx)*.375),calc(var(--a)*.71 + var(--sink)*.375)) rotate(calc(var(--r0) + var(--spin)*.375))}50%{transform:translate(calc(var(--dx)*.5),calc(var(--sink)*.5)) rotate(calc(var(--r0) + var(--spin)*.5))}62.5%{transform:translate(calc(var(--dx)*.625),calc(var(--a)*-.71 + var(--sink)*.625)) rotate(calc(var(--r0) + var(--spin)*.625))}75%{transform:translate(calc(var(--dx)*.75),calc(var(--a)*-1 + var(--sink)*.75)) rotate(calc(var(--r0) + var(--spin)*.75))}87.5%{opacity:var(--o);transform:translate(calc(var(--dx)*.875),calc(var(--a)*-.71 + var(--sink)*.875)) rotate(calc(var(--r0) + var(--spin)*.875))}100%{opacity:0;transform:translate(var(--dx),var(--sink)) rotate(calc(var(--r0) + var(--spin)))}}
@keyframes pfx-spooky-haunt{0%{opacity:0;transform:translate(0,0) scale(.92)}12.5%{opacity:var(--o);transform:translate(calc(var(--dx)*.125),calc(var(--a)*.71 + var(--sink)*.125)) scale(1)}25%{transform:translate(calc(var(--dx)*.25),calc(var(--a) + var(--sink)*.25)) scale(1.04)}37.5%{opacity:calc(var(--o)*.3);transform:translate(calc(var(--dx)*.375),calc(var(--a)*.71 + var(--sink)*.375)) scale(1)}50%{opacity:var(--o);transform:translate(calc(var(--dx)*.5),calc(var(--sink)*.5)) scale(.96)}62.5%{transform:translate(calc(var(--dx)*.625),calc(var(--a)*-.71 + var(--sink)*.625)) scale(1)}75%{opacity:calc(var(--o)*.35);transform:translate(calc(var(--dx)*.75),calc(var(--a)*-1 + var(--sink)*.75)) scale(1.04)}87.5%{opacity:var(--o);transform:translate(calc(var(--dx)*.875),calc(var(--a)*-.71 + var(--sink)*.875)) scale(1)}100%{opacity:0;transform:translate(var(--dx),var(--sink)) scale(.92)}}
@keyframes pfx-spooky-flap{from{transform:scale(1,1)}to{transform:scale(.55,.92)}}
@keyframes pfx-spooky-pop{0%{opacity:1;transform:translateY(0) rotate(0deg) scale(0);animation-timing-function:cubic-bezier(.2,.8,.4,1)}13%{transform:translateY(0) rotate(-12deg) scale(1.2);animation-timing-function:ease-in-out}21%{transform:translateY(0) rotate(9deg) scale(1)}27%{transform:translateY(0) rotate(-5deg) scale(1)}32%{transform:translateY(0) rotate(0deg) scale(1);animation-timing-function:cubic-bezier(.33,.67,.67,1)}58%{transform:translateY(var(--up)) rotate(calc(var(--spin)*.35)) scale(1);animation-timing-function:cubic-bezier(.33,0,.67,.33)}86%{opacity:1}100%{opacity:0;transform:translateY(var(--down)) rotate(var(--spin)) scale(1)}}
@keyframes pfx-spooky-hop{0%,32%{transform:translateX(0)}100%{transform:translateX(var(--dx))}}
@keyframes pfx-spooky-rise{0%{opacity:0;transform:translate(0,0) scale(.5)}14%{opacity:var(--o,.95);transform:translate(0,calc(var(--up)*.12)) scale(1)}40%{transform:translate(var(--sw),calc(var(--up)*.45)) scale(1)}70%{opacity:var(--o,.95);transform:translate(calc(var(--sw)*-1),calc(var(--up)*.78)) scale(1.04)}100%{opacity:0;transform:translate(0,var(--up)) scale(1.1)}}
@keyframes pfx-spooky-away{from{transform:translateX(0)}to{transform:translateX(var(--dx))}}
@keyframes pfx-spooky-up{0%{opacity:0;transform:translateY(0) rotate(var(--r0)) scale(.4);animation-timing-function:cubic-bezier(.2,.7,.4,1)}12%{opacity:1;transform:translateY(calc(var(--up)*.15)) rotate(var(--r0)) scale(1)}60%{opacity:.9;transform:translateY(calc(var(--up)*.7)) rotate(calc(var(--r0)*-1)) scale(1)}100%{opacity:0;transform:translateY(var(--up)) rotate(var(--r0)) scale(1.1)}}
@keyframes pfx-spooky-spin{0%{opacity:0;transform:rotate(-200deg) scale(0);animation-timing-function:cubic-bezier(.2,.7,.3,1)}8%{opacity:1}34%{transform:rotate(12deg) scale(1.14)}44%{transform:rotate(0deg) scale(1)}56%{transform:rotate(0deg) scale(1.08)}64%{transform:rotate(0deg) scale(1)}74%{opacity:1;transform:rotate(0deg) scale(1)}84%,100%{opacity:0;transform:rotate(0deg) scale(1.1)}}
@keyframes pfx-spooky-halo{0%{opacity:0;transform:scale(.3)}30%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.3)}}
@keyframes pfx-spooky-bump{0%{opacity:1;transform:translateY(0) rotate(var(--r,0deg)) scale(0);animation-timing-function:cubic-bezier(.2,.8,.4,1)}24%{transform:translateY(0) rotate(calc(var(--r,0deg) - 12deg)) scale(1.2)}38%{transform:translateY(0) rotate(calc(var(--r,0deg) + 8deg)) scale(1)}50%{transform:translateY(0) rotate(var(--r,0deg)) scale(1);animation-timing-function:ease-in}74%{opacity:1}100%{opacity:0;transform:translateY(var(--lift,-14px)) rotate(var(--r,0deg)) scale(1)}}
@keyframes pfx-spooky-drop{0%{opacity:0;transform:translateY(var(--fall)) rotate(var(--r)) scale(1);animation-timing-function:cubic-bezier(.5,0,.85,.4)}6%{opacity:1}28%{transform:translateY(0) rotate(var(--r)) scale(1.12,.8);animation-timing-function:cubic-bezier(.2,.7,.4,1)}38%{transform:translateY(var(--hop)) rotate(var(--r)) scale(.95,1.06);animation-timing-function:cubic-bezier(.5,0,.8,.5)}47%{transform:translateY(0) rotate(var(--r)) scale(1.04,.94)}54%{transform:translateY(0) rotate(var(--r)) scale(1)}80%{opacity:1}100%{opacity:0;transform:translateY(0) rotate(var(--r)) scale(1)}}
@keyframes pfx-spooky-boo{0%{opacity:0;transform:translateY(40%) rotate(var(--rot,0deg)) scale(0);animation-timing-function:cubic-bezier(.25,.75,.4,1)}8%{opacity:1}20%{transform:translateY(0) rotate(calc(var(--rot,0deg) - 6deg)) scale(1.18);animation-timing-function:ease-in-out}30%{transform:translateY(0) rotate(var(--rot,0deg)) scale(1)}72%{opacity:1;transform:translateY(-6%) rotate(calc(var(--rot,0deg) + 5deg)) scale(1);animation-timing-function:cubic-bezier(.45,0,.8,.5)}100%{opacity:0;transform:translateY(-30%) rotate(var(--rot,0deg)) scale(.6)}}
@keyframes pfx-spooky-carry{0%,80%{transform:translateX(0)}100%{transform:translateX(var(--run))}}
@keyframes pfx-spooky-idle{0%,80%{opacity:0;transform:translateY(0) scale(.9)}84%{opacity:var(--o,.6)}88%{opacity:calc(var(--o,.6)*.4);transform:translateY(var(--bob)) scale(1)}92%{opacity:var(--o,.6)}96%{opacity:calc(var(--o,.6)*.5);transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(var(--bob)) scale(.9)}}
@keyframes pfx-spooky-peek{0%{opacity:0;transform:translate(0,0) scale(.6)}15%{opacity:1;transform:translate(calc(var(--dx)*.15),calc(var(--up)*.1)) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--up)) scale(.9)}}
@keyframes pfx-spooky-glow{0%{opacity:1;transform:scaleX(0);animation-timing-function:cubic-bezier(.2,.9,.3,1.1)}55%{opacity:1;transform:scaleX(1);animation-timing-function:ease-in}100%{opacity:0;transform:scaleX(1)}}
@keyframes pfx-spooky-mote{0%{opacity:0;transform:translate(0,0) scale(.3)}20%{opacity:1;transform:translate(calc(var(--dx)*.2),calc(var(--dy)*.2)) scale(1.15)}60%{opacity:.95}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.6)}}
@keyframes pfx-spooky-flash{0%{opacity:0}20%{opacity:1}100%{opacity:0}}
.pfx-spooky-a-drift{animation:pfx-spooky-drift var(--t,11s) linear var(--sync,0s) infinite}
.pfx-spooky-a-haunt{animation:pfx-spooky-haunt var(--t,11s) linear var(--sync,0s) infinite}
.pfx-spooky-a-flap{animation:pfx-spooky-flap var(--flap,.28s) ease-in-out infinite alternate}
.pfx-spooky-a-pop{animation:pfx-spooky-pop var(--t,1.5s) linear var(--d,0s) backwards}
.pfx-spooky-a-hop{animation:pfx-spooky-hop var(--t,1.5s) linear var(--d,0s) backwards}
.pfx-spooky-a-rise{animation:pfx-spooky-rise var(--t,1.8s) ease-out var(--d,0s) backwards}
.pfx-spooky-a-away{animation:pfx-spooky-away var(--t,1.5s) cubic-bezier(.2,.7,.35,1) var(--d,0s) backwards}
.pfx-spooky-a-up{animation:pfx-spooky-up var(--t,1.5s) linear var(--d,0s) backwards}
.pfx-spooky-a-spin{animation:pfx-spooky-spin var(--t,1.3s) linear var(--d,0s) backwards}
.pfx-spooky-a-halo{animation:pfx-spooky-halo var(--t,1.1s) ease-out var(--d,0s) backwards}
.pfx-spooky-a-bump{animation:pfx-spooky-bump var(--t,1.1s) linear var(--d,0s) backwards}
.pfx-spooky-a-drop{transform-origin:50% 90%;animation:pfx-spooky-drop var(--t,1.4s) linear var(--d,0s) backwards}
.pfx-spooky-a-boo{animation:pfx-spooky-boo var(--t,1.7s) linear var(--d,0s) backwards}
.pfx-spooky-a-carry{animation:pfx-spooky-carry ${IDLE_MS}ms linear var(--sync,0s) infinite}
.pfx-spooky-a-idle{animation:pfx-spooky-idle ${IDLE_MS}ms ease-in-out var(--sync,0s) infinite}
.pfx-spooky-a-peek{animation:pfx-spooky-peek var(--t,1.4s) ease-in var(--d,0s) backwards}
.pfx-spooky-a-glow{animation:pfx-spooky-glow var(--t,1.3s) linear var(--d,0s) backwards}
.pfx-spooky-a-mote{animation:pfx-spooky-mote var(--t,1s) ease-out var(--d,0s) backwards}
.pfx-spooky-a-flash{animation:pfx-spooky-flash var(--t,1s) ease-out var(--d,0s) backwards}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;
const px = (value: number) => `${Math.round(value * 10) / 10}px`;
const ms = (value: number) => `${Math.round(value)}ms`;
const deg = (value: number) => `${Math.round(value)}deg`;
const sign = (next: () => number) => (next() < 0.5 ? -1 : 1);

/** A bat's wings beat inside it, so the bat can fly and flap at once. */
function Bat({ beat = 0.28 }: { beat?: number }) {
  return (
    <span className="pfx-spooky-wing pfx-spooky-a-flap" style={{ '--flap': `${beat}s` } as Vars}>
      {BAT}
    </span>
  );
}

/** The emoji as drawn: a bat gets its wings. */
const look = (emoji: string) => (emoji === BAT ? <Bat /> : emoji);

interface Candy {
  id: number;
  x: number | string;
  y: number | string;
  dx: number;
  up: number;
  down: number;
  r: number;
  t: number;
  d: number;
  size: number;
  emoji: string;
}

/** Candy knocked loose, thrown like sparks, each a sweet or a lollipop turning as it flies. */
function candy(next: () => number, spec: SparkThrow, firstId = 0): Candy[] {
  const size = spec.size ?? 1;
  return throwSparks(next, spec, firstId).map((spark) => ({
    ...spark,
    r: between(next, -90, 90),
    size: between(next, 13, 17) * size,
    emoji: CANDY[Math.floor(next() * CANDY.length)],
  }));
}

function Sweets({ list }: { list: readonly Candy[] }) {
  return list.map((piece) => (
    <span
      key={piece.id}
      className="pfx-sp"
      style={
        {
          left: piece.x,
          top: piece.y,
          '--dx': px(piece.dx),
          '--t': ms(piece.t),
          '--d': ms(piece.d),
        } as Vars
      }
    >
      <i
        className="pfx-spooky-bit"
        style={
          {
            width: px(piece.size),
            height: px(piece.size),
            marginLeft: px(-piece.size / 2),
            marginTop: px(-piece.size / 2),
            '--s': px(piece.size),
            '--up': px(piece.up),
            '--down': px(piece.down),
            '--r': deg(piece.r),
          } as Vars
        }
      >
        {piece.emoji}
      </i>
    </span>
  ));
}

interface Riser {
  id: number;
  x: number | string;
  y: number | string;
  size: number;
  /** How far it rises (negative is up) and sways, in px. */
  up: number;
  sway: number;
  o: number;
  t: number;
  d: number;
}

/** Ghosts rising from a point, swaying side to side as they fade. */
function Risers({ list }: { list: readonly Riser[] }) {
  return list.map((ghost) => (
    <span
      key={ghost.id}
      className="pfx-spooky-e pfx-spooky-a-rise"
      style={
        {
          left: ghost.x,
          top: ghost.y,
          '--s': px(ghost.size),
          '--up': px(ghost.up),
          '--sw': px(ghost.sway),
          '--o': String(Math.round(ghost.o * 100) / 100),
          '--t': ms(ghost.t),
          '--d': ms(ghost.d),
        } as Vars
      }
    >
      {GHOST}
    </span>
  ));
}

interface Flyer {
  id: number;
  emoji: string;
  x: number | string;
  y: number | string;
  size: number;
  dx: number;
  up: number;
  r0: number;
  t: number;
  d: number;
}

interface Scatter {
  x: number | string;
  y: number | string;
  count: number;
  /** Ghosts and bats, taking turns. */
  emojis: readonly string[];
  size: [number, number];
  /** How far out each one flies sideways and how high it goes, in px. */
  reach: [number, number];
  rise: [number, number];
  ms: [number, number];
  delay: number;
  /** Extra random delay, up to this many ms. */
  jitter: number;
}

/** Ghosts and bats flying out of a point, fanned out to both sides and up. */
function scatter(next: () => number, spec: Scatter): Flyer[] {
  return Array.from({ length: spec.count }, (_, id) => {
    // Spread evenly from left to right, so they never bunch up on one side.
    const lane = (id + between(next, 0.2, 0.8)) / spec.count;
    const side = lane < 0.5 ? -1 : 1;
    const out = Math.abs(lane - 0.5) * 2;
    return {
      id,
      emoji: spec.emojis[id % spec.emojis.length],
      x: spec.x,
      y: spec.y,
      size: between(next, spec.size[0], spec.size[1]),
      dx: side * (spec.reach[0] + (spec.reach[1] - spec.reach[0]) * out),
      up: -between(next, spec.rise[0], spec.rise[1]),
      r0: side * between(next, 4, 14),
      t: between(next, spec.ms[0], spec.ms[1]),
      d: spec.delay + between(next, 0, spec.jitter),
    };
  });
}

/** In flight: the outer span carries it sideways while it rises, sways and fades. */
function Flyers({ list }: { list: readonly Flyer[] }) {
  return list.map((flyer) => (
    <span
      key={flyer.id}
      className="pfx-spooky-arc pfx-spooky-a-away"
      style={
        {
          left: flyer.x,
          top: flyer.y,
          '--dx': px(flyer.dx),
          '--t': ms(flyer.t),
          '--d': ms(flyer.d),
        } as Vars
      }
    >
      <span
        className="pfx-spooky-e pfx-spooky-a-up"
        style={{ '--s': px(flyer.size), '--up': px(flyer.up), '--r0': deg(flyer.r0) } as Vars}
      >
        {look(flyer.emoji)}
      </span>
    </span>
  ));
}

/** A big jack-o'-lantern that spins in on a point, grins a moment, then fades. */
function Lantern({
  x,
  y,
  size,
  t,
}: {
  x: number | string;
  y: number | string;
  size: number;
  t?: number;
}) {
  return (
    <span
      className="pfx-spooky-e pfx-spooky-a-spin"
      style={{ left: x, top: y, '--s': px(size), ...(t ? { '--t': ms(t) } : {}) } as Vars}
    >
      {PUMPKIN}
    </span>
  );
}

interface Pop {
  id: number;
  emoji: string;
  x: number | string;
  y: number | string;
  size: number;
  rot: number;
  t: number;
  d: number;
}

/** Pumpkins and ghosts popping up in a row, one after another, then fading up and away. */
function Row({ list }: { list: readonly Pop[] }) {
  return list.map((pop) => (
    <span
      key={pop.id}
      className="pfx-spooky-e pfx-spooky-a-boo"
      style={
        {
          left: pop.x,
          top: pop.y,
          '--s': px(pop.size),
          '--rot': deg(pop.rot),
          '--t': ms(pop.t),
          '--d': ms(pop.d),
        } as Vars
      }
    >
      {look(pop.emoji)}
    </span>
  ));
}

const ROW = [PUMPKIN, GHOST, BAT, PUMPKIN, GHOST] as const;

interface Entrance {
  /** Pumpkins dropped on the bottom corners. */
  drops: {
    id: number;
    left?: number;
    right?: number;
    bottom: number;
    size: number;
    r: number;
    d: number;
  }[];
  /** A hero card's jack-o'-lantern, on a top corner. */
  lantern: { left?: number; right?: number; top: number; size: number } | null;
  ghosts: Riser[];
  sweets: Candy[];
  fall: number;
  hop: number;
  t: number;
}

/**
 * A pumpkin dropped on a bottom corner as the panel comes in, bouncing once; a hero card also gets
 * a jack-o'-lantern on a top corner and ghosts rising off it. Around a webcam everything keeps to
 * the frame's band.
 */
function enter(next: () => number, big: boolean, size: number, band: number): Entrance {
  const t = big ? 1500 : 1400;
  const pumpkin = band ? Math.min(30 * size, band * 0.9) : (big ? 40 : 30) * size;
  // Off the panel a little, sitting on its corner; inside the band around a webcam.
  const off = band ? (band - pumpkin) / 2 : -0.18 * pumpkin;
  const first = next() < 0.5 ? 'left' : 'right';
  const sides = big ? ['left', 'right'] : [first];
  const drops = sides.map((side, id) => ({
    id,
    left: side === 'left' ? off : undefined,
    right: side === 'right' ? off : undefined,
    bottom: off,
    size: pumpkin,
    r: (side === 'left' ? -1 : 1) * between(next, 6, 18),
    d: (big ? 260 : 0) + id * 140 + between(next, 0, 60),
  }));
  // A sweet bounces off the first pumpkin as it lands.
  const landed = drops[0];
  const sweets = candy(next, {
    count: band ? 1 : 2,
    x: landed.right !== undefined ? `calc(100% - ${px(off + pumpkin / 2)})` : off + pumpkin / 2,
    y: `calc(100% - ${px(band ? band / 2 : off + pumpkin * 0.3)})`,
    spread: 30 * size,
    rise: band ? [band * 0.1, band * 0.3] : [8 * size, 24 * size],
    fall: band ? [0, band * 0.15] : [4 * size, 16 * size],
    ms: [450, 700],
    side: landed.right !== undefined ? -1 : 1,
    delay: landed.d + t * 0.28,
    jitter: 60,
    size: band ? Math.min(size, band / 16) : size,
  });
  const fall = band ? -Math.min(36 * size, band * 2) : -34 * size;
  const hop = band ? -Math.min(6 * size, band * 0.25) : -7 * size;
  if (!big) return { drops, lantern: null, ghosts: [], sweets, fall, hop, t };
  const whole = band ? Math.min(64 * size, band * 0.95) : 64 * size;
  const inset = band ? (band - whole) / 2 : -0.2 * whole;
  const onRight = next() < 0.5;
  // Around a webcam the ghosts would rise over the picture, so only a card gets them.
  const ghosts: Riser[] = band
    ? []
    : Array.from({ length: 2 }, (_, id) => ({
        id,
        x: onRight
          ? `calc(100% - ${px(inset + whole * (0.3 + id * 0.5))})`
          : inset + whole * (0.3 + id * 0.5),
        y: inset + whole * 0.4,
        size: 30 * size * between(next, 0.85, 1),
        up: -between(next, 50, 80) * size,
        sway: between(next, 6, 10) * size * sign(next),
        o: 0.9,
        t: between(next, 1700, 2100),
        d: 650 + id * 220 + between(next, 0, 80),
      }));
  return {
    drops,
    lantern: {
      left: onRight ? undefined : inset,
      right: onRight ? inset : undefined,
      top: inset,
      size: whole,
    },
    ghosts,
    sweets,
    fall,
    hop,
    t,
  };
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const big = mode === 'hero';
  const size = Math.min(1.4, Math.max(0.5, scale));
  const band = ring ? Math.round(ring) : 0;
  const entrance = useMemo(() => enter(rng(seed), big, size, band), [seed, big, size, band]);
  const drift = useMemo(() => {
    const next = rng(seedOf(`${seed}:idle`));
    const toRight = next() < 0.5;
    return {
      top: band ? px(band / 2) : pct(between(next, 0.2, 0.62)),
      left: toRight ? '4%' : '96%',
      run: toRight ? '92%' : '-92%',
      // Most panels get a ghost floating by; some a bat.
      emoji: next() < 0.75 ? GHOST : BAT,
    };
  }, [seed, band]);
  // A pulse bumps a pumpkin up on the top edge, and a sweet or two fly off it.
  const bump = useMemo(() => {
    const next = rng(seedOf(`${seed}:${pulse}`));
    const x = pct(between(next, 0.2, 0.8));
    const top = band ? band / 2 : 0;
    return {
      x,
      top,
      r: between(next, -18, 18),
      sweets: candy(next, {
        count: 2,
        x,
        y: top,
        spread: band ? 34 * size : 30 * size,
        rise: band ? [band * 0.1, band * 0.3] : [12 * size, 30 * size],
        fall: band ? [0, band * 0.15] : [6 * size, 22 * size],
        ms: [480, 720],
        delay: 110,
        jitter: 60,
        size: band ? Math.min(size, band / 16) : size,
      }),
    };
  }, [seed, pulse, size, band]);
  // A win pops pumpkins, ghosts and a bat up along the top edge, one after another.
  const party = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    const head = band ? Math.max(6, Math.round(band * 0.85)) : Math.round(32 * size);
    const top = band ? band / 2 : 0;
    return {
      row: ROW.map(
        (emoji, id): Pop => ({
          id,
          emoji,
          x: pct((id + 0.5) / ROW.length + between(next, -0.04, 0.04)),
          y: band ? top : top + between(next, -3, 3) * size,
          size: head * between(next, 0.86, 1),
          rot: between(next, -12, 12),
          t: 1800,
          d: id * 150 + between(next, 0, 60),
        }),
      ),
      ghosts: band
        ? []
        : Array.from({ length: 2 }, (_, id) => ({
            id,
            x: pct(between(next, 0.25, 0.75)),
            y: top,
            size: 28 * size,
            up: -between(next, 50, 80) * size,
            sway: between(next, 6, 10) * size * sign(next),
            o: 0.9,
            t: between(next, 1700, 2100),
            d: 700 + id * 260 + between(next, 0, 80),
          })),
      sweets: candy(next, {
        count: 4,
        x: '50%',
        y: top,
        spread: 90 * size,
        rise: band ? [band * 0.1, band * 0.25] : [10 * size, 30 * size],
        fall: band ? [0, band * 0.12] : [10 * size, 34 * size],
        ms: [600, 900],
        delay: 600,
        jitter: 160,
        size: band ? Math.min(size, band / 16) : size,
      }),
    };
  }, [seed, win, size, band]);
  const floater = band ? Math.min(24 * size, band * 0.8) : 24 * size;
  const pumpkin = band ? Math.min(28 * size, band * 0.85) : 28 * size;
  // A frame around a webcam keeps its glow inside its band, off the picture.
  const rim = band
    ? { boxShadow: `inset 0 0 ${band}px ${Math.round(band / 5)}px var(--pfx-o6)` }
    : undefined;
  return (
    <>
      {entrance.lantern && (
        <span
          className="pfx-spooky-e pfx-spooky-a-spin"
          style={
            {
              left: entrance.lantern.left,
              right: entrance.lantern.right,
              top: entrance.lantern.top,
              margin: 0,
              '--s': px(entrance.lantern.size),
              '--t': '1.9s',
            } as Vars
          }
        >
          {PUMPKIN}
        </span>
      )}
      {entrance.drops.map((drop) => (
        <span
          key={drop.id}
          className="pfx-spooky-e pfx-spooky-a-drop"
          style={
            {
              left: drop.left,
              right: drop.right,
              bottom: drop.bottom,
              margin: 0,
              '--s': px(drop.size),
              '--r': deg(drop.r),
              '--fall': px(entrance.fall),
              '--hop': px(entrance.hop),
              '--t': ms(entrance.t),
              '--d': ms(drop.d),
            } as Vars
          }
        >
          {PUMPKIN}
        </span>
      ))}
      <Risers list={entrance.ghosts} />
      <Sweets list={entrance.sweets} />
      {mode === 'full' && (
        // Now and then a ghost floats across the panel, carried by a layer as wide as it.
        <span
          className="pfx-spooky-carrier pfx-spooky-a-carry"
          style={{ top: drift.top, '--run': drift.run, '--sync': ms(-seed * IDLE_MS) } as Vars}
        >
          <span
            className="pfx-spooky-e pfx-spooky-a-idle"
            style={
              {
                left: drift.left,
                top: 0,
                '--s': px(floater),
                '--bob': px(band ? -band * 0.1 : -6 * size),
                '--o': '.6',
              } as Vars
            }
          >
            {look(drift.emoji)}
          </span>
        </span>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span
            className="pfx-spooky-rim pfx-spooky-a-flash"
            style={{ ...rim, '--t': '.8s' } as Vars}
          />
          <span
            className="pfx-spooky-e pfx-spooky-a-bump"
            style={
              {
                left: bump.x,
                top: bump.top,
                '--s': px(pumpkin),
                '--r': deg(bump.r),
                '--lift': px(band ? 0 : -10 * size),
              } as Vars
            }
          >
            {PUMPKIN}
          </span>
          <Sweets list={bump.sweets} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-spooky-rim pfx-spooky-win pfx-spooky-a-flash"
            style={
              {
                ...(band
                  ? { boxShadow: `inset 0 0 ${Math.round(band * 0.8)}px var(--pfx-w5)` }
                  : {}),
                '--t': '1.8s',
              } as Vars
            }
          />
          <Row list={party.row} />
          <Risers list={party.ghosts} />
          <Sweets list={party.sweets} />
        </Fragment>
      )}
    </>
  );
}

interface Mote {
  id: number;
  x: string;
  y: string;
  dx: number;
  dy: number;
  size: number;
  t: number;
  d: number;
}

/** Candlelight motes along what a bar gained, each rising as the glow passes it. */
function motes(next: () => number, from: number, to: number, count: number): Mote[] {
  const start = Math.min(from, to);
  const span = Math.abs(to - from);
  return Array.from({ length: count }, (_, id) => {
    const along = (id + between(next, 0.15, 0.85)) / count;
    return {
      id,
      x: pct(start + span * along),
      y: pct(between(next, 0.25, 0.75)),
      dx: between(next, -6, 8),
      dy: -between(next, 5, 13),
      size: between(next, 4, 6),
      t: between(next, 900, 1300),
      // The fill's edge covers most of the way early on, and the glow rides it.
      d: 60 + 380 * along * along,
    };
  });
}

function Motes({ list }: { list: readonly Mote[] }) {
  return list.map((mote) => (
    <span
      key={mote.id}
      className="pfx-spooky-mote pfx-spooky-a-mote"
      style={
        {
          left: mote.x,
          top: mote.y,
          '--s': px(mote.size),
          '--dx': px(mote.dx),
          '--dy': px(mote.dy),
          '--t': ms(mote.t),
          '--d': ms(mote.d),
        } as Vars
      }
    />
  ));
}

/** What a hit lights: its new segment. */
const segment = (hit: FxHit): CSSProperties => ({
  left: pct(Math.min(hit.from, hit.to)),
  width: pct(Math.abs(hit.to - hit.from)),
});

function Track({ seed, hit, hits, win }: TrackFxProps) {
  const strike = useMemo(() => {
    if (!hit) return null;
    const next = rng(seedOf(`${seed}:${hit.key}`));
    return { motes: motes(next, hit.from, hit.to, 4), tilt: between(next, -16, 16) };
  }, [seed, hit]);
  const glow = useMemo(() => motes(rng(seedOf(`${seed}:w${win}`)), 0, 1, 7), [seed, win]);
  const thin = hit ? Math.abs(hit.to - hit.from) <= THIN : false;
  return (
    <>
      {hit &&
        strike &&
        hits > 0 &&
        (thin ? (
          // A poll's vote: a little pumpkin pops inside the row, at the fill's edge.
          <span
            key={`h${hits}`}
            className="pfx-spooky-e pfx-spooky-a-bump"
            style={
              {
                left: pct(hit.to),
                top: '50%',
                '--s': '26px',
                '--t': '.6s',
                '--lift': '-2px',
                '--r': deg(strike.tilt),
              } as Vars
            }
          >
            {PUMPKIN}
          </span>
        ) : (
          <Fragment key={`h${hits}`}>
            {/* Candlelight runs over what the bar gained, and motes rise off it. */}
            <span className="pfx-spooky-glow pfx-spooky-a-glow" style={segment(hit)} />
            <Motes list={strike.motes} />
          </Fragment>
        ))}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span className="pfx-spooky-wash pfx-spooky-a-flash" style={{ '--t': '1.8s' } as Vars} />
          <span
            className="pfx-spooky-glow pfx-spooky-a-glow"
            style={{ left: 0, width: '100%', '--t': '1.9s' } as Vars}
          />
          <Motes list={glow} />
        </Fragment>
      )}
    </>
  );
}

interface Floater {
  id: number;
  emoji: string;
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

/** The rows the floating things keep to, as shares of the bar's height from its center. */
const ROWS: readonly [number, number][] = [
  [-1.3, -0.95],
  [-0.65, -0.15],
  [0.2, 0.55],
];

/** What floats around a bar: pumpkins and ghosts most of all, a couple of bats and sweets. */
const AIR_MIX = [PUMPKIN, GHOST, BAT, CANDY[0], GHOST, PUMPKIN, BAT, CANDY[1]] as const;

/** Which way the air drifts around a bar: the same for everything floating in it. */
const windOf = (seed: number) => (seedOf(`${seed}:wind`) < 0.5 ? -1 : 1);

/** Things floating in the air around a bar, each on a slow loop of its own with the wind. */
function floating(
  next: () => number,
  wind: number,
  left: number,
  right: number,
  y: number,
  height: number,
): Floater[] {
  return Array.from({ length: AIR }, (_, id) => {
    const emoji = AIR_MIX[id % AIR_MIX.length];
    const bat = emoji === BAT;
    const ghost = emoji === GHOST;
    const t = between(next, bat ? 6500 : 9000, bat ? 9000 : 15000);
    // Never slower than 8px a second, so none of them rests over a label for long; bats are quick.
    const speed = bat ? between(next, 18, 30) : between(next, 8, 16);
    const dx = ((speed * t) / 1000) * wind;
    const slot = left + ((right - left) * (id + between(next, 0.2, 0.8))) / AIR;
    const lowest = left - 12 - Math.min(dx, 0);
    const highest = right + 12 - Math.max(dx, 0);
    const [top, bottom] = ROWS[id % ROWS.length];
    return {
      id,
      emoji,
      // Its whole drift stays over the bar's length.
      x: Math.min(Math.max(slot - dx / 2, lowest), highest),
      y: y + height * between(next, top, bottom),
      dx,
      wave: height * (bat ? between(next, 0.2, 0.35) : between(next, 0.1, 0.2)) * sign(next),
      sink: height * between(next, -0.08, 0.08),
      // A pumpkin or a sweet turns a little as it drifts; ghosts and bats stay upright.
      r0: ghost || bat ? 0 : between(next, -20, 20),
      spin: ghost || bat ? 0 : between(next, 30, 90) * sign(next),
      // Big enough to read on stream, not a speck.
      size: bat
        ? between(next, 22, 28)
        : emoji === PUMPKIN
          ? between(next, 28, 36)
          : ghost
            ? between(next, 26, 32)
            : between(next, 18, 24),
      // The highest row floats over the overlay's labels, so it's the faintest.
      opacity: id % ROWS.length === 0 ? between(next, 0.7, 0.82) : between(next, 0.86, 0.98),
      t,
      phase: between(next, 0, t),
    };
  });
}

function Air({ list }: { list: readonly Floater[] }) {
  return list.map((thing) => (
    <span
      key={thing.id}
      className={`pfx-spooky-e pfx-spooky-air ${
        thing.emoji === GHOST ? 'pfx-spooky-a-haunt' : 'pfx-spooky-a-drift'
      }`}
      style={
        {
          left: px(thing.x),
          top: px(thing.y),
          '--s': px(thing.size),
          '--dx': px(thing.dx),
          '--a': px(thing.wave),
          '--sink': px(thing.sink),
          '--r0': deg(thing.r0),
          '--spin': deg(thing.spin),
          '--o': String(Math.round(thing.opacity * 100) / 100),
          '--t': ms(thing.t),
          '--sync': ms(-thing.phase),
        } as Vars
      }
    >
      {look(thing.emoji)}
    </span>
  ));
}

function Burst({ seed, hit, hits, win, left, right, y, height }: BurstFxProps) {
  // Always there while the bar is, and never replayed: hits and wins leave it as it is.
  const air = useMemo(
    () => floating(rng(seedOf(`${seed}:air`)), windOf(seed), left, right, y, height),
    [seed, left, right, y, height],
  );
  const popped = useMemo(() => {
    if (!hit) return null;
    const next = rng(seedOf(`${seed}:${hit.key}`));
    const x = left + (right - left) * hit.to;
    // It hops away from the bar's nearer end, so it stays over the bar.
    const side = hit.to > 0.75 ? -1 : hit.to < 0.25 ? 1 : sign(next);
    return {
      x,
      y: y - height * 0.2,
      size: height * 0.95,
      dx: side * between(next, 24, 60),
      up: -height * between(next, 0.85, 1.25),
      // It falls past the bar as it fades.
      down: height * between(next, 1, 1.5),
      spin: side * between(next, 120, 240),
      // A ghost rises out of the pumpkin as it pops.
      ghost: {
        id: 0,
        x,
        y: y - height * 0.35,
        size: height * 0.85,
        up: -height * between(next, 2, 2.6),
        sway: between(next, 8, 14) * sign(next),
        o: 0.92,
        t: between(next, 1700, 2100),
        d: 260,
      } satisfies Riser,
      sweets: candy(next, {
        count: 3 + Math.floor(next() * 2),
        x,
        y,
        spread: 72,
        rise: [28, 80],
        fall: [10, 50],
        ms: [600, 950],
        delay: 120,
        jitter: 140,
        size: 1.2,
      }),
    };
  }, [seed, hit, left, right, y, height]);
  const party = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    const x = (left + right) / 2;
    const lantern = height * 1.9;
    return {
      x,
      lantern,
      flyers: scatter(next, {
        x,
        y,
        count: 8,
        emojis: [GHOST, BAT, GHOST, GHOST, BAT, GHOST, BAT, GHOST],
        size: [height * 0.75, height * 0.95],
        reach: [40, 260],
        rise: [70, 170],
        ms: [1500, 1900],
        delay: 700,
        jitter: 220,
      }),
      sweets: candy(next, {
        count: 6,
        x,
        y,
        spread: 170,
        rise: [50, 120],
        fall: [20, 80],
        ms: [800, 1150],
        delay: 740,
        jitter: 120,
        size: 1.3,
      }),
    };
  }, [seed, win, left, right, y, height]);
  return (
    <>
      {/* Behind the bar and its text, so they stay readable for hours. */}
      <Air list={air} />
      {popped && hits > 0 && (
        <Fragment key={`h${hits}`}>
          {/* A jack-o'-lantern pops out of the fill's edge, wiggles, then hops off and falls away. */}
          <span
            className="pfx-spooky-arc pfx-spooky-a-hop"
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
              className="pfx-spooky-e pfx-spooky-a-pop"
              style={
                {
                  '--s': px(popped.size),
                  '--up': px(popped.up),
                  '--down': px(popped.down),
                  '--spin': deg(popped.spin),
                } as Vars
              }
            >
              {PUMPKIN}
            </span>
          </span>
          <Risers list={[popped.ghost]} />
          <Sweets list={popped.sweets} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-spooky-halo pfx-spooky-a-halo"
            style={{
              left: Math.round(party.x - party.lantern * 0.75),
              top: Math.round(y - party.lantern * 0.75),
              width: Math.round(party.lantern * 1.5),
              height: Math.round(party.lantern * 1.5),
            }}
          />
          <Lantern x={Math.round(party.x)} y={Math.round(y)} size={party.lantern} />
          <Flyers list={party.flyers} />
          <Sweets list={party.sweets} />
        </Fragment>
      )}
    </>
  );
}

function Pulse({ seed, pulse, win, enter: entering, round }: PulseFxProps) {
  // A chat line: a little bat flutters off its end.
  const flutter = useMemo(() => {
    const next = rng(seed);
    return { dx: between(next, 26, 40), up: -between(next, 14, 24) };
  }, [seed]);
  const popped = useMemo(() => {
    const next = rng(seedOf(`${seed}:${pulse}`));
    return {
      r: between(next, -16, 16),
      sweets: candy(next, {
        count: 3,
        x: '50%',
        y: '32%',
        spread: round ? 22 : 36,
        rise: round ? [8, 20] : [14, 36],
        fall: round ? [4, 14] : [6, 26],
        ms: [480, 760],
        delay: 110,
        jitter: 80,
        size: 1,
      }),
    };
  }, [seed, pulse, round]);
  const party = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return {
      lantern: round ? 46 : 60,
      flyers: scatter(next, {
        x: '50%',
        y: '45%',
        count: 5,
        emojis: [GHOST, BAT, GHOST, BAT, GHOST],
        size: round ? [20, 26] : [24, 32],
        reach: round ? [10, 40] : [20, 90],
        rise: round ? [24, 50] : [40, 90],
        ms: [1300, 1700],
        delay: 650,
        jitter: 200,
      }),
      sweets: candy(next, {
        count: 4,
        x: '50%',
        y: '45%',
        spread: round ? 26 : 50,
        rise: round ? [10, 24] : [18, 48],
        fall: round ? [6, 18] : [10, 36],
        ms: [600, 900],
        delay: 700,
        jitter: 100,
        size: 1,
      }),
    };
  }, [seed, win, round]);
  return (
    <>
      {entering && (
        <span
          className="pfx-spooky-e pfx-spooky-a-peek"
          style={
            {
              right: 2,
              bottom: 2,
              margin: 0,
              '--s': '16px',
              '--dx': px(flutter.dx),
              '--up': px(flutter.up),
              '--d': '150ms',
            } as Vars
          }
        >
          <Bat beat={0.2} />
        </span>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span
            className="pfx-spooky-e pfx-spooky-a-bump"
            style={
              {
                left: '50%',
                top: '32%',
                '--s': px(round ? 26 : 30),
                '--r': deg(popped.r),
                '--lift': round ? '-8px' : '-16px',
              } as Vars
            }
          >
            {PUMPKIN}
          </span>
          <Sweets list={popped.sweets} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-spooky-halo pfx-spooky-a-halo"
            style={round ? { inset: 0 } : { inset: '-15%' }}
          />
          <Lantern x="50%" y="45%" size={party.lantern} />
          <Flyers list={party.flyers} />
          <Sweets list={party.sweets} />
        </Fragment>
      )}
    </>
  );
}

export const spooky: EffectModule = {
  id: 'spooky',
  css,
  vars: (skin: Skin) => ({
    // Candlelight in the accent, deeper for the motes so they show on the fill.
    '--pfx-o4': rgba(skin.colors.accent, 0.4),
    '--pfx-o5': rgba(skin.colors.accent, 0.5),
    '--pfx-o6': rgba(skin.colors.accent, 0.6),
    '--pfx-o': shade(skin.accent, 58),
    '--pfx-o0': shade(skin.accent, 58, 0),
    // A win's glows, in the win color.
    '--pfx-w3': rgba(skin.colors.win, 0.3),
    '--pfx-w5': rgba(skin.colors.win, 0.5),
  }),
  Panel,
  Track,
  Burst,
  Pulse,
};
