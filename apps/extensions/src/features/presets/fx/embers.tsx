import { type CSSProperties, Fragment, useMemo } from 'react';
import { rgba } from '../color';
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

// Embers: Ancient's smoldering iron. What a bar gains smolders from dark red to orange behind a
// lava-bright edge, and embers lift off it: slow, swaying and flickering as they cool, never
// thrown like a forge's sparks. Panels come in with their corners catching fire, and now and then
// two embers rise from their bottom edge.

/** The idle loop; each panel plays it at its own moment. */
const IDLE_MS = 10_000;

const css = `.pfx-embers-up{position:absolute;width:0;height:0}
.pfx-embers-dot{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(circle,#fffbe8 0,#ffd27a 26%,#ff9536 52%,#e04c1c 78%,#9c2410);box-shadow:0 0 5px 1px rgba(255,120,40,.9),0 0 12px 3px rgba(224,76,28,.4)}
.pfx-embers-smolder{position:absolute;top:0;bottom:0;opacity:0;background:linear-gradient(180deg,rgba(50,4,0,.4),rgba(50,4,0,0) 34%,rgba(50,4,0,0) 70%,rgba(50,4,0,.32)),linear-gradient(90deg,rgba(140,22,10,.6),rgba(190,40,18,.85) 32%,rgba(236,92,30,.92) 74%,#ffa046)}
.pfx-embers-specks{position:absolute;top:0;bottom:0;opacity:0;background:radial-gradient(circle at 30% 40%,#ffe39a 0 1px,rgba(255,140,40,0) 2.5px) 0 0/11px 13px,radial-gradient(circle at 70% 68%,rgba(255,170,70,.9) 0 1px,rgba(255,110,30,0) 2.5px) 4px 5px/14px 10px}
.pfx-embers-edge{position:absolute;top:0;bottom:0;width:10px;margin-left:-5px;opacity:0;background:linear-gradient(90deg,rgba(255,110,30,0),#ff9536 28%,#fff1c4 50%,#ffb04a 70%,rgba(255,110,30,0));box-shadow:0 0 12px 3px rgba(255,100,30,.8)}
.pfx-embers-heat{position:absolute;inset:0;opacity:0;background:linear-gradient(0deg,var(--pfx-a8),var(--pfx-a0) 75%)}
.pfx-embers-halo{position:absolute;opacity:0;border-radius:inherit;box-shadow:0 8px 24px 3px var(--pfx-a7),0 0 12px 2px var(--pfx-a7)}
.pfx-embers-corner{position:absolute;opacity:0;background:radial-gradient(circle farthest-side at var(--at,0 0),#fff2c8 0,#ffbe5c 12%,#ff7a26 30%,rgba(214,60,24,.72) 52%,rgba(150,28,12,0))}
.pfx-embers-core{position:absolute;inset:0;opacity:0;border-radius:inherit}
.pfx-embers-line{position:absolute;left:10%;right:10%;bottom:0;opacity:0;background:linear-gradient(90deg,rgba(255,110,30,0),#ff8a2a 18%,#ffe2a0 50%,#ff8a2a 82%,rgba(255,110,30,0));box-shadow:0 0 10px 2px var(--pfx-a7)}
.pfx-embers-glow{position:absolute;inset:0;opacity:0;border-radius:inherit;box-shadow:inset 0 0 18px 3px rgba(236,86,30,.75)}
.pfx-embers-spot{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side,rgba(255,196,110,.62),rgba(232,80,28,.42) 52%,rgba(194,60,42,0))}
.pfx-embers-under{position:absolute;left:0;right:0;bottom:0;height:2px;opacity:0;background:linear-gradient(90deg,var(--pfx-a0),var(--pfx-a) 14%,#ff8a2a 42%,#ffd27a 58%,#ff8a2a 74%,var(--pfx-a0));box-shadow:0 0 6px 1px rgba(236,86,30,.6)}
${motionOk(`@keyframes pfx-embers-up{from{transform:translateY(0)}to{transform:translateY(var(--up))}}
@keyframes pfx-embers-drift{0%{opacity:0;transform:translateX(0) scale(1)}7%{opacity:1}16%{opacity:.55}24%{opacity:1}33%{transform:translateX(var(--s1)) scale(.95)}40%{opacity:.6}52%{opacity:.95}66%{transform:translateX(var(--s2)) scale(.75)}70%{opacity:.5}82%{opacity:.8}100%{opacity:0;transform:translateX(var(--dx)) scale(.4)}}
@keyframes pfx-embers-idle-up{0%,87%{transform:translateY(0)}98%,100%{transform:translateY(var(--up))}}
@keyframes pfx-embers-idle-drift{0%,87%{opacity:0;transform:translateX(0) scale(1)}87.8%{opacity:.9}88.8%{opacity:.5}89.6%{opacity:.9}90.6%{transform:translateX(var(--s1)) scale(.95)}91.4%{opacity:.55}92.7%{opacity:.85}94.3%{transform:translateX(var(--s2)) scale(.75)}94.7%{opacity:.45}96%{opacity:.75}98%,100%{opacity:0;transform:translateX(var(--dx)) scale(.4)}}
@keyframes pfx-embers-smolder{0%{opacity:0}9%{opacity:.95}20%{opacity:.72}31%{opacity:.88}45%{opacity:.6}58%{opacity:.72}100%{opacity:0}}
@keyframes pfx-embers-specks{0%,8%{opacity:0}20%{opacity:.9}29%{opacity:.45}38%{opacity:.85}50%{opacity:.4}62%{opacity:.7}100%{opacity:0}}
@keyframes pfx-embers-edge{0%{opacity:0}6%{opacity:1}15%{opacity:.7}24%{opacity:1}38%{opacity:.65}52%{opacity:.85}100%{opacity:0}}
@keyframes pfx-embers-pulse{0%{opacity:0}14%{opacity:1}34%{opacity:.35}52%{opacity:.9}100%{opacity:0}}
@keyframes pfx-embers-ignite{0%{opacity:0;transform:scale(.3)}14%{opacity:1;transform:scale(1.08)}30%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}
@keyframes pfx-embers-flash{0%{opacity:0}12%{opacity:1}100%{opacity:0}}
@keyframes pfx-embers-flare{0%{opacity:0;transform:scaleX(.3)}18%{opacity:1;transform:scaleX(1)}40%{opacity:.7}55%{opacity:.95}100%{opacity:0;transform:scaleX(1)}}
@keyframes pfx-embers-spot{0%{opacity:0;transform:scale(.7)}20%{opacity:1;transform:scale(1)}45%{opacity:.72}60%{opacity:.9}100%{opacity:0;transform:scale(1.06)}}
.pfx-embers-a-up{animation:pfx-embers-up var(--t,1.6s) cubic-bezier(.3,.55,.45,1) var(--d,0s) backwards}
.pfx-embers-a-drift{animation:pfx-embers-drift var(--t,1.6s) ease-in-out var(--d,0s) backwards}
.pfx-embers-a-idleup{animation:pfx-embers-idle-up ${IDLE_MS}ms cubic-bezier(.3,.55,.45,1) var(--sync,0s) infinite}
.pfx-embers-a-idledrift{animation:pfx-embers-idle-drift ${IDLE_MS}ms ease-in-out var(--sync,0s) infinite}
.pfx-embers-a-smolder{animation:pfx-embers-smolder var(--t,1.5s) ease-out var(--d,0s) backwards}
.pfx-embers-a-specks{animation:pfx-embers-specks var(--t,1.6s) linear var(--d,0s) backwards}
.pfx-embers-a-edge{animation:pfx-embers-edge var(--t,1.5s) ease-out var(--d,0s) backwards}
.pfx-embers-a-pulse{animation:pfx-embers-pulse var(--t,1.8s) ease-in-out var(--d,0s) backwards}
.pfx-embers-a-ignite{animation:pfx-embers-ignite var(--t,1.4s) ease-out var(--d,0s) backwards}
.pfx-embers-a-flash{animation:pfx-embers-flash var(--t,.5s) ease-out var(--d,0s) backwards}
.pfx-embers-a-flare{animation:pfx-embers-flare var(--t,1.1s) ease-out var(--d,0s) backwards}
.pfx-embers-a-spot{animation:pfx-embers-spot var(--t,1.1s) ease-out var(--d,0s) backwards}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;
const px = (value: number) => `${Math.round(value * 10) / 10}px`;
/** A position: px, or a percentage as it was given. */
const place = (value: number | string) => (typeof value === 'number' ? px(value) : value);

/** What a hit heats: its new segment, or a sliver at the edge when nothing grew. */
function segment(hit: FxHit): CSSProperties {
  const width = Math.abs(hit.to - hit.from);
  return width > 0.004
    ? { left: pct(Math.min(hit.from, hit.to)), width: pct(width) }
    : { left: `calc(${pct(hit.to)} - 5px)`, width: 10 };
}

interface Ember {
  id: number;
  /** Where it starts: px, or a percentage of the layer it's drawn in. */
  x: number | string;
  y: number | string;
  /** How high it rises (negative), and how far it has swayed at a third, two thirds and the end. */
  up: number;
  s1: number;
  s2: number;
  dx: number;
  /** Diameter in px; duration and delay in ms. */
  size: number;
  t: number;
  d: number;
}

interface Rise {
  /** How high, in px, as a range. */
  rise: [number, number];
  /** Sideways drift over the whole rise, from -drift to +drift px. */
  drift: number;
  /** How far it sways off its line, in px, as a range. */
  sway: [number, number];
  size: [number, number];
  /** Duration range in ms; an idle ember takes the loop's. */
  ms?: [number, number];
  delay?: number;
  /** Extra random delay, up to this many ms. */
  jitter?: number;
}

/** An ember lifting off from one point: it rises on the warm air, swaying, and cools as it goes. */
function ember(
  next: () => number,
  id: number,
  x: number | string,
  y: number | string,
  spec: Rise,
): Ember {
  const dx = between(next, -spec.drift, spec.drift);
  const sway = between(next, spec.sway[0], spec.sway[1]) * (next() < 0.5 ? -1 : 1);
  const ms = spec.ms ?? [0, 0];
  return {
    id,
    x,
    y,
    up: -between(next, spec.rise[0], spec.rise[1]),
    s1: dx * 0.3 + sway,
    s2: dx * 0.65 - sway * 0.75,
    dx,
    size: between(next, spec.size[0], spec.size[1]),
    t: between(next, ms[0], ms[1]),
    d: (spec.delay ?? 0) + between(next, 0, spec.jitter ?? 0),
  };
}

/**
 * Two elements an ember: the outer one rises, easing out like warm air slowing down, the inner
 * one sways, flickers and shrinks. With `sync` they play in the idle loop instead, `d` ms apart.
 */
function Embers({ list, sync, glow }: { list: readonly Ember[]; sync?: number; glow?: string }) {
  const idle = sync !== undefined;
  return list.map((item) => (
    <span
      key={item.id}
      className={`pfx-embers-up ${idle ? 'pfx-embers-a-idleup' : 'pfx-embers-a-up'}`}
      style={
        {
          left: place(item.x),
          top: place(item.y),
          '--up': px(item.up),
          '--s1': px(item.s1),
          '--s2': px(item.s2),
          '--dx': px(item.dx),
          ...(idle
            ? { '--sync': `${sync + Math.round(item.d)}ms` }
            : { '--t': `${Math.round(item.t)}ms`, '--d': `${Math.round(item.d)}ms` }),
        } as Vars
      }
    >
      <span
        className={`pfx-embers-dot ${idle ? 'pfx-embers-a-idledrift' : 'pfx-embers-a-drift'}`}
        style={{
          width: px(item.size),
          height: px(item.size),
          marginLeft: px(-item.size / 2),
          marginTop: px(-item.size / 2),
          boxShadow: glow,
        }}
      />
    </span>
  ));
}

const CORNERS = [
  { at: '0 0', pin: { left: 0, top: 0 } },
  { at: '100% 0', pin: { right: 0, top: 0 } },
  { at: '0 100%', pin: { left: 0, bottom: 0 } },
  { at: '100% 100%', pin: { right: 0, bottom: 0 } },
] as const;

/** A white-hot point in each corner, for the moment they catch. */
const cores = (radius: number) =>
  CORNERS.map(
    ({ at }) =>
      `radial-gradient(circle ${Math.round(radius)}px at ${at},rgba(255,251,232,.95),rgba(255,214,130,.6) 40%,rgba(255,170,80,0))`,
  ).join(',');

/** The four corners catch fire and cool: a white-hot flash, then orange to red glows fading. */
function Corners({ reach, t, d = 0 }: { reach: number; t: number; d?: number }) {
  const size = Math.round(reach);
  return (
    <>
      {CORNERS.map(({ at, pin }) => (
        <span
          key={at}
          className="pfx-embers-corner pfx-embers-a-ignite"
          style={
            {
              ...pin,
              width: size,
              height: size,
              transformOrigin: at,
              '--at': at,
              '--t': `${t}ms`,
              '--d': `${d}ms`,
            } as Vars
          }
        />
      ))}
      <span
        className="pfx-embers-core pfx-embers-a-flash"
        style={
          {
            background: cores(reach * 0.5),
            '--t': `${Math.round(t * 0.4)}ms`,
            '--d': `${d}ms`,
          } as Vars
        }
      />
    </>
  );
}

/**
 * The idle pair: from the bottom edge, or on a stream frame up its side bands, so nothing crosses
 * the picture inside it.
 */
function idlePair(next: () => number, size: number, ring?: number): Ember[] {
  if (ring) {
    if (ring < 9) return [];
    const mid = px(ring / 2);
    const dot = Math.min(4 * size, ring * 0.35);
    return [mid, `calc(100% - ${mid})`].map((x, id) =>
      ember(next, id, x, `calc(100% - ${mid})`, {
        rise: [50 * size, 70 * size],
        drift: 0,
        sway: [ring / 8, ring / 5],
        size: [dot, dot],
        delay: id * 240,
      }),
    );
  }
  return [0, 1].map((id) =>
    ember(next, id, pct(between(next, 0.15, 0.45) + id * 0.4), '100%', {
      rise: [34 * size, 50 * size],
      drift: 10 * size,
      sway: [3 * size, 6 * size],
      size: [3.5 * size, 5 * size],
      delay: id * 240,
    }),
  );
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const big = mode === 'hero';
  const size = Math.min(1.4, Math.max(0.5, scale));
  // How far a corner's fire reaches; on a stream frame it stays inside the band.
  const reach = Math.min((big ? 56 : 34) * size, ring ? ring * 1.3 : Number.POSITIVE_INFINITY);
  const [entry, idle] = useMemo(() => {
    const next = rng(seed);
    // A card that comes in big throws embers up from its whole bottom edge.
    const entry =
      big && !ring
        ? Array.from({ length: 10 }, (_, id) =>
            ember(next, id, pct((id + between(next, 0.15, 0.85)) / 10), '100%', {
              rise: [50 * size, 120 * size],
              drift: 16 * size,
              sway: [3 * size, 8 * size],
              size: [4 * size, 6.5 * size],
              ms: [1300, 2100],
              delay: 120,
              jitter: 520,
            }),
          )
        : [];
    return [entry, idlePair(next, size, ring)];
  }, [seed, big, size, ring]);
  const stoked = useMemo(() => {
    if (ring) return [];
    const next = rng(seedOf(`${seed}:${pulse}`));
    return Array.from({ length: 3 }, (_, id) =>
      ember(next, id, pct(between(next, 0.2, 0.8)), '100%', {
        rise: [24 * size, 44 * size],
        drift: 10 * size,
        sway: [3 * size, 6 * size],
        size: [3.5 * size, 5.5 * size],
        ms: [1000, 1500],
        jitter: 160,
      }),
    );
  }, [seed, pulse, size, ring]);
  const burst = useMemo(() => {
    if (ring) return [];
    const next = rng(seedOf(`${seed}:w${win}`));
    // Out of the whole panel, as if it were a bed of coals.
    return Array.from({ length: 16 }, (_, id) =>
      ember(next, id, pct((id + between(next, 0.1, 0.9)) / 16), pct(between(next, 0.35, 1)), {
        rise: [40 * size, 100 * size],
        drift: 16 * size,
        sway: [3 * size, 8 * size],
        size: [4 * size, 6.5 * size],
        ms: [1300, 2100],
        jitter: 600,
      }),
    );
  }, [seed, win, size, ring]);
  // A frame around a webcam keeps its glows inside its band, off the picture.
  const glow = ring
    ? {
        boxShadow: `inset 0 0 ${Math.round(ring * 0.9)}px ${Math.round(ring / 4)}px rgba(236,86,30,.75)`,
      }
    : undefined;
  const line = ring
    ? {
        height: Math.max(1, Math.min(3 * size, ring / 4)),
        boxShadow: `0 0 ${Math.round(ring / 2)}px ${Math.round(ring / 8)}px var(--pfx-a7)`,
      }
    : { height: Math.max(2, Math.round(3 * size)) };
  return (
    <>
      <Corners reach={reach} t={big ? 1900 : 1400} />
      {big && !ring && (
        <>
          <span
            className="pfx-embers-line pfx-embers-a-flare"
            style={{ ...line, '--t': '1.6s' } as Vars}
          />
          <Embers list={entry} />
        </>
      )}
      {mode === 'full' && (
        <Embers
          list={idle}
          sync={-Math.round(seed * IDLE_MS)}
          glow={ring ? `0 0 ${Math.round(ring / 4)}px 1px rgba(255,120,40,.9)` : undefined}
        />
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span className="pfx-embers-line pfx-embers-a-flare" style={line} />
          <Embers list={stoked} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span className="pfx-embers-glow pfx-embers-a-pulse" style={glow} />
          <span className="pfx-embers-line pfx-embers-a-pulse" style={line} />
          {ring ? (
            <Corners reach={reach} t={1600} />
          ) : (
            <>
              {/* The red glow under the frame flares twice. */}
              <span className="pfx-embers-halo pfx-embers-a-pulse" style={{ inset: 0 }} />
              <Embers list={burst} />
            </>
          )}
        </Fragment>
      )}
    </>
  );
}

function Track({ hit, hits, win }: TrackFxProps) {
  // A poll's vote strikes the edge without growing it: a quick glow, no more.
  const strike = hit ? Math.abs(hit.to - hit.from) <= 0.004 : false;
  const quick = strike ? ({ '--t': '.8s' } as Vars) : undefined;
  const whole = { left: 0, right: 0 };
  return (
    <>
      {hit && hits > 0 && (
        <Fragment key={`h${hits}`}>
          <span
            className="pfx-embers-smolder pfx-embers-a-smolder"
            style={{ ...segment(hit), ...quick }}
          />
          {!strike && (
            <span className="pfx-embers-specks pfx-embers-a-specks" style={segment(hit)} />
          )}
          <span
            className="pfx-embers-edge pfx-embers-a-edge"
            style={{ left: pct(hit.to), ...quick }}
          />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span className="pfx-embers-heat pfx-embers-a-pulse" />
          <span
            className="pfx-embers-smolder pfx-embers-a-smolder"
            style={{ ...whole, '--t': '2.1s' } as Vars}
          />
          <span
            className="pfx-embers-specks pfx-embers-a-specks"
            style={{ ...whole, '--t': '2.3s' } as Vars}
          />
        </Fragment>
      )}
    </>
  );
}

function Burst({ seed, hit, hits, win, left, right, y, height }: BurstFxProps) {
  const rising = useMemo(() => {
    if (!hit) return [];
    const next = rng(seedOf(`${seed}:${hit.key}`));
    const edge = left + (right - left) * hit.to;
    const from = Math.min(left + (right - left) * hit.from, edge - 18);
    // Most lift off near the edge, where it's hottest.
    return Array.from({ length: 7 }, (_, id) =>
      ember(
        next,
        id,
        from + (edge + 2 - from) * Math.sqrt(next()),
        y + height * between(next, -0.32, 0.18),
        {
          rise: [48, 104],
          drift: 18,
          sway: [4, 9],
          size: [4, 6.5],
          ms: [1200, 2000],
          jitter: 420,
        },
      ),
    );
  }, [seed, hit, left, right, y, height]);
  const burst = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    // A wave of embers along the whole bar, left to right.
    return Array.from({ length: 16 }, (_, id) =>
      ember(
        next,
        id,
        left + (right - left) * ((id + next()) / 16),
        y + height * between(next, -0.36, 0.24),
        {
          rise: [56, 124],
          drift: 20,
          sway: [4, 10],
          size: [4, 7],
          ms: [1300, 2000],
          delay: id * 20,
          jitter: 220,
        },
      ),
    );
  }, [seed, win, left, right, y, height]);
  return (
    <>
      {hits > 0 && (
        <Fragment key={`h${hits}`}>
          <Embers list={rising} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          {/* A red glow pulses out from under the bar's frame. */}
          <span
            className="pfx-embers-halo pfx-embers-a-pulse"
            style={{
              left: left - 6,
              top: y - height / 2 - 6,
              width: right - left + 12,
              height: height + 12,
            }}
          />
          <Embers list={burst} />
        </Fragment>
      )}
    </>
  );
}

function Pulse({ seed, pulse, win, enter, round }: PulseFxProps) {
  // Inside a ring, the glow and the embers stay inside the circle.
  const spot = round ? { inset: '12%' } : { inset: '-20%' };
  const lifted = useMemo(() => {
    const next = rng(seedOf(`${seed}:${pulse}`));
    return Array.from({ length: 3 }, (_, id) =>
      ember(
        next,
        id,
        pct(between(next, round ? 0.4 : 0.3, round ? 0.6 : 0.7)),
        pct(between(next, 0.5, 0.7)),
        {
          rise: round ? [14, 28] : [22, 46],
          drift: round ? 6 : 12,
          sway: [3, 6],
          size: [4, 6],
          ms: [1000, 1500],
          jitter: 200,
        },
      ),
    );
  }, [seed, pulse, round]);
  const burst = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return Array.from({ length: 8 }, (_, id) =>
      ember(
        next,
        id,
        pct(between(next, round ? 0.3 : 0.15, round ? 0.7 : 0.85)),
        pct(between(next, 0.45, 0.75)),
        {
          rise: round ? [16, 34] : [28, 64],
          drift: round ? 8 : 16,
          sway: [3, 7],
          size: [4, 6.5],
          ms: [1200, 1900],
          jitter: 450,
        },
      ),
    );
  }, [seed, win, round]);
  // A chat line's smoldering underline lets one small ember go.
  const curl = useMemo(() => {
    const next = rng(seed);
    return [
      ember(next, 0, pct(between(next, 0.1, 0.5)), '100%', {
        rise: [10, 18],
        drift: 6,
        sway: [2, 4],
        size: [3, 4],
        ms: [900, 1200],
        delay: 180,
      }),
    ];
  }, [seed]);
  return (
    <>
      {enter && (
        <>
          <span
            className="pfx-embers-under pfx-embers-a-smolder"
            style={{ '--t': '1.4s' } as Vars}
          />
          <Embers list={curl} />
        </>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span className="pfx-embers-spot pfx-embers-a-spot" style={spot} />
          <Embers list={lifted} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-embers-spot pfx-embers-a-spot"
            style={{ ...spot, '--t': '1.8s' } as Vars}
          />
          <Embers list={burst} />
        </Fragment>
      )}
    </>
  );
}

export const embers: EffectModule = {
  id: 'embers',
  css,
  // Embers are fire whatever the preset; the red under the frame is the preset's own accent.
  vars: (skin: Skin) => ({
    '--pfx-a': skin.colors.accent,
    '--pfx-a8': rgba(skin.colors.accent, 0.8),
    '--pfx-a7': rgba(skin.colors.accent, 0.7),
    '--pfx-a0': rgba(skin.colors.accent, 0),
  }),
  Panel,
  Track,
  Burst,
  Pulse,
};
