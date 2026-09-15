import type { SubathonPlatform } from '../subathon/subathon-events';
import { parseDuration } from '../subathon/subathon-timer';

export const MIN_OPTIONS = 2;
// Kick's own polls take up to 6, Twitch's up to 5.
export const MAX_OPTIONS = 6;
export const QUESTION_MAX_LENGTH = 80;
export const OPTION_MAX_LENGTH = 30;
/** Longest a poll runs on its own; a mod can still keep one open with no timer. */
export const MAX_POLL_MS = 3_600_000;

export interface Vote {
  option: number;
  /** How many votes it's worth: more than 1 for subs when their votes count extra. */
  weight: number;
  platform: SubathonPlatform;
}

export interface PollState {
  /** When it started; also tells one poll from the next. */
  startedAt: number;
  question: string;
  options: string[];
  /** When voting closes on its own; null keeps it open until a mod ends it. */
  endsAt: number | null;
  /** When a mod ended it early. */
  endedAt: number | null;
  /**
   * Each voter's vote, by "platform:login". Changed in place as votes come in: a busy chat sends
   * hundreds a second, and copying the map for each would be the slowest part of the overlay.
   */
  votes: Map<string, Vote>;
}

export const voterKey = (platform: SubathonPlatform, login: string) =>
  `${platform}:${login.toLowerCase()}`;

/** `ms` 0 means no timer. */
export function createPoll(
  question: string,
  options: readonly string[],
  ms: number,
  now: number,
): PollState {
  return {
    startedAt: now,
    question,
    options: [...options],
    endsAt: ms > 0 ? now + Math.min(ms, MAX_POLL_MS) : null,
    endedAt: null,
    votes: new Map(),
  };
}

/** When voting closed, or null while it's open. */
export function closedAt(poll: PollState, now: number): number | null {
  if (poll.endedAt !== null) return poll.endedAt;
  return poll.endsAt !== null && now >= poll.endsAt ? poll.endsAt : null;
}

export const isOpen = (poll: PollState, now: number) => closedAt(poll, now) === null;

export interface PollTiming {
  /**
   * Votes still count this long after voting closes. Viewers see the stream seconds behind
   * chat, so a vote typed at "1 second left" reaches chat after the poll has really closed.
   */
  graceMs: number;
  /** How long results stay up after that; 0 keeps them up. */
  holdMs: number;
}

/** `closing` takes the late votes; the winner shows from `results` on. */
export type PollPhase = 'open' | 'closing' | 'results' | 'gone';

export function phaseOf(poll: PollState, now: number, { graceMs, holdMs }: PollTiming): PollPhase {
  const closed = closedAt(poll, now);
  if (closed === null) return 'open';
  const final = closed + graceMs;
  if (now < final) return 'closing';
  return holdMs > 0 && now - final >= holdMs ? 'gone' : 'results';
}

export const takesVotes = (poll: PollState, now: number, timing: PollTiming) => {
  const phase = phaseOf(poll, now, timing);
  return phase === 'open' || phase === 'closing';
};

export const endPoll = (poll: PollState, now: number): PollState =>
  isOpen(poll, now) ? { ...poll, endedAt: now } : poll;

/** More time for an open poll with a timer, never more than MAX_POLL_MS from now. */
export function extendPoll(poll: PollState, ms: number, now: number): PollState {
  if (!isOpen(poll, now) || poll.endsAt === null) return poll;
  return { ...poll, endsAt: Math.min(poll.endsAt + ms, now + MAX_POLL_MS) };
}

/**
 * Records a vote and says whether anything changed. With `allowChange` off, a viewer's first
 * vote stands. The option must already be a valid one: checking it here, after dropping the old
 * vote, is how a typo used to cost viewers the vote they had.
 */
export function castVote(poll: PollState, key: string, vote: Vote, allowChange: boolean): boolean {
  const previous = poll.votes.get(key);
  if (previous && (!allowChange || previous.option === vote.option)) return false;
  poll.votes.set(key, vote);
  return true;
}

export interface Tally {
  /** Votes per option, weighted. */
  counts: number[];
  total: number;
  /** Weighted votes from each platform. */
  byPlatform: Record<SubathonPlatform, number>;
  /** Options with the most votes: one winner, several on a tie, none before the first vote. */
  leaders: number[];
}

export function tally(poll: PollState): Tally {
  const counts = poll.options.map(() => 0);
  const byPlatform = { twitch: 0, kick: 0 };
  for (const vote of poll.votes.values()) {
    counts[vote.option] += vote.weight;
    byPlatform[vote.platform] += vote.weight;
  }
  const total = byPlatform.twitch + byPlatform.kick;
  const top = Math.max(0, ...counts);
  const leaders = top > 0 ? counts.flatMap((count, index) => (count === top ? [index] : [])) : [];
  return { counts, total, byPlatform, leaders };
}

/**
 * Text as viewers might type it: any case, with or without accents, Turkish dotted and dotless
 * i alike ("ISIK", "ışık" and "Işık" all match). JavaScript lowercases "I" to "i" and "İ" to
 * "i̇", so without this a Turkish option would only match when typed exactly.
 */
// Chat clients add an invisible character to get past Twitch's "identical message" block: 7TV
// U+E0000 (unassigned, so no \p{} class has it) and Chatterino U+034F (a mark).
export const foldText = (text: string) =>
  text
    .replace(/[İIı]/g, 'i')
    .normalize('NFD')
    .replace(/[\u{E0000}\p{M}\p{Cf}]/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

/**
 * The option a chat message votes for, or null. The whole message has to be the vote: "2",
 * "!2", "!vote 2", or an option's own text. So "4Head" and "1 more game" aren't votes. An
 * option's text wins over its number, so in "3 | 4 | 5" typing 3 votes for "3", not the third.
 */
export function parseVote(message: string, options: readonly string[]): number | null {
  let body = message.trim();
  const command = /^!vote\s+/i.exec(body);
  if (command) body = body.slice(command[0].length);
  else if (/^!\d+$/.test(body)) body = body.slice(1);
  const folded = foldText(body);
  if (!folded) return null;
  const byText = options.findIndex((option) => foldText(option) === folded);
  if (byText >= 0) return byText;
  // Folded, so "1 " plus a chat client's invisible suffix, or the keycap emoji 1️⃣, is still 1.
  if (!/^\d{1,2}$/.test(folded)) return null;
  const number = Number(folded);
  return number >= 1 && number <= options.length ? number - 1 : null;
}

export const COMMAND = '!poll';

export type PollCommand =
  /** `ms` null uses the overlay's poll length. */
  | { action: 'new'; question: string; options: string[]; ms: number | null }
  | { action: 'start'; ms: number | null }
  | { action: 'end' | 'cancel' }
  | { action: 'extend'; ms: number };

const ACTIONS: Record<string, 'start' | 'end' | 'cancel' | 'extend'> = {
  start: 'start',
  end: 'end',
  stop: 'end',
  close: 'end',
  cancel: 'cancel',
  clear: 'cancel',
  hide: 'cancel',
  extend: 'extend',
  add: 'extend',
};

/**
 * A poll length typed before the question: "90s", "2m", "1m30s", "1:30". A bare number isn't
 * one, so "!poll 3 games or 4? | 3 | 4" keeps its question.
 */
function pollLength(word: string): number | null {
  if (!/[hms:]/i.test(word)) return null;
  const ms = parseDuration(word);
  return ms === null ? null : Math.min(ms, MAX_POLL_MS);
}

/** Options as given, trimmed, with blanks and repeats (in any case) left out. */
export function cleanOptions(options: readonly string[]): string[] {
  const seen = new Set<string>();
  const clean: string[] = [];
  for (const raw of options) {
    // "|" splits options in chat commands and the URL, so it can't be part of one.
    const option = raw.replaceAll('|', ' ').trim().slice(0, OPTION_MAX_LENGTH).trim();
    const folded = foldText(option);
    if (!folded || seen.has(folded)) continue;
    seen.add(folded);
    clean.push(option);
  }
  return clean.slice(0, MAX_OPTIONS);
}

/**
 * Reads a mod's "!poll" message:
 * - "!poll Question | A | B", optionally with a length first ("!poll 90s Question | A | B");
 * - "!poll Question" alone makes a yes/no poll, with `yesNo` as the options;
 * - "!poll start [length]" starts the poll saved in the overlay's URL;
 * - "!poll end", "!poll cancel", "!poll extend <duration>".
 * Options past MAX_OPTIONS are dropped. Null for anything else, including a command word with
 * the wrong arguments.
 */
export function parsePollCommand(
  message: string,
  yesNo: readonly [string, string],
): PollCommand | null {
  const match = /^!poll(?:\s+([\s\S]*))?$/i.exec(message.trim());
  const rest = match?.[1]?.trim();
  if (!rest) return null;

  const words = rest.split(/\s+/);
  // A command word without "|" is a command, so a mistyped "!poll extend 30 seconds" does
  // nothing instead of putting that up as a yes/no question.
  const action = rest.includes('|') ? undefined : ACTIONS[words[0].toLowerCase()];
  if (action === 'start') {
    if (words.length === 1) return { action, ms: null };
    const ms = words.length === 2 ? pollLength(words[1]) : null;
    return ms === null ? null : { action, ms };
  }
  if (action === 'end' || action === 'cancel') return words.length === 1 ? { action } : null;
  if (action === 'extend') {
    // With a unit, like a poll's length: a bare "30" read as 30 minutes.
    const ms = pollLength(words.slice(1).join(''));
    return ms ? { action, ms } : null;
  }

  const ms = words.length > 1 ? pollLength(words[0]) : null;
  const body = ms === null ? rest : rest.slice(words[0].length).trim();
  const [question, ...given] = body.split('|');
  const options = cleanOptions(given.length > 0 ? given : yesNo);
  const title = question.trim().slice(0, QUESTION_MAX_LENGTH).trim();
  if (options.length < MIN_OPTIONS || (given.length === 0 && !title)) return null;
  return { action: 'new', question: title, options, ms };
}

/** How a poll is kept in OBS's localStorage. */
export interface SavedPoll {
  startedAt: number;
  question: string;
  options: string[];
  endsAt: number | null;
  endedAt: number | null;
  /** [voter, option, weight] */
  votes: [string, number, number][];
}

export function toSaved(poll: PollState): SavedPoll {
  return {
    startedAt: poll.startedAt,
    question: poll.question,
    options: poll.options,
    endsAt: poll.endsAt,
    endedAt: poll.endedAt,
    votes: [...poll.votes].map(([key, vote]) => [key, vote.option, vote.weight]),
  };
}

const isTime = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;
const isTimeOrNull = (value: unknown) => value === null || isTime(value);

/** A saved poll read back, or null when it's missing or not one. Bad votes are dropped. */
export function fromSaved(value: unknown): PollState | null {
  if (!value || typeof value !== 'object') return null;
  const saved = value as Record<string, unknown>;
  const options = saved.options;
  if (
    !isTime(saved.startedAt) ||
    typeof saved.question !== 'string' ||
    !Array.isArray(options) ||
    options.length < MIN_OPTIONS ||
    options.length > MAX_OPTIONS ||
    !options.every((option) => typeof option === 'string') ||
    !isTimeOrNull(saved.endsAt) ||
    !isTimeOrNull(saved.endedAt) ||
    !Array.isArray(saved.votes)
  ) {
    return null;
  }
  const votes = new Map<string, Vote>();
  for (const entry of saved.votes as unknown[]) {
    if (!Array.isArray(entry)) continue;
    const [key, option, weight] = entry;
    const platform = typeof key === 'string' ? key.split(':')[0] : '';
    if (
      (platform === 'twitch' || platform === 'kick') &&
      Number.isInteger(option) &&
      option >= 0 &&
      option < options.length &&
      Number.isInteger(weight) &&
      weight >= 1
    ) {
      votes.set(key, { option, weight, platform });
    }
  }
  return {
    startedAt: saved.startedAt,
    question: saved.question,
    options: options as string[],
    endsAt: saved.endsAt as number | null,
    endedAt: saved.endedAt as number | null,
    votes,
  };
}
