import {
  COUNTDOWN_SCENES,
  type CountdownScene,
  NOTE_MAX_LENGTH,
  TITLE_MAX_LENGTH,
} from '#/lib/countdown-url';
import {
  type ClockOptions,
  createState,
  parseCommand,
  parseDuration,
  type SubathonCommand,
  type SubathonState,
} from '../subathon/subathon-timer';

/**
 * Stream Countdown runs the Subathon Timer's clock, without its saved state: a break countdown
 * starts over every time the browser source loads, which is what "Refresh browser when scene
 * becomes active" in OBS gives you. Mods put time back with !countdown.
 */
export type CountdownState = SubathonState;
export type CountdownCommand =
  | SubathonCommand
  | { action: 'scene'; scene: CountdownScene; ms: number; title?: string; note?: string }
  | { action: 'title'; title: string }
  | { action: 'note'; note: string };

export const COMMAND = '!countdown';

/** Default length for `!countdown <scene>` when no duration is typed. */
const DEFAULT_SCENE_MS = 600_000;

export const parseCountdownCommand = (message: string): CountdownCommand | null => {
  const [typed, word = '', ...rest] = message.trim().split(/\s+/);
  if (typed?.toLowerCase() !== COMMAND) return null;
  const lowerWord = word.toLowerCase();

  if (COUNTDOWN_SCENES.includes(lowerWord as CountdownScene)) {
    const scene = lowerWord as CountdownScene;
    const remainder = rest.join(' ').trim();
    if (!remainder) return { action: 'scene', scene, ms: DEFAULT_SCENE_MS };
    // An optional note follows the first `|`, so `!countdown break 5m Lunch | Back soon`
    // sets the headline to "Lunch" and the note to "Back soon".
    const pipe = remainder.indexOf('|');
    const leftRaw = (pipe >= 0 ? remainder.slice(0, pipe) : remainder).trim();
    const noteRaw = pipe >= 0 ? remainder.slice(pipe + 1).trim() : undefined;
    const note = noteRaw ? noteRaw.slice(0, NOTE_MAX_LENGTH) : undefined;
    if (!leftRaw) return { action: 'scene', scene, ms: DEFAULT_SCENE_MS, note };
    // The duration comes first when anything follows the scene; anything after it is the
    // headline. A typo like `!countdown break foo` stays invalid instead of becoming a headline.
    const tokens = leftRaw.split(/\s+/);
    for (let take = Math.min(3, tokens.length); take >= 1; take--) {
      const ms = parseDuration(tokens.slice(0, take).join(''));
      if (ms !== null) {
        const title = tokens.slice(take).join(' ').trim().slice(0, TITLE_MAX_LENGTH) || undefined;
        return { action: 'scene', scene, ms, title, note };
      }
    }
    return null;
  }

  if (lowerWord === 'title' || lowerWord === 'headline') {
    return { action: 'title', title: rest.join(' ').trim().slice(0, TITLE_MAX_LENGTH) };
  }
  if (lowerWord === 'note') {
    return { action: 'note', note: rest.join(' ').trim().slice(0, NOTE_MAX_LENGTH) };
  }

  return parseCommand(message, COMMAND);
};

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
