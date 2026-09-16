import { type Art, type Geometry, middle } from '../frame-look';
import { holePath, inset, type ShapeSpec } from '../shape';
import { anim, Glint, Glow, Metal, Mirror, Sheen } from './shared';

// Navy plates with gold filigree and glowing gems, after arcane-tech fantasy UI: cut corners
// with gold plates, a gem crowning the label tab, rune rings on the side wings and a pointed
// tray. Drawn from scratch, no game art.

/** A closed polygon from points in t units, offset by (ox, oy); `fy` flips it vertically. */
const poly = (
  points: readonly (readonly [number, number])[],
  t: number,
  ox: number,
  oy: number,
  fy = 1,
) => `M${points.map(([x, y]) => `${ox + x * t} ${oy + fy * y * t}`).join('L')}Z`;

function shape(g: Geometry): ShapeSpec {
  const { t, piece, body, tab } = g;
  if (piece === 'badge') {
    return { corners: { kind: 'chamfer', size: 0.8 * t }, hole: { kind: 'square', size: 0 } };
  }
  if (piece === 'screen') {
    return {
      corners: { kind: 'chamfer', size: 1.6 * t },
      hole: { kind: 'chamfer', size: 0.8 * t },
    };
  }
  const span = body.x1 - body.x0;
  const tall = body.y1 - body.y0;
  const wing = { kind: 'trapezoid', at: 0.5, width: tall * 0.3, height: 0.6 * t } as const;
  const dent = (0.5 * tab.width) / span + 0.06;
  return {
    corners: { kind: 'chamfer', size: 2 * t },
    top: [
      { kind: 'trapezoid', at: 0.5, width: tab.width, height: tab.out },
      // Small dents either side of the tab, like cut filigree, while there's room for them.
      ...(dent < 0.36
        ? ([
            { kind: 'trapezoid', at: 0.5 - dent, width: 2.2 * t, height: -0.3 * t },
            { kind: 'trapezoid', at: 0.5 + dent, width: 2.2 * t, height: -0.3 * t },
          ] as const)
        : []),
    ],
    bottom: [{ kind: 'arch', at: 0.5, width: span * 0.26, height: 1.05 * t }],
    left: [wing],
    right: [wing],
    hole: { kind: 'chamfer', size: 0.8 * t },
  };
}

/** A teal gem: a diamond of half-size r around (x, y), with a halo that breathes. */
function Gem({
  g,
  x,
  y,
  r,
  delay = 0,
}: {
  g: Geometry;
  x: number;
  y: number;
  r: number;
  delay?: number;
}) {
  const { look, motion } = g;
  const d = `M${x} ${y - r}L${x + r * 0.78} ${y}L${x} ${y + r}L${x - r * 0.78} ${y}Z`;
  const pulse = motion ? anim('pulse', { dur: 2.6, delay }) : null;
  return (
    <>
      <g className={pulse?.className} style={pulse?.style}>
        <circle cx={x} cy={y} r={r * 2.3} fill={`url(#${g.id('halo')})`} />
      </g>
      <path d={d} fill={`url(#${g.id('gem')})`} stroke={look.frame} strokeWidth={r * 0.22} />
      <path
        d={`M${x} ${y - r * 0.68}L${x - r * 0.42} ${y}L${x - r * 0.08} ${y - r * 0.06}Z`}
        fill="#fff"
        fillOpacity={0.65}
      />
    </>
  );
}

/** A dashed rune ring around (x, y) that turns slowly. */
function RuneRing({ g, x, y, r }: { g: Geometry; x: number; y: number; r: number }) {
  const { look, motion, t } = g;
  const spin = motion ? anim('spin', { dur: 26 }) : null;
  return (
    <g className={spin?.className} style={spin?.style}>
      <circle
        cx={x}
        cy={y}
        r={r}
        fill="none"
        stroke={look.accent(62)}
        strokeOpacity={0.75}
        strokeWidth={0.07 * t}
        strokeDasharray={`${0.5 * t} ${0.22 * t} ${0.12 * t} ${0.22 * t}`}
      />
      <circle
        cx={x}
        cy={y}
        r={r * 0.72}
        fill="none"
        stroke={look.frame}
        strokeOpacity={0.55}
        strokeWidth={0.04 * t}
        strokeDasharray={`${0.9 * t} ${0.35 * t}`}
      />
    </g>
  );
}

function Defs({ g }: { g: Geometry }) {
  const { look } = g;
  return (
    <defs>
      <Sheen id={g.id('sheen')} />
      <linearGradient id={g.id('navy')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={look.panel} stopOpacity={0.96} />
        <stop offset="1" stopColor={look.panel2} stopOpacity={0.96} />
      </linearGradient>
      <linearGradient id={g.id('gold')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={look.frame} />
        <stop offset="0.55" stopColor={look.frame2} />
        <stop offset="1" stopColor={look.frame} />
      </linearGradient>
      <radialGradient id={g.id('gem')} cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor={look.accent(90)} />
        <stop offset="0.45" stopColor={look.accent(55)} />
        <stop offset="1" stopColor={look.accent(20)} />
      </radialGradient>
      <radialGradient id={g.id('halo')}>
        <stop offset="0" stopColor={look.accent(65)} stopOpacity={0.6} />
        <stop offset="1" stopColor={look.accent(65)} stopOpacity={0} />
      </radialGradient>
    </defs>
  );
}

/**
 * A gold V bracket over a cut corner at (x, y), tapering along both edges, with a gem on the
 * diagonal. `fy` = -1 for a bottom corner; `k` scales it (the screen frame's band is thinner).
 */
function CornerPlate({
  g,
  x,
  y,
  fy,
  k = 1,
}: {
  g: Geometry;
  x: number;
  y: number;
  fy: 1 | -1;
  k?: number;
}) {
  const { look } = g;
  const t = g.t * k;
  const sheen = g.id('sheen');
  const pts = (list: readonly (readonly [number, number])[]) => poly(list, t, x, y, fy);
  const plate = pts([
    [-0.3, 5.4],
    [-0.3, 1.9],
    [1.9, -0.3],
    [5.4, -0.3],
    [4.3, 0.5],
    [2.3, 0.5],
    [0.5, 2.3],
    [0.5, 4.3],
  ]);
  const groove = `M${x + 0.1 * t} ${y + fy * 4.3 * t}V${y + fy * 2.05 * t}L${x + 2.05 * t} ${y + fy * 0.1 * t}H${x + 4.3 * t}`;
  return (
    <>
      <path d={plate} fill="#000" fillOpacity={0.5} transform={`translate(0 ${0.14 * t})`} />
      <Metal d={plate} color={look.frame} sheen={sheen} />
      <path
        d={groove}
        fill="none"
        stroke={look.frame2}
        strokeWidth={0.1 * t}
        strokeLinejoin="round"
      />
      <Gem g={g} x={x + 1.05 * t} y={y + fy * 1.05 * t} r={0.5 * t} delay={fy === 1 ? 0 : 1.3} />
    </>
  );
}

export const gilded: Art = {
  // Hextech light along the teal line around the picture.
  runner: (g) => ({ path: 'hole', color: g.look.accent(70), width: 0.18 * g.t, dur: 10 }),
  shape,

  draw: (g, { outline, hole }) => {
    const { t, look, body, tab, piece, motion } = g;
    const { cx, cy } = middle(g);
    const rims = (
      <>
        <Defs g={g} />
        <path d={outline} fill={`url(#${g.id('navy')})`} fillRule="evenodd" />
        <path d={outline} fill="none" stroke="#000" strokeOpacity={0.6} strokeWidth={0.34 * t} />
        <path d={outline} fill="none" stroke={`url(#${g.id('gold')})`} strokeWidth={0.2 * t} />
      </>
    );

    if (piece === 'badge') {
      return (
        <>
          {rims}
          <Mirror cx={cx}>
            <Gem g={g} x={body.x0 + 1.2 * t} y={(body.y0 + body.y1) / 2} r={0.36 * t} />
          </Mirror>
        </>
      );
    }

    const step = holePath(inset(g.hole, 0.38 * t), { kind: 'chamfer', size: 0.5 * t });
    const innerRims = (
      <>
        <path d={hole + step} fill={look.panel2} fillOpacity={0.92} fillRule="evenodd" />
        <path d={step} fill="none" stroke={look.frame} strokeOpacity={0.8} strokeWidth={0.06 * t} />
        <path
          d={holePath(inset(g.hole, -0.32 * t), { kind: 'chamfer', size: 1.1 * t })}
          fill="none"
          stroke={look.frame}
          strokeOpacity={0.35}
          strokeWidth={0.05 * t}
        />
        <path d={hole} fill="none" stroke={look.frame} strokeWidth={0.1 * t} />
        <Glow
          d={holePath(inset(g.hole, 0.5 * t), { kind: 'chamfer', size: 0.4 * t })}
          color={look.accent(60)}
          width={0.05 * t}
          core={false}
        />
      </>
    );

    if (piece === 'screen') {
      return (
        <>
          {rims}
          {innerRims}
          <Mirror cx={cx}>
            <CornerPlate g={g} x={body.x0 + 0.5 * t} y={body.y0 + 0.5 * t} fy={1} k={1.8} />
            <CornerPlate g={g} x={body.x0 + 0.5 * t} y={body.y1 - 0.5 * t} fy={-1} k={1.8} />
          </Mirror>
          {motion && (
            <Glint
              id={g.id('glint')}
              x0={body.x0 + 8 * t}
              x1={body.x1 - 8 * t}
              y={body.y0 + 0.1 * t}
              height={0.25 * t}
              color={look.win(85)}
              dur={7}
            />
          )}
        </>
      );
    }

    const tabLeft = tab.cx - tab.width / 2;
    const tabTop = body.y0 - tab.out;
    const bandY = body.y0 + 0.5 * t;
    const trayTip = body.y1 + 1.05 * t;
    const wingX = body.x0 - 0.2 * t;
    const sheen = g.id('sheen');
    const diamond = (x: number, y: number, k: number) =>
      `M${x} ${y - k}L${x + k} ${y}L${x} ${y + k}L${x - k} ${y}Z`;

    return (
      <>
        {rims}
        {innerRims}
        {/* The tab's gold crown: a pointed arch rising from its top edge, with the big gem. */}
        <Metal
          d={`M${tab.cx - 1.8 * t} ${tabTop + 0.05 * t}L${tab.cx} ${tabTop - 0.3 * t}L${tab.cx + 1.8 * t} ${tabTop + 0.05 * t}L${tab.cx} ${tabTop + 0.35 * t}Z`}
          color={look.frame}
          sheen={sheen}
        />
        <Gem g={g} x={tab.cx} y={tabTop + 0.02 * t} r={0.34 * t} />
        <Mirror cx={cx}>
          <path
            d={`M${tabLeft + 0.9 * t} ${tabTop + 0.35 * t}H${tab.cx - 2.1 * t}`}
            stroke={look.frame}
            strokeOpacity={0.7}
            strokeWidth={0.06 * t}
          />
          <CornerPlate g={g} x={body.x0} y={body.y0} fy={1} />
          <CornerPlate g={g} x={body.x0} y={body.y1} fy={-1} />
          {/* Wing boss: rune rings around a gem. */}
          <RuneRing g={g} x={wingX} y={cy} r={1.05 * t} />
          <Gem g={g} x={wingX} y={cy} r={0.4 * t} delay={0.7} />
          <path d={diamond(body.x0 + 5.2 * t, bandY, 0.14 * t)} fill={look.frame} />
          <path d={diamond(body.x0 + 6 * t, bandY, 0.1 * t)} fill={look.frame} fillOpacity={0.7} />
        </Mirror>
        {/* Tray: a gold chevron and a gem at its point. */}
        <path
          d={`M${cx - (body.x1 - body.x0) * 0.1} ${body.y1 + 0.2 * t}L${cx} ${trayTip - 0.35 * t}L${cx + (body.x1 - body.x0) * 0.1} ${body.y1 + 0.2 * t}`}
          fill="none"
          stroke={look.frame}
          strokeOpacity={0.8}
          strokeWidth={0.08 * t}
        />
        <Gem g={g} x={cx} y={body.y1 + 0.5 * t} r={0.3 * t} delay={1.6} />
        {motion && (
          <>
            <Glint
              id={g.id('glint-l')}
              x0={body.x0 + 3.8 * t}
              x1={tabLeft - 0.4 * t}
              y={body.y0 + 0.1 * t}
              height={0.24 * t}
              color={look.win(88)}
              dur={6}
            />
            <Glint
              id={g.id('glint-r')}
              x0={2 * cx - tabLeft + 0.4 * t}
              x1={body.x1 - 3.8 * t}
              y={body.y1 - 0.1 * t}
              height={0.24 * t}
              color={look.win(88)}
              dur={6}
              delay={3}
            />
          </>
        )}
      </>
    );
  },
};
