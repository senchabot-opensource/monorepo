import { PRESETS } from './registry';

// Never classic: a random pick is a way to try the presets on.
const IDS = PRESETS.map((entry) => entry.data.id);

/** A preset other than `current`, at random, for the setup pages' dice button. */
export function randomPreset(current: string, random: () => number = Math.random): string {
  const others = IDS.filter((id) => id !== current);
  return others[Math.floor(random() * others.length)] ?? current;
}

/**
 * `count` presets in random order, from all of them or the ids in `from`, each one dealt once
 * before any repeats, so a page full of previews shows as many as it has room for and never the
 * same one twice in a row.
 */
export function dealPresets(
  count: number,
  { from = IDS, random = Math.random }: { from?: readonly string[]; random?: () => number } = {},
): string[] {
  const deck = [...from];
  for (let index = deck.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [deck[index], deck[other]] = [deck[other], deck[index]];
  }
  return Array.from({ length: count }, (_, index) => deck[index % deck.length]);
}
