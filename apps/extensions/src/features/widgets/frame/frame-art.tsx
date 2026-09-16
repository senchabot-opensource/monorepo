import { type CSSProperties, useId, useLayoutEffect, useRef, useState } from 'react';
import type { FrameKind } from '#/features/presets/preset-schema';
import { titleStyle } from '#/features/presets/skin';
import type { FramePiece } from '#/lib/frame-url';
import { classic } from './art/classic';
import { gilded } from './art/gilded';
import { hud } from './art/hud';
import { iron } from './art/iron';
import { lacquer } from './art/lacquer';
import { ornate } from './art/ornate';
import { pixel } from './art/pixel';
import { Runner } from './art/shared';
import { tactical } from './art/tactical';
import type { Art, Geometry, Look } from './frame-look';
import { type Box, holePath, inset, outlinePath } from './shape';

export const ARTS: Record<FrameKind | 'classic', Art> = {
  classic,
  gilded,
  ornate,
  lacquer,
  iron,
  tactical,
  hud,
  pixel,
};

/** Size unit per piece: 1 on a 360px-high webcam, a 420px-wide chat or a 1080px-high screen. */
function unitFor(piece: FramePiece, width: number, height: number) {
  const base = piece === 'camera' ? height : piece === 'chat' ? width * 0.86 : height / 3;
  return Math.max(0.4, Math.min(4, Math.min(base, width, height) / 360));
}

interface Sizes {
  width: number;
  height: number;
  /** The label's measured width, 0 when there's none. */
  labelWidth: number;
}

export function geometryFor(
  piece: FramePiece,
  { width, height, labelWidth }: Sizes,
  look: Look,
  motion: boolean,
  id: (name: string) => string,
): Geometry {
  const s = unitFor(piece, width, height);
  const t = 12 * s;
  const common = { w: width, h: height, s, t, piece, look, motion, id };
  if (piece === 'screen') {
    const body = inset({ x0: 0, y0: 0, x1: width, y1: height }, 0.35 * t);
    return { ...common, body, hole: inset(body, t), tab: { cx: width / 2, width: 0, out: 0 } };
  }
  // Room above for the label tab, below for a tray, at the sides for wings.
  const body = { x0: 1.2 * t, y0: 1.9 * t, x1: width - 1.2 * t, y1: height - 1.4 * t };
  const span = body.x1 - body.x0;
  const tabWidth = Math.min(span * 0.8, Math.max(span * 0.3, labelWidth + 5 * t));
  return {
    ...common,
    body,
    hole: inset(body, t),
    tab: { cx: width / 2, width: tabWidth, out: 1.5 * t },
  };
}

/** The small plate the screen piece's label sits on, over the middle of its bottom band. */
function badgeGeometry(screen: Geometry, labelWidth: number): Geometry {
  const { t } = screen;
  const width = labelWidth + 5 * t;
  const cx = screen.w / 2;
  const y1 = screen.body.y1 - 0.2 * t;
  const body: Box = { x0: cx - width / 2, y0: y1 - 2.6 * t, x1: cx + width / 2, y1 };
  return { ...screen, body, hole: body, tab: { cx, width: 0, out: 0 }, piece: 'badge' };
}

interface FrameArtProps {
  look: Look;
  piece: FramePiece;
  width: number;
  height: number;
  label: string;
  motion: boolean;
}

/** One frame, `width` × `height`, hollow in the middle so the camera or chat under it shows. */
export function FrameArt({ look, piece, width, height, label, motion }: FrameArtProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const labelRef = useRef<HTMLSpanElement>(null);
  const [labelWidth, setLabelWidth] = useState(0);
  const art = ARTS[look.kind];
  const idFor = (prefix: string) => (name: string) => `fr${uid}-${prefix}${name}`;

  // The tab grows to fit the label, which is only known once the font has laid it out.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure when the text changes.
  useLayoutEffect(() => {
    const element = labelRef.current;
    if (!element) {
      setLabelWidth(0);
      return;
    }
    const measure = () => setLabelWidth(element.offsetWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [label]);

  const g = geometryFor(piece, { width, height, labelWidth }, look, motion, idFor(''));
  const spec = art.shape(g);
  const edge = outlinePath(g.body, spec);
  const hole = holePath(g.hole, spec.hole);
  const runner = motion ? art.runner?.(g) : undefined;
  const badge = piece === 'screen' && label ? badgeGeometry(g, labelWidth) : null;

  const labelAt = badge
    ? { cx: badge.tab.cx, cy: (badge.body.y0 + badge.body.y1) / 2 }
    : { cx: g.tab.cx, cy: g.body.y0 + (g.t - g.tab.out) / 2 + (art.labelShift?.(g) ?? 0) };

  return (
    <div
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      className={motion ? undefined : 'fr-still'}
      data-testid="frame-art"
      data-piece={piece}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        aria-hidden="true"
      >
        {art.draw(g, { outline: edge + hole, hole })}
        {badge &&
          art.draw(
            { ...badge, id: idFor('badge-') },
            { outline: outlinePath(badge.body, art.shape(badge)), hole: '' },
          )}
      </svg>
      {runner && (
        // Its own layer: the streaks repaint every frame, the drawing under them doesn't.
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: 'absolute', inset: 0, overflow: 'visible', willChange: 'transform' }}
          aria-hidden="true"
        >
          <Runner
            d={runner.d ?? (runner.path === 'edge' ? edge : hole)}
            color={runner.color}
            width={runner.width}
            dur={runner.dur}
            pixel={runner.pixel}
          />
        </svg>
      )}
      {label && (
        <span
          ref={labelRef}
          style={{
            ...labelStyle(g, art),
            position: 'absolute',
            left: labelAt.cx,
            top: labelAt.cy,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function labelStyle(g: Geometry, art: Art): CSSProperties {
  const { look, t } = g;
  return {
    fontFamily: look.font,
    fontSize: 1.15 * t,
    lineHeight: 1,
    fontWeight: 700,
    color: art.labelColor?.(g) ?? look.text,
    whiteSpace: 'nowrap',
    fontSynthesis: 'none',
    ...(look.skin
      ? // The preset's text shadow is made for text over the game; on a tab it smears.
        { ...titleStyle(look.skin), textShadow: '0 1px 2px rgba(0,0,0,.85)' }
      : {
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          textShadow: `0 0 ${0.8 * t}px ${look.accent(60, 0.8)}`,
        }),
  };
}
