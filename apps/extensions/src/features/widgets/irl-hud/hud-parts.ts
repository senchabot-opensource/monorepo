import { isHudCommand } from './hud-money';

/** The HUD's parts a mod can hide and show again from chat. */
export const HUD_PARTS = ['cash', 'time', 'map'] as const;
export type HudPart = (typeof HUD_PARTS)[number];

// The words for each part, "money" and "clock" too, for mods who reach for those.
const PART_WORDS: Record<string, HudPart> = {
  cash: 'cash',
  money: 'cash',
  time: 'time',
  clock: 'time',
  map: 'map',
};

/**
 * The part a plain "!hud map", "!h cash" or "!h time" names, or null. With anything after the
 * part it's another command ("!h map park1", "!h cash +500"), and the part words are the only
 * ones read, so "!h constructor" names nothing.
 */
export function parseToggleCommand(message: string): HudPart | null {
  const [typed, word = '', ...rest] = message.trim().split(/\s+/);
  if (!isHudCommand(typed) || rest.length > 0) return null;
  const lower = word.toLowerCase();
  return Object.hasOwn(PART_WORDS, lower) ? PART_WORDS[lower] : null;
}

/** The hidden parts after one toggle: a hidden part comes back, a shown one hides. */
export const togglePart = (hidden: readonly HudPart[] = [], part: HudPart): HudPart[] =>
  hidden.includes(part) ? hidden.filter((entry) => entry !== part) : [...hidden, part];

export const isHudPart = (value: unknown): value is HudPart => HUD_PARTS.includes(value as HudPart);
