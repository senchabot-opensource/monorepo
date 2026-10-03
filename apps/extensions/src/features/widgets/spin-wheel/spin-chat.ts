import { isKeywordMatch } from '#/hooks/use-raffle-chat';
import type { SpinPermission } from '#/lib/spin-wheel-url';
import { SPIN_COMMAND } from '#/lib/spin-wheel-url';

/** A chat line asking for a spin: `!spin`, case-insensitive like the raffle keyword. */
export function isSpinRequest(text: string): boolean {
  return isKeywordMatch(text, SPIN_COMMAND);
}

export interface SpinChatter {
  /** A moderator or the broadcaster; always allowed to spin. */
  mod: boolean;
  /** A subscriber or founder, or the broadcaster. */
  sub: boolean;
}

/**
 * Who may spin under the setup page's permission. Moderators and the broadcaster
 * always get through (both chat parsers flag the broadcaster as a mod), `subs`
 * adds subscribers, and `all` lets every viewer in.
 */
export function maySpin(chatter: SpinChatter, permission: SpinPermission): boolean {
  if (chatter.mod) return true;
  if (permission === 'mods') return false;
  if (permission === 'subs') return chatter.sub;
  return true;
}
