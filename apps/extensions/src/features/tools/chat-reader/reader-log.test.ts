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

  it('marks a Twitch ban by login, whatever the display-name', () => {
    const log = applyOps(
      [],
      [
        {
          op: 'message',
          msg: msg('a', T0, { user: 'お命頂戴', userLower: 'oinotityoudai', platform: 'twitch' }),
          at: T0,
        },
        { op: 'deleteUser', platform: 'twitch', userLower: 'oinotityoudai' },
      ],
    );
    expect(rows(log)).toEqual(['a (deleted)']);
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

describe('reader log edge cases', () => {
  it('returns the same log when a delete or ban matches nothing, so nothing re-renders', () => {
    const log = applyOps([], [{ op: 'message', msg: msg('a', T0), at: T0 }]);
    expect(applyOps(log, [{ op: 'delete', id: 'zzz' }])).toBe(log);
    expect(applyOps(log, [{ op: 'deleteUser', platform: 'twitch', userLower: 'viewer' }])).toBe(
      log,
    );
    expect(applyOps(log, [])).toBe(log);
  });

  it('keeps messages and connection rows in arrival order, events counted toward the limit', () => {
    const ops = Array.from({ length: MAX_ENTRIES }, (_, i) => ({
      op: 'message' as const,
      msg: msg(String(i), T0 + i),
      at: T0 + i,
    }));
    const log = applyOps(
      [],
      [
        ...ops,
        { op: 'event', event: { kind: 'networkLost' }, at: T0 + MAX_ENTRIES },
        { op: 'message', msg: msg('last', T0 + MAX_ENTRIES), at: T0 + MAX_ENTRIES },
      ],
    );
    expect(log).toHaveLength(MAX_ENTRIES);
    expect(rows(log).slice(-3)).toEqual([String(MAX_ENTRIES - 1), '[networkLost]', 'last']);
    expect(rows(log)[0]).toBe('2');
  });

  it('marks a deleted message only once, and a ban leaves it as it is', () => {
    const log = applyOps(
      [],
      [
        { op: 'message', msg: msg('a', T0, { user: 'Bob' }), at: T0 },
        { op: 'delete', id: 'a' },
      ],
    );
    expect(applyOps(log, [{ op: 'delete', id: 'a' }])).toBe(log);
    expect(applyOps(log, [{ op: 'deleteUser', platform: 'kick', userLower: 'bob' }])).toBe(log);
  });

  it('gives every event its own key, even several in the same millisecond', () => {
    const log = applyOps(
      [],
      [
        { op: 'event', event: { kind: 'networkLost' }, at: T0 },
        { op: 'event', event: { kind: 'networkBack' }, at: T0 },
      ],
    );
    expect(new Set(log.map((entry) => entry.key)).size).toBe(2);
  });
});

describe('saved reader log', () => {
  it('keeps connection rows and deleted marks across a refresh', () => {
    const log = applyOps(
      [],
      [
        { op: 'event', event: { kind: 'disconnected', platform: 'twitch' }, at: T0 },
        { op: 'message', msg: msg('a', T0), at: T0 },
        { op: 'delete', id: 'a' },
      ],
    );
    const saved = deserializeLog(serializeLog(log, T0), T0 + 1);
    expect(rows(saved?.entries ?? [])).toEqual(['[disconnected]', 'a (deleted)']);
  });

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
