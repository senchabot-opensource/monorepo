import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_EVENT_LIST_SETTINGS } from '#/lib/event-list-url';
import {
  addEvent,
  type EventEntry,
  isClearCommand,
  KICK_MONTHS_WINDOW_MS,
  loadEntries,
  MAX_KEPT,
  shownEntries,
  storageKey,
} from './event-list-state';

const at = 1_000_000;
const add = (
  list: EventEntry[],
  event: Parameters<typeof addEvent>[1],
  id = list.length + 1,
  now = at,
) => addEvent(list, event, id, now);

describe('addEvent', () => {
  it('adds a row for every kind of support', () => {
    let list: EventEntry[] = [];
    list = add(list, { kind: 'sub', platform: 'twitch', name: 'A', tier: 2, months: 1 }) ?? list;
    list = add(list, { kind: 'gift', platform: 'kick', name: 'B', tier: 1, count: 5 }) ?? list;
    list = add(list, { kind: 'bits', platform: 'kick', name: 'C', amount: 300 }) ?? list;
    list = add(list, { kind: 'raid', platform: 'twitch', name: 'D', viewers: 40 }) ?? list;
    expect(
      list.map(({ kind, platform, name, amount, tier }) => [kind, platform, name, amount, tier]),
    ).toEqual([
      ['sub', 'twitch', 'A', 1, 2],
      ['gift', 'kick', 'B', 5, 1],
      ['bits', 'kick', 'C', 300, 1],
      ['raid', 'twitch', 'D', 40, 1],
    ]);
  });

  it("fills in Kick's months from its second sub event instead of adding a row", () => {
    const first = add([], { kind: 'sub', platform: 'kick', name: 'Fan', tier: 1 }) ?? [];
    expect(first[0].amount).toBe(0);
    const later = {
      kind: 'sub',
      platform: 'kick',
      name: 'fan',
      tier: 1,
      months: 4,
      again: 'repeat',
    } as const;
    expect(add(first, later, 2, at + 1000)).toEqual([{ ...first[0], amount: 4 }]);
    // Too late, a shared resub, or nothing to fill in: no change.
    expect(add(first, later, 2, at + KICK_MONTHS_WINDOW_MS + 1)).toBeNull();
    expect(add(first, { ...later, again: 'shared' }, 2, at + 1000)).toBeNull();
    expect(add([], later)).toBeNull();
  });

  it('ignores mod messages and keeps only the newest rows', () => {
    expect(add([], { kind: 'mod', platform: 'twitch', text: '!events clear' })).toBeNull();
    let list: EventEntry[] = [];
    for (let i = 0; i < MAX_KEPT + 5; i++) {
      list = add(list, { kind: 'raid', platform: 'twitch', name: `R${i}`, viewers: 1 }, i) ?? list;
    }
    expect(list).toHaveLength(MAX_KEPT);
    expect(list.at(-1)?.name).toBe(`R${MAX_KEPT + 4}`);
  });
});

describe('shownEntries', () => {
  const list: EventEntry[] = [
    { id: 1, kind: 'bits', platform: 'twitch', name: 'small', amount: 50, tier: 1, at },
    { id: 2, kind: 'bits', platform: 'twitch', name: 'big', amount: 500, tier: 1, at },
    { id: 3, kind: 'raid', platform: 'kick', name: 'tiny', amount: 2, tier: 1, at },
    { id: 4, kind: 'gift', platform: 'kick', name: 'gifter', amount: 5, tier: 1, at: at + 20_000 },
  ];
  const settings = { ...DEFAULT_EVENT_LIST_SETTINGS };

  it('applies the kinds, the minimums and the row count', () => {
    const names = (shown: EventEntry[]) => shown.map((entry) => entry.name);
    expect(names(shownEntries(list, settings, at))).toEqual(['small', 'big', 'tiny', 'gifter']);
    expect(names(shownEntries(list, { ...settings, minBits: 100, minRaid: 5 }, at))).toEqual([
      'big',
      'gifter',
    ]);
    expect(
      names(shownEntries(list, { ...settings, kinds: { ...settings.kinds, bits: false } }, at)),
    ).toEqual(['tiny', 'gifter']);
    expect(names(shownEntries(list, { ...settings, rows: 3 }, at))).toEqual([
      'big',
      'tiny',
      'gifter',
    ]);
  });

  it('drops rows older than the fade time', () => {
    const shown = shownEntries(list, { ...settings, fade: 10 }, at + 15_000);
    expect(shown.map((entry) => entry.name)).toEqual(['gifter']);
  });
});

describe('storage', () => {
  afterEach(() => localStorage.clear());

  it('reads back a saved list and drops garbage rows', () => {
    const key = storageKey(' Streamer ', 'KICK');
    expect(key).toBe('senchabot.event-list:streamer:kick');
    const good = { id: 1, kind: 'sub', platform: 'twitch', name: 'A', amount: 3, tier: 1, at };
    localStorage.setItem(key, JSON.stringify([good, { id: 'x' }, { ...good, kind: 'follow' }]));
    expect(loadEntries(key)).toEqual([good]);
    localStorage.setItem(key, 'not json');
    expect(loadEntries(key)).toEqual([]);
    expect(loadEntries(null)).toEqual([]);
  });

  it('reads the clear command', () => {
    expect(isClearCommand('!events clear')).toBe(true);
    expect(isClearCommand('!EVENTS   Clear ')).toBe(true);
    expect(isClearCommand('!events')).toBe(false);
    expect(isClearCommand('!events clear now')).toBe(false);
  });
});
