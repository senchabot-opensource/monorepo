import type { FeaturedMode } from '#/lib/featured-url';
import { parseTwitchEmoteRanges, type TwitchEmoteRange } from '#/lib/twitch-emotes';
import type { SubathonPlatform } from '../subathon/subathon-events';
import type { ViewerMessage } from '../viewer-chat/viewer-chat';

/** A chat message as the overlay draws it. */
export interface ChatLine {
  /** The platform's message id, which a deletion names. */
  id: string;
  platform: SubathonPlatform;
  /** Lowercase login, which tells viewers apart. */
  login: string;
  name: string;
  /** Name color as chat sent it; none when the viewer never picked one. */
  color?: string;
  /** Twitch's "set/version" badges, Kick's "type" or "type/months". */
  badges: string[];
  /** Twitch: the plain text, its emotes in `emotes`. Kick: the text with its [emote:id:name] codes. */
  message: string;
  /** Twitch's IRC emotes tag for `message`. */
  emotes?: string;
}

export type ShownKind = 'feature' | 'question';

/** What is on screen: a message a mod featured, or the question a mod called up. */
export interface ShownLine extends ChatLine {
  kind: ShownKind;
  /** When it went up, in ms since the epoch: the hide timer counts from here. */
  at: number;
}

export interface FeaturedState {
  /** Each chatter's last message, newest last. Kept in memory only. */
  recent: ChatLine[];
  /** Questions waiting, oldest first. */
  questions: ChatLine[];
  shown: ShownLine | null;
}

/** A viewer's chat message with what it takes to draw it. */
export interface FeaturedMessage extends ViewerMessage {
  id: string;
  color?: string;
  badges: string[];
  /** The text as drawn: Kick's keeps its [emote:id:name] codes, Twitch's is `text`. */
  display: string;
  /** Twitch's IRC emotes tag. */
  emotes?: string;
}

export type FeaturedChatEvent =
  | FeaturedMessage
  /** A timeout or ban: the viewer's messages and questions go. */
  | { kind: 'ban'; platform: SubathonPlatform; login: string }
  /** A mod deleted one message. */
  | { kind: 'delete'; platform: SubathonPlatform; id: string };

export const FEATURE_COMMAND = '!feature';
export const QUESTION_COMMAND = '!q';
/** What mods type after !q. A viewer's "!q next" is neither a question nor a command. */
export const QA_ACTIONS = ['next', 'skip', 'clear', 'off'] as const;
type QaAction = (typeof QA_ACTIONS)[number];

/** Chatters whose last message is remembered; the quietest one is forgotten first. */
export const RECENT_MAX = 500;
/** A longer question is cut here, with "…". */
export const QUESTION_MAX_LENGTH = 200;
/** Questions waiting at most; more are ignored until mods take some. */
export const QUESTIONS_MAX = 100;

export const emptyState = (): FeaturedState => ({ recent: [], questions: [], shown: null });

const lineOf = (event: FeaturedMessage): ChatLine => ({
  id: event.id,
  platform: event.platform,
  login: event.login,
  name: event.name,
  ...(event.color ? { color: event.color } : {}),
  badges: event.badges,
  message: event.display,
  ...(event.emotes ? { emotes: event.emotes } : {}),
});

/** A Twitch emotes tag from its ranges, emotes in the order they first appear. */
export function serializeEmoteRanges(ranges: readonly TwitchEmoteRange[]): string | undefined {
  const byId = new Map<string, string[]>();
  for (const { id, start, end } of ranges) {
    byId.set(id, [...(byId.get(id) ?? []), `${start}-${end}`]);
  }
  if (byId.size === 0) return undefined;
  return [...byId].map(([id, positions]) => `${id}:${positions.join(',')}`).join('/');
}

/**
 * A Twitch message from code point `from` on, cut to `max` code points with "…". Emote
 * positions count code points, so they move back with the start; an emote the cut would split
 * goes whole.
 */
export function sliceTwitchText(
  message: string,
  emotes: string | undefined,
  from: number,
  max: number,
): { message: string; emotes?: string } {
  const chars = [...message].slice(from);
  let ranges = parseTwitchEmoteRanges(emotes)
    .map((range) => ({ ...range, start: range.start - from, end: range.end - from }))
    .filter((range) => range.start >= 0 && range.end < chars.length);
  let text = chars.join('');
  if (chars.length > max) {
    let cut = max;
    for (const range of ranges) if (range.start < cut && range.end >= cut) cut = range.start;
    ranges = ranges.filter((range) => range.end < cut);
    text = `${chars.slice(0, cut).join('').trimEnd()}…`;
  }
  const tag = serializeEmoteRanges(ranges);
  return tag ? { message: text, emotes: tag } : { message: text };
}

const KICK_EMOTE_CODE = /(\[emote:\d+:[\w-]+\])/;
const KICK_EMOTE_NAME = /^\[emote:\d+:([\w-]+)\]$/;

/**
 * A Kick message cut to `max` characters as viewers see them, an emote counting as its name,
 * with "…". An emote the cut would split goes whole.
 */
export function cutKickText(message: string, max: number): string {
  let left = max;
  let out = '';
  for (const part of message.split(KICK_EMOTE_CODE)) {
    if (!part) continue;
    const emote = KICK_EMOTE_NAME.exec(part);
    const length = [...(emote ? emote[1] : part)].length;
    if (length <= left) {
      out += part;
      left -= length;
      continue;
    }
    if (!emote) out += [...part].slice(0, left).join('');
    return `${out.trimEnd()}…`;
  }
  return out;
}

/** A `!q` message's question: the text after the command word, cut to the longest allowed. */
function questionOf(event: FeaturedMessage): ChatLine {
  const { emotes: _, ...line } = lineOf(event);
  const prefix = /^\S+\s+/.exec(event.display)?.[0] ?? event.display;
  if (event.platform === 'kick') {
    return {
      ...line,
      message: cutKickText(event.display.slice(prefix.length), QUESTION_MAX_LENGTH),
    };
  }
  return {
    ...line,
    ...sliceTwitchText(event.display, event.emotes, [...prefix].length, QUESTION_MAX_LENGTH),
  };
}

const sameViewer = (platform: SubathonPlatform, login: string) => (line: ChatLine) =>
  line.platform === platform && line.login === login;

// The list itself when nothing went, so the overlay doesn't redraw for a chatter it never knew.
const keep = <T>(list: T[], next: T[]) => (next.length === list.length ? list : next);

/** The state without every line `gone` matches, on screen too. */
function without(state: FeaturedState, gone: (line: ChatLine) => boolean): FeaturedState {
  const recent = keep(
    state.recent,
    state.recent.filter((line) => !gone(line)),
  );
  const questions = keep(
    state.questions,
    state.questions.filter((line) => !gone(line)),
  );
  const shown = state.shown && gone(state.shown) ? null : state.shown;
  if (recent === state.recent && questions === state.questions && shown === state.shown) {
    return state;
  }
  return { recent, questions, shown };
}

/** The last message of the viewer named "@name" or "name", by login or display name. */
export function findLastMessage(recent: readonly ChatLine[], name: string): ChatLine | null {
  const key = name.replace(/^@/, '').toLowerCase();
  if (!key) return null;
  // Newest last: the same name on Twitch and Kick gives the one who spoke last.
  for (let index = recent.length - 1; index >= 0; index--) {
    const line = recent[index];
    if (line.login === key || line.name.toLowerCase() === key) return line;
  }
  return null;
}

const hide = (state: FeaturedState): FeaturedState =>
  state.shown ? { ...state, shown: null } : state;

/** `!feature @name` puts that viewer's last message up; `!feature` or `!feature off` hides it. */
function feature(state: FeaturedState, args: string[], now: number): FeaturedState {
  const [target = ''] = args;
  if (!target || target.toLowerCase() === 'off') return hide(state);
  const line = findLastMessage(state.recent, target);
  return line ? { ...state, shown: { ...line, kind: 'feature', at: now } } : state;
}

function qaAction(state: FeaturedState, action: QaAction, now: number): FeaturedState {
  switch (action) {
    case 'next': {
      const [first, ...rest] = state.questions;
      // With none left, the answered question still goes.
      if (!first) return state.shown?.kind === 'question' ? hide(state) : state;
      return { ...state, questions: rest, shown: { ...first, kind: 'question', at: now } };
    }
    case 'skip':
      return state.questions.length > 0 ? { ...state, questions: state.questions.slice(1) } : state;
    case 'clear':
      return state.questions.length > 0 ? { ...state, questions: [] } : state;
    case 'off':
      return hide(state);
  }
}

/** `!q <question>` from anyone; `!q next`, `skip`, `clear` and `off` from mods. */
function question(
  state: FeaturedState,
  event: FeaturedMessage,
  args: string[],
  now: number,
): FeaturedState {
  if (args.length === 0) return state;
  const action = args[0].toLowerCase() as QaAction;
  if (args.length === 1 && QA_ACTIONS.includes(action)) {
    return event.mod ? qaAction(state, action, now) : state;
  }
  const line = questionOf(event);
  if (!line.message) return state;
  // One open question each: a new one takes the old one's place in line.
  const at = state.questions.findIndex(sameViewer(event.platform, event.login));
  if (at >= 0) {
    return {
      ...state,
      questions: state.questions.map((old, index) => (index === at ? line : old)),
    };
  }
  if (state.questions.length >= QUESTIONS_MAX) return state;
  return { ...state, questions: [...state.questions, line] };
}

/** Remembers a chatter's last message, forgetting the quietest chatter past RECENT_MAX. */
function remember(state: FeaturedState, line: ChatLine): FeaturedState {
  const recent = state.recent.filter((old) => !sameViewer(line.platform, line.login)(old));
  recent.push(line);
  return { ...state, recent: recent.length > RECENT_MAX ? recent.slice(-RECENT_MAX) : recent };
}

/**
 * The state after one chat event. Every message is remembered as its chatter's last, except
 * bots', replies and commands; mods feature one with !feature and run the questions viewers ask
 * with !q. `mode` turns either command off. A timeout, ban or deletion takes the viewer's
 * messages and questions away, off the screen too.
 */
export function applyChat(
  state: FeaturedState,
  event: FeaturedChatEvent,
  mode: FeaturedMode,
  now: number,
): FeaturedState {
  if (event.kind === 'ban') return without(state, sameViewer(event.platform, event.login));
  if (event.kind === 'delete') {
    return without(state, (line) => line.platform === event.platform && line.id === event.id);
  }
  if (event.aside || event.bot || !event.text) return state;
  const [word = '', ...args] = event.text.split(/\s+/);
  const command = word.toLowerCase();
  if (command === FEATURE_COMMAND && mode !== 'qa') {
    return event.mod ? feature(state, args, now) : state;
  }
  if (command === QUESTION_COMMAND && mode !== 'feature') return question(state, event, args, now);
  // Commands for other widgets and bots, and nothing to feature with !feature off.
  if (event.text.startsWith('!') || mode === 'qa') return state;
  return remember(state, lineOf(event));
}

/** The state with `shown` off the screen, unless something else went up since. */
export const expire = (state: FeaturedState, shown: ShownLine): FeaturedState =>
  state.shown === shown ? { ...state, shown: null } : state;

/** Storage key per channel pair, so every Featured Message source for the channel shares one. */
export const storageKey = (twitch = '', kick = '') =>
  `senchabot.featured:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}`;

const isText = (value: unknown) => typeof value === 'string';
const isOptionalText = (value: unknown) => value === undefined || typeof value === 'string';

const isLine = (value: unknown): value is ChatLine => {
  if (!value || typeof value !== 'object') return false;
  const line = value as Record<string, unknown>;
  return (
    isText(line.id) &&
    (line.platform === 'twitch' || line.platform === 'kick') &&
    isText(line.login) &&
    isText(line.name) &&
    isOptionalText(line.color) &&
    Array.isArray(line.badges) &&
    line.badges.every(isText) &&
    isText(line.message) &&
    isOptionalText(line.emotes)
  );
};

const isShown = (value: unknown): value is ShownLine => {
  if (!isLine(value)) return false;
  const { kind, at } = value as unknown as Record<string, unknown>;
  return (kind === 'feature' || kind === 'question') && typeof at === 'number';
};

/** What a reload brings back: the questions waiting and what is on screen. */
export const savedState = ({ questions, shown }: FeaturedState) =>
  JSON.stringify({ questions, shown });

/** The saved questions and shown message, or an empty state when there's none or it's garbage. */
export function loadState(key: string | null): FeaturedState {
  if (!key) return emptyState();
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) ?? 'null') as Record<
      string,
      unknown
    > | null;
    if (!saved || typeof saved !== 'object') return emptyState();
    const questions = Array.isArray(saved.questions)
      ? saved.questions.filter(isLine).slice(0, QUESTIONS_MAX)
      : [];
    return { recent: [], questions, shown: isShown(saved.shown) ? saved.shown : null };
  } catch {
    return emptyState();
  }
}
