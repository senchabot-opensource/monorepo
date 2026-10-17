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

// Reclaim: Aftermath's. Nature has taken the city back. Tall grass grows around a bar all the time
// and sways in the wind, with fireflies drifting over it, and a rusty cog turns at the bar's start.
// Every gain clicks the cog round, kicks up dust and rust chips at the fill's edge, and fresh grass
// shoots up there while sunlight runs over what the bar added; the bar itself is grimy and rust
// spotted. A goal reached spins the cog in a puff of steam and brings the dawn up behind the bar,
// with fireflies rising and leaves blowing up. Panels are rusted, riveted iron plates; they come in
// with grass springing from their bottom corners, a hero card with a rusty warning sign swinging on
// a corner, and now and then a panel's lamp flickers like a failing light.

/** The idle loop; each panel plays it at its own moment. */
const IDLE_MS = 12_000;
/** The titles' flicker comes round this often. */
const TITLE_MS = 11_000;
/** How many tufts of grass grow behind a bar, and in front of it at its foot. */
const BACK_TUFTS = 13;
const FRONT_TUFTS = 5;
/** How many fireflies drift over a bar's grass, each on a loop of its own. */
const FLIES = 6;
/** Narrower than this, a hit is a poll's vote striking the fill's edge. */
const THIN = 0.004;
/** How long a bar's cog takes to turn once on its own. */
const GEAR_MS = 24_000;

const DIAMOND = "50% 0,100% 50%,50% 100%,0 50%";

const css = `.pfx-reclaim-tuft{position:absolute;width:0;height:0;opacity:0;transform-origin:0 0}
.pfx-reclaim-back{z-index:-1}
.pfx-reclaim-blade{position:absolute;bottom:0;width:var(--w,3px);height:var(--h,30px);margin-left:calc(var(--w,3px)*-.5);transform-origin:50% 100%;transform:rotate(var(--r,0deg));clip-path:polygon(var(--tip,50%) 0,78% 40%,100% 100%,0 100%,22% 40%);background:linear-gradient(0deg,var(--pfx-g1),var(--pfx-g2) 55%,var(--pfx-g3))}
.pfx-reclaim-dry{background:linear-gradient(0deg,var(--pfx-s1),var(--pfx-s2) 55%,var(--pfx-s3))}
.pfx-reclaim-fly{position:absolute;width:var(--s,5px);height:var(--s,5px);margin:calc(var(--s,5px)*-.5) 0 0 calc(var(--s,5px)*-.5);opacity:0;border-radius:50%;background:radial-gradient(circle,#fffbe0 0 30%,var(--pfx-f) 72%);box-shadow:0 0 calc(var(--s,5px)*1.4) calc(var(--s,5px)*.45) var(--pfx-f6)}
.pfx-reclaim-puff{position:absolute;width:var(--s,40px);height:var(--s,40px);margin:calc(var(--s,40px)*-.5) 0 0 calc(var(--s,40px)*-.5);opacity:0;border-radius:50%;background:radial-gradient(closest-side,var(--pfx-d6),var(--pfx-d3) 55%,var(--pfx-d0))}
.pfx-reclaim-chip{clip-path:polygon(0 22%,58% 0,100% 42%,82% 100%,14% 86%);background:linear-gradient(135deg,var(--pfx-r1),var(--pfx-r) 45%,var(--pfx-r2))}
.pfx-reclaim-leaf{position:absolute;width:var(--s,9px);height:calc(var(--s,9px)*.55);margin:calc(var(--s,9px)*-.28) 0 0 calc(var(--s,9px)*-.5);opacity:0;border-radius:0 100% 0 100%;background:linear-gradient(135deg,var(--pfx-g3),var(--pfx-g1))}
.pfx-reclaim-glow{position:absolute;top:0;bottom:0;opacity:0;transform-origin:0 50%;background:linear-gradient(90deg,rgba(255,250,214,0),var(--pfx-g5) 60%,rgba(255,250,214,.9)),linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,.05) 50%,var(--pfx-w3))}
.pfx-reclaim-mote{position:absolute;width:var(--s,4px);height:var(--s,4px);margin:calc(var(--s,4px)*-.5) 0 0 calc(var(--s,4px)*-.5);opacity:0;border-radius:50%;background:#fff7d0;box-shadow:0 0 4px var(--pfx-w5)}
.pfx-reclaim-dawn{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side,rgba(255,226,160,.8),var(--pfx-w5) 34%,var(--pfx-p3) 62%,var(--pfx-p0))}
.pfx-reclaim-wash{position:absolute;inset:0;opacity:0;background:linear-gradient(180deg,rgba(255,228,170,.55),var(--pfx-w3) 50%,var(--pfx-p2))}
.pfx-reclaim-sign{position:absolute;width:var(--s,40px);height:calc(var(--s,40px)*1.55);opacity:0;transform-origin:50% 100%}
.pfx-reclaim-sign::before{content:'';position:absolute;left:calc(50% - 1.5px);top:calc(var(--s,40px)*.5);bottom:0;width:3px;background:linear-gradient(90deg,#4a4c46,#a4a69d 45%,#4a4c46)}
.pfx-reclaim-bare{height:var(--s,40px);transform-origin:50% 50%}
.pfx-reclaim-bare::before{display:none}
.pfx-reclaim-board{position:absolute;left:0;top:0;display:flex;align-items:center;justify-content:center;width:var(--s,40px);height:var(--s,40px)}
.pfx-reclaim-board::before{content:'';position:absolute;inset:0;clip-path:polygon(${DIAMOND});background:radial-gradient(circle at 70% 72%,var(--pfx-r6) 0 13%,transparent 24%),radial-gradient(circle at 30% 36%,var(--pfx-r4) 0 7%,transparent 14%),var(--pfx-w)}
.pfx-reclaim-board::after{content:'';position:absolute;inset:9%;clip-path:polygon(evenodd,${DIAMOND},50% 0,50% 9%,9% 50%,50% 91%,91% 50%,50% 9%);background:#1d1a12}
.pfx-reclaim-mark{position:relative;font:900 calc(var(--s,40px)*.44)/1 'Arial Black',Arial,sans-serif;color:#1d1a12}
.pfx-reclaim-lamp{position:absolute;left:10%;right:10%;top:0;height:2px;opacity:0;background:linear-gradient(90deg,rgba(255,236,190,0),rgba(255,236,190,.95),rgba(255,236,190,0));box-shadow:0 0 10px 2px var(--pfx-w5)}
.pfx-reclaim-rim{position:absolute;inset:0;opacity:0;border-radius:inherit;box-shadow:inset 0 0 18px 2px var(--pfx-w5),0 0 14px var(--pfx-w3)}
.pfx-reclaim-steam{background:radial-gradient(closest-side,rgba(238,234,226,.72),rgba(222,218,208,.32) 55%,rgba(222,218,208,0))}
.pfx-reclaim-grime{position:absolute;inset:0;background:radial-gradient(9% 70% at 14% 85%,var(--pfx-r4),var(--pfx-r0) 70%),radial-gradient(6% 55% at 41% 15%,var(--pfx-r3),var(--pfx-r0) 70%),radial-gradient(12% 80% at 73% 78%,var(--pfx-r4),var(--pfx-r0) 70%),radial-gradient(5% 50% at 92% 22%,var(--pfx-r3),var(--pfx-r0) 70%),linear-gradient(180deg,rgba(40,26,12,0) 45%,rgba(40,26,12,.32)),radial-gradient(circle at 3px 4px,rgba(34,20,8,.26) 0 .6px,rgba(34,20,8,0) 1.1px) 0 0/13px 11px,radial-gradient(circle at 8px 2px,rgba(34,20,8,.2) 0 .8px,rgba(34,20,8,0) 1.3px) 0 0/19px 7px,radial-gradient(circle at 5px 6px,rgba(255,236,210,.08) 0 .6px,rgba(255,236,210,0) 1.1px) 0 0/17px 9px}
.pfx-reclaim-gear{position:absolute;width:var(--s,60px);height:var(--s,60px);margin:calc(var(--s,60px)*-.5) 0 0 calc(var(--s,60px)*-.5)}
.pfx-reclaim-spin,.pfx-reclaim-crank{position:absolute;inset:0}
.pfx-reclaim-spin{opacity:0}
.pfx-reclaim-cog{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle closest-side,#120d09 0 14%,var(--pfx-i2) 15% 25%,var(--pfx-i1) 26% 29%,transparent 30%),radial-gradient(circle closest-side at 50% 23%,#120d09 0 34%,transparent 38%),radial-gradient(circle closest-side at 77% 50%,#120d09 0 34%,transparent 38%),radial-gradient(circle closest-side at 50% 77%,#120d09 0 34%,transparent 38%),radial-gradient(circle closest-side at 23% 50%,#120d09 0 34%,transparent 38%),radial-gradient(circle closest-side at 68% 32%,var(--pfx-r6) 0 22%,transparent 44%),radial-gradient(circle closest-side at 34% 64%,var(--pfx-r4) 0 18%,transparent 40%),radial-gradient(closest-side,var(--pfx-i1) 0 66%,var(--pfx-i2) 72% 77%,transparent 78%),repeating-conic-gradient(var(--pfx-i2) 0deg 2deg,var(--pfx-i1) 2deg 12deg,var(--pfx-i2) 12deg 15deg,transparent 15deg 30deg)}
${motionOk(`@keyframes pfx-reclaim-sway{from{opacity:var(--o,1);transform:rotate(calc(var(--lean,0deg) - var(--sw,4deg)))}to{opacity:var(--o,1);transform:rotate(calc(var(--lean,0deg) + var(--sw,4deg)))}}
@keyframes pfx-reclaim-shoot{0%{opacity:1;transform:rotate(var(--lean,0deg)) scaleY(0);animation-timing-function:cubic-bezier(.2,.8,.3,1.2)}30%{transform:rotate(var(--lean,0deg)) scaleY(1.1)}42%{transform:rotate(calc(var(--lean,0deg) + 3deg)) scaleY(1)}58%{transform:rotate(calc(var(--lean,0deg) - 2deg)) scaleY(1)}80%{opacity:1;transform:rotate(var(--lean,0deg)) scaleY(1)}100%{opacity:0;transform:rotate(var(--lean,0deg)) scaleY(1)}}
@keyframes pfx-reclaim-wander{0%{opacity:0;transform:translate(0,0)}10%{opacity:var(--o,.9)}25%{transform:translate(var(--x1),var(--y1))}31%{opacity:calc(var(--o,.9)*.15)}38%{opacity:var(--o,.9)}50%{transform:translate(var(--x2),var(--y2))}63%{opacity:calc(var(--o,.9)*.2)}70%{opacity:var(--o,.9)}75%{transform:translate(var(--x3),var(--y3))}90%{opacity:var(--o,.9)}100%{opacity:0;transform:translate(0,0)}}
@keyframes pfx-reclaim-rise{0%{opacity:0;transform:translate(0,0) scale(.5)}12%{opacity:1;transform:translate(calc(var(--dx)*.12),calc(var(--up)*.12)) scale(1)}40%{opacity:.3}52%{opacity:1}82%{opacity:.9}100%{opacity:0;transform:translate(var(--dx),var(--up)) scale(.8)}}
@keyframes pfx-reclaim-puff{0%{opacity:0;transform:translate(0,0) scale(.3)}15%{opacity:1}100%{opacity:0;transform:translate(var(--dx,0px),var(--dy,-10px)) scale(var(--grow,1.5))}}
@keyframes pfx-reclaim-leaf{0%{opacity:0;transform:translate(0,0) rotate(0deg)}14%{opacity:1}80%{opacity:.9}100%{opacity:0;transform:translate(var(--dx),var(--up)) rotate(var(--spin,360deg))}}
@keyframes pfx-reclaim-glow{0%{opacity:1;transform:scaleX(0);animation-timing-function:cubic-bezier(.2,.9,.3,1.1)}55%{opacity:1;transform:scaleX(1);animation-timing-function:ease-in}100%{opacity:0;transform:scaleX(1)}}
@keyframes pfx-reclaim-mote{0%{opacity:0;transform:translate(0,0) scale(.4)}20%{opacity:1;transform:translate(calc(var(--dx)*.2),calc(var(--dy)*.2)) scale(1)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.6)}}
@keyframes pfx-reclaim-dawn{0%{opacity:0;transform:translateY(30%) scale(.8)}35%{opacity:1;transform:translateY(0) scale(1)}75%{opacity:.9}100%{opacity:0;transform:translateY(-6%) scale(1.08)}}
@keyframes pfx-reclaim-flash{0%{opacity:0}20%{opacity:1}100%{opacity:0}}
@keyframes pfx-reclaim-swing{0%{opacity:0;transform:scaleY(.2) rotate(-14deg)}12%{opacity:1;transform:scaleY(1.06) rotate(10deg)}26%{transform:scaleY(1) rotate(-7deg)}40%{transform:scaleY(1) rotate(4deg)}54%{transform:scaleY(1) rotate(-2deg)}66%{transform:scaleY(1) rotate(var(--rest,-4deg))}84%{opacity:1;transform:scaleY(1) rotate(var(--rest,-4deg))}100%{opacity:0;transform:scaleY(1) rotate(var(--rest,-4deg))}}
@keyframes pfx-reclaim-flicker{0%,84%,100%{opacity:0}85%{opacity:.9}86%{opacity:.15}87.5%{opacity:.85}88.5%{opacity:0}90%{opacity:.7}92.5%{opacity:0}}
@keyframes pfx-reclaim-turn{from{opacity:1;transform:rotate(0deg)}to{opacity:1;transform:rotate(360deg)}}
@keyframes pfx-reclaim-crank{from{transform:rotate(var(--from,0deg))}to{transform:rotate(var(--turn,90deg))}}
@keyframes pfx-reclaim-drift{0%,78%{opacity:0;transform:translate(0,0) scale(.6)}82%{opacity:.95;transform:translate(calc(var(--dx)*.15),calc(var(--up)*.15)) scale(1)}89%{opacity:.25}92%{opacity:.95}100%{opacity:0;transform:translate(var(--dx),var(--up)) scale(.8)}}
.pfx-reclaim-a-sway{animation:pfx-reclaim-sway var(--t,3s) ease-in-out var(--sync,0s) infinite alternate}
.pfx-reclaim-a-shoot{animation:pfx-reclaim-shoot var(--t,1.5s) linear var(--d,0s) backwards}
.pfx-reclaim-a-wander{animation:pfx-reclaim-wander var(--t,9s) ease-in-out var(--sync,0s) infinite}
.pfx-reclaim-a-rise{animation:pfx-reclaim-rise var(--t,2s) ease-out var(--d,0s) backwards}
.pfx-reclaim-a-puff{animation:pfx-reclaim-puff var(--t,1s) ease-out var(--d,0s) backwards}
.pfx-reclaim-a-leaf{animation:pfx-reclaim-leaf var(--t,1.6s) ease-out var(--d,0s) backwards}
.pfx-reclaim-a-glow{animation:pfx-reclaim-glow var(--t,1.1s) linear var(--d,0s) backwards}
.pfx-reclaim-a-mote{animation:pfx-reclaim-mote var(--t,1s) ease-out var(--d,0s) backwards}
.pfx-reclaim-a-dawn{animation:pfx-reclaim-dawn var(--t,2.6s) ease-out var(--d,0s) backwards}
.pfx-reclaim-a-flash{animation:pfx-reclaim-flash var(--t,1.8s) ease-out var(--d,0s) backwards}
.pfx-reclaim-a-swing{animation:pfx-reclaim-swing var(--t,2.8s) ease-out var(--d,0s) backwards}
.pfx-reclaim-a-flicker{animation:pfx-reclaim-flicker ${IDLE_MS}ms steps(1,end) var(--sync,0s) infinite}
.pfx-reclaim-a-drift{animation:pfx-reclaim-drift ${IDLE_MS}ms ease-out var(--sync,0s) infinite}
.pfx-reclaim-a-turn{animation:pfx-reclaim-turn ${GEAR_MS}ms linear var(--sync,0s) infinite}
.pfx-reclaim-a-ratchet{animation:pfx-reclaim-crank .6s cubic-bezier(.3,1.6,.5,1) both}
.pfx-reclaim-a-crank{animation:pfx-reclaim-crank 1.6s cubic-bezier(.45,0,.25,1) both}`)}`;

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

/**
 * A rusted iron plate, still: rust bleeding from the corners and running down in streaks, dirt
 * settled along the bottom, pitted metal and, on panels big enough, rivets along the top and
 * bottom edges. As faint as its box.
 */
function weathered(skin: Skin, scale: number, opacity: number): string {
  if (opacity <= 0) return "";
  const strength = (value: number) =>
    Math.round(value * Math.min(1, opacity) * 100) / 100;
  const size = Math.max(0.6, scale);
  const rust = skin.colors.frame;
  const iron = toTone(skin.colors.frame2);
  const rivets = (edge: "top" | "bottom") => {
    const r = Math.round(2.6 * size * 10) / 10;
    const tall = Math.round((r + 2) * 2);
    const gap = Math.round(36 * size);
    const inset = Math.max(0, Math.round(7 * size - tall / 2));
    return `radial-gradient(circle at 50% 50%, rgba(255,232,206,${strength(0.4)}) 0 ${Math.round(r * 3) / 10}px, ${shade(iron, 46, strength(0.95))} ${Math.round(r * 5.5) / 10}px ${r}px, rgba(0,0,0,${strength(0.55)}) ${r + 0.6}px, rgba(0,0,0,0) ${r + 1.4}px) left ${Math.round(gap / 2)}px ${edge} ${inset}px / ${gap}px ${tall}px repeat-x`;
  };
  const streak = (x: number, wide: number, long: number, a: number) =>
    `radial-gradient(${wide}% ${long}% at ${x}% 0%, ${rgba(rust, strength(a))}, ${rgba(rust, 0)} 100%)`;
  const speck = (
    tile: number,
    x: number,
    y: number,
    r: number,
    color: string,
    a: number,
  ) => {
    const edge = Math.round(tile * size);
    return `radial-gradient(circle at ${Math.round(x * size)}px ${Math.round(y * size)}px, ${rgba(color, strength(a))} 0 ${r}px, ${rgba(color, 0)} ${r + 0.7}px) 0 0 / ${edge}px ${edge}px`;
  };
  return [
    // Rivets only where they clear the content, not on a chat line's small box.
    ...(scale >= 0.8 ? [rivets("top"), rivets("bottom")] : []),
    streak(21, 3, 46, 0.24),
    streak(58, 2.5, 30, 0.18),
    streak(84, 4, 55, 0.22),
    `radial-gradient(55% 90% at 0% 100%, ${rgba(rust, strength(0.28))}, ${rgba(rust, 0)} 70%)`,
    `radial-gradient(35% 70% at 100% 0%, ${rgba(rust, strength(0.2))}, ${rgba(rust, 0)} 70%)`,
    `radial-gradient(30% 50% at 86% 100%, ${rgba(rust, strength(0.16))}, ${rgba(rust, 0)} 70%)`,
    `radial-gradient(45% 60% at 60% 105%, rgba(28,18,8,${strength(0.35)}), rgba(28,18,8,0) 70%)`,
    `radial-gradient(18% 30% at 30% 62%, rgba(28,18,8,${strength(0.16)}), rgba(28,18,8,0) 70%)`,
    `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(20,12,4,${strength(0.28)}))`,
    speck(9, 3, 5, 0.7, "#ffffff", 0.06),
    speck(13, 9, 2, 0.9, "#000000", 0.3),
    speck(17, 5, 12, 1.1, rust, 0.22),
    speck(11, 7, 8, 0.8, "#3a2410", 0.3),
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
      className={`pfx-reclaim-tuft${back ? " pfx-reclaim-back" : ""} pfx-reclaim-a-${grow ? "shoot" : "sway"}`}
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
            blade.dry
              ? "pfx-reclaim-blade pfx-reclaim-dry"
              : "pfx-reclaim-blade"
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
      className="pfx-reclaim-fly pfx-reclaim-a-wander"
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
      className="pfx-reclaim-fly pfx-reclaim-a-rise"
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

/** Dust kicked up, or `steam` let off, billowing out as it fades. */
function Puffs({
  list,
  steam = false,
}: {
  list: readonly Puff[];
  steam?: boolean;
}) {
  return list.map(puff => (
    <span
      key={puff.id}
      className={`pfx-reclaim-puff${steam ? " pfx-reclaim-steam" : ""} pfx-reclaim-a-puff`}
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

/** Rust chips knocked loose and flung like sparks, each at a tilt of its own. */
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
        className="pfx-reclaim-chip"
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
      className="pfx-reclaim-leaf pfx-reclaim-a-leaf"
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
      className="pfx-reclaim-mote pfx-reclaim-a-mote"
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
 * A rusty yellow warning sign on a post, standing on a card's top edge: it springs up, wobbles,
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
      className={`pfx-reclaim-sign${post ? "" : " pfx-reclaim-bare"} pfx-reclaim-a-swing`}
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
      <span className="pfx-reclaim-board">
        <span className="pfx-reclaim-mark">!</span>
      </span>
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
  // Now and then: the panel's lamp flickers like a failing light, and a firefly drifts up off it.
  const idle = useMemo(() => {
    const next = rng(seedOf(`${seed}:idle`));
    return {
      x: next() < 0.5 ? px(16 * size) : `calc(100% - ${px(16 * size)})`,
      dx: between(next, -14, 14) * size,
      up: -between(next, 30, 48) * size,
      sync: -(seed * IDLE_MS),
    };
  }, [seed, size]);
  // A pulse: a tuft pushes up through the top edge by a corner, shaking off dust and rust chips.
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
      {mode === "full" && (
        <>
          <span
            className="pfx-reclaim-lamp pfx-reclaim-a-flicker"
            style={
              {
                top: band ? Math.round(band / 2) : 0,
                "--sync": ms(idle.sync),
              } as Vars
            }
          />
          {!band && (
            <span
              className="pfx-reclaim-fly pfx-reclaim-a-drift"
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
        </>
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
            className="pfx-reclaim-rim pfx-reclaim-a-flash"
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
      {/* Grime and rust spots over the whole bar, still. */}
      <span className="pfx-reclaim-grime" />
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
              className="pfx-reclaim-glow pfx-reclaim-a-glow"
              style={segment(hit)}
            />
            <Motes list={strike.motes} />
          </Fragment>
        ))}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-reclaim-wash pfx-reclaim-a-flash"
            style={{ "--t": "2.2s" } as Vars}
          />
          <span
            className="pfx-reclaim-glow pfx-reclaim-a-glow"
            style={{ left: 0, width: "100%", "--t": "1.9s" } as Vars}
          />
          <Motes list={pollen} />
        </Fragment>
      )}
    </>
  );
}

/**
 * A rusty cog at a bar's start. It turns slowly all the time, clicks round three teeth with each
 * gain and spins twice for a goal reached; each click and spin starts where the last one ended.
 */
function Cog({
  x,
  y,
  size,
  hits,
  win,
  sync,
}: {
  x: number;
  y: number;
  size: number;
  hits: number;
  win: number;
  sync: number;
}) {
  return (
    <span
      className="pfx-reclaim-gear"
      style={{ left: px(x), top: px(y), "--s": px(size) } as Vars}
    >
      <span
        className="pfx-reclaim-spin pfx-reclaim-a-turn"
        style={{ "--sync": ms(sync) } as Vars}
      >
        <span
          key={`w${win}`}
          className={`pfx-reclaim-crank${win > 0 ? " pfx-reclaim-a-crank" : ""}`}
          style={
            { "--from": deg((win - 1) * 720), "--turn": deg(win * 720) } as Vars
          }
        >
          <span
            key={`h${hits}`}
            className={`pfx-reclaim-crank${hits > 0 ? " pfx-reclaim-a-ratchet" : ""}`}
            style={
              { "--from": deg((hits - 1) * 90), "--turn": deg(hits * 90) } as Vars
            }
          >
            <span className="pfx-reclaim-cog" />
          </span>
        </span>
      </span>
    </span>
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
  // The cog sits on the bar's start, a little bigger than the bar is tall.
  const cog = { x: left + height * 0.08, y, size: height * 1.15 };
  const party = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    const middle = (left + right) / 2;
    const span = right - left;
    return {
      steam: dust(next, left + height * 0.08, y - height * 0.35, height * 1.1, 4),
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
      <Cog
        {...cog}
        hits={hits}
        win={win}
        sync={-seedOf(`${seed}:cog`) * GEAR_MS}
      />
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
            className="pfx-reclaim-dawn pfx-reclaim-back pfx-reclaim-a-dawn"
            style={{
              left: px((left + right) / 2 - party.dawn.w / 2),
              top: px(y - party.dawn.h * 0.6),
              width: px(party.dawn.w),
              height: px(party.dawn.h),
            }}
          />
          <Risers list={party.flies} />
          <Leaves list={party.leaves} />
          <Puffs list={party.steam} steam />
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
          className="pfx-reclaim-fly pfx-reclaim-a-rise"
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
            className="pfx-reclaim-dawn pfx-reclaim-a-dawn"
            style={round ? { inset: 0 } : { inset: "-15%" }}
          />
          <Risers list={party} />
        </Fragment>
      )}
    </>
  );
}

export const reclaim: EffectModule = {
  id: "reclaim",
  css,
  vars: (skin: Skin) => {
    const rust = toTone(skin.colors.frame);
    const iron = toTone(skin.colors.frame2);
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
      // Rust in the frame's color, for chips and the sign's stains.
      "--pfx-r1": shade(rust, 64),
      "--pfx-r": skin.colors.frame,
      "--pfx-r2": shade(rust, 24),
      "--pfx-r0": rgba(skin.colors.frame, 0),
      "--pfx-r3": rgba(skin.colors.frame, 0.3),
      "--pfx-r4": rgba(skin.colors.frame, 0.4),
      "--pfx-r6": rgba(skin.colors.frame, 0.6),
      // A cog's rusty iron, in the frame's dark color.
      "--pfx-i1": shade(iron, 34),
      "--pfx-i2": shade(iron, 17),
      // Dust in the muted color.
      "--pfx-d0": rgba(skin.colors.muted, 0),
      "--pfx-d3": rgba(skin.colors.muted, 0.35),
      "--pfx-d6": rgba(skin.colors.muted, 0.7),
      // The sign, the dawn and the lamp in the win color.
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
  panelLayer: weathered,
  // Titles flicker now and then, like a sign on a failing circuit.
  titleCss: (prefix, now) =>
    motionOk(`@keyframes pfx-reclaim-title{0%,92%,100%{opacity:1}93%{opacity:.5}94%{opacity:1}95.5%{opacity:.62}96.5%{opacity:1}}
.${prefix}-title{animation:pfx-reclaim-title ${TITLE_MS}ms steps(1,end) ${-(now % TITLE_MS)}ms infinite}`),
  Panel,
  Track,
  Burst,
  Pulse,
};
