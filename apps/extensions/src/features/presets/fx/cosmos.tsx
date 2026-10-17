import { type CSSProperties, Fragment, useMemo } from 'react';
import { rgba, shade } from '../color';
import type { Skin } from '../skin';
import { between, motionOk, rng, Sparks, seedOf, throwSparks } from './primitives';
import type {
  BurstFxProps,
  EffectModule,
  FxHit,
  PanelFxProps,
  PulseFxProps,
  TrackFxProps,
} from './types';

// Cosmos: Starway's. Stars twinkle in the sky around a bar all the time, a faint Milky Way lies
// behind it and now and then a shooting star falls past. Every gain runs starlight over what the
// bar added and launches a comet off the fill's edge, dropping stardust as it climbs away. A goal
// reached spins up a galaxy over the bar while the Milky Way blooms inside it. Panels come in with
// a constellation drawing itself on a corner, and now and then a star twinkles on their edges.
// Nothing crosses from side to side: shooting stars fall and comets climb.

/** The idle loop; each panel plays it at its own moment. */
const IDLE_MS = 11_000;
/** A shooting star's lane comes round this often; a bar has two, half a loop apart. */
const LANE_MS = 14_000;
/** How many stars twinkle in the sky around a bar, each on a loop of its own. */
const SKY = 7;
/** Narrower than this, a hit is a poll's vote striking the fill's edge. */
const THIN = 0.004;
/** How long a comet takes to climb away, in ms. */
const COMET_MS = 1000;

/** A 4-point star: a thin cross of light, clipped out of a square. */
const STAR = 'polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)';

const css = `.pfx-cosmos-star{position:absolute;width:var(--s,12px);height:var(--s,12px);margin:calc(var(--s,12px)*-.5) 0 0 calc(var(--s,12px)*-.5);opacity:0}
.pfx-cosmos-star::before{content:'';position:absolute;inset:0;clip-path:${STAR};background:radial-gradient(closest-side,#fff 24%,var(--c,var(--pfx-a)) 62%,var(--c0,var(--pfx-a0)))}
.pfx-cosmos-star::after{content:'';position:absolute;inset:36%;border-radius:50%;background:#fff;box-shadow:0 0 calc(var(--s,12px)*.32) calc(var(--s,12px)*.05) var(--c5,var(--pfx-a5))}
.pfx-cosmos-gold{--c:var(--pfx-w);--c0:var(--pfx-w0);--c5:var(--pfx-w6)}
.pfx-cosmos-white{--c:var(--pfx-t);--c0:var(--pfx-t0);--c5:var(--pfx-b5)}
.pfx-cosmos-sky{z-index:-1}
.pfx-cosmos-dot{position:absolute;width:var(--s,3px);height:var(--s,3px);margin:calc(var(--s,3px)*-.5) 0 0 calc(var(--s,3px)*-.5);opacity:0;border-radius:50%;background:var(--c,var(--pfx-a));box-shadow:0 0 calc(var(--s,3px)*1.6) var(--c5,var(--pfx-a5))}
.pfx-cosmos-spark{border-radius:2px;background:linear-gradient(90deg,var(--pfx-a0),var(--pfx-a) 60%,#fff);box-shadow:0 0 4px var(--pfx-a5)}
.pfx-cosmos-lane{position:absolute;width:0;height:0}
.pfx-cosmos-shoot{position:absolute;right:0;top:-1px;width:var(--len,60px);height:2px;opacity:0;border-radius:2px;transform-origin:100% 50%;background:linear-gradient(90deg,var(--pfx-a0),var(--pfx-a5) 55%,#fff)}
.pfx-cosmos-shoot::after{content:'';position:absolute;right:-2px;top:-2px;width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 6px 2px var(--pfx-a5)}
.pfx-cosmos-comet{position:absolute;right:calc(var(--s,14px)*-.5);top:calc(var(--s,14px)*-.5);width:var(--len,90px);height:var(--s,14px);opacity:0;transform-origin:calc(100% - var(--s,14px)*.5) 50%}
.pfx-cosmos-comet::before{content:'';position:absolute;left:0;right:calc(var(--s,14px)*.5);top:14%;bottom:14%;clip-path:polygon(0 50%,100% 0,100% 100%);background:linear-gradient(90deg,var(--pfx-a0),var(--pfx-a3) 40%,var(--pfx-a5) 72%,rgba(255,255,255,.9))}
.pfx-cosmos-comet::after{content:'';position:absolute;right:0;top:0;width:var(--s,14px);height:var(--s,14px);border-radius:50%;background:radial-gradient(closest-side,#fff 32%,var(--pfx-a) 64%,var(--pfx-a0));box-shadow:0 0 calc(var(--s,14px)*.7) var(--pfx-a5)}
.pfx-cosmos-nova{position:absolute;width:var(--s,60px);height:var(--s,60px);margin:calc(var(--s,60px)*-.5) 0 0 calc(var(--s,60px)*-.5);opacity:0;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.95),var(--pfx-a5) 42%,var(--pfx-a0))}
.pfx-cosmos-ring{position:absolute;width:var(--s,40px);height:var(--s,40px);margin:calc(var(--s,40px)*-.5) 0 0 calc(var(--s,40px)*-.5);opacity:0;border-radius:50%;border:2px solid var(--c,var(--pfx-a));box-shadow:0 0 8px var(--c5,var(--pfx-a5)),inset 0 0 8px var(--c5,var(--pfx-a5))}
.pfx-cosmos-halo{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side,rgba(255,244,214,.8),var(--pfx-a5) 38%,var(--pfx-p2) 66%,var(--pfx-p0))}
.pfx-cosmos-disc{position:absolute;width:0;height:0}
.pfx-cosmos-arm{position:absolute;left:0;top:0;width:0;height:0}
.pfx-cosmos-way{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side at 30% 54%,var(--pfx-a3),var(--pfx-a0)),radial-gradient(closest-side at 62% 44%,var(--pfx-p2),var(--pfx-p0)),radial-gradient(closest-side at 82% 58%,var(--pfx-b3),var(--pfx-b0))}
.pfx-cosmos-flat{border-radius:0}
.pfx-cosmos-field{position:absolute;inset:16% 5%;border-radius:50%}
.pfx-cosmos-glow{position:absolute;top:0;bottom:0;opacity:0;transform-origin:0 50%;background:linear-gradient(90deg,rgba(255,255,255,0),var(--pfx-a5) 60%,rgba(255,255,255,.9)),linear-gradient(180deg,rgba(255,255,255,.4),rgba(255,255,255,.06) 48%,var(--pfx-a3))}
.pfx-cosmos-group{position:absolute;opacity:0}
.pfx-cosmos-line{position:absolute;height:1px;margin-top:-.5px;transform-origin:0 50%;transform:rotate(var(--ang)) scaleX(0);background:linear-gradient(90deg,rgba(255,255,255,.85),var(--pfx-b5))}
.pfx-cosmos-rim{position:absolute;inset:0;opacity:0;border-radius:inherit;box-shadow:inset 0 0 0 2px var(--pfx-w),inset 0 0 18px 2px var(--pfx-w6),0 0 16px var(--pfx-w3)}
${motionOk(`@keyframes pfx-cosmos-twinkle{0%,100%{opacity:calc(var(--o,.9)*.2);transform:scale(.4) rotate(0deg)}50%{opacity:var(--o,.9);transform:scale(1) rotate(45deg)}}
@keyframes pfx-cosmos-breathe{0%,100%{opacity:calc(var(--o,.6)*.5)}50%{opacity:var(--o,.6)}}
@keyframes pfx-cosmos-lane{0%,93%{opacity:0;transform:translateX(0) scaleX(.2)}94.5%{opacity:var(--o,1);transform:translateX(calc(var(--run)*.18)) scaleX(1)}98.5%{opacity:var(--o,1)}100%{opacity:0;transform:translateX(var(--run)) scaleX(.5)}}
@keyframes pfx-cosmos-blink{0%{opacity:0;transform:scale(0) rotate(-30deg)}30%{opacity:1;transform:scale(1.15) rotate(15deg)}55%{opacity:.7;transform:scale(.8) rotate(30deg)}75%{opacity:1;transform:scale(1) rotate(40deg)}100%{opacity:0;transform:scale(.3) rotate(60deg)}}
@keyframes pfx-cosmos-flare{0%{opacity:0;transform:scale(0) rotate(0deg)}25%{opacity:1;transform:scale(1.25) rotate(45deg)}60%{opacity:1;transform:scale(.9) rotate(70deg)}100%{opacity:0;transform:scale(.2) rotate(90deg)}}
@keyframes pfx-cosmos-nova{0%{opacity:0;transform:scale(.2)}20%{opacity:1;transform:scale(.9)}100%{opacity:0;transform:scale(1.4)}}
@keyframes pfx-cosmos-ring{0%{opacity:0;transform:scale(.2)}15%{opacity:.9}100%{opacity:0;transform:scale(var(--grow,1.5))}}
@keyframes pfx-cosmos-fly{from{transform:translateX(0)}to{transform:translateX(var(--run))}}
@keyframes pfx-cosmos-glint{0%{opacity:0;transform:scale(.3)}10%{opacity:1;transform:scale(1)}72%{opacity:1}100%{opacity:0;transform:scale(.7)}}
@keyframes pfx-cosmos-dust{0%{opacity:0;transform:translate(0,0) scale(.5)}12%{opacity:var(--o,1);transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.3)}}
@keyframes pfx-cosmos-spin{from{transform:rotate(0deg)}to{transform:rotate(var(--turn,200deg))}}
@keyframes pfx-cosmos-out{0%{opacity:0;transform:translateX(var(--r0)) scale(.3)}14%{opacity:1;transform:translateX(calc(var(--r0) + (var(--r1) - var(--r0))*.5)) scale(1)}42%{transform:translateX(calc(var(--r0) + (var(--r1) - var(--r0))*.88)) scale(1)}76%{opacity:1}100%{opacity:0;transform:translateX(var(--r1)) scale(.6)}}
@keyframes pfx-cosmos-halo{0%{opacity:0;transform:scale(.3)}30%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.15)}}
@keyframes pfx-cosmos-group{0%,82%{opacity:1}100%{opacity:0}}
@keyframes pfx-cosmos-draw{from{transform:rotate(var(--ang)) scaleX(0)}to{transform:rotate(var(--ang)) scaleX(1)}}
@keyframes pfx-cosmos-pop{0%{opacity:0;transform:scale(0) rotate(-45deg)}55%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0deg)}}
@keyframes pfx-cosmos-idle{0%,86%,100%{opacity:0;transform:scale(.2) rotate(0deg)}90%{opacity:var(--o,.9);transform:scale(1) rotate(45deg)}93%{opacity:calc(var(--o,.9)*.45);transform:scale(.7) rotate(60deg)}96%{opacity:var(--o,.9);transform:scale(.9) rotate(80deg)}}
@keyframes pfx-cosmos-flash{0%{opacity:0}20%{opacity:1}100%{opacity:0}}
@keyframes pfx-cosmos-glow{0%{opacity:1;transform:scaleX(0);animation-timing-function:cubic-bezier(.2,.9,.3,1.1)}55%{opacity:1;transform:scaleX(1);animation-timing-function:ease-in}100%{opacity:0;transform:scaleX(1)}}
@keyframes pfx-cosmos-bloom{0%{opacity:0;transform:translateX(-3%)}30%{opacity:1}72%{opacity:.85}100%{opacity:0;transform:translateX(3%)}}
.pfx-cosmos-a-twinkle{animation:pfx-cosmos-twinkle var(--t,3s) ease-in-out var(--sync,0s) infinite}
.pfx-cosmos-a-breathe{animation:pfx-cosmos-breathe 9s ease-in-out var(--sync,0s) infinite}
.pfx-cosmos-a-lane{animation:pfx-cosmos-lane ${LANE_MS}ms linear var(--sync,0s) infinite}
.pfx-cosmos-a-streak{animation:pfx-cosmos-lane ${IDLE_MS}ms linear var(--sync,0s) infinite}
.pfx-cosmos-a-blink{animation:pfx-cosmos-blink var(--t,.8s) ease-out var(--d,0s) backwards}
.pfx-cosmos-a-flare{animation:pfx-cosmos-flare var(--t,.9s) ease-out var(--d,0s) backwards}
.pfx-cosmos-a-nova{animation:pfx-cosmos-nova var(--t,.7s) ease-out var(--d,0s) backwards}
.pfx-cosmos-a-ring{animation:pfx-cosmos-ring var(--t,1s) ease-out var(--d,0s) backwards}
.pfx-cosmos-a-fly{animation:pfx-cosmos-fly var(--t,1s) cubic-bezier(.5,1,.89,1) var(--d,0s) backwards}
.pfx-cosmos-a-glint{animation:pfx-cosmos-glint var(--t,1s) linear var(--d,0s) backwards}
.pfx-cosmos-a-dust{animation:pfx-cosmos-dust var(--t,.8s) ease-out var(--d,0s) backwards}
.pfx-cosmos-a-spin{animation:pfx-cosmos-spin var(--t,2.4s) cubic-bezier(.25,.6,.4,1) var(--d,0s) backwards}
.pfx-cosmos-a-out{animation:pfx-cosmos-out var(--t,2s) ease-out var(--d,0s) backwards}
.pfx-cosmos-a-halo{animation:pfx-cosmos-halo var(--t,2.2s) ease-out var(--d,0s) backwards}
.pfx-cosmos-a-group{animation:pfx-cosmos-group var(--t,2.4s) linear var(--d,0s) backwards}
.pfx-cosmos-a-draw{animation:pfx-cosmos-draw var(--t,.28s) ease-out var(--d,0s) both}
.pfx-cosmos-a-pop{animation:pfx-cosmos-pop var(--t,.45s) ease-out var(--d,0s) both}
.pfx-cosmos-a-idle{animation:pfx-cosmos-idle ${IDLE_MS}ms ease-in-out var(--sync,0s) infinite}
.pfx-cosmos-a-flash{animation:pfx-cosmos-flash var(--t,1.8s) ease-out var(--d,0s) backwards}
.pfx-cosmos-a-glow{animation:pfx-cosmos-glow var(--t,1.1s) linear var(--d,0s) backwards}
.pfx-cosmos-a-bloom{animation:pfx-cosmos-bloom var(--t,2.4s) ease-in-out var(--d,0s) backwards}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;
const px = (value: number) => `${Math.round(value * 10) / 10}px`;
const ms = (value: number) => `${Math.round(value)}ms`;
const deg = (value: number) => `${Math.round(value)}deg`;
const alpha = (value: number) => String(Math.round(value * 100) / 100);
const sign = (next: () => number) => (next() < 0.5 ? -1 : 1);
const radians = (degrees: number) => (degrees * Math.PI) / 180;

/** A star's light: the preset's accent, its win color, or plain starlight. */
type Tint = 'violet' | 'gold' | 'white';

const TINTS: Record<Tint, string> = {
  violet: '',
  gold: ' pfx-cosmos-gold',
  white: ' pfx-cosmos-white',
};

const starClass = (tint: Tint, animation: string) =>
  `pfx-cosmos-star${TINTS[tint]} pfx-cosmos-a-${animation}`;

/** Still stars under a panel's content: three tiled layers that never line up, as faint as its box. */
function starfield(skin: Skin, scale: number, opacity: number): string {
  if (opacity <= 0) return '';
  const size = Math.max(0.6, scale);
  const layer = (
    tile: number,
    x: number,
    y: number,
    r: number,
    color: string,
    strength: number,
  ) => {
    const a = Math.round(strength * Math.min(1, opacity) * 100) / 100;
    return `radial-gradient(circle at ${Math.round(x * size)}px ${Math.round(y * size)}px, ${rgba(color, a)} 0 ${r}px, ${rgba(color, 0)} ${r + 0.9}px) 0 0 / ${Math.round(tile * size)}px ${Math.round(tile * size)}px`;
  };
  return [
    layer(67, 19, 41, 0.7, '#ffffff', 0.45),
    layer(109, 71, 23, 1, '#ffffff', 0.55),
    layer(163, 37, 127, 1.3, skin.colors.frame, 0.5),
  ].join(', ');
}

/** Tiny stars packed along a band's middle line, like the Milky Way's, as background layers. */
function dustLayers(next: () => number, count: number): string {
  return Array.from({ length: count }, () => {
    const x = between(next, 3, 97);
    // Three draws averaged: most land near the middle, a few stray to the edges.
    const y = 50 + (next() + next() + next() - 1.5) * 40;
    const r = between(next, 0.5, 1.1);
    const a = between(next, 0.45, 0.95);
    return `radial-gradient(circle at ${x.toFixed(1)}% ${y.toFixed(1)}%,rgba(255,255,255,${a.toFixed(2)}) 0 ${r.toFixed(2)}px,rgba(255,255,255,0) ${(r + 0.9).toFixed(2)}px)`;
  }).join(',');
}

interface Twinkle {
  id: number;
  x: number | string;
  y: number | string;
  size: number;
  tint: Tint;
  t: number;
  d: number;
}

/** Stars that twinkle once where they are. */
function Twinkles({ list }: { list: readonly Twinkle[] }) {
  return list.map((star) => (
    <span
      key={star.id}
      className={starClass(star.tint, 'blink')}
      style={
        {
          left: star.x,
          top: star.y,
          '--s': px(star.size),
          '--t': ms(star.t),
          '--d': ms(star.d),
        } as Vars
      }
    />
  ));
}

interface Dust {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  tint: Tint;
  o: number;
  t: number;
  d: number;
}

/** Stardust left hanging where something passed, drifting down as it fades. */
function Stardust({ list }: { list: readonly Dust[] }) {
  return list.map((dot) => (
    <span
      key={dot.id}
      className={`pfx-cosmos-dot${TINTS[dot.tint]} pfx-cosmos-a-dust`}
      style={
        {
          left: px(dot.x),
          top: px(dot.y),
          '--s': px(dot.size),
          '--dx': px(dot.dx),
          '--dy': px(dot.dy),
          '--o': alpha(dot.o),
          '--t': ms(dot.t),
          '--d': ms(dot.d),
        } as Vars
      }
    />
  ));
}

interface Comet {
  /** Where it starts, in px of the layer it's drawn in. */
  x: number;
  y: number;
  /** Which way it flies, in degrees: 0 is right, -90 straight up. */
  angle: number;
  run: number;
  size: number;
  len: number;
  t: number;
  d: number;
}

/**
 * A comet in flight: the outer span points it, the middle one carries it along with an ease-out,
 * and the comet itself brightens and fades.
 */
function CometFlight({ comet }: { comet: Comet }) {
  return (
    <span
      className="pfx-cosmos-lane"
      style={{ left: px(comet.x), top: px(comet.y), transform: `rotate(${deg(comet.angle)})` }}
    >
      <span
        className="pfx-cosmos-lane pfx-cosmos-a-fly"
        style={{ '--run': px(comet.run), '--t': ms(comet.t), '--d': ms(comet.d) } as Vars}
      >
        <span
          className="pfx-cosmos-comet pfx-cosmos-a-glint"
          style={
            {
              '--s': px(comet.size),
              '--len': px(comet.len),
              '--t': ms(comet.t),
              '--d': ms(comet.d),
            } as Vars
          }
        />
      </span>
    </span>
  );
}

/** Stardust along a comet's path, each grain appearing as the comet's head passes it. */
function trail(next: () => number, comet: Comet, count: number): Dust[] {
  const cos = Math.cos(radians(comet.angle));
  const sin = Math.sin(radians(comet.angle));
  return Array.from({ length: count }, (_, id) => {
    const along = ((id + between(next, 0.3, 0.7)) / count) * 0.88;
    // The flight eases out like easeOutQuad, so the head passes `along` at this share of its time.
    const at = 1 - Math.sqrt(1 - along);
    return {
      id,
      x: comet.x + cos * comet.run * along + between(next, -2, 2),
      y: comet.y + sin * comet.run * along + between(next, -2, 2),
      dx: between(next, -5, 5),
      dy: between(next, 6, 14),
      size: between(next, 2.6, 4.6) * Math.max(0.8, comet.size / 16),
      tint: id % 3 === 2 ? 'gold' : id % 2 ? 'white' : 'violet',
      o: between(next, 0.85, 1),
      t: between(next, 900, 1300),
      d: comet.d + comet.t * at,
    };
  });
}

interface ArmStar {
  id: number;
  /** Stardust between an arm's stars, so the arm reads as one curve. */
  dot: boolean;
  angle: number;
  r0: number;
  r1: number;
  size: number;
  tint: Tint;
  t: number;
  d: number;
}

interface Arms {
  arms: number;
  perArm: number;
  /** How far out the outermost stars go, in px. */
  reach: number;
  size: number;
  /** How far round an arm turns from the middle to its end, in degrees. */
  curl: number;
  delay: number;
}

/** Stardust in an arm, as a share of its stars' size. */
const DUST_SIZE = 0.3;

/**
 * A spiral galaxy: each arm's stars sit further round the further out they are, with stardust
 * between them, and all of it moves out from the middle while the galaxy turns, so the arms wind
 * out.
 */
function galaxy(next: () => number, spec: Arms): ArmStar[] {
  return Array.from({ length: spec.arms * spec.perArm }, (_, id) => {
    const arm = Math.floor(id / spec.perArm);
    const step = id % spec.perArm;
    const dot = step % 2 === 1;
    const out = (step + between(next, 0.3, 0.7)) / spec.perArm;
    const r1 = spec.reach * (0.18 + 0.82 * out);
    return {
      id,
      dot,
      angle: (360 / spec.arms) * arm + spec.curl * out + between(next, -6, 6),
      r0: r1 * 0.1,
      r1,
      size: spec.size * between(next, 0.8, 1.15) * (1 - out * 0.35) * (dot ? DUST_SIZE : 1),
      tint: dot || step % 4 !== 0 ? 'white' : 'gold',
      t: between(next, 1700, 2200),
      d: spec.delay + step * 35 + between(next, 0, 60),
    };
  });
}

/** A galaxy's stars on a turning layer; put it in a disc at the galaxy's middle. */
function Swirl({
  stars,
  turn,
  t,
  d,
}: {
  stars: readonly ArmStar[];
  turn: number;
  t: number;
  d: number;
}) {
  return (
    <span
      className="pfx-cosmos-arm pfx-cosmos-a-spin"
      style={{ '--turn': deg(turn), '--t': ms(t), '--d': ms(d) } as Vars}
    >
      {stars.map((star) => (
        <span
          key={star.id}
          className="pfx-cosmos-arm"
          style={{ transform: `rotate(${deg(star.angle)})` }}
        >
          <span
            className={
              star.dot
                ? `pfx-cosmos-dot${TINTS[star.tint]} pfx-cosmos-a-out`
                : starClass(star.tint, 'out')
            }
            style={
              {
                '--s': px(star.size),
                '--r0': px(star.r0),
                '--r1': px(star.r1),
                '--t': ms(star.t),
                '--d': ms(star.d),
              } as Vars
            }
          />
        </span>
      ))}
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

/** Constellations as points in a 1 by 1 box, joined in order. */
const FIGURES: readonly (readonly (readonly [number, number])[])[] = [
  [
    [0, 0.75],
    [0.3, 0.3],
    [0.62, 0.5],
    [1, 0.1],
  ],
  [
    [0, 0.25],
    [0.34, 0.7],
    [0.68, 0.35],
    [1, 0.8],
  ],
  [
    [0, 0.5],
    [0.28, 0.1],
    [0.6, 0.62],
    [1, 0.3],
  ],
];

/** A hero card's bigger one, with five stars. */
const HERO_FIGURE: readonly (readonly [number, number])[] = [
  [0, 0.62],
  [0.22, 0.12],
  [0.48, 0.45],
  [0.74, 0.05],
  [1, 0.58],
];

interface Constellation {
  left?: number;
  right?: number;
  top: number;
  w: number;
  h: number;
  stars: { id: number; x: number; y: number; size: number; tint: Tint; d: number }[];
  lines: { id: number; x: number; y: number; len: number; angle: number; d: number }[];
  t: number;
}

/**
 * A constellation drawn on a top corner as a panel comes in: its stars light one by one and lines
 * join them, then it fades. It straddles the panel's top edge, off its content; around a webcam it
 * keeps inside the frame's band.
 */
function constellation(
  next: () => number,
  big: boolean,
  size: number,
  band: number,
): Constellation {
  const h = band ? Math.min((big ? 40 : 28) * size, band * 0.8) : (big ? 44 : 28) * size;
  const w = h * (big ? 2.3 : 1.9);
  const onRight = next() < 0.5;
  const figure = big ? HERO_FIGURE : FIGURES[Math.floor(next() * FIGURES.length)];
  const points = figure.map(([x, y]) => ({ x: (onRight ? 1 - x : x) * w, y: y * h }));
  const side = band ? band * 0.9 : 16 * size;
  const step = big ? 190 : 170;
  const stars = points.map((point, id) => ({
    id,
    ...point,
    size: (big ? 13 : 10) * size * between(next, 0.85, 1.15),
    tint: (id % 2 ? 'white' : 'violet') as Tint,
    d: (big ? 250 : 120) + id * step,
  }));
  return {
    left: onRight ? undefined : side,
    right: onRight ? side : undefined,
    top: band ? (band - h) / 2 : -h * 0.6,
    w,
    h,
    stars,
    lines: points.slice(1).map((point, id) => {
      const from = points[id];
      return {
        id,
        x: from.x,
        y: from.y,
        len: Math.hypot(point.x - from.x, point.y - from.y),
        angle: (Math.atan2(point.y - from.y, point.x - from.x) * 180) / Math.PI,
        d: stars[id].d + 120,
      };
    }),
    t: big ? 2900 : 2300,
  };
}

function Figure({ figure }: { figure: Constellation }) {
  return (
    <span
      className="pfx-cosmos-group pfx-cosmos-a-group"
      style={
        {
          left: figure.left,
          right: figure.right,
          top: figure.top,
          width: px(figure.w),
          height: px(figure.h),
          '--t': ms(figure.t),
        } as Vars
      }
    >
      {figure.lines.map((line) => (
        <span
          key={`l${line.id}`}
          className="pfx-cosmos-line pfx-cosmos-a-draw"
          style={
            {
              left: px(line.x),
              top: px(line.y),
              width: px(line.len),
              '--ang': deg(line.angle),
              '--d': ms(line.d),
            } as Vars
          }
        />
      ))}
      {figure.stars.map((star) => (
        <span
          key={`s${star.id}`}
          className={starClass(star.tint, 'pop')}
          style={
            { left: px(star.x), top: px(star.y), '--s': px(star.size), '--d': ms(star.d) } as Vars
          }
        />
      ))}
    </span>
  );
}

interface Entrance {
  figure: Constellation | null;
  /** A list row's stars at its end, or a hero card's sparkles around it. */
  stars: Twinkle[];
  /** A hero card's comet, leaving the top corner the constellation isn't on. */
  comet: { corner: string; flight: Comet; dust: Dust[] } | null;
}

function enter(
  next: () => number,
  mode: PanelFxProps['mode'],
  size: number,
  band: number,
): Entrance {
  if (mode === 'enter') {
    // A list row: two or three stars twinkle in at its end.
    const count = 2 + Math.floor(next() * 2);
    return {
      figure: null,
      stars: Array.from({ length: count }, (_, id) => ({
        id,
        x: `calc(100% - ${px(between(next, 8, 28) * size)})`,
        y: pct(between(next, 0.2, 0.8)),
        size: between(next, 8, 12) * size,
        tint: id ? 'violet' : 'white',
        t: between(next, 700, 900),
        d: 150 + id * 140 + between(next, 0, 60),
      })),
      comet: null,
    };
  }
  const big = mode === 'hero';
  const figure = constellation(next, big, size, band);
  if (!big) return { figure, stars: [], comet: null };
  const stars = Array.from({ length: 4 }, (_, id): Twinkle => {
    const point = edgePoint(next, band);
    return {
      id,
      ...point,
      size: band ? Math.min(16 * size, band * 0.85) : 16 * size,
      tint: id % 2 ? 'gold' : 'white',
      t: between(next, 800, 1050),
      d: 700 + id * 170 + between(next, 0, 90),
    };
  });
  // Around a webcam a comet would fly over the picture.
  if (band) return { figure, stars, comet: null };
  const toRight = figure.left !== undefined;
  const flight: Comet = {
    x: 0,
    y: 0,
    angle: toRight ? -32 : -148,
    run: 110 * size,
    size: 13 * size,
    len: 76 * size,
    t: 1100,
    d: 450,
  };
  return {
    figure,
    stars,
    comet: { corner: toRight ? '92%' : '8%', flight, dust: trail(next, flight, 6) },
  };
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const size = Math.min(1.4, Math.max(0.5, scale));
  const band = ring ? Math.round(ring) : 0;
  const entrance = useMemo(() => enter(rng(seed), mode, size, band), [seed, mode, size, band]);
  // Now and then: two stars twinkle on the edges, and a short shooting star falls past a top corner.
  const idle = useMemo(() => {
    const next = rng(seedOf(`${seed}:idle`));
    const at = seed * IDLE_MS;
    const onRight = next() < 0.5;
    return {
      stars: Array.from({ length: 2 }, (_, id) => ({
        id,
        ...edgePoint(next, band),
        tint: (id ? 'gold' : 'white') as Tint,
        sync: -(at + id * 650),
      })),
      // It falls outward, past the corner, so it never crosses the panel's content.
      streak: band
        ? null
        : {
            left: onRight ? `calc(100% - ${px(34 * size)})` : px(34 * size),
            top: px(-16 * size),
            angle: onRight ? 32 : 148,
            sync: -(at + 2400),
          },
    };
  }, [seed, size, band]);
  // A pulse: a star flares on a top corner inside a ring, and stardust flies off it.
  const flare = useMemo(() => {
    const next = rng(seedOf(`${seed}:${pulse}`));
    const inset = band ? band : 14 * size;
    const x = next() < 0.5 ? `calc(100% - ${px(inset)})` : px(inset);
    const y = band ? band / 2 : 0;
    return {
      x,
      y,
      star: band ? Math.min(24 * size, band * 0.9) : 24 * size,
      ring: band ? Math.min(40 * size, band * 1.6) : 40 * size,
      sparks: throwSparks(next, {
        count: 4,
        x,
        y,
        spread: (band ? 24 : 34) * size,
        rise: band ? [band * 0.1, band * 0.3] : [10 * size, 26 * size],
        fall: band ? [0, band * 0.15] : [4 * size, 18 * size],
        ms: [450, 700],
        delay: 90,
        jitter: 60,
        size: Math.min(size, 1),
      }),
    };
  }, [seed, pulse, size, band]);
  // A win: gold stars swirl out of the middle; around a webcam they twinkle on the band instead.
  const party = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    if (band) {
      return {
        arms: null,
        edge: Array.from(
          { length: 8 },
          (_, id): Twinkle => ({
            id,
            ...edgePoint(next, band),
            size: Math.min(18 * size, band * 0.9),
            tint: id % 3 ? 'gold' : 'white',
            t: between(next, 800, 1100),
            d: 200 + id * 130 + between(next, 0, 60),
          }),
        ),
      };
    }
    return {
      arms: galaxy(next, {
        arms: 2,
        perArm: 8,
        reach: 90 * size,
        size: 13 * size,
        curl: 180,
        delay: 150,
      }),
      edge: [],
    };
  }, [seed, win, size, band]);
  const twinkle = band ? Math.min(14 * size, band * 0.8) : 14 * size;
  // A frame around a webcam keeps its glow inside its band, off the picture.
  const rim = band
    ? { boxShadow: `inset 0 0 ${Math.round(band * 0.8)}px var(--pfx-w6)` }
    : undefined;
  return (
    <>
      {entrance.figure && <Figure figure={entrance.figure} />}
      <Twinkles list={entrance.stars} />
      {entrance.comet && (
        <span className="pfx-cosmos-lane" style={{ left: entrance.comet.corner, top: 0 }}>
          <CometFlight comet={entrance.comet.flight} />
          <Stardust list={entrance.comet.dust} />
        </span>
      )}
      {mode === 'full' && (
        <>
          {idle.stars.map((star) => (
            <span
              key={star.id}
              className={starClass(star.tint, 'idle')}
              style={
                {
                  left: star.x,
                  top: star.y,
                  '--s': px(twinkle),
                  '--sync': ms(star.sync),
                } as Vars
              }
            />
          ))}
          {idle.streak && (
            <span
              className="pfx-cosmos-lane"
              style={{
                left: idle.streak.left,
                top: idle.streak.top,
                transform: `rotate(${deg(idle.streak.angle)})`,
              }}
            >
              <span
                className="pfx-cosmos-shoot pfx-cosmos-a-streak"
                style={
                  {
                    '--len': px(30 * size),
                    '--run': px(56 * size),
                    '--o': '.9',
                    '--sync': ms(idle.streak.sync),
                  } as Vars
                }
              />
            </span>
          )}
        </>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span
            className="pfx-cosmos-ring pfx-cosmos-a-ring"
            style={{ left: flare.x, top: flare.y, '--s': px(flare.ring), '--t': '.9s' } as Vars}
          />
          <span
            className={starClass('white', 'flare')}
            style={{ left: flare.x, top: flare.y, '--s': px(flare.star) } as Vars}
          />
          <Sparks sparks={flare.sparks} className="pfx-cosmos-spark" />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-cosmos-rim pfx-cosmos-a-flash"
            style={{ ...rim, '--t': '1.9s' } as Vars}
          />
          {party.arms && (
            <span className="pfx-cosmos-disc" style={{ left: '50%', top: '50%' }}>
              <Swirl stars={party.arms} turn={170} t={2000} d={150} />
            </span>
          )}
          <Twinkles list={party.edge} />
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
    const start = Math.min(hit.from, hit.to);
    const span = Math.abs(hit.to - hit.from);
    return Array.from({ length: 3 }, (_, id): Twinkle => {
      const along = (id + between(next, 0.2, 0.8)) / 3;
      return {
        id,
        x: pct(start + span * along),
        y: pct(between(next, 0.25, 0.75)),
        size: between(next, 10, 15),
        tint: id === 1 ? 'gold' : 'white',
        t: between(next, 700, 950),
        // The fill's edge covers most of the way early on, and the starlight rides it.
        d: 140 + 420 * along * along,
      };
    });
  }, [seed, hit]);
  const bloom = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return {
      dust: dustLayers(next, 44),
      stars: Array.from(
        { length: 5 },
        (_, id): Twinkle => ({
          id,
          x: pct((id + between(next, 0.2, 0.8)) / 5),
          y: pct(between(next, 0.2, 0.8)),
          size: between(next, 11, 16),
          tint: id % 2 ? 'gold' : 'white',
          t: between(next, 800, 1100),
          d: 350 + id * 170 + between(next, 0, 120),
        }),
      ),
    };
  }, [seed, win]);
  const thin = hit ? Math.abs(hit.to - hit.from) <= THIN : false;
  return (
    <>
      {hit &&
        strike &&
        hits > 0 &&
        (thin ? (
          // A poll's vote: one star twinkles at the fill's edge.
          <span
            key={`h${hits}`}
            className={starClass('white', 'blink')}
            style={{ left: pct(hit.to), top: '50%', '--s': '16px', '--t': '.7s' } as Vars}
          />
        ) : (
          <Fragment key={`h${hits}`}>
            {/* Starlight runs over what the bar gained and leaves a few stars twinkling in it. */}
            <span className="pfx-cosmos-glow pfx-cosmos-a-glow" style={segment(hit)} />
            <Twinkles list={strike} />
          </Fragment>
        ))}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          {/* The Milky Way blooms across the whole bar, in place. */}
          <span
            className="pfx-cosmos-way pfx-cosmos-flat pfx-cosmos-a-bloom"
            style={{ inset: 0, '--t': '2.4s' } as Vars}
          >
            <span
              className="pfx-cosmos-field"
              style={{ inset: 0, borderRadius: 0, background: bloom.dust }}
            />
          </span>
          <Twinkles list={bloom.stars} />
        </Fragment>
      )}
    </>
  );
}

interface SkyStar {
  id: number;
  x: number;
  y: number;
  size: number;
  tint: Tint;
  o: number;
  t: number;
  /** Where in its loop it is when it mounts, in ms. */
  phase: number;
}

/** The rows the sky's stars keep to, as shares of the bar's height from its center. */
const ROWS: readonly [number, number][] = [
  [-1.6, -1.1],
  [-1.0, -0.66],
  [0.62, 0.82],
];

/** Stars twinkling in the sky around a bar, spread along it, each on a loop of its own. */
function sky(
  next: () => number,
  left: number,
  right: number,
  y: number,
  height: number,
): SkyStar[] {
  return Array.from({ length: SKY }, (_, id) => {
    const [top, bottom] = ROWS[id % ROWS.length];
    const t = between(next, 2600, 4200);
    return {
      id,
      x: left + ((right - left) * (id + between(next, 0.15, 0.85))) / SKY,
      y: y + height * between(next, top, bottom),
      size: height * between(next, 0.2, 0.34),
      tint: id % 3 === 1 ? 'gold' : id % 2 ? 'violet' : 'white',
      o: between(next, 0.65, 0.95),
      t,
      phase: between(next, 0, t),
    };
  });
}

interface Lane {
  id: number;
  x: number;
  y: number;
  angle: number;
  run: number;
  len: number;
  o: number;
  phase: number;
}

/** Which way a bar's shooting stars fall: 1 down to the right, -1 down to the left. */
const fallOf = (seed: number) => (seedOf(`${seed}:fall`) < 0.5 ? -1 : 1);

/**
 * Two lanes of shooting stars above a bar, half a loop apart: each falls slantwise and fades out
 * before it reaches the bar.
 */
function lanes(
  next: () => number,
  fall: number,
  phase: number,
  left: number,
  right: number,
  y: number,
  height: number,
): Lane[] {
  return Array.from({ length: 2 }, (_, id) => {
    const tilt = between(next, 18, 28);
    const run = height * between(next, 2.6, 3.4);
    const across = Math.cos(radians(tilt)) * run;
    const middle = left + (right - left) * between(next, 0.15, 0.85);
    return {
      id,
      x: middle - (fall * across) / 2,
      y: y - height * between(next, 2.3, 2.8),
      angle: fall > 0 ? tilt : 180 - tilt,
      run,
      len: height * between(next, 1.1, 1.6),
      o: between(next, 0.85, 1),
      phase: phase + id * (LANE_MS / 2) + between(next, -800, 800),
    };
  });
}

interface Way {
  x: number;
  y: number;
  w: number;
  h: number;
  angle: number;
  o: number;
  sync: number;
  dust: string;
}

/** A faint strip of Milky Way lying slantwise behind a bar, a little above its middle. */
function milkyWay(next: () => number, left: number, right: number, y: number, height: number): Way {
  const w = (right - left) * 0.92;
  const h = height * 2.1;
  return {
    x: (left + right) / 2 - w / 2,
    y: y - height * 0.35 - h / 2,
    w,
    h,
    angle: between(next, 4, 9) * sign(next),
    o: between(next, 0.5, 0.7),
    sync: -between(next, 0, 9000),
    dust: dustLayers(next, 36),
  };
}

function Burst({ seed, hit, hits, win, left, right, y, height }: BurstFxProps) {
  // Always there while the bar is, and never replayed: hits and wins leave it as it is.
  const night = useMemo(() => {
    const next = rng(seedOf(`${seed}:sky`));
    return {
      way: milkyWay(next, left, right, y, height),
      stars: sky(next, left, right, y, height),
      lanes: lanes(next, fallOf(seed), seed * LANE_MS, left, right, y, height),
    };
  }, [seed, left, right, y, height]);
  const launch = useMemo(() => {
    if (!hit) return null;
    const next = rng(seedOf(`${seed}:${hit.key}`));
    const x = left + (right - left) * hit.to;
    // It climbs away from the bar's nearer end, so it stays over the bar.
    const side = hit.to > 0.75 ? -1 : hit.to < 0.25 ? 1 : sign(next);
    const climb = between(next, 30, 42);
    const comet: Comet = {
      x,
      y: y - height * 0.15,
      angle: side > 0 ? -climb : climb - 180,
      run: height * between(next, 2.6, 3.3),
      size: height * 0.36,
      len: height * 2.4,
      t: COMET_MS,
      d: 120,
    };
    return {
      x,
      comet,
      dust: trail(next, comet, 9),
      twinkles: Array.from(
        { length: 3 + Math.floor(next() * 2) },
        (_, id): Twinkle => ({
          id,
          x: x + between(next, -0.9, 0.9) * height,
          y: y + between(next, -0.95, 0.75) * height,
          size: height * between(next, 0.22, 0.34),
          tint: id % 2 ? 'gold' : 'white',
          t: between(next, 700, 950),
          d: 60 + id * 110 + between(next, 0, 80),
        }),
      ),
    };
  }, [seed, hit, left, right, y, height]);
  const party = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    // Wider than a goal's own celebration in the middle, so the arms show around it.
    const reach = Math.min(height * 3.8, (right - left) * 0.46);
    return {
      x: (left + right) / 2,
      // Its glow and ring keep to the middle; only the arms reach that far.
      core: Math.min(reach, height * 2.6),
      arms: galaxy(next, {
        arms: 2,
        perArm: 12,
        reach,
        size: height * 0.34,
        curl: 200,
        delay: 150,
      }),
    };
  }, [seed, win, left, right, height]);
  const { way } = night;
  return (
    <>
      {/* Behind the bar and its text, so they stay readable for hours. */}
      <span
        className="pfx-cosmos-way pfx-cosmos-sky pfx-cosmos-a-breathe"
        style={
          {
            left: px(way.x),
            top: px(way.y),
            width: px(way.w),
            height: px(way.h),
            transform: `rotate(${deg(way.angle)})`,
            '--o': alpha(way.o),
            '--sync': ms(way.sync),
          } as Vars
        }
      >
        <span className="pfx-cosmos-field" style={{ background: way.dust }} />
      </span>
      {night.stars.map((star) => (
        <span
          key={star.id}
          className={`${starClass(star.tint, 'twinkle')} pfx-cosmos-sky`}
          style={
            {
              left: px(star.x),
              top: px(star.y),
              '--s': px(star.size),
              '--o': alpha(star.o),
              '--t': ms(star.t),
              '--sync': ms(-star.phase),
            } as Vars
          }
        />
      ))}
      {night.lanes.map((lane) => (
        <span
          key={lane.id}
          className="pfx-cosmos-lane pfx-cosmos-sky"
          style={{ left: px(lane.x), top: px(lane.y), transform: `rotate(${deg(lane.angle)})` }}
        >
          <span
            className="pfx-cosmos-shoot pfx-cosmos-a-lane"
            style={
              {
                '--len': px(lane.len),
                '--run': px(lane.run),
                '--o': alpha(lane.o),
                '--sync': ms(-lane.phase),
              } as Vars
            }
          />
        </span>
      ))}
      {launch && hits > 0 && (
        <Fragment key={`h${hits}`}>
          {/* A nova flashes at the fill's edge and a comet climbs away from it. */}
          <span
            className="pfx-cosmos-nova pfx-cosmos-a-nova"
            style={{ left: px(launch.x), top: px(y), '--s': px(height * 1.7) } as Vars}
          />
          <span
            className={starClass('white', 'flare')}
            style={
              { left: px(launch.x), top: px(y), '--s': px(height * 0.95), '--t': '.8s' } as Vars
            }
          />
          <Twinkles list={launch.twinkles} />
          <CometFlight comet={launch.comet} />
          <Stardust list={launch.dust} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-cosmos-halo pfx-cosmos-a-halo"
            style={
              {
                left: px(party.x - party.core),
                top: px(y - party.core * 0.6),
                width: px(party.core * 2),
                height: px(party.core * 1.2),
                '--t': '2.4s',
              } as Vars
            }
          />
          {/* A galaxy seen at a slant: a flattened disc with its arms winding out. */}
          <span
            className="pfx-cosmos-disc"
            style={{ left: px(party.x), top: px(y), transform: 'rotate(-14deg) scaleY(.5)' }}
          >
            <span
              className="pfx-cosmos-ring pfx-cosmos-gold pfx-cosmos-a-ring"
              style={
                {
                  '--s': px(party.core * 1.1),
                  '--grow': '1.7',
                  '--t': '1.5s',
                  '--d': '250ms',
                } as Vars
              }
            />
            <Swirl stars={party.arms} turn={210} t={2400} d={100} />
          </span>
          <span
            className={starClass('gold', 'flare')}
            style={
              {
                left: px(party.x),
                top: px(y),
                '--s': px(height * 1.5),
                '--t': '1.4s',
                '--d': '60ms',
              } as Vars
            }
          />
        </Fragment>
      )}
    </>
  );
}

function Pulse({ seed, pulse, win, enter: entering, round }: PulseFxProps) {
  const pop = useMemo(
    () =>
      throwSparks(rng(seedOf(`${seed}:${pulse}`)), {
        count: 5,
        x: '50%',
        y: '40%',
        spread: round ? 22 : 36,
        rise: round ? [8, 20] : [14, 34],
        fall: round ? [4, 12] : [6, 22],
        ms: [480, 740],
        delay: 80,
        jitter: 70,
      }),
    [seed, pulse, round],
  );
  const arms = useMemo(
    () =>
      galaxy(rng(seedOf(`${seed}:w${win}`)), {
        arms: 2,
        perArm: 6,
        reach: round ? 26 : 46,
        size: round ? 9 : 12,
        curl: 180,
        delay: 150,
      }),
    [seed, win, round],
  );
  return (
    <>
      {entering && (
        // A chat line: a tiny star twinkles at its end.
        <span
          className={starClass('white', 'blink')}
          style={
            { right: 2, top: 2, margin: 0, '--s': '11px', '--t': '900ms', '--d': '140ms' } as Vars
          }
        />
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span
            className={starClass('white', 'flare')}
            style={{ left: '50%', top: '40%', '--s': px(round ? 24 : 30) } as Vars}
          />
          <Sparks sparks={pop} className="pfx-cosmos-spark" />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-cosmos-halo pfx-cosmos-a-halo"
            style={round ? { inset: 0 } : { inset: '-15%' }}
          />
          <span
            className="pfx-cosmos-disc"
            style={{ left: '50%', top: '45%', transform: 'rotate(-14deg) scaleY(.6)' }}
          >
            <Swirl stars={arms} turn={200} t={1900} d={100} />
          </span>
          <span
            className={starClass('gold', 'flare')}
            style={
              {
                left: '50%',
                top: '45%',
                '--s': px(round ? 26 : 34),
                '--t': '1.1s',
                '--d': '60ms',
              } as Vars
            }
          />
        </Fragment>
      )}
    </>
  );
}

export const cosmos: EffectModule = {
  id: 'cosmos',
  css,
  vars: (skin: Skin) => ({
    // Starlight in the accent, kept light so it shows on the bar's fill.
    '--pfx-a': shade(skin.accent, 76),
    '--pfx-a0': shade(skin.accent, 76, 0),
    '--pfx-a3': shade(skin.accent, 72, 0.3),
    '--pfx-a5': shade(skin.accent, 72, 0.5),
    // Gold stars and the win's glows, in the win color.
    '--pfx-w': skin.colors.win,
    '--pfx-w0': rgba(skin.colors.win, 0),
    '--pfx-w3': rgba(skin.colors.win, 0.3),
    '--pfx-w6': rgba(skin.colors.win, 0.6),
    // Plain starlight, in the text color, with a glow in the frame's.
    '--pfx-t': skin.colors.text,
    '--pfx-t0': rgba(skin.colors.text, 0),
    '--pfx-b': skin.colors.frame,
    '--pfx-b0': rgba(skin.colors.frame, 0),
    '--pfx-b3': rgba(skin.colors.frame, 0.3),
    '--pfx-b5': rgba(skin.colors.frame, 0.5),
    // A nebula's pink, the same in any preset.
    '--pfx-p0': 'rgba(255,140,214,0)',
    '--pfx-p2': 'rgba(255,140,214,.2)',
  }),
  // Faint stars, still, under the panel's content.
  panelLayer: starfield,
  Panel,
  Track,
  Burst,
  Pulse,
};
