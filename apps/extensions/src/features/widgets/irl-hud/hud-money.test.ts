import { describe, expect, it } from 'vitest';
import { DEFAULT_HUD_SETTINGS, MAX_MONEY, MIN_MONEY } from '#/lib/irl-hud-url';
import {
  applyCashCommand,
  createHud,
  eventMoney,
  followStart,
  formatChange,
  formatMoney,
  isHudState,
  parseAmount,
  parseCashCommand,
} from './hud-money';

const values = { ...DEFAULT_HUD_SETTINGS, tsub: 100, tgift: 50, bits: 25, traid: 10, kraid: 4 };

describe('eventMoney', () => {
  it('pays a sub by its platform and Twitch tier', () => {
    const sub = { kind: 'sub', name: 'a' } as const;
    expect(eventMoney({ ...sub, platform: 'twitch', tier: 1 }, values)).toBe(100);
    expect(eventMoney({ ...sub, platform: 'twitch', tier: 2 }, values)).toBe(200);
    expect(eventMoney({ ...sub, platform: 'twitch', tier: 3 }, values)).toBe(500);
    expect(eventMoney({ ...sub, platform: 'twitch', tier: 3 }, { ...values, tiers: false })).toBe(
      100,
    );
    expect(eventMoney({ ...sub, platform: 'kick', tier: 1 }, { ...values, ksub: 75 })).toBe(75);
  });

  it("doesn't pay twice for Kick's second word on a sub", () => {
    const sub = { kind: 'sub', platform: 'kick', name: 'a', tier: 1 } as const;
    expect(eventMoney({ ...sub, again: 'repeat' }, values)).toBe(0);
    expect(eventMoney({ ...sub, again: 'shared' }, values)).toBe(0);
  });

  it('pays gifts per sub, cheers by their share of 100 and raids per viewer', () => {
    expect(
      eventMoney({ kind: 'gift', platform: 'twitch', name: 'a', count: 5, tier: 2 }, values),
    ).toBe(500);
    expect(eventMoney({ kind: 'bits', platform: 'twitch', name: 'a', amount: 250 }, values)).toBe(
      63,
    );
    expect(eventMoney({ kind: 'bits', platform: 'twitch', name: 'a', amount: 1 }, values)).toBe(0);
    expect(eventMoney({ kind: 'raid', platform: 'twitch', name: 'a', viewers: 30 }, values)).toBe(
      300,
    );
    expect(eventMoney({ kind: 'raid', platform: 'kick', name: 'a', viewers: 30 }, values)).toBe(
      120,
    );
  });

  it('pays nothing for a mod message or a value turned off', () => {
    expect(eventMoney({ kind: 'mod', platform: 'twitch', text: '!hud cash 5' }, values)).toBe(0);
    expect(
      eventMoney({ kind: 'sub', platform: 'twitch', name: 'a', tier: 1 }, { ...values, tsub: 0 }),
    ).toBe(0);
  });
});

describe('parseAmount', () => {
  it('reads the ways people write money', () => {
    expect(parseAmount('500')).toBe(500);
    expect(parseAmount('$1,500')).toBe(1500);
    expect(parseAmount('2.5k')).toBe(2500);
    expect(parseAmount('1M')).toBe(1_000_000);
  });

  it('turns down anything else', () => {
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('lots')).toBeNull();
    expect(parseAmount('-5')).toBeNull();
    expect(parseAmount('99999999999999')).toBeNull();
  });
});

describe('parseCashCommand', () => {
  it('also takes "money" for "cash"', () => {
    expect(parseCashCommand('!hud money +100')).toEqual({ action: 'add', amount: 100 });
    expect(parseCashCommand('!HUD MONEY reset')).toEqual({ action: 'reset' });
  });

  it('reads the short and the spelled-out forms', () => {
    expect(parseCashCommand('!hud cash +100')).toEqual({ action: 'add', amount: 100 });
    expect(parseCashCommand('!HUD Cash +1.5k')).toEqual({ action: 'add', amount: 1500 });
    expect(parseCashCommand('!hud cash add 500')).toEqual({ action: 'add', amount: 500 });
    expect(parseCashCommand('!hud cash -100')).toEqual({ action: 'remove', amount: 100 });
    expect(parseCashCommand('!hud cash - 200')).toEqual({ action: 'remove', amount: 200 });
    expect(parseCashCommand('!hud cash remove $200')).toEqual({ action: 'remove', amount: 200 });
    expect(parseCashCommand('!hud cash set 10,000')).toEqual({ action: 'set', amount: 10000 });
    expect(parseCashCommand('!hud cash 350')).toEqual({ action: 'set', amount: 350 });
    expect(parseCashCommand('!hud cash reset')).toEqual({ action: 'reset' });
  });

  it('ignores other commands and missing amounts', () => {
    expect(parseCashCommand('!hud')).toBeNull();
    expect(parseCashCommand('!hud cash')).toBeNull();
    expect(parseCashCommand('!hud cash add')).toBeNull();
    expect(parseCashCommand('!hud cash spend 5')).toBeNull();
    expect(parseCashCommand('!hud coins +5')).toBeNull();
    expect(parseCashCommand('!hudcash +5')).toBeNull();
    expect(parseCashCommand('!cash +5')).toBeNull();
    expect(parseCashCommand('!hud cash constructor 5')).toBeNull();
    expect(parseCashCommand('!hud cash toString 5')).toBeNull();
  });
});

describe('applyCashCommand', () => {
  const state = { ...createHud(1000), money: 1200 };

  it('adds, removes and sets, stopping at the counter limits', () => {
    expect(applyCashCommand(state, { action: 'add', amount: 300 }, 1000).money).toBe(1500);
    expect(applyCashCommand(state, { action: 'remove', amount: 1500 }, 1000).money).toBe(-300);
    expect(applyCashCommand(state, { action: 'set', amount: 5e9 }, 1000).money).toBe(MAX_MONEY);
    expect(applyCashCommand(state, { action: 'remove', amount: 5e9 }, 1000).money).toBe(MIN_MONEY);
  });

  it('resets to the starting money', () => {
    expect(applyCashCommand(state, { action: 'reset' }, 1000)).toEqual({ ...state, money: 1000 });
  });
});

describe('saved state', () => {
  it('follows a new starting amount, keeping the chosen mini-map', () => {
    const saved = { money: 900, start: 0, map: { choice: 'park1', from: 'urban' } };
    expect(followStart(saved, 0)).toBe(saved);
    expect(followStart(saved, 350)).toEqual({ money: 350, start: 350, map: saved.map });
  });

  it('accepts only whole numbers', () => {
    expect(isHudState({ money: -20, start: 0 })).toBe(true);
    expect(isHudState({ money: 1.5, start: 0 })).toBe(false);
    expect(isHudState({ money: 1 })).toBe(false);
    expect(isHudState({ money: 1, start: 0, map: { choice: 'park1', from: 'urban' } })).toBe(true);
    expect(isHudState({ money: 1, start: 0, map: { choice: 3 } })).toBe(false);
    expect(isHudState({ money: 1, start: 0, move: { choice: 'stay', from: 'walk' } })).toBe(true);
    expect(isHudState({ money: 1, start: 0, move: 'stay' })).toBe(false);
    expect(isHudState(null)).toBe(false);
  });
});

describe('formatMoney', () => {
  it('pads Retro money to eight digits and puts debt in front', () => {
    expect(formatMoney(350, 'retro')).toBe('$00000350');
    expect(formatMoney(123_456_789, 'retro')).toBe('$123456789');
    expect(formatMoney(-350, 'retro')).toBe('-$0000350');
  });

  it('groups Modern cash with commas', () => {
    expect(formatMoney(1250, 'modern')).toBe('$1,250');
    expect(formatMoney(0, 'modern')).toBe('$0');
    expect(formatMoney(-1250, 'modern')).toBe('-$1,250');
  });

  it('signs a change', () => {
    expect(formatChange(1500)).toBe('+$1,500');
    expect(formatChange(-500)).toBe('-$500');
  });
});
