import {
  CLASSIC_PRESET,
  isClassic,
  normalizePresetId,
  PRESET_PARAM,
} from '#/features/presets/registry';

/** Adds the preset to an overlay URL. Classic adds nothing, so older URLs stay as they were. */
export function writePreset(params: URLSearchParams, preset: string) {
  if (!isClassic(preset)) params.set(PRESET_PARAM, preset);
}

/** The preset an overlay URL asks for: a known id, else classic. */
export const readPreset = (params: URLSearchParams): string =>
  normalizePresetId(params.get(PRESET_PARAM));

export { CLASSIC_PRESET };
