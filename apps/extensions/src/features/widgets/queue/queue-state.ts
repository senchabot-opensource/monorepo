import type { QueueSettings } from '#/lib/queue-url';
import type { SubathonPlatform } from '../subathon/subathon-events';
import type { ViewerChatEvent } from '../viewer-chat/viewer-chat';

/** A viewer in line, with what they typed after the join word (an in-game name, a mode). */
export interface QueueEntry {
  platform: SubathonPlatform;
  login: string;
  name: string;
  note: string;
}

export interface QueueState {
  open: boolean;
  /** In line, first first. */
  waiting: QueueEntry[];
  /** Called up with the last !next. */
  playing: QueueEntry[];
}

export const NOTE_MAX_LENGTH = 24;
export const COMMAND = '!queue';
export const NEXT_COMMAND = '!next';
export const LEAVE_COMMAND = '!leave';

export const emptyQueue = (): QueueState => ({ open: true, waiting: [], playing: [] });

const isSame = (platform: SubathonPlatform, login: string) => (entry: QueueEntry) =>
  entry.platform === platform && entry.login === login;

// "@Name" or "name", matched against the login or the name on screen.
const isNamed = (name: string) => {
  const key = name.replace(/^@/, '').toLowerCase();
  return (entry: QueueEntry) => entry.login === key || entry.name.toLowerCase() === key;
};

type Rules = Pick<QueueSettings, 'join' | 'subsOnly' | 'max' | 'group'>;

/**
 * The queue after one chat event. Viewers join with the join word (and a note) and leave with
 * !leave; mods open, close, clear and call viewers up from chat; a ban takes the viewer out.
 */
export function applyChat(state: QueueState, event: ViewerChatEvent, rules: Rules): QueueState {
  if (event.kind === 'ban') {
    const out = (entry: QueueEntry) => !isSame(event.platform, event.login)(entry);
    return { ...state, waiting: state.waiting.filter(out), playing: state.playing.filter(out) };
  }
  if (event.aside || event.bot) return state;
  const [word = '', ...rest] = event.text.split(/\s+/);
  const command = word.toLowerCase();

  if (event.mod) {
    const changed = modCommand(state, command, rest, rules);
    if (changed) return changed;
  }
  if (command === rules.join) {
    if (!state.open || (rules.subsOnly && !event.sub)) return state;
    const inLine = isSame(event.platform, event.login);
    if (state.waiting.some(inLine) || state.playing.some(inLine)) return state;
    if (rules.max > 0 && state.waiting.length >= rules.max) return state;
    const note = Array.from(rest.join(' ')).slice(0, NOTE_MAX_LENGTH).join('');
    const entry = { platform: event.platform, login: event.login, name: event.name, note };
    return { ...state, waiting: [...state.waiting, entry] };
  }
  if (command === LEAVE_COMMAND && rest.length === 0) {
    const out = (entry: QueueEntry) => !isSame(event.platform, event.login)(entry);
    if (!state.waiting.some(isSame(event.platform, event.login))) return state;
    return { ...state, waiting: state.waiting.filter(out) };
  }
  return state;
}

/** A mod's queue command, or null when the message isn't one. */
function modCommand(
  state: QueueState,
  command: string,
  args: string[],
  rules: Rules,
): QueueState | null {
  if (command === NEXT_COMMAND) {
    if (args.length > 1) return null;
    const count = args.length === 0 ? rules.group : Number(args[0]);
    if (!Number.isInteger(count) || count < 1 || count > 50) return null;
    return {
      ...state,
      playing: state.waiting.slice(0, count),
      waiting: state.waiting.slice(count),
    };
  }
  if (command !== COMMAND) return null;
  const [action = '', name, ...more] = args;
  switch (action.toLowerCase()) {
    case 'open':
    case 'close':
      return args.length === 1 ? { ...state, open: action.toLowerCase() === 'open' } : null;
    case 'clear':
      return args.length === 1 ? { ...state, waiting: [], playing: [] } : null;
    case 'remove': {
      if (!name || more.length > 0) return null;
      const keep = (entry: QueueEntry) => !isNamed(name)(entry);
      return { ...state, waiting: state.waiting.filter(keep), playing: state.playing.filter(keep) };
    }
    default:
      return null;
  }
}

/** Storage key per channel pair, so every Viewer Queue source for the channel shares one line. */
export const storageKey = (twitch = '', kick = '') =>
  `senchabot.queue:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}`;

const isEntry = (value: unknown): value is QueueEntry => {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Record<string, unknown>;
  return (
    (entry.platform === 'twitch' || entry.platform === 'kick') &&
    typeof entry.login === 'string' &&
    typeof entry.name === 'string' &&
    typeof entry.note === 'string'
  );
};

/** The saved queue, or a new open one when there's none or it's garbage. */
export function loadQueue(key: string | null): QueueState {
  if (!key) return emptyQueue();
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) ?? 'null') as Record<
      string,
      unknown
    > | null;
    if (!saved || typeof saved.open !== 'boolean') return emptyQueue();
    const list = (value: unknown) => (Array.isArray(value) ? value.filter(isEntry) : []);
    return { open: saved.open, waiting: list(saved.waiting), playing: list(saved.playing) };
  } catch {
    return emptyQueue();
  }
}
