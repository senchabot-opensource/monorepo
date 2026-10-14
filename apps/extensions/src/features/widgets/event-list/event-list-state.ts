import type { EventKind, EventListSettings } from '#/lib/event-list-url';
import type { SubathonEvent, SubathonPlatform, SubTier } from '../subathon/subathon-events';

/** One row of the list. */
export interface EventEntry {
  id: number;
  kind: EventKind;
  platform: SubathonPlatform;
  name: string;
  /** A sub's months in total (0 when new or not known), a gift's subs, Bits or Kicks, raiders. */
  amount: number;
  tier: SubTier;
  /** When it came in, in ms. */
  at: number;
}

/** Events kept in OBS; more than the most rows a list can show, so a filter change has some. */
export const MAX_KEPT = 30;
/** How long Kick's second sub event, the one with the months, may trail the first. */
export const KICK_MONTHS_WINDOW_MS = 10_000;

export const COMMAND = '!events';

/**
 * A row for a support event, or null for a mod's message and for Kick's later word on a sub
 * already listed. Kick's second sub event brings the months, so it fills them in instead.
 */
export function addEvent(
  list: readonly EventEntry[],
  event: SubathonEvent,
  id: number,
  now: number,
): EventEntry[] | null {
  switch (event.kind) {
    case 'mod':
      return null;
    case 'sub': {
      if (event.again) {
        if (event.again === 'shared' || !event.months) return null;
        const key = event.name.toLowerCase();
        const index = list.findIndex(
          (entry) =>
            entry.kind === 'sub' &&
            entry.platform === event.platform &&
            entry.name.toLowerCase() === key &&
            now - entry.at <= KICK_MONTHS_WINDOW_MS,
        );
        if (index < 0) return null;
        return list.map((entry, at) =>
          at === index ? { ...entry, amount: event.months ?? entry.amount } : entry,
        );
      }
      return keep([
        ...list,
        {
          id,
          kind: 'sub',
          platform: event.platform,
          name: event.name,
          amount: event.months ?? 0,
          tier: event.tier,
          at: now,
        },
      ]);
    }
    case 'gift':
      return keep([
        ...list,
        {
          id,
          kind: 'gift',
          platform: event.platform,
          name: event.name,
          amount: event.count,
          tier: event.tier,
          at: now,
        },
      ]);
    case 'bits':
      return keep([
        ...list,
        {
          id,
          kind: 'bits',
          platform: event.platform,
          name: event.name,
          amount: event.amount,
          tier: 1,
          at: now,
        },
      ]);
    case 'raid':
      return keep([
        ...list,
        {
          id,
          kind: 'raid',
          platform: event.platform,
          name: event.name,
          amount: event.viewers,
          tier: 1,
          at: now,
        },
      ]);
  }
}

const keep = (list: EventEntry[]) => list.slice(-MAX_KEPT);

type ShownSettings = Pick<EventListSettings, 'kinds' | 'minBits' | 'minRaid' | 'rows' | 'fade'>;

/** The rows to show now, oldest first: the right kinds, over the minimums, not faded yet. */
export function shownEntries(
  list: readonly EventEntry[],
  settings: ShownSettings,
  now: number,
): EventEntry[] {
  return list
    .filter((entry) => {
      if (!settings.kinds[entry.kind]) return false;
      if (entry.kind === 'bits' && entry.amount < settings.minBits) return false;
      if (entry.kind === 'raid' && entry.amount < settings.minRaid) return false;
      return settings.fade <= 0 || now - entry.at < settings.fade * 1000;
    })
    .slice(-settings.rows);
}

/** Reads "!events clear"; null for anything else. */
export const isClearCommand = (text: string) => /^!events\s+clear$/i.test(text.trim());

/** Storage key per channel pair, so every Event List source for the channel shares one list. */
export const storageKey = (twitch = '', kick = '') =>
  `senchabot.event-list:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}`;

const isEntry = (value: unknown): value is EventEntry => {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === 'number' &&
    ['sub', 'gift', 'bits', 'raid'].includes(entry.kind as string) &&
    (entry.platform === 'twitch' || entry.platform === 'kick') &&
    typeof entry.name === 'string' &&
    typeof entry.amount === 'number' &&
    [1, 2, 3].includes(entry.tier as number) &&
    typeof entry.at === 'number'
  );
};

/** The saved list, or an empty one when there's none or it's garbage. */
export function loadEntries(key: string | null): EventEntry[] {
  if (!key) return [];
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(key) ?? 'null');
    if (Array.isArray(saved)) return saved.filter(isEntry).slice(-MAX_KEPT);
  } catch {
    // Storage blocked or garbage: start empty.
  }
  return [];
}
