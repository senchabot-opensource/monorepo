import { LINE_MAX_LENGTH } from '#/lib/lower-third-url';

export const COMMAND = '!lt';

export type LowerThirdCommand =
  | { action: 'show' | 'hide' | 'clear' }
  | { action: 'say'; text: string };

/**
 * Reads a mod's "!lt": `!lt <text>` puts a line of your own up instead of the taking turns,
 * `!lt clear` goes back to them, `!lt hide` takes the bar down and `!lt show` (or a bare `!lt`)
 * brings it back. Null for anything else.
 */
export function parseLowerThirdCommand(text: string): LowerThirdCommand | null {
  const match = /^!lt(?:\s+([\s\S]*))?$/i.exec(text.trim());
  if (!match) return null;
  const rest = (match[1] ?? '').trim();
  const word = rest.toLowerCase();
  if (!rest || word === 'show') return { action: 'show' };
  if (word === 'hide' || word === 'clear') return { action: word };
  return { action: 'say', text: Array.from(rest).slice(0, LINE_MAX_LENGTH).join('') };
}

/**
 * Where the bar is `elapsed` ms after its cycle started: on screen or not, and how long it has
 * been up this time. A hold of 0 keeps it up.
 */
export function phaseAt(elapsed: number, hold: number, pause: number) {
  if (hold <= 0) return { visible: true, shownFor: elapsed };
  const period = (hold + pause) * 1000;
  const into = elapsed % period;
  return { visible: into < hold * 1000, shownFor: into };
}

/** The line on screen after being up `shownFor` ms, taking turns every `rotate` seconds. */
export const lineIndexAt = (shownFor: number, count: number, rotate: number) =>
  count > 0 ? Math.floor(shownFor / (rotate * 1000)) % count : -1;
