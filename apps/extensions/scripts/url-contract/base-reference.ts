/**
 * FROZEN ON PURPOSE. DO NOT EDIT.
 *
 * The widget URL logic of extensions.senchabot.com as it was before the redesign (commit 426eef0),
 * copied verbatim so the fixtures in src/__tests__/url-contract/fixtures/ keep describing the URLs
 * streamers already have in OBS. Only the imports and the React state plumbing were stripped; the
 * page-level builders take their state as arguments. If current code disagrees with this file,
 * the current code is what changed: fix it or, for an intended change, write a named test.
 *
 * Sources @426eef0:
 * - src/features/widgets/chat-widget/widget-settings.ts (buildWidgetParams)
 * - src/routes/setup/chat-widget.tsx (widgetUrl)
 * - src/features/widgets/emote-wall/widget-url.ts
 * - src/routes/setup/sub-growing-plant.tsx (buildUrl, getWidgetUrl, isFormValid)
 * - src/routes/setup/obs-bridge.tsx (toolUrl, isFormValid)
 * - src/features/tools/command-users.ts (formatCommandUsers)
 * - src/features/widgets/sub-sprout/plants/registry.ts, water/watering-fx.tsx (option ids)
 */

// ---------------------------------------------------------------------------------------------
// Chat Box: features/widgets/chat-widget/widget-settings.ts
// ---------------------------------------------------------------------------------------------

export const PLATFORMS = ['both', 'twitch', 'kick'] as const;
export const PLATFORM_DISPLAYS = ['name', 'icon', 'none'] as const;
export const FONTS = ['inter', 'roboto', 'nunito', 'mono', 'serif', 'system'] as const;
export const LAYOUTS = ['inline', 'stacked', 'card', 'compact'] as const;
export const ORIENTATIONS = ['vertical', 'horizontal'] as const;
export const HIGHLIGHTS = [
  'mention',
  'reply',
  'firstMessage',
  'announcement',
  'highlighted',
] as const;
export const DURATIONS = ['10', '15', '30', '60', '120', '300', 'keep'] as const;
export const ANIMATIONS = [
  'slide',
  'smooth',
  'pop',
  'bounce',
  'stagger',
  'fade',
  'typing',
  'none',
] as const;

export type Platforms = (typeof PLATFORMS)[number];
export type PlatformDisplay = (typeof PLATFORM_DISPLAYS)[number];
export type Font = (typeof FONTS)[number];
export type Layout = (typeof LAYOUTS)[number];
export type Orientation = (typeof ORIENTATIONS)[number];
export type Animation = (typeof ANIMATIONS)[number];
export type Highlight = (typeof HIGHLIGHTS)[number];
export type Duration = (typeof DURATIONS)[number];

export interface Settings {
  platforms: Platforms;
  platformDisplay: PlatformDisplay;
  font: Font;
  fontSize: string;
  layout: Layout;
  orientation: Orientation;
  animation: Animation;
  background: boolean;
  bgOpacity: string;
  itemBackground: boolean;
  platformAccent: boolean;
  boldUsernames: boolean;
  boldMessages: boolean;
  sevenTv: boolean;
  bttv: boolean;
  ffz: boolean;
  badges: boolean;
  timestamp: boolean;
  duration: Duration;
  hideBots: boolean;
  hideCommands: boolean;
  highlights: Highlight[];
}

export const DEFAULT_SETTINGS: Settings = {
  platforms: 'both',
  platformDisplay: 'icon',
  font: 'inter',
  fontSize: '18',
  layout: 'inline',
  orientation: 'vertical',
  animation: 'slide',
  background: false,
  bgOpacity: '0.5',
  itemBackground: false,
  platformAccent: false,
  boldUsernames: false,
  boldMessages: false,
  sevenTv: true,
  bttv: true,
  ffz: true,
  badges: true,
  timestamp: false,
  duration: '30',
  hideBots: false,
  hideCommands: false,
  highlights: [...HIGHLIGHTS],
};

export function buildWidgetParams(settings: Settings, twitchChannel: string, kickChannel: string) {
  const params = new URLSearchParams();
  const twitch = twitchChannel.trim().toLowerCase();
  const kick = kickChannel.trim().toLowerCase();
  if (settings.platforms !== 'kick' && twitch) params.append('twitch', twitch);
  if (settings.platforms !== 'twitch' && kick) params.append('kick', kick);
  if (!settings.sevenTv) params.append('sevenTv', 'false');
  if (!settings.bttv) params.append('bttv', 'false');
  if (!settings.ffz) params.append('ffz', 'false');
  if (!settings.badges) params.append('badges', 'false');
  // An emptied field would otherwise reach the widget as fontSize=0.
  if (Number(settings.fontSize) > 0 && settings.fontSize !== DEFAULT_SETTINGS.fontSize)
    params.append('fontSize', settings.fontSize);
  if (settings.background) {
    params.append('background', 'true');
    if (settings.bgOpacity !== DEFAULT_SETTINGS.bgOpacity)
      params.append('bgOpacity', settings.bgOpacity);
  }
  if (settings.itemBackground) params.append('itemBackground', 'true');
  if (settings.platformAccent) params.append('platformAccent', 'true');
  if (settings.boldUsernames) params.append('boldUsernames', 'true');
  if (settings.boldMessages) params.append('boldMessages', 'true');
  if (settings.orientation !== DEFAULT_SETTINGS.orientation)
    params.append('orientation', settings.orientation);
  if (
    settings.platforms === 'both' &&
    settings.platformDisplay !== DEFAULT_SETTINGS.platformDisplay
  )
    params.append('platformDisplay', settings.platformDisplay);
  if (settings.timestamp) params.append('timestamp', 'true');
  // 'keep' predates the duration choice, so URLs already in OBS keep working.
  if (settings.duration === 'keep') params.append('keep', 'true');
  else if (settings.duration !== DEFAULT_SETTINGS.duration)
    params.append('duration', settings.duration);
  if (settings.hideBots) params.append('hideBots', 'true');
  if (settings.hideCommands) params.append('hideCommands', 'true');
  // Only a narrowed selection is written, so highlight types added later reach default URLs only.
  if (settings.highlights.length < HIGHLIGHTS.length) {
    const selected = HIGHLIGHTS.filter((h) => settings.highlights.includes(h));
    params.append('highlights', selected.length > 0 ? selected.join(',') : 'none');
  }
  if (settings.font !== DEFAULT_SETTINGS.font) params.append('font', settings.font);
  if (settings.layout !== DEFAULT_SETTINGS.layout) params.append('layout', settings.layout);
  if (settings.animation !== DEFAULT_SETTINGS.animation)
    params.append('animation', settings.animation);
  return params;
}

// routes/setup/chat-widget.tsx, widgetUrl (once mounted).
export function baseChatBoxUrl(
  origin: string,
  settings: Settings,
  twitchChannel: string,
  kickChannel: string,
): string {
  const params = buildWidgetParams(settings, twitchChannel, kickChannel);
  if (!params.has('twitch') && !params.has('kick')) return '';
  return `${origin}/widgets/chat-widget?${params.toString()}`;
}

// ---------------------------------------------------------------------------------------------
// Emote Wall: features/widgets/emote-wall/widget-url.ts
// ---------------------------------------------------------------------------------------------

export type EmoteWallPlatforms = 'both' | 'twitch' | 'kick';
export type EmoteWallMode = 'calm' | 'chaos' | 'bounce';
export const EMOTE_WALL_MODES: readonly EmoteWallMode[] = ['calm', 'chaos', 'bounce'];

export interface EmoteWallUrlOptions {
  twitch: string;
  kick: string;
  platforms: EmoteWallPlatforms;
  sevenTv: boolean;
  mode: EmoteWallMode;
  subsOnly: boolean;
  subDurationX2: boolean;
  showAllEmotes: boolean;
  hypeMode: boolean;
  spamBlock: boolean;
  size: string;
  duration: string;
  max: string;
}

// Setup page's initial state @426eef0.
export const DEFAULT_EMOTE_WALL_OPTIONS: EmoteWallUrlOptions = {
  twitch: '',
  kick: '',
  platforms: 'both',
  sevenTv: true,
  mode: 'calm',
  subsOnly: false,
  subDurationX2: false,
  showAllEmotes: false,
  hypeMode: false,
  spamBlock: true,
  size: '112',
  duration: '5',
  max: '25',
};

const clampParam = (raw: string, min: number, max: number, fallback: number) => {
  const n = raw.trim() === '' ? Number.NaN : Number(raw);
  if (!Number.isFinite(n)) return String(fallback);
  return String(Math.min(max, Math.max(min, n)));
};

export function buildEmoteWallParams(options: EmoteWallUrlOptions): URLSearchParams {
  const params = new URLSearchParams();
  const twitch = options.twitch.trim().toLowerCase();
  const kick = options.kick.trim().toLowerCase();
  if (options.platforms !== 'kick' && twitch) params.append('twitch', twitch);
  if (options.platforms !== 'twitch' && kick) params.append('kick', kick);
  if (!options.sevenTv) params.append('sevenTv', 'false');
  if (options.mode !== 'calm') params.append('mode', options.mode);
  if (options.subsOnly) params.append('subsOnly', 'true');
  if (options.subDurationX2) params.append('subDurationX2', 'true');
  if (options.showAllEmotes) params.append('showAllEmotes', 'true');
  if (options.hypeMode) params.append('hypeMode', 'true');
  if (!options.spamBlock) params.append('spamBlock', 'false');
  const size = clampParam(options.size, 32, 256, 112);
  if (size !== '112') params.append('size', size);
  const duration = clampParam(options.duration, 2, 30, 5);
  if (duration !== '5') params.append('duration', duration);
  const max = clampParam(options.max, 1, 120, 25);
  if (max !== '25') params.append('max', max);
  return params;
}

export function buildEmoteWallUrl(origin: string, options: EmoteWallUrlOptions): string {
  const params = buildEmoteWallParams(options);
  if (!params.has('twitch') && !params.has('kick')) return '';
  return `${origin}/widgets/emote-wall?${params.toString()}`;
}

// ---------------------------------------------------------------------------------------------
// Sub Sprout: routes/setup/sub-growing-plant.tsx
// ---------------------------------------------------------------------------------------------

export const PLANT_IDS = [
  'classic',
  'rose',
  'sunflower',
  'cactus',
  'tulip',
  'pine',
  'lotus',
  'lily',
  'palm',
  'vine',
] as const;
export const PICK_MODES = ['fixed', 'cycle', 'random'] as const;
export const WATER_EFFECTS = ['off', 'rain', 'sparkle'] as const;

export interface SubSproutState {
  platform: 'both' | 'twitch' | 'kick';
  twitchChannel: string;
  kickChannel: string;
  variety: (typeof PLANT_IDS)[number];
  pick: (typeof PICK_MODES)[number];
  water: (typeof WATER_EFFECTS)[number];
  countFx: boolean;
  potLabel: boolean;
}

export const DEFAULT_SUB_SPROUT_STATE: SubSproutState = {
  platform: 'both',
  twitchChannel: '',
  kickChannel: '',
  variety: 'classic',
  pick: 'fixed',
  water: 'off',
  countFx: true,
  potLabel: false,
};

/** The URL the Copy button wrote: empty while the form was invalid (Copy disabled). */
export function baseSubSproutUrl(origin: string, state: SubSproutState): string {
  const { platform, twitchChannel, kickChannel, variety, pick, water, countFx, potLabel } = state;
  const buildUrl = (twitch: string, kick: string, withChannel: boolean) => {
    if (withChannel && !twitch && !kick) return '';
    const params = new URLSearchParams();
    if (withChannel) {
      if (platform !== 'kick' && twitch) params.set('twitch', twitch);
      if (platform !== 'twitch' && kick) params.set('kick', kick);
    }
    if (variety !== 'classic') params.set('variety', variety);
    if (pick !== 'fixed') params.set('pick', pick);
    if (water !== 'off') params.set('water', water);
    if (!countFx) params.set('countfx', '0');
    if (potLabel) params.set('potlabel', '1');
    return `${origin}/widgets/sub-sprout-widget?${params.toString()}`;
  };
  const getWidgetUrl = (withChannel = true) =>
    buildUrl(twitchChannel.trim().toLowerCase(), kickChannel.trim().toLowerCase(), withChannel);
  const isFormValid =
    (platform !== 'kick' && twitchChannel.trim().length > 0) ||
    (platform !== 'twitch' && kickChannel.trim().length > 0);
  return isFormValid ? getWidgetUrl() : '';
}

// ---------------------------------------------------------------------------------------------
// OBS Bridge: routes/setup/obs-bridge.tsx, features/tools/command-users.ts
// ---------------------------------------------------------------------------------------------

export type CommandUser = { platform: 'twitch' | 'kick' | null; name: string };

export function formatCommandUsers(users: CommandUser[]): string {
  return users.map((u) => (u.platform ? `${u.platform}:${u.name}` : u.name)).join(',');
}

// Every command input started out filled with its default.
export const DEFAULT_OBS_COMMANDS = {
  cmdScene: '!scene',
  cmdBrb: 'brb',
  cmdBack: 'back',
  cmdStartStream: '!startstream',
  cmdStopStream: '!stopstream',
  cmdStartRecord: '!startrecord',
  cmdStopRecord: '!stoprecord',
} as const;

export type ObsCommandKey = keyof typeof DEFAULT_OBS_COMMANDS;

export interface ObsBridgeState {
  commandUsers: CommandUser[];
  obsWebsocketUrl: string;
  obsWebsocketPassword: string;
  twitchChannel: string;
  kickChannel: string;
  commands: Record<ObsCommandKey, string>;
}

/** The URL the Copy button wrote: empty while the form was invalid (Copy disabled). */
export function baseObsBridgeUrl(origin: string, state: ObsBridgeState): string {
  const { commandUsers, obsWebsocketUrl, obsWebsocketPassword, twitchChannel, kickChannel } = state;
  const {
    cmdScene,
    cmdBrb,
    cmdBack,
    cmdStartStream,
    cmdStopStream,
    cmdStartRecord,
    cmdStopRecord,
  } = state.commands;
  const params = new URLSearchParams();
  if (commandUsers.length > 0) {
    params.append('commandUser', formatCommandUsers(commandUsers));
  }
  if (obsWebsocketUrl) params.append('obsWebsocketUrl', obsWebsocketUrl);
  if (obsWebsocketPassword) params.append('obsWebsocketPassword', obsWebsocketPassword);
  if (twitchChannel) params.append('twitch', twitchChannel);
  if (kickChannel) params.append('kick', kickChannel);
  if (cmdScene && cmdScene !== '!scene') params.append('cmdScene', cmdScene.trim());
  if (cmdBrb && cmdBrb !== 'brb') params.append('cmdBrb', cmdBrb.trim());
  if (cmdBack && cmdBack !== 'back') params.append('cmdBack', cmdBack.trim());
  if (cmdStartStream && cmdStartStream !== '!startstream')
    params.append('cmdStartStream', cmdStartStream.trim());
  if (cmdStopStream && cmdStopStream !== '!stopstream')
    params.append('cmdStopStream', cmdStopStream.trim());
  if (cmdStartRecord && cmdStartRecord !== '!startrecord')
    params.append('cmdStartRecord', cmdStartRecord.trim());
  if (cmdStopRecord && cmdStopRecord !== '!stoprecord')
    params.append('cmdStopRecord', cmdStopRecord.trim());
  const toolUrl = `${origin}/tools/obs-bridge?${params.toString()}`;
  const isFormValid = twitchChannel.length > 0 || kickChannel.length > 0;
  return isFormValid ? toolUrl : '';
}
