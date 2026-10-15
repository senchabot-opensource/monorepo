import {
  CLASSIC_PRESET,
  isClassic,
  normalizePresetId,
  PRESET_PARAM,
  presetEffect,
} from '#/features/presets/registry';
import { isSiteFont, type SiteFont } from './site-fonts';
import { readFlag } from './url-params';

/** URL param that stills a preset's effect when it is `0`. Missing means the effect plays. */
export const FX_PARAM = 'fx';

/**
 * Adds `fx=0` when the effect is switched off. Only a preset with an effect gets it: on classic or
 * a still preset the param would do nothing, and a param that does nothing stays out of the URL.
 */
export function writeFx(params: URLSearchParams, preset: string, fx = true) {
  if (fx === false && !isClassic(preset) && presetEffect(preset) !== 'none')
    params.set(FX_PARAM, '0');
}

/** URL param naming a site font to draw a preset in, instead of the preset's own two fonts. */
export const FONT_PARAM = 'font';

/** Adds `font` when one is picked; classic draws in each widget's own font, so it never gets one. */
export function writeFont(params: URLSearchParams, preset: string, font?: SiteFont) {
  if (font && !isClassic(preset)) params.set(FONT_PARAM, font);
}

/**
 * Adds the preset to an overlay URL, with `fx=0` when its effect is off and `font` when it is
 * drawn in another font. Classic adds nothing, so older URLs stay as they were.
 */
export function writePreset(params: URLSearchParams, preset: string, fx = true, font?: SiteFont) {
  if (!isClassic(preset)) params.set(PRESET_PARAM, preset);
  writeFx(params, preset, fx);
  writeFont(params, preset, font);
}

/** The preset an overlay URL asks for: a known id, else classic. */
export const readPreset = (params: URLSearchParams): string =>
  normalizePresetId(params.get(PRESET_PARAM));

/**
 * The effect switch as a URL sets it: `{ fx: false }` when it is off, nothing when it is on, so
 * settings read from a URL without `fx` look exactly as they did before the switch.
 */
export const readFx = (params: URLSearchParams): { fx?: false } =>
  readFlag(params.get(FX_PARAM), true) ? {} : { fx: false };

/**
 * The font a URL draws its preset in: `{ font }` for a known font under a preset, nothing
 * otherwise, so a URL without one keeps the preset's own fonts.
 */
export function readFont(params: URLSearchParams): { font?: SiteFont } {
  const font = params.get(FONT_PARAM);
  return isSiteFont(font) && !isClassic(readPreset(params)) ? { font } : {};
}

export { CLASSIC_PRESET };
