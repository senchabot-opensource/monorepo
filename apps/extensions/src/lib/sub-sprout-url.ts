import { isValidPlantId, type PlantId } from '#/features/widgets/sub-sprout/plants/registry';
import {
  isValidWaterEffect,
  type WaterEffectType,
} from '#/features/widgets/sub-sprout/water/watering-fx';
import {
  type ChannelPlatforms,
  channelWidgetUrl,
  platformsOf,
  readFlag,
  readWidgetUrl,
  setChannels,
} from '#/lib/url-params';

export type SubSproutPlatforms = ChannelPlatforms;
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
function buildSubSproutParams(
  settings: SubSproutSettings,
  twitchChannel: string,
  kickChannel: string,
): URLSearchParams {
  const params = new URLSearchParams();
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
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
  return channelWidgetUrl(
    origin,
    WIDGET_PATH,
    buildSubSproutParams(settings, twitchChannel, kickChannel),
  );
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

/**
 * Reverse of buildSubSproutUrl: null for anything that isn't a Sub Sprout URL, the widget
 * default for any value it wouldn't accept, and `simulate` or unknown params ignored.
 */
export function parseSubSproutUrl(text: string): ParsedSubSproutUrl | null {
  const pasted = readWidgetUrl(text, WIDGET_PATH);
  if (!pasted) return null;

  const { params } = pasted;
  // readFlag's "off" words are the ones the widget's parseBoolFlag reads as off too.
  const flag = (key: string, fallback: boolean) => readFlag(params.get(key), fallback);

  // Older URLs carry one `channel` plus `platform` (Twitch unless it says kick). Like the
  // widget, an explicit `twitch` or `kick` param wins over it.
  const legacyChannel = params.get('channel')?.trim() ?? '';
  const legacyKick = params.get('platform') === 'kick';
  const twitchChannel = pasted.twitchChannel || (legacyKick ? '' : legacyChannel);
  const kickChannel = pasted.kickChannel || (legacyKick ? legacyChannel : '');

  const variety = params.get('variety') ?? undefined;
  const pick = params.get('pick');
  const water = params.get('water') ?? undefined;
  const defaults = DEFAULT_SUB_SPROUT_SETTINGS;

  return {
    twitchChannel,
    kickChannel,
    settings: {
      platforms: platformsOf(twitchChannel, kickChannel),
      variety: isValidPlantId(variety) ? variety : defaults.variety,
      pick: PICK_MODES.includes(pick as PickMode) ? (pick as PickMode) : defaults.pick,
      water: isValidWaterEffect(water) ? water : defaults.water,
      countFx: flag('countfx', defaults.countFx),
      potLabel: flag('potlabel', defaults.potLabel),
    },
  };
}
