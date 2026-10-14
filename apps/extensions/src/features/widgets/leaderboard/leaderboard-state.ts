import type { SubathonEvent, SubathonPlatform } from '../subathon/subathon-events';

/** A supporter and their total: subs gifted, or Bits and Kicks. */
export interface Supporter {
  platform: SubathonPlatform;
  name: string;
  amount: number;
}

export const LATEST_KINDS = ['sub', 'gift', 'cheer', 'raid'] as const;
export type LatestKind = (typeof LATEST_KINDS)[number];

export interface LeaderboardData {
  /** Subs each gifter gave, since the last reset. */
  gifts: Supporter[];
  /** Bits and Kicks each viewer gave, since the last reset. */
  cheers: Supporter[];
  /** The newest of each kind, with its months, subs, Bits or Kicks, or raiders. */
  latest: Partial<Record<LatestKind, Supporter>>;
}

/** Supporters kept per board, far more than any board shows. */
export const MAX_SUPPORTERS = 100;
export const COMMAND = '!top';

export const emptyBoard = (): LeaderboardData => ({ gifts: [], cheers: [], latest: {} });

/** `list` with `amount` added to `name`'s total. */
function addTo(
  list: readonly Supporter[],
  platform: SubathonPlatform,
  name: string,
  amount: number,
) {
  const key = name.toLowerCase();
  const index = list.findIndex(
    (entry) => entry.platform === platform && entry.name.toLowerCase() === key,
  );
  if (index >= 0) {
    return list.map((entry, at) =>
      at === index ? { ...entry, amount: entry.amount + amount } : entry,
    );
  }
  const next = [...list, { platform, name, amount }];
  if (next.length <= MAX_SUPPORTERS) return next;
  // Full: the smallest total before this one makes room, never a top supporter.
  let smallest = 0;
  for (let at = 1; at < next.length - 1; at++)
    if (next[at].amount < next[smallest].amount) smallest = at;
  return next.filter((_, at) => at !== smallest);
}

/** The board after a support event; mod messages and Kick's later word on a sub change nothing. */
export function applySupport(data: LeaderboardData, event: SubathonEvent): LeaderboardData {
  switch (event.kind) {
    case 'sub': {
      if (event.again === 'shared') return data;
      const months = event.months ?? 0;
      if (event.again === 'repeat') {
        // Kick's second sub event brings the months of the sub already shown.
        const shown = data.latest.sub;
        if (
          !shown ||
          shown.platform !== 'kick' ||
          shown.name.toLowerCase() !== event.name.toLowerCase()
        )
          return data;
        return { ...data, latest: { ...data.latest, sub: { ...shown, amount: months } } };
      }
      return {
        ...data,
        latest: {
          ...data.latest,
          sub: { platform: event.platform, name: event.name, amount: months },
        },
      };
    }
    case 'gift':
      return {
        ...data,
        gifts: addTo(data.gifts, event.platform, event.name, event.count),
        latest: {
          ...data.latest,
          gift: { platform: event.platform, name: event.name, amount: event.count },
        },
      };
    case 'bits':
      return {
        ...data,
        cheers: addTo(data.cheers, event.platform, event.name, event.amount),
        latest: {
          ...data.latest,
          cheer: { platform: event.platform, name: event.name, amount: event.amount },
        },
      };
    case 'raid':
      return {
        ...data,
        latest: {
          ...data.latest,
          raid: { platform: event.platform, name: event.name, amount: event.viewers },
        },
      };
    case 'mod':
      return data;
  }
}

/** The top `rows` of a board, biggest first; a tie keeps who got there first. */
export const topOf = (list: readonly Supporter[], rows: number) =>
  list
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => b.entry.amount - a.entry.amount || a.index - b.index)
    .slice(0, rows)
    .map(({ entry }) => entry);

/** Reads "!top reset"; anything else is no command. */
export const isResetCommand = (text: string) => /^!top\s+reset$/i.test(text.trim());

/** Storage key per channel pair, so every board for the channel shares one set of totals. */
export const storageKey = (twitch = '', kick = '') =>
  `senchabot.leaderboard:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}`;

const isSupporter = (value: unknown): value is Supporter => {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Record<string, unknown>;
  return (
    (entry.platform === 'twitch' || entry.platform === 'kick') &&
    typeof entry.name === 'string' &&
    typeof entry.amount === 'number'
  );
};

/** The saved board, or an empty one when there's none or it's garbage. */
export function loadBoard(key: string | null): LeaderboardData {
  if (!key) return emptyBoard();
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) ?? 'null') as Record<
      string,
      unknown
    > | null;
    if (!saved || typeof saved !== 'object') return emptyBoard();
    const list = (value: unknown) => (Array.isArray(value) ? value.filter(isSupporter) : []);
    const latest: LeaderboardData['latest'] = {};
    const savedLatest = (saved.latest ?? {}) as Record<string, unknown>;
    for (const kind of LATEST_KINDS) {
      if (isSupporter(savedLatest[kind])) latest[kind] = savedLatest[kind] as Supporter;
    }
    return { gifts: list(saved.gifts), cheers: list(saved.cheers), latest };
  } catch {
    return emptyBoard();
  }
}
