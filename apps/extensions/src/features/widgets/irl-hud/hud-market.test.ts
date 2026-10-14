import { describe, expect, it } from 'vitest';
import { MAX_BUY_COUNT, parseBuyCommand } from './hud-market';

const water = { name: 'water', price: 100 };
const drink = { name: 'Energy Drink', price: 250 };
const items = [water, drink];

describe('parseBuyCommand', () => {
  it('finds an item by name in any case, with an optional count', () => {
    expect(parseBuyCommand('!hud buy water', items)).toEqual({ item: water, count: 1, total: 100 });
    expect(parseBuyCommand('!HUD BUY Water 3', items)).toEqual({
      item: water,
      count: 3,
      total: 300,
    });
    expect(parseBuyCommand('!hud buy energy   drink 2', items)).toEqual({
      item: drink,
      count: 2,
      total: 500,
    });
  });

  it('takes !h, the short command, as well as !hud', () => {
    const items = [{ name: 'Water', price: 100 }];
    expect(parseBuyCommand('!h buy water 2', items)).toEqual(
      parseBuyCommand('!hud buy water 2', items),
    );
    expect(parseBuyCommand('!h buy water', items)).not.toBeNull();
  });

  it('ignores unknown items, other commands and silly counts', () => {
    expect(parseBuyCommand('!hud buy pizza', items)).toBeNull();
    expect(parseBuyCommand('!hud buy', items)).toBeNull();
    expect(parseBuyCommand('!hud cash 5', items)).toBeNull();
    expect(parseBuyCommand('!hudbuy water', items)).toBeNull();
    expect(parseBuyCommand('!hud buy water 0', items)).toBeNull();
    expect(parseBuyCommand(`!hud buy water ${MAX_BUY_COUNT + 1}`, items)).toBeNull();
    expect(parseBuyCommand('!hud buy water', [])).toBeNull();
  });

  it('reads a name that is only a number as the name, not as a count', () => {
    const seven = { name: '7up', price: 50 };
    expect(parseBuyCommand('!hud buy 7up', [seven])?.count).toBe(1);
    expect(parseBuyCommand('!hud buy 3', [water])).toBeNull();
  });
});
