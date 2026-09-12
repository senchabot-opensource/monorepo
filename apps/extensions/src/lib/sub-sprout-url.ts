import { isValidPlantId, type PlantId } from '#/features/widgets/sub-sprout/plants/registry';
import {
  isValidWaterEffect,
  type WaterEffectType,
} from '#/features/widgets/sub-sprout/water/watering-fx';

export type SubSproutPlatforms = 'both' | 'twitch' | 'kick';
export const PICK_MODES = ['fixed', 'cycle', 'random'] as const;
export type PickMode = (typeof PICK_MODES)[number];

export interface SubSproutSettings {
  platforms: SubSproutPlatforms;
  variety: PlantId;
  pick: PickMode;
  water: WaterEffectType;
  countFx: boolean;
  potLabel: boolean;
}

// Mirrors the widget's own defaults, so only changed settings end up in the URL.
export const DEFAULT_SUB_SPROUT_SETTINGS: SubSproutSettings = {
  platforms: 'both',
  variety: 'classic',
  pick: 'fixed',
  water: 'off',
  countFx: true,
  potLabel: false,
};

const WIDGET_PATH = '/widgets/sub-sprout-widget';

// Order and encodings are what this page has always written (countfx=0, potlabel=1), so URLs
// already in OBS rebuild to the same text.
export function buildSubSproutParams(
  settings: SubSproutSettings,
  twitchChannel: string,
  kickChannel: string,
): URLSearchParams {
  const params = new URLSearchParams();
  const twitch = twitchChannel.trim().toLowerCase();
  const kick = kickChannel.trim().toLowerCase();
  if (settings.platforms !== 'kick' && twitch) params.set('twitch', twitch);
  if (settings.platforms !== 'twitch' && kick) params.set('kick', kick);
  if (settings.variety !== 'classic') params.set('variety', settings.variety);
  if (settings.pick !== 'fixed') params.set('pick', settings.pick);
  if (settings.water !== 'off') params.set('water', settings.water);
  if (!settings.countFx) params.set('countfx', '0');
  if (settings.potLabel) params.set('potlabel', '1');
  return params;
}

/** The URL for OBS. Empty until a channel on a picked platform is filled in. */
export function buildSubSproutUrl(
  origin: string,
  settings: SubSproutSettings,
  twitchChannel: string,
  kickChannel: string,
): string {
  const params = buildSubSproutParams(settings, twitchChannel, kickChannel);
  if (!params.has('twitch') && !params.has('kick')) return '';
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

// simulate=auto stops once the channel's chat connects, leaving the plant at stage 0 with no
// setting visible. simulate=1 never connects to chat, so the channel is left out and the
// preview keeps growing. speed fast-forwards the simulated subs; 1 leaves the param out.
export function buildSubSproutPreviewUrl(
  origin: string,
  settings: SubSproutSettings,
  speed = 1,
): string {
  const params = buildSubSproutParams(settings, '', '');
  params.set('simulate', '1');
  if (speed !== 1) params.set('simspeed', String(speed));
  return `${origin}${WIDGET_PATH}?${params.toString()}`;
}

export interface ParsedSubSproutUrl {
  settings: SubSproutSettings;
  twitchChannel: string;
  kickChannel: string;
}

// Same words the widget's parseBoolFlag reads as "off".
const OFF_FLAGS = ['0', 'false', 'off', 'no'];

/**
 * Reverse of buildSubSproutUrl: null for anything that isn't a Sub Sprout URL, the widget
 * default for any value it wouldn't accept, and `simulate` or unknown params ignored.
 */
export function parseSubSproutUrl(text: string): ParsedSubSproutUrl | null {
  let url: URL;
  try {
    url = new URL(text.trim());
  } catch {
    return null;
  }
  if (!url.pathname.replace(/\/+$/, '').endsWith(WIDGET_PATH)) return null;

  const params = url.searchParams;
  const flag = (key: string, fallback: boolean) => {
    const value = params.get(key);
    return value === null ? fallback : !OFF_FLAGS.includes(value.trim().toLowerCase());
  };

  // Older URLs carry one `channel` plus `platform` (Twitch unless it says kick). Like the
  // widget, an explicit `twitch` or `kick` param wins over it.
  const legacyChannel = params.get('channel')?.trim() ?? '';
  const legacyKick = params.get('platform') === 'kick';
  const twitchChannel = params.get('twitch')?.trim() || (legacyKick ? '' : legacyChannel);
  const kickChannel = params.get('kick')?.trim() || (legacyKick ? legacyChannel : '');

  const variety = params.get('variety') ?? undefined;
  const pick = params.get('pick');
  const water = params.get('water') ?? undefined;
  const defaults = DEFAULT_SUB_SPROUT_SETTINGS;

  return {
    twitchChannel,
    kickChannel,
    settings: {
      platforms:
        twitchChannel && !kickChannel ? 'twitch' : kickChannel && !twitchChannel ? 'kick' : 'both',
      variety: isValidPlantId(variety) ? variety : defaults.variety,
      pick: PICK_MODES.includes(pick as PickMode) ? (pick as PickMode) : defaults.pick,
      water: isValidWaterEffect(water) ? water : defaults.water,
      countFx: flag('countfx', defaults.countFx),
      potLabel: flag('potlabel', defaults.potLabel),
    },
  };
}
