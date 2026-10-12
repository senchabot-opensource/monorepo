import { describe, expect, it } from 'vitest';
import { chosenView, parseMapCommand, parseMoveCommand, startingView, startKey } from './hud-map';

const places = [
  { name: 'park1', lat: 41, lon: 29 },
  { name: 'Kadıköy', lat: 40.99, lon: 29.02 },
];

describe('parseMapCommand', () => {
  it('reads the word after !hud map, in lower case', () => {
    expect(parseMapCommand('!hud map park1')).toBe('park1');
    expect(parseMapCommand('!HUD MAP Park1 please')).toBe('park1');
    expect(parseMapCommand('  !hud map kadıköy ')).toBe('kadıköy');
  });

  it('ignores anything else', () => {
    expect(parseMapCommand('!hud map')).toBeNull();
    expect(parseMapCommand('!hud cash 5')).toBeNull();
    expect(parseMapCommand('!hudmap park1')).toBeNull();
    expect(parseMapCommand('hud map park1')).toBeNull();
  });
});

describe('chosenView', () => {
  it('finds a saved place by name in any case, then a made-up map', () => {
    expect(chosenView('park1', places)).toEqual({ map: 'real', place: places[0] });
    expect(chosenView('kadıköy', places)).toEqual({ map: 'real', place: places[1] });
    expect(chosenView('urban', places)).toEqual({ map: 'urban' });
    expect(chosenView('park', places)).toEqual({ map: 'park' });
    expect(chosenView('park2', places)).toBeNull();
  });
});

describe('startingView and startKey', () => {
  it('start the real map at the first saved place', () => {
    expect(startingView({ map: 'real', places })).toEqual({ map: 'real', place: places[0] });
    expect(startingView({ map: 'real', places: [] })).toEqual({ map: 'real', place: null });
    expect(startingView({ map: 'park', places })).toEqual({ map: 'park' });
    expect(startKey({ map: 'real', places })).toBe('real:park1');
    expect(startKey({ map: 'urban', places })).toBe('urban');
  });
});

describe('parseMoveCommand', () => {
  it('reads walk, run and stay, and their go and stop', () => {
    expect(parseMoveCommand('!hud walk')).toBe('walk');
    expect(parseMoveCommand('!HUD Go')).toBe('walk');
    expect(parseMoveCommand('!hud run')).toBe('run');
    expect(parseMoveCommand('!hud stay')).toBe('stay');
    expect(parseMoveCommand(' !hud stop ')).toBe('stay');
  });

  it('ignores anything else, built-in names included', () => {
    expect(parseMoveCommand('!hud walk fast')).toBeNull();
    expect(parseMoveCommand('!hud')).toBeNull();
    expect(parseMoveCommand('!hud fly')).toBeNull();
    expect(parseMoveCommand('!hud constructor')).toBeNull();
    expect(parseMoveCommand('!hud toString')).toBeNull();
  });
});
