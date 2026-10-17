import { type CSSProperties, Fragment, useMemo } from "react";
import { hexToRgb, rgba, shade, toTone } from "../color";
import type { Skin } from "../skin";
import {
  between,
  motionOk,
  rng,
  seedOf,
  type SparkSpec,
  throwSparks,
} from "./primitives";
import type {
  BurstFxProps,
  EffectModule,
  FxHit,
  PanelFxProps,
  PulseFxProps,
  TrackFxProps,
} from "./types";

// Army: the Army preset's, out in the field. Tall grass grows around a bar all the time and sways in
// the wind, with fireflies drifting over it at dusk. Every gain kicks up dust and clods of dirt at
// the fill's edge, as if something rolled forward, and fresh grass shoots up there while sunlight
// runs over what the bar added. A goal reached brings the dawn up behind the bar, with fireflies
// rising and leaves blowing up. Panels are camouflage; they come in with grass springing from their
// bottom corners, and a hero card gets an army star on a plate by a corner. It keeps Aftermath's
// first take on the effect, cleaned up: no rust, no failing lights, no flickering titles.

/** The idle loop; each panel plays it at its own moment. */
const IDLE_MS = 12_000;
/** How many tufts of grass grow behind a bar, and in front of it at its foot. */
const BACK_TUFTS = 13;
const FRONT_TUFTS = 5;
/** How many fireflies drift over a bar's grass, each on a loop of its own. */
const FLIES = 6;
/** Narrower than this, a hit is a poll's vote striking the fill's edge. */
const THIN = 0.004;

/** A five-pointed star, as on army vehicles. */
const STAR = "50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%";

const css = `.pfx-army-tuft{position:absolute;width:0;height:0;opacity:0;transform-origin:0 0}
.pfx-army-back{z-index:-1}
.pfx-army-blade{position:absolute;bottom:0;width:var(--w,3px);height:var(--h,30px);margin-left:calc(var(--w,3px)*-.5);transform-origin:50% 100%;transform:rotate(var(--r,0deg));clip-path:polygon(var(--tip,50%) 0,78% 40%,100% 100%,0 100%,22% 40%);background:linear-gradient(0deg,var(--pfx-g1),var(--pfx-g2) 55%,var(--pfx-g3))}
.pfx-army-dry{background:linear-gradient(0deg,var(--pfx-s1),var(--pfx-s2) 55%,var(--pfx-s3))}
.pfx-army-fly{position:absolute;width:var(--s,5px);height:var(--s,5px);margin:calc(var(--s,5px)*-.5) 0 0 calc(var(--s,5px)*-.5);opacity:0;border-radius:50%;background:radial-gradient(circle,#fffbe0 0 30%,var(--pfx-f) 72%);box-shadow:0 0 calc(var(--s,5px)*1.4) calc(var(--s,5px)*.45) var(--pfx-f6)}
.pfx-army-puff{position:absolute;width:var(--s,40px);height:var(--s,40px);margin:calc(var(--s,40px)*-.5) 0 0 calc(var(--s,40px)*-.5);opacity:0;border-radius:50%;background:radial-gradient(closest-side,var(--pfx-d6),var(--pfx-d3) 55%,var(--pfx-d0))}
.pfx-army-chip{clip-path:polygon(0 22%,58% 0,100% 42%,82% 100%,14% 86%);background:linear-gradient(135deg,var(--pfx-r1),var(--pfx-r) 45%,var(--pfx-r2))}
.pfx-army-leaf{position:absolute;width:var(--s,9px);height:calc(var(--s,9px)*.55);margin:calc(var(--s,9px)*-.28) 0 0 calc(var(--s,9px)*-.5);opacity:0;border-radius:0 100% 0 100%;background:linear-gradient(135deg,var(--pfx-g3),var(--pfx-g1))}
.pfx-army-glow{position:absolute;top:0;bottom:0;opacity:0;transform-origin:0 50%;background:linear-gradient(90deg,rgba(255,250,214,0),var(--pfx-g5) 60%,rgba(255,250,214,.9)),linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,.05) 50%,var(--pfx-w3))}
.pfx-army-mote{position:absolute;width:var(--s,4px);height:var(--s,4px);margin:calc(var(--s,4px)*-.5) 0 0 calc(var(--s,4px)*-.5);opacity:0;border-radius:50%;background:#fff7d0;box-shadow:0 0 4px var(--pfx-w5)}
.pfx-army-dawn{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side,rgba(255,226,160,.8),var(--pfx-w5) 34%,var(--pfx-p3) 62%,var(--pfx-p0))}
.pfx-army-wash{position:absolute;inset:0;opacity:0;background:linear-gradient(180deg,rgba(255,228,170,.55),var(--pfx-w3) 50%,var(--pfx-p2))}
.pfx-army-sign{position:absolute;width:var(--s,40px);height:calc(var(--s,40px)*1.55);opacity:0;transform-origin:50% 100%}
.pfx-army-sign::before{content:'';position:absolute;left:calc(50% - 1.5px);top:calc(var(--s,40px)*.5);bottom:0;width:3px;background:linear-gradient(90deg,#4a4c46,#a4a69d 45%,#4a4c46)}
.pfx-army-bare{height:var(--s,40px);transform-origin:50% 50%}
.pfx-army-bare::before{display:none}
.pfx-army-board{position:absolute;left:0;top:0;display:flex;align-items:center;justify-content:center;width:var(--s,40px);height:var(--s,40px)}
.pfx-army-board::before{content:'';position:absolute;inset:0;border-radius:10%;background:radial-gradient(closest-side,transparent 0 78%,var(--pfx-st) 80% 88%,transparent 90%),var(--pfx-pl);box-shadow:inset 0 0 0 2px var(--pfx-k),0 2px 4px rgba(0,0,0,.45)}
.pfx-army-board::after{content:'';position:absolute;inset:21%;clip-path:polygon(${STAR});background:var(--pfx-st)}
.pfx-army-rim{position:absolute;inset:0;opacity:0;border-radius:inherit;box-shadow:inset 0 0 18px 2px var(--pfx-w5),0 0 14px var(--pfx-w3)}
${motionOk(`@keyframes pfx-army-sway{from{opacity:var(--o,1);transform:rotate(calc(var(--lean,0deg) - var(--sw,4deg)))}to{opacity:var(--o,1);transform:rotate(calc(var(--lean,0deg) + var(--sw,4deg)))}}
@keyframes pfx-army-shoot{0%{opacity:1;transform:rotate(var(--lean,0deg)) scaleY(0);animation-timing-function:cubic-bezier(.2,.8,.3,1.2)}30%{transform:rotate(var(--lean,0deg)) scaleY(1.1)}42%{transform:rotate(calc(var(--lean,0deg) + 3deg)) scaleY(1)}58%{transform:rotate(calc(var(--lean,0deg) - 2deg)) scaleY(1)}80%{opacity:1;transform:rotate(var(--lean,0deg)) scaleY(1)}100%{opacity:0;transform:rotate(var(--lean,0deg)) scaleY(1)}}
@keyframes pfx-army-wander{0%{opacity:0;transform:translate(0,0)}10%{opacity:var(--o,.9)}25%{transform:translate(var(--x1),var(--y1))}31%{opacity:calc(var(--o,.9)*.15)}38%{opacity:var(--o,.9)}50%{transform:translate(var(--x2),var(--y2))}63%{opacity:calc(var(--o,.9)*.2)}70%{opacity:var(--o,.9)}75%{transform:translate(var(--x3),var(--y3))}90%{opacity:var(--o,.9)}100%{opacity:0;transform:translate(0,0)}}
@keyframes pfx-army-rise{0%{opacity:0;transform:translate(0,0) scale(.5)}12%{opacity:1;transform:translate(calc(var(--dx)*.12),calc(var(--up)*.12)) scale(1)}40%{opacity:.3}52%{opacity:1}82%{opacity:.9}100%{opacity:0;transform:translate(var(--dx),var(--up)) scale(.8)}}
@keyframes pfx-army-puff{0%{opacity:0;transform:translate(0,0) scale(.3)}15%{opacity:1}100%{opacity:0;transform:translate(var(--dx,0px),var(--dy,-10px)) scale(var(--grow,1.5))}}
@keyframes pfx-army-leaf{0%{opacity:0;transform:translate(0,0) rotate(0deg)}14%{opacity:1}80%{opacity:.9}100%{opacity:0;transform:translate(var(--dx),var(--up)) rotate(var(--spin,360deg))}}
@keyframes pfx-army-glow{0%{opacity:1;transform:scaleX(0);animation-timing-function:cubic-bezier(.2,.9,.3,1.1)}55%{opacity:1;transform:scaleX(1);animation-timing-function:ease-in}100%{opacity:0;transform:scaleX(1)}}
@keyframes pfx-army-mote{0%{opacity:0;transform:translate(0,0) scale(.4)}20%{opacity:1;transform:translate(calc(var(--dx)*.2),calc(var(--dy)*.2)) scale(1)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.6)}}
@keyframes pfx-army-dawn{0%{opacity:0;transform:translateY(30%) scale(.8)}35%{opacity:1;transform:translateY(0) scale(1)}75%{opacity:.9}100%{opacity:0;transform:translateY(-6%) scale(1.08)}}
@keyframes pfx-army-flash{0%{opacity:0}20%{opacity:1}100%{opacity:0}}
@keyframes pfx-army-swing{0%{opacity:0;transform:scaleY(.2) rotate(-14deg)}12%{opacity:1;transform:scaleY(1.06) rotate(10deg)}26%{transform:scaleY(1) rotate(-7deg)}40%{transform:scaleY(1) rotate(4deg)}54%{transform:scaleY(1) rotate(-2deg)}66%{transform:scaleY(1) rotate(var(--rest,-4deg))}84%{opacity:1;transform:scaleY(1) rotate(var(--rest,-4deg))}100%{opacity:0;transform:scaleY(1) rotate(var(--rest,-4deg))}}
@keyframes pfx-army-drift{0%,78%{opacity:0;transform:translate(0,0) scale(.6)}82%{opacity:.95;transform:translate(calc(var(--dx)*.15),calc(var(--up)*.15)) scale(1)}89%{opacity:.25}92%{opacity:.95}100%{opacity:0;transform:translate(var(--dx),var(--up)) scale(.8)}}
.pfx-army-a-sway{animation:pfx-army-sway var(--t,3s) ease-in-out var(--sync,0s) infinite alternate}
.pfx-army-a-shoot{animation:pfx-army-shoot var(--t,1.5s) linear var(--d,0s) backwards}
.pfx-army-a-wander{animation:pfx-army-wander var(--t,9s) ease-in-out var(--sync,0s) infinite}
.pfx-army-a-rise{animation:pfx-army-rise var(--t,2s) ease-out var(--d,0s) backwards}
.pfx-army-a-puff{animation:pfx-army-puff var(--t,1s) ease-out var(--d,0s) backwards}
.pfx-army-a-leaf{animation:pfx-army-leaf var(--t,1.6s) ease-out var(--d,0s) backwards}
.pfx-army-a-glow{animation:pfx-army-glow var(--t,1.1s) linear var(--d,0s) backwards}
.pfx-army-a-mote{animation:pfx-army-mote var(--t,1s) ease-out var(--d,0s) backwards}
.pfx-army-a-dawn{animation:pfx-army-dawn var(--t,2.6s) ease-out var(--d,0s) backwards}
.pfx-army-a-flash{animation:pfx-army-flash var(--t,1.8s) ease-out var(--d,0s) backwards}
.pfx-army-a-swing{animation:pfx-army-swing var(--t,2.8s) ease-out var(--d,0s) backwards}
.pfx-army-a-drift{animation:pfx-army-drift ${IDLE_MS}ms ease-out var(--sync,0s) infinite}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;
const px = (value: number) => `${Math.round(value * 10) / 10}px`;
const ms = (value: number) => `${Math.round(value)}ms`;
const deg = (value: number) => `${Math.round(value)}deg`;
const alpha = (value: number) => String(Math.round(value * 100) / 100);
const sign = (next: () => number) => (next() < 0.5 ? -1 : 1);

/** A color a little lighter, for the tips of blades that catch the light. */
function lighter(hex: string, lift = 12): string {
  const [r, g, b] = hexToRgb(hex).map(value => value / 255);
  const lightness = ((Math.max(r, g, b) + Math.min(r, g, b)) / 2) * 100;
  return shade(toTone(hex), Math.round(Math.min(100, lightness + lift)));
}

/** A camouflage blob: an ellipse at a spot on a tile, in px before scaling. */
type Blob = [
  x: number,
  y: number,
  rx: number,
  ry: number,
  color: "light" | "brown" | "dark" | "black",
];

/**
 * Woodland camouflage, still: blobs of khaki, brown, dark green and near black on two tiles of
 * different sizes, so the pattern doesn't line up into a grid on a big panel. Its colors come from
 * the preset, and it's as faint as its box.
 */
function camouflage(skin: Skin, scale: number, opacity: number): string {
  if (opacity <= 0) return "";
  const strength = (value: number) =>
    Math.round(value * Math.min(1, opacity) * 100) / 100;
  const size = Math.max(0.6, scale);
  const colors = {
    light: shade(toTone(skin.colors.muted), 62, strength(0.2)),
    brown: shade(toTone(skin.colors.frame), 26, strength(0.32)),
    dark: shade(skin.accent, 16, strength(0.4)),
    black: shade(skin.accent, 7, strength(0.34)),
  };
  const tile = (width: number, height: number, blobs: Blob[]) => {
    const w = Math.round(width * size);
    const h = Math.round(height * size);
    return blobs.map(([x, y, rx, ry, color]) => {
      const at = (value: number) => Math.round(value * size);
      return `radial-gradient(${at(rx)}px ${at(ry)}px at ${at(x)}px ${at(y)}px, ${colors[color]} 0 88%, transparent 100%) 0 0 / ${w}px ${h}px`;
    });
  };
  return [
    ...tile(170, 120, [
      [44, 30, 40, 18, "light"],
      [112, 70, 46, 22, "dark"],
      [70, 100, 24, 12, "black"],
      [138, 24, 30, 16, "brown"],
    ]),
    ...tile(230, 150, [
      [62, 112, 52, 24, "brown"],
      [182, 42, 38, 20, "dark"],
      [150, 124, 28, 14, "light"],
      [32, 30, 20, 10, "black"],
    ]),
  ].join(", ");
}

interface Blade {
  id: number;
  /** Where it grows from, beside the tuft's root, in px. */
  x: number;
  h: number;
  w: number;
  /** Its lean, in degrees, and where its tip sits across its width. */
  r: number;
  tip: number;
  dry: boolean;
}

interface Tuft {
  id: number;
  /** Its root: px, or a CSS position in the layer it's drawn in. */
  x: number | string;
  y: number | string;
  lean: number;
  /** How far it sways either way, in degrees. */
  sway: number;
  o: number;
  t: number;
  /** Where in its loop it is when it mounts, or how long it waits to spring up, in ms. */
  phase: number;
  blades: Blade[];
}

interface TuftSpec {
  x: number | string;
  y: number | string;
  height: number;
  blades: number;
  o?: number;
  t?: number;
  phase?: number;
}

/** A tuft of grass: blades fanned out from one root, a few of them dried to straw. */
function tuft(next: () => number, id: number, spec: TuftSpec): Tuft {
  const count = spec.blades;
  return {
    id,
    x: spec.x,
    y: spec.y,
    lean: between(next, -6, 6),
    sway: between(next, 2.5, 5),
    o: spec.o ?? 1,
    t: spec.t ?? between(next, 2600, 4200),
    phase: spec.phase ?? between(next, 0, 4000),
    blades: Array.from({ length: count }, (_, blade) => ({
      id: blade,
      x: between(next, -0.1, 0.1) * spec.height,
      h: spec.height * between(next, 0.62, 1),
      w: Math.max(2.5, spec.height * between(next, 0.07, 0.12)),
      // Fanned out from the middle blade, each a little off.
      r: (blade - (count - 1) / 2) * 7 + between(next, -8, 8),
      tip: between(next, 30, 70),
      dry: next() < 0.18,
    })),
  };
}

/** Tufts swaying in the wind on loops of their own, or springing up once (`grow`). */
function Tufts({
  list,
  back = false,
  grow = false,
}: {
  list: readonly Tuft[];
  back?: boolean;
  grow?: boolean;
}) {
  return list.map(clump => (
    <span
      key={clump.id}
      className={`pfx-army-tuft${back ? " pfx-army-back" : ""} pfx-army-a-${grow ? "shoot" : "sway"}`}
      style={
        {
          left: clump.x,
          top: clump.y,
          "--lean": deg(clump.lean),
          "--sw": deg(clump.sway),
          "--o": alpha(clump.o),
          "--t": ms(clump.t),
          ...(grow
            ? { "--d": ms(clump.phase) }
            : { "--sync": ms(-clump.phase) }),
        } as Vars
      }>
      {clump.blades.map(blade => (
        <i
          key={blade.id}
          className={
            blade.dry ? "pfx-army-blade pfx-army-dry" : "pfx-army-blade"
          }
          style={
            {
              left: px(blade.x),
              "--h": px(blade.h),
              "--w": px(blade.w),
              "--r": deg(blade.r),
              "--tip": `${Math.round(blade.tip)}%`,
            } as Vars
          }
        />
      ))}
    </span>
  ));
}

interface Fly {
  id: number;
  x: number;
  y: number;
  size: number;
  o: number;
  /** Three stops on its loop, in px from where it starts. */
  path: [number, number][];
  t: number;
  phase: number;
}

/** Fireflies drifting over the grass, blinking as they go. */
function Flies({ list }: { list: readonly Fly[] }) {
  return list.map(fly => (
    <span
      key={fly.id}
      className="pfx-army-fly pfx-army-a-wander"
      style={
        {
          left: px(fly.x),
          top: px(fly.y),
          "--s": px(fly.size),
          "--o": alpha(fly.o),
          "--x1": px(fly.path[0][0]),
          "--y1": px(fly.path[0][1]),
          "--x2": px(fly.path[1][0]),
          "--y2": px(fly.path[1][1]),
          "--x3": px(fly.path[2][0]),
          "--y3": px(fly.path[2][1]),
          "--t": ms(fly.t),
          "--sync": ms(-fly.phase),
        } as Vars
      }
    />
  ));
}

interface Riser {
  id: number;
  x: number | string;
  y: number | string;
  size: number;
  dx: number;
  up: number;
  t: number;
  d: number;
}

/** Fireflies rising from the grass once, blinking on the way up. */
function Risers({ list }: { list: readonly Riser[] }) {
  return list.map(fly => (
    <span
      key={fly.id}
      className="pfx-army-fly pfx-army-a-rise"
      style={
        {
          left: fly.x,
          top: fly.y,
          "--s": px(fly.size),
          "--dx": px(fly.dx),
          "--up": px(fly.up),
          "--t": ms(fly.t),
          "--d": ms(fly.d),
        } as Vars
      }
    />
  ));
}

interface Puff {
  id: number;
  x: number | string;
  y: number | string;
  size: number;
  dx: number;
  dy: number;
  grow: number;
  t: number;
  d: number;
}

/** Dust kicked up, billowing out as it fades. */
function Puffs({ list }: { list: readonly Puff[] }) {
  return list.map(puff => (
    <span
      key={puff.id}
      className="pfx-army-puff pfx-army-a-puff"
      style={
        {
          left: puff.x,
          top: puff.y,
          "--s": px(puff.size),
          "--dx": px(puff.dx),
          "--dy": px(puff.dy),
          "--grow": alpha(puff.grow),
          "--t": ms(puff.t),
          "--d": ms(puff.d),
        } as Vars
      }
    />
  ));
}

/** A dust cloud of a few puffs around a point, drifting up and out. */
function dust(
  next: () => number,
  x: number | string,
  y: number | string,
  size: number,
  count: number,
  delay = 0,
): Puff[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    x,
    y,
    size: size * between(next, 0.7, 1.1),
    dx: between(next, -0.5, 0.5) * size,
    dy: -between(next, 0.15, 0.45) * size,
    grow: between(next, 1.3, 1.8),
    t: between(next, 900, 1250),
    d: delay + between(next, 0, 120),
  }));
}

/** Clods of dirt knocked loose and flung like sparks, each at a tilt of its own. */
function Chips({ list }: { list: readonly SparkSpec[] }) {
  return list.map(chip => (
    <span
      key={chip.id}
      className="pfx-sp"
      style={
        {
          left: chip.x,
          top: chip.y,
          "--dx": px(chip.dx),
          "--t": ms(chip.t),
          "--d": ms(chip.d),
        } as Vars
      }>
      <i
        className="pfx-army-chip"
        style={
          {
            width: px(chip.w * 0.8),
            height: px(chip.w * 0.6),
            marginLeft: px(-chip.w * 0.4),
            marginTop: px(-chip.w * 0.3),
            "--up": px(chip.up),
            "--down": px(chip.down),
            "--r": deg(chip.r * 3),
          } as Vars
        }
      />
    </span>
  ));
}

interface Leaf {
  id: number;
  x: number | string;
  y: number | string;
  size: number;
  dx: number;
  up: number;
  spin: number;
  t: number;
  d: number;
}

/** Leaves blown up and away, turning over as they go. */
function Leaves({ list }: { list: readonly Leaf[] }) {
  return list.map(leaf => (
    <span
      key={leaf.id}
      className="pfx-army-leaf pfx-army-a-leaf"
      style={
        {
          left: leaf.x,
          top: leaf.y,
          "--s": px(leaf.size),
          "--dx": px(leaf.dx),
          "--up": px(leaf.up),
          "--spin": deg(leaf.spin),
          "--t": ms(leaf.t),
          "--d": ms(leaf.d),
        } as Vars
      }
    />
  ));
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

/** Pollen along what a bar gained, each lifting as the sunlight passes it. */
function motes(
  next: () => number,
  from: number,
  to: number,
  count: number,
): Mote[] {
  const start = Math.min(from, to);
  const span = Math.abs(to - from);
  return Array.from({ length: count }, (_, id) => {
    const along = (id + between(next, 0.15, 0.85)) / count;
    return {
      id,
      x: pct(start + span * along),
      y: pct(between(next, 0.3, 0.8)),
      dx: between(next, -5, 7),
      dy: -between(next, 5, 12),
      size: between(next, 3, 4.5),
      t: between(next, 900, 1300),
      // The fill's edge covers most of the way early on, and the light rides it.
      d: 60 + 380 * along * along,
    };
  });
}

function Motes({ list }: { list: readonly Mote[] }) {
  return list.map(mote => (
    <span
      key={mote.id}
      className="pfx-army-mote pfx-army-a-mote"
      style={
        {
          left: mote.x,
          top: mote.y,
          "--s": px(mote.size),
          "--dx": px(mote.dx),
          "--dy": px(mote.dy),
          "--t": ms(mote.t),
          "--d": ms(mote.d),
        } as Vars
      }
    />
  ));
}

/**
 * An army star on an olive plate, on a post standing on a card's top edge: it springs up, wobbles,
 * settles leaning a little, then fades. Inside a webcam frame's band it has no post.
 */
function Sign({
  left,
  right,
  top,
  size,
  rest,
  post,
  d,
}: {
  left?: number;
  right?: number;
  top: number;
  size: number;
  rest: number;
  post: boolean;
  d: number;
}) {
  return (
    <span
      className={`pfx-army-sign${post ? "" : " pfx-army-bare"} pfx-army-a-swing`}
      style={
        {
          left,
          right,
          top,
          "--s": px(size),
          "--rest": deg(rest),
          "--d": ms(d),
        } as Vars
      }>
      <span className="pfx-army-board" />
    </span>
  );
}

/** A point on a panel's edge, or in the middle of the band around a webcam, as CSS left/top. */
function edgePoint(next: () => number, band: number): { x: string; y: string } {
  const along = pct(between(next, 0.1, 0.9));
  const inset = band ? band / 2 : 0;
  switch (Math.floor(next() * 4)) {
    case 0:
      return { x: along, y: px(inset) };
    case 1:
      return { x: along, y: `calc(100% - ${px(inset)})` };
    case 2:
      return { x: px(inset), y: along };
    default:
      return { x: `calc(100% - ${px(inset)})`, y: along };
  }
}

interface Entrance {
  /** Grass springing up from the bottom corners, or at a list row's end. */
  tufts: Tuft[];
  puffs: Puff[];
  /** A hero card's sign by a top corner, and fireflies rising off its bottom edge. */
  sign: {
    left?: number;
    right?: number;
    top: number;
    size: number;
    rest: number;
    post: boolean;
  } | null;
  flies: Riser[];
}

function enter(
  next: () => number,
  mode: PanelFxProps["mode"],
  size: number,
  band: number,
): Entrance {
  const grass = (height: number) =>
    band ? Math.min(height, band * 0.85) : height;
  if (mode === "enter") {
    // A list row: a tuft springs up at its end.
    const height = grass(16 * size);
    return {
      tufts: [
        tuft(next, 0, {
          x: `calc(100% - ${px(14 * size)})`,
          y: "100%",
          height,
          blades: 4,
          t: 1500,
          phase: 120,
        }),
      ],
      puffs: dust(
        next,
        `calc(100% - ${px(14 * size)})`,
        "100%",
        18 * size,
        1,
        80,
      ),
      sign: null,
      flies: [],
    };
  }
  const big = mode === "hero";
  const height = grass((big ? 30 : 22) * size);
  // Off the corner's curve, at the panel's foot; around a webcam inside the frame's band.
  const side = band ? band * 1.2 : 12 * size;
  const roots = big ? [side, "50%", side] : [side, side];
  const tufts = roots.map((root, id) =>
    tuft(next, id, {
      x:
        typeof root === "string"
          ? `calc(${root} + ${px(between(next, -30, 30) * size)})`
          : id === roots.length - 1
            ? `calc(100% - ${px(root)})`
            : px(root),
      y: "100%",
      height: height * between(next, 0.85, 1.1),
      blades: big ? 6 : 5,
      t: big ? 2000 : 1700,
      phase: (big ? 300 : 100) + id * 140,
    }),
  );
  const puffs = dust(
    next,
    pct(between(next, 0.3, 0.7)),
    "100%",
    (big ? 36 : 26) * size,
    2,
    60,
  );
  if (!big) return { tufts, puffs, sign: null, flies: [] };
  const sign = band ? Math.min(34 * size, band * 0.9) : 40 * size;
  const onRight = next() < 0.5;
  // Its post's foot on the card's top edge, past the corner's curve; never over the card.
  const corner = band ? side : side + 8 * size;
  return {
    tufts,
    puffs,
    sign: {
      left: onRight ? undefined : corner,
      right: onRight ? corner : undefined,
      top: band ? (band - sign) / 2 : 2 - sign * 1.55,
      size: sign,
      rest: between(next, 3, 7) * (onRight ? 1 : -1),
      post: !band,
    },
    // Around a webcam they'd rise over the picture.
    flies: band
      ? []
      : Array.from({ length: 4 }, (_, id) => ({
          id,
          x: pct(between(next, 0.15, 0.85)),
          y: "100%",
          size: between(next, 4, 6) * size,
          dx: between(next, -18, 18) * size,
          up: -between(next, 34, 70) * size,
          t: between(next, 1800, 2400),
          d: 600 + id * 220 + between(next, 0, 120),
        })),
  };
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const size = Math.min(1.4, Math.max(0.5, scale));
  const band = ring ? Math.round(ring) : 0;
  const entrance = useMemo(
    () => enter(rng(seed), mode, size, band),
    [seed, mode, size, band],
  );
  // Now and then a firefly drifts up off the panel.
  const idle = useMemo(() => {
    const next = rng(seedOf(`${seed}:idle`));
    return {
      x: next() < 0.5 ? px(16 * size) : `calc(100% - ${px(16 * size)})`,
      dx: between(next, -14, 14) * size,
      up: -between(next, 30, 48) * size,
      sync: -(seed * IDLE_MS),
    };
  }, [seed, size]);
  // A pulse: a tuft pushes up through the top edge by a corner, shaking off dust and dirt.
  const shake = useMemo(() => {
    const next = rng(seedOf(`${seed}:${pulse}`));
    const inset = band ? band : 22 * size;
    const x = next() < 0.5 ? `calc(100% - ${px(inset)})` : px(inset);
    const y = band ? band / 2 : 0;
    return {
      tufts: [
        tuft(next, 0, {
          x,
          y: band ? band * 0.9 : 1,
          height: band ? Math.min(20 * size, band * 0.8) : 20 * size,
          blades: 5,
          t: 1300,
          phase: 0,
        }),
      ],
      puffs: dust(
        next,
        x,
        y,
        (band ? Math.min(36, band * 1.2) : 36) * size,
        3,
        60,
      ),
      chips: throwSparks(next, {
        count: 5,
        x,
        y,
        spread: (band ? 20 : 28) * size,
        rise: band ? [0, band * 0.2] : [4 * size, 14 * size],
        fall: band ? [band * 0.2, band * 0.6] : [20 * size, 44 * size],
        ms: [600, 900],
        delay: 60,
        jitter: 80,
        size: Math.min(size, 1),
      }),
    };
  }, [seed, pulse, size, band]);
  // A win: warm light round the rim, and fireflies rising off the bottom edge; around a webcam
  // they blink on the band instead.
  const party = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return Array.from({ length: band ? 6 : 8 }, (_, id): Riser => {
      if (band) {
        const point = edgePoint(next, band);
        return {
          id,
          ...point,
          size: Math.min(6 * size, band * 0.4),
          dx: between(next, -4, 4),
          up: -band * between(next, 0.1, 0.25),
          t: between(next, 1400, 1900),
          d: 150 + id * 160 + between(next, 0, 80),
        };
      }
      return {
        id,
        x: pct((id + between(next, 0.2, 0.8)) / 8),
        y: "100%",
        size: between(next, 4, 6.5) * size,
        dx: between(next, -20, 20) * size,
        up: -between(next, 40, 90) * size,
        t: between(next, 1800, 2500),
        d: 150 + id * 120 + between(next, 0, 100),
      };
    });
  }, [seed, win, size, band]);
  // A frame around a webcam keeps its glow inside its band, off the picture.
  const rim = band
    ? { boxShadow: `inset 0 0 ${Math.round(band * 0.8)}px var(--pfx-w5)` }
    : undefined;
  return (
    <>
      <Tufts list={entrance.tufts} grow />
      <Puffs list={entrance.puffs} />
      {entrance.sign && <Sign {...entrance.sign} d={150} />}
      <Risers list={entrance.flies} />
      {mode === "full" && !band && (
        <span
          className="pfx-army-fly pfx-army-a-drift"
          style={
            {
              left: idle.x,
              top: "100%",
              "--s": px(5 * size),
              "--dx": px(idle.dx),
              "--up": px(idle.up),
              "--sync": ms(idle.sync),
            } as Vars
          }
        />
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <Tufts list={shake.tufts} grow />
          <Puffs list={shake.puffs} />
          <Chips list={shake.chips} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-army-rim pfx-army-a-flash"
            style={{ ...rim, "--t": "1.9s" } as Vars}
          />
          <Risers list={party} />
        </Fragment>
      )}
    </>
  );
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
    return {
      motes: motes(next, hit.from, hit.to, 4),
      puff: dust(next, pct(hit.to), "60%", 18, 1),
    };
  }, [seed, hit]);
  const pollen = useMemo(
    () => motes(rng(seedOf(`${seed}:w${win}`)), 0, 1, 8),
    [seed, win],
  );
  const thin = hit ? Math.abs(hit.to - hit.from) <= THIN : false;
  return (
    <>
      {hit &&
        strike &&
        hits > 0 &&
        (thin ? (
          // A poll's vote: a little dust kicked up at the fill's edge.
          <Puffs key={`h${hits}`} list={strike.puff} />
        ) : (
          <Fragment key={`h${hits}`}>
            {/* Sunlight runs over what the bar gained, and pollen lifts off it. */}
            <span
              className="pfx-army-glow pfx-army-a-glow"
              style={segment(hit)}
            />
            <Motes list={strike.motes} />
          </Fragment>
        ))}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-army-wash pfx-army-a-flash"
            style={{ "--t": "2.2s" } as Vars}
          />
          <span
            className="pfx-army-glow pfx-army-a-glow"
            style={{ left: 0, width: "100%", "--t": "1.9s" } as Vars}
          />
          <Motes list={pollen} />
        </Fragment>
      )}
    </>
  );
}

/** Tall grass behind a bar, its tips over the top edge, and short tufts in front at its foot. */
function meadow(
  next: () => number,
  left: number,
  right: number,
  y: number,
  height: number,
): { back: Tuft[]; front: Tuft[] } {
  const foot = y + height / 2;
  const back = Array.from({ length: BACK_TUFTS }, (_, id) =>
    tuft(next, id, {
      x:
        left + ((right - left) * (id + between(next, 0.15, 0.85))) / BACK_TUFTS,
      y: foot,
      height: height * between(next, 1.3, 1.9),
      blades: 5 + Math.floor(next() * 4),
      o: between(next, 0.85, 1),
    }),
  );
  // In front only here and there along the bar, and short: the bar stays readable.
  const spots = [
    between(next, 0.01, 0.05),
    between(next, 0.18, 0.3),
    between(next, 0.45, 0.55),
    between(next, 0.7, 0.82),
    between(next, 0.95, 0.99),
  ].slice(0, FRONT_TUFTS);
  const front = spots.map((at, id) =>
    tuft(next, id, {
      x: left + (right - left) * at,
      y: foot + 2,
      height: height * between(next, 0.38, 0.55),
      blades: 4 + Math.floor(next() * 3),
    }),
  );
  return { back, front };
}

/** Fireflies over a bar's grass, mostly above it, each wandering a loop of its own. */
function fireflies(
  next: () => number,
  left: number,
  right: number,
  y: number,
  height: number,
): Fly[] {
  const roam = () => [
    between(next, -0.7, 0.7) * height,
    between(next, -0.45, 0.45) * height,
  ];
  return Array.from({ length: FLIES }, (_, id) => {
    const t = between(next, 7000, 11_000);
    return {
      id,
      x: left + ((right - left) * (id + between(next, 0.2, 0.8))) / FLIES,
      y: y - height * between(next, 0.75, 1.45),
      size: between(next, 4, 6),
      o: between(next, 0.75, 1),
      path: [roam(), roam(), roam()] as [number, number][],
      t,
      phase: between(next, 0, t),
    };
  });
}

function Burst({ seed, hit, hits, win, left, right, y, height }: BurstFxProps) {
  // Always there while the bar is, and never replayed: hits and wins leave it as it is.
  const field = useMemo(() => {
    const next = rng(seedOf(`${seed}:field`));
    return {
      ...meadow(next, left, right, y, height),
      flies: fireflies(next, left, right, y, height),
    };
  }, [seed, left, right, y, height]);
  const kicked = useMemo(() => {
    if (!hit) return null;
    const next = rng(seedOf(`${seed}:${hit.key}`));
    const x = left + (right - left) * hit.to;
    return {
      puffs: dust(next, x, y + height * 0.2, height * 1.5, 4),
      chips: throwSparks(next, {
        count: 6 + Math.floor(next() * 2),
        x,
        y: y - height * 0.1,
        spread: 80,
        rise: [26, 72],
        fall: [20, 56],
        ms: [650, 950],
        delay: 40,
        jitter: 90,
        size: 1.7,
      }),
      // Fresh grass shoots up on the bar's top edge, right where it grew to.
      sprout: [
        tuft(next, 0, {
          x,
          y: y - height / 2 + 1,
          height: height * 1.05,
          blades: 7,
          t: 1600,
          phase: 90,
        }),
      ],
    };
  }, [seed, hit, left, right, y, height]);
  const party = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    const middle = (left + right) / 2;
    const span = right - left;
    return {
      dawn: { w: Math.min(span * 1.3, height * 9), h: height * 3.2 },
      flies: Array.from({ length: 16 }, (_, id): Riser => ({
        id,
        x: middle + span * 0.7 * ((id + between(next, 0.2, 0.8)) / 16 - 0.5),
        y: y + height * between(next, -0.2, 0.4),
        size: between(next, 4.5, 7),
        dx: between(next, -0.8, 0.8) * height,
        up: -height * between(next, 1.4, 3),
        t: between(next, 1800, 2600),
        d: between(next, 0, 600),
      })),
      leaves: Array.from({ length: 8 }, (_, id): Leaf => {
        const side = sign(next);
        return {
          id,
          x: middle + between(next, -0.3, 0.3) * span * 0.5,
          y: y - height * 0.2,
          size: between(next, 8, 12),
          dx: side * between(next, 1, 3) * height,
          up: -height * between(next, 1.5, 2.8),
          spin: side * between(next, 180, 420),
          t: between(next, 1400, 1900),
          d: between(next, 200, 500),
        };
      }),
    };
  }, [seed, win, left, right, y, height]);
  return (
    <>
      {/* The tall grass is behind the bar and its text, so they stay readable for hours. */}
      <Tufts list={field.back} back />
      <Flies list={field.flies} />
      {kicked && hits > 0 && (
        <Fragment key={`h${hits}`}>
          <Puffs list={kicked.puffs} />
          <Tufts list={kicked.sprout} grow />
          <Chips list={kicked.chips} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          {/* The dawn comes up behind the bar. */}
          <span
            className="pfx-army-dawn pfx-army-back pfx-army-a-dawn"
            style={{
              left: px((left + right) / 2 - party.dawn.w / 2),
              top: px(y - party.dawn.h * 0.6),
              width: px(party.dawn.w),
              height: px(party.dawn.h),
            }}
          />
          <Risers list={party.flies} />
          <Leaves list={party.leaves} />
        </Fragment>
      )}
      {/* Short tufts at the bar's foot, in front of it. */}
      <Tufts list={field.front} />
    </>
  );
}

function Pulse({ seed, pulse, win, enter: entering, round }: PulseFxProps) {
  // A chat line: a firefly blinks off its end.
  const flit = useMemo(() => {
    const next = rng(seed);
    return { dx: between(next, 8, 16), up: -between(next, 12, 20) };
  }, [seed]);
  const shake = useMemo(() => {
    const next = rng(seedOf(`${seed}:${pulse}`));
    return {
      puffs: dust(next, "50%", "58%", round ? 30 : 40, 2),
      chips: throwSparks(next, {
        count: 4,
        x: "50%",
        y: "40%",
        spread: round ? 22 : 34,
        rise: round ? [6, 16] : [10, 28],
        fall: round ? [6, 16] : [10, 30],
        ms: [550, 800],
        delay: 60,
        jitter: 70,
      }),
    };
  }, [seed, pulse, round]);
  const party = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return Array.from({ length: 6 }, (_, id): Riser => ({
      id,
      x: pct(between(next, 0.25, 0.75)),
      y: round ? "62%" : "70%",
      size: between(next, 4, 6),
      dx: between(next, -1, 1) * (round ? 12 : 22),
      up: -between(next, round ? 16 : 26, round ? 30 : 56),
      t: between(next, 1500, 2100),
      d: 100 + id * 120 + between(next, 0, 80),
    }));
  }, [seed, win, round]);
  return (
    <>
      {entering && (
        <span
          className="pfx-army-fly pfx-army-a-rise"
          style={
            {
              right: 4,
              bottom: 4,
              margin: 0,
              "--s": "5px",
              "--dx": px(flit.dx),
              "--up": px(flit.up),
              "--t": "1.4s",
              "--d": "150ms",
            } as Vars
          }
        />
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <Puffs list={shake.puffs} />
          <Chips list={shake.chips} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-army-dawn pfx-army-a-dawn"
            style={round ? { inset: 0 } : { inset: "-15%" }}
          />
          <Risers list={party} />
        </Fragment>
      )}
    </>
  );
}

export const army: EffectModule = {
  id: "army",
  css,
  vars: (skin: Skin) => {
    const clay = toTone(skin.colors.frame);
    // The main color, livelier for a firefly's glow, and turned toward straw for dried blades.
    const glow = { h: skin.accent.h, s: Math.min(100, skin.accent.s + 18) };
    const straw = {
      h: (skin.accent.h + 342) % 360,
      s: Math.min(100, skin.accent.s + 6),
    };
    // A preset can pin its grass in `colors.fx`: roots, blades and dried blades.
    const [roots, blades, dry]: (string | undefined)[] = skin.colors.fx ?? [];
    return {
      // Grass: dark at the roots, a little lighter at the tips.
      "--pfx-g1": roots ?? shade(skin.accent, 22),
      "--pfx-g2": blades ?? shade(skin.accent, 42),
      "--pfx-g3": blades ? lighter(blades) : shade(skin.accent, 66),
      "--pfx-g5": shade(skin.accent, 58, 0.5),
      // Dried blades, from the same roots.
      "--pfx-s1": roots ?? shade(straw, 26),
      "--pfx-s2": dry ?? shade(straw, 46),
      "--pfx-s3": dry ? lighter(dry) : shade(straw, 68),
      // Clods of dirt in the frame's khaki, darker underneath.
      "--pfx-r1": shade(clay, 64),
      "--pfx-r": skin.colors.frame,
      "--pfx-r2": shade(clay, 24),
      // Dust in the muted color.
      "--pfx-d0": rgba(skin.colors.muted, 0),
      "--pfx-d3": rgba(skin.colors.muted, 0.35),
      "--pfx-d6": rgba(skin.colors.muted, 0.7),
      // The sign's plate, its star and its khaki edge.
      "--pfx-pl": shade(skin.accent, 30),
      "--pfx-st": skin.colors.text,
      "--pfx-k": skin.colors.frame,
      // The dawn in the win color.
      "--pfx-w": skin.colors.win,
      "--pfx-w3": rgba(skin.colors.win, 0.3),
      "--pfx-w5": rgba(skin.colors.win, 0.5),
      // A firefly's glow, in the main color.
      "--pfx-f": shade(glow, 78),
      "--pfx-f6": shade(glow, 62, 0.6),
      // A dusk sky's pink at the dawn's edge, the same in any preset.
      "--pfx-p0": "rgba(226,150,164,0)",
      "--pfx-p2": "rgba(226,150,164,.2)",
      "--pfx-p3": "rgba(226,150,164,.3)",
    };
  },
  panelLayer: camouflage,
  Panel,
  Track,
  Burst,
  Pulse,
};
