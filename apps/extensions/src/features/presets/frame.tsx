import type { CSSProperties } from 'react';
import { rgba, type Skin, shade } from './skin';

// Frames are CSS borders, gradients and small shapes only: blur filters and SVG masks cost too
// much in an OBS browser source that also runs the game capture.

/** A pixel frame's step, in px. */
const PIXEL = 3;

/** Corner cut of the tactical frame, in px at scale 1. */
const CUT = 14;

const cutPolygon = (cut: number) =>
  `polygon(${cut}px 0,100% 0,100% calc(100% - ${cut}px),calc(100% - ${cut}px) 100%,0 100%,0 ${cut}px)`;

const solid = (color: string) => color.replace(/,[\d.]+\)$/, ',1)');

/**
 * Background, radius and outer shadow of a preset panel. `radius` is the overlay's own radius
 * for that element; the preset scales it. `opacity` replaces the preset's panel opacity, e.g.
 * with Chat Box's own setting. The element needs `position: relative` for its Frame.
 */
export function panelStyle(skin: Skin, radius: number, scale = 1, opacity?: number): CSSProperties {
  const top = opacity === undefined ? skin.panel : rgba(skin.colors.panel, opacity);
  const bottom = opacity === undefined ? skin.panel2 : rgba(skin.colors.panel2, opacity);
  const style: CSSProperties = {
    background: `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`,
    borderRadius: radius * skin.radius,
    boxShadow: `0 ${Math.round(10 * scale)}px ${Math.round(30 * scale)}px rgba(0,0,0,.45)`,
  };
  switch (skin.frameKind) {
    case 'tactical':
      // A clipped box can't cast a shadow outside itself.
      return { ...style, clipPath: cutPolygon(CUT * scale), boxShadow: undefined };
    case 'pixel': {
      // Four offset copies of the background make a one-step ring with notched corners.
      const bg = bottom;
      return {
        ...style,
        borderRadius: 0,
        boxShadow: `0 -${PIXEL}px 0 0 ${bg},0 ${PIXEL}px 0 0 ${bg},-${PIXEL}px 0 0 0 ${bg},${PIXEL}px 0 0 0 ${bg}`,
      };
    }
    default:
      return style;
  }
}

const layer: CSSProperties = { position: 'absolute', pointerEvents: 'none' };

function Diamond({ skin, size, style }: { skin: Skin; size: number; style: CSSProperties }) {
  return (
    <span
      style={{
        ...layer,
        width: size,
        height: size,
        marginLeft: -size / 2,
        transform: 'rotate(45deg)',
        background: solid(skin.panel2),
        border: `${Math.max(1, size / 5)}px solid ${skin.frame}`,
        boxShadow: `0 0 ${size}px ${rgba(skin.frame, 0.35)}`,
        ...style,
      }}
    />
  );
}

/** An L of two lines in one corner; `corner` names the corner, e.g. "tl". */
function Bracket({
  corner,
  size,
  width,
  color,
  inset,
}: {
  corner: 'tl' | 'tr' | 'bl' | 'br';
  size: number;
  width: number;
  color: string;
  inset: number;
}) {
  const top = corner[0] === 't';
  const left = corner[1] === 'l';
  return (
    <span
      style={{
        ...layer,
        width: size,
        height: size,
        [top ? 'top' : 'bottom']: inset,
        [left ? 'left' : 'right']: inset,
        [top ? 'borderTop' : 'borderBottom']: `${width}px solid ${color}`,
        [left ? 'borderLeft' : 'borderRight']: `${width}px solid ${color}`,
      }}
    />
  );
}

const CORNERS = ['tl', 'tr', 'bl', 'br'] as const;

/**
 * The preset's frame drawn over a panel: borders and ornaments on a layer that ignores the
 * pointer. Put it last inside an element styled with panelStyle, at the same radius and scale.
 */
export function Frame({ skin, radius, scale = 1 }: { skin: Skin; radius: number; scale?: number }) {
  const r = radius * skin.radius;
  const px = (n: number) => Math.max(1, Math.round(n * scale));
  const fill: CSSProperties = { ...layer, inset: 0, borderRadius: r };

  switch (skin.frameKind) {
    case 'gilded':
      return (
        <span aria-hidden="true" style={{ ...layer, inset: 0 }}>
          <span
            style={{
              ...fill,
              border: `${px(2)}px solid ${skin.frame}`,
              // A border-image ignores the radius, so the gradient is kept to square panels.
              borderImage: r
                ? undefined
                : `linear-gradient(180deg, ${skin.frame}, ${skin.frame2}) 1`,
            }}
          />
          <span
            style={{
              ...layer,
              inset: px(5),
              borderRadius: Math.max(0, r - px(5)),
              border: `1px solid ${rgba(skin.frame, 0.28)}`,
            }}
          />
          {scale >= 0.8 && (
            <>
              <Diamond skin={skin} size={px(11)} style={{ left: '50%', top: -px(6) }} />
              <Diamond skin={skin} size={px(11)} style={{ left: '50%', bottom: -px(6) }} />
            </>
          )}
        </span>
      );

    case 'ornate':
      return (
        <span aria-hidden="true" style={{ ...layer, inset: 0 }}>
          <span
            style={{
              ...fill,
              border: `${px(3)}px solid ${skin.frame2}`,
              boxShadow: `inset 0 0 0 1px ${skin.frame}, 0 0 0 1px rgba(0,0,0,.85), inset 0 ${px(3)}px ${px(6)}px rgba(0,0,0,.5)`,
            }}
          />
          {CORNERS.map((corner) => (
            <span
              key={corner}
              style={{
                ...layer,
                width: px(10),
                height: px(10),
                borderRadius: '50%',
                [corner[0] === 't' ? 'top' : 'bottom']: -px(3),
                [corner[1] === 'l' ? 'left' : 'right']: -px(3),
                background: `radial-gradient(circle at 35% 30%, #fff8e0 0, ${skin.frame} 35%, ${skin.frame2} 100%)`,
                boxShadow: '0 0 0 1px rgba(0,0,0,.8)',
              }}
            />
          ))}
          {scale >= 0.8 && (
            <span
              style={{
                ...layer,
                left: '50%',
                top: -px(7),
                width: px(12),
                height: px(12),
                marginLeft: -px(6),
                transform: 'rotate(45deg)',
                background: `radial-gradient(circle at 35% 30%, ${shade(skin.accent, 80)}, ${shade(skin.accent, 45)} 60%, ${shade(skin.accent, 25)})`,
                border: `${px(2)}px solid ${skin.frame}`,
                boxShadow: '0 0 0 1px rgba(0,0,0,.8)',
              }}
            />
          )}
        </span>
      );

    case 'lacquer':
      return (
        <span aria-hidden="true" style={{ ...layer, inset: 0 }}>
          <span
            style={{
              ...fill,
              border: `${px(3)}px solid ${skin.frame2}`,
              boxShadow: '0 0 0 1px rgba(0,0,0,.7)',
            }}
          />
          <span
            style={{
              ...layer,
              inset: px(6),
              borderRadius: Math.max(0, r - px(6)),
              border: `1px solid ${rgba(skin.frame, 0.7)}`,
            }}
          />
          {CORNERS.map((corner) => (
            <Bracket
              key={corner}
              corner={corner}
              size={px(16)}
              width={px(3)}
              color={skin.frame}
              inset={px(2)}
            />
          ))}
        </span>
      );

    case 'iron':
      return (
        <span aria-hidden="true" style={{ ...layer, inset: 0 }}>
          <span
            style={{
              ...fill,
              border: `${px(2)}px solid ${skin.frame2}`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08), 0 0 0 1px rgba(0,0,0,.8)',
            }}
          />
          {CORNERS.map((corner) => {
            const size = px(12);
            const top = corner[0] === 't';
            const left = corner[1] === 'l';
            // A right triangle filling the corner, made from two borders.
            return (
              <span
                key={corner}
                style={{
                  ...layer,
                  width: 0,
                  height: 0,
                  [top ? 'top' : 'bottom']: 0,
                  [left ? 'left' : 'right']: 0,
                  [top ? 'borderTop' : 'borderBottom']: `${size}px solid ${skin.frame}`,
                  [left ? 'borderRight' : 'borderLeft']: `${size}px solid transparent`,
                }}
              />
            );
          })}
          <span
            style={{
              ...layer,
              left: '12%',
              right: '12%',
              bottom: 0,
              height: px(2),
              background: `linear-gradient(90deg, transparent, ${shade(skin.accent, 58)}, transparent)`,
              boxShadow: `0 0 ${px(10)}px ${shade(skin.accent, 50, 0.7)}`,
            }}
          />
        </span>
      );

    case 'tactical':
      return (
        <span aria-hidden="true" style={{ ...layer, inset: 0 }}>
          <span
            style={{
              ...layer,
              left: 0,
              top: 0,
              bottom: 0,
              width: px(4),
              background: shade(skin.accent, 62),
            }}
          />
          <Bracket corner="tr" size={px(12)} width={px(2)} color={skin.frame} inset={px(6)} />
          <span
            style={{
              ...layer,
              left: px(12),
              bottom: px(6),
              width: px(6),
              height: px(6),
              background: rgba(skin.frame, 0.6),
            }}
          />
        </span>
      );

    case 'hud':
      return (
        <span aria-hidden="true" style={{ ...layer, inset: 0 }}>
          <span style={{ ...fill, border: `1px solid ${skin.frame2}` }} />
          <span
            style={{
              ...layer,
              left: 0,
              right: 0,
              top: 0,
              height: px(3),
              borderRadius: `${r}px ${r}px 0 0`,
              background: `linear-gradient(90deg, ${shade(skin.accent, 58)} 0%, ${shade(skin.accent, 58)} 35%, transparent 100%)`,
            }}
          />
          {CORNERS.map((corner) => (
            <Bracket
              key={corner}
              corner={corner}
              size={px(10)}
              width={px(2)}
              color={rgba(skin.frame, 0.75)}
              inset={-px(1)}
            />
          ))}
        </span>
      );

    case 'pixel':
      return (
        <span
          aria-hidden="true"
          style={{
            ...layer,
            inset: 0,
            border: `${PIXEL}px solid ${skin.frame}`,
            borderImage: `linear-gradient(180deg, ${skin.frame}, ${skin.frame2}) 1`,
          }}
        />
      );
  }
}
