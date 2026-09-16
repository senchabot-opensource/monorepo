import type { ReactNode } from 'react';
import { type Art, type Geometry, middle } from '../frame-look';
import { type Box, holePath, inset, type ShapeSpec } from '../shape';
import { anim, Glint, Glow, Metal, Sheen } from './shared';

// Red lacquer and gold, after old East Asian palace woodwork: a temple eave over a nameboard,
// notched corners with cloud-head caps, a key-fret band, cloud-scroll wings, a coin in the tray,
// swaying tassels, lanterns and a plum branch shedding petals. Drawn from scratch, no game art.

/** A square key-fret (回) motif of half-size u, centered on (0, 0). */
const fret = (u: number) =>
  `M${-u} ${u}V${-u}H${u}V${u}H${-u * 0.35}V${-u * 0.35}H${u * 0.35}V${u * 0.3}`;

/** A cloud head (ruyi) of radius r around (0, 0), its point down. */
const cloudHead = (r: number) =>
  `M0 ${0.55 * r}C${-0.25 * r} ${0.35 * r} ${-0.62 * r} ${0.25 * r} ${-0.6 * r} ${-0.08 * r}C${-0.58 * r} ${-0.35 * r} ${-0.3 * r} ${-0.42 * r} ${-0.2 * r} ${-0.25 * r}C${-0.22 * r} ${-0.55 * r} ${0.22 * r} ${-0.55 * r} ${0.2 * r} ${-0.25 * r}C${0.3 * r} ${-0.42 * r} ${0.58 * r} ${-0.35 * r} ${0.6 * r} ${-0.08 * r}C${0.62 * r} ${0.25 * r} ${0.25 * r} ${0.35 * r} 0 ${0.55 * r}Z`;

const cloudCurls = (r: number) =>
  `M${-0.3 * r} ${0.05 * r}c0 ${-0.16 * r} ${0.22 * r} ${-0.16 * r} ${0.22 * r} 0c0 ${0.1 * r} ${-0.13 * r} ${0.1 * r} ${-0.13 * r} ${0.02 * r}M${0.3 * r} ${0.05 * r}c0 ${-0.16 * r} ${-0.22 * r} ${-0.16 * r} ${-0.22 * r} 0c0 ${0.1 * r} ${0.13 * r} ${0.1 * r} ${0.13 * r} ${0.02 * r}M0 ${-0.28 * r}V${0.32 * r}`;

/** Two cloud scrolls lying along a band at height y, starting at x0 and running right. */
const scroll = (t: number, x0: number, y: number) =>
  `M${x0} ${y}c${0.4 * t} ${-0.6 * t} ${1.2 * t} ${-0.6 * t} ${1.3 * t} 0c${0.06 * t} ${0.4 * t} ${-0.46 * t} ${0.46 * t} ${-0.5 * t} ${0.1 * t}M${x0 + 1.3 * t} ${y}c${0.35 * t} ${0.45 * t} ${1.0 * t} ${0.4 * t} ${1.25 * t} ${-0.05 * t}c${0.12 * t} ${-0.3 * t} ${-0.2 * t} ${-0.42 * t} ${-0.34 * t} ${-0.16 * t}M${x0 + 2.55 * t} ${y - 0.05 * t}c${0.5 * t} ${-0.3 * t} ${1.1 * t} 0 ${1.6 * t} 0`;

/**
 * The eave above the top edge at y, centered on cx: the same outline as the shape's `roof`
 * feature, so it can be painted apart from the band.
 */
function roof(cx: number, y: number, width: number, h: number) {
  const a = cx - width / 2;
  const b = cx + width / 2;
  const p = (x: number, up: number) => `${x} ${y - up}`;
  const flare = width * 0.08;
  return `M${p(a, 0)}Q${p(a + width * 0.02, h * 0.1)} ${p(a - flare, h * 0.45)}Q${p(a + width * 0.14, h * 0.5)} ${p(a + width * 0.24, h)}L${p(b - width * 0.24, h)}Q${p(b - width * 0.14, h * 0.5)} ${p(b + flare, h * 0.45)}Q${p(b - width * 0.02, h * 0.1)} ${p(b, 0)}Z`;
}

/** Draws `children` (made for the body's top-left corner) at all four corners of the body. */
function BodyCorners({ body, children }: { body: Box; children: ReactNode }) {
  const sx = body.x0 + body.x1;
  const sy = body.y0 + body.y1;
  return (
    <>
      <g>{children}</g>
      <g transform={`translate(${sx} 0) scale(-1 1)`}>{children}</g>
      <g transform={`translate(0 ${sy}) scale(1 -1)`}>{children}</g>
      <g transform={`translate(${sx} ${sy}) scale(-1 -1)`}>{children}</g>
    </>
  );
}

type Span = [number, number];

/** Points along the middle of the band, about `gap` apart, leaving out the spans given. */
function fretPoints(
  g: Geometry,
  gap: number,
  skipTop: Span[],
  skipSide: Span[],
  skipBottom: Span[],
) {
  const { body, t } = g;
  const points: { x: number; y: number; vertical: boolean }[] = [];
  const run = (from: number, to: number, fixed: number, vertical: boolean, spans: Span[]) => {
    const n = Math.max(1, Math.round((to - from) / gap));
    for (let k = 0; k <= n; k++) {
      const v = from + ((to - from) * k) / n;
      if (spans.some(([a, b]) => v >= a && v <= b)) continue;
      points.push(vertical ? { x: fixed, y: v, vertical } : { x: v, y: fixed, vertical });
    }
  };
  const corner = 3.4 * t;
  run(body.x0 + corner, body.x1 - corner, body.y0 + t / 2, false, skipTop);
  run(body.x0 + corner, body.x1 - corner, body.y1 - t / 2, false, skipBottom);
  run(body.y0 + corner, body.y1 - corner, body.x0 + t / 2, true, skipSide);
  run(body.y0 + corner, body.y1 - corner, body.x1 - t / 2, true, skipSide);
  return points;
}

function Blossom({ x, y, r, g }: { x: number; y: number; r: number; g: Geometry }) {
  const { look } = g;
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <circle
          key={angle}
          cx={0}
          cy={-0.55 * r}
          r={0.55 * r}
          transform={`rotate(${angle})`}
          fill={look.accent(86)}
          stroke={look.accent(55)}
          strokeWidth={0.08 * r}
        />
      ))}
      <circle r={0.3 * r} fill={look.accent(50)} />
      <circle r={0.16 * r} fill={look.win(62)} />
    </g>
  );
}

/** A plum branch in flower growing up and right from (x, y), or up and left, dropping petals. */
function PlumBranch({ g, x, y, flipX }: { g: Geometry; x: number; y: number; flipX: boolean }) {
  const t = g.t * 1.6;
  const branch = `M0 0C${1.5 * t} ${-0.6 * t} ${2.5 * t} ${-0.4 * t} ${4.4 * t} ${-1.7 * t}M${2.1 * t} ${-0.55 * t}C${2.6 * t} ${-1.3 * t} ${2.9 * t} ${-1.8 * t} ${3.1 * t} ${-2.7 * t}M${3.3 * t} ${-1.05 * t}L${4.8 * t} ${-0.7 * t}`;
  const petals = [
    { x: 3.1, y: -2.4, dx: 1.2, dy: 2.0, delay: 0 },
    { x: 4.4, y: -1.4, dx: 1.0, dy: 1.3, delay: 2.6 },
    { x: 2.6, y: -1.2, dx: 1.5, dy: 1.0, delay: 5.1 },
  ];
  return (
    <g transform={`translate(${x} ${y})${flipX ? ' scale(-1 1)' : ''}`}>
      <path
        d={branch}
        fill="none"
        stroke="#000"
        strokeOpacity={0.45}
        strokeWidth={0.42 * t}
        strokeLinecap="round"
      />
      <path d={branch} fill="none" stroke="#3b1d12" strokeWidth={0.26 * t} strokeLinecap="round" />
      <Blossom g={g} x={1.35 * t} y={-0.5 * t} r={0.46 * t} />
      <Blossom g={g} x={3.1 * t} y={-2.7 * t} r={0.4 * t} />
      <Blossom g={g} x={4.4 * t} y={-1.7 * t} r={0.5 * t} />
      <Blossom g={g} x={2.62 * t} y={-1.45 * t} r={0.32 * t} />
      <circle cx={4.8 * t} cy={-0.7 * t} r={0.17 * t} fill={g.look.accent(60)} />
      <circle cx={3.55 * t} cy={-0.98 * t} r={0.14 * t} fill={g.look.accent(60)} />
      {/* Falling petals only exist while moving: a frozen one would hang in the air. */}
      {g.motion &&
        petals.map((p) => {
          const a = anim('fall', {
            dur: 7.5,
            delay: p.delay,
            vars: { '--fr-dx': `${p.dx * t}px`, '--fr-dy': `${p.dy * t}px` },
          });
          return (
            <ellipse
              key={p.delay}
              cx={p.x * t}
              cy={p.y * t}
              rx={0.16 * t}
              ry={0.1 * t}
              fill={g.look.accent(84)}
              className={a.className}
              style={{ ...a.style, opacity: 0 }}
            />
          );
        })}
    </g>
  );
}

/** A tassel hanging from (x, y), `length` long, swaying from its top. */
function Tassel({
  g,
  x,
  y,
  length,
  delay = 0,
  sway = true,
}: {
  g: Geometry;
  x: number;
  y: number;
  length: number;
  delay?: number;
  sway?: boolean;
}) {
  const { t, look } = g;
  const k = 0.26 * t;
  const knot = y + length * 0.3;
  const cap = knot + 2 * k;
  const end = y + length;
  const a = g.motion && sway ? anim('sway', { dur: 3.4, delay }) : null;
  return (
    <g className={a?.className} style={a?.style}>
      <path d={`M${x} ${y}V${cap}`} stroke={look.frame} strokeWidth={0.08 * t} />
      <path
        d={`M${x} ${knot}l${k} ${k}l${-k} ${k}l${-k} ${-k}Z`}
        fill={look.accent(45)}
        stroke={look.frame}
        strokeWidth={0.07 * t}
      />
      <Metal
        d={`M${x - 0.14 * t} ${cap}h${0.28 * t}v${0.26 * t}h${-0.28 * t}Z`}
        color={look.frame}
        sheen={g.id('sheen')}
      />
      <path
        d={`M${x - 0.14 * t} ${cap + 0.26 * t}L${x - 0.28 * t} ${end}H${x + 0.28 * t}L${x + 0.14 * t} ${cap + 0.26 * t}Z`}
        fill={look.accent(42)}
      />
      <path
        d={`M${x - 0.1 * t} ${cap + 0.3 * t}L${x - 0.19 * t} ${end}M${x} ${cap + 0.3 * t}V${end}M${x + 0.1 * t} ${cap + 0.3 * t}L${x + 0.19 * t} ${end}`}
        stroke="#000"
        strokeOpacity={0.3}
        strokeWidth={0.05 * t}
      />
    </g>
  );
}

/** A paper lantern hanging from (x, y) that sways and flickers. */
function Lantern({ g, x, y, delay = 0 }: { g: Geometry; x: number; y: number; delay?: number }) {
  const { t, look, motion } = g;
  const sheen = g.id('sheen');
  const top = y + 0.9 * t;
  const rx = 0.95 * t;
  const ry = 1.15 * t;
  const cy = top + 0.2 * t + ry;
  const bottom = cy + ry;
  const sway = motion ? anim('sway', { dur: 4.2, delay }) : null;
  const flicker = motion ? anim('flicker', { dur: 1.7, delay }) : null;
  return (
    <g className={sway?.className} style={sway?.style}>
      <path d={`M${x} ${y}V${top}`} stroke={look.frame} strokeWidth={0.08 * t} />
      <ellipse
        cx={x}
        cy={cy}
        rx={rx * 1.9}
        ry={ry * 1.6}
        fill={look.win(60)}
        fillOpacity={0.14}
        className={flicker?.className}
        style={flicker?.style}
      />
      <ellipse cx={x} cy={cy} rx={rx} ry={ry} fill={look.accent(46)} />
      <ellipse
        cx={x}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={`url(#${g.id('glow')})`}
        className={flicker?.className}
        style={flicker?.style}
      />
      <path
        d={[-0.55, 0, 0.55]
          .map(
            (f) =>
              `M${x} ${cy - ry}C${x + f * 1.9 * rx} ${cy - ry * 0.6} ${x + f * 1.9 * rx} ${cy + ry * 0.6} ${x} ${cy + ry}`,
          )
          .join('')}
        fill="none"
        stroke={look.frame2}
        strokeOpacity={0.8}
        strokeWidth={0.07 * t}
      />
      <Metal
        d={`M${x - 0.55 * t} ${top}h${1.1 * t}v${0.4 * t}h${-1.1 * t}Z`}
        color={look.frame}
        sheen={sheen}
      />
      <Metal
        d={`M${x - 0.45 * t} ${bottom - 0.2 * t}h${0.9 * t}v${0.36 * t}h${-0.9 * t}Z`}
        color={look.frame}
        sheen={sheen}
      />
      <Tassel g={g} x={x} y={bottom + 0.16 * t} length={1.6 * t} sway={false} />
    </g>
  );
}

/** A gold square cap with a cloud head, centered on (cx, cy), its point into the frame. */
function CornerCap({ g, cx, cy, size }: { g: Geometry; cx: number; cy: number; size: number }) {
  const { t, look } = g;
  const sheen = g.id('sheen');
  const x = cx - size / 2;
  const y = cy - size / 2;
  const inner = 0.12 * size;
  return (
    <>
      <path
        d={`M${x + 0.12 * t} ${y + 0.2 * t}h${size}v${size}h${-size}Z`}
        fill="#000"
        fillOpacity={0.45}
      />
      <Metal d={`M${x} ${y}h${size}v${size}h${-size}Z`} color={look.frame} sheen={sheen} />
      <path
        d={`M${x + inner} ${y + inner}h${size - 2 * inner}v${size - 2 * inner}h${-(size - 2 * inner)}Z`}
        fill={look.frame2}
        stroke="#000"
        strokeOpacity={0.4}
        strokeWidth={0.06 * t}
      />
      <g transform={`translate(${cx} ${cy}) rotate(-45)`}>
        <Metal d={cloudHead(size * 0.64)} color={look.frame} sheen={sheen} />
        <path
          d={cloudCurls(size * 0.64)}
          fill="none"
          stroke={look.frame2}
          strokeWidth={0.07 * t}
          strokeLinecap="round"
        />
      </g>
    </>
  );
}

/** Gold cloud scrolls along a corner's top and left bands, drawn for the top-left corner. */
function CornerScrolls({ g, from }: { g: Geometry; from: number }) {
  const { t, body, look } = g;
  const d = scroll(t, body.x0 + from, body.y0 + t / 2);
  const lines = (
    <>
      <path
        d={d}
        fill="none"
        stroke="#000"
        strokeOpacity={0.5}
        strokeWidth={0.28 * t}
        strokeLinecap="round"
      />
      <path d={d} fill="none" stroke={look.frame} strokeWidth={0.15 * t} strokeLinecap="round" />
    </>
  );
  return (
    <>
      {lines}
      {/* The same scrolls mirrored over the corner's diagonal, down the left band. */}
      <g transform={`matrix(0 1 1 0 ${body.x0 - body.y0} ${body.y0 - body.x0})`}>{lines}</g>
    </>
  );
}

function shape(g: Geometry): ShapeSpec {
  const { t, piece, body, tab } = g;
  if (piece === 'badge') {
    return {
      corners: { kind: 'notch', size: 0.55 * t },
      top: [{ kind: 'roof', at: 0.5, width: (body.x1 - body.x0) * 0.8, height: 1.1 * t }],
      hole: { kind: 'square', size: 0 },
    };
  }
  if (piece === 'screen') {
    return { corners: { kind: 'notch', size: 1.1 * t }, hole: { kind: 'notch', size: 0.5 * t } };
  }
  const span = body.x1 - body.x0;
  const tall = body.y1 - body.y0;
  return {
    corners: { kind: 'notch', size: 1.2 * t },
    top: [{ kind: 'roof', at: 0.5, width: tab.width, height: tab.out }],
    bottom: [{ kind: 'trapezoid', at: 0.5, width: Math.min(span * 0.22, 7 * t), height: 0.95 * t }],
    left: [{ kind: 'round', at: 0.5, width: Math.min(tall * 0.34, 8 * t), height: 0.8 * t }],
    right: [{ kind: 'round', at: 0.5, width: Math.min(tall * 0.34, 8 * t), height: 0.8 * t }],
    hole: { kind: 'notch', size: 0.5 * t },
  };
}

export const lacquer: Art = {
  // Gold light running along the lacquer's rim.
  runner: (g) => ({ path: 'edge', color: g.look.win(62), width: 0.24 * g.t, dur: 11 }),
  shape,

  // On the nameboard under the eave, in gold.
  labelShift: (g) => g.tab.out / 2,
  labelColor: (g) => g.look.win(82),

  draw: (g, { outline, hole }) => {
    const { t, look, body, tab, piece, motion } = g;
    const { cx, cy } = middle(g);
    const sheen = g.id('sheen');
    const gold = look.frame;

    const defs = (
      <defs>
        <Sheen id={sheen} />
        <linearGradient id={g.id('lacquer')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={look.accent(40)} />
          <stop offset="0.55" stopColor={look.accent(30)} />
          <stop offset="1" stopColor={look.frame2} />
        </linearGradient>
        <linearGradient id={g.id('board')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={look.panel} />
          <stop offset="1" stopColor={look.panel2} />
        </linearGradient>
        <radialGradient id={g.id('glow')} cx="0.4" cy="0.4" r="0.7">
          <stop offset="0" stopColor={look.win(80)} stopOpacity={0.8} />
          <stop offset="0.5" stopColor={look.win(60)} stopOpacity={0.2} />
          <stop offset="1" stopColor="#000" stopOpacity={0.35} />
        </radialGradient>
      </defs>
    );

    const plate = (
      <>
        <path
          d={outline}
          fill="#000"
          fillOpacity={0.35}
          fillRule="evenodd"
          transform={`translate(${0.1 * t} ${0.22 * t})`}
        />
        <path d={outline} fill={`url(#${g.id('lacquer')})`} fillRule="evenodd" />
        <path d={outline} fill="none" stroke={gold} strokeWidth={0.16 * t} strokeLinejoin="round" />
      </>
    );

    const glint = (id: string, x0: number, x1: number, y: number, delay: number) =>
      motion && x1 - x0 > 3 * t ? (
        <Glint
          id={g.id(id)}
          x0={x0}
          x1={x1}
          y={y}
          height={0.24 * t}
          color={look.win(90)}
          dur={6}
          delay={delay}
        />
      ) : null;

    if (piece === 'badge') {
      const width = body.x1 - body.x0;
      const pearl = motion ? anim('pulse', { dur: 2.6 }) : null;
      return (
        <>
          {defs}
          {plate}
          <path
            d={holePath(inset(body, 0.3 * t), { kind: 'notch', size: 0.3 * t })}
            fill="none"
            stroke={gold}
            strokeOpacity={0.65}
            strokeWidth={0.08 * t}
          />
          <Metal
            d={`M${cx - 0.2 * width} ${body.y0 - 1.2 * t}h${0.4 * width}v${0.22 * t}h${-0.4 * width}Z`}
            color={gold}
            sheen={sheen}
          />
          <g className={pearl?.className} style={pearl?.style}>
            <circle
              cx={cx}
              cy={body.y0 - 1.35 * t}
              r={0.55 * t}
              fill={look.win(65)}
              fillOpacity={0.25}
            />
          </g>
          <circle
            cx={cx}
            cy={body.y0 - 1.35 * t}
            r={0.26 * t}
            fill={look.win(62)}
            stroke={look.frame2}
            strokeWidth={0.05 * t}
          />
        </>
      );
    }

    const frets = (top: Span[], side: Span[], bottom: Span[]) =>
      fretPoints(g, 1.4 * t, top, side, bottom).map((p) => (
        <path
          key={`${p.x},${p.y}`}
          d={fret(0.24 * t)}
          transform={`translate(${p.x} ${p.y})${p.vertical ? ' rotate(90)' : ''}`}
          fill="none"
          stroke={gold}
          strokeOpacity={0.55}
          strokeWidth={0.075 * t}
        />
      ));

    const innerLines = (
      <>
        <path
          d={holePath(inset(body, 0.24 * t), { kind: 'notch', size: 1 * t })}
          fill="none"
          stroke={gold}
          strokeOpacity={0.4}
          strokeWidth={0.06 * t}
        />
        <path d={hole} fill="none" stroke={gold} strokeWidth={0.12 * t} />
        <path
          d={holePath(inset(body, 1.12 * t), { kind: 'notch', size: 0.4 * t })}
          fill="none"
          stroke="#000"
          strokeOpacity={0.4}
          strokeWidth={0.2 * t}
        />
      </>
    );

    if (piece === 'screen') {
      return (
        <>
          {defs}
          {plate}
          {frets([], [], [[cx - 6 * t, cx + 6 * t]])}
          {innerLines}
          {glint('glint-top', body.x0 + 8 * t, cx - 2 * t, body.y0 + 0.5 * t, 0)}
          {glint('glint-bottom', cx + 7 * t, body.x1 - 8 * t, body.y1 - 0.5 * t, 3)}
          <BodyCorners body={body}>
            <CornerScrolls g={g} from={1.8 * t} />
            <CornerCap g={g} cx={body.x0 + 0.75 * t} cy={body.y0 + 0.75 * t} size={1.8 * t} />
          </BodyCorners>
          <Lantern g={g} x={body.x0 + 5.5 * t} y={body.y0 + t} />
          <Lantern g={g} x={body.x1 - 5.5 * t} y={body.y0 + t} delay={1.3} />
        </>
      );
    }

    // The eave's tips and ridge, from the same numbers the roof feature uses.
    const W = tab.width;
    const top = body.y0 - tab.out;
    const tipY = body.y0 - tab.out * 0.45;
    const tipX = W / 2 + W * 0.08;
    const ridgeHalf = W / 2 - W * 0.24;
    const boardHalf = Math.max(2 * t, W / 2 - 1.7 * t);
    const wingHalf = Math.min((body.y1 - body.y0) * 0.17, 4 * t);
    const trayY = body.y1 + 0.3 * t;
    const pearl = motion ? anim('pulse', { dur: 2.6 }) : null;
    const coin = motion ? anim('pulse', { dur: 3.2, delay: 1 }) : null;
    const gem = motion ? anim('pulse', { dur: 2.8, delay: 0.5 }) : null;
    const board = `M${cx - boardHalf} ${body.y0 - 0.3 * t}h${2 * boardHalf}v${1.6 * t}h${-2 * boardHalf}Z`;
    const trayHalf = Math.min((body.x1 - body.x0) * 0.11, 3.5 * t);

    return (
      <>
        {defs}
        {plate}
        {frets(
          [[cx - W / 2 - 1.2 * t, cx + W / 2 + 1.2 * t]],
          [[cy - wingHalf - 1.4 * t, cy + wingHalf + 1.4 * t]],
          [[cx - trayHalf - 1.4 * t, cx + trayHalf + 1.4 * t]],
        )}
        {innerLines}
        {glint('glint-l', body.x0 + 4 * t, cx - W / 2 - 1.5 * t, body.y0 + 0.5 * t, 0)}
        {glint('glint-r', cx + W / 2 + 1.5 * t, body.x1 - 4 * t, body.y0 + 0.5 * t, 3)}

        {/* The roof in darker lacquer with gold tiles, a ridge beam and a pearl on it. */}
        <path d={roof(cx, body.y0, W, tab.out)} fill={look.frame2} fillOpacity={0.85} />
        <path d={roof(cx, body.y0, W, tab.out)} fill={`url(#${sheen})`} fillOpacity={0.5} />
        <path
          d={[-0.8, -0.55, -0.3, -0.05, 0.2, 0.45, 0.7, 0.95]
            .map((f) => f - 0.075)
            .map(
              (f) =>
                `M${cx + f * ridgeHalf} ${top + 0.25 * t}L${cx + f * (W / 2 + 0.2 * t)} ${body.y0 - 0.05 * t}`,
            )
            .join('')}
          stroke={gold}
          strokeOpacity={0.45}
          strokeWidth={0.08 * t}
        />
        <path d={roof(cx, body.y0, W, tab.out)} fill="none" stroke={gold} strokeWidth={0.14 * t} />
        <Metal
          d={`M${cx - ridgeHalf - 0.2 * t} ${top - 0.1 * t}h${2 * ridgeHalf + 0.4 * t}v${0.34 * t}h${-(2 * ridgeHalf + 0.4 * t)}Z`}
          color={gold}
          sheen={sheen}
        />
        {[-1, 1].map((side) => (
          <path
            key={side}
            d={`M${cx + side * (ridgeHalf + 0.15 * t)} ${top + 0.08 * t}c${side * 0.35 * t} 0 ${side * 0.5 * t} ${-0.2 * t} ${side * 0.32 * t} ${-0.34 * t}c${-side * 0.15 * t} ${-0.08 * t} ${-side * 0.28 * t} ${0.05 * t} ${-side * 0.16 * t} ${0.14 * t}`}
            fill="none"
            stroke={gold}
            strokeWidth={0.12 * t}
            strokeLinecap="round"
          />
        ))}
        {[-1, 1].map((side) => (
          <circle key={side} cx={cx + side * tipX} cy={tipY} r={0.2 * t} fill={gold} />
        ))}
        <g className={pearl?.className} style={pearl?.style}>
          <circle cx={cx} cy={top + 0.07 * t} r={0.75 * t} fill={look.win(65)} fillOpacity={0.3} />
        </g>
        <circle
          cx={cx}
          cy={top + 0.07 * t}
          r={0.32 * t}
          fill={look.win(62)}
          stroke={look.frame2}
          strokeWidth={0.07 * t}
        />

        {/* The nameboard under the eave. */}
        <path d={board} fill="#000" fillOpacity={0.4} transform={`translate(0 ${0.18 * t})`} />
        <path d={board} fill={`url(#${g.id('board')})`} stroke={gold} strokeWidth={0.12 * t} />
        <path
          d={`M${cx - boardHalf + 0.25 * t} ${body.y0 - 0.05 * t}h${2 * boardHalf - 0.5 * t}v${1.1 * t}h${-(2 * boardHalf - 0.5 * t)}Z`}
          fill="none"
          stroke={gold}
          strokeOpacity={0.45}
          strokeWidth={0.05 * t}
        />
        {[-1, 1].map((side) => (
          <circle
            key={side}
            cx={cx + side * boardHalf}
            cy={body.y0 + 0.5 * t}
            r={0.22 * t}
            fill={gold}
            stroke={look.frame2}
            strokeWidth={0.05 * t}
          />
        ))}
        <Tassel g={g} x={cx - tipX} y={tipY + 0.15 * t} length={3.2 * t} />
        <Tassel g={g} x={cx + tipX} y={tipY + 0.15 * t} length={3.2 * t} delay={0.9} />

        {/* Cloud-scroll wings, each holding a red gem. */}
        {[
          { x: body.x0, dir: -1 },
          { x: body.x1, dir: 1 },
        ].map(({ x, dir }) => (
          <g key={dir}>
            <path
              d={`M${x + dir * 0.45 * t} ${cy - wingHalf}V${cy - 1.4 * t}M${x + dir * 0.45 * t} ${cy + 1.4 * t}V${cy + wingHalf}`}
              stroke={gold}
              strokeWidth={0.14 * t}
              strokeLinecap="round"
            />
            <g transform={`translate(${x + dir * 0.15 * t} ${cy}) rotate(${-dir * 90})`}>
              <Metal d={cloudHead(1.9 * t)} color={gold} sheen={sheen} />
              <path
                d={cloudCurls(1.9 * t)}
                fill="none"
                stroke={look.frame2}
                strokeWidth={0.08 * t}
                strokeLinecap="round"
              />
            </g>
            <g className={gem?.className} style={gem?.style}>
              <circle
                cx={x + dir * 0.1 * t}
                cy={cy}
                r={0.55 * t}
                fill={look.accent(55)}
                fillOpacity={0.35}
              />
            </g>
            <circle
              cx={x + dir * 0.1 * t}
              cy={cy}
              r={0.26 * t}
              fill={look.accent(50)}
              stroke={gold}
              strokeWidth={0.06 * t}
            />
          </g>
        ))}

        {/* A square-holed gold coin in the tray, on a glowing gold line. */}
        <g className={coin?.className} style={coin?.style}>
          <Glow
            d={`M${cx - trayHalf} ${trayY}H${cx + trayHalf}`}
            color={look.win(62)}
            width={0.14 * t}
            core={false}
          />
        </g>
        <circle cx={cx} cy={trayY} r={0.64 * t} fill={gold} />
        <circle cx={cx} cy={trayY} r={0.64 * t} fill={`url(#${sheen})`} />
        <circle
          cx={cx}
          cy={trayY}
          r={0.47 * t}
          fill="none"
          stroke={look.frame2}
          strokeOpacity={0.6}
          strokeWidth={0.05 * t}
        />
        <path
          d={`M${cx - 0.2 * t} ${trayY - 0.2 * t}h${0.4 * t}v${0.4 * t}h${-0.4 * t}Z`}
          fill={look.frame2}
        />

        <BodyCorners body={body}>
          <CornerScrolls g={g} from={2.3 * t} />
          <CornerCap g={g} cx={body.x0 + 1.1 * t} cy={body.y0 + 1.1 * t} size={2.1 * t} />
        </BodyCorners>

        {/* Chat's messages sit bottom left, so its branch grows from the other corner. */}
        {piece === 'chat' ? (
          <PlumBranch g={g} x={body.x1 - 1.6 * t} y={body.y1 - 1.3 * t} flipX />
        ) : (
          <PlumBranch g={g} x={body.x0 + 1.6 * t} y={body.y1 - 1.3 * t} flipX={false} />
        )}
      </>
    );
  },
};
