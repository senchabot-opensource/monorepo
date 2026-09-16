import { type Art, type Geometry, middle } from '../frame-look';
import { holePath, inset, type ShapeSpec } from '../shape';
import { anim, Glow, Metal, Mirror, Sheen } from './shared';

// Dark forged iron with bronze trim and ember light, after grim battle-arena UI: spiked plates,
// jagged corner armor with ember gems, horns sweeping from the label tab, a glowing seam that
// smoulders and sparks rising from the bottom corners. Drawn from scratch, no game art.

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
    return { corners: { kind: 'chamfer', size: 0.9 * t }, hole: { kind: 'square', size: 0 } };
  }
  if (piece === 'screen') {
    return { corners: { kind: 'chamfer', size: 2 * t }, hole: { kind: 'chamfer', size: 1 * t } };
  }
  const span = body.x1 - body.x0;
  const tall = body.y1 - body.y0;
  const side = (0.5 * tab.width) / span + 0.07;
  const jag = {
    kind: 'spikes',
    at: 0.5,
    width: Math.min(tall * 0.24, 5 * t),
    height: 0.42 * t,
  } as const;
  return {
    corners: { kind: 'chamfer', size: 2.4 * t },
    top: [
      { kind: 'trapezoid', at: 0.5, width: tab.width, height: tab.out },
      ...(side < 0.34
        ? ([
            { kind: 'spikes', at: 0.5 - side, width: 3.4 * t, height: 0.42 * t },
            { kind: 'spikes', at: 0.5 + side, width: 3.4 * t, height: 0.42 * t },
          ] as const)
        : []),
    ],
    bottom: [{ kind: 'spikes', at: 0.5, width: Math.min(span * 0.28, 9 * t), height: 0.55 * t }],
    left: [jag],
    right: [jag],
    hole: { kind: 'chamfer', size: 1 * t },
  };
}

function Defs({ g }: { g: Geometry }) {
  const { look } = g;
  return (
    <defs>
      <Sheen id={g.id('sheen')} />
      <linearGradient id={g.id('iron')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={look.frame2} />
        <stop offset="0.45" stopColor={look.panel} />
        <stop offset="1" stopColor={look.panel2} />
      </linearGradient>
      <radialGradient id={g.id('ember')} cx="0.45" cy="0.4" r="0.7">
        <stop offset="0" stopColor={look.win(85)} />
        <stop offset="0.35" stopColor={look.accent(58)} />
        <stop offset="1" stopColor={look.accent(22)} />
      </radialGradient>
      <radialGradient id={g.id('halo')}>
        <stop offset="0" stopColor={look.accent(55)} stopOpacity={0.65} />
        <stop offset="1" stopColor={look.accent(45)} stopOpacity={0} />
      </radialGradient>
      <linearGradient id={g.id('horn')} x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor={look.frame} />
        <stop offset="1" stopColor={look.text} />
      </linearGradient>
    </defs>
  );
}

function Bolt({ g, x, y, r }: { g: Geometry; x: number; y: number; r: number }) {
  const hex = [0, 60, 120, 180, 240, 300]
    .map((a) => `${x + r * Math.cos((a * Math.PI) / 180)} ${y + r * Math.sin((a * Math.PI) / 180)}`)
    .join('L');
  return (
    <>
      <path d={`M${hex}Z`} fill="#000" fillOpacity={0.6} transform={`translate(0 ${r * 0.35})`} />
      <Metal d={`M${hex}Z`} color={g.look.frame} sheen={g.id('sheen')} />
      <circle cx={x} cy={y} r={r * 0.3} fill="#000" fillOpacity={0.45} />
    </>
  );
}

/** A glowing ember diamond of half-size r at (x, y), its halo breathing. */
function Ember({
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
  const pulse = g.motion ? anim('pulse', { dur: 2.2, delay }) : null;
  return (
    <>
      <g className={pulse?.className} style={pulse?.style}>
        <circle cx={x} cy={y} r={r * 2.4} fill={`url(#${g.id('halo')})`} />
      </g>
      <path
        d={`M${x} ${y - r}L${x + r * 0.75} ${y}L${x} ${y + r}L${x - r * 0.75} ${y}Z`}
        fill={`url(#${g.id('ember')})`}
        stroke={g.look.frame}
        strokeWidth={r * 0.2}
      />
      <path
        d={`M${x} ${y - r * 0.6}L${x - r * 0.35} ${y}L${x} ${y - r * 0.1}Z`}
        fill="#fff"
        fillOpacity={0.55}
      />
    </>
  );
}

/** Jagged corner armor at (x, y): an iron plate with a bronze rim, a spike, bolts and an ember. */
function CornerArmor({
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
  const p = (list: readonly (readonly [number, number])[]) => poly(list, t, x, y, fy);
  const plate = p([
    [-0.45, 4.6],
    [-0.45, 2],
    [2, -0.45],
    [4.6, -0.45],
    [4, 0.2],
    [3.1, 0.35],
    [2.4, 0.9],
    [1.7, 1.7],
    [0.9, 2.4],
    [0.35, 3.1],
    [0.2, 4],
  ]);
  const spike = p([
    [1.5, 1.95],
    [3.1, 3.1],
    [1.95, 1.5],
  ]);
  return (
    <>
      <path
        d={spike}
        fill="#000"
        fillOpacity={0.5}
        transform={`translate(${0.1 * t} ${0.12 * t})`}
      />
      <Metal d={spike} color={look.frame2} sheen={sheen} />
      <path d={spike} fill="none" stroke={look.frame} strokeOpacity={0.7} strokeWidth={0.06 * t} />
      <path d={plate} fill="#000" fillOpacity={0.55} transform={`translate(0 ${0.16 * t})`} />
      <Metal d={plate} color={look.frame2} sheen={sheen} />
      <path
        d={plate}
        fill="none"
        stroke={look.frame}
        strokeWidth={0.1 * t}
        strokeLinejoin="round"
      />
      <Bolt g={g} x={x + 2.9 * t} y={y + fy * 0.05 * t} r={0.17 * t} />
      <Bolt g={g} x={x + 0.05 * t} y={y + fy * 2.9 * t} r={0.17 * t} />
      <Ember g={g} x={x + 0.85 * t} y={y + fy * 0.85 * t} r={0.5 * t} delay={fy === 1 ? 0 : 1.1} />
    </>
  );
}

/** A horn rooted at (x, y), sweeping out along `dir` and curling up to its tip. */
function Horn({ g, x, y, dir }: { g: Geometry; x: number; y: number; dir: 1 | -1 }) {
  const { t } = g;
  const s = dir;
  const top = Math.max(-y + 0.15 * t, -1.7 * t);
  const d = `M${x} ${y + 0.1 * t}C${x + s * 1.6 * t} ${y + 0.3 * t} ${x + s * 2.9 * t} ${y - 0.1 * t} ${x + s * 3.4 * t} ${y + top}C${x + s * 2.5 * t} ${y - 0.75 * t} ${x + s * 1.5 * t} ${y - 0.95 * t} ${x} ${y - 0.85 * t}Z`;
  return (
    <>
      <path d={d} fill="#000" fillOpacity={0.5} transform={`translate(0 ${0.12 * t})`} />
      <path d={d} fill={`url(#${g.id('horn')})`} />
      <path d={d} fill="none" stroke="#000" strokeOpacity={0.45} strokeWidth={0.05 * t} />
      {[0.35, 0.6].map((f) => (
        <path
          key={f}
          d={`M${x + s * f * 2.2 * t} ${y + 0.08 * t}L${x + s * (f * 2.2 + 0.12) * t} ${y - 0.62 * t}`}
          stroke="#000"
          strokeOpacity={0.3}
          strokeWidth={0.05 * t}
        />
      ))}
    </>
  );
}

// Sparks rising from a bottom corner: t units in and up, radius, and a start offset in seconds.
const SPARKS = [
  [1.6, 1.2, 0.2, 0],
  [2.6, 1.8, 0.15, 0.9],
  [1.2, 2.4, 0.12, 1.7],
  [3.3, 1.1, 0.11, 2.3],
  [2.1, 3.1, 0.1, 0.5],
] as const;

function Sparks({ g, x, y, dir }: { g: Geometry; x: number; y: number; dir: 1 | -1 }) {
  const { t, look, motion } = g;
  return (
    <>
      {SPARKS.map(([dx, dy, r, delay]) => {
        const rise = motion
          ? anim('rise', { dur: 2.6, delay, vars: { '--fr-rise': `${-3.2 * t}px` } })
          : null;
        const cx = x + dir * dx * t;
        const cy = y - dy * t;
        return (
          <g key={`${dx}${dy}`} className={rise?.className} style={rise?.style}>
            <circle cx={cx} cy={cy} r={r * 2.6 * t} fill={look.accent(55)} fillOpacity={0.22} />
            <circle cx={cx} cy={cy} r={r * t} fill={look.win(78)} />
          </g>
        );
      })}
    </>
  );
}

export const iron: Art = {
  // Embers crawling along the glowing seam around the picture.
  runner: (g) => ({ path: 'hole', color: g.look.accent(60), width: 0.2 * g.t, dur: 8 }),
  shape,

  labelColor: (g) => g.look.text,

  draw: (g, { outline, hole }) => {
    const { t, look, body, tab, piece, motion } = g;
    const { cx, cy } = middle(g);
    const plate = (
      <>
        <Defs g={g} />
        <path d={outline} fill={`url(#${g.id('iron')})`} fillOpacity={0.97} fillRule="evenodd" />
        <path d={outline} fill="none" stroke="#000" strokeOpacity={0.9} strokeWidth={0.36 * t} />
        <path
          d={outline}
          fill="none"
          stroke={look.frame}
          strokeOpacity={0.85}
          strokeWidth={0.1 * t}
        />
      </>
    );

    if (piece === 'badge') {
      return (
        <>
          {plate}
          <Mirror cx={cx}>
            <Bolt g={g} x={body.x0 + 0.9 * t} y={(body.y0 + body.y1) / 2} r={0.2 * t} />
          </Mirror>
          <Glow
            d={`M${body.x0 + 1.6 * t} ${body.y1 - 0.2 * t}H${body.x1 - 1.6 * t}`}
            color={look.accent(52)}
            width={0.1 * t}
          />
        </>
      );
    }

    const seam = holePath(inset(g.hole, -0.12 * t), { kind: 'chamfer', size: 1.1 * t });
    const smoulder = motion ? anim('flicker', { dur: 2.1 }) : null;
    const inner = (
      <>
        {/* Hammer scratches on the plate near the corners. */}
        <Mirror cx={cx}>
          <path
            d={`M${body.x0 + 5 * t} ${body.y0 + 0.3 * t}l${0.5 * t} ${0.35 * t}M${body.x0 + 6.3 * t} ${body.y0 + 0.55 * t}l${0.35 * t} ${-0.3 * t}M${body.x0 + 0.3 * t} ${cy + 3 * t}l${0.35 * t} ${0.5 * t}M${body.x0 + 5.5 * t} ${body.y1 - 0.3 * t}l${0.6 * t} ${-0.3 * t}`}
            stroke={look.text}
            strokeOpacity={0.14}
            strokeWidth={0.05 * t}
          />
        </Mirror>
        <path d={hole} fill="none" stroke="#000" strokeOpacity={0.8} strokeWidth={0.16 * t} />
        <path
          d={holePath(inset(g.hole, -0.55 * t), { kind: 'chamfer', size: 1.5 * t })}
          fill="none"
          stroke={look.frame}
          strokeOpacity={0.35}
          strokeWidth={0.05 * t}
        />
        <g className={smoulder?.className} style={smoulder?.style}>
          <Glow d={seam} color={look.accent(52)} width={0.1 * t} />
        </g>
      </>
    );

    if (piece === 'screen') {
      return (
        <>
          {plate}
          {inner}
          <Mirror cx={cx}>
            <CornerArmor g={g} x={body.x0 + 0.7 * t} y={body.y0 + 0.7 * t} fy={1} k={1.5} />
            <CornerArmor g={g} x={body.x0 + 0.7 * t} y={body.y1 - 0.7 * t} fy={-1} k={1.5} />
          </Mirror>
        </>
      );
    }

    const tabLeft = tab.cx - tab.width / 2;
    const tabTop = body.y0 - tab.out;
    const bandY = body.y0 + 0.5 * t;

    return (
      <>
        {plate}
        {inner}
        <Mirror cx={cx}>
          <Horn g={g} x={tabLeft + 1.1 * t} y={tabTop + 0.95 * t} dir={-1} />
          <CornerArmor g={g} x={body.x0} y={body.y0} fy={1} />
          <CornerArmor g={g} x={body.x0} y={body.y1} fy={-1} />
          <Bolt g={g} x={body.x0 + 6 * t} y={bandY} r={0.16 * t} />
          <Bolt g={g} x={body.x0 + 6 * t} y={body.y1 - 0.5 * t} r={0.16 * t} />
          <Bolt g={g} x={body.x0 - 0.1 * t} y={cy} r={0.2 * t} />
          <Sparks g={g} x={g.hole.x0} y={g.hole.y1} dir={1} />
        </Mirror>
        <Ember g={g} x={tab.cx} y={tabTop + 0.1 * t} r={0.34 * t} delay={0.6} />
        <Ember g={g} x={cx} y={body.y1 + 0.3 * t} r={0.34 * t} delay={1.4} />
      </>
    );
  },
};
