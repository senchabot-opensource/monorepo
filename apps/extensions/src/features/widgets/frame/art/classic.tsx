import { type Art, type Geometry, middle } from '../frame-look';
import { inset, outlinePath, type ShapeSpec } from '../shape';
import { anim, Chevrons, Glint, Glow, Leds, Mirror } from './shared';

// The site's own look, like a neon streaming kit: a dark plate with cut corners, a label tab,
// a tray and side wings, glowing bars that breathe and a light that sweeps along the top.

function shape(g: Geometry): ShapeSpec {
  const { t, piece, body, tab } = g;
  if (piece === 'badge')
    return { corners: { kind: 'chamfer', size: 0.8 * t }, hole: { kind: 'square', size: 0 } };
  if (piece === 'screen') {
    return {
      corners: { kind: 'chamfer', size: 1.6 * t },
      hole: { kind: 'chamfer', size: 0.8 * t },
    };
  }
  const span = body.x1 - body.x0;
  const tall = body.y1 - body.y0;
  return {
    corners: { kind: 'chamfer', size: 1.8 * t },
    top: [{ kind: 'trapezoid', at: 0.5, width: tab.width, height: tab.out }],
    bottom: [{ kind: 'trapezoid', at: 0.5, width: span * 0.3, height: 0.9 * t }],
    left: [{ kind: 'trapezoid', at: 0.5, width: tall * 0.34, height: 0.75 * t }],
    right: [{ kind: 'trapezoid', at: 0.5, width: tall * 0.34, height: 0.75 * t }],
    hole: { kind: 'chamfer', size: 0.9 * t },
  };
}

export const classic: Art = {
  runner: (g) => ({ path: 'edge', color: g.look.accent(68), width: 0.22 * g.t }),
  shape,

  draw: (g, { outline, hole }) => {
    const { t, look, body, tab, piece, motion } = g;
    const { cx, cy } = middle(g);
    const glow = look.accent(62);
    const plate = (
      <>
        <defs>
          <linearGradient id={g.id('plate')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={look.panel} stopOpacity={0.95} />
            <stop offset="1" stopColor={look.panel2} stopOpacity={0.95} />
          </linearGradient>
          <linearGradient id={g.id('rim')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={look.frame} />
            <stop offset="1" stopColor={look.frame2} />
          </linearGradient>
        </defs>
        {piece !== 'badge' && (
          <path
            d={outlinePath(inset(body, -0.45 * t), shape(g))}
            fill="none"
            stroke={look.frame}
            strokeOpacity={0.45}
            strokeWidth={0.07 * t}
          />
        )}
        <path d={outline} fill={`url(#${g.id('plate')})`} fillRule="evenodd" />
        {hole && (
          <path
            d={hole}
            fill="none"
            stroke={look.panel2}
            strokeOpacity={0.9}
            strokeWidth={0.7 * t}
          />
        )}
        <path
          d={outline}
          fill="none"
          stroke={`url(#${g.id('rim')})`}
          strokeWidth={0.14 * t}
          strokeOpacity={0.9}
        />
        {hole && (
          <path
            d={hole}
            fill="none"
            stroke={look.frame}
            strokeOpacity={0.35}
            strokeWidth={0.1 * t}
          />
        )}
      </>
    );

    if (piece === 'badge') {
      return (
        <>
          {plate}
          <Glow
            d={`M${body.x0 + 1.2 * t} ${body.y1 - 0.25 * t}H${body.x1 - 1.2 * t}`}
            color={glow}
            width={0.18 * t}
          />
        </>
      );
    }

    // A bright corner bracket, drawn at the top left.
    const bracket = (x: number, y: number, arm: number) =>
      `M${x} ${y + arm}V${y + 0.9 * t}L${x + 0.9 * t} ${y}H${x + arm}`;

    if (piece === 'screen') {
      const pulse = motion ? anim('pulse', { dur: 3.2 }) : null;
      return (
        <>
          {plate}
          <g className={pulse?.className} style={pulse?.style}>
            <Mirror cx={cx}>
              <Glow
                d={bracket(body.x0 + 0.5 * t, body.y0 + 0.5 * t, 6 * t)}
                color={glow}
                width={0.22 * t}
              />
              <g transform={`translate(0 ${2 * cy}) scale(1 -1)`}>
                <Glow
                  d={bracket(body.x0 + 0.5 * t, body.y0 + 0.5 * t, 6 * t)}
                  color={glow}
                  width={0.22 * t}
                />
              </g>
            </Mirror>
          </g>
          {motion && (
            <Glint
              id={g.id('glint')}
              x0={body.x0 + 8 * t}
              x1={body.x1 - 8 * t}
              y={body.y0 + 0.5 * t}
              height={0.3 * t}
            />
          )}
        </>
      );
    }

    const bandY = body.y0 + 0.5 * t;
    const tabLeft = tab.cx - tab.width / 2;
    const barFrom = body.x0 + 2.6 * t;
    const barTo = tabLeft - 1.2 * t;
    const trayY = body.y1 + 0.35 * t;
    const trayHalf = (body.x1 - body.x0) * 0.1;
    const wing = (body.y1 - body.y0) * 0.1;
    const breathe = (delay: number) => (motion ? anim('pulse', { dur: 3, delay }) : null);
    const b1 = breathe(0);
    const b2 = breathe(1);
    const b3 = breathe(2);

    return (
      <>
        {plate}
        <Mirror cx={cx}>
          {barTo > barFrom && (
            <g className={b1?.className} style={b1?.style}>
              <Glow
                d={`M${barFrom} ${bandY}H${barFrom + (barTo - barFrom) * 0.55}`}
                color={glow}
                width={0.38 * t}
              />
            </g>
          )}
          <Glow
            d={`M${body.x0 + 0.1 * t} ${body.y0 + 4 * t}V${body.y0 + 1.9 * t}L${body.x0 + 1.9 * t} ${body.y0 + 0.1 * t}H${body.x0 + 4 * t}`}
            color={glow}
            width={0.2 * t}
            core={false}
          />
          <Glow
            d={`M${tabLeft + 1.6 * t} ${body.y0 - tab.out + 0.1 * t}H${tab.cx - 0.8 * t}`}
            color={glow}
            width={0.22 * t}
          />
          <g className={b2?.className} style={b2?.style}>
            <Glow
              d={`M${body.x0 - 0.35 * t} ${cy - wing}V${cy + wing}`}
              color={glow}
              width={0.3 * t}
            />
          </g>
          <Leds
            x={body.x0 + 2.4 * t}
            y={body.y1 - 0.5 * t}
            count={3}
            gap={0.7 * t}
            r={0.14 * t}
            color={glow}
            motion={motion}
          />
          <Chevrons
            x={tabLeft + 0.9 * t}
            y={body.y0 - 0.25 * t}
            count={2}
            size={0.45 * t}
            color={glow}
            motion={motion}
          />
        </Mirror>
        <g className={b3?.className} style={b3?.style}>
          <Glow d={`M${cx - trayHalf} ${trayY}H${cx + trayHalf}`} color={glow} width={0.3 * t} />
        </g>
        {motion && barTo > barFrom && (
          <>
            <Glint id={g.id('glint-l')} x0={barFrom} x1={barTo} y={bandY} height={0.32 * t} />
            <Glint
              id={g.id('glint-r')}
              x0={2 * cx - barTo}
              x1={2 * cx - barFrom}
              y={bandY}
              height={0.32 * t}
              delay={2.5}
            />
          </>
        )}
      </>
    );
  },
};
