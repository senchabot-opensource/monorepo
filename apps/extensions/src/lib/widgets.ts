import type { ComponentType } from 'react';
import {
  BitsGoalIcon,
  ChatBoxIcon,
  CountdownIcon,
  CounterIcon,
  CreditsIcon,
  EmoteComboIcon,
  EmoteWallIcon,
  EventListIcon,
  FeaturedIcon,
  FramesIcon,
  GoalIcon,
  type IconProps,
  IrlHudIcon,
  LeaderboardIcon,
  LowerThirdIcon,
  NowPlayingIcon,
  ObsBridgeIcon,
  PollIcon,
  QueueIcon,
  RaffleIcon,
  SocialsIcon,
  SpinWheelIcon,
  StreamAlertsIcon,
  SubathonIcon,
  SubSproutIcon,
  TasksIcon,
  WeatherIcon,
} from '#/components/icons';
import type { TranslationKey } from '#/lib/i18n';
import type { SitePath } from '#/lib/i18n/paths';
import type { FileRouteTypes } from '#/routeTree.gen';

export type WidgetId =
  | 'chat-box'
  | 'emote-wall'
  | 'sub-sprout'
  | 'goal'
  | 'follower-goal'
  | 'subathon'
  | 'poll'
  | 'queue'
  | 'stream-alerts'
  | 'event-list'
  | 'credits'
  | 'leaderboard'
  | 'lower-third'
  | 'tasks'
  | 'now-playing'
  | 'emote-combo'
  | 'featured'
  | 'bits-goal'
  | 'irl-hud'
  | 'counter'
  | 'weather'
  | 'frames'
  | 'countdown'
  | 'raffle'
  | 'obs-bridge'
  | 'spin-wheel'
  | 'socials';
/** `overlay`: a browser source that runs on its own. `tool`: something the streamer operates. */
export type WidgetKind = 'overlay' | 'tool';
export type WidgetPlatform = 'twitch' | 'kick';
/** What a widget is for, so the gallery and More widgets can be narrowed down. */
export const WIDGET_CATEGORIES = [
  'chat',
  'alerts',
  'goals',
  'interactive',
  'scene',
  'irl',
] as const;
export type WidgetCategory = (typeof WIDGET_CATEGORIES)[number];
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
  /** One or two of WIDGET_CATEGORIES, in the order they matter. */
  categories: readonly WidgetCategory[];
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
    categories: ['chat'],
    demoUrl: '/widgets/chat-widget?mock=true',
    sourceSize: { width: 400, height: 600 },
  },
  {
    id: 'event-list',
    kind: 'overlay',
    setupPath: '/setup/event-list',
    widgetPath: '/widgets/event-list',
    nameKey: 'widgets.eventList.name',
    taglineKey: 'widgets.eventList.tagline',
    Icon: EventListIcon,
    platforms: ['twitch', 'kick'],
    categories: ['alerts'],
    demoUrl: '/widgets/event-list?simulate=1',
    sourceSize: { width: 420, height: 520 },
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
    categories: ['chat'],
    demoUrl: '/widgets/emote-wall?mock=true',
    sourceSize: { width: 1920, height: 1080 },
  },
  {
    id: 'emote-combo',
    kind: 'overlay',
    setupPath: '/setup/emote-combo',
    widgetPath: '/widgets/emote-combo',
    nameKey: 'widgets.emoteCombo.name',
    taglineKey: 'widgets.emoteCombo.tagline',
    Icon: EmoteComboIcon,
    platforms: ['twitch', 'kick'],
    categories: ['chat'],
    demoUrl: '/widgets/emote-combo?simulate=1',
    sourceSize: { width: 600, height: 400 },
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
    categories: ['alerts'],
    demoUrl: '/widgets/sub-sprout-widget?simulate=true',
    sourceSize: { width: 800, height: 600 },
  },
  {
    id: 'irl-hud',
    kind: 'overlay',
    setupPath: '/setup/irl-hud',
    widgetPath: '/widgets/irl-hud',
    nameKey: 'widgets.irlHud.name',
    taglineKey: 'widgets.irlHud.tagline',
    Icon: IrlHudIcon,
    platforms: ['twitch', 'kick'],
    categories: ['irl', 'alerts'],
    demoUrl: '/widgets/irl-hud?simulate=1',
    // A whole scene: the money and the mini-map each sit in a corner of it.
    sourceSize: { width: 1920, height: 1080 },
  },
  {
    id: 'weather',
    // It reads no chat: the place and the look are all in the URL.
    kind: 'overlay',
    setupPath: '/setup/weather',
    widgetPath: '/widgets/weather',
    nameKey: 'widgets.weather.name',
    taglineKey: 'widgets.weather.tagline',
    Icon: WeatherIcon,
    platforms: ['twitch', 'kick'],
    categories: ['scene', 'irl'],
    demoUrl: '/widgets/weather?demo=1',
    // A whole scene: the weather sits in a corner of it.
    sourceSize: { width: 1920, height: 1080 },
  },
  {
    id: 'follower-goal',
    kind: 'overlay',
    setupPath: '/setup/follower-goal',
    widgetPath: '/widgets/follower-goal',
    nameKey: 'widgets.followerGoal.name',
    taglineKey: 'widgets.followerGoal.tagline',
    Icon: GoalIcon,
    platforms: ['twitch', 'kick'],
    categories: ['goals'],
    demoUrl: '/widgets/follower-goal?simulate=1',
    sourceSize: { width: 800, height: 260 },
  },
  {
    id: 'bits-goal',
    kind: 'overlay',
    setupPath: '/setup/bits-goal',
    // The Sub Goal's overlay counting Bits and Kicks instead: the route was named for any goal.
    widgetPath: '/widgets/goal',
    nameKey: 'widgets.bitsGoal.name',
    taglineKey: 'widgets.bitsGoal.tagline',
    Icon: BitsGoalIcon,
    platforms: ['twitch', 'kick'],
    categories: ['goals'],
    demoUrl: '/widgets/goal?simulate=1&type=bits',
    sourceSize: { width: 800, height: 260 },
  },
  {
    id: 'leaderboard',
    kind: 'overlay',
    setupPath: '/setup/top-supporters',
    widgetPath: '/widgets/leaderboard',
    nameKey: 'widgets.leaderboard.name',
    taglineKey: 'widgets.leaderboard.tagline',
    Icon: LeaderboardIcon,
    platforms: ['twitch', 'kick'],
    categories: ['alerts'],
    demoUrl: '/widgets/leaderboard?simulate=1',
    sourceSize: { width: 440, height: 380 },
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
    categories: ['alerts'],
    demoUrl: '/widgets/stream-alerts?simulate=1',
    sourceSize: { width: 800, height: 450 },
  },
  {
    id: 'credits',
    kind: 'overlay',
    setupPath: '/setup/end-credits',
    widgetPath: '/widgets/credits',
    nameKey: 'widgets.credits.name',
    taglineKey: 'widgets.credits.tagline',
    Icon: CreditsIcon,
    platforms: ['twitch', 'kick'],
    categories: ['alerts'],
    demoUrl: '/widgets/credits?simulate=1',
    // A whole scene: the credits roll up its middle.
    sourceSize: { width: 1920, height: 1080 },
  },
  {
    id: 'socials',
    kind: 'overlay',
    setupPath: '/setup/socials',
    widgetPath: '/widgets/socials',
    nameKey: 'widgets.socials.name',
    taglineKey: 'widgets.socials.tagline',
    Icon: SocialsIcon,
    platforms: ['twitch', 'kick'],
    categories: ['scene'],
    demoUrl: '/widgets/socials?demo=1',
    sourceSize: { width: 600, height: 120 },
  },
  {
    id: 'counter',
    // Mods change it from chat like the Sub Goal's count, but it's a number in the scene, not
    // something the streamer runs, so it sits with the overlays.
    kind: 'overlay',
    setupPath: '/setup/counter',
    widgetPath: '/widgets/counter',
    nameKey: 'widgets.counter.name',
    taglineKey: 'widgets.counter.tagline',
    Icon: CounterIcon,
    platforms: ['twitch', 'kick'],
    categories: ['goals'],
    demoUrl:
      '/widgets/counter?simulate=1&c1=Wins&c1icon=%F0%9F%8F%86&c1start=12&c2=Losses&c2icon=%E2%9D%8C&c2start=7&c3=Draws&c3icon=%F0%9F%A4%9D&c3start=3',
    // The row layout's stage. Its strip shape also keeps the landing gallery in whole rows.
    sourceSize: { width: 800, height: 260 },
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
    categories: ['goals'],
    demoUrl: '/widgets/goal?simulate=1',
    sourceSize: { width: 800, height: 260 },
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
    categories: ['goals', 'scene'],
    demoUrl: '/widgets/countdown?simulate=1',
    // A whole scene: the clock sits in the middle of it.
    sourceSize: { width: 1920, height: 1080 },
  },
  {
    id: 'featured',
    kind: 'overlay',
    setupPath: '/setup/featured-message',
    widgetPath: '/widgets/featured',
    nameKey: 'widgets.featured.name',
    taglineKey: 'widgets.featured.tagline',
    Icon: FeaturedIcon,
    platforms: ['twitch', 'kick'],
    categories: ['chat', 'interactive'],
    demoUrl: '/widgets/featured?simulate=1',
    sourceSize: { width: 720, height: 240 },
  },
  {
    id: 'now-playing',
    kind: 'overlay',
    setupPath: '/setup/now-playing',
    widgetPath: '/widgets/now-playing',
    nameKey: 'widgets.nowPlaying.name',
    taglineKey: 'widgets.nowPlaying.tagline',
    Icon: NowPlayingIcon,
    // Reads no chat: the song comes from Last.fm or ListenBrainz, so it works with either.
    platforms: ['twitch', 'kick'],
    categories: ['scene'],
    demoUrl: '/widgets/now-playing?demo=1',
    sourceSize: { width: 640, height: 160 },
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
    categories: ['scene'],
    // Every piece on one canvas; the setup page shows one piece at its own size.
    demoUrl: '/widgets/frame?demo=1',
    sourceSize: { width: 1920, height: 1080 },
  },
  {
    id: 'lower-third',
    // It runs on its own from the URL; a channel is optional, only for the chat commands.
    kind: 'overlay',
    setupPath: '/setup/lower-thirds',
    widgetPath: '/widgets/lower-third',
    nameKey: 'widgets.lowerThird.name',
    taglineKey: 'widgets.lowerThird.tagline',
    Icon: LowerThirdIcon,
    platforms: ['twitch', 'kick'],
    categories: ['scene'],
    demoUrl:
      '/widgets/lower-third?simulate=1&title=Senchabot&lines=Free+overlays+for+Twitch+and+Kick%7CNo+login%2C+nothing+to+install&rotate=4&size=200',
    // A whole scene: the bar sits in a corner of it, drawn at its largest so a card can show it.
    sourceSize: { width: 1920, height: 1080 },
  },
  {
    id: 'tasks',
    kind: 'overlay',
    setupPath: '/setup/task-list',
    widgetPath: '/widgets/tasks',
    nameKey: 'widgets.tasks.name',
    taglineKey: 'widgets.tasks.tagline',
    Icon: TasksIcon,
    platforms: ['twitch', 'kick'],
    categories: ['interactive'],
    demoUrl: '/widgets/tasks?simulate=1',
    sourceSize: { width: 480, height: 720 },
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
    categories: ['interactive'],
    demoUrl: '/widgets/poll?simulate=1',
    sourceSize: { width: 640, height: 560 },
  },
  {
    id: 'queue',
    // Mods call viewers up and open and close it from chat, like the poll.
    kind: 'tool',
    setupPath: '/setup/viewer-queue',
    widgetPath: '/widgets/queue',
    nameKey: 'widgets.queue.name',
    taglineKey: 'widgets.queue.tagline',
    Icon: QueueIcon,
    platforms: ['twitch', 'kick'],
    categories: ['interactive'],
    demoUrl: '/widgets/queue?simulate=1',
    sourceSize: { width: 440, height: 600 },
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
    categories: ['interactive'],
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
    categories: ['goals'],
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
    categories: ['scene'],
    demoUrl: null,
    sourceSize: null,
  },
  {
    id: 'spin-wheel',
    kind: 'tool',
    setupPath: '/setup/spin-wheel',
    widgetPath: '/widgets/spin-wheel',
    nameKey: 'widgets.spinWheel.name',
    taglineKey: 'widgets.spinWheel.tagline',
    Icon: SpinWheelIcon,
    platforms: ['twitch', 'kick'],
    categories: ['interactive'],
    demoUrl: null,
    sourceSize: { width: 800, height: 800 },
  },
];

export const OVERLAYS = WIDGETS.filter((widget) => widget.kind === 'overlay');
export const TOOLS = WIDGETS.filter((widget) => widget.kind === 'tool');

/** A gallery filter: one category, or every widget. */
export type CategoryFilter = WidgetCategory | 'all';
/** The landing page's search param for its filter, so a filtered gallery can be shared. */
export const CATEGORY_PARAM = 'category';

/** The widgets in `filter`, in their registry order. */
export function inCategory(
  widgets: readonly WidgetEntry[],
  filter: CategoryFilter,
): readonly WidgetEntry[] {
  return filter === 'all'
    ? widgets
    : widgets.filter((widget) => widget.categories.includes(filter));
}

/** A filter from text such as `?category=`; anything unknown is every widget. */
export function readCategory(value: string | null | undefined): CategoryFilter {
  return WIDGET_CATEGORIES.find((category) => category === value) ?? 'all';
}

export function getWidget(id: WidgetId): WidgetEntry {
  const widget = WIDGETS.find((entry) => entry.id === id);
  if (!widget) throw new Error(`Unknown widget: ${id}`);
  return widget;
}
