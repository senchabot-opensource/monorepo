import { MAX_COUNT } from '#/lib/counter-url';
import {
  createGoal,
  followStart,
  type GoalCommand,
  type GoalState,
  isGoalState,
} from '../goal/goal-count';

/**
 * Every command another widget reads, without the "!". A counter on one of these would move
 * along with that widget, so the setup page warns about them; it doesn't forbid them.
 */
export const RESERVED_COMMANDS: readonly string[] = [
  'goal',
  'fgoal',
  'followgoal',
  'subathon',
  'countdown',
  'cd',
  'poll',
  'vote',
  'hud',
  'grow',
  'spin',
  'join',
  'scene',
  'startstream',
  'stopstream',
  'startrecord',
  'stoprecord',
  'events',
  'credits',
  'top',
  'lt',
  'task',
  'tasks',
  'done',
  'edit',
  'remove',
  'leave',
  'next',
  'queue',
  'combo',
  'feature',
  'q',
  'bitsgoal',
];

const ACTIONS: Record<string, 'add' | 'remove' | 'set' | 'reset'> = {
  add: 'add',
  '+': 'add',
  remove: 'remove',
  '-': 'remove',
  set: 'set',
  reset: 'reset',
};

// A mod's "!Wins" or "!GÜLÜŞ", folded the way normalizeCommand folds the command it's matched to.
const fold = (text: string) => text.normalize('NFC').replace(/[İIı]/g, 'i').toLowerCase();

const amountOf = (text: string): number | null => {
  if (!/^\d+$/.test(text)) return null;
  const n = Number(text);
  return n <= MAX_COUNT ? n : null;
};

/**
 * Which counter a mod's message changes, and how, or null. `commands` are the counters' commands
 * without the "!". The forms, for !wins:
 *
 * - `!wins`, `!wins +`, `!wins add`: +1
 * - `!wins +3`, `!wins + 3`, `!wins add 3`: +3
 * - `!wins -`, `!wins -2`, `!wins - 2`, `!wins remove 2`: −1 or −2
 * - `!wins set 10`, `!wins reset` (back to the URL's start)
 *
 * Anything else is left alone, a bare number too: `!wins 5` could mean add or set, and
 * guessing wrong would wipe the count.
 */
export function parseCounterCommand(
  text: string,
  commands: readonly string[],
): { index: number; command: GoalCommand } | null {
  const [head = '', ...args] = text.trim().split(/\s+/);
  if (!head.startsWith('!')) return null;
  const index = commands.indexOf(fold(head.slice(1)));
  if (index < 0 || args.length > 2) return null;
  const found = (command: GoalCommand) => ({ index, command });
  if (args.length === 0) return found({ action: 'add', amount: 1 });

  const [first, second] = args;
  // "+3" and "-2", the sign stuck to the number.
  const signed = /^([+-])(\d+)$/.exec(first);
  if (signed && second === undefined) {
    const amount = amountOf(signed[2]);
    if (amount === null) return null;
    return found({ action: signed[1] === '+' ? 'add' : 'remove', amount });
  }
  const word = first.toLowerCase();
  // Object.hasOwn, so "!wins constructor" isn't read as an action.
  const action = Object.hasOwn(ACTIONS, word) ? ACTIONS[word] : null;
  if (!action) return null;
  if (action === 'reset') return second === undefined ? found({ action }) : null;
  if (second === undefined) return action === 'set' ? null : found({ action, amount: 1 });
  const amount = amountOf(second);
  return amount === null ? null : found({ action, amount });
}

/** What the setup page says about a command: taken by another widget or another counter. */
export function commandProblem(
  command: string,
  index: number,
  commands: readonly string[],
): 'reserved' | 'taken' | null {
  if (!command) return null;
  if (commands.slice(0, index).includes(command)) return 'taken';
  if (RESERVED_COMMANDS.includes(command)) return 'reserved';
  return null;
}

/**
 * Storage key per channel pair and command, so every Counter source for the channel that shows
 * !wins shares one count, and removing or reordering counters keeps the others' counts.
 */
export const storageKey = (twitch = '', kick = '', command = '') =>
  `senchabot.counter:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}:${command}`;

/** The saved count, or a new one at the starting count. */
export function loadCount(key: string | null, start: number): GoalState {
  if (!key) return createGoal(start);
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(key) ?? 'null');
    if (isGoalState(saved)) return followStart(saved, start);
  } catch {
    // Storage blocked or garbage: start over.
  }
  return createGoal(start);
}

/** Font size for a value of this many characters in a box `width` pixels wide. */
export function valueFontSize(value: number, width: number, base: number): number {
  // Oxanium's figures are about 0.62em wide; display fonts in the presets stay close to it.
  const chars = String(value).length;
  return Math.min(base, Math.floor(width / (chars * 0.62)));
}
