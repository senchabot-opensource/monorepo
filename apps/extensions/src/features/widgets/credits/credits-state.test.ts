import { afterEach, describe, expect, it } from 'vitest';
import type { ViewerMessage } from '../viewer-chat/viewer-chat';
import {
  creditChat,
  creditSupport,
  emptyCredits,
  loadCredits,
  MAX_NAMES,
  NEW_STREAM_HOURS,
  parseCreditsCommand,
  sortedCredits,
  storageKey,
} from './credits-state';

const now = 5_000_000;
const chat = (overrides: Partial<ViewerMessage> = {}): ViewerMessage => ({
  kind: 'message',
  platform: 'twitch',
  login: 'moonlit',
  name: 'MoonLit',
  text: 'hi',
  mod: false,
  broadcaster: false,
  sub: false,
  aside: false,
  bot: false,
  ...overrides,
});

describe('creditSupport', () => {
  it('credits each kind of support once per viewer, adding up gifts, cheers and raiders', () => {
    let data = emptyCredits();
    data = creditSupport(
      data,
      { kind: 'sub', platform: 'twitch', name: 'A', tier: 1, months: 3 },
      now,
    );
    data = creditSupport(
      data,
      { kind: 'sub', platform: 'twitch', name: 'a', tier: 1, months: 4, again: 'shared' },
      now,
    );
    data = creditSupport(
      data,
      { kind: 'gift', platform: 'kick', name: 'G', tier: 1, count: 5 },
      now,
    );
    data = creditSupport(
      data,
      { kind: 'gift', platform: 'kick', name: 'g', tier: 1, count: 2 },
      now,
    );
    data = creditSupport(data, { kind: 'bits', platform: 'twitch', name: 'C', amount: 100 }, now);
    data = creditSupport(data, { kind: 'bits', platform: 'twitch', name: 'C', amount: 400 }, now);
    data = creditSupport(data, { kind: 'raid', platform: 'kick', name: 'R', viewers: 40 }, now);
    expect(data.subs).toEqual([{ platform: 'twitch', name: 'A', amount: 4 }]);
    expect(data.gifts).toEqual([{ platform: 'kick', name: 'G', amount: 7 }]);
    expect(data.cheers).toEqual([{ platform: 'twitch', name: 'C', amount: 500 }]);
    expect(data.raids).toEqual([{ platform: 'kick', name: 'R', amount: 40 }]);
    expect(data.updatedAt).toBe(now);
  });

  it('keeps the same name on two platforms apart, and ignores mod messages', () => {
    let data = emptyCredits();
    data = creditSupport(data, { kind: 'bits', platform: 'twitch', name: 'Same', amount: 1 }, now);
    data = creditSupport(data, { kind: 'bits', platform: 'kick', name: 'Same', amount: 1 }, now);
    expect(data.cheers).toHaveLength(2);
    expect(creditSupport(data, { kind: 'mod', platform: 'twitch', text: '!credits' }, now)).toBe(
      data,
    );
  });
});

describe('creditChat', () => {
  it('credits chatters once and mods as mods too', () => {
    let data = emptyCredits();
    data = creditChat(data, chat(), now);
    data = creditChat(data, chat({ name: 'moonlit' }), now);
    data = creditChat(data, chat({ login: 'mod', name: 'Mod', mod: true }), now);
    expect(data.chatters.map((entry) => entry.name)).toEqual(['MoonLit', 'Mod']);
    expect(data.mods.map((entry) => entry.name)).toEqual(['Mod']);
  });

  it('leaves out bots and the broadcaster, and takes banned viewers out', () => {
    let data = emptyCredits();
    data = creditChat(data, chat({ bot: true, login: 'nightbot', name: 'Nightbot' }), now);
    data = creditChat(data, chat({ broadcaster: true, mod: true, name: 'Me' }), now);
    expect(data.chatters).toEqual([]);
    data = creditChat(data, chat(), now);
    data = creditChat(data, { kind: 'ban', platform: 'twitch', login: 'moonlit' }, now);
    expect(data.chatters).toEqual([]);
  });

  it('stops adding names at the cap', () => {
    let data = emptyCredits();
    for (let i = 0; i < MAX_NAMES + 3; i++) data = creditChat(data, chat({ name: `V${i}` }), now);
    expect(data.chatters).toHaveLength(MAX_NAMES);
  });
});

describe('sortedCredits', () => {
  it('puts the biggest gifters, cheerers and raiders first', () => {
    const data = {
      ...emptyCredits(),
      cheers: [
        { platform: 'twitch' as const, name: 'small', amount: 1 },
        { platform: 'kick' as const, name: 'big', amount: 900 },
      ],
    };
    expect(sortedCredits(data).cheers.map((entry) => entry.name)).toEqual(['big', 'small']);
  });
});

describe('parseCreditsCommand', () => {
  it.each([
    ['!credits', 'roll'],
    ['!CREDITS reset', 'reset'],
    ['!credits stop', 'stop'],
    ['!credits now', null],
    ['!credits reset all', null],
    ['!creditsx', null],
  ])('%s → %s', (text, command) => {
    expect(parseCreditsCommand(text)).toBe(command);
  });
});

describe('loadCredits', () => {
  const key = storageKey('Streamer', '');
  afterEach(() => localStorage.clear());

  it('reads back saved credits from the same stream', () => {
    const saved = { ...emptyCredits(now), subs: [{ platform: 'twitch', name: 'A', amount: 2 }] };
    localStorage.setItem(key, JSON.stringify(saved));
    expect(loadCredits(key, now + 60_000)).toEqual(saved);
  });

  it('starts empty after a long gap, on garbage and without a key', () => {
    const saved = { ...emptyCredits(now), subs: [{ platform: 'twitch', name: 'A', amount: 2 }] };
    localStorage.setItem(key, JSON.stringify(saved));
    const later = now + NEW_STREAM_HOURS * 3_600_000 + 1;
    expect(loadCredits(key, later)).toEqual(emptyCredits(later));
    localStorage.setItem(key, 'nope');
    expect(loadCredits(key, now).subs).toEqual([]);
    expect(loadCredits(null, now)).toEqual(emptyCredits(now));
    expect(key).toBe('senchabot.credits:streamer:');
  });
});
