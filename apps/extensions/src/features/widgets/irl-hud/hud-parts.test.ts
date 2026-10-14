import { describe, expect, it } from 'vitest';
import { isHudPart, parseToggleCommand, togglePart } from './hud-parts';

describe('parseToggleCommand', () => {
  it('reads a plain !h or !hud with the part it names', () => {
    expect(parseToggleCommand('!h map')).toBe('map');
    expect(parseToggleCommand('!hud cash')).toBe('cash');
    expect(parseToggleCommand('!H Money')).toBe('cash');
    expect(parseToggleCommand('!h time')).toBe('time');
    expect(parseToggleCommand('  !HUD clock  ')).toBe('time');
  });

  it('leaves the other HUD commands, the weather and unknown words alone', () => {
    expect(parseToggleCommand('!h map park1')).toBeNull();
    expect(parseToggleCommand('!h cash +500')).toBeNull();
    expect(parseToggleCommand('!h weather')).toBeNull();
    expect(parseToggleCommand('!h')).toBeNull();
    expect(parseToggleCommand('!h constructor')).toBeNull();
    expect(parseToggleCommand('!hm map')).toBeNull();
    expect(parseToggleCommand('map')).toBeNull();
  });
});

describe('togglePart', () => {
  it('hides a shown part and brings a hidden one back', () => {
    expect(togglePart(undefined, 'map')).toEqual(['map']);
    expect(togglePart(['map', 'cash'], 'map')).toEqual(['cash']);
    expect(togglePart(['cash'], 'time')).toEqual(['cash', 'time']);
  });

  it('knows only the HUD parts', () => {
    expect(isHudPart('map')).toBe(true);
    expect(isHudPart('weather')).toBe(false);
    expect(isHudPart(1)).toBe(false);
  });
});
