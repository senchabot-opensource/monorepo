import { describe, expect, it } from 'vitest';
import {
  addTime,
  applyCommand,
  createState,
  followSettings,
  formatClock,
  formatDelta,
  healthOf,
  isEnded,
  isSubathonState,
  parseCommand,
  parseDuration,
  pause,
  resume,
  setTime,
  timeLeft,
} from './subathon-timer';

const HOUR = 3_600_000;
const MIN = 60_000;

describe('clock state', () => {
  it('counts down from the start time while running and holds still while paused', () => {
    const running = createState(HOUR, true, 0);
    expect(timeLeft(running, 10 * MIN)).toBe(50 * MIN);

    const paused = createState(HOUR, false, 0);
    expect(timeLeft(paused, 10 * MIN)).toBe(HOUR);
    expect(timeLeft(resume(paused, 10 * MIN), 20 * MIN)).toBe(50 * MIN);
  });

  it('keeps counting across a reload, since it stores when it ends', () => {
    const state = JSON.parse(JSON.stringify(createState(HOUR, true, 0)));
    expect(isSubathonState(state)).toBe(true);
    expect(timeLeft(state, 45 * MIN)).toBe(15 * MIN);
  });

  it('pausing keeps the time left, resuming continues from it', () => {
    const paused = pause(createState(HOUR, true, 0), 20 * MIN);
    expect(timeLeft(paused, 90 * MIN)).toBe(40 * MIN);
    expect(timeLeft(resume(paused, 90 * MIN), 100 * MIN)).toBe(30 * MIN);
  });

  it('stops at zero and reports the end', () => {
    const state = createState(MIN, true, 0);
    expect(timeLeft(state, 5 * MIN)).toBe(0);
    expect(isEnded(state, 5 * MIN)).toBe(true);
    expect(isEnded(state, 30_000)).toBe(false);
  });

  it('adds time, never below zero and never over the cap', () => {
    const state = createState(HOUR, true, 0);
    expect(timeLeft(addTime(state, 5 * MIN, 0), 0)).toBe(65 * MIN);
    expect(timeLeft(addTime(state, -2 * HOUR, 0), 0)).toBe(0);
    expect(timeLeft(addTime(state, HOUR, 0, 90 * MIN), 0)).toBe(90 * MIN);
    expect(timeLeft(setTime(state, 5 * HOUR, 0, 2 * HOUR), 0)).toBe(2 * HOUR);
  });

  it('brings an ended clock back when time is set or added', () => {
    const ended = createState(MIN, true, 0);
    const revived = addTime(ended, 10 * MIN, 5 * MIN);
    expect(timeLeft(revived, 5 * MIN)).toBe(10 * MIN);
    expect(isEnded(revived, 6 * MIN)).toBe(false);
  });

  it('measures health against the most time the clock has held', () => {
    let state = createState(HOUR, true, 0);
    expect(healthOf(state, 30 * MIN)).toBe(0.5);
    state = addTime(state, HOUR, 30 * MIN);
    // 90 minutes left is the new peak, so the bar is full again.
    expect(healthOf(state, 30 * MIN)).toBe(1);
    expect(healthOf(state, 75 * MIN)).toBe(0.5);
  });

  it('never takes time away when adding to a clock over the cap', () => {
    const over = createState(12 * HOUR, false, 0);
    expect(timeLeft(addTime(over, MIN, 0, 10 * HOUR), 0)).toBe(12 * HOUR);
    const near = createState(HOUR - 30_000, false, 0);
    expect(timeLeft(addTime(near, MIN, 0, HOUR), 0)).toBe(HOUR);
  });

  it('starts at the cap when the starting time is over it', () => {
    expect(timeLeft(createState(12 * HOUR, false, 0, 10 * HOUR), 0)).toBe(10 * HOUR);
  });

  it('rejects saved values that are not a clock', () => {
    expect(isSubathonState(null)).toBe(false);
    expect(isSubathonState({ endsAt: null, left: -1, peak: 0, base: 0, ran: false })).toBe(false);
    expect(isSubathonState({ endsAt: 'x', left: 1, peak: 1, base: 1, ran: true })).toBe(false);
  });
});

describe('followSettings', () => {
  const options = { base: 2 * HOUR, cap: 0, autostart: false };

  it('moves a clock that never ran to a new starting time, keeping time added before it', () => {
    const early = addTime(createState(HOUR, false, 0), 5 * MIN, 0);
    const moved = followSettings(early, 0, options);
    expect(timeLeft(moved, 0)).toBe(2 * HOUR + 5 * MIN);
    expect(moved.base).toBe(2 * HOUR);
    expect(healthOf(moved, 0)).toBe(1);
  });

  it('starts a clock that never ran when the URL now autostarts', () => {
    const moved = followSettings(createState(HOUR, false, 0), 0, { ...options, autostart: true });
    expect(timeLeft(moved, 10 * MIN)).toBe(110 * MIN);
  });

  it('leaves a clock that has run alone', () => {
    const running = createState(HOUR, true, 0);
    expect(followSettings(running, 0, options)).toBe(running);
    const paused = pause(running, 10 * MIN);
    expect(followSettings(paused, 20 * MIN, options)).toBe(paused);
  });
});

describe('formatting', () => {
  it('shows hours past 24 and rounds up to the second', () => {
    expect(formatClock(HOUR + 5 * MIN + 9_000)).toBe('01:05:09');
    expect(formatClock(30 * HOUR)).toBe('30:00:00');
    expect(formatClock(400)).toBe('00:00:01');
    expect(formatClock(0)).toBe('00:00:00');
  });

  it('writes added time short', () => {
    expect(formatDelta(30_000)).toBe('0:30');
    expect(formatDelta(5 * MIN)).toBe('5:00');
    expect(formatDelta(HOUR + 2 * MIN)).toBe('1:02:00');
  });
});

describe('parseDuration', () => {
  it.each([
    ['10m', 10 * MIN],
    ['1h30m', 90 * MIN],
    ['45s', 45_000],
    ['1.5h', 90 * MIN],
    ['1:30:00', 90 * MIN],
    ['5:00', 5 * MIN],
    ['10', 10 * MIN],
    ['2H', 2 * HOUR],
  ])('%s', (text, ms) => {
    expect(parseDuration(text)).toBe(ms);
  });

  it.each(['', 'abc', '10x', '1:75', 'm10'])('rejects %j', (text) => {
    expect(parseDuration(text)).toBeNull();
  });
});

describe('parseCommand', () => {
  it('reads the actions and their aliases', () => {
    expect(parseCommand('!subathon start')).toEqual({ action: 'start' });
    expect(parseCommand('!Subathon RESUME')).toEqual({ action: 'start' });
    expect(parseCommand('!subathon stop')).toEqual({ action: 'pause' });
    expect(parseCommand('!subathon reset')).toEqual({ action: 'reset' });
    expect(parseCommand('!subathon add 1h 30m')).toEqual({ action: 'add', ms: 90 * MIN });
    expect(parseCommand('!subathon - 5m')).toEqual({ action: 'remove', ms: 5 * MIN });
    expect(parseCommand('!subathon set 2:00:00')).toEqual({ action: 'set', ms: 2 * HOUR });
  });

  it('ignores other messages and a missing or bad duration', () => {
    expect(parseCommand('subathon start')).toBeNull();
    expect(parseCommand('!subathonstart')).toBeNull();
    expect(parseCommand('!subathon')).toBeNull();
    expect(parseCommand('!subathon add')).toBeNull();
    expect(parseCommand('!subathon add lots')).toBeNull();
    expect(parseCommand('!subathon dance')).toBeNull();
  });
});

describe('applyCommand', () => {
  const options = { base: HOUR, cap: 0, autostart: false };

  it('resets to the cap when the starting time is over it', () => {
    const reset = applyCommand(createState(HOUR, true, 0), { action: 'reset' }, 0, {
      ...options,
      base: 5 * HOUR,
      cap: 2 * HOUR,
    });
    expect(timeLeft(reset, 0)).toBe(2 * HOUR);
  });

  it('resets to the starting time, running only when the clock autostarts', () => {
    const state = addTime(createState(HOUR, true, 0), HOUR, 0);
    const reset = applyCommand(state, { action: 'reset' }, 10 * MIN, options);
    expect(timeLeft(reset, 20 * MIN)).toBe(HOUR);
    expect(reset.peak).toBe(HOUR);
    const auto = applyCommand(state, { action: 'reset' }, 0, { ...options, autostart: true });
    expect(timeLeft(auto, 10 * MIN)).toBe(50 * MIN);
  });

  it('adds, removes and sets time', () => {
    const state = createState(HOUR, false, 0);
    expect(timeLeft(applyCommand(state, { action: 'add', ms: MIN }, 0, options), 0)).toBe(61 * MIN);
    expect(timeLeft(applyCommand(state, { action: 'remove', ms: MIN }, 0, options), 0)).toBe(
      59 * MIN,
    );
    expect(timeLeft(applyCommand(state, { action: 'set', ms: MIN }, 0, options), 0)).toBe(MIN);
  });
});
