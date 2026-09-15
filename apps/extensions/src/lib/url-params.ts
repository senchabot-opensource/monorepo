import { z } from 'zod';

/**
 * A number param for a route's search schema that never throws: garbage falls back and anything
 * else is clamped into range. A mistyped URL must degrade gracefully, never white-screen OBS.
 */
export const clampedNumber = <F extends number | undefined>(min: number, max: number, fallback: F) =>
  z.coerce
    .number()
    .catch(Number.NaN)
    .transform((v): number | F => (Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback));

// Chat Box and Emote Wall read flags as the router parses them (JSON first) through
// z.coerce.boolean, so these are the values that come out false.
const COERCED_OFF = ['false', '0', 'null', ''];

/** Reads a Chat Box or Emote Wall on/off param the way the widget does. */
export function readCoercedFlag(value: string | null, fallback: boolean): boolean {
  return value === null ? fallback : !COERCED_OFF.includes(value.trim().toLowerCase());
}
