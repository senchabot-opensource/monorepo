import { describe, expect, it } from 'vitest';
import {
  parseFollowerGoalCommand,
  storageKey,
} from './use-follower-goal';

describe('follower goal commands', () => {
  it('parses !fgoal, !followgoal, and !goal commands', () => {
    expect(parseFollowerGoalCommand('!fgoal add 5')).toEqual({ action: 'add', amount: 5 });
    expect(parseFollowerGoalCommand('!FGOAL + 2')).toEqual({ action: 'add', amount: 2 });
    expect(parseFollowerGoalCommand('!followgoal add')).toEqual({ action: 'add', amount: 1 });
    expect(parseFollowerGoalCommand('!fgoal remove')).toEqual({ action: 'remove', amount: 1 });
    expect(parseFollowerGoalCommand('!fgoal - 3')).toEqual({ action: 'remove', amount: 3 });
    expect(parseFollowerGoalCommand('!goal set 42')).toEqual({ action: 'set', amount: 42 });
    expect(parseFollowerGoalCommand('  !fgoal reset ')).toEqual({ action: 'reset' });
  });

  it('rejects unknown commands and invalid amounts', () => {
    expect(parseFollowerGoalCommand('!other add 1')).toBeNull();
    expect(parseFollowerGoalCommand('!fgoal unknown')).toBeNull();
    expect(parseFollowerGoalCommand('!fgoal add abc')).toBeNull();
    expect(parseFollowerGoalCommand('!fgoal set')).toBeNull();
    expect(parseFollowerGoalCommand('!fgoal reset 5')).toBeNull();
  });
});

describe('follower goal storage key', () => {
  it('isolates keys per channels and lowers case', () => {
    expect(storageKey('Streamer', 'Gamer')).toBe('senchabot.follower_goal:streamer:gamer');
    expect(storageKey()).toBe('senchabot.follower_goal::');
  });
});
