// Color helpers shared by skin.ts and the effect modules in fx/, which skin.ts itself imports.

/** A color as hue and saturation; overlays pick the lightness, like they do with their hues. */
export interface Tone {
  h: number;
  s: number;
}

export function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function toTone(hex: string): Tone {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0 };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: Math.round(((h * 60 + 360) % 360) * 10) / 10, s: Math.round(s * 1000) / 10 };
}

export const rgba = (hex: string, alpha: number) => `rgba(${hexToRgb(hex).join(',')},${alpha})`;

/** A tone at a lightness, the same way the overlays write their own hsl() colors. */
export const shade = (tone: Tone, l: number, a = 1) => `hsl(${tone.h} ${tone.s}% ${l}% / ${a})`;
