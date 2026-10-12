import type { HudMove, HudPlace, HudSettings } from '#/lib/irl-hud-url';
import { COMMAND } from './hud-money';

/** `!hud map park1` switches the mini-map; the word after it is a saved place or a made-up map. */
export const MAP_SUBCOMMAND = 'map';
/** `!hud map reset` goes back to the mini-map in the URL. */
export const MAP_RESET = 'reset';

/** What the mini-map shows: a made-up map, or a real place (null while none is saved). */
export type MapView = { map: 'urban' | 'park' } | { map: 'real'; place: HudPlace | null };

/** The word after "!hud map", in lower case; null for anything else. */
export function parseMapCommand(message: string): string | null {
  const [typed, part = '', word = ''] = message.trim().split(/\s+/);
  if (typed?.toLowerCase() !== COMMAND || part.toLowerCase() !== MAP_SUBCOMMAND || !word)
    return null;
  return word.toLowerCase();
}

type MapSettings = Pick<HudSettings, 'map' | 'places'>;

/** The mini-map the URL starts with: a made-up map, or the first saved place. */
export function startingView(settings: MapSettings): MapView {
  return settings.map === 'real'
    ? { map: 'real', place: settings.places[0] ?? null }
    : { map: settings.map };
}

/** The mini-map a chat choice names: a saved place first, then a made-up map; null if neither. */
export function chosenView(choice: string, places: HudPlace[]): MapView | null {
  const place = places.find((saved) => saved.name.toLowerCase() === choice);
  if (place) return { map: 'real', place };
  return choice === 'urban' || choice === 'park' ? { map: choice } : null;
}

/**
 * What the URL starts the mini-map on, as one string. A chat choice saved in OBS is kept only
 * while this stays the same, so a new setup in the URL isn't overridden by an old command.
 */
export const startKey = (settings: MapSettings) =>
  settings.map === 'real' ? `real:${settings.places[0]?.name.toLowerCase() ?? ''}` : settings.map;

// The words !hud takes for the arrow's movement; "stop" and "go" are there for mods who type them.
const MOVE_WORDS: Record<string, HudMove> = {
  walk: 'walk',
  go: 'walk',
  run: 'run',
  stay: 'stay',
  stop: 'stay',
};

/** The movement "!hud walk", "!hud run" or "!hud stay" (or "stop") asks for; null otherwise. */
export function parseMoveCommand(message: string): HudMove | null {
  const [typed, word = '', ...rest] = message.trim().split(/\s+/);
  if (typed?.toLowerCase() !== COMMAND || rest.length > 0) return null;
  const lower = word.toLowerCase();
  // Own words only: "constructor" and the like aren't movements.
  return Object.hasOwn(MOVE_WORDS, lower) ? MOVE_WORDS[lower] : null;
}

/** How fast the arrow goes for each movement, in px a second. */
export const MOVE_SPEED: Record<HudMove, number> = { walk: 14, run: 32, stay: 0 };
