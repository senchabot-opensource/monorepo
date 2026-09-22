import type { CSSProperties } from 'react';
import { panelStyle } from './frame';
import type { Skin } from './skin';

type Paint = (s: number, l: number, a?: number) => string;

/**
 * A progress bar's outer box in a preset: its panel, slant and a glow in the fill's color.
 * `shadowScale` shrinks the drop shadow for a thinner bar.
 */
export function barFrameStyle(skin: Skin, glow: string, shadowScale = 1): CSSProperties {
  const panel = panelStyle(skin, 6);
  const shadow = panelStyle(skin, 6, shadowScale).boxShadow;
  return {
    ...panel,
    transform: skin.skew ? `skewX(${skin.skew}deg)` : undefined,
    boxShadow: [shadow, glow].filter(Boolean).join(','),
  };
}

export const trackBackground = (skin: Skin) =>
  `linear-gradient(180deg, ${skin.track} 0%, #000 100%)`;

/** The fill's gradient; `blocks` shades in two hard steps, like a pixel game's bar. */
export function fillBackground(skin: Skin, paint: Paint): string {
  switch (skin.fill) {
    case 'blocks':
      return `linear-gradient(180deg, ${paint(95, 72)} 0 30%, ${paint(88, 50)} 30% 78%, ${paint(85, 34)} 78% 100%)`;
    case 'flat':
      return `linear-gradient(180deg, ${paint(95, 62)} 0%, ${paint(88, 52)} 100%)`;
    default:
      return `linear-gradient(180deg, ${paint(95, 72)} 0%, ${paint(88, 52)} 42%, ${paint(85, 34)} 100%)`;
  }
}

/** What goes on top of the fill: moving stripes and a glossy top edge, and how wide ticks are. */
export function fillLayers(skin: Skin | null) {
  const fill = skin?.fill;
  return {
    stripes: !skin || fill === 'stripes',
    gloss: !skin || fill === 'gloss' || fill === 'stripes',
    // Blocks read as separate cells, so their seams are wider.
    tickWidth: fill === 'blocks' ? 4 : 2,
  };
}
