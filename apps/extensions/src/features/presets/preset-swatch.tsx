import type { PresetData } from './preset-schema';
import { PRESETS } from './registry';

/** How the classic look is drawn in a swatch: each overlay's dark panel and Oxanium. */
const CLASSIC_SWATCH = {
  panel: '#24242c',
  panel2: '#0a0a0e',
  frame: '#52525b',
  accent: '#8b5cf6',
  text: '#ffffff',
  font: "'Oxanium', sans-serif",
};

// Only "Aa" is drawn, so Google Fonts sends each font cut down to those two letters.
const SWATCH_FAMILIES = [
  'Oxanium:wght@700',
  ...new Set(
    PRESETS.map(
      ({ data }) =>
        `${data.fonts.display.family.replaceAll(' ', '+')}:wght@${data.fonts.display.weights}`,
    ),
  ),
];
export const SWATCH_FONT_HREF = `https://fonts.googleapis.com/css2?${SWATCH_FAMILIES.map((family) => `family=${family}`).join('&')}&text=Aa&display=swap`;

/** A tiny panel in the preset's colors, frame and font, with a bar in its accent. */
export function PresetSwatch({ preset }: { preset: PresetData | null }) {
  const look = preset
    ? {
        ...preset.colors,
        font: `'${preset.fonts.display.family}', ${preset.fonts.display.fallback}`,
      }
    : CLASSIC_SWATCH;
  const square = preset ? preset.radius === 0 : false;
  return (
    <span
      aria-hidden="true"
      className="relative block h-12 overflow-hidden"
      style={{
        borderRadius: square ? 2 : 6,
        background: `linear-gradient(180deg, ${look.panel}, ${look.panel2})`,
        boxShadow: `inset 0 0 0 1px ${look.frame}`,
      }}
    >
      <span
        className="absolute top-1.5 left-2 text-lg leading-none font-bold"
        style={{ color: look.text, fontFamily: look.font, fontSynthesis: 'none' }}
      >
        Aa
      </span>
      <span
        className="absolute right-2 bottom-2 left-2 h-1.5 overflow-hidden"
        style={{ borderRadius: square ? 0 : 99, background: 'rgba(0,0,0,.55)' }}
      >
        <span className="block h-full w-3/5" style={{ background: look.accent }} />
      </span>
    </span>
  );
}
