import { describe, expect, it } from 'vitest';
import { CHANGELOG, groupByMonth } from './changelog';
import { toUtcDate } from './dates';
import { en } from './i18n/en';
import { resolveKey } from './i18n/index';
import { tr } from './i18n/tr';

describe('changelog data', () => {
  it('uses real YYYY-MM-DD dates, newest first', () => {
    for (const entry of CHANGELOG) {
      expect(entry.date, entry.key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(toUtcDate(entry.date).getTime()), entry.key).toBe(false);
    }
    const dates = CHANGELOG.map((entry) => entry.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('lists each entry once, translated in every locale', () => {
    expect(new Set(CHANGELOG.map((entry) => entry.key)).size).toBe(CHANGELOG.length);
    for (const entry of CHANGELOG) {
      expect(resolveKey(en, entry.key), entry.key).toBeTruthy();
      expect(resolveKey(tr, entry.key), entry.key).toBeTruthy();
    }
  });

  it('leaves no translated sentence out of the list', () => {
    const listed = new Set(CHANGELOG.map((entry) => entry.key.split('.').at(-1)));
    expect(Object.keys(en.changelog.entries).filter((key) => !listed.has(key))).toEqual([]);
  });
});

describe('groupByMonth', () => {
  it('groups consecutive entries by month in order', () => {
    const groups = groupByMonth([
      { date: '2026-09-12', key: 'changelog.entries.siteNav', widgets: [] },
      { date: '2026-09-02', key: 'changelog.entries.notFound', widgets: [] },
      { date: '2026-08-31', key: 'changelog.entries.geist', widgets: [] },
    ]);
    expect(groups.map((group) => [group.month, group.entries.length])).toEqual([
      ['2026-09', 2],
      ['2026-08', 1],
    ]);
  });

  it('returns no groups for no entries', () => {
    expect(groupByMonth([])).toEqual([]);
  });
});
