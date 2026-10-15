import { type CSSProperties, Fragment, useMemo } from 'react';
import { rgba } from '../color';
import type { Skin } from '../skin';
import { between, motionOk, rng, seedOf, useClockPhase } from './primitives';
import type {
  BurstFxProps,
  EffectModule,
  FxHit,
  PanelFxProps,
  PulseFxProps,
  TrackFxProps,
} from './types';

// Glitch: a broken signal. Panels tear in with red and cyan ghosts, bars flicker in with RGB
// copies and dead blocks, and now and then every Glitch panel and title on screen glitches at
// the same moment, as if the feed dropped out.

/** The idle loop; its burst is the last ~270ms, in step with the clock across sources. */
const IDLE_MS = 9000;

const css = `.pfx-glitch-ghost{position:absolute;inset:0;border:2px solid var(--pfx-a);border-radius:inherit;opacity:0}
.pfx-glitch-ghost.pfx-glitch-m{border-color:var(--pfx-b)}
.pfx-glitch-band{position:absolute;left:0;right:0;opacity:0;border-top:1px solid var(--pfx-a);background:linear-gradient(90deg,transparent,var(--pfx-a5) 12%,var(--pfx-a5) 70%,transparent)}
.pfx-glitch-band.pfx-glitch-m{border-top-color:var(--pfx-b);background:linear-gradient(90deg,transparent,var(--pfx-b5) 30%,var(--pfx-b5) 88%,transparent)}
.pfx-glitch-scan{position:absolute;inset:0;opacity:0;background:linear-gradient(180deg,var(--pfx-a) 0 2px,var(--pfx-a3) 2px,transparent 22%)}
.pfx-glitch-flash{position:absolute;inset:0;border-radius:inherit;opacity:0;background:var(--pfx-t)}
.pfx-glitch-block{position:absolute;opacity:0}
.pfx-glitch-seg{position:absolute;top:0;bottom:0;opacity:0;background:linear-gradient(180deg,#fff,var(--pfx-a) 55%,var(--pfx-b))}
.pfx-glitch-copy{position:absolute;top:0;bottom:0;left:0;opacity:0;background:var(--pfx-a5)}
.pfx-glitch-copy.pfx-glitch-m{background:var(--pfx-b5)}
${motionOk(`@keyframes pfx-glitch-in-c{0%{opacity:.95;transform:translate(calc(var(--o,6px)*-1),1px)}20%{transform:translate(var(--o,6px),-1px)}40%{opacity:.8;transform:translateX(calc(var(--o,6px)*-.5))}60%{opacity:.6;transform:translateX(2px)}80%{opacity:.4;transform:translateX(-1px)}100%{opacity:0;transform:none}}
@keyframes pfx-glitch-in-m{0%{opacity:.95;transform:translate(var(--o,6px),-1px)}20%{transform:translate(calc(var(--o,6px)*-1),1px)}40%{opacity:.8;transform:translateX(calc(var(--o,6px)*.5))}60%{opacity:.6;transform:translateX(-2px)}80%{opacity:.4;transform:translateX(1px)}100%{opacity:0;transform:none}}
@keyframes pfx-glitch-tear{0%{opacity:.9;transform:translateX(-14px)}25%{transform:translateX(11px) scaleY(.5)}50%{opacity:.7;transform:translateX(-6px) scaleY(1.6)}75%{opacity:.4;transform:translateX(3px)}100%{opacity:0;transform:none}}
@keyframes pfx-glitch-sweep{0%{opacity:.9;transform:translateY(0)}80%{opacity:.6}100%{opacity:0;transform:translateY(100%)}}
@keyframes pfx-glitch-flash{0%{opacity:.7}12%{opacity:0}24%{opacity:.4}36%,100%{opacity:0}}
@keyframes pfx-glitch-idle{0%,96.9%{opacity:0;transform:none}97%{opacity:.85;transform:translateX(-12px)}97.8%{opacity:.7;transform:translateX(9px) scaleY(.5)}98.6%{opacity:.5;transform:translateX(-4px) scaleY(1.5)}99.4%,100%{opacity:0;transform:none}}
@keyframes pfx-glitch-idle-c{0%,96.9%{opacity:0;transform:none}97%{opacity:.8;transform:translateX(-3px)}97.8%{transform:translateX(3px)}98.6%{opacity:.5;transform:translateX(-2px)}99.4%,100%{opacity:0;transform:none}}
@keyframes pfx-glitch-idle-m{0%,96.9%{opacity:0;transform:none}97%{opacity:.8;transform:translateX(3px)}97.8%{transform:translateX(-3px)}98.6%{opacity:.5;transform:translateX(2px)}99.4%,100%{opacity:0;transform:none}}
@keyframes pfx-glitch-flicker{0%{opacity:.95}14%{opacity:0}28%{opacity:.85}42%{opacity:0}57%{opacity:.6}71%{opacity:0}85%{opacity:.35}100%{opacity:0}}
@keyframes pfx-glitch-copy-c{0%{opacity:.8;transform:translateX(-4px)}33%{transform:translateX(3px)}66%{opacity:.5;transform:translateX(-2px)}100%{opacity:0;transform:none}}
@keyframes pfx-glitch-copy-m{0%{opacity:.8;transform:translateX(4px)}33%{transform:translateX(-3px)}66%{opacity:.5;transform:translateX(2px)}100%{opacity:0;transform:none}}
@keyframes pfx-glitch-shift{0%{opacity:.9;transform:translateX(8px)}50%{opacity:.8;transform:translateX(-5px)}100%{opacity:0;transform:none}}
@keyframes pfx-glitch-blink{0%{opacity:1}25%{opacity:0}50%{opacity:.9}75%,100%{opacity:0}}
@keyframes pfx-glitch-hop{0%{opacity:1;transform:none}33%{transform:translate(var(--x1),var(--y1))}66%{opacity:.85;transform:translate(var(--x2),var(--y2))}100%{opacity:0;transform:translate(var(--x2),var(--y2))}}
.pfx-glitch-a-inc{animation:pfx-glitch-in-c var(--t,.45s) steps(1,end) var(--d,0s) backwards}
.pfx-glitch-a-inm{animation:pfx-glitch-in-m var(--t,.45s) steps(1,end) var(--d,0s) backwards}
.pfx-glitch-a-tear{animation:pfx-glitch-tear var(--t,.4s) steps(1,end) var(--d,0s) backwards}
.pfx-glitch-a-sweep{animation:pfx-glitch-sweep var(--t,.45s) linear var(--d,0s) backwards}
.pfx-glitch-a-flash{animation:pfx-glitch-flash var(--t,.5s) steps(1,end) var(--d,0s) backwards}
.pfx-glitch-a-idle{animation:pfx-glitch-idle ${IDLE_MS}ms steps(1,end) var(--sync,0s) infinite}
.pfx-glitch-a-idlec{animation:pfx-glitch-idle-c ${IDLE_MS}ms steps(1,end) var(--sync,0s) infinite}
.pfx-glitch-a-idlem{animation:pfx-glitch-idle-m ${IDLE_MS}ms steps(1,end) var(--sync,0s) infinite}
.pfx-glitch-a-flicker{animation:pfx-glitch-flicker var(--t,.42s) steps(1,end) var(--d,0s) backwards}
.pfx-glitch-a-copyc{animation:pfx-glitch-copy-c var(--t,.3s) steps(1,end) var(--d,0s) backwards}
.pfx-glitch-a-copym{animation:pfx-glitch-copy-m var(--t,.3s) steps(1,end) var(--d,0s) backwards}
.pfx-glitch-a-shift{animation:pfx-glitch-shift var(--t,.22s) steps(1,end) var(--d,0s) backwards}
.pfx-glitch-a-blink{animation:pfx-glitch-blink var(--t,.36s) steps(1,end) var(--d,0s) backwards}
.pfx-glitch-a-hop{animation:pfx-glitch-hop var(--t,.35s) steps(1,end) var(--d,0s) backwards}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;
const BLOCK_COLORS = ['var(--pfx-a)', 'var(--pfx-b)', 'var(--pfx-w)', 'var(--pfx-t)'];

/** Where a hit's flicker goes: its new segment, or a sliver at the edge when nothing grew. */
function segment(hit: FxHit): CSSProperties {
  const width = Math.abs(hit.to - hit.from);
  return width > 0.004
    ? { left: pct(Math.min(hit.from, hit.to)), width: pct(width) }
    : { left: `calc(${pct(hit.to)} - 4px)`, width: 8 };
}

interface Band {
  top: number;
  height: number;
  red: boolean;
  delay: number;
}

function bands(next: () => number, count: number, spread: number): Band[] {
  return Array.from({ length: count }, (_, index) => ({
    top: between(next, 4, 88),
    height: between(next, 3, 12),
    red: index % 2 === 1,
    delay: between(next, 0, spread),
  }));
}

function Bands({ list, animation, t }: { list: readonly Band[]; animation: string; t?: number }) {
  return list.map((band) => (
    <span
      key={`${band.top}-${band.delay}`}
      className={`pfx-glitch-band ${band.red ? 'pfx-glitch-m ' : ''}${animation}`}
      style={
        {
          top: pct(band.top / 100),
          height: pct(band.height / 100),
          '--d': `${Math.round(band.delay)}ms`,
          ...(t ? { '--t': `${t}ms` } : {}),
        } as Vars
      }
    />
  ));
}

/** Red and cyan copies of the panel's outline, knocked sideways and back. */
function Ghosts({ offset, t, idle }: { offset: number; t: number; idle?: boolean }) {
  const style = { '--o': `${offset}px`, '--t': `${t}ms` } as Vars;
  return (
    <>
      <span
        className={`pfx-glitch-ghost ${idle ? 'pfx-glitch-a-idlec' : 'pfx-glitch-a-inc'}`}
        style={style}
      />
      <span
        className={`pfx-glitch-ghost pfx-glitch-m ${idle ? 'pfx-glitch-a-idlem' : 'pfx-glitch-a-inm'}`}
        style={style}
      />
    </>
  );
}

/** The heavy version: a goal reached, a winner, an alert or a winner's card coming in. */
function Crash({ seed, ring }: { seed: number; ring?: number }) {
  const list = useMemo(() => bands(rng(seed), 6, 500), [seed]);
  return (
    <>
      <Ghosts offset={8} t={900} />
      {!ring && (
        <>
          <Bands list={list} animation="pfx-glitch-a-tear" t={500} />
          <span className="pfx-glitch-flash pfx-glitch-a-flash" />
          <span className="pfx-glitch-scan pfx-glitch-a-sweep" style={{ '--t': '700ms' } as Vars} />
        </>
      )}
    </>
  );
}

function Panel({ seed, mode, pulse, win, ring }: PanelFxProps) {
  const sync = useClockPhase(IDLE_MS);
  const [enter, idle, hits] = useMemo(() => {
    const next = rng(seed);
    return [bands(next, 2, 120), bands(next, 2, 0), bands(next, 1, 0)];
  }, [seed]);
  return (
    <>
      {mode === 'hero' ? (
        <Crash seed={seed} ring={ring} />
      ) : (
        <>
          <Ghosts offset={6} t={450} />
          {!ring && (
            <>
              <Bands list={enter} animation="pfx-glitch-a-tear" />
              <span className="pfx-glitch-scan pfx-glitch-a-sweep" />
            </>
          )}
        </>
      )}
      {mode === 'full' && (
        // Every panel's loop ends on the same beat, so the whole overlay glitches at once.
        <span
          className="pfx"
          style={{ inset: 0, borderRadius: 'inherit', '--sync': `${sync}ms` } as Vars}
        >
          <Ghosts offset={3} t={IDLE_MS} idle />
          {!ring && <Bands list={idle} animation="pfx-glitch-a-idle" />}
        </span>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <Ghosts offset={4} t={300} />
          {!ring && <Bands list={hits} animation="pfx-glitch-a-tear" t={300} />}
        </Fragment>
      )}
      {win > 0 && <Crash key={`w${win}`} seed={seedOf(`${seed}:${win}`)} ring={ring} />}
    </>
  );
}

interface Block {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

/** Dead pixels near the edge of what just grew. */
function deadBlocks(next: () => number, count: number): Block[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: between(next, -26, 10),
    y: between(next, 0, 80),
    size: between(next, 3, 7),
    color: BLOCK_COLORS[Math.floor(next() * BLOCK_COLORS.length)],
    delay: between(next, 0, 160),
  }));
}

function Track({ seed, hit, hits, win }: TrackFxProps) {
  const [blocks, tears] = useMemo(() => {
    if (!hit) return [[], []];
    const next = rng(seedOf(`${seed}:${hit.key}`));
    return [deadBlocks(next, 4), bands(next, 2, 90)];
  }, [seed, hit]);
  const slices = useMemo(() => bands(rng(seedOf(`${seed}:w${win}`)), 5, 900), [seed, win]);
  return (
    <>
      {hit && hits > 0 && (
        <Fragment key={`h${hits}`}>
          {/* The whole bar jolts: its outline splits and two lines tear across it. */}
          <Ghosts offset={4} t={320} />
          <Bands list={tears} animation="pfx-glitch-a-tear" t={320} />
          <span className="pfx-glitch-copy pfx-glitch-a-copyc" style={{ width: pct(hit.to) }} />
          <span
            className="pfx-glitch-copy pfx-glitch-m pfx-glitch-a-copym"
            style={{ width: pct(hit.to) }}
          />
          <span className="pfx-glitch-seg pfx-glitch-a-flicker" style={segment(hit)} />
          <span
            className="pfx-glitch-block pfx-glitch-a-shift"
            style={{ ...segment(hit), top: '28%', height: '30%', background: 'var(--pfx-a)' }}
          />
          {blocks.map((block) => (
            <span
              key={block.id}
              className="pfx-glitch-block pfx-glitch-a-blink"
              style={
                {
                  left: `calc(${pct(hit.to)} + ${Math.round(block.x)}px)`,
                  top: pct(block.y / 100),
                  width: block.size,
                  height: block.size,
                  background: block.color,
                  '--d': `${Math.round(block.delay)}ms`,
                } as Vars
              }
            />
          ))}
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-glitch-seg pfx-glitch-a-flicker"
            style={{ left: 0, right: 0, '--t': '900ms' } as Vars}
          />
          <Bands list={slices} animation="pfx-glitch-a-tear" t={360} />
        </Fragment>
      )}
    </>
  );
}

interface Hop extends Block {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Blocks knocked off the bar's edge, jumping away in steps. */
function hops(
  next: () => number,
  count: number,
  x: () => number,
  y: number,
  spread: number,
): Hop[] {
  return deadBlocks(next, count).map((block) => {
    const side = next() < 0.5 ? -1 : 1;
    return {
      ...block,
      x: x(),
      y: y + between(next, -spread, spread),
      x1: side * between(next, 4, 14),
      y1: -between(next, 6, 18),
      x2: side * between(next, 12, 30),
      y2: -between(next, 14, 34),
      delay: between(next, 0, 220),
    };
  });
}

function Burst({ seed, hit, hits, win, left, right, y, height }: BurstFxProps) {
  const edge = useMemo(() => {
    if (!hit) return [];
    const next = rng(seedOf(`${seed}:${hit.key}`));
    const x = left + (right - left) * hit.to;
    return hops(next, 6, () => x, y, height / 3);
  }, [seed, hit, left, right, y, height]);
  const along = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return hops(next, 12, () => between(next, left, right), y, height / 2);
  }, [seed, win, left, right, y, height]);
  const draw = (list: Hop[]) =>
    list.map((block) => (
      <span
        key={block.id}
        className="pfx-glitch-block pfx-glitch-a-hop"
        style={
          {
            left: block.x,
            top: block.y,
            width: block.size,
            height: block.size,
            background: block.color,
            '--x1': `${block.x1}px`,
            '--y1': `${block.y1}px`,
            '--x2': `${block.x2}px`,
            '--y2': `${block.y2}px`,
            '--d': `${Math.round(block.delay)}ms`,
          } as Vars
        }
      />
    ));
  return (
    <>
      {hits > 0 && <Fragment key={`h${hits}`}>{draw(edge)}</Fragment>}
      {win > 0 && <Fragment key={`w${win}`}>{draw(along)}</Fragment>}
    </>
  );
}

function Pulse({ seed, pulse, win, enter }: PulseFxProps) {
  const [once, hit, big] = useMemo(() => {
    const next = rng(seed);
    return [bands(next, 1, 0), bands(next, 2, 80), bands(next, 4, 400)];
  }, [seed]);
  return (
    <>
      {enter && <Bands list={once} animation="pfx-glitch-a-tear" t={300} />}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <Bands list={hit} animation="pfx-glitch-a-tear" t={320} />
          <span
            className="pfx-glitch-flash pfx-glitch-a-flash"
            style={{ '--t': '300ms' } as Vars}
          />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <Bands list={big} animation="pfx-glitch-a-tear" t={420} />
          <span className="pfx-glitch-flash pfx-glitch-a-flash" />
        </Fragment>
      )}
    </>
  );
}

export const glitch: EffectModule = {
  id: 'glitch',
  css,
  vars: (skin: Skin) => ({
    '--pfx-a': skin.colors.accent,
    '--pfx-a5': rgba(skin.colors.accent, 0.5),
    '--pfx-a3': rgba(skin.colors.accent, 0.3),
    '--pfx-b': skin.colors.frame,
    '--pfx-b5': rgba(skin.colors.frame, 0.5),
    '--pfx-w': skin.colors.win,
    '--pfx-t': skin.colors.text,
  }),
  // CRT scanlines, still: painted once under the panel's content.
  panelLayer: (_skin, scale) =>
    `repeating-linear-gradient(180deg, rgba(0,0,0,.2) 0 1px, transparent 1px ${Math.max(2, Math.round(3 * scale))}px)`,
  // Titles split into red and cyan on the same beat as the panels.
  titleCss: (prefix, now) =>
    motionOk(`@keyframes pfx-glitch-title{97%{text-shadow:-2px 0 var(--pfx-b),2px 0 var(--pfx-a);transform:translateX(2px) skewX(-6deg)}97.8%{text-shadow:2px 0 var(--pfx-b),-2px 0 var(--pfx-a);transform:translateX(-2px)}98.6%{text-shadow:-1px 0 var(--pfx-b),1px 0 var(--pfx-a);transform:none}}
.${prefix}-title{animation:pfx-glitch-title ${IDLE_MS}ms steps(1,end) ${-(now % IDLE_MS)}ms infinite}`),
  Panel,
  Track,
  Burst,
  Pulse,
};
