import { isClassic } from '#/features/presets/registry';
import { CLASSIC_PRESET, readPreset, writePreset } from '#/lib/preset-url';
import { readCoercedFlag, readWidgetUrl, setChannels } from '#/lib/url-params';

export const PLATFORMS = ['both', 'twitch', 'kick'] as const;
export const PLATFORM_DISPLAYS = ['name', 'icon', 'none'] as const;
export const FONTS = ['inter', 'roboto', 'nunito', 'mono', 'serif', 'system'] as const;
export const LAYOUTS = ['inline', 'stacked', 'card', 'compact'] as const;
export const ORIENTATIONS = ['vertical', 'horizontal'] as const;
// Order is the URL order too, so the same selection always builds the same URL.
export const HIGHLIGHTS = [
  'mention',
  'reply',
  'firstMessage',
  'announcement',
  'highlighted',
] as const;
// Seconds a message stays on screen; 'keep' never removes it.
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
  /** Preset id; any preset but classic brings its own fonts, colors and message boxes. */
  preset: string;
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

// Mirrors the widget's own defaults, so only changed settings end up in the URL.
export const DEFAULT_SETTINGS: Settings = {
  platforms: 'both',
  preset: CLASSIC_PRESET,
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
  highlights: [],
};

export function buildWidgetParams(settings: Settings, twitchChannel: string, kickChannel: string) {
  const params = new URLSearchParams();
  setChannels(params, settings.platforms, twitchChannel, kickChannel);
  writePreset(params, settings.preset);
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
  // Opt-in: URLs from before highlights existed carry no param and must keep looking the same.
  const highlights = HIGHLIGHTS.filter((h) => settings.highlights.includes(h));
  if (highlights.length > 0) params.append('highlights', highlights.join(','));
  if (isClassic(settings.preset) && settings.font !== DEFAULT_SETTINGS.font)
    params.append('font', settings.font);
  if (settings.layout !== DEFAULT_SETTINGS.layout) params.append('layout', settings.layout);
  if (settings.animation !== DEFAULT_SETTINGS.animation)
    params.append('animation', settings.animation);
  return params;
}

export interface ParsedWidgetUrl {
  settings: Settings;
  twitchChannel: string;
  kickChannel: string;
}

// Reverse of buildWidgetParams: returns null for anything that isn't a chat widget URL, and falls
// back to the default for any single value the widget wouldn't accept either.
export function parseWidgetUrl(text: string): ParsedWidgetUrl | null {
  const pasted = readWidgetUrl(text, '/widgets/chat-widget');
  if (!pasted) return null;

  const { params, twitchChannel, kickChannel } = pasted;
  const oneOf = <T extends string>(key: string, values: readonly T[], fallback: T): T => {
    const value = params.get(key);
    return values.includes(value as T) ? (value as T) : fallback;
  };
  const flag = (key: string, fallback: boolean) => readCoercedFlag(params.get(key), fallback);
  const number = (key: string, fallback: string, isValid: (n: number) => boolean) => {
    const value = params.get(key);
    const n = Number(value);
    return value && Number.isFinite(n) && isValid(n) ? String(n) : fallback;
  };

  // A single channel means a single platform, unless the URL carries a platform indicator,
  // which buildWidgetParams only writes for 'both'. Either way the rebuilt URL stays the same.
  let platforms: Platforms = 'both';
  if (!params.has('platformDisplay')) {
    if (twitchChannel && !kickChannel) platforms = 'twitch';
    else if (kickChannel && !twitchChannel) platforms = 'kick';
  }

  return {
    twitchChannel,
    kickChannel,
    settings: {
      platforms,
      preset: readPreset(params),
      platformDisplay: oneOf(
        'platformDisplay',
        PLATFORM_DISPLAYS,
        DEFAULT_SETTINGS.platformDisplay,
      ),
      font: oneOf('font', FONTS, DEFAULT_SETTINGS.font),
      fontSize: number('fontSize', DEFAULT_SETTINGS.fontSize, (n) => n > 0),
      layout: oneOf('layout', LAYOUTS, DEFAULT_SETTINGS.layout),
      orientation: oneOf('orientation', ORIENTATIONS, DEFAULT_SETTINGS.orientation),
      animation: oneOf('animation', ANIMATIONS, DEFAULT_SETTINGS.animation),
      background: flag('background', DEFAULT_SETTINGS.background),
      bgOpacity: number('bgOpacity', DEFAULT_SETTINGS.bgOpacity, (n) => n >= 0 && n <= 1),
      itemBackground: flag('itemBackground', DEFAULT_SETTINGS.itemBackground),
      platformAccent: flag('platformAccent', DEFAULT_SETTINGS.platformAccent),
      boldUsernames: flag('boldUsernames', DEFAULT_SETTINGS.boldUsernames),
      boldMessages: flag('boldMessages', DEFAULT_SETTINGS.boldMessages),
      sevenTv: flag('sevenTv', DEFAULT_SETTINGS.sevenTv),
      bttv: flag('bttv', DEFAULT_SETTINGS.bttv),
      ffz: flag('ffz', DEFAULT_SETTINGS.ffz),
      badges: flag('badges', DEFAULT_SETTINGS.badges),
      timestamp: flag('timestamp', DEFAULT_SETTINGS.timestamp),
      duration: flag('keep', false)
        ? 'keep'
        : oneOf('duration', DURATIONS, DEFAULT_SETTINGS.duration),
      hideBots: flag('hideBots', DEFAULT_SETTINGS.hideBots),
      hideCommands: flag('hideCommands', DEFAULT_SETTINGS.hideCommands),
      highlights: parseHighlights(params.get('highlights')),
    },
  };
}

export function parseHighlights(value: string | null | undefined): Highlight[] {
  const listed = value?.split(',') ?? [];
  return HIGHLIGHTS.filter((h) => listed.includes(h));
}
