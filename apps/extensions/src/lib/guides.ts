import type { TranslationKey } from '#/lib/i18n';
import type { RoutePath, WidgetId } from '#/lib/widgets';

export type GuideId =
  | 'obs-browser-source'
  | 'twitch-kick-chat-overlay'
  | 'chat-giveaway'
  | 'obs-scene-switcher';

/** English `<title>` and meta description; the server always renders English. */
export interface PageMeta {
  title: string;
  description: string;
}

export interface GuideEntry {
  id: GuideId;
  path: RoutePath;
  /** The H1, a "How to ..." question; also the Article headline. */
  titleKey: TranslationKey;
  /** Short label for the breadcrumb. */
  shortKey: TranslationKey;
  /** One line on what the guide answers, for the guide cards. */
  summaryKey: TranslationKey;
  /** Answer-first intro under the H1. */
  leadKey: TranslationKey;
  /** The widgets it covers, shown as links under the H1. */
  widgets: readonly WidgetId[];
  related: readonly GuideId[];
  meta: PageMeta;
}

export const GUIDES_PATH = '/guides';
export const GUIDES_PUBLISHED = '2026-09-12';

export const GUIDES: readonly GuideEntry[] = [
  {
    id: 'obs-browser-source',
    path: '/guides/obs-browser-source',
    titleKey: 'guides.obs.title',
    shortKey: 'guides.obs.short',
    summaryKey: 'guides.obs.summary',
    leadKey: 'guides.obs.lead',
    widgets: ['chat-box', 'emote-wall', 'sub-sprout', 'raffle'],
    related: ['twitch-kick-chat-overlay', 'chat-giveaway'],
    meta: {
      title: 'Add a Stream Widget to OBS as a Browser Source | Senchabot',
      description:
        'Add a Senchabot widget to OBS Studio as a Browser Source: paste the URL, set the size (Chat Box is 400×600), keep it transparent and fix an empty source.',
    },
  },
  {
    id: 'twitch-kick-chat-overlay',
    path: '/guides/twitch-kick-chat-overlay',
    titleKey: 'guides.chat.title',
    shortKey: 'guides.chat.short',
    summaryKey: 'guides.chat.summary',
    leadKey: 'guides.chat.lead',
    widgets: ['chat-box', 'emote-wall', 'sub-sprout'],
    related: ['obs-browser-source', 'obs-scene-switcher'],
    meta: {
      title: 'Show Twitch and Kick Chat Together in OBS | Senchabot',
      description:
        'Merge Twitch and Kick chat into one OBS overlay with a single Chat Box URL: platform icons, 7TV, BTTV and FFZ emotes, bot filters and a 400×600 source.',
    },
  },
  {
    id: 'chat-giveaway',
    path: '/guides/chat-giveaway',
    titleKey: 'guides.raffle.title',
    shortKey: 'guides.raffle.short',
    summaryKey: 'guides.raffle.summary',
    leadKey: 'guides.raffle.lead',
    widgets: ['raffle'],
    related: ['obs-browser-source', 'twitch-kick-chat-overlay'],
    meta: {
      title: 'Run a Twitch or Kick Chat Giveaway with !join | Senchabot',
      description:
        'Run a free chat giveaway on Twitch or Kick: viewers type !join, you set subs-only rules, a win limit and a 15 second minimum, then draw a winner on stream.',
    },
  },
  {
    id: 'obs-scene-switcher',
    path: '/guides/obs-scene-switcher',
    titleKey: 'guides.bridge.title',
    shortKey: 'guides.bridge.short',
    summaryKey: 'guides.bridge.summary',
    leadKey: 'guides.bridge.lead',
    widgets: ['obs-bridge'],
    related: ['obs-browser-source', 'chat-giveaway'],
    meta: {
      title: 'Let Mods Switch OBS Scenes from Chat | Senchabot',
      description:
        'Let mods switch OBS scenes from Twitch or Kick chat with !scene, brb and back. Turn on OBS WebSocket (ws://127.0.0.1:4455) and pick who can use them.',
    },
  },
];

export function getGuide(id: GuideId): GuideEntry {
  const guide = GUIDES.find((entry) => entry.id === id);
  if (!guide) throw new Error(`Unknown guide: ${id}`);
  return guide;
}

/** Meta for the content pages that aren't guides. */
export const CONTENT_META = {
  guides: {
    title: 'Guides for Twitch and Kick Overlays in OBS | Senchabot',
    description:
      "Step-by-step guides for Senchabot's free Twitch and Kick overlays: add a widget to OBS, merge two chats, run a !join giveaway, switch scenes from chat.",
  },
  faq: {
    title: 'Senchabot Extensions FAQ: Free Twitch and Kick Overlays',
    description:
      'Answers about Senchabot Extensions: free with no login, which of the 5 widgets support Twitch and Kick, where your settings live and how to report a bug.',
  },
  changelog: {
    title: 'Changelog: New Features and Fixes | Senchabot Extensions',
    description:
      'Every feature and fix in Senchabot Extensions since the April 2026 launch, newest first, for Chat Box, Emote Wall, Sub Sprout, Raffle and OBS Bridge.',
  },
} as const satisfies Record<string, PageMeta>;
