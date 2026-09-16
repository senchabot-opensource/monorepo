import type { CSSProperties, ReactNode } from 'react';
import type { Art, Geometry } from '../frame-look';
import { type Box, holePath, inset, outlinePath, type ShapeSpec } from '../shape';
import { anim } from './shared';

// A block-building game's look: a grass-and-dirt band on a pixel grid with stepped corners,
// grass blocks on the corners, a plank sign for the label, stone wings with gold ore, a hotbar
// in the tray whose selection hops between items, flickering torches, a bobbing flower and
// floating orbs. Drawn from scratch, no game art.

/** One art pixel, in CSS px: whole, so edges land on screen pixels. */
const unit = (g: Geometry) => Math.max(2, Math.round(g.t / 4));
const snap = (v: number, p: number) => Math.round(v / p) * p;
/** Rounds up to an even number of pixels, so a centered shape stays on the grid. */
const even = (v: number, p: number) => Math.ceil(v / (2 * p)) * 2 * p;

/** Band thickness, in art pixels: an outline, four rows of grass and dirt, an inner outline. */
const BAND = 6;
const SLOT = 7;

/** A color between `hex` and `to`, k of the way. */
function mix(hex: string, to: string, k: number) {
  const a = Number.parseInt(hex.slice(1), 16);
  const b = Number.parseInt(to.slice(1), 16);
  const channel = (shift: number) => {
    const x = (a >> shift) & 255;
    const y = (b >> shift) & 255;
    return Math.round(x + (y - x) * k);
  };
  return `rgb(${channel(16)},${channel(8)},${channel(0)})`;
}

/** A stable 0-99 number per grid cell, for texture that doesn't change between renders. */
function noise(i: number, j: number) {
  let h = Math.imul(i * 374761393 + j * 668265263, 1274126177);
  h ^= h >>> 13;
  h = Math.imul(h, 1103515245);
  return ((h ^ (h >>> 16)) >>> 0) % 100;
}

/** Pixel art from rows of characters, one path per color; unknown characters stay empty. */
function pixels(
  rows: readonly string[],
  colors: Record<string, string>,
  x0: number,
  y0: number,
  p: number,
): ReactNode {
  const paths: Record<string, string> = {};
  rows.forEach((row, j) => {
    [...row].forEach((ch, i) => {
      if (!colors[ch]) return;
      paths[ch] = `${paths[ch] ?? ''}M${x0 + i * p} ${y0 + j * p}h${p}v${p}h${-p}Z`;
    });
  });
  return Object.entries(paths).map(([ch, d]) => <path key={ch} d={d} fill={colors[ch]} />);
}

const GRASS_BLOCK = [
  'kkkkkkkkkk',
  'kGgGGgGGgk',
  'kgGGgGGgGk',
  'kDgDGgDgDk',
  'kDDdDDDdDk',
  'kDdDDdDDdk',
  'kdDDdDDDDk',
  'kDDDDdDdDk',
  'kDdDDDDDDk',
  'kkkkkkkkkk',
];
const FLOWER = ['.R.R.', 'RRYRR', '.RRR.', '..S..', 'S.S..', '.SS.S', '..SS.'];
const TORCH_FLAME = ['.F.', 'fYf'];
// A faint square glow around the flame, stepped like everything else.
const TORCH_HALO = ['.h.', 'h.h', '.h.'];
const TORCH_STICK = ['.W.', '.W.', '.W.', '.W.', '.W.', '.W.'];
const ORB = ['.o.', 'oOo', '.o.'];
const ITEMS: readonly (readonly string[])[] = [
  ['...LW', '..LWL', 'HLWL.', '.HH..', 'H.H..'],
  ['WWWW.', '...H.', '..H.W', '.H..W', 'H....'],
  ['GGGGG', 'gGgGg', 'DdDDd', 'DDdDD', 'dDDdD'],
  ['..F..', '.fYf.', '..W..', '..W..', '..W..'],
  ['..h..', '.AAA.', 'AaAAA', 'AAAAA', '.AAA.'],
];

interface Grid {
  p: number;
  /** The body on the pixel grid. */
  box: Box;
  /** The hole on the pixel grid. */
  hole: Box;
  cx: number;
  cy: number;
  /** Label tab width and height (camera, chat). */
  tabWidth: number;
  tabHeight: number;
  slots: number;
}

function grid(g: Geometry): Grid {
  const p = unit(g);
  const cx = snap(g.w / 2, p);
  const width = even(g.body.x1 - g.body.x0 - p, p);
  const height = even(g.body.y1 - g.body.y0 - p, p);
  const y0 = snap(g.body.y0, p);
  const box = { x0: cx - width / 2, y0, x1: cx + width / 2, y1: y0 + height };
  const hole = g.piece === 'badge' ? box : inset(box, BAND * p);
  const slots = Math.max(3, Math.min(9, Math.floor((width - 30 * p) / (SLOT * p))));
  return {
    p,
    box,
    hole,
    cx,
    cy: snap((box.y0 + box.y1) / 2, p),
    tabWidth: even(g.tab.width, p),
    tabHeight: even(g.tab.out, p),
    slots,
  };
}

/** The silhouette on the pixel grid; `shrink` narrows the features for an inner copy. */
function spec(g: Geometry, { p, box, tabWidth, tabHeight, slots }: Grid, shrink = 0): ShapeSpec {
  const corners = { kind: 'step', size: 2 * p } as const;
  if (g.piece === 'badge' || g.piece === 'screen') {
    return { corners, hole: { kind: 'square', size: 0 } };
  }
  const tall = box.y1 - box.y0;
  const wing = Math.min(12 * p, even(tall * 0.3, p));
  return {
    corners,
    top: [{ kind: 'step', at: 0.5, width: tabWidth - 2 * shrink, height: tabHeight }],
    bottom: [{ kind: 'rect', at: 0.5, width: (slots * SLOT + 2) * p - 2 * shrink, height: 5 * p }],
    left: [{ kind: 'step', at: 0.5, width: wing - 2 * shrink, height: 2 * p }],
    right: [{ kind: 'step', at: 0.5, width: wing - 2 * shrink, height: 2 * p }],
    hole: { kind: 'square', size: 0 },
  };
}

interface Palette {
  outline: string;
  grass: string;
  grassDark: string;
  dirt: string;
  dirtDark: string;
  dirtLight: string;
  plank: string;
  plankDark: string;
  plankLight: string;
  stone: string;
  stoneDark: string;
  stoneLight: string;
  ore: string;
  oreLight: string;
}

function paletteFor(g: Geometry): Palette {
  const { look } = g;
  return {
    outline: mix(look.track, '#000000', 0.6),
    grass: look.accent(48, 1, 0.5),
    grassDark: look.accent(36, 1, 0.55),
    dirt: look.win(31, 1, 0.38),
    dirtDark: look.win(23, 1, 0.4),
    dirtLight: look.win(40, 1, 0.34),
    plank: look.win(43, 1, 0.42),
    plankDark: look.win(30, 1, 0.42),
    plankLight: look.win(53, 1, 0.42),
    stone: mix(look.track, '#ffffff', 0.44),
    stoneDark: mix(look.track, '#ffffff', 0.3),
    stoneLight: mix(look.track, '#ffffff', 0.58),
    ore: look.win(55),
    oreLight: look.win(78),
  };
}

/** Grass on top, dirt below, speckled cell by cell, inside the band between two boxes. */
function Soil({ grid: { p, box, hole }, colors }: { grid: Grid; colors: Palette }) {
  const outer = inset(box, p);
  const inner = inset(hole, -p);
  const paths = { grass: '', grassDark: '', dirtDark: '', dirtLight: '' };
  const cell = (x: number, y: number) => `M${x} ${y}h${p}v${p}h${-p}Z`;
  const inBand = (x: number, y: number) =>
    !(x >= inner.x0 && x < inner.x1 && y >= inner.y0 && y < inner.y1);
  for (let y = outer.y0; y < outer.y1; y += p) {
    const row = (y - outer.y0) / p;
    for (let x = outer.x0; x < outer.x1; x += p) {
      if (!inBand(x, y)) {
        x = inner.x1 - p;
        continue;
      }
      const n = noise(x / p, y / p);
      if (row < 2 || (row === 2 && n < 45)) {
        if (n < 35) paths.grassDark += cell(x, y);
        else paths.grass += cell(x, y);
      } else if (n < 18) paths.dirtDark += cell(x, y);
      else if (n > 88) paths.dirtLight += cell(x, y);
    }
  }
  return (
    <>
      <path d={paths.grass} fill={colors.grass} />
      <path d={paths.grassDark} fill={colors.grassDark} />
      <path d={paths.dirtDark} fill={colors.dirtDark} />
      <path d={paths.dirtLight} fill={colors.dirtLight} />
    </>
  );
}

/** Oak planks filling a box, with seams every four pixels. */
function Planks({ box, p, colors }: { box: Box; p: number; colors: Palette }) {
  const seams: string[] = [];
  const highlights: string[] = [];
  for (let y = box.y0; y < box.y1; y += 4 * p) {
    highlights.push(`M${box.x0} ${y}h${box.x1 - box.x0}v${p}h${-(box.x1 - box.x0)}Z`);
    if (y + 3 * p < box.y1)
      seams.push(`M${box.x0} ${y + 3 * p}h${box.x1 - box.x0}v${p}h${-(box.x1 - box.x0)}Z`);
    const offset = ((y - box.y0) / (4 * p)) % 2 ? 6 * p : 0;
    for (let x = box.x0 + offset + 9 * p; x < box.x1 - p; x += 12 * p) {
      seams.push(`M${x} ${y}h${p}v${Math.min(3 * p, box.y1 - y)}h${-p}Z`);
    }
  }
  return (
    <>
      <path d={`M${box.x0} ${box.y0}H${box.x1}V${box.y1}H${box.x0}Z`} fill={colors.plank} />
      <path d={highlights.join('')} fill={colors.plankLight} fillOpacity={0.55} />
      <path d={seams.join('')} fill={colors.plankDark} />
    </>
  );
}

function StoneWing({
  x0,
  y0,
  width,
  height,
  p,
  colors,
}: {
  x0: number;
  y0: number;
  width: number;
  height: number;
  p: number;
  colors: Palette;
}) {
  const dark: string[] = [];
  const light: string[] = [];
  const ore: string[] = [];
  const oreLight: string[] = [];
  for (let y = y0; y < y0 + height; y += p) {
    for (let x = x0; x < x0 + width; x += p) {
      const n = noise(x / p + 7, y / p + 3);
      const cell = `M${x} ${y}h${p}v${p}h${-p}Z`;
      if (n < 14) ore.push(cell);
      else if (n < 20) oreLight.push(cell);
      else if (n < 42) dark.push(cell);
      else if (n > 85) light.push(cell);
    }
  }
  return (
    <>
      <path d={`M${x0} ${y0}h${width}v${height}h${-width}Z`} fill={colors.stone} />
      <path d={dark.join('')} fill={colors.stoneDark} />
      <path d={light.join('')} fill={colors.stoneLight} />
      <path d={ore.join('')} fill={colors.ore} />
      <path d={oreLight.join('')} fill={colors.oreLight} />
    </>
  );
}

function Torch({
  x,
  y,
  p,
  g,
  delay,
}: {
  x: number;
  y: number;
  p: number;
  g: Geometry;
  delay: number;
}) {
  const flicker = g.motion ? anim('flicker', { dur: 0.9, delay }) : null;
  const glow = g.motion ? anim('pulse', { dur: 1.8, delay }) : null;
  const top = y - (TORCH_FLAME.length + TORCH_STICK.length) * p;
  return (
    <>
      <g className={glow?.className} style={glow?.style}>
        <g opacity={0.45}>{pixels(TORCH_HALO, { h: g.look.win(75) }, x, top - p, p)}</g>
      </g>
      {pixels(TORCH_STICK, { W: g.look.win(28, 1, 0.45) }, x, top + TORCH_FLAME.length * p, p)}
      <g className={flicker?.className} style={flicker?.style}>
        {pixels(
          TORCH_FLAME,
          { f: g.look.win(55), F: g.look.win(72), Y: g.look.win(90) },
          x,
          top,
          p,
        )}
      </g>
    </>
  );
}

function Orb({
  x,
  y,
  p,
  g,
  delay,
}: {
  x: number;
  y: number;
  p: number;
  g: Geometry;
  delay: number;
}) {
  const bob = g.motion
    ? anim('bob', { dur: 2.2, delay, vars: { '--fr-bob': `${-2 * p}px` } })
    : null;
  const pulse = g.motion ? anim('pulse', { dur: 1.4, delay }) : null;
  return (
    <g className={bob?.className} style={bob?.style}>
      <g className={pulse?.className} style={pulse?.style}>
        {pixels(ORB, { o: g.look.accent(55, 1, 0.9), O: g.look.win(82) }, x, y, p)}
      </g>
    </g>
  );
}

function Hotbar({ g, grid: gr, colors }: { g: Geometry; grid: Grid; colors: Palette }) {
  const { p, slots, cx, box } = gr;
  const width = slots * SLOT * p;
  const x0 = cx - width / 2;
  const y0 = box.y1 - 2 * p;
  const size = SLOT * p;
  const slotPaths: string[] = [];
  const edges: string[] = [];
  for (let i = 0; i < slots; i++) {
    const x = x0 + i * size;
    slotPaths.push(`M${x + p} ${y0 + p}h${size - 2 * p}v${size - 2 * p}h${-(size - 2 * p)}Z`);
    edges.push(`M${x} ${y0}h${size}v${p}h${-size}ZM${x} ${y0}h${p}v${size}h${-p}Z`);
  }
  const itemColors = {
    W: colors.stoneLight,
    L: colors.stone,
    H: colors.plankDark,
    G: colors.grass,
    g: colors.grassDark,
    D: colors.dirt,
    d: colors.dirtDark,
    F: g.look.win(72),
    f: g.look.win(55),
    Y: g.look.win(90),
    A: g.look.win(62),
    a: g.look.win(85),
    h: g.look.accent(40, 1, 0.5),
  };
  const select = g.motion
    ? { className: 'fr-anim fr-blk-slot', style: { '--slot': `${size}px` } as CSSProperties }
    : null;
  return (
    <>
      <path
        d={`M${x0 - p} ${y0 - p}h${width + 2 * p}v${size + 2 * p}h${-(width + 2 * p)}Z`}
        fill={colors.outline}
      />
      <path d={`M${x0} ${y0}h${width}v${size}h${-width}Z`} fill={colors.stoneLight} />
      <path d={slotPaths.join('')} fill={colors.stoneDark} />
      <path d={edges.join('')} fill={colors.stone} />
      {ITEMS.slice(0, slots).map((rows, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a fixed row of items.
        <g key={i}>{pixels(rows, itemColors, x0 + i * size + p, y0 + p, p)}</g>
      ))}
      <path
        d={`M${x0 - p} ${y0 - p}h${size + 2 * p}v${size + 2 * p}h${-(size + 2 * p)}ZM${x0} ${y0}v${size}h${size}v${-size}Z`}
        fill="#ffffff"
        fillRule="evenodd"
        className={select?.className}
        style={select?.style}
      />
    </>
  );
}

export const pixel: Art = {
  // Experience-orb green hopping around the picture's edge, a pixel at a time.
  runner: (g) => {
    const { p, hole } = grid(g);
    return {
      path: 'hole',
      // Down the middle of the dark ring around the picture.
      d: holePath(inset(hole, -p / 2), { kind: 'square', size: 0 }),
      color: g.look.accent(62),
      width: p,
      dur: 10,
      pixel: true,
    };
  },
  shape: (g) => spec(g, grid(g)),

  draw: (g) => {
    const gr = grid(g);
    const { p, box, hole, cx, cy } = gr;
    const { look, piece } = g;
    const colors = paletteFor(g);
    const block = {
      k: colors.outline,
      G: colors.grass,
      g: colors.grassDark,
      D: colors.dirt,
      d: colors.dirtDark,
    };

    if (piece === 'badge') {
      const inner = inset(box, p);
      return (
        <g shapeRendering="crispEdges">
          <path d={outlinePath(box, spec(g, gr))} fill={colors.outline} />
          <Planks box={inner} p={p} colors={colors} />
          <path
            d={`M${inner.x0} ${inner.y0}h${inner.x1 - inner.x0}v${p}h${-(inner.x1 - inner.x0)}Z`}
            fill={colors.grass}
          />
        </g>
      );
    }

    const outer = outlinePath(box, spec(g, gr)) + holePath(hole, { kind: 'square', size: 0 });
    const soil =
      outlinePath(inset(box, p), spec(g, gr, p)) +
      holePath(inset(hole, -p), { kind: 'square', size: 0 });
    const size = GRASS_BLOCK.length * p;
    const corners = [
      [box.x0 - 3 * p, box.y0 - 3 * p],
      [box.x1 - size + 3 * p, box.y0 - 3 * p],
      [box.x0 - 3 * p, box.y1 - size + 3 * p],
      [box.x1 - size + 3 * p, box.y1 - size + 3 * p],
    ];
    const common = (
      <>
        <path d={outer} fill={colors.outline} fillRule="evenodd" />
        <path d={soil} fill={colors.dirt} fillRule="evenodd" />
        <Soil grid={gr} colors={colors} />
      </>
    );

    if (piece === 'screen') {
      return (
        <g shapeRendering="crispEdges">
          {common}
          {corners.map(([x, y]) => (
            <g key={`${x},${y}`}>{pixels(GRASS_BLOCK, block, Math.max(0, x), Math.max(0, y), p)}</g>
          ))}
          <Torch x={box.x0 + 16 * p} y={hole.y1} p={p} g={g} delay={0} />
          <Torch x={box.x1 - 19 * p} y={hole.y1} p={p} g={g} delay={0.4} />
        </g>
      );
    }

    const tabHalf = gr.tabWidth / 2;
    const tabTop = box.y0 - gr.tabHeight;
    const q = gr.tabHeight / 2;
    const wing = Math.min(12 * p, even((box.y1 - box.y0) * 0.3, p));
    const wingTop = cy - wing / 2 + p;
    const flowerX = hole.x1 - 9 * p;

    return (
      <g shapeRendering="crispEdges">
        {common}
        {/* The label's plank sign, over the tab and the band under it. */}
        <Planks
          box={{
            x0: cx - tabHalf + p,
            y0: tabTop + q + p,
            x1: cx + tabHalf - p,
            y1: hole.y0 - p,
          }}
          p={p}
          colors={colors}
        />
        <Planks
          box={{
            x0: cx - tabHalf + q + p,
            y0: tabTop + p,
            x1: cx + tabHalf - q - p,
            y1: tabTop + q + p,
          }}
          p={p}
          colors={colors}
        />
        <path
          d={`M${cx - tabHalf} ${box.y0}h${p}v${hole.y0 - box.y0}h${-p}ZM${cx + tabHalf - p} ${box.y0}h${p}v${hole.y0 - box.y0}h${-p}Z`}
          fill={colors.outline}
        />
        <StoneWing
          x0={box.x0 - p}
          y0={wingTop}
          width={5 * p}
          height={wing - 2 * p}
          p={p}
          colors={colors}
        />
        <StoneWing
          x0={box.x1 - 4 * p}
          y0={wingTop}
          width={5 * p}
          height={wing - 2 * p}
          p={p}
          colors={colors}
        />
        <Hotbar g={g} grid={gr} colors={colors} />
        {corners.map(([x, y]) => (
          <g key={`${x},${y}`}>{pixels(GRASS_BLOCK, block, x, y, p)}</g>
        ))}
        <Torch x={cx - tabHalf - 6 * p} y={box.y0 + p} p={p} g={g} delay={0} />
        <Torch x={cx + tabHalf + 3 * p} y={box.y0 + p} p={p} g={g} delay={0.35} />
        <Orb x={cx - (gr.slots * SLOT * p) / 2 - 7 * p} y={box.y1 - 2 * p} p={p} g={g} delay={0} />
        <Orb
          x={cx + (gr.slots * SLOT * p) / 2 + 4 * p}
          y={box.y1 - 3 * p}
          p={p}
          g={g}
          delay={0.8}
        />
        <g
          className={g.motion ? 'fr-anim fr-bob' : undefined}
          style={{ '--fr-bob': `${-p}px`, '--fr-dur': '3s' } as CSSProperties}
        >
          {pixels(
            FLOWER,
            { R: look.win(58), Y: look.win(88), S: colors.grassDark },
            flowerX,
            hole.y1 - FLOWER.length * p,
            p,
          )}
        </g>
      </g>
    );
  },
};
