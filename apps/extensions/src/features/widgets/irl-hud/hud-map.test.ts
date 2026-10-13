import { describe, expect, it } from 'vitest';
import {
  canGoIndoors,
  chosenView,
  mapNow,
  parseIndoorCommand,
  parseMapCommand,
  parseMoveCommand,
  startingView,
  startKey,
} from './hud-map';

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

describe('mapNow', () => {
  it("follows a chat choice made over this starting map, else the URL's", () => {
    expect(mapNow(undefined, places, 'urban')).toBe('urban');
    expect(mapNow(undefined, places, 'park')).toBe('park');
    expect(mapNow(undefined, places, 'real:park1')).toBe('real');
    // Real Place with no place saved yet still counts: it's the real place option.
    expect(mapNow(undefined, [], 'real:')).toBe('real');
    expect(mapNow({ choice: 'park1', from: 'urban' }, places, 'urban')).toBe('real');
    expect(mapNow({ choice: 'park', from: 'real:park1' }, places, 'real:park1')).toBe('park');
    // A choice made over another starting map, or naming nothing, no longer applies.
    expect(mapNow({ choice: 'park1', from: 'park' }, places, 'urban')).toBe('urban');
    expect(mapNow({ choice: 'gone', from: 'urban' }, places, 'urban')).toBe('urban');
  });
});

describe('canGoIndoors', () => {
  it('goes indoors on the made-up maps, and on a real place only with GPS', () => {
    expect(canGoIndoors('urban', 'walk')).toBe(true);
    expect(canGoIndoors('park', 'walk')).toBe(true);
    expect(canGoIndoors('real', 'walk')).toBe(false);
    expect(canGoIndoors('real', 'gps')).toBe(true);
  });
});

describe('parseIndoorCommand', () => {
  it('reads indoor and outdoor, and their inside and outside', () => {
    expect(parseIndoorCommand('!hud indoor')).toBe(true);
    expect(parseIndoorCommand('!HUD Inside')).toBe(true);
    expect(parseIndoorCommand(' !hud indoors ')).toBe(true);
    expect(parseIndoorCommand('!hud outdoor')).toBe(false);
    expect(parseIndoorCommand('!hud OUTSIDE')).toBe(false);
  });

  it('ignores anything else, built-in names included', () => {
    expect(parseIndoorCommand('!hud indoor now')).toBeNull();
    expect(parseIndoorCommand('!hud')).toBeNull();
    expect(parseIndoorCommand('!hud walk')).toBeNull();
    expect(parseIndoorCommand('!hud constructor')).toBeNull();
    expect(parseIndoorCommand('indoor')).toBeNull();
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
