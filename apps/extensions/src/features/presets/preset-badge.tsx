import type { CSSProperties } from 'react';
import type { PresetData } from './preset-schema';
import { PRESETS } from './registry';

// Classic's dot: the overlays' own dark panel and purple accent.
const CLASSIC_COLORS = { accent: '#8b5cf6', panel: '#24242c', frame: '#52525b' };

// Only the presets' names are drawn, so Google Fonts sends each display font cut down to their
// letters; a community preset's name brings its own.
const NAME_TEXT = [...new Set(PRESETS.flatMap(({ data }) => Array.from(data.name)))].join('');
const NAME_FAMILIES = [
  ...new Set(
    PRESETS.map(
      ({ data }) =>
        `${data.fonts.display.family.replaceAll(' ', '+')}:wght@${data.fonts.display.weights}`,
    ),
  ),
];
/** Every preset's display font, for drawing the presets' names in them. */
export const PRESET_NAME_FONT_HREF = `https://fonts.googleapis.com/css2?${NAME_FAMILIES.map((family) => `family=${family}`).join('&')}&text=${encodeURIComponent(NAME_TEXT)}&display=swap`;

/** A preset's name in its own display font; classic's stays in the page's. */
export const presetNameStyle = (
  preset: PresetData | null | undefined,
): CSSProperties | undefined =>
  preset
    ? {
        fontFamily: `'${preset.fonts.display.family}', ${preset.fonts.display.fallback}`,
        // A one-weight display font stays as drawn instead of a smeared fake bold.
        fontSynthesis: 'none',
      }
    : undefined;

/** The pill a preset badge is: the home page's quick preset buttons and the setup pages' picker. */
export const PRESET_BADGE_CLASS =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors select-none hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-white';

/** Picked, on a button pressed with aria-pressed. */
export const PRESET_BADGE_PRESSED =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 aria-pressed:border-green-600 aria-pressed:bg-green-600 aria-pressed:text-white dark:focus-visible:ring-offset-zinc-950 dark:aria-pressed:border-green-500 dark:aria-pressed:bg-green-500 dark:aria-pressed:text-zinc-950';

/** Picked, on a label around a checked radio. */
export const PRESET_BADGE_CHECKED =
  'has-focus-visible:ring-2 has-focus-visible:ring-green-500 has-focus-visible:ring-offset-2 has-checked:border-green-600 has-checked:bg-green-600 has-checked:text-white dark:has-focus-visible:ring-offset-zinc-950 dark:has-checked:border-green-500 dark:has-checked:bg-green-500 dark:has-checked:text-zinc-950';

/** A dot in the preset's accent and panel colors, ringed in its frame color. */
export function PresetDot({ preset }: { preset: PresetData | null }) {
  const { accent, panel, frame } = preset?.colors ?? CLASSIC_COLORS;
  return (
    <span
      aria-hidden="true"
      className="size-3.5 shrink-0 rounded-full"
      style={{
        background: `linear-gradient(135deg, ${accent} 0 50%, ${panel} 50% 100%)`,
        boxShadow: `inset 0 0 0 1px ${frame}`,
      }}
    />
  );
}

/** What a badge shows: the dot, and the preset's name in its font. */
export function PresetBadgeLabel({ preset, name }: { preset: PresetData | null; name: string }) {
  return (
    <>
      <PresetDot preset={preset} />
      <span style={presetNameStyle(preset)}>{name}</span>
    </>
  );
}
