import { type Art, type Geometry, middle } from '../frame-look';
import { holePath, inset, type ShapeSpec } from '../shape';
import { anim, Glint, Metal, Mirror, Sheen } from './shared';

// Dark carved wood with gold trim, after high-fantasy tavern and castle UI: rounded plates with
// heavy gem-set corner caps, round bosses on the sides, rune marks that flicker and a heraldic
// shield over crossed swords at the bottom. Drawn from scratch, no game art.

function shape(g: Geometry): ShapeSpec {
  const { t, piece, body, tab } = g;
  if (piece === 'badge') {
    return { corners: { kind: 'round', size: 0.9 * t }, hole: { kind: 'square', size: 0 } };
  }
  if (piece === 'screen') {
    return { corners: { kind: 'round', size: 1.6 * t }, hole: { kind: 'round', size: 0.9 * t } };
  }
  const span = body.x1 - body.x0;
  const tall = body.y1 - body.y0;
  const boss = {
    kind: 'round',
    at: 0.5,
    width: Math.min(tall * 0.26, 4.4 * t),
    height: 0.8 * t,
  } as const;
  return {
    corners: { kind: 'round', size: 1.8 * t },
    top: [{ kind: 'round', at: 0.5, width: tab.width, height: tab.out }],
    bottom: [{ kind: 'round', at: 0.5, width: Math.min(span * 0.3, 9 * t), height: 0.9 * t }],
    left: [boss],
    right: [boss],
    hole: { kind: 'round', size: 0.9 * t },
  };
}

function Defs({ g }: { g: Geometry }) {
  const { look } = g;
  return (
    <defs>
      <Sheen id={g.id('sheen')} />
      <Sheen id={g.id('soft')} strength={0.5} />
      <linearGradient id={g.id('wood')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={look.panel} />
        <stop offset="0.5" stopColor={look.panel2} />
        <stop offset="1" stopColor={look.panel} />
      </linearGradient>
      <radialGradient id={g.id('dome')} cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" stopColor="#fff" stopOpacity={0.75} />
        <stop offset="0.35" stopColor="#fff" stopOpacity={0.1} />
        <stop offset="1" stopColor="#000" stopOpacity={0.5} />
      </radialGradient>
      <radialGradient id={g.id('gem')} cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor={look.accent(85)} />
        <stop offset="0.45" stopColor={look.accent(55)} />
        <stop offset="1" stopColor={look.accent(22)} />
      </radialGradient>
      <radialGradient id={g.id('halo')}>
        <stop offset="0" stopColor={look.accent(60)} stopOpacity={0.7} />
        <stop offset="1" stopColor={look.accent(60)} stopOpacity={0} />
      </radialGradient>
    </defs>
  );
}

function Rivet({ g, x, y, r }: { g: Geometry; x: number; y: number; r: number }) {
  return (
    <>
      <circle cx={x} cy={y + r * 0.35} r={r} fill="#000" fillOpacity={0.55} />
      <circle cx={x} cy={y} r={r} fill={g.look.frame} />
      <circle cx={x} cy={y} r={r} fill={`url(#${g.id('dome')})`} />
    </>
  );
}

/** A round gem in a gold socket at (x, y), glowing on and off. */
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
  const pulse = g.motion ? anim('pulse', { dur: 3.2, delay }) : null;
  return (
    <>
      <g className={pulse?.className} style={pulse?.style}>
        <circle cx={x} cy={y} r={r * 2.6} fill={`url(#${g.id('halo')})`} />
      </g>
      <circle cx={x} cy={y} r={r * 1.35} fill={g.look.frame2} />
      <circle cx={x} cy={y} r={r * 1.35} fill="none" stroke={g.look.frame} strokeWidth={r * 0.3} />
      <circle cx={x} cy={y} r={r} fill={`url(#${g.id('gem')})`} />
      <ellipse
        cx={x - r * 0.3}
        cy={y - r * 0.38}
        rx={r * 0.34}
        ry={r * 0.2}
        fill="#fff"
        fillOpacity={0.7}
      />
    </>
  );
}

/** A heavy gold cap over the corner at (x, y), with a gem and rivets; `fy` = -1 at the bottom. */
function CornerCap({
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
  const size = 2.5 * t;
  const x0 = x - 0.35 * t;
  const y0 = fy === 1 ? y - 0.35 * t : y + 0.35 * t - size;
  const cap = `M${x0 + 0.6 * t} ${y0}H${x0 + size - 0.6 * t}Q${x0 + size} ${y0} ${x0 + size} ${y0 + 0.6 * t}V${y0 + size - 0.6 * t}Q${x0 + size} ${y0 + size} ${x0 + size - 0.6 * t} ${y0 + size}H${x0 + 0.6 * t}Q${x0} ${y0 + size} ${x0} ${y0 + size - 0.6 * t}V${y0 + 0.6 * t}Q${x0} ${y0} ${x0 + 0.6 * t} ${y0}Z`;
  const c = { x: x0 + size / 2, y: y0 + size / 2 };
  // Leaf tips reaching along both edges from the cap.
  const leaf = (dx: number, dy: number) =>
    `M${c.x + dx * 1.1 * t} ${c.y + dy * 1.1 * t}Q${c.x + dx * 2.2 * t + dy * 0.45 * t} ${c.y + dy * 2.2 * t + dx * 0.45 * t} ${c.x + dx * 3.1 * t} ${c.y + dy * 3.1 * t}Q${c.x + dx * 2.2 * t - dy * 0.45 * t} ${c.y + dy * 2.2 * t - dx * 0.45 * t} ${c.x + dx * 1.1 * t} ${c.y + dy * 1.1 * t}Z`;
  const sheen = g.id('sheen');
  return (
    <>
      <Metal d={`${leaf(1, 0)}${leaf(0, fy)}`} color={look.frame} sheen={g.id('soft')} />
      <path d={cap} fill="#000" fillOpacity={0.55} transform={`translate(0 ${0.16 * t})`} />
      <Metal d={cap} color={look.frame} sheen={sheen} />
      <circle cx={c.x} cy={c.y} r={0.9 * t} fill="#000" fillOpacity={0.35} />
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([dx, dy]) => (
        <Rivet
          key={`${dx}${dy}`}
          g={g}
          x={c.x + dx * 0.88 * t}
          y={c.y + dy * 0.88 * t}
          r={0.13 * t}
        />
      ))}
      <Gem g={g} x={c.x} y={c.y} r={0.48 * t} delay={fy === 1 ? 0 : 1.6} />
    </>
  );
}

/** A heater shield of half-width w, its top edge at y. */
const shieldPath = (w: number, x: number, y: number) =>
  `M${x - w} ${y}H${x + w}V${y + 0.55 * w}C${x + w} ${y + 1.4 * w} ${x + 0.5 * w} ${y + 1.75 * w} ${x} ${y + 2 * w}C${x - 0.5 * w} ${y + 1.75 * w} ${x - w} ${y + 1.4 * w} ${x - w} ${y + 0.55 * w}Z`;

/** A sword pointing up, its hilt at (0, 0) and its tip `length` above. */
function Sword({ g, length }: { g: Geometry; length: number }) {
  const { t, look } = g;
  const sheen = g.id('sheen');
  const b = 0.17 * t;
  const blade = `M${-b} ${-0.1 * t}V${-length + 0.5 * t}L0 ${-length}L${b} ${-length + 0.5 * t}V${-0.1 * t}Z`;
  return (
    <>
      <path
        d={blade}
        fill="#000"
        fillOpacity={0.45}
        transform={`translate(${0.1 * t} ${0.1 * t})`}
      />
      <Metal d={blade} color={look.text} sheen={sheen} />
      <Metal
        d={`M${-0.7 * t} ${-0.12 * t}H${0.7 * t}L${0.55 * t} ${0.12 * t}H${-0.55 * t}Z`}
        color={look.frame}
        sheen={sheen}
      />
      <path
        d={`M${-0.08 * t} ${0.12 * t}h${0.16 * t}v${0.7 * t}h${-0.16 * t}Z`}
        fill={look.frame2}
      />
      <circle cy={0.92 * t} r={0.16 * t} fill={look.frame} />
    </>
  );
}

/** The shield over crossed swords, the shield's top edge centered on (x, y). */
function Crest({ g, x, y }: { g: Geometry; x: number; y: number }) {
  const { t, look } = g;
  const w = 1.05 * t;
  const sheen = g.id('sheen');
  return (
    <>
      <g transform={`translate(${x - 2.4 * t} ${y + 1.7 * t}) rotate(62)`}>
        <Sword g={g} length={5 * t} />
      </g>
      <g transform={`translate(${x + 2.4 * t} ${y + 1.7 * t}) rotate(-62)`}>
        <Sword g={g} length={5 * t} />
      </g>
      <path
        d={shieldPath(w + 0.12 * t, x, y)}
        fill="#000"
        fillOpacity={0.5}
        transform={`translate(0 ${0.16 * t})`}
      />
      <Metal d={shieldPath(w + 0.12 * t, x, y)} color={look.frame} sheen={sheen} />
      <path d={shieldPath(w - 0.14 * t, x, y + 0.2 * t)} fill={look.accent(30, 1, 0.8)} />
      <path d={shieldPath(w - 0.14 * t, x, y + 0.2 * t)} fill={`url(#${g.id('soft')})`} />
      <path
        d={`M${x - w + 0.14 * t} ${y + 0.75 * t}H${x + w - 0.14 * t}`}
        stroke={look.frame}
        strokeOpacity={0.7}
        strokeWidth={0.1 * t}
      />
      <Gem g={g} x={x} y={y + 1.25 * t} r={0.36 * t} delay={0.8} />
    </>
  );
}

/** A small carved rune at (x, y) that glows and flickers like candlelight. */
function Rune({ g, x, y, delay }: { g: Geometry; x: number; y: number; delay: number }) {
  const { t, look, motion } = g;
  const u = 0.28 * t;
  const flicker = motion ? anim('flicker', { dur: 1.7, delay }) : null;
  const d = `M${x} ${y - u}V${y + u}M${x - u * 0.7} ${y - u * 0.4}L${x} ${y}L${x + u * 0.7} ${y - u * 0.4}`;
  return (
    <g className={flicker?.className} style={flicker?.style}>
      <path
        d={d}
        fill="none"
        stroke={look.accent(55)}
        strokeOpacity={0.35}
        strokeWidth={0.28 * t}
        strokeLinecap="round"
      />
      <path
        d={d}
        fill="none"
        stroke={look.accent(72)}
        strokeWidth={0.09 * t}
        strokeLinecap="round"
      />
    </g>
  );
}

export const ornate: Art = {
  // A slow gold gleam around the carved rim.
  runner: (g) => ({ path: 'edge', color: g.look.win(62), width: 0.22 * g.t, dur: 12 }),
  shape,

  draw: (g, { outline, hole }) => {
    const { t, look, body, tab, piece, motion } = g;
    const { cx, cy } = middle(g);
    const plate = (
      <>
        <Defs g={g} />
        <path d={outline} fill={`url(#${g.id('wood')})`} fillOpacity={0.97} fillRule="evenodd" />
        <path d={outline} fill="none" stroke="#000" strokeOpacity={0.85} strokeWidth={0.42 * t} />
        <path d={outline} fill="none" stroke={look.frame2} strokeWidth={0.3 * t} />
        <path d={outline} fill="none" stroke={look.frame} strokeWidth={0.1 * t} />
      </>
    );

    if (piece === 'badge') {
      return (
        <>
          {plate}
          <Mirror cx={cx}>
            <Rivet g={g} x={body.x0 + 0.9 * t} y={(body.y0 + body.y1) / 2} r={0.2 * t} />
          </Mirror>
        </>
      );
    }

    const step = holePath(inset(g.hole, 0.32 * t), { kind: 'round', size: 0.6 * t });
    const inner = (
      <>
        <path d={hole + step} fill={look.frame2} fillRule="evenodd" />
        <path d={hole + step} fill={`url(#${g.id('soft')})`} fillRule="evenodd" />
        <path d={hole} fill="none" stroke={look.frame} strokeWidth={0.08 * t} />
        <path d={step} fill="none" stroke="#000" strokeOpacity={0.7} strokeWidth={0.1 * t} />
        {/* A carved groove down the middle of the wood. */}
        <path
          d={holePath(inset(g.hole, -0.5 * t), { kind: 'round', size: 1.4 * t })}
          fill="none"
          stroke="#000"
          strokeOpacity={0.5}
          strokeWidth={0.1 * t}
        />
        <path
          d={holePath(inset(g.hole, -0.56 * t), { kind: 'round', size: 1.5 * t })}
          fill="none"
          stroke={look.frame}
          strokeOpacity={0.3}
          strokeWidth={0.04 * t}
        />
      </>
    );

    if (piece === 'screen') {
      return (
        <>
          {plate}
          {inner}
          <Mirror cx={cx}>
            <CornerCap g={g} x={body.x0 + 0.3 * t} y={body.y0 + 0.3 * t} fy={1} k={1.5} />
            <CornerCap g={g} x={body.x0 + 0.3 * t} y={body.y1 - 0.3 * t} fy={-1} k={1.5} />
          </Mirror>
          {motion && (
            <Glint
              id={g.id('glint')}
              x0={body.x0 + 8 * t}
              x1={body.x1 - 8 * t}
              y={body.y0 + 0.05 * t}
              height={0.22 * t}
              color={look.win(80)}
              dur={8}
            />
          )}
        </>
      );
    }

    const bandY = body.y0 + 0.5 * t;
    const bottomY = body.y1 - 0.5 * t;
    const tabLeft = tab.cx - tab.width / 2;
    const rivetsFrom = body.x0 + 4 * t;
    const rivetsTo = tabLeft - 1.4 * t;
    const count = Math.max(0, Math.floor((rivetsTo - rivetsFrom) / (2.6 * t)));
    const wingX = body.x0 - 0.25 * t;

    return (
      <>
        {plate}
        {inner}
        <Mirror cx={cx}>
          {Array.from({ length: count }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed row.
            <Rivet key={i} g={g} x={rivetsFrom + i * 2.6 * t} y={bandY} r={0.14 * t} />
          ))}
          <Rivet g={g} x={body.x0 + 4 * t} y={bottomY} r={0.14 * t} />
          <Rivet g={g} x={body.x0 + 6.6 * t} y={bottomY} r={0.14 * t} />
          <Rune g={g} x={tabLeft + 1.1 * t} y={body.y0 - 0.2 * t} delay={0} />
          <CornerCap g={g} x={body.x0} y={body.y0} fy={1} />
          <CornerCap g={g} x={body.x0} y={body.y1} fy={-1} />
          {/* Side boss: a gold ring with a gem. */}
          <circle cx={wingX} cy={cy} r={1.1 * t} fill={look.frame2} />
          <circle cx={wingX} cy={cy} r={1.1 * t} fill={`url(#${g.id('sheen')})`} />
          <circle
            cx={wingX}
            cy={cy}
            r={1.1 * t}
            fill="none"
            stroke={look.frame}
            strokeWidth={0.16 * t}
          />
          <Gem g={g} x={wingX} y={cy} r={0.46 * t} delay={1} />
        </Mirror>
        <Crest g={g} x={cx} y={body.y1 - 1.35 * t} />
        {motion && (
          <Glint
            id={g.id('glint')}
            x0={body.x0 + 3 * t}
            x1={body.x1 - 3 * t}
            y={body.y0 + 0.05 * t}
            height={0.22 * t}
            color={look.win(80)}
            dur={7}
          />
        )}
      </>
    );
  },
};
