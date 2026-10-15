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

// Hitmarker: Operator's clean black and white menus. What a bar gains flashes white and its edge
// takes a hit: four short ticks in an X around an empty middle, gone in a blink. A win is three
// quick hits in the win color and a flash sweeping across. Panels come in behind one fast white
// line and otherwise keep still: no idle loop.

/** When a win's sweep follows its three hits, in ms. */
const SWEEP_AT = 400;
/** The time between a win's hits, in ms. */
const RAPID = 150;

const css = `.pfx-hitmarker-x{position:absolute;width:0;height:0;opacity:0}
.pfx-hitmarker-x>span{position:absolute;left:0;top:0;width:var(--l);height:var(--b);margin-top:calc(var(--b)*-.5);transform-origin:0 50%;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.55)}
.pfx-hitmarker-x>span:nth-child(1){transform:rotate(45deg) translateX(var(--g))}
.pfx-hitmarker-x>span:nth-child(2){transform:rotate(135deg) translateX(var(--g))}
.pfx-hitmarker-x>span:nth-child(3){transform:rotate(225deg) translateX(var(--g))}
.pfx-hitmarker-x>span:nth-child(4){transform:rotate(315deg) translateX(var(--g))}
.pfx-hitmarker-x.pfx-hitmarker-w>span{background:var(--pfx-w)}
.pfx-hitmarker-flash{position:absolute;opacity:0;background:rgba(255,255,255,.92)}
.pfx-hitmarker-flash.pfx-hitmarker-soft{background:rgba(255,255,255,.14)}
.pfx-hitmarker-wash{position:absolute;inset:0;border-radius:inherit;opacity:0;background:linear-gradient(180deg,var(--pfx-w5),var(--pfx-w2))}
.pfx-hitmarker-clip{position:absolute;overflow:hidden}
.pfx-hitmarker-line{position:absolute;top:0;bottom:0;left:0;width:100%;opacity:0;background:linear-gradient(90deg,rgba(255,255,255,0) calc(100% - var(--trail)),rgba(255,255,255,.28) calc(100% - var(--lw)),#fff calc(100% - var(--lw)))}
.pfx-hitmarker-line.pfx-hitmarker-lime{background:linear-gradient(90deg,rgba(255,255,255,0) calc(100% - var(--trail)),var(--pfx-a3) calc(100% - var(--lw)),var(--pfx-a) calc(100% - var(--lw)))}
.pfx-hitmarker-glint{position:absolute;top:0;bottom:0;left:0;width:30%;opacity:0;background:linear-gradient(90deg,rgba(255,255,255,0),var(--pfx-w5) 35%,var(--pfx-wl) 50%,var(--pfx-w5) 65%,rgba(255,255,255,0))}
.pfx-hitmarker-hair{position:absolute;left:0;right:0;opacity:0;background:#fff}
.pfx-hitmarker-spot{position:absolute;inset:0;border-radius:50%;opacity:0;background:radial-gradient(closest-side,var(--pfx-w5),var(--pfx-w2) 55%,rgba(255,255,255,0))}
${motionOk(`@keyframes pfx-hitmarker-pop{0%{opacity:0;transform:scale(1.25)}1%{opacity:1;transform:scale(1.25)}25%{transform:none}55%{opacity:1}100%{opacity:0;transform:none}}
@keyframes pfx-hitmarker-flash{0%{opacity:0}1%{opacity:1}100%{opacity:0}}
@keyframes pfx-hitmarker-sweep{0%{opacity:1;transform:translateX(-100%)}80%{opacity:1}100%{opacity:0;transform:none}}
@keyframes pfx-hitmarker-pass{0%{opacity:0;transform:translateX(-100%)}8%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translateX(var(--to,333.33%))}}
@keyframes pfx-hitmarker-draw{0%{opacity:0;transform:scaleX(0)}1%{opacity:1}45%{transform:none}70%{opacity:1}100%{opacity:0;transform:none}}
.pfx-hitmarker-a-pop{animation:pfx-hitmarker-pop var(--t,.3s) ease-out var(--d,0s) backwards}
.pfx-hitmarker-a-flash{animation:pfx-hitmarker-flash var(--t,.28s) ease-out var(--d,0s) backwards}
.pfx-hitmarker-a-sweep{animation:pfx-hitmarker-sweep var(--t,.42s) cubic-bezier(.6,0,.25,1) var(--d,0s) backwards}
.pfx-hitmarker-a-pass{animation:pfx-hitmarker-pass var(--t,.75s) cubic-bezier(.45,0,.35,1) var(--d,0s) backwards}
.pfx-hitmarker-a-draw{animation:pfx-hitmarker-draw var(--t,.9s) cubic-bezier(.3,.7,.3,1) var(--d,0s) backwards}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;
const ms = (value: number) => `${Math.round(value)}ms`;
const px1 = (value: number) => `${Math.round(value * 10) / 10}px`;

/** Where a hit flashes: its new segment, or a sliver at the edge when nothing grew. */
function segment(hit: FxHit): CSSProperties {
  const width = Math.abs(hit.to - hit.from);
  return width > 0.004
    ? { top: 0, bottom: 0, left: pct(Math.min(hit.from, hit.to)), width: pct(width) }
    : { top: 0, bottom: 0, left: `calc(${pct(hit.to)} - 5px)`, width: 10 };
}

interface Area {
  key: string;
  style: CSSProperties;
}

/** Where a panel's lines go: all of it, or only the top and bottom of a frame's band. */
function areas(ring?: number): Area[] {
  return ring
    ? [
        { key: 'top', style: { left: 0, right: 0, top: 0, height: ring } },
        { key: 'bottom', style: { left: 0, right: 0, bottom: 0, height: ring } },
      ]
    : [{ key: 'all', style: { inset: 0, borderRadius: 'inherit' } }];
}

/** A hitmarker: four short ticks in an X around an empty middle, their tips `r` px out. */
function HitX({
  x,
  y,
  r,
  gold,
  t,
  d = 0,
}: {
  x: number | string;
  y: number | string;
  r: number;
  gold?: boolean;
  t?: number;
  d?: number;
}) {
  return (
    <span
      className={`pfx-hitmarker-x ${gold ? 'pfx-hitmarker-w ' : ''}pfx-hitmarker-a-pop`}
      style={
        {
          left: x,
          top: y,
          '--g': px1(r * 0.4),
          '--l': px1(r * 0.6),
          '--b': px1(Math.max(1.5, r * 0.15)),
          '--d': ms(d),
          ...(t ? { '--t': ms(t) } : {}),
        } as Vars
      }
    >
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

/** A thin upright line with a short trail that crosses its area left to right. */
function Line({
  width,
  trail,
  lime,
  t,
  d = 0,
}: {
  width: number;
  trail: number;
  lime?: boolean;
  t: number;
  d?: number;
}) {
  return (
    <span
      className={`pfx-hitmarker-line ${lime ? 'pfx-hitmarker-lime ' : ''}pfx-hitmarker-a-sweep`}
      style={{ '--lw': `${width}px`, '--trail': `${trail}px`, '--t': ms(t), '--d': ms(d) } as Vars}
    />
  );
}

/** The flash a win ends on: a band in the win color sweeping across its area. */
function Glint({ area, t }: { area: Area; t: number }) {
  return (
    <span className="pfx-hitmarker-clip" style={area.style}>
      <span
        className="pfx-hitmarker-glint pfx-hitmarker-a-pass"
        style={{ '--t': ms(t), '--d': ms(SWEEP_AT) } as Vars}
      />
    </span>
  );
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const hero = mode === 'hero';
  const size = Math.min(1.4, Math.max(0.5, scale));
  const px = (n: number) => Math.max(1, Math.round(n * size));
  const strips = areas(ring);
  // On a webcam's frame the marks stay on the band's top edge, small enough to fit inside it.
  const reach = ring ? ring * 0.6 : 16 * size;
  const top = ring ? ring / 2 : undefined;
  const marks = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return [0, 1, 2].map((id) => ({
      id,
      x: (id + 0.5) / 3 + between(next, -0.07, 0.07),
      y: between(next, 0.3, 0.7),
    }));
  }, [seed, win]);
  return (
    <>
      {strips.map((area) => (
        <span key={area.key} className="pfx-hitmarker-clip" style={area.style}>
          <Line width={px(hero ? 3 : 2)} trail={px(hero ? 120 : 56)} t={hero ? 600 : 420} />
          {hero && <Line lime width={px(2)} trail={px(40)} t={600} d={90} />}
        </span>
      ))}
      {hero && (
        // A card's edges draw in after the line: the top from the left, the bottom from the right.
        <>
          <span
            className="pfx-hitmarker-hair pfx-hitmarker-a-draw"
            style={{ top: 0, height: px(1.2), transformOrigin: '0 50%', '--d': '150ms' } as Vars}
          />
          <span
            className="pfx-hitmarker-hair pfx-hitmarker-a-draw"
            style={
              { bottom: 0, height: px(1.2), transformOrigin: '100% 50%', '--d': '150ms' } as Vars
            }
          />
        </>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          {!ring && (
            <span
              className="pfx-hitmarker-flash pfx-hitmarker-soft pfx-hitmarker-a-flash"
              style={{ inset: 0, borderRadius: 'inherit' }}
            />
          )}
          <HitX x="50%" y={top ?? '50%'} r={reach} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          {marks.map((mark) => (
            <HitX
              key={mark.id}
              x={pct(mark.x)}
              y={top ?? pct(mark.y)}
              r={ring ? reach : reach * (1 + mark.id * 0.12)}
              gold
              t={340}
              d={mark.id * RAPID}
            />
          ))}
          {!ring && (
            <span
              className="pfx-hitmarker-wash pfx-hitmarker-a-flash"
              style={{ '--t': '650ms', '--d': ms(SWEEP_AT) } as Vars}
            />
          )}
          {strips.map((area) => (
            <Glint key={area.key} area={area} t={800} />
          ))}
        </Fragment>
      )}
    </>
  );
}

function Track({ hit, hits, win }: TrackFxProps) {
  // A poll's vote lands on the fill's edge without growing it, and there's no stage to draw the
  // hit on: it goes inside the row, small.
  const strike = hit !== null && Math.abs(hit.to - hit.from) <= 0.004;
  return (
    <>
      {hit && hits > 0 && (
        <Fragment key={`h${hits}`}>
          <span className="pfx-hitmarker-flash pfx-hitmarker-a-flash" style={segment(hit)} />
          {strike && <HitX x={pct(hit.to)} y="50%" r={12} />}
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-hitmarker-wash pfx-hitmarker-a-flash"
            style={{ '--t': '650ms', '--d': ms(SWEEP_AT) } as Vars}
          />
          <Glint area={{ key: 'all', style: { inset: 0 } }} t={750} />
        </Fragment>
      )}
    </>
  );
}

function Burst({ seed, hit, hits, win, left, right, y, height }: BurstFxProps) {
  const r = Math.min(20, Math.max(13, height * 0.34));
  const triple = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return [0.24, 0.5, 0.76].map((at, id) => ({
      id,
      x: left + (right - left) * (at + between(next, -0.05, 0.05)),
      y: y + between(next, -height / 6, height / 6),
    }));
  }, [seed, win, left, right, y, height]);
  return (
    <>
      {hit && hits > 0 && (
        <Fragment key={`h${hits}`}>
          <HitX x={left + (right - left) * hit.to} y={y} r={r} />
        </Fragment>
      )}
      {win > 0 && (
        // Three quick hits along the bar, each a little bigger; the track's sweep follows.
        <Fragment key={`w${win}`}>
          {triple.map((mark) => (
            <HitX
              key={mark.id}
              x={Math.round(mark.x * 10) / 10}
              y={Math.round(mark.y * 10) / 10}
              r={r * (1 + mark.id * 0.12)}
              gold
              t={340}
              d={mark.id * RAPID}
            />
          ))}
        </Fragment>
      )}
    </>
  );
}

function Pulse({ seed, pulse, win, enter }: PulseFxProps) {
  // Two hits off to the sides, then the last one dead center.
  const triple = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return [-1, 1, 0].map((side, id) => ({
      id,
      x: 0.5 + side * between(next, 0.12, 0.24),
      y: side ? 0.5 + between(next, -0.18, 0.18) : 0.5,
    }));
  }, [seed, win]);
  return (
    <>
      {enter && (
        // A chat line takes a tiny hit at its end.
        <HitX x="calc(100% - 8px)" y="calc(100% - 7px)" r={7} />
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <HitX x="50%" y="50%" r={16} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          {triple.map((mark) => (
            <HitX
              key={mark.id}
              x={pct(mark.x)}
              y={pct(mark.y)}
              r={15 + mark.id * 3}
              gold
              t={340}
              d={mark.id * RAPID}
            />
          ))}
          <span
            className="pfx-hitmarker-spot pfx-hitmarker-a-flash"
            style={{ '--t': '700ms', '--d': ms(2 * RAPID + 60) } as Vars}
          />
        </Fragment>
      )}
    </>
  );
}

export const hitmarker: EffectModule = {
  id: 'hitmarker',
  css,
  vars: (skin: Skin) => ({
    '--pfx-a': skin.colors.accent,
    '--pfx-a3': rgba(skin.colors.accent, 0.3),
    '--pfx-w': skin.colors.win,
    '--pfx-w2': rgba(skin.colors.win, 0.2),
    '--pfx-w5': rgba(skin.colors.win, 0.5),
    '--pfx-wl': shade(skin.win, 86),
  }),
  Panel,
  Track,
  Burst,
  Pulse,
};
