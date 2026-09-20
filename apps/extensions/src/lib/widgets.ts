import type { ComponentType } from 'react';
import {
  ChatBoxIcon,
  CountdownIcon,
  EmoteWallIcon,
  FramesIcon,
  GoalIcon,
  type IconProps,
  ObsBridgeIcon,
  PollIcon,
  RaffleIcon,
  StreamAlertsIcon,
  SubathonIcon,
  SubSproutIcon,
} from '#/components/icons';
import type { TranslationKey } from '#/lib/i18n';
import type { SitePath } from '#/lib/i18n/paths';
import type { FileRouteTypes } from '#/routeTree.gen';

export type WidgetId =
  | 'chat-box'
  | 'emote-wall'
  | 'sub-sprout'
  | 'goal'
  | 'subathon'
  | 'poll'
  | 'stream-alerts'
  | 'frames'
  | 'countdown'
  | 'raffle'
  | 'obs-bridge';
/** `overlay`: a browser source that runs on its own. `tool`: something the streamer operates. */
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
    id: 'stream-alerts',
    kind: 'overlay',
    setupPath: '/setup/stream-alerts',
    widgetPath: '/widgets/stream-alerts',
    nameKey: 'widgets.streamAlerts.name',
    taglineKey: 'widgets.streamAlerts.tagline',
    Icon: StreamAlertsIcon,
    platforms: ['twitch', 'kick'],
    demoUrl: '/widgets/stream-alerts?simulate=1',
    sourceSize: { width: 800, height: 450 },
  },
  {
    id: 'goal',
    kind: 'overlay',
    setupPath: '/setup/sub-goal',
    // Named for any goal, so a follower or Bits goal can join later without breaking OBS URLs.
    widgetPath: '/widgets/goal',
    nameKey: 'widgets.goal.name',
    taglineKey: 'widgets.goal.tagline',
    Icon: GoalIcon,
    platforms: ['twitch', 'kick'],
    demoUrl: '/widgets/goal?simulate=1',
    sourceSize: { width: 800, height: 260 },
  },
  {
    id: 'frames',
    kind: 'overlay',
    setupPath: '/setup/stream-frames',
    widgetPath: '/widgets/frame',
    nameKey: 'widgets.frames.name',
    taglineKey: 'widgets.frames.tagline',
    Icon: FramesIcon,
    platforms: ['twitch', 'kick'],
    // Every piece on one canvas; the setup page shows one piece at its own size.
    demoUrl: '/widgets/frame?demo=1',
    sourceSize: { width: 1920, height: 1080 },
  },
  {
    id: 'countdown',
    // It runs on its own from the URL; a channel is optional, only for the chat commands.
    kind: 'overlay',
    setupPath: '/setup/stream-countdown',
    widgetPath: '/widgets/countdown',
    nameKey: 'widgets.countdown.name',
    taglineKey: 'widgets.countdown.tagline',
    Icon: CountdownIcon,
    platforms: ['twitch', 'kick'],
    demoUrl: '/widgets/countdown?simulate=1',
    // A whole scene: the clock sits in the middle of it.
    sourceSize: { width: 1920, height: 1080 },
  },
  {
    id: 'poll',
    // Mods put polls up and end them from chat, like the Subathon Timer's clock.
    kind: 'tool',
    setupPath: '/setup/chat-poll',
    widgetPath: '/widgets/poll',
    nameKey: 'widgets.poll.name',
    taglineKey: 'widgets.poll.tagline',
    Icon: PollIcon,
    platforms: ['twitch', 'kick'],
    demoUrl: '/widgets/poll?simulate=1',
    sourceSize: { width: 640, height: 560 },
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
    id: 'subathon',
    // Mods run the clock from chat (start, pause, add time), so it sits with the tools.
    kind: 'tool',
    setupPath: '/setup/subathon-timer',
    widgetPath: '/widgets/subathon',
    nameKey: 'widgets.subathon.name',
    taglineKey: 'widgets.subathon.tagline',
    Icon: SubathonIcon,
    platforms: ['twitch', 'kick'],
    demoUrl: '/widgets/subathon?simulate=1',
    sourceSize: { width: 800, height: 300 },
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
