import { type Art, type Geometry, middle } from '../frame-look';
import type { Box, ShapeSpec } from '../shape';
import { anim, Chevrons, Glint, Glow, Stripes } from './shared';

// A tactical shooter's menu: a dark navy plate with big and small cut corners, a slanted red
// name tag, red wedges in the cuts, off-white strokes, ruler ticks and a striped tray.
// Drawn from scratch, no game art.

/** Big and small corner cuts, clockwise from the top left. */
const cuts = (t: number, big: number, small: number): ShapeSpec['corners'] => [
  { kind: 'chamfer', size: big * t },
  { kind: 'chamfer', size: small * t },
  { kind: 'chamfer', size: big * t },
  { kind: 'chamfer', size: small * t },
];

function shape(g: Geometry): ShapeSpec {
  const { t, piece, body, tab } = g;
  if (piece === 'badge') {
    const square = { kind: 'square', size: 0 } as const;
    const cut = { kind: 'chamfer', size: 0.9 * t } as const;
    return { corners: [cut, square, cut, square], hole: square };
  }
  if (piece === 'screen')
    return { corners: cuts(t, 2.4, 0.7), hole: { kind: 'chamfer', size: 0.6 * t } };
  const span = body.x1 - body.x0;
  const tall = body.y1 - body.y0;
  return {
    corners: cuts(t, 2.6, 0.9),
    top: [
      { kind: 'trapezoid', at: 0.2, width: span * 0.12, height: -0.35 * t },
      { kind: 'trapezoid', at: 0.5, width: tab.width, height: tab.out },
    ],
    bottom: [
      { kind: 'trapezoid', at: 0.28, width: span * 0.14, height: -0.35 * t },
      { kind: 'trapezoid', at: 0.72, width: span * 0.24, height: 0.95 * t },
    ],
    left: [{ kind: 'rect', at: 0.36, width: tall * 0.22, height: 0.5 * t }],
    right: [{ kind: 'rect', at: 0.66, width: tall * 0.16, height: 0.5 * t }],
    hole: { kind: 'chamfer', size: 0.8 * t },
  };
}

/** Maps a point drawn for the top-left corner onto corner (sx, sy) of the box. */
const cornerAt = (b: Box, sx: 1 | -1, sy: 1 | -1) => (u: number, v: number) =>
  `${sx === 1 ? b.x0 + u : b.x1 - u} ${sy === 1 ? b.y0 + v : b.y1 - v}`;

/** The off-white stroke along a big cut and the red wedge in it, for corner (sx, sy). */
function BigCorner({
  g,
  sx,
  sy,
  cut,
  arm,
}: {
  g: Geometry;
  sx: 1 | -1;
  sy: 1 | -1;
  cut: number;
  arm: number;
}) {
  const { t, look, motion, body } = g;
  const p = cornerAt(body, sx, sy);
  const gap = 0.45 * t;
  const wedge = motion ? anim('pulse', { dur: 2.4, delay: sx === 1 ? 0 : 1.2 }) : null;
  return (
    <>
      <path
        d={`M${p(0, 0)}L${p(cut - gap, 0)}L${p(0, cut - gap)}Z`}
        fill={look.accent(60)}
        className={wedge?.className}
        style={wedge?.style}
      />
      <path
        d={`M${p(0, cut + arm)}L${p(0, cut)}L${p(cut, 0)}L${p(cut + arm, 0)}`}
        fill="none"
        stroke={look.frame}
        strokeWidth={0.22 * t}
        strokeLinejoin="miter"
      />
    </>
  );
}

/** Ruler ticks leftward from x along y, every fourth one long. */
function Ticks({
  g,
  x,
  y,
  count,
  up,
}: {
  g: Geometry;
  x: number;
  y: number;
  count: number;
  up: boolean;
}) {
  const { t, look } = g;
  const dir = up ? -1 : 1;
  const d = Array.from({ length: count }, (_, k) => {
    const len = (k % 4 === 0 ? 0.55 : 0.28) * t;
    return `M${x - k * 0.42 * t} ${y}v${dir * len}`;
  }).join('');
  return <path d={d} stroke={look.frame} strokeOpacity={0.7} strokeWidth={0.07 * t} />;
}

/** Red stripes sliding through a parallelogram, clipped to it. */
function StripeBlock({
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
  const gap = 0.7 * t;
  const lean = height * 0.6;
  const box = `M${x + lean} ${y}h${width}l${-lean} ${height}h${-width}Z`;
  const slide = motion ? anim('slide', { dur: 0.9, vars: { '--fr-step': `${gap}px` } }) : null;
  return (
    <>
      <defs>
        <clipPath id={g.id(name)}>
          <path d={box} />
        </clipPath>
      </defs>
      <path d={box} fill={look.track} fillOpacity={0.9} />
      <g clipPath={`url(#${g.id(name)})`}>
        <g className={slide?.className} style={slide?.style}>
          <Stripes
            x={x - gap * 2}
            y={y}
            width={width + lean + gap * 2}
            height={height}
            color={look.accent(58)}
            gap={gap}
          />
        </g>
      </g>
    </>
  );
}

export const tactical: Art = {
  runner: (g) => ({ path: 'edge', color: g.look.accent(62), width: 0.2 * g.t, dur: 7 }),
  shape,

  draw: (g, { outline, hole }) => {
    const { t, look, body, tab, piece, motion } = g;
    const { cy } = middle(g);
    const red = look.accent(60);
    const plate = (
      <>
        <defs>
          <linearGradient id={g.id('plate')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={look.panel} stopOpacity={0.95} />
            <stop offset="1" stopColor={look.panel2} stopOpacity={0.96} />
          </linearGradient>
        </defs>
        <path d={outline} fill={`url(#${g.id('plate')})`} fillRule="evenodd" />
        <path
          d={outline}
          fill="none"
          stroke={look.frame2}
          strokeWidth={0.12 * t}
          strokeLinejoin="miter"
        />
        {hole && (
          <>
            <path d={hole} fill="none" stroke={look.panel2} strokeWidth={0.5 * t} />
            <path
              d={hole}
              fill="none"
              stroke={look.frame}
              strokeOpacity={0.4}
              strokeWidth={0.07 * t}
            />
          </>
        )}
      </>
    );

    if (piece === 'badge') {
      const lean = 0.5 * t;
      return (
        <>
          {plate}
          <path
            d={`M${body.x0 + 0.9 * t + lean} ${body.y0 + 0.35 * t}H${body.x1 - 0.35 * t}L${body.x1 - 0.35 * t - lean} ${body.y1 - 0.35 * t}H${body.x0 + 0.35 * t}Z`}
            fill={look.accent(50)}
          />
          <rect
            x={body.x1 - 1.1 * t}
            y={body.y0 + 0.7 * t}
            width={0.25 * t}
            height={body.y1 - body.y0 - 1.4 * t}
            fill={look.frame}
          />
        </>
      );
    }

    if (piece === 'screen') {
      const bar = motion ? anim('pulse', { dur: 2.6 }) : null;
      return (
        <>
          {plate}
          <BigCorner g={g} sx={1} sy={1} cut={2.4 * t} arm={9 * t} />
          <BigCorner g={g} sx={-1} sy={-1} cut={2.4 * t} arm={9 * t} />
          <g className={bar?.className} style={bar?.style}>
            <rect x={body.x0 + 0.3 * t} y={cy - 4 * t} width={0.4 * t} height={3 * t} fill={red} />
            <rect
              x={body.x0 + 0.38 * t}
              y={cy - 0.5 * t}
              width={0.24 * t}
              height={0.9 * t}
              fill={red}
            />
          </g>
          <rect
            x={body.x1 - 0.7 * t}
            y={cy + 1 * t}
            width={0.4 * t}
            height={2.6 * t}
            fill={look.frame}
          />
          <Ticks g={g} x={body.x1 - 4 * t} y={body.y1 - 0.2 * t} count={18} up />
          {motion && (
            <Glint
              id={g.id('glint')}
              x0={body.x0 + 10 * t}
              x1={body.x1 - 10 * t}
              y={body.y0 + 0.5 * t}
              height={0.28 * t}
              color={look.frame}
              dur={6}
            />
          )}
        </>
      );
    }

    const span = body.x1 - body.x0;
    const tall = body.y1 - body.y0;
    const tabL = tab.cx - tab.width / 2;
    const tabR = tab.cx + tab.width / 2;
    const tagTop = body.y0 - tab.out + 0.35 * t;
    const tagBottom = body.y0 + 0.3 * t;
    const lean = 0.7 * (tagBottom - tagTop);
    const tag = `M${tabL + 1.1 * t + lean} ${tagTop}H${tabR - 0.7 * t}L${tabR - 0.7 * t - lean} ${tagBottom}H${tabL + 1.1 * t}Z`;
    const leftBar = { y: body.y0 + tall * 0.36 - tall * 0.11, h: tall * 0.22 };
    const rightBar = { y: body.y0 + tall * 0.66 - tall * 0.08, h: tall * 0.16 };
    const dentL = body.x0 + span * 0.14;
    const redFrom = body.x0 + span * 0.26 + 0.8 * t;
    const redTo = tabL - 1.6 * t;
    const trayX = body.x0 + span * 0.72;
    const trayW = span * 0.24;
    const pulse = (delay: number) => (motion ? anim('pulse', { dur: 2.2, delay }) : null);
    const p1 = pulse(0);
    const p2 = pulse(1.1);
    const squares = [0, 1, 2].map((k) =>
      motion ? anim('chase', { dur: 1.5, delay: k * 0.5 }) : null,
    );

    return (
      <>
        {plate}
        <BigCorner g={g} sx={1} sy={1} cut={2.6 * t} arm={3 * t} />
        <BigCorner g={g} sx={-1} sy={-1} cut={2.6 * t} arm={3 * t} />

        {/* The slanted red name tag, with a white end bar and chevrons. */}
        <path d={tag} fill={look.accent(50)} />
        <path
          d={`M${tabL + 1.1 * t + lean} ${tagTop}H${tabR - 0.7 * t}`}
          stroke={look.accent(70)}
          strokeWidth={0.1 * t}
        />
        <path
          d={`M${tabR - 1.5 * t} ${tagTop + 0.25 * t}h${0.3 * t}l${-0.3 * lean} ${tagBottom - tagTop - 0.5 * t}h${-0.3 * t}Z`}
          fill={look.frame}
        />
        <Chevrons
          x={tabL + 1.9 * t + lean * 0.4}
          y={(tagTop + tagBottom) / 2}
          count={2}
          size={0.5 * t}
          color={look.panel2}
          motion={motion}
        />

        {/* Red and white bars in the side wings. */}
        <g className={p1?.className} style={p1?.style}>
          <Glow
            d={`M${body.x0 - 0.25 * t} ${leftBar.y}V${leftBar.y + leftBar.h}`}
            color={red}
            width={0.32 * t}
            core={false}
            cap="butt"
          />
        </g>
        <rect
          x={body.x0 - 0.35 * t}
          y={leftBar.y + leftBar.h + 0.5 * t}
          width={0.2 * t}
          height={1 * t}
          fill={red}
        />
        <g className={p2?.className} style={p2?.style}>
          <rect
            x={body.x1 + 0.1 * t}
            y={rightBar.y}
            width={0.3 * t}
            height={rightBar.h}
            fill={look.frame}
          />
        </g>

        {/* Top band: white and red squares by the small corner, a scan light along the band. */}
        {[0, 1, 2].map((k) => (
          <rect
            key={k}
            x={body.x1 - 2.2 * t - k * 0.6 * t - 0.3 * t}
            y={body.y0 + 0.36 * t}
            width={0.3 * t}
            height={0.3 * t}
            fill={k === 1 ? red : look.frame}
            className={squares[k]?.className}
            style={squares[k]?.style}
          />
        ))}
        <path
          d={`M${body.x0 + 3.4 * t} ${body.y0 + 0.5 * t}H${dentL - 0.6 * t}`}
          stroke={look.frame}
          strokeOpacity={0.55}
          strokeWidth={0.1 * t}
        />
        {redTo > redFrom && (
          <>
            <g className={p1?.className} style={p1?.style}>
              <rect
                x={redFrom}
                y={body.y0 + 0.32 * t}
                width={redTo - redFrom}
                height={0.36 * t}
                fill={red}
              />
            </g>
            <rect
              x={redTo + 0.4 * t}
              y={body.y0 + 0.32 * t}
              width={0.36 * t}
              height={0.36 * t}
              fill={red}
            />
            {motion && (
              <Glint
                id={g.id('glint')}
                x0={redFrom}
                x1={redTo}
                y={body.y0 + 0.5 * t}
                height={0.3 * t}
                color={look.frame}
                dur={4.5}
              />
            )}
          </>
        )}

        {/* Bottom band: ruler ticks, and the striped tray. */}
        <Ticks
          g={g}
          x={body.x0 + span * 0.5}
          y={body.y1 - 0.15 * t}
          count={Math.min(28, Math.floor((span * 0.24) / (0.42 * t)))}
          up
        />
        <Chevrons
          x={body.x0 + 3.2 * t}
          y={body.y1 - 0.5 * t}
          count={3}
          size={0.42 * t}
          color={red}
          motion={motion}
        />
        <StripeBlock
          g={g}
          name="stripes"
          x={trayX - trayW / 2 + 0.6 * t}
          y={body.y1 + 0.05 * t}
          width={trayW - 2.4 * t}
          height={0.6 * t}
        />
        <path
          d={`M${trayX - trayW / 2 + 1.2 * t} ${body.y1 - 0.35 * t}H${trayX + trayW / 2 - 1.2 * t}`}
          stroke={red}
          strokeWidth={0.12 * t}
        />
      </>
    );
  },
};
