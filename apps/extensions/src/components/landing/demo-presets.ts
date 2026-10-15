import { useEffect, useState } from 'react';
import { PRESET_WIDGET_IDS } from '#/features/presets/preset-widgets';
import { dealPresets } from '#/features/presets/random';
import type { WidgetEntry, WidgetId } from '#/lib/widgets';

const READS_PRESET: ReadonlySet<WidgetId> = new Set(PRESET_WIDGET_IDS);

/** The presets some landing demos are always shown in, one picked at random (the user's picks). */
export const LANDING_PICKS: Partial<Record<WidgetId, readonly string[]>> = {
  goal: ['flower'],
  'follower-goal': ['boost'],
  'bits-goal': ['pizza'],
  leaderboard: ['operator'],
  credits: ['operator'],
  'now-playing': ['glitch'],
  'event-list': ['conquest', 'pizza', 'flower'],
  // The Chat Poll spotlight's; its gallery card is a drawing and wears none.
  poll: ['flower', 'pizza', 'conquest', 'glitch', 'boost'],
};

/** The presets every other landing demo is dealt from. */
export const LANDING_REST = ['operator', 'conquest', 'defuse', 'boost'] as const;

/** Whether the widget's overlay reads a preset, so its landing demo can be shown in one. */
export const readsPreset = (widget: WidgetEntry) => READS_PRESET.has(widget.id);

/**
 * A preset for each key, in the order the cards show: one of its own picks, or the next of a
 * shuffled REST deck, so those cards go through all four before any repeats. A card skips the
 * preset of the card before it, and the one the next card can't do without, while it has another.
 */
export function dealLandingPresets<K extends string>(
  keys: readonly K[],
  random: () => number = Math.random,
): Record<K, string> {
  const picksOf = (key: K | undefined) =>
    key === undefined ? undefined : LANDING_PICKS[key as string as WidgetId];
  const rest = dealPresets(LANDING_REST.length, { from: LANDING_REST, random });
  const dealt = {} as Record<K, string>;
  let turn = 0;
  let previous: string | undefined;
  keys.forEach((key, index) => {
    const next = picksOf(keys[index + 1]);
    const avoid = [previous, next?.length === 1 ? next[0] : undefined];
    const own = picksOf(key);
    let pick: string;
    if (own) {
      const others = own.filter((id) => !avoid.includes(id));
      const from = others.length > 0 ? others : own;
      pick = from[Math.floor(random() * from.length)];
    } else {
      for (let skipped = 0; avoid.includes(rest[turn % rest.length]) && skipped < 2; skipped++) {
        turn++;
      }
      pick = rest[turn % rest.length];
      turn++;
    }
    dealt[key] = pick;
    previous = pick;
  });
  return dealt;
}

/**
 * A preset for each key, new on every visit (see dealLandingPresets): the landing's demos show
 * off the presets, and a card's setup link opens on the one it showed. Null until the page has
 * mounted, since it is prerendered: a pick made while rendering would differ between its HTML
 * and the first render in the browser. Pass a constant list.
 */
export function useDealtPresets<K extends string>(
  keys: readonly K[],
): Partial<Record<K, string>> | null {
  const [dealt, setDealt] = useState<Partial<Record<K, string>> | null>(null);
  useEffect(() => {
    setDealt(dealLandingPresets(keys));
  }, [keys]);
  return dealt;
}
