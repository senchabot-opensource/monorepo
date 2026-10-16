import type { Skin } from '../skin';
import { arcane } from './arcane';
import { beacon } from './beacon';
import { blossom } from './blossom';
import { boost } from './boost';
import { build } from './build';
import { capture } from './capture';
import { embers } from './embers';
import { flare } from './flare';
import { forge } from './forge';
import { glitch } from './glitch';
import { hitmarker } from './hitmarker';
import { pixels } from './pixels';
import { pizza } from './pizza';
import { radiance } from './radiance';
import { slash } from './slash';
import { spooky } from './spooky';
import type { ActiveEffect, EffectModule } from './types';

/** Every effect a preset can name. A Record, so a new id without its module fails to build. */
export const EFFECT_MODULES: Record<ActiveEffect, EffectModule> = {
  glitch,
  forge,
  arcane,
  radiance,
  blossom,
  embers,
  slash,
  beacon,
  pixels,
  pizza,
  spooky,
  build,
  boost,
  flare,
  capture,
  hitmarker,
};

/** The skin's effect, or null for classic, a still preset or one with its effects switched off. */
export function fxModule(skin: Skin | null | undefined): EffectModule | null {
  return skin && skin.effect !== 'none' ? EFFECT_MODULES[skin.effect] : null;
}
