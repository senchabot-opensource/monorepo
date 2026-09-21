import { describe, expect, it } from 'vitest';
import {
  COMMAND,
  countdownOptions,
  formatCountdown,
  nextAt,
  parseCountdownCommand,
} from './countdown-clock';

/** Local wall-clock time, the way the streamer's computer reads it. */
const local = (year: number, month: number, day: number, hour: number, minute = 0) =>
  new Date(year, month - 1, day, hour, minute, 0, 0).getTime();

describe('nextAt', () => {
  it('aims at today when the time is still to come', () => {
    expect(nextAt('21:00', local(2026, 9, 20, 18, 30))).toBe(local(2026, 9, 20, 21));
  });

  it('aims at tomorrow once the time has passed', () => {
    expect(nextAt('21:00', local(2026, 9, 20, 21, 1))).toBe(local(2026, 9, 21, 21));
  });

  it('counts the time itself as passed, so it never lands on zero', () => {
    expect(nextAt('21:00', local(2026, 9, 20, 21))).toBe(local(2026, 9, 21, 21));
  });

  it('keeps the wall-clock time across the end of a month', () => {
    expect(nextAt('08:15', local(2026, 9, 30, 20))).toBe(local(2026, 10, 1, 8, 15));
  });
});

describe('countdownOptions', () => {
  it('counts the length when there is no time of day', () => {
    expect(countdownOptions(600, '', Date.now())).toEqual({
      base: 600_000,
      cap: 0,
      autostart: true,
    });
  });

  it('counts the time left to the time of day instead of the length', () => {
    const now = local(2026, 9, 20, 20, 55);
    expect(countdownOptions(600, '21:00', now).base).toBe(5 * 60_000);
  });
});

describe('formatCountdown', () => {
  it.each([
    [0, '00:00'],
    [999, '00:01'],
    [59_400, '01:00'],
    [598_000, '09:58'],
    [3_600_000, '1:00:00'],
    [4_198_000, '1:09:58'],
    [-5000, '00:00'],
  ])('shows %i ms as %s', (ms, expected) => {
    expect(formatCountdown(ms)).toBe(expected);
  });
});

describe('parseCountdownCommand', () => {
  it('reads its own command, not the subathon one', () => {
    expect(parseCountdownCommand(`${COMMAND} add 5m`)).toEqual({ action: 'add', ms: 300_000 });
    expect(parseCountdownCommand('!subathon add 5m')).toBeNull();
  });

  it('takes the same durations and actions as the subathon clock', () => {
    expect(parseCountdownCommand('!countdown set 10')).toEqual({ action: 'set', ms: 600_000 });
    expect(parseCountdownCommand('!COUNTDOWN Remove 90s')).toEqual({
      action: 'remove',
      ms: 90_000,
    });
    expect(parseCountdownCommand('!countdown pause')).toEqual({ action: 'pause' });
    expect(parseCountdownCommand('!countdown reset')).toEqual({ action: 'reset' });
    expect(parseCountdownCommand('!countdown add')).toBeNull();
    expect(parseCountdownCommand('!countdown')).toBeNull();
  });

  it('reads a scene name and duration to change the break scene', () => {
    expect(parseCountdownCommand('!countdown starting 10m')).toEqual({ action: 'scene', scene: 'starting', ms: 600_000 });
    expect(parseCountdownCommand('!countdown BREAK 5')).toEqual({ action: 'scene', scene: 'break', ms: 300_000 });
    expect(parseCountdownCommand('!countdown ending 45s')).toEqual({ action: 'scene', scene: 'ending', ms: 45_000 });
    expect(parseCountdownCommand('!countdown break')).toEqual({ action: 'scene', scene: 'break', ms: 600_000 });
    expect(parseCountdownCommand('!countdown break foo')).toBeNull();
  });
});
