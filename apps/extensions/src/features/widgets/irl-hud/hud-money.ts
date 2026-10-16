import type { Follow } from '#/hooks/use-follows';
import { type HudMoneyValues, type HudStyle, MAX_MONEY, MIN_MONEY } from '#/lib/irl-hud-url';
import type { SubathonEvent, SubTier } from '../subathon/subathon-events';

/** What can add cash or run a command: chat's events, and follows from a Senchabot connection. */
export type HudEvent = SubathonEvent | Follow;

/**
 * The HUD saved in OBS. Neither platform tells a logged-out page what a channel has earned, so
 * the money is ours: the streamer's starting amount plus every sub, gift, cheer, raid and follow
 * since.
 */
export interface HudState {
  money: number;
  /** The URL's starting amount this one was built on. */
  start: number;
  /** The mini-map a mod picked with !hud map, and the URL's starting map it was picked over. */
  map?: { choice: string; from: string };
  /** The arrow's movement a mod picked with !hud walk/run/stay, and the URL's it replaced. */
  move?: { choice: string; from: string };
  /** Inside the nearest building on the mini-map, after a mod's !hud indoor. */
  indoor?: boolean;
  /** The parts a mod hid with a plain !hud cash, !hud time or !hud map; all shown by default. */
  hidden?: ('cash' | 'time' | 'map')[];
}

export const clampMoney = (n: number) => Math.max(MIN_MONEY, Math.min(MAX_MONEY, Math.round(n)));

export const createHud = (start: number): HudState => ({ money: clampMoney(start), start });

/**
 * The saved money, or the URL's starting amount when that changed since: typing a new starting
 * amount means "the money is this now".
 */
export const followStart = (saved: HudState, start: number): HudState =>
  saved.start === start
    ? saved
    : {
        ...createHud(start),
        map: saved.map,
        move: saved.move,
        indoor: saved.indoor,
        hidden: saved.hidden,
      };

export function isHudState(value: unknown): value is HudState {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  // A choice saved with its starting value: { choice, from }, both strings; or nothing.
  const choiceOk = (value: unknown) => {
    if (value === undefined) return true;
    const c = value as Record<string, unknown> | null;
    return (
      typeof c === 'object' &&
      c !== null &&
      typeof c.choice === 'string' &&
      typeof c.from === 'string'
    );
  };
  return (
    Number.isInteger(s.money) &&
    Number.isInteger(s.start) &&
    choiceOk(s.map) &&
    choiceOk(s.move) &&
    (s.indoor === undefined || typeof s.indoor === 'boolean') &&
    (s.hidden === undefined ||
      (Array.isArray(s.hidden) &&
        s.hidden.every((part) => part === 'cash' || part === 'time' || part === 'map')))
  );
}

// Tier 2 and Tier 3 cost about 2x and 5x a Tier 1 sub.
const TIER_WEIGHT: Record<SubTier, number> = { 1: 1, 2: 2, 3: 5 };

/** The Bits and Kicks values are per this many. */
export const BITS_PER_VALUE = 100;

const VALUE_KEYS = {
  twitch: { sub: 'tsub', gift: 'tgift', bits: 'bits', raid: 'traid' },
  kick: { sub: 'ksub', gift: 'kgift', bits: 'kicks', raid: 'kraid' },
} as const;

/**
 * Dollars an event earns by its platform's values, rounded to whole dollars; 0 when its value is
 * off or it earns nothing (a mod command, or Kick's second word on a sub already counted).
 */
export function eventMoney(event: HudEvent, values: HudMoneyValues & { tiers: boolean }): number {
  if (event.kind === 'mod' || (event.kind === 'sub' && event.again)) return 0;
  // The same on both platforms: a follow is free on each.
  if (event.kind === 'follow') return values.follow;
  const value = values[VALUE_KEYS[event.platform][event.kind]];
  const weight =
    event.platform === 'twitch' && values.tiers && (event.kind === 'sub' || event.kind === 'gift')
      ? TIER_WEIGHT[event.tier]
      : 1;
  switch (event.kind) {
    case 'sub':
      return value * weight;
    case 'gift':
      return value * event.count * weight;
    case 'bits':
      return Math.round((value * event.amount) / BITS_PER_VALUE);
    case 'raid':
      return value * event.viewers;
  }
}

export const COMMAND = '!hud';
/** The same commands in short, quicker to type on the move: "!h cash +500". */
export const SHORT_COMMAND = '!h';

/** Whether a chat message's first word is the HUD's command, long or short. */
export function isHudCommand(word: string | undefined): boolean {
  const lower = word?.toLowerCase();
  return lower === COMMAND || lower === SHORT_COMMAND;
}
/** What `!hud cash` changes; the command leaves room for more HUD parts later. */
export const CASH_SUBCOMMAND = 'cash';
// "money" works too, for mods who reach for that word.
const CASH_WORDS = new Set([CASH_SUBCOMMAND, 'money']);

export type CashCommand =
  | { action: 'reset' }
  | { action: 'add' | 'remove' | 'set'; amount: number };

const CASH_ACTIONS: Record<string, Exclude<CashCommand['action'], 'reset'>> = {
  add: 'add',
  '+': 'add',
  remove: 'remove',
  '-': 'remove',
  set: 'set',
};
const SUFFIX: Record<string, number> = { '': 1, k: 1_000, m: 1_000_000 };
// Anything past this is a typo; left unchecked it could reach Infinity and break the saved HUD.
const MAX_AMOUNT = 10_000_000_000;

/** An amount a mod types: "500", "$1,500", "2.5k", "1m". Null when it isn't one. */
export function parseAmount(text: string): number | null {
  const match = text
    .trim()
    .toLowerCase()
    .replace(/[$,_]/g, '')
    .match(/^(\d+(?:\.\d+)?)([km]?)$/);
  if (!match) return null;
  const amount = Math.round(Number(match[1]) * SUFFIX[match[2]]);
  return Number.isFinite(amount) && amount <= MAX_AMOUNT ? amount : null;
}

/**
 * Reads "!hud cash +500", "!hud cash -500", "!hud cash 500" (sets it), the spelled-out
 * "!hud cash add|remove|set <amount>", and "!hud cash reset". Null for anything else.
 */
export function parseCashCommand(message: string): CashCommand | null {
  const [typed, part = '', word = '', ...rest] = message.trim().split(/\s+/);
  if (!isHudCommand(typed) || !CASH_WORDS.has(part.toLowerCase())) return null;
  const lower = word.toLowerCase();
  if (lower === 'reset') return { action: 'reset' };
  // Own words only: "!hud cash constructor 5" names no action.
  const named = Object.hasOwn(CASH_ACTIONS, lower) ? CASH_ACTIONS[lower] : undefined;
  if (named) {
    const amount = parseAmount(rest.join(''));
    return amount === null ? null : { action: named, amount };
  }
  const action = word[0] === '+' ? 'add' : word[0] === '-' ? 'remove' : 'set';
  const amount = parseAmount(action === 'set' ? word : word.slice(1));
  return amount === null ? null : { action, amount };
}

/** Applies a mod's !hud cash command. `reset` goes back to the URL's starting amount. */
export function applyCashCommand(state: HudState, command: CashCommand, start: number): HudState {
  switch (command.action) {
    case 'reset':
      return { ...state, money: clampMoney(start) };
    case 'add':
      return { ...state, money: clampMoney(state.money + command.amount) };
    case 'remove':
      return { ...state, money: clampMoney(state.money - command.amount) };
    case 'set':
      return { ...state, money: clampMoney(command.amount) };
  }
}

/**
 * "$00000350" in Retro (eight digits, "-$0000350" in debt), "$1,250" in Modern, and "1,250" in
 * the looks that count gold coins, which draw a coin beside it instead of the $.
 */
export function formatMoney(value: number, style: HudStyle): string {
  const n = Math.round(value);
  const abs = Math.abs(n);
  if (style === 'retro') {
    return n < 0 ? `-$${String(abs).padStart(7, '0')}` : `$${String(abs).padStart(8, '0')}`;
  }
  return `${n < 0 ? '-' : ''}${coins(style) ? '' : '$'}${abs.toLocaleString('en-US')}`;
}

/** Whether a style counts gold coins instead of dollars. */
const coins = (style: HudStyle) => style === 'medieval' || style === 'mmorpg';

/** "+$100" or "-$500"; "+100" when the look counts coins. */
export const formatChange = (amount: number, coin = false) =>
  `${amount < 0 ? '-' : '+'}${coin ? '' : '$'}${Math.abs(Math.round(amount)).toLocaleString('en-US')}`;
