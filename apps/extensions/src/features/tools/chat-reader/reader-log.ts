import type { ChatMessagesType } from '#/features/widgets/chat-widget/chat-messages';
import type { ChatPlatform } from '#/features/tools/command-users';

/** Rows kept in memory and on disk; older ones fall off the top. */
export const MAX_ENTRIES = 1000;
/** Saved history older than this is dropped when the page opens. */
export const SAVED_HISTORY_MS = 12 * 60 * 60 * 1000;

export type ReaderEvent =
  | { kind: 'connected'; platform: ChatPlatform; channel: string }
  | { kind: 'disconnected'; platform: ChatPlatform }
  | { kind: 'reconnected'; platform: ChatPlatform; downMs: number }
  | { kind: 'networkLost' }
  | { kind: 'networkBack' }
  | { kind: 'chatCleared'; platform: ChatPlatform }
  | { kind: 'resumed'; savedAt: number };

export type ReaderEntry =
  | { type: 'message'; key: string; at: number; msg: ChatMessagesType; deleted?: boolean }
  | { type: 'event'; key: string; at: number; event: ReaderEvent };

export type ReaderOp =
  | { op: 'message'; msg: ChatMessagesType; at: number }
  | { op: 'event'; event: ReaderEvent; at: number }
  | { op: 'delete'; id: string }
  | { op: 'deleteUser'; platform: ChatPlatform; userLower: string }
  | { op: 'clear' };

let eventCounter = 0;

const trim = (entries: ReaderEntry[]) =>
  entries.length > MAX_ENTRIES ? entries.slice(entries.length - MAX_ENTRIES) : entries;

function applyOne(entries: ReaderEntry[], op: ReaderOp): ReaderEntry[] {
  switch (op.op) {
    case 'message':
      return [
        ...entries,
        { type: 'message', key: `${op.msg.platform}:${op.msg.id}`, at: op.at, msg: op.msg },
      ];
    case 'event':
      return [
        ...entries,
        { type: 'event', key: `event:${op.at}:${++eventCounter}`, at: op.at, event: op.event },
      ];
    case 'delete': {
      let changed = false;
      const next = entries.map((entry) => {
        if (entry.type !== 'message' || entry.msg.id !== op.id || entry.deleted) return entry;
        changed = true;
        return { ...entry, deleted: true };
      });
      return changed ? next : entries;
    }
    case 'deleteUser': {
      let changed = false;
      const next = entries.map((entry) => {
        if (
          entry.type !== 'message' ||
          entry.deleted ||
          entry.msg.platform !== op.platform ||
          (entry.msg.userLower ?? entry.msg.user.toLowerCase()) !== op.userLower
        ) {
          return entry;
        }
        changed = true;
        return { ...entry, deleted: true };
      });
      return changed ? next : entries;
    }
    case 'clear':
      return [];
  }
}

/** Applies queued changes in order; returns the same array when nothing changed. */
export function applyOps(entries: ReaderEntry[], ops: ReaderOp[]): ReaderEntry[] {
  let next = entries;
  for (const op of ops) next = applyOne(next, op);
  return next === entries ? entries : trim(next);
}

// Saved as JSON: message dates become ISO strings and are revived on load.
type SavedLog = { savedAt: number; entries: ReaderEntry[] };

export function serializeLog(entries: ReaderEntry[], now: number): string {
  // Earlier "resumed" markers would stack up one per visit.
  const kept = entries.filter((entry) => entry.type !== 'event' || entry.event.kind !== 'resumed');
  return JSON.stringify({ savedAt: now, entries: kept } satisfies SavedLog);
}

export function deserializeLog(text: string | null, now: number): SavedLog | null {
  if (!text) return null;
  try {
    const saved = JSON.parse(text) as SavedLog;
    if (typeof saved.savedAt !== 'number' || !Array.isArray(saved.entries)) return null;
    const entries = saved.entries
      .filter((entry) => typeof entry.at === 'number' && now - entry.at < SAVED_HISTORY_MS)
      .map((entry): ReaderEntry => {
        if (entry.type !== 'message') return entry;
        const msg = entry.msg;
        return {
          ...entry,
          msg: {
            ...msg,
            timestamp: new Date(msg.timestamp),
            receivedAt: new Date(msg.receivedAt),
          },
        };
      });
    return { savedAt: saved.savedAt, entries };
  } catch {
    return null;
  }
}

export const storageKey = (twitch: string, kick: string) =>
  `chat-reader:${twitch.toLowerCase()}|${kick.toLowerCase()}`;
