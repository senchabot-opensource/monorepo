import type { SubathonColor } from '#/lib/subathon-url';
import type { SubathonPlatform } from './subathon/subathon-events';

/** Oxanium: Subathon Timer, Sub Goal and Chat Poll share it, so they read as one family on stream. */
export const OVERLAY_FONT_URL =
  'https://fonts.googleapis.com/css2?family=Oxanium:wght@500;700;800&display=swap';
export const OVERLAY_FONT_FAMILY = "'Oxanium', ui-sans-serif, system-ui, sans-serif";

export const hsl = (hue: number, s: number, l: number, a = 1) => `hsl(${hue} ${s}% ${l}% / ${a})`;

/** Twitch purple and Kick green, where an overlay tags a platform. */
export const PLATFORM_COLORS: Record<SubathonPlatform, string> = {
  twitch: '#a970ff',
  kick: '#53fc18',
};

const HUES: Record<Exclude<SubathonColor, 'hp'>, number> = {
  green: 142,
  purple: 265,
  red: 356,
  gold: 42,
  cyan: 188,
  pink: 322,
};

/** Accent hue. `hp` goes green, then amber, then red as the clock runs down. */
export function hueFor(color: SubathonColor, health: number): number {
  if (color !== 'hp') return HUES[color];
  const h = Math.max(0, Math.min(1, health));
  if (h >= 0.6) return HUES.green;
  if (h >= 0.3) return HUES.gold + ((h - 0.3) / 0.3) * (HUES.green - HUES.gold);
  return (h / 0.3) * HUES.gold;
}
