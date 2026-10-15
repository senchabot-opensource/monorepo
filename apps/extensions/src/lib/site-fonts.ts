/**
 * Fonts a widget can be drawn in instead of its preset's own: the Chat Box's list, so every
 * widget offers the same ones. All but the viewer's system font come from Google Fonts.
 */
export const SITE_FONTS = ['inter', 'roboto', 'nunito', 'mono', 'serif', 'system'] as const;
export type SiteFont = (typeof SITE_FONTS)[number];

export const isSiteFont = (value: unknown): value is SiteFont =>
  SITE_FONTS.some((font) => font === value);

export const SITE_FONT_STACKS: Record<SiteFont, string> = {
  inter: '"Inter", ui-sans-serif, system-ui, sans-serif',
  roboto: '"Roboto", ui-sans-serif, system-ui, sans-serif',
  nunito: '"Nunito", ui-sans-serif, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  serif: '"Source Serif 4", ui-serif, Georgia, serif',
  system: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
};

/** The family names as the font pickers list them; the system font's is translated. */
export const SITE_FONT_NAMES: Record<Exclude<SiteFont, 'system'>, string> = {
  inter: 'Inter',
  roboto: 'Roboto',
  nunito: 'Nunito',
  mono: 'JetBrains Mono',
  serif: 'Source Serif 4',
};

// Every weight a preset's titles and numbers can ask for: each one is a variable font.
const PRESET_FAMILIES: Record<Exclude<SiteFont, 'system'>, string> = {
  inter: 'Inter:wght@400..900',
  roboto: 'Roboto:wght@400..900',
  nunito: 'Nunito:wght@400..900',
  mono: 'JetBrains+Mono:wght@400..800',
  serif: 'Source+Serif+4:wght@400..900',
};

/** The Google Fonts stylesheet for drawing a preset in the font; empty for the system font. */
export const presetFontHref = (font: SiteFont): string =>
  font === 'system'
    ? ''
    : `https://fonts.googleapis.com/css2?family=${PRESET_FAMILIES[font]}&display=swap`;
