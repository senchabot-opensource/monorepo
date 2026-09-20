import { isValidPlantId, PLANT_REGISTRY, type PlantId } from './plants/registry';

/**
 * The growth saved in OBS. Neither platform tells a logged-out page how many subs a channel has,
 * so the plant is ours: it keeps growing from where the last browser source left it.
 */
export interface SproutState {
  /** The URL's plant this growth was built on. */
  setting: PlantId;
  /** The plant on screen, which In Order and Random move on from as stages fill. */
  variety: PlantId;
  stagesDone: number;
  /** How far into the next stage, 0 to 1. */
  progress: number;
}

/** Storage key per channel pair, so every Sub Sprout source for the channel shares one plant. */
export const storageKey = (twitch = '', kick = '') =>
  `senchabot.sub-sprout:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}`;

export const createSprout = (setting: PlantId): SproutState => ({
  setting,
  variety: setting,
  stagesDone: 0,
  progress: 0,
});

export function isSproutState(value: unknown): value is SproutState {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  return (
    isValidPlantId(s.setting) &&
    isValidPlantId(s.variety) &&
    typeof s.stagesDone === 'number' &&
    Number.isInteger(s.stagesDone) &&
    s.stagesDone >= 0 &&
    // Growth wraps back to stage 1 at the top, so a stage the plant can't reach is garbage.
    s.stagesDone < PLANT_REGISTRY[s.variety].stages &&
    typeof s.progress === 'number' &&
    s.progress >= 0 &&
    s.progress < 1
  );
}

/**
 * The saved plant, or a new one when the URL's plant changed since: picking another plant means
 * "grow this one now", and its stage count wouldn't fit the saved one's anyway.
 */
export const followSetting = (saved: SproutState, setting: PlantId): SproutState =>
  saved.setting === setting ? saved : createSprout(setting);

/** The saved plant for this channel pair, or a new one. `key` is null while nothing is saved. */
export function loadSprout(key: string | null, setting: PlantId): SproutState {
  if (!key) return createSprout(setting);
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(key) ?? 'null');
    if (isSproutState(saved)) return followSetting(saved, setting);
  } catch {
    // Storage blocked or garbage: start over.
  }
  return createSprout(setting);
}

export const COMMAND = '!grow';

/** Reads a mod's "!grow" (one stage, words after it and all) or "!grow reset" (start over). */
export function parseGrowCommand(message: string): 'grow' | 'reset' | null {
  const [command, word] = message.trim().split(/\s+/);
  if (command?.toLowerCase() !== COMMAND) return null;
  return word?.toLowerCase() === 'reset' ? 'reset' : 'grow';
}
