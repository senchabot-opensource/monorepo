import { type HudItem, tidyItemName } from '#/lib/irl-hud-url';
import { isHudCommand } from './hud-money';

/** `!hud buy water` buys an item from the market: its price comes off the cash. */
export const BUY_SUBCOMMAND = 'buy';
// More than this at once is a typo; it would empty any wallet in one go.
export const MAX_BUY_COUNT = 99;

export interface Purchase {
  item: HudItem;
  count: number;
  /** price × count. */
  total: number;
}

/**
 * The item and count "!hud buy energy drink 3" asks for, matched to the market by name in any
 * case; null when it names nothing there. A trailing number is the count (1 when left out).
 */
export function parseBuyCommand(message: string, items: HudItem[]): Purchase | null {
  const [typed, part = '', ...words] = message.trim().split(/\s+/);
  if (!isHudCommand(typed) || part.toLowerCase() !== BUY_SUBCOMMAND) return null;
  const last = words[words.length - 1] ?? '';
  const counted = /^\d+$/.test(last) && words.length > 1;
  const count = counted ? Number(last) : 1;
  if (count < 1 || count > MAX_BUY_COUNT) return null;
  const name = tidyItemName((counted ? words.slice(0, -1) : words).join(' ')).toLowerCase();
  const item = items.find((saved) => saved.name.toLowerCase() === name);
  return item ? { item, count, total: item.price * count } : null;
}
