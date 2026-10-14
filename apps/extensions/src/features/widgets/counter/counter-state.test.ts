import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_OBS_COMMANDS } from '#/features/tools/obs-bridge-config';
import { MAX_COUNT } from '#/lib/counter-url';
import { SPIN_COMMAND } from '#/lib/spin-wheel-url';
import { COMMAND_ALIASES, COMMAND as COUNTDOWN } from '../countdown/countdown-clock';
import { FOLLOWER_GOAL_COMMAND } from '../follower-goal/use-follower-goal';
import { COMMAND as GOAL } from '../goal/goal-count';
import { COMMAND as HUD } from '../irl-hud/hud-money';
import { COMMAND as POLL } from '../poll/poll-state';
import { COMMAND as GROW } from '../sub-sprout/sub-sprout-state';
import { COMMAND as SUBATHON } from '../subathon/subathon-timer';
import {
  commandProblem,
  loadCount,
  parseCounterCommand,
  RESERVED_COMMANDS,
  storageKey,
  valueFontSize,
} from './counter-state';

const COMMANDS = ['losses', 'wins', 'gülüş'];
const parse = (text: string) => parseCounterCommand(text, COMMANDS);

describe('parseCounterCommand', () => {
  it.each([
    ['!losses', { action: 'add', amount: 1 }],
    ['!losses +', { action: 'add', amount: 1 }],
    ['!losses add', { action: 'add', amount: 1 }],
    ['!losses +3', { action: 'add', amount: 3 }],
    ['!losses + 3', { action: 'add', amount: 3 }],
    ['!losses add 3', { action: 'add', amount: 3 }],
    ['!losses -', { action: 'remove', amount: 1 }],
    ['!losses remove', { action: 'remove', amount: 1 }],
    ['!losses -2', { action: 'remove', amount: 2 }],
    ['!losses - 2', { action: 'remove', amount: 2 }],
    ['!losses remove 2', { action: 'remove', amount: 2 }],
    ['!losses set 10', { action: 'set', amount: 10 }],
    ['!losses set 0', { action: 'set', amount: 0 }],
    ['!losses reset', { action: 'reset' }],
    ['  !LOSSES   ADD   4  ', { action: 'add', amount: 4 }],
    [`!losses set ${MAX_COUNT}`, { action: 'set', amount: MAX_COUNT }],
  ])('reads %j', (text, command) => {
    expect(parse(text)).toEqual({ index: 0, command });
  });

  it('finds the counter the command belongs to, Turkish letters folded', () => {
    expect(parse('!wins')?.index).toBe(1);
    expect(parse('!GÜLÜŞ +1')?.index).toBe(2);
    expect(parseCounterCommand('!İyi', ['iyi'])?.index).toBe(0);
  });

  it.each([
    'losses',
    '!loss',
    '!lossesx',
    '! losses',
    '!losses 5',
    '!losses set',
    '!losses set ten',
    '!losses reset now',
    '!losses add 3 more',
    '!losses +2.5',
    '!losses add 1e3',
    '!losses -x',
    `!losses +${MAX_COUNT + 1}`,
    `!losses set ${MAX_COUNT + 1}`,
    '!losses constructor',
    '!losses __proto__',
    '!losses toString 3',
    '!goal add 1',
    '',
  ])('leaves %j alone', (text) => {
    expect(parse(text)).toBeNull();
  });
});

describe('RESERVED_COMMANDS', () => {
  it("lists every other widget's command", () => {
    const others = [
      GOAL,
      FOLLOWER_GOAL_COMMAND,
      '!followgoal',
      SUBATHON,
      COUNTDOWN,
      ...COMMAND_ALIASES,
      POLL,
      // A poll vote can be "!vote 2".
      '!vote',
      HUD,
      GROW,
      SPIN_COMMAND,
      // The Raffle's default entry keyword.
      '!join',
      ...Object.values(DEFAULT_OBS_COMMANDS).filter((command) => command.startsWith('!')),
    ];
    for (const command of others) expect(RESERVED_COMMANDS, command).toContain(command.slice(1));
  });
});

describe('commandProblem', () => {
  it('flags a command an earlier counter has, then one another widget reads', () => {
    expect(commandProblem('losses', 1, ['losses', 'losses'])).toBe('taken');
    expect(commandProblem('losses', 0, ['losses', 'losses'])).toBeNull();
    expect(commandProblem('goal', 0, ['goal'])).toBe('reserved');
    expect(commandProblem('', 0, [''])).toBeNull();
  });
});

describe('storageKey', () => {
  it('keys the count by both channels and the command', () => {
    expect(storageKey(' Streamer ', 'KICKER', 'losses')).toBe(
      'senchabot.counter:streamer:kicker:losses',
    );
    expect(storageKey(undefined, 'kicker', 'wins')).toBe('senchabot.counter::kicker:wins');
  });
});

describe('loadCount', () => {
  const key = storageKey('streamer', '', 'losses');
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('keeps the saved count while the starting count stays the same', () => {
    localStorage.setItem(key, JSON.stringify({ count: 42, start: 5 }));
    expect(loadCount(key, 5)).toEqual({ count: 42, start: 5 });
  });

  it('starts over at a new starting count', () => {
    localStorage.setItem(key, JSON.stringify({ count: 42, start: 5 }));
    expect(loadCount(key, 10)).toEqual({ count: 10, start: 10 });
  });

  it('starts fresh on garbage, blocked storage or no key', () => {
    localStorage.setItem(key, '{"count":"many"}');
    expect(loadCount(key, 3)).toEqual({ count: 3, start: 3 });
    localStorage.setItem(key, 'not json');
    expect(loadCount(key, 3)).toEqual({ count: 3, start: 3 });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(loadCount(key, 3)).toEqual({ count: 3, start: 3 });
    expect(loadCount(null, 7)).toEqual({ count: 7, start: 7 });
  });
});

describe('valueFontSize', () => {
  it('keeps the base size until the digits run out of room', () => {
    expect(valueFontSize(7, 288, 72)).toBe(72);
    expect(valueFontSize(1_000_000, 146, 72)).toBeLessThan(72);
    expect(valueFontSize(1_000_000, 146, 72) * 7 * 0.62).toBeLessThanOrEqual(146);
  });
});
