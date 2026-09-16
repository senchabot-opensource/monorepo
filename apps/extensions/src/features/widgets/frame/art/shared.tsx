import type { CSSProperties, ReactNode } from 'react';

// Shared pieces for the frame styles. Glows are stacked translucent strokes, not blur filters,
// and every animation moves only opacity or transform: an OBS browser source runs beside the
// game capture, so paint work stays small.

/** Keyframes for the `fr-*` animation classes; `.fr-still` turns them all off. */
export const FRAME_CSS = `
.fr-anim{transform-box:fill-box}
.fr-still .fr-anim{animation:none!important}
.fr-pulse{animation:fr-pulse var(--fr-dur,2.8s) ease-in-out infinite}
.fr-chase{animation:fr-chase var(--fr-dur,1.6s) ease-in-out infinite}
.fr-flicker{animation:fr-flicker var(--fr-dur,1.3s) steps(1,end) infinite}
.fr-glint{animation:fr-glint var(--fr-dur,5s) ease-in-out infinite}
.fr-sway{transform-origin:50% 0;animation:fr-sway var(--fr-dur,3.6s) ease-in-out infinite}
.fr-spin{transform-origin:50% 50%;animation:fr-spin var(--fr-dur,24s) linear infinite}
.fr-bob{animation:fr-bob var(--fr-dur,2.4s) ease-in-out infinite}
.fr-rise{animation:fr-rise var(--fr-dur,3s) ease-out infinite}
.fr-fall{transform-origin:50% 50%;animation:fr-fall var(--fr-dur,7s) linear infinite}
.fr-slide{animation:fr-slide var(--fr-dur,1.2s) linear infinite}
.fr-run{animation:fr-run var(--fr-dur,9s) linear infinite}
@keyframes fr-run{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
/* Blocks' hotbar: the selection hops between slots; --slot is one slot's width. */
.fr-blk-slot{animation:fr-blk-slot 16s ease-in-out infinite}
@keyframes fr-blk-slot{0%,18%{transform:translateX(0)}21%,38%{transform:translateX(calc(var(--slot) * 2))}41%,58%{transform:translateX(calc(var(--slot) * 4))}61%,78%{transform:translateX(var(--slot))}81%,97%{transform:translateX(calc(var(--slot) * 3))}100%{transform:translateX(0)}}
@keyframes fr-pulse{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes fr-chase{0%,100%{opacity:.22}40%{opacity:1}}
@keyframes fr-flicker{0%{opacity:1}18%{opacity:.78}31%{opacity:.95}47%{opacity:.7}62%{opacity:1}80%{opacity:.84}}
@keyframes fr-glint{0%{transform:translateX(0);opacity:0}8%{opacity:1}55%{transform:translateX(var(--fr-travel,100px));opacity:1}62%,100%{transform:translateX(var(--fr-travel,100px));opacity:0}}
@keyframes fr-sway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
@keyframes fr-spin{to{transform:rotate(360deg)}}
@keyframes fr-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(var(--fr-bob,-3px))}}
@keyframes fr-rise{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(var(--fr-rise,-30px));opacity:0}}
@keyframes fr-fall{0%{transform:translate(0,0) rotate(0);opacity:0}10%{opacity:1}85%{opacity:1}100%{transform:translate(var(--fr-dx,20px),var(--fr-dy,60px)) rotate(260deg);opacity:0}}
@keyframes fr-slide{to{transform:translateX(var(--fr-step,10px))}}
`;

type AnimName =
  | 'pulse'
  | 'chase'
  | 'flicker'
  | 'glint'
  | 'sway'
  | 'spin'
  | 'bob'
  | 'rise'
  | 'fall'
  | 'slide'
  | 'run';

/**
 * Props that animate an SVG element: a `fr-*` class plus timing and the custom properties the
 * keyframes read (e.g. `--fr-travel`).
 */
export function anim(
  name: AnimName,
  {
    dur,
    delay,
    vars,
  }: { dur?: number; delay?: number; vars?: Record<string, string | number> } = {},
): { className: string; style: CSSProperties } {
  const style: Record<string, string | number> = { ...vars };
  if (dur !== undefined) style['--fr-dur'] = `${dur}s`;
  if (delay !== undefined) style.animationDelay = `${delay}s`;
  return { className: `fr-anim fr-${name}`, style: style as CSSProperties };
}

/**
 * A white-to-black overlay gradient, laid over a flat metal color so gold, bronze and iron read
 * as lit from above in whatever color the preset picked.
 */
export function Sheen({ id, strength = 1 }: { id: string; strength?: number }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity={0.55 * strength} />
      <stop offset="0.45" stopColor="#fff" stopOpacity={0.05 * strength} />
      <stop offset="0.55" stopColor="#000" stopOpacity={0.05 * strength} />
      <stop offset="1" stopColor="#000" stopOpacity={0.45 * strength} />
    </linearGradient>
  );
}

/** Paths filled in `color` with a sheen on top. */
export function Metal({ d, color, sheen }: { d: string; color: string; sheen: string }) {
  return (
    <>
      <path d={d} fill={color} />
      <path d={d} fill={`url(#${sheen})`} />
    </>
  );
}

/** Draws `children` twice: as given, and mirrored over the corner's diagonal (x and y swapped). */
export function BothEdges({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <g transform="matrix(0 1 1 0 0 0)">{children}</g>
    </>
  );
}

/** Draws `children` as given and mirrored left to right around x = `cx`. */
export function Mirror({ cx, children }: { cx: number; children: ReactNode }) {
  return (
    <>
      {children}
      <g transform={`translate(${2 * cx} 0) scale(-1 1)`}>{children}</g>
    </>
  );
}

/** Draws `children` at all four corners of a w × h frame, drawn for the top left. */
export function FourCorners({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return (
    <>
      <g>{children}</g>
      <g transform={`translate(${w} 0) scale(-1 1)`}>{children}</g>
      <g transform={`translate(0 ${h}) scale(1 -1)`}>{children}</g>
      <g transform={`translate(${w} ${h}) scale(-1 -1)`}>{children}</g>
    </>
  );
}

/**
 * A neon line: the path stroked in `color` over wider, fainter copies of itself, with a white-hot
 * core. `width` is the core's width.
 */
export function Glow({
  d,
  color,
  width,
  core = true,
  cap = 'round',
}: {
  d: string;
  color: string;
  width: number;
  core?: boolean;
  cap?: 'round' | 'butt' | 'square';
}) {
  const line = {
    d,
    fill: 'none',
    stroke: color,
    strokeLinecap: cap,
    strokeLinejoin: 'round',
  } as const;
  return (
    <>
      <path {...line} strokeOpacity={0.08} strokeWidth={width * 5} />
      <path {...line} strokeOpacity={0.16} strokeWidth={width * 3} />
      <path {...line} strokeOpacity={0.35} strokeWidth={width * 1.8} />
      <path {...line} strokeWidth={width} />
      {core && (
        <path
          {...line}
          stroke="#fff"
          strokeOpacity={0.65}
          strokeWidth={Math.max(0.6, width * 0.3)}
        />
      )}
    </>
  );
}

/** A row of lights, `gap` apart along x (or y), that light up one after another. */
export function Leds({
  x,
  y,
  count,
  gap,
  r,
  color,
  vertical = false,
  motion,
  dur = 1.6,
}: {
  x: number;
  y: number;
  count: number;
  gap: number;
  r: number;
  color: string;
  vertical?: boolean;
  motion: boolean;
  dur?: number;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const cx = vertical ? x : x + i * gap;
        const cy = vertical ? y + i * gap : y;
        const a = motion ? anim('chase', { dur, delay: (i * dur) / count }) : null;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed row, never reordered.
          <g key={i} className={a?.className} style={a?.style}>
            <circle cx={cx} cy={cy} r={r * 2.4} fill={color} fillOpacity={0.18} />
            <circle cx={cx} cy={cy} r={r} fill={color} />
          </g>
        );
      })}
    </>
  );
}

/** `>` chevrons pointing along +x (or -x with `flip`), lighting up in turn. */
export function Chevrons({
  x,
  y,
  count,
  size,
  color,
  flip = false,
  motion,
}: {
  x: number;
  y: number;
  count: number;
  size: number;
  color: string;
  flip?: boolean;
  motion: boolean;
}) {
  const dir = flip ? -1 : 1;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const cx = x + dir * i * size * 0.9;
        const a = motion ? anim('chase', { dur: 1.2, delay: (i * 1.2) / count }) : null;
        return (
          <path
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed row, never reordered.
            key={i}
            d={`M${cx - (dir * size) / 2} ${y - size / 2}L${cx} ${y}L${cx - (dir * size) / 2} ${y + size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth={size * 0.28}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={a?.className}
            style={a?.style}
          />
        );
      })}
    </>
  );
}

/**
 * A bright streak that sweeps from x0 to x1 along y every few seconds. Nothing is clipped: the
 * streak fades in and out inside that span.
 */
export function Glint({
  id,
  x0,
  x1,
  y,
  height,
  color = '#fff',
  dur = 5,
  delay = 0,
}: {
  id: string;
  x0: number;
  x1: number;
  y: number;
  height: number;
  color?: string;
  dur?: number;
  delay?: number;
}) {
  const width = Math.min(x1 - x0, height * 14);
  const a = anim('glint', { dur, delay, vars: { '--fr-travel': `${x1 - x0 - width}px` } });
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={color} stopOpacity={0} />
          <stop offset="0.5" stopColor={color} stopOpacity={1} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <g className={a.className} style={a.style}>
        <rect
          x={x0}
          y={y - height * 1.5}
          width={width}
          height={height * 3}
          rx={height * 1.5}
          fill={`url(#${id})`}
          opacity={0.3}
        />
        <rect
          x={x0}
          y={y - height / 2}
          width={width}
          height={height}
          rx={height / 2}
          fill={`url(#${id})`}
        />
      </g>
    </>
  );
}

/** Diagonal warning stripes in a w × h box, two colors. */
export function Stripes({
  x,
  y,
  width,
  height,
  color,
  gap,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  gap: number;
}) {
  const d = Array.from({ length: Math.ceil(width / gap) + 1 }, (_, i) => {
    const sx = x + i * gap;
    return `M${sx} ${y + height}L${sx + height} ${y}L${sx + height + gap / 2} ${y}L${sx + gap / 2} ${y + height}Z`;
  })
    .join('')
    .trim();
  return <path d={d} fill={color} />;
}

/**
 * Two bright streaks racing around a closed path, e.g. the frame's outline: a dash pattern on a
 * path measured as 100 units, so the streaks are the same share of any frame size.
 */
export function Runner({
  d,
  color,
  width,
  dur = 9,
  pixel = false,
}: {
  d: string;
  color: string;
  width: number;
  dur?: number;
  /** Square streaks that hop in whole steps, for pixel art. */
  pixel?: boolean;
}) {
  const a = anim('run', { dur });
  const line = {
    d,
    pathLength: 100,
    fill: 'none',
    stroke: color,
    strokeLinecap: pixel ? 'butt' : 'round',
    strokeLinejoin: pixel ? 'miter' : 'round',
    // Two streaks, half a lap apart.
    strokeDasharray: pixel ? '5 45' : '9 41',
    className: a.className,
    style: pixel ? { ...a.style, animationTimingFunction: 'steps(100)' } : a.style,
  } as const;
  if (pixel) {
    return (
      <>
        <path {...line} strokeOpacity={0.35} strokeWidth={width * 2.2} />
        <path {...line} strokeWidth={width} />
      </>
    );
  }
  return (
    <>
      <path {...line} strokeOpacity={0.12} strokeWidth={width * 6} />
      <path {...line} strokeOpacity={0.3} strokeWidth={width * 3} />
      <path {...line} strokeWidth={width * 1.4} />
      <path {...line} stroke="#fff" strokeOpacity={0.8} strokeWidth={width * 0.5} />
    </>
  );
}
