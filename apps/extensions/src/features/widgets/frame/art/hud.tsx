import { type Art, type Geometry, middle } from '../frame-look';
import { type Box, inset, outlinePath, type ShapeSpec } from '../shape';
import { anim, Glint, Leds, Stripes } from './shared';

// A tactical shooter's HUD: a dark slate plate with notched corners, bright brackets, an amber
// top line with a scan light, segment bars by the label, crosshair marks, a sliding hazard
// stripe block and a tray of rounds. Drawn from scratch, no game art.

function shape(g: Geometry): ShapeSpec {
  const { t, piece, body, tab } = g;
  if (piece === 'badge')
    return { corners: { kind: 'notch', size: 0.5 * t }, hole: { kind: 'square', size: 0 } };
  if (piece === 'screen')
    return { corners: { kind: 'notch', size: 1 * t }, hole: { kind: 'chamfer', size: 0.5 * t } };
  const span = body.x1 - body.x0;
  const tall = body.y1 - body.y0;
  return {
    corners: { kind: 'notch', size: 1.2 * t },
    top: [
      { kind: 'trapezoid', at: 0.18, width: span * 0.1, height: -0.3 * t },
      { kind: 'trapezoid', at: 0.5, width: tab.width, height: tab.out },
      { kind: 'trapezoid', at: 0.82, width: span * 0.1, height: -0.3 * t },
    ],
    bottom: [{ kind: 'trapezoid', at: 0.5, width: span * 0.34, height: 0.9 * t }],
    left: [{ kind: 'trapezoid', at: 0.5, width: tall * 0.22, height: 0.45 * t }],
    right: [{ kind: 'trapezoid', at: 0.5, width: tall * 0.22, height: 0.45 * t }],
    hole: { kind: 'chamfer', size: 0.5 * t },
  };
}

/** A bright L bracket around a notched corner of the box; (sx, sy) picks the corner. */
function bracket(b: Box, sx: 1 | -1, sy: 1 | -1, notch: number, arm: number) {
  const p = (u: number, v: number) =>
    `${sx === 1 ? b.x0 + u : b.x1 - u} ${sy === 1 ? b.y0 + v : b.y1 - v}`;
  return `M${p(0, notch + arm)}L${p(0, notch)}L${p(notch, notch)}L${p(notch, 0)}L${p(notch + arm, 0)}`;
}

const plus = (x: number, y: number, size: number) =>
  `M${x - size} ${y}H${x + size}M${x} ${y - size}V${y + size}`;

/** Amber and dark stripes sliding through a slanted block, clipped to it. */
function Hazard({
  g,
  x,
  y,
  width,
  height,
  name,
}: {
  g: Geometry;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
}) {
  const { t, look, motion } = g;
  const gap = 0.6 * t;
  const lean = height * 0.6;
  const box = `M${x + lean} ${y}h${width}l${-lean} ${height}h${-width}Z`;
  const slide = motion ? anim('slide', { dur: 1.4, vars: { '--fr-step': `${gap}px` } }) : null;
  return (
    <>
      <defs>
        <clipPath id={g.id(name)}>
          <path d={box} />
        </clipPath>
      </defs>
      <path d={box} fill={look.track} />
      <g clipPath={`url(#${g.id(name)})`}>
        <g className={slide?.className} style={slide?.style}>
          <Stripes
            x={x - gap * 2}
            y={y}
            width={width + lean + gap * 2}
            height={height}
            color={look.accent(55)}
            gap={gap}
          />
        </g>
      </g>
      <path d={box} fill="none" stroke={look.frame2} strokeWidth={0.06 * t} />
    </>
  );
}

/** Segment bars from x, `lit` of them amber; the last lit one blinks. */
function Segments({
  g,
  x,
  y,
  count,
  lit,
  dir,
}: {
  g: Geometry;
  x: number;
  y: number;
  count: number;
  lit: number;
  dir: 1 | -1;
}) {
  const { t, look, motion } = g;
  const w = 0.2 * t;
  const h = 0.6 * t;
  return (
    <>
      {Array.from({ length: count }, (_, k) => {
        const on = k < lit;
        const blink = motion && k === lit - 1 ? anim('pulse', { dur: 1.1 }) : null;
        return (
          <rect
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed row, never reordered.
            key={k}
            x={x + dir * k * 0.38 * t - (dir === -1 ? w : 0)}
            y={y - h / 2}
            width={w}
            height={h}
            fill={on ? look.accent(58) : look.frame2}
            className={blink?.className}
            style={blink?.style}
          />
        );
      })}
    </>
  );
}

export const hud: Art = {
  runner: (g) => ({ path: 'edge', color: g.look.accent(62), width: 0.18 * g.t, dur: 8 }),
  shape,

  draw: (g, { outline, hole }) => {
    const { t, look, body, tab, piece, motion } = g;
    const { cx, cy } = middle(g);
    const amber = look.accent(58);
    const plate = (
      <>
        <defs>
          <linearGradient id={g.id('plate')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={look.panel} stopOpacity={0.94} />
            <stop offset="1" stopColor={look.panel2} stopOpacity={0.95} />
          </linearGradient>
          <linearGradient id={g.id('topline')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={amber} />
            <stop offset="0.7" stopColor={amber} stopOpacity={0.5} />
            <stop offset="1" stopColor={amber} stopOpacity={0} />
          </linearGradient>
        </defs>
        {piece !== 'badge' && (
          <path
            d={outlinePath(inset(body, -0.35 * t), shape(g))}
            fill="none"
            stroke={look.frame2}
            strokeOpacity={0.7}
            strokeWidth={0.06 * t}
          />
        )}
        <path d={outline} fill={`url(#${g.id('plate')})`} fillRule="evenodd" />
        <path d={outline} fill="none" stroke={look.frame2} strokeWidth={0.12 * t} />
        {hole && (
          <>
            <path
              d={hole}
              fill="none"
              stroke={look.track}
              strokeOpacity={0.8}
              strokeWidth={0.45 * t}
            />
            <path
              d={hole}
              fill="none"
              stroke={look.frame}
              strokeOpacity={0.25}
              strokeWidth={0.06 * t}
            />
          </>
        )}
      </>
    );

    if (piece === 'badge') {
      return (
        <>
          {plate}
          <path
            d={`M${body.x0 + 0.9 * t} ${body.y0 + 0.28 * t}H${body.x1 - 0.9 * t}`}
            stroke={amber}
            strokeWidth={0.16 * t}
          />
          <Segments g={g} x={body.x0 + 0.7 * t} y={body.y1 - 0.55 * t} count={3} lit={2} dir={1} />
        </>
      );
    }

    const notch = piece === 'screen' ? 1 * t : 1.2 * t;
    const brackets = (
      [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
      ] as const
    )
      .map(([sx, sy]) => bracket(body, sx, sy, notch, (piece === 'screen' ? 6 : 2.4) * t))
      .join('');
    const cross = motion ? anim('pulse', { dur: 2.4 }) : null;
    const crosses = (
      <path
        d={[
          plus(body.x0 + 2.2 * t, body.y0 + 2.2 * t, 0.3 * t),
          plus(body.x1 - 2.2 * t, body.y0 + 2.2 * t, 0.3 * t),
          plus(body.x0 + 2.2 * t, body.y1 - 2.2 * t, 0.3 * t),
          plus(body.x1 - 2.2 * t, body.y1 - 2.2 * t, 0.3 * t),
        ].join('')}
        stroke={look.frame}
        strokeOpacity={0.8}
        strokeWidth={0.08 * t}
        className={cross?.className}
        style={cross?.style}
      />
    );
    // Three ticks across each side's middle.
    const ticks = [-0.6 * t, 0, 0.6 * t]
      .map((d) => {
        const len = (d === 0 ? 0.7 : 0.4) * t;
        return `M${body.x0 + 0.5 * t - len / 2} ${cy + d}h${len}M${body.x1 - 0.5 * t - len / 2} ${cy + d}h${len}`;
      })
      .join('');
    const bracketLines = (
      <path
        d={brackets}
        fill="none"
        stroke={look.frame}
        strokeWidth={0.2 * t}
        strokeLinejoin="miter"
      />
    );

    if (piece === 'screen') {
      const lineTo = body.x0 + (body.x1 - body.x0) * 0.4;
      return (
        <>
          {plate}
          {bracketLines}
          <rect
            x={body.x0 + 4 * t}
            y={body.y0 + 0.36 * t}
            width={lineTo - body.x0 - 4 * t}
            height={0.28 * t}
            fill={`url(#${g.id('topline')})`}
          />
          {motion && (
            <Glint
              id={g.id('scan')}
              x0={body.x0 + 4 * t}
              x1={lineTo}
              y={body.y0 + 0.5 * t}
              height={0.24 * t}
              dur={5.5}
            />
          )}
          <path d={ticks} stroke={look.frame} strokeOpacity={0.6} strokeWidth={0.07 * t} />
          <Hazard
            g={g}
            name="hazard"
            x={body.x1 - 9 * t}
            y={body.y1 - 0.8 * t}
            width={4.5 * t}
            height={0.6 * t}
          />
          <Leds
            x={body.x0 + 4 * t}
            y={body.y1 - 0.5 * t}
            count={6}
            gap={0.55 * t}
            r={0.1 * t}
            color={look.frame}
            motion={motion}
            dur={2.4}
          />
        </>
      );
    }

    const span = body.x1 - body.x0;
    const tabL = tab.cx - tab.width / 2;
    const tabR = tab.cx + tab.width / 2;
    const labelY = body.y0 + (t - tab.out) / 2;
    const lineFrom = body.x0 + span * 0.23 + 0.4 * t;
    const trayHalf = span * 0.17;
    const rounds = Math.max(6, Math.min(14, Math.floor((trayHalf * 2 - 3 * t) / (0.55 * t))));
    const wing = (body.y1 - body.y0) * 0.07;

    return (
      <>
        {plate}
        {bracketLines}
        {crosses}

        {/* Tab: an amber cap line and segment bars on both sides of the label. */}
        <path
          d={`M${tabL + tab.out + 0.3 * t} ${body.y0 - tab.out + 0.25 * t}H${tabR - tab.out - 0.3 * t}`}
          stroke={amber}
          strokeWidth={0.18 * t}
        />
        <Segments g={g} x={tabL + tab.out + 0.4 * t} y={labelY} count={3} lit={3} dir={1} />
        <Segments g={g} x={tabR - tab.out - 0.4 * t} y={labelY} count={3} lit={2} dir={-1} />

        {/* Top band: an amber line fading toward the tab, with a scan light. */}
        {tabL - 0.8 * t > lineFrom && (
          <>
            <rect
              x={lineFrom}
              y={body.y0 + 0.34 * t}
              width={tabL - 0.8 * t - lineFrom}
              height={0.3 * t}
              fill={`url(#${g.id('topline')})`}
            />
            {motion && (
              <Glint
                id={g.id('scan')}
                x0={lineFrom}
                x1={tabL - 0.8 * t}
                y={body.y0 + 0.5 * t}
                height={0.26 * t}
                dur={4.8}
              />
            )}
          </>
        )}
        <Leds
          x={2 * cx - lineFrom}
          y={body.y0 + 0.5 * t}
          count={4}
          gap={0.55 * t}
          r={0.1 * t}
          color={amber}
          motion={motion}
          dur={2}
          vertical={false}
        />

        {/* Sides: ticks at the middle, amber bars in the wings. */}
        <path d={ticks} stroke={look.frame} strokeOpacity={0.55} strokeWidth={0.07 * t} />
        <rect x={body.x0 - 0.3 * t} y={cy - wing} width={0.2 * t} height={2 * wing} fill={amber} />
        <rect x={body.x1 + 0.1 * t} y={cy - wing} width={0.2 * t} height={2 * wing} fill={amber} />

        {/* Bottom: a tray of rounds, the last ones spent, and a sliding hazard block. */}
        {Array.from({ length: rounds }, (_, k) => {
          const spent = k >= rounds - 3;
          const ripple =
            motion && !spent ? anim('chase', { dur: 3, delay: (k * 3) / rounds }) : null;
          return (
            <rect
              // biome-ignore lint/suspicious/noArrayIndexKey: a fixed row, never reordered.
              key={k}
              x={cx - trayHalf + 1.5 * t + k * 0.55 * t}
              y={body.y1 + 0.05 * t}
              width={0.28 * t}
              height={0.6 * t}
              rx={0.1 * t}
              fill={spent ? look.frame2 : amber}
              className={ripple?.className}
              style={ripple?.style}
            />
          );
        })}
        <Hazard
          g={g}
          name="hazard"
          x={body.x1 - 4.2 * t - Math.min(6 * t, span * 0.14)}
          y={body.y1 - 0.8 * t}
          width={Math.min(6 * t, span * 0.14) - 0.6 * t}
          height={0.6 * t}
        />
      </>
    );
  },
};
