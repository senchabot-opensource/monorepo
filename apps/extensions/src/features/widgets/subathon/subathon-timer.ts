/**
 * Subathon clock state. A running clock stores when it hits zero instead of a counter, so it
 * survives an OBS restart and keeps counting while the source is closed, like a real deadline.
 */
export interface SubathonState {
  /** Epoch ms the clock reaches zero while running; null while paused. */
  endsAt: number | null;
  /** Time left in ms while paused. */
  left: number;
  /** The most time the clock has held: the health bar's 100%. */
  peak: number;
  /** The time it was created with (starting time, capped), to tell what was added since. */
  base: number;
  /** Whether the clock has ever run. */
  ran: boolean;
}

/** Settings the clock takes from the URL, in ms: starting time, cap (0 is none), autostart. */
export interface ClockOptions {
  base: number;
  cap: number;
  autostart: boolean;
}

/** A new clock at the starting time, or at `cap` when that is lower (0 means no cap). */
export function createState(base: number, running: boolean, now: number, cap = 0): SubathonState {
  const time = Math.max(0, cap > 0 ? Math.min(cap, base) : base);
  return {
    endsAt: running ? now + time : null,
    left: time,
    peak: time,
    base: time,
    ran: running,
  };
}

export function timeLeft(state: SubathonState, now: number): number {
  return state.endsAt === null ? state.left : Math.max(0, state.endsAt - now);
}

/** Out of time. Subs no longer add to it, only a mod's add or set brings it back. */
export const isEnded = (state: SubathonState, now: number) => timeLeft(state, now) <= 0;

/** Time left as a share of the peak, 0 to 1. */
export function healthOf(state: SubathonState, now: number): number {
  if (state.peak <= 0) return 0;
  return Math.min(1, timeLeft(state, now) / state.peak);
}

function withTime(state: SubathonState, ms: number, now: number): SubathonState {
  const time = Math.max(0, ms);
  return {
    ...state,
    endsAt: state.endsAt === null ? null : now + time,
    left: time,
    peak: Math.max(state.peak, time),
  };
}

/** Sets the time left, clamped to 0 and to `cap` (0 means no cap). */
export function setTime(state: SubathonState, ms: number, now: number, cap = 0): SubathonState {
  return withTime(state, cap > 0 ? Math.min(cap, ms) : ms, now);
}

/**
 * Adds (or with a negative `ms`, removes) time. Added time stops at `cap`, but adding never
 * lowers a clock that is already over it, e.g. after the cap was set below the time left.
 */
export function addTime(state: SubathonState, ms: number, now: number, cap = 0): SubathonState {
  const current = timeLeft(state, now);
  const next = ms > 0 && cap > 0 ? Math.max(current, Math.min(cap, current + ms)) : current + ms;
  return withTime(state, next, now);
}

export function pause(state: SubathonState, now: number): SubathonState {
  if (state.endsAt === null) return state;
  return { ...state, endsAt: null, left: timeLeft(state, now) };
}

export function resume(state: SubathonState, now: number): SubathonState {
  if (state.endsAt !== null) return state;
  return { ...state, endsAt: now + state.left, ran: true };
}

/**
 * A clock that has never run is made again from the URL's current starting time and cap, with
 * the time added (or removed) before the start carried over, and autostart starts it.
 */
export function followSettings(
  state: SubathonState,
  now: number,
  options: ClockOptions,
): SubathonState {
  if (state.ran) return state;
  const fresh = createState(options.base, false, now, options.cap);
  const extra = state.left - state.base;
  const next = extra === 0 ? fresh : addTime(fresh, extra, now, options.cap);
  const rebuilt = { ...next, base: fresh.base, peak: next.left };
  return options.autostart ? resume(rebuilt, now) : rebuilt;
}

export function isSubathonState(value: unknown): value is SubathonState {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  const num = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v >= 0;
  return (
    (s.endsAt === null || num(s.endsAt)) &&
    num(s.left) &&
    num(s.peak) &&
    num(s.base) &&
    typeof s.ran === 'boolean'
  );
}

const pad = (n: number) => String(n).padStart(2, '0');

/** "01:05:09". Hours keep counting past 24, as subathons run for days. Rounds up to the second. */
export function formatClock(ms: number): string {
  const total = Math.ceil(Math.max(0, ms) / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** Short form for added time: "0:30", "5:00", "1:02:00". */
export function formatDelta(ms: number): string {
  const total = Math.round(Math.abs(ms) / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

const UNIT_MS: Record<string, number> = { h: 3_600_000, m: 60_000, s: 1000 };
// A mod typing 999999h is a typo; left unchecked it can reach Infinity and break the saved clock.
const MAX_DURATION_MS = 30 * 24 * 3_600_000;

function durationMs(value: string): number | null {
  if (/^\d+(\.\d+)?$/.test(value)) return Number(value) * 60_000;
  if (/^\d+(:\d{1,2}){1,2}$/.test(value)) {
    const parts = value.split(':').map(Number);
    if (parts.slice(1).some((n) => n >= 60)) return null;
    const [h, m, s] = parts.length === 3 ? parts : [0, ...parts];
    return ((h * 60 + m) * 60 + s) * 1000;
  }
  const units = value.match(/^(?:\d+(?:\.\d+)?[hms])+$/) && value.match(/\d+(?:\.\d+)?[hms]/g);
  if (!units) return null;
  return units.reduce((sum, part) => sum + Number(part.slice(0, -1)) * UNIT_MS[part.slice(-1)], 0);
}

/**
 * A duration a mod types in chat, in ms: "1h30m", "10m", "45s", "1:30:00", "5:00", or a bare
 * number of minutes ("10"). Null when it isn't one or is over 30 days.
 */
export function parseDuration(text: string): number | null {
  const ms = durationMs(text.trim().toLowerCase());
  return ms !== null && Number.isFinite(ms) && ms <= MAX_DURATION_MS ? Math.round(ms) : null;
}

export const COMMAND = '!subathon';

export type SubathonCommand =
  | { action: 'start' | 'pause' | 'reset' }
  | { action: 'add' | 'remove' | 'set'; ms: number };

const ACTIONS: Record<string, SubathonCommand['action']> = {
  start: 'start',
  resume: 'start',
  pause: 'pause',
  stop: 'pause',
  reset: 'reset',
  add: 'add',
  '+': 'add',
  remove: 'remove',
  '-': 'remove',
  set: 'set',
};

/** Reads "!subathon <action> [duration]"; null for anything else or a missing duration. */
export function parseCommand(message: string): SubathonCommand | null {
  const [command, word = '', ...rest] = message.trim().split(/\s+/);
  if (command?.toLowerCase() !== COMMAND) return null;
  const action = ACTIONS[word.toLowerCase()];
  if (!action) return null;
  if (action === 'start' || action === 'pause' || action === 'reset') return { action };
  const ms = parseDuration(rest.join(''));
  return ms === null ? null : { action, ms };
}

/** Applies a mod command. `reset` goes back to `base`, running only when the clock autostarts. */
export function applyCommand(
  state: SubathonState,
  command: SubathonCommand,
  now: number,
  options: ClockOptions,
): SubathonState {
  switch (command.action) {
    case 'start':
      return resume(state, now);
    case 'pause':
      return pause(state, now);
    case 'reset':
      return createState(options.base, options.autostart, now, options.cap);
    case 'add':
      return addTime(state, command.ms, now, options.cap);
    case 'remove':
      return addTime(state, -command.ms, now, options.cap);
    case 'set':
      return setTime(state, command.ms, now, options.cap);
  }
}
