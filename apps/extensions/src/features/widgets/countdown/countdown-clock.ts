import {
  type ClockOptions,
  createState,
  parseCommand,
  type SubathonCommand,
  type SubathonState,
} from '../subathon/subathon-timer';

/**
 * Stream Countdown runs the Subathon Timer's clock, without its saved state: a break countdown
 * starts over every time the browser source loads, which is what "Refresh browser when scene
 * becomes active" in OBS gives you. Mods put time back with !countdown.
 */
export type CountdownState = SubathonState;
export type CountdownCommand = SubathonCommand;

export const COMMAND = '!countdown';

export const parseCountdownCommand = (message: string): CountdownCommand | null =>
  parseCommand(message, COMMAND);

/** Epoch ms of the next "HH:MM" on this computer's clock; today's if it hasn't passed. */
export function nextAt(at: string, now: number): number {
  const [hours, minutes] = at.split(':').map(Number);
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);
  // Past for today, so it's tomorrow's. setDate keeps the wall-clock time across a DST change.
  if (target.getTime() <= now) target.setDate(target.getDate() + 1);
  return target.getTime();
}

/** Clock options for a countdown: `at` sets how long is left, else the length does. */
export function countdownOptions(seconds: number, at: string, now: number): ClockOptions {
  return { base: at ? nextAt(at, now) - now : seconds * 1000, cap: 0, autostart: true };
}

/** A countdown running from now, aimed at `at` or `seconds` away. */
export const startCountdown = (options: ClockOptions, now: number): CountdownState =>
  createState(options.base, true, now);

const pad = (n: number) => String(n).padStart(2, '0');

/** "09:58", or "1:09:58" once there's an hour or more left. Rounds up, so it ends on 00:00. */
export function formatCountdown(ms: number): string {
  const total = Math.ceil(Math.max(0, ms) / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}
