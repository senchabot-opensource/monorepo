import { shade, toTone } from '#/features/presets/skin';
import type { Art, Geometry } from '../frame-look';
import { outlinePath, type ShapeSpec } from '../shape';

// A pizza's edge: a soft rounded plate in the panel's oven brown, a thick crust rim baked lighter
// on top and darker underneath, and a thin line of sauce around the picture. Nothing else on it:
// no rivets, gems or corner pieces.

function shape(g: Geometry): ShapeSpec {
  const { t, piece, tab } = g;
  if (piece === 'badge') {
    return { corners: { kind: 'round', size: 1.1 * t }, hole: { kind: 'square', size: 0 } };
  }
  if (piece === 'screen') {
    return { corners: { kind: 'round', size: 1.8 * t }, hole: { kind: 'round', size: 1.1 * t } };
  }
  return {
    corners: { kind: 'round', size: 2.2 * t },
    top: [{ kind: 'round', at: 0.5, width: tab.width, height: tab.out }],
    hole: { kind: 'round', size: 1.2 * t },
  };
}

export const crust: Art = {
  // Light catching the crust as it goes round.
  runner: (g) => ({ path: 'edge', color: g.look.win(80), width: 0.16 * g.t, dur: 12 }),
  shape,

  draw: (g, { outline, hole }) => {
    const { t, look } = g;
    const baked = toTone(look.frame);
    const edge = outlinePath(g.body, shape(g));
    return (
      <>
        <defs>
          <linearGradient id={g.id('plate')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={look.panel} stopOpacity={0.96} />
            <stop offset="1" stopColor={look.panel2} stopOpacity={0.96} />
          </linearGradient>
          <linearGradient id={g.id('crust')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={shade(baked, 74)} />
            <stop offset="0.45" stopColor={look.frame} />
            <stop offset="1" stopColor={shade(baked, 40)} />
          </linearGradient>
        </defs>
        <path d={outline} fill={`url(#${g.id('plate')})`} fillRule="evenodd" />
        <path d={edge} fill="none" stroke="#000" strokeOpacity={0.55} strokeWidth={0.62 * t} />
        <path d={edge} fill="none" stroke={`url(#${g.id('crust')})`} strokeWidth={0.5 * t} />
        {hole && (
          <path
            d={hole}
            fill="none"
            stroke={look.frame2}
            strokeOpacity={0.9}
            strokeWidth={0.16 * t}
          />
        )}
      </>
    );
  },
};
