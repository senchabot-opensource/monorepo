import type { ComponentType } from 'react';
import {
  ChatBoxIcon,
  EmoteWallIcon,
  type IconProps,
  ObsBridgeIcon,
  RaffleIcon,
  SubSproutIcon,
} from '#/components/icons';
import type { TranslationKey } from '#/lib/i18n';
import type { SitePath } from '#/lib/i18n/paths';
import type { FileRouteTypes } from '#/routeTree.gen';

export type WidgetId = 'chat-box' | 'emote-wall' | 'sub-sprout' | 'raffle' | 'obs-bridge';
/** `overlay`: a browser source that runs on its own. `tool`: a page the streamer operates. */
export type WidgetKind = 'overlay' | 'tool';
export type WidgetPlatform = 'twitch' | 'kick';
export type RoutePath = FileRouteTypes['to'];

export interface SourceSize {
  width: number;
  height: number;
}

export interface WidgetEntry {
  id: WidgetId;
  kind: WidgetKind;
  /** Setup page, by its English path; LocaleLink adds the language. */
  setupPath: SitePath;
  /** The page that ends up in OBS: the overlay, or the live tool page. */
  widgetPath: RoutePath;
  /** Public name, e.g. "Chat Box". */
  nameKey: TranslationKey;
  /** One short sentence for menus and cards. */
  taglineKey: TranslationKey;
  Icon: ComponentType<IconProps>;
  platforms: readonly WidgetPlatform[];
  /** Self-running demo that needs no channel; null when the widget has no demo mode. */
  demoUrl: string | null;
  /** Recommended browser-source size; null when it isn't added as a browser source. */
  sourceSize: SourceSize | null;
}

export const WIDGETS: readonly WidgetEntry[] = [
  {
    id: 'chat-box',
    kind: 'overlay',
    setupPath: '/setup/chat-widget',
    widgetPath: '/widgets/chat-widget',
    nameKey: 'widgets.chatBox.name',
    taglineKey: 'widgets.chatBox.tagline',
    Icon: ChatBoxIcon,
    platforms: ['twitch', 'kick'],
    demoUrl: '/widgets/chat-widget?mock=true',
    sourceSize: { width: 400, height: 600 },
  },
  {
    id: 'emote-wall',
    kind: 'overlay',
    setupPath: '/setup/emote-wall',
    widgetPath: '/widgets/emote-wall',
    nameKey: 'widgets.emoteWall.name',
    taglineKey: 'widgets.emoteWall.tagline',
    Icon: EmoteWallIcon,
    platforms: ['twitch', 'kick'],
    demoUrl: '/widgets/emote-wall?mock=true',
    sourceSize: { width: 1920, height: 1080 },
  },
  {
    id: 'sub-sprout',
    kind: 'overlay',
    setupPath: '/setup/sub-growing-plant',
    widgetPath: '/widgets/sub-sprout-widget',
    nameKey: 'widgets.subSprout.name',
    taglineKey: 'widgets.subSprout.tagline',
    Icon: SubSproutIcon,
    platforms: ['twitch', 'kick'],
    demoUrl: '/widgets/sub-sprout-widget?simulate=true',
    sourceSize: { width: 800, height: 600 },
  },
  {
    id: 'raffle',
    kind: 'tool',
    setupPath: '/setup/raffle',
    widgetPath: '/widgets/raffle-overlay',
    nameKey: 'widgets.raffle.name',
    taglineKey: 'widgets.raffle.tagline',
    Icon: RaffleIcon,
    platforms: ['twitch', 'kick'],
    demoUrl: null,
    // The winner overlay fires confetti from both screen edges, so it covers the full canvas.
    sourceSize: { width: 1920, height: 1080 },
  },
  {
    id: 'obs-bridge',
    kind: 'tool',
    setupPath: '/setup/obs-bridge',
    widgetPath: '/tools/obs-bridge',
    nameKey: 'widgets.obsBridge.name',
    taglineKey: 'widgets.obsBridge.tagline',
    Icon: ObsBridgeIcon,
    platforms: ['twitch', 'kick'],
    demoUrl: null,
    sourceSize: null,
  },
];

export const OVERLAYS = WIDGETS.filter((widget) => widget.kind === 'overlay');
export const TOOLS = WIDGETS.filter((widget) => widget.kind === 'tool');

export function getWidget(id: WidgetId): WidgetEntry {
  const widget = WIDGETS.find((entry) => entry.id === id);
  if (!widget) throw new Error(`Unknown widget: ${id}`);
  return widget;
}
