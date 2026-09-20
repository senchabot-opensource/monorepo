// Frame silhouettes as SVG paths: a body box whose corners are cut, rounded, notched or stepped,
// with tabs, trays and wings pushed out of (or dented into) its edges, and a hole in the middle.

export type CornerKind = 'square' | 'chamfer' | 'round' | 'notch' | 'step';
export type FeatureKind = 'rect' | 'trapezoid' | 'arch' | 'roof' | 'step' | 'spikes' | 'round';

export interface Corner {
  kind: CornerKind;
  size: number;
}

/** Something pushed out of an edge (or into it, with a negative `height`). */
export interface Feature {
  kind: FeatureKind;
  /** Where its middle sits along the edge, 0 to 1: left to right, or top to bottom. */
  at: number;
  /** Width along the edge, in px. */
  width: number;
  /** How far it sticks out, in px; negative dents the edge inward. */
  height: number;
}

export interface ShapeSpec {
  /** Corners clockwise from the top left; one value is used for all four. */
  corners: Corner | [Corner, Corner, Corner, Corner];
  top?: Feature[];
  right?: Feature[];
  bottom?: Feature[];
  left?: Feature[];
  /** The hole's own corners. */
  hole: Corner;
}

export interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

type Point = [number, number];

const add = (a: Point, b: Point, k = 1): Point => [a[0] + b[0] * k, a[1] + b[1] * k];
const fmt = ([x, y]: Point) => `${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`;

/**
 * Path commands that round the corner at `c`, coming in along `din` and leaving along `dout`,
 * starting from `size` before it. Ends `size` after it.
 */
function corner(c: Point, din: Point, dout: Point, { kind, size }: Corner): string {
  const start = add(c, din, -size);
  const end = add(c, dout, size);
  const from = `L${fmt(start)}`;
  switch (kind) {
    case 'square':
      return `${from}L${fmt(c)}L${fmt(end)}`;
    case 'round':
      return `${from}Q${fmt(c)} ${fmt(end)}`;
    case 'notch':
      return `${from}L${fmt(add(start, dout, size))}L${fmt(end)}`;
    case 'step': {
      const half = size / 2;
      const a = add(start, dout, half);
      const b = add(a, din, half);
      const d = add(b, dout, half);
      return `${from}L${fmt(a)}L${fmt(b)}L${fmt(d)}L${fmt(end)}`;
    }
    default:
      return `${from}L${fmt(end)}`;
  }
}

/** Path commands for one feature on an edge running along `d` with outward normal `n`. */
function feature(a: Point, d: Point, n: Point, { kind, width, height: h }: Feature): string {
  const b = add(a, d, width);
  const out = (p: Point, k: number) => add(p, n, k);
  const along = (p: Point, k: number) => add(p, d, k);
  const slope = Math.min(Math.abs(h), width / 3);
  switch (kind) {
    case 'rect':
      return `L${fmt(a)}L${fmt(out(a, h))}L${fmt(out(b, h))}L${fmt(b)}`;
    case 'arch': {
      const mid = out(along(a, width / 2), h);
      return `L${fmt(a)}L${fmt(out(along(a, width * 0.28), h * 0.62))}L${fmt(mid)}L${fmt(out(along(b, -width * 0.28), h * 0.62))}L${fmt(b)}`;
    }
    case 'roof': {
      // Eaves flare past the width and curl up; the ridge sits on top.
      const flare = width * 0.08;
      const tipL = out(along(a, -flare), h * 0.45);
      const tipR = out(along(b, flare), h * 0.45);
      const ridgeL = out(along(a, width * 0.24), h);
      const ridgeR = out(along(b, -width * 0.24), h);
      return `L${fmt(a)}Q${fmt(out(along(a, width * 0.02), h * 0.1))} ${fmt(tipL)}Q${fmt(out(along(a, width * 0.14), h * 0.5))} ${fmt(ridgeL)}L${fmt(ridgeR)}Q${fmt(out(along(b, -width * 0.14), h * 0.5))} ${fmt(tipR)}Q${fmt(out(along(b, -width * 0.02), h * 0.1))} ${fmt(b)}`;
    }
    case 'step': {
      const half = h / 2;
      const q = Math.abs(half);
      return `L${fmt(a)}L${fmt(out(a, half))}L${fmt(out(along(a, q), half))}L${fmt(out(along(a, q), h))}L${fmt(out(along(b, -q), h))}L${fmt(out(along(b, -q), half))}L${fmt(out(b, half))}L${fmt(b)}`;
    }
    case 'spikes': {
      const inner = width - 2 * slope;
      const spikes = [0.2, 0.5, 0.8]
        .map((f) => {
          const x = slope + inner * f;
          return `L${fmt(out(along(a, x - inner * 0.08), h))}L${fmt(out(along(a, x), h * 1.7))}L${fmt(out(along(a, x + inner * 0.08), h))}`;
        })
        .join('');
      return `L${fmt(a)}L${fmt(out(along(a, slope), h))}${spikes}L${fmt(out(along(b, -slope), h))}L${fmt(b)}`;
    }
    case 'round': {
      const c1 = out(along(a, width * 0.05), h * 1.3);
      const c2 = out(along(b, -width * 0.05), h * 1.3);
      return `L${fmt(a)}C${fmt(c1)} ${fmt(c2)} ${fmt(b)}`;
    }
    default:
      return `L${fmt(a)}L${fmt(out(along(a, slope), h))}L${fmt(out(along(b, -slope), h))}L${fmt(b)}`;
  }
}

/** One edge from `from` to `to` (exclusive), with its features in order along `d`. */
function edge(
  from: Point,
  d: Point,
  n: Point,
  length: number,
  features: Feature[] = [],
  flip = false,
) {
  // Features are given left to right / top to bottom; bottom and left edges run backwards.
  const placed = features
    .map((f) => ({ ...f, at: flip ? 1 - f.at : f.at }))
    .sort((p, q) => p.at - q.at);
  return placed.map((f) => feature(add(from, d, f.at * length - f.width / 2), d, n, f)).join('');
}

const cornersOf = (spec: ShapeSpec['corners']) =>
  Array.isArray(spec) ? spec : ([spec, spec, spec, spec] as const);

/** The body outline, clockwise from just after the top-left corner. */
export function outlinePath(box: Box, spec: ShapeSpec): string {
  const { x0, y0, x1, y1 } = box;
  const [tl, tr, br, bl] = cornersOf(spec.corners);
  const w = x1 - x0;
  const h = y1 - y0;
  return [
    `M${fmt([x0 + tl.size, y0])}`,
    edge([x0, y0], [1, 0], [0, -1], w, spec.top),
    corner([x1, y0], [1, 0], [0, 1], tr),
    edge([x1, y0], [0, 1], [1, 0], h, spec.right),
    corner([x1, y1], [0, 1], [-1, 0], br),
    edge([x1, y1], [-1, 0], [0, 1], w, spec.bottom, true),
    corner([x0, y1], [-1, 0], [0, -1], bl),
    edge([x0, y1], [0, -1], [-1, 0], h, spec.left, true),
    corner([x0, y0], [0, -1], [1, 0], tl),
    'Z',
  ].join('');
}

/** A box with the same corner on all four sides, drawn counter-clockwise so it cuts a hole. */
export function holePath(box: Box, c: Corner): string {
  const { x0, y0, x1, y1 } = box;
  return [
    `M${fmt([x0, y0 + c.size])}`,
    corner([x0, y1], [0, 1], [1, 0], c),
    corner([x1, y1], [1, 0], [0, -1], c),
    corner([x1, y0], [0, -1], [-1, 0], c),
    corner([x0, y0], [-1, 0], [0, 1], c),
    'Z',
  ].join('');
}

export const inset = (box: Box, by: number): Box => ({
  x0: box.x0 + by,
  y0: box.y0 + by,
  x1: box.x1 - by,
  y1: box.y1 - by,
});
