import type { SubathonEvent, SubathonPlatform } from '../subathon/subathon-events';
import type { ViewerChatEvent } from '../viewer-chat/viewer-chat';

/** Someone in the credits, with what they gave: months, subs gifted, Bits or Kicks, raiders. */
export interface Credit {
  platform: SubathonPlatform;
  name: string;
  amount: number;
}

/** Everything the roll lists, collected while the browser source runs. */
export interface CreditsData {
  subs: Credit[];
  gifts: Credit[];
  cheers: Credit[];
  raids: Credit[];
  mods: Credit[];
  chatters: Credit[];
  /** The last time anything came in, in ms; a long gap means a new stream. */
  updatedAt: number;
}

export type CreditList = Exclude<keyof CreditsData, 'updatedAt'>;
const LISTS: readonly CreditList[] = ['subs', 'gifts', 'cheers', 'raids', 'mods', 'chatters'];

/** Hours without anything coming in after which the next stream starts with empty credits. */
export const NEW_STREAM_HOURS = 12;
/** Names kept per list, so a huge chat can't fill the browser source's storage. */
export const MAX_NAMES = 500;

export const COMMAND = '!credits';

export const emptyCredits = (now = 0): CreditsData => ({
  subs: [],
  gifts: [],
  cheers: [],
  raids: [],
  mods: [],
  chatters: [],
  updatedAt: now,
});

const sameAs = (platform: SubathonPlatform, name: string) => {
  const key = name.toLowerCase();
  return (credit: Credit) => credit.platform === platform && credit.name.toLowerCase() === key;
};

/**
 * `list` with `name` in it once. `add` sums amounts (gifts, cheers, raiders); otherwise the
 * bigger one stays (a sub's months), and a name already there keeps its place.
 */
function credit(
  list: readonly Credit[],
  platform: SubathonPlatform,
  name: string,
  amount: number,
  add: boolean,
): Credit[] {
  const index = list.findIndex(sameAs(platform, name));
  if (index < 0) {
    return list.length >= MAX_NAMES ? (list as Credit[]) : [...list, { platform, name, amount }];
  }
  return list.map((entry, at) =>
    at === index
      ? { ...entry, amount: add ? entry.amount + amount : Math.max(entry.amount, amount) }
      : entry,
  );
}

/** The credits after a support event; mod messages change nothing here. */
export function creditSupport(data: CreditsData, event: SubathonEvent, now: number): CreditsData {
  switch (event.kind) {
    case 'sub':
      // A shared resub is a sub already credited; Kick's second event may bring its months.
      return {
        ...data,
        subs: credit(data.subs, event.platform, event.name, event.months ?? 0, false),
        updatedAt: now,
      };
    case 'gift':
      return {
        ...data,
        gifts: credit(data.gifts, event.platform, event.name, event.count, true),
        updatedAt: now,
      };
    case 'bits':
      return {
        ...data,
        cheers: credit(data.cheers, event.platform, event.name, event.amount, true),
        updatedAt: now,
      };
    case 'raid':
      return {
        ...data,
        raids: credit(data.raids, event.platform, event.name, event.viewers, true),
        updatedAt: now,
      };
    case 'mod':
      return data;
  }
}

/**
 * The credits after a chat message: everyone who chats is a chatter, mods are credited as mods
 * too. Bots and the broadcaster stay out, and a ban takes the viewer out of the chatters.
 */
export function creditChat(data: CreditsData, event: ViewerChatEvent, now: number): CreditsData {
  if (event.kind === 'ban') {
    const banned = (entry: Credit) =>
      entry.platform === event.platform && entry.name.toLowerCase() === event.login;
    return { ...data, chatters: data.chatters.filter((entry) => !banned(entry)) };
  }
  if (event.bot || event.broadcaster) return data;
  const chatters = data.chatters.some(sameAs(event.platform, event.name))
    ? data.chatters
    : credit(data.chatters, event.platform, event.name, 0, false);
  const mods =
    event.mod && !data.mods.some(sameAs(event.platform, event.name))
      ? credit(data.mods, event.platform, event.name, 0, false)
      : data.mods;
  if (chatters === data.chatters && mods === data.mods) return data;
  return { ...data, chatters, mods, updatedAt: now };
}

/** The roll's lists, biggest givers first; subs and chatters keep the order they came in. */
export function sortedCredits(data: CreditsData): Record<CreditList, Credit[]> {
  const byAmount = (list: Credit[]) => [...list].sort((a, b) => b.amount - a.amount);
  return {
    subs: data.subs,
    gifts: byAmount(data.gifts),
    cheers: byAmount(data.cheers),
    raids: byAmount(data.raids),
    mods: data.mods,
    chatters: data.chatters,
  };
}

export type CreditsCommand = 'roll' | 'reset' | 'stop';

/** Reads "!credits", "!credits reset" and "!credits stop"; null for anything else. */
export function parseCreditsCommand(text: string): CreditsCommand | null {
  const [command, word, ...rest] = text.trim().toLowerCase().split(/\s+/);
  if (command !== COMMAND || rest.length > 0) return null;
  if (word === undefined) return 'roll';
  if (word === 'reset' || word === 'stop') return word;
  return null;
}

/** Storage key per channel pair, so every End Credits source for the channel shares one roll. */
export const storageKey = (twitch = '', kick = '') =>
  `senchabot.credits:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}`;

const isCredit = (value: unknown): value is Credit => {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Record<string, unknown>;
  return (
    (entry.platform === 'twitch' || entry.platform === 'kick') &&
    typeof entry.name === 'string' &&
    typeof entry.amount === 'number'
  );
};

/**
 * The saved credits, or empty ones when there are none, they're garbage, or the last thing came
 * in more than NEW_STREAM_HOURS ago: that was another stream.
 */
export function loadCredits(key: string | null, now: number): CreditsData {
  if (!key) return emptyCredits(now);
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) ?? 'null') as Record<
      string,
      unknown
    > | null;
    if (!saved || typeof saved.updatedAt !== 'number') return emptyCredits(now);
    if (now - saved.updatedAt > NEW_STREAM_HOURS * 3_600_000) return emptyCredits(now);
    const data = emptyCredits(saved.updatedAt);
    for (const list of LISTS) {
      const value = saved[list];
      data[list] = Array.isArray(value) ? value.filter(isCredit).slice(0, MAX_NAMES) : [];
    }
    return data;
  } catch {
    return emptyCredits(now);
  }
}
