import { type CSSProperties, Fragment, useMemo } from 'react';
import { rgba, shade } from '../color';
import type { Skin } from '../skin';
import { between, motionOk, rng, seedOf } from './primitives';
import type { BurstFxProps, EffectModule, PanelFxProps, PulseFxProps, TrackFxProps } from './types';

// Flare: a supply drop. A red flare burns at a bar's new edge and sends up red smoke, and a goal
// reached sends up a tall plume in the win color. Panels land in a puff of dust, and now and then
// a faint wisp of smoke drifts up from a corner. Smoke is soft gradients only, never a blur.

/** The idle loop; each panel plays it at its own moment. */
const IDLE_MS = 12_000;
/** When a card that comes in big touches down, in ms: Stream Alerts' drop lands about then. */
const LAND_MS = 280;

const css = `.pfx-flare-dot{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side,#fff 0 16%,#ffe0d2 24%,#ff5536 42%,rgba(255,46,28,.4) 64%,rgba(255,40,24,0))}
.pfx-flare-cast{position:absolute;opacity:0;background:radial-gradient(closest-side,rgba(255,72,44,.5),rgba(255,60,36,0))}
.pfx-flare-puff{position:absolute;opacity:0;border-radius:50%}
.pfx-flare-red{background:radial-gradient(circle at 36% 58%,rgba(232,58,40,.62),rgba(232,58,40,0) 48%),radial-gradient(circle at 64% 40%,rgba(255,118,78,.5),rgba(255,118,78,0) 46%),radial-gradient(closest-side,rgba(190,40,30,.36),rgba(190,40,30,0))}
.pfx-flare-ember{background:radial-gradient(circle at 40% 56%,rgba(255,138,64,.58),rgba(255,138,64,0) 48%),radial-gradient(circle at 62% 40%,rgba(255,96,60,.48),rgba(255,96,60,0) 46%),radial-gradient(closest-side,rgba(214,70,36,.34),rgba(214,70,36,0))}
.pfx-flare-win{background:radial-gradient(circle at 36% 58%,var(--pfx-w6),var(--pfx-w0) 48%),radial-gradient(circle at 63% 38%,var(--pfx-p5),var(--pfx-p0) 46%),radial-gradient(closest-side,var(--pfx-w3),var(--pfx-w0))}
.pfx-flare-dust{background:radial-gradient(circle at 38% 58%,rgba(178,148,104,.6),rgba(178,148,104,0) 48%),radial-gradient(circle at 64% 42%,rgba(212,190,148,.45),rgba(212,190,148,0) 46%),radial-gradient(closest-side,rgba(132,106,72,.36),rgba(132,106,72,0))}
.pfx-flare-wisp{background:radial-gradient(circle at 42% 56%,rgba(226,220,204,.34),rgba(226,220,204,0) 50%),radial-gradient(closest-side,rgba(188,182,164,.2),rgba(188,182,164,0))}
.pfx-flare-flash{position:absolute;inset:0;opacity:0;border-radius:inherit;background:linear-gradient(180deg,rgba(255,255,255,.8),var(--pfx-w5))}
.pfx-flare-glow{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side,#fff,var(--pfx-p5) 35%,var(--pfx-w0))}
.pfx-flare-band{position:absolute;inset:0;opacity:0;border-radius:inherit}
.pfx-flare-haze{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side,rgba(178,148,104,.5),rgba(178,148,104,0))}
.pfx-flare-trail{position:absolute;left:0;right:0;bottom:0;height:3px;opacity:0;border-radius:2px;transform-origin:0 50%;background:linear-gradient(90deg,rgba(206,198,182,0),rgba(206,198,182,.5) 30%,rgba(255,112,84,.65) 94%,rgba(255,90,60,0))}
.pfx-flare-run{position:absolute;left:0;bottom:0;width:100%;height:3px}
${motionOk(`@keyframes pfx-flare-flick{0%{opacity:0;transform:scale(.3)}10%{opacity:1;transform:scale(1.2)}24%{transform:scale(.86)}40%{opacity:.94;transform:scale(1.1)}56%{transform:scale(.9)}72%{opacity:.88;transform:scale(1.04)}100%{opacity:0;transform:scale(.6)}}
@keyframes pfx-flare-cast{0%{opacity:0}14%{opacity:1}55%{opacity:.7}100%{opacity:0}}
@keyframes pfx-flare-puff{0%{opacity:0;transform:translate(0,0) rotate(0deg) scale(var(--s0,.4))}16%{opacity:1}60%{opacity:.7}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r)) scale(var(--s1,1.7))}}
@keyframes pfx-flare-fade{0%{opacity:1}100%{opacity:0}}
@keyframes pfx-flare-glow{0%{opacity:0;transform:scale(.4)}15%{opacity:1}100%{opacity:0;transform:scale(1.3)}}
@keyframes pfx-flare-wisp{0%,86.5%{opacity:0;transform:translate(0,0) rotate(0deg) scale(.5);animation-timing-function:cubic-bezier(.25,.6,.4,1)}89.5%{opacity:1}96%{opacity:.55}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r)) scale(var(--s1,1.8))}}
@keyframes pfx-flare-trail{0%{opacity:.95;transform:translateY(0) scale(0,1);animation-timing-function:ease-out}40%{opacity:.85;transform:translateY(0) scale(1,1)}100%{opacity:0;transform:translateY(-4px) scale(1,2.6)}}
@keyframes pfx-flare-run{0%{transform:translateX(-100%)}100%{transform:translateX(0)}}
.pfx-flare-a-flick{animation:pfx-flare-flick var(--t,.45s) linear var(--d,0s) backwards}
.pfx-flare-a-cast{animation:pfx-flare-cast var(--t,.8s) ease-out var(--d,0s) backwards}
.pfx-flare-a-puff{animation:pfx-flare-puff var(--t,1.4s) cubic-bezier(.2,.6,.35,1) var(--d,0s) backwards}
.pfx-flare-a-fade{animation:pfx-flare-fade var(--t,.5s) ease-out var(--d,0s) backwards}
.pfx-flare-a-glow{animation:pfx-flare-glow var(--t,.5s) ease-out var(--d,0s) backwards}
.pfx-flare-a-wisp{animation:pfx-flare-wisp ${IDLE_MS}ms linear var(--sync,0s) infinite}
.pfx-flare-a-trail{animation:pfx-flare-trail var(--t,1.4s) linear var(--d,0s) backwards}
.pfx-flare-a-run{animation:pfx-flare-run var(--t,.56s) ease-out var(--d,0s) backwards}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;
const ms = (value: number) => `${Math.round(value)}ms`;
/** A length measured from the far edge, e.g. for a puff in a right or bottom corner. */
const fromEnd = (px: number) => `calc(100% - ${Math.round(px)}px)`;

type Tone = 'red' | 'ember' | 'win' | 'dust' | 'wisp';

interface Puff {
  id: number;
  /** Where it starts: stage px, or a length in the box, e.g. a percentage. */
  x: number | string;
  y: number | string;
  size: number;
  /** How far it drifts, in px. */
  dx: number;
  dy: number;
  /** The scale it starts and ends at, and how far it turns, in degrees. */
  s0: number;
  s1: number;
  r: number;
  t: number;
  d: number;
  tone: Tone;
}

/** A puff's size and growth that keep it inside a frame's band, `ring` px thick. */
function banded(ring: number, size: number) {
  const fit = Math.min(size, ring * 0.8);
  return { size: fit, s1: Math.min(1.6, (ring * 0.95) / fit) };
}

/**
 * Soft smoke: gradient lumps on one span that swell, drift and turn as they fade. With `sync` it
 * loops instead, at the panel's idle phase.
 */
function Puffs({ list, sync }: { list: readonly Puff[]; sync?: number }) {
  return list.map((puff) => {
    const size = Math.round(puff.size);
    return (
      <span
        key={puff.id}
        className={`pfx-flare-puff pfx-flare-${puff.tone} ${sync === undefined ? 'pfx-flare-a-puff' : 'pfx-flare-a-wisp'}`}
        style={
          {
            left: puff.x,
            top: puff.y,
            width: size,
            height: size,
            margin: `${-size / 2}px 0 0 ${-size / 2}px`,
            '--dx': `${Math.round(puff.dx)}px`,
            '--dy': `${Math.round(puff.dy)}px`,
            '--s0': puff.s0.toFixed(2),
            '--s1': puff.s1.toFixed(2),
            '--r': `${Math.round(puff.r)}deg`,
            ...(sync === undefined
              ? { '--t': ms(puff.t), '--d': ms(puff.d) }
              : { '--sync': ms(sync + puff.d) }),
          } as Vars
        }
      />
    );
  });
}

/** Dust kicked out of both bottom corners as a panel lands, `count` puffs a side. */
function landingDust(next: () => number, count: number, size: number, hero: boolean): Puff[] {
  const big = hero ? 1.3 : 1;
  const delay = hero ? LAND_MS : 40;
  const corners = [-1, 1].flatMap((side, corner) =>
    Array.from({ length: count }, (_, index): Puff => {
      const inset = between(next, 0, 8) * size;
      return {
        id: corner * count + index,
        x: side < 0 ? Math.round(inset) : fromEnd(inset),
        y: fromEnd(between(next, 0, 6) * size),
        size: between(next, 18, 30) * size * big,
        dx: side * between(next, 14, 42) * size * big,
        dy: -between(next, 2, 12) * size,
        s0: between(next, 0.35, 0.5),
        s1: between(next, 1.5, 2.1),
        r: between(next, -50, 50),
        t: between(next, 700, 1150) * big,
        d: delay + between(next, 0, 140),
        tone: 'dust',
      };
    }),
  );
  if (!hero) return corners;
  // A card that comes in big lands along its whole bottom edge.
  const middle = Array.from({ length: 4 }, (_, index): Puff => {
    const at = between(next, 0.2, 0.8);
    return {
      id: 2 * count + index,
      x: pct(at),
      y: fromEnd(between(next, 0, 6) * size),
      size: between(next, 24, 36) * size,
      dx: (at < 0.5 ? -1 : 1) * between(next, 12, 34) * size,
      dy: -between(next, 2, 10) * size,
      s0: 0.45,
      s1: between(next, 1.6, 2.1),
      r: between(next, -40, 40),
      t: between(next, 900, 1300),
      d: delay + between(next, 20, 160),
      tone: 'dust',
    };
  });
  return [...corners, ...middle];
}

/** The same in a frame's band: along its bottom edge, in from both corners. */
function bandDust(next: () => number, ring: number, size: number): Puff[] {
  return [-1, 1].flatMap((side, corner) =>
    Array.from({ length: 2 }, (_, index): Puff => {
      const fit = banded(ring, between(next, 18, 26) * size);
      return {
        id: corner * 2 + index,
        x: side < 0 ? Math.round(ring / 2) : fromEnd(ring / 2),
        y: fromEnd(ring / 2),
        size: fit.size,
        dx: -side * between(next, 12, 40) * size,
        dy: 0,
        s0: 0.5,
        s1: fit.s1,
        r: between(next, -40, 40),
        t: between(next, 700, 1100),
        d: 40 + between(next, 0, 140),
        tone: 'dust',
      };
    }),
  );
}

/** A faint wisp of smoke from one bottom corner: two puffs, one after the other. */
function wispFrom(next: () => number, size: number, ring?: number): Puff[] {
  const side = next() < 0.5 ? -1 : 1;
  return Array.from({ length: 2 }, (_, id): Puff => {
    const fit = ring
      ? banded(ring, 18 * size)
      : { size: between(next, 18, 24) * size, s1: between(next, 1.7, 2) };
    const edge = ring ? ring / 2 : between(next, 6, 14) * size;
    return {
      id,
      x: side < 0 ? Math.round(edge) : fromEnd(edge),
      y: fromEnd(ring ? ring / 2 : between(next, 4, 10) * size),
      size: fit.size,
      // Up the panel's side, leaning in a little; in a frame's band, straight up it.
      dx: ring ? 0 : -side * between(next, 4, 12) * size,
      dy: -between(next, 34, 52) * size,
      s0: 0.5,
      s1: fit.s1,
      r: between(next, -60, 60),
      t: 0,
      d: id * 420,
      tone: 'wisp',
    };
  });
}

/** A flare popping on a panel's top edge and sending up a little smoke, or along a frame's band. */
function flarePop(next: () => number, size: number, ring?: number) {
  const x = pct(between(next, 0.2, 0.8));
  const y = ring ? Math.round(ring / 2) : 0;
  const dot = Math.round(ring ? Math.min(26 * size, ring * 1.1) : 26 * size);
  const smoke = Array.from({ length: 3 }, (_, id): Puff => {
    const fit = ring
      ? banded(ring, between(next, 14, 20) * size)
      : { size: between(next, 14, 22) * size, s1: between(next, 1.6, 2.1) };
    return {
      id,
      x,
      y,
      size: fit.size,
      // Up off the edge; in a frame's band, along it.
      dx: ring ? (id % 2 ? 1 : -1) * between(next, 10, 30) * size : between(next, -14, 14) * size,
      dy: ring ? 0 : -between(next, 18, 40) * size,
      s0: 0.45,
      s1: fit.s1,
      r: between(next, -60, 60),
      t: between(next, 900, 1300),
      d: 60 + id * 90 + between(next, 0, 60),
      tone: id % 2 ? 'ember' : 'red',
    };
  });
  const style: Vars = {
    left: x,
    top: y,
    width: dot,
    height: dot,
    margin: `${-dot / 2}px 0 0 ${-dot / 2}px`,
  };
  return { dot: style, smoke };
}

/** Smoke in the win color going up both sides of a panel, or up a frame's side bands. */
function sidePlumes(next: () => number, size: number, ring?: number): Puff[] {
  return [-1, 1].flatMap((side, plume) =>
    Array.from({ length: 5 }, (_, index): Puff => {
      const want = (20 + index * 3.5) * size;
      const fit = ring ? banded(ring, want) : { size: want, s1: between(next, 1.7, 2.2) };
      const edge = ring ? ring / 2 : between(next, 2, 10) * size;
      return {
        id: plume * 5 + index,
        x: side < 0 ? Math.round(edge) : fromEnd(edge),
        y: ring ? fromEnd(ring / 2) : '100%',
        size: fit.size,
        dx: ring ? 0 : side * between(next, -4, 12) * size,
        dy: -(34 + index * 24 + between(next, 0, 12)) * size,
        s0: between(next, 0.4, 0.55),
        s1: fit.s1,
        r: between(next, -60, 60),
        t: between(next, 1300, 1900),
        d: index * 100 + between(next, 0, 60),
        tone: 'win',
      };
    }),
  );
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const size = Math.min(1.4, Math.max(0.5, scale));
  const hero = mode === 'hero' && !ring;
  const [landing, wisp] = useMemo(() => {
    const next = rng(seed);
    const dust = ring
      ? bandDust(next, ring, size)
      : landingDust(next, hero ? 4 : scale < 0.8 ? 2 : 3, size, hero);
    return [dust, wispFrom(next, size, ring)];
  }, [seed, ring, hero, scale, size]);
  const popped = useMemo(
    () => flarePop(rng(seedOf(`${seed}:p${pulse}`)), size, ring),
    [seed, pulse, size, ring],
  );
  const plumes = useMemo(
    () => sidePlumes(rng(seedOf(`${seed}:w${win}`)), size, ring),
    [seed, win, size, ring],
  );
  return (
    <>
      <Puffs list={landing} />
      {hero && (
        <span
          className="pfx-flare-haze pfx-flare-a-glow"
          style={
            {
              left: '-6%',
              right: '-6%',
              bottom: -Math.round(16 * size),
              height: Math.round(32 * size),
              '--t': '1.1s',
              '--d': `${LAND_MS}ms`,
            } as Vars
          }
        />
      )}
      {mode === 'full' && <Puffs list={wisp} sync={-Math.round(seed * IDLE_MS)} />}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span className="pfx-flare-dot pfx-flare-a-flick" style={popped.dot} />
          <Puffs list={popped.smoke} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          {ring ? (
            // A frame around a webcam keeps its glow inside its band, off the picture.
            <span
              className="pfx-flare-band pfx-flare-a-fade"
              style={
                {
                  boxShadow: `inset 0 0 ${Math.round(ring * 0.8)}px ${Math.round(ring / 5)}px var(--pfx-w5)`,
                  '--t': '1.2s',
                } as Vars
              }
            />
          ) : (
            <span className="pfx-flare-flash pfx-flare-a-fade" style={{ '--t': '.5s' } as Vars} />
          )}
          <Puffs list={plumes} />
        </Fragment>
      )}
    </>
  );
}

function Track({ seed, hit, hits, win }: TrackFxProps) {
  const smoke = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    // The bar fills with smoke in the win color, swirling up out of it.
    return Array.from(
      { length: 5 },
      (_, id): Puff => ({
        id,
        x: pct((id + 0.5) / 5 + between(next, -0.05, 0.05)),
        y: pct(between(next, 0.55, 0.85)),
        size: between(next, 34, 50),
        dx: between(next, -26, 26),
        dy: -between(next, 6, 18),
        s0: between(next, 0.45, 0.6),
        s1: between(next, 1.9, 2.5),
        r: between(next, -80, 80),
        t: between(next, 1300, 2000),
        d: id * 70 + between(next, 0, 120),
        tone: 'win',
      }),
    );
  }, [seed, win]);
  return (
    <>
      {hit && hits > 0 && (
        // The flare marks the new edge, lighting the bar around it red.
        <Fragment key={`h${hits}`}>
          <span
            className="pfx-flare-cast pfx-flare-a-cast"
            style={{
              left: `calc(${pct(hit.to)} - 70px)`,
              width: 140,
              top: '-30%',
              bottom: '-30%',
            }}
          />
          <span
            className="pfx-flare-dot pfx-flare-a-flick"
            style={{
              left: `calc(${pct(hit.to)} - 17px)`,
              top: 'calc(50% - 17px)',
              width: 34,
              height: 34,
            }}
          />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span className="pfx-flare-flash pfx-flare-a-fade" style={{ '--t': '.5s' } as Vars} />
          <Puffs list={smoke} />
        </Fragment>
      )}
    </>
  );
}

function Burst({ seed, hit, hits, win, left, right, y, height }: BurstFxProps) {
  const smoke = useMemo(() => {
    if (!hit) return [];
    const next = rng(seedOf(`${seed}:${hit.key}`));
    const x = left + (right - left) * hit.to;
    return Array.from(
      { length: 5 },
      (_, id): Puff => ({
        id,
        x: x + between(next, -4, 4),
        y: y - between(next, 0, 0.25) * height,
        size: between(next, 18, 28),
        dx: between(next, -16, 16),
        dy: -between(next, 38, 80),
        s0: between(next, 0.35, 0.5),
        s1: between(next, 1.7, 2.3),
        r: between(next, -70, 70),
        t: between(next, 1000, 1800),
        d: id * 80 + between(next, 0, 80),
        tone: id % 2 ? 'ember' : 'red',
      }),
    );
  }, [seed, hit, left, right, y, height]);
  // The goal's end of the bar, where the plume goes up.
  const base = left + (right - left) * 0.95;
  const plume = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    // Stacked: each puff starts a beat later and climbs higher than the one before.
    return Array.from(
      { length: 9 },
      (_, id): Puff => ({
        id,
        x: base + between(next, -6, 6),
        y: y - between(next, 0, 0.2) * height,
        size: 24 + id * 2.6 + between(next, -2, 2),
        dx: between(next, -10, 10) + id * 1.5,
        dy: -(36 + id * 17 + between(next, 0, 12)),
        s0: between(next, 0.4, 0.55),
        s1: between(next, 1.7, 2.2),
        r: between(next, -60, 60),
        t: between(next, 1400, 2000),
        d: id * 90 + between(next, 0, 50),
        tone: 'win',
      }),
    );
  }, [seed, win, base, y, height]);
  return (
    <>
      {hits > 0 && (
        <Fragment key={`h${hits}`}>
          <Puffs list={smoke} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-flare-glow pfx-flare-a-glow"
            style={
              {
                left: Math.round(base - 70),
                top: Math.round(y - 45),
                width: 140,
                height: 90,
                '--t': '.55s',
              } as Vars
            }
          />
          <Puffs list={plume} />
        </Fragment>
      )}
    </>
  );
}

/** Smoke rising off a number: a few red puffs, or a little plume in the win color. */
function numberSmoke(next: () => number, count: number, round: boolean, won: boolean): Puff[] {
  // Inside a ring it stays small and low, so it keeps to the circle.
  const reach = round ? 0.5 : 1;
  return Array.from(
    { length: count },
    (_, id): Puff => ({
      id,
      x: pct(between(next, 0.36, 0.64)),
      y: pct(round ? 0.55 : between(next, 0.38, 0.58)),
      size: between(next, 18, 28) * (round ? 0.7 : 1),
      dx: between(next, -16, 16) * reach,
      dy: -(won ? 26 + id * 12 : between(next, 24, 48)) * reach,
      s0: between(next, 0.4, 0.55),
      s1: between(next, 1.6, 2.1) * (round ? 0.8 : 1),
      r: between(next, -60, 60),
      t: won ? between(next, 1300, 1800) : between(next, 900, 1300),
      d: id * (won ? 90 : 110) + between(next, 0, 60),
      tone: won ? 'win' : id % 2 ? 'ember' : 'red',
    }),
  );
}

function Pulse({ seed, pulse, win, enter, round }: PulseFxProps) {
  const puffs = useMemo(
    () => numberSmoke(rng(seedOf(`${seed}:p${pulse}`)), 3, round, false),
    [seed, pulse, round],
  );
  const plume = useMemo(
    () => numberSmoke(rng(seedOf(`${seed}:w${win}`)), 6, round, true),
    [seed, win, round],
  );
  return (
    <>
      {enter && (
        // A chat line comes in with a flare skimming its bottom edge, leaving a thin smoke trail.
        <>
          <span className="pfx-flare-trail pfx-flare-a-trail" />
          <span className="pfx-flare-run pfx-flare-a-run">
            <span
              className="pfx-flare-dot pfx-flare-a-flick"
              style={{ right: -7, top: -5, width: 14, height: 14, '--t': '.62s' } as Vars}
            />
          </span>
        </>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <Puffs list={puffs} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-flare-glow pfx-flare-a-glow"
            style={round ? { inset: '18%' } : { inset: '-8%' }}
          />
          <Puffs list={plume} />
        </Fragment>
      )}
    </>
  );
}

export const flare: EffectModule = {
  id: 'flare',
  css,
  // The flare's red and the dust are fixed; the win's smoke takes the preset's win color.
  vars: (skin: Skin) => ({
    '--pfx-w6': rgba(skin.colors.win, 0.6),
    '--pfx-w5': rgba(skin.colors.win, 0.5),
    '--pfx-w3': rgba(skin.colors.win, 0.32),
    '--pfx-w0': rgba(skin.colors.win, 0),
    '--pfx-p5': shade(skin.win, 84, 0.5),
    '--pfx-p0': shade(skin.win, 84, 0),
  }),
  Panel,
  Track,
  Burst,
  Pulse,
};
