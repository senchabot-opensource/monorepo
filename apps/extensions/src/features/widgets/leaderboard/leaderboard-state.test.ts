import { afterEach, describe, expect, it } from 'vitest';
import {
  applySupport,
  emptyBoard,
  isResetCommand,
  type LeaderboardData,
  loadBoard,
  MAX_SUPPORTERS,
  storageKey,
  topOf,
} from './leaderboard-state';

describe('applySupport', () => {
  it('adds up gifts and cheers per viewer and keeps the latest of each kind', () => {
    let data = emptyBoard();
    data = applySupport(data, { kind: 'gift', platform: 'twitch', name: 'G', tier: 1, count: 5 });
    data = applySupport(data, { kind: 'gift', platform: 'twitch', name: 'g', tier: 1, count: 1 });
    data = applySupport(data, { kind: 'bits', platform: 'kick', name: 'K', amount: 300 });
    data = applySupport(data, { kind: 'bits', platform: 'twitch', name: 'K', amount: 200 });
    data = applySupport(data, { kind: 'sub', platform: 'twitch', name: 'S', tier: 1, months: 7 });
    data = applySupport(data, { kind: 'raid', platform: 'kick', name: 'R', viewers: 50 });
    expect(data.gifts).toEqual([{ platform: 'twitch', name: 'G', amount: 6 }]);
    expect(data.cheers).toEqual([
      { platform: 'kick', name: 'K', amount: 300 },
      { platform: 'twitch', name: 'K', amount: 200 },
    ]);
    expect(data.latest).toEqual({
      gift: { platform: 'twitch', name: 'g', amount: 1 },
      cheer: { platform: 'twitch', name: 'K', amount: 200 },
      sub: { platform: 'twitch', name: 'S', amount: 7 },
      raid: { platform: 'kick', name: 'R', amount: 50 },
    });
  });

  it("fills in Kick's months, and ignores shared resubs and mod messages", () => {
    let data = applySupport(emptyBoard(), { kind: 'sub', platform: 'kick', name: 'Fan', tier: 1 });
    data = applySupport(data, {
      kind: 'sub',
      platform: 'kick',
      name: 'fan',
      tier: 1,
      months: 5,
      again: 'repeat',
    });
    expect(data.latest.sub?.amount).toBe(5);
    const same = applySupport(data, {
      kind: 'sub',
      platform: 'kick',
      name: 'Fan',
      tier: 1,
      months: 9,
      again: 'shared',
    });
    expect(same).toBe(data);
    expect(applySupport(data, { kind: 'mod', platform: 'twitch', text: '!top reset' })).toBe(data);
  });

  it('makes room by dropping the smallest total, never the top', () => {
    let data: LeaderboardData = emptyBoard();
    data = applySupport(data, { kind: 'bits', platform: 'twitch', name: 'Top', amount: 9999 });
    for (let i = 0; i < MAX_SUPPORTERS + 5; i++) {
      data = applySupport(data, { kind: 'bits', platform: 'twitch', name: `V${i}`, amount: 1 + i });
    }
    expect(data.cheers).toHaveLength(MAX_SUPPORTERS);
    expect(data.cheers.some((entry) => entry.name === 'Top')).toBe(true);
  });
});

describe('topOf', () => {
  it('ranks biggest first and keeps the first one there on a tie', () => {
    const list = [
      { platform: 'twitch' as const, name: 'A', amount: 5 },
      { platform: 'twitch' as const, name: 'B', amount: 9 },
      { platform: 'kick' as const, name: 'C', amount: 5 },
    ];
    expect(topOf(list, 2).map((entry) => entry.name)).toEqual(['B', 'A']);
  });
});

describe('storage and commands', () => {
  afterEach(() => localStorage.clear());

  it('reads back a saved board and drops garbage', () => {
    const key = storageKey('Streamer', '');
    const saved = {
      gifts: [{ platform: 'twitch', name: 'G', amount: 3 }, { nope: true }],
      cheers: [],
      latest: { sub: { platform: 'kick', name: 'S', amount: 2 }, raid: 'bad' },
    };
    localStorage.setItem(key, JSON.stringify(saved));
    expect(loadBoard(key)).toEqual({
      gifts: [saved.gifts[0]],
      cheers: [],
      latest: { sub: saved.latest.sub },
    });
    localStorage.setItem(key, 'garbage');
    expect(loadBoard(key)).toEqual(emptyBoard());
  });

  it('reads the reset command', () => {
    expect(isResetCommand('!top reset')).toBe(true);
    expect(isResetCommand(' !TOP   Reset ')).toBe(true);
    expect(isResetCommand('!top')).toBe(false);
  });
});
