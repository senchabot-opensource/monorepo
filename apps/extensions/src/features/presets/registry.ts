import { BUILTIN_PRESETS } from './builtin-presets';
import { type PresetData, presetSchema } from './preset-schema';

/** URL param every themable overlay reads. Missing or unknown means the classic look. */
export const PRESET_PARAM = 'preset';
/** Each overlay's own look, as it was before presets. It never goes into a URL. */
export const CLASSIC_PRESET = 'classic';

export type PresetSource = 'builtin' | 'community';

export interface PresetEntry {
  data: PresetData;
  source: PresetSource;
}

// Community presets are plain JSON files, one per preset, added through a pull request.
const COMMUNITY_FILES = import.meta.glob<unknown>('./community/*.json', {
  eager: true,
  import: 'default',
});

/**
 * Community presets that pass the schema. A file must be named after its id and can't take a
 * built-in's id; anything else is left out rather than breaking every overlay.
 */
export function loadCommunityPresets(
  files: Record<string, unknown>,
  taken: ReadonlySet<string>,
): PresetData[] {
  const loaded: PresetData[] = [];
  const seen = new Set(taken);
  for (const [path, json] of Object.entries(files)) {
    const parsed = presetSchema.safeParse(json);
    const fileId = path
      .split('/')
      .pop()
      ?.replace(/\.json$/, '');
    if (!parsed.success || parsed.data.id !== fileId || seen.has(parsed.data.id)) continue;
    seen.add(parsed.data.id);
    loaded.push(parsed.data);
  }
  return loaded.sort((a, b) => a.name.localeCompare(b.name));
}

export const PRESETS: readonly PresetEntry[] = [
  ...BUILTIN_PRESETS.map((data) => ({ data, source: 'builtin' as const })),
  ...loadCommunityPresets(
    COMMUNITY_FILES,
    new Set([CLASSIC_PRESET, ...BUILTIN_PRESETS.map((preset) => preset.id)]),
  ).map((data) => ({ data, source: 'community' as const })),
];

const BY_ID = new Map(PRESETS.map((entry) => [entry.data.id, entry]));

/** The preset for an id, or null for classic, a typo or a preset that was removed. */
export function findPreset(id: string | null | undefined): PresetEntry | null {
  return (id && BY_ID.get(id.trim().toLowerCase())) || null;
}

/** An id as it should be stored: a known preset's id, else classic. */
export function normalizePresetId(id: string | null | undefined): string {
  return findPreset(id)?.data.id ?? CLASSIC_PRESET;
}

export const isClassic = (id: string) => id === CLASSIC_PRESET;
