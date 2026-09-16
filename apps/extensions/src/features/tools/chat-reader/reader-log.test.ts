import { describe, expect, it } from 'vitest';
import type { ChatMessagesType } from '#/features/widgets/chat-widget/chat-messages';
import {
  applyOps,
  deserializeLog,
  MAX_ENTRIES,
  type ReaderEntry,
  SAVED_HISTORY_MS,
  serializeLog,
} from './reader-log';

const T0 = Date.parse('2026-09-13T20:00:00Z');

const msg = (
  id: string,
  sentAt: number,
  extra: Partial<ChatMessagesType> = {},
): ChatMessagesType => ({
  id,
  user: 'Viewer',
  message: `message ${id}`,
  platform: 'kick',
  timestamp: new Date(sentAt),
  receivedAt: new Date(sentAt),
  ...extra,
});

const rows = (entries: ReaderEntry[]) =>
  entries.map((entry) =>
    entry.type === 'message'
      ? `${entry.msg.id}${entry.deleted ? ' (deleted)' : ''}`
      : `[${entry.event.kind}]`,
  );

describe('reader log', () => {
  it('keeps deleted and timed-out messages, marked', () => {
    const log = applyOps(
      [],
      [
        { op: 'message', msg: msg('a', T0, { user: 'Spammer' }), at: T0 },
        { op: 'message', msg: msg('b', T0, { user: 'Viewer' }), at: T0 },
        { op: 'message', msg: msg('c', T0, { user: 'spammer', platform: 'twitch' }), at: T0 },
        { op: 'message', msg: msg('d', T0, { user: 'SPAMMER' }), at: T0 },
        { op: 'delete', id: 'b' },
        // A Kick ban only covers Kick messages.
        { op: 'deleteUser', platform: 'kick', userLower: 'spammer' },
      ],
    );
    expect(rows(log)).toEqual(['a (deleted)', 'b (deleted)', 'c', 'd (deleted)']);
  });

  it('keeps the newest rows once it is full', () => {
    const ops = Array.from({ length: MAX_ENTRIES + 5 }, (_, i) => ({
      op: 'message' as const,
      msg: msg(String(i), T0 + i),
      at: T0 + i,
    }));
    const log = applyOps([], ops);
    expect(log).toHaveLength(MAX_ENTRIES);
    expect(rows(log)[0]).toBe('5');
  });
});

describe('saved reader log', () => {
  it('round-trips messages with their dates and marks where the visit resumed', () => {
    const log = applyOps(
      [],
      [
        { op: 'event', event: { kind: 'resumed', savedAt: T0 - 5_000 }, at: T0 - 5_000 },
        { op: 'message', msg: msg('a', T0), at: T0 },
      ],
    );
    const saved = deserializeLog(serializeLog(log, T0 + 1_000), T0 + 2_000);
    expect(saved?.savedAt).toBe(T0 + 1_000);
    // The old "resumed" marker isn't saved again.
    expect(rows(saved?.entries ?? [])).toEqual(['a']);
    const first = saved?.entries[0];
    expect(first?.type === 'message' && first.msg.timestamp.getTime()).toBe(T0);
  });

  it('drops rows older than the saved-history window', () => {
    const log = applyOps(
      [],
      [
        { op: 'message', msg: msg('old', T0), at: T0 },
        { op: 'message', msg: msg('new', T0 + SAVED_HISTORY_MS), at: T0 + SAVED_HISTORY_MS },
      ],
    );
    const saved = deserializeLog(serializeLog(log, T0), T0 + SAVED_HISTORY_MS + 1);
    expect(rows(saved?.entries ?? [])).toEqual(['new']);
  });

  it('ignores storage it cannot read', () => {
    expect(deserializeLog(null, T0)).toBeNull();
    expect(deserializeLog('not json', T0)).toBeNull();
    expect(deserializeLog('{"entries":3}', T0)).toBeNull();
  });
});
