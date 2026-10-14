import { type GoalType, MAX_GOAL_COUNT } from '#/lib/goal-url';
import type { SubathonEvent } from '../subathon/subathon-events';

/**
 * The count saved in OBS. Neither platform tells a logged-out page how many subs a channel has,
 * so the count is ours: the streamer's starting number plus every sub and gift seen since (or,
 * for a Bits & Kicks Goal, every Bit and Kick).
 */
export interface GoalState {
  count: number;
  /** The URL's starting count this one was built on. */
  start: number;
}

const clamp = (n: number) => Math.max(0, Math.min(MAX_GOAL_COUNT, Math.round(n)));

export const createGoal = (start: number): GoalState => ({ count: clamp(start), start });

/**
 * The saved count, or a fresh one when the URL's starting count changed since: typing a new
 * starting count means "the count is this now", the way the platform's dashboard shows it.
 */
export const followStart = (saved: GoalState, start: number): GoalState =>
  saved.start === start ? saved : createGoal(start);

export const addToGoal = (state: GoalState, amount: number): GoalState => ({
  ...state,
  count: clamp(state.count + amount),
});

export function isGoalState(value: unknown): value is GoalState {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  const count = (v: unknown) => typeof v === 'number' && Number.isInteger(v) && v >= 0;
  return count(s.count) && count(s.start);
}

/** Progress toward the target, 0 to 1. Past the target it stays full. */
export const progressOf = (count: number, target: number) =>
  target > 0 ? Math.min(1, count / target) : 0;

/**
 * How many subs an event adds: 1 for a sub or resub (Prime and every tier alike), one per sub in
 * a gift. Kick's later word on a sub it already sent, Bits, Kicks and raids add none.
 */
export function subsIn(event: SubathonEvent): number {
  if (event.kind === 'gift') return event.count;
  if (event.kind === 'sub' && !event.again) return 1;
  return 0;
}

/**
 * How many a cheer adds to a Bits & Kicks Goal: its amount, Twitch Bits and Kick Kicks alike,
 * since each is worth about a US cent. Subs, gifts and raids add none.
 */
export function bitsIn(event: SubathonEvent): number {
  return event.kind === 'bits' ? event.amount : 0;
}

/** What an event adds to a goal of this type. */
export const goalAmountIn = (type: GoalType, event: SubathonEvent): number =>
  type === 'bits' ? bitsIn(event) : subsIn(event);

export const COMMAND = '!goal';
/** The Bits & Kicks Goal's own command, so it and a Sub Goal on the same channel never mix. */
export const BITS_COMMAND = '!bitsgoal';

/** The chat command a goal of this type answers to. */
export const goalCommand = (type: GoalType) => (type === 'bits' ? BITS_COMMAND : COMMAND);

export type GoalCommand =
  | { action: 'add' | 'remove' | 'set'; amount: number }
  | { action: 'reset' };

const ACTIONS: Record<string, GoalCommand['action']> = {
  add: 'add',
  '+': 'add',
  remove: 'remove',
  '-': 'remove',
  set: 'set',
  reset: 'reset',
};

/**
 * Reads "!goal add|remove [n]", "!goal set <n>" or "!goal reset" (or the same after `name`, e.g.
 * !bitsgoal). Add and remove take 1 when the number is left out. Null for anything else, or a
 * number past MAX_GOAL_COUNT.
 */
export function parseGoalCommand(message: string, name = COMMAND): GoalCommand | null {
  const [command, word = '', amount, ...rest] = message.trim().split(/\s+/);
  if (command?.toLowerCase() !== name || rest.length > 0) return null;
  const action = ACTIONS[word.toLowerCase()];
  if (!action) return null;
  if (action === 'reset') return amount === undefined ? { action } : null;
  if (amount === undefined) return action === 'set' ? null : { action, amount: 1 };
  if (!/^\d+$/.test(amount)) return null;
  const n = Number(amount);
  return n <= MAX_GOAL_COUNT ? { action, amount: n } : null;
}

/** Applies a mod command. `reset` goes back to the URL's starting count. */
export function applyGoalCommand(state: GoalState, command: GoalCommand, start: number): GoalState {
  switch (command.action) {
    case 'add':
      return addToGoal(state, command.amount);
    case 'remove':
      return addToGoal(state, -command.amount);
    case 'set':
      return { ...state, count: clamp(command.amount) };
    case 'reset':
      return createGoal(start);
  }
}
