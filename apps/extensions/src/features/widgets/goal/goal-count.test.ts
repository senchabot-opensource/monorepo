import { describe, expect, it } from 'vitest';
import { MAX_GOAL_COUNT } from '#/lib/goal-url';
import {
  addToGoal,
  applyGoalCommand,
  createGoal,
  followStart,
  isGoalState,
  parseGoalCommand,
  progressOf,
  subsIn,
} from './goal-count';

describe('goal count', () => {
  it('keeps a saved count while the starting count stays, and starts over when it changes', () => {
    const saved = addToGoal(createGoal(120), 5);
    expect(followStart(saved, 120)).toEqual({ count: 125, start: 120 });
    expect(followStart(saved, 131)).toEqual({ count: 131, start: 131 });
  });

  it('never goes below zero or past the top of the scale', () => {
    expect(addToGoal(createGoal(2), -5).count).toBe(0);
    expect(addToGoal(createGoal(MAX_GOAL_COUNT), 1).count).toBe(MAX_GOAL_COUNT);
  });

  it('fills up to the target and stays full past it', () => {
    expect(progressOf(5, 10)).toBe(0.5);
    expect(progressOf(23, 20)).toBe(1);
  });

  it('counts a sub or resub as one and a gift as its size', () => {
    expect(subsIn({ kind: 'sub', platform: 'twitch', name: 'a', tier: 3, months: 9 })).toBe(1);
    expect(subsIn({ kind: 'gift', platform: 'kick', name: 'a', tier: 1, count: 5 })).toBe(5);
  });

  it("doesn't count Kick's second word on a sub, Bits, Kicks or raids", () => {
    const sub = { kind: 'sub', platform: 'kick', name: 'a', tier: 1 } as const;
    expect(subsIn({ ...sub, again: 'repeat' })).toBe(0);
    expect(subsIn({ ...sub, again: 'shared' })).toBe(0);
    expect(subsIn({ kind: 'bits', platform: 'kick', name: 'a', amount: 500 })).toBe(0);
    expect(subsIn({ kind: 'raid', platform: 'twitch', name: 'a', viewers: 50 })).toBe(0);
  });

  it('checks saved data before trusting it', () => {
    expect(isGoalState({ count: 3, start: 0 })).toBe(true);
    expect(isGoalState({ count: -1, start: 0 })).toBe(false);
    expect(isGoalState({ count: 1.5, start: 0 })).toBe(false);
    expect(isGoalState({ left: 100 })).toBe(false);
    expect(isGoalState(null)).toBe(false);
  });
});

describe('goal commands', () => {
  it('reads add, remove, set and reset', () => {
    expect(parseGoalCommand('!goal add 5')).toEqual({ action: 'add', amount: 5 });
    expect(parseGoalCommand('!GOAL + 2')).toEqual({ action: 'add', amount: 2 });
    expect(parseGoalCommand('!goal remove')).toEqual({ action: 'remove', amount: 1 });
    expect(parseGoalCommand('!goal - 3')).toEqual({ action: 'remove', amount: 3 });
    expect(parseGoalCommand('!goal set 42')).toEqual({ action: 'set', amount: 42 });
    expect(parseGoalCommand('  !goal reset ')).toEqual({ action: 'reset' });
  });

  it('ignores anything else', () => {
    for (const text of [
      '!goal',
      '!goal set',
      '!goal add five',
      '!goal add 1.5',
      '!goal add -2',
      '!goal add 5 more',
      '!goal reset 3',
      '!goal start',
      '!subathon add 5',
      `!goal set ${MAX_GOAL_COUNT + 1}`,
      `!goal set ${'9'.repeat(320)}`,
    ]) {
      expect(parseGoalCommand(text), text).toBeNull();
    }
  });

  it('applies a command, with reset going back to the starting count', () => {
    const state = { count: 30, start: 20 };
    expect(applyGoalCommand(state, { action: 'add', amount: 3 }, 20).count).toBe(33);
    expect(applyGoalCommand(state, { action: 'remove', amount: 50 }, 20).count).toBe(0);
    expect(applyGoalCommand(state, { action: 'set', amount: 7 }, 20)).toEqual({
      count: 7,
      start: 20,
    });
    expect(applyGoalCommand(state, { action: 'reset' }, 20)).toEqual({ count: 20, start: 20 });
  });
});
