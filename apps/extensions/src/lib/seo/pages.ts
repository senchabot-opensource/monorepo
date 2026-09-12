import { GUIDES_PATH, GUIDES_PUBLISHED, type GuideEntry } from '#/lib/guides';
import { type TranslationKey, translate } from '#/lib/i18n';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getWidget, type WidgetId } from '#/lib/widgets';
import { getPageHead, type PageMeta } from './head';
import {
  type GraphPage,
  getAppNode,
  getArticleNode,
  getPageGraph,
  type PageGraphOptions,
} from './structured-data';

/** Meta for the home page, the setup pages and the 404. Guides keep theirs in lib/guides. */
export const PAGE_META = {
  home: {
    title: 'Free Twitch & Kick Overlays for OBS | Senchabot Extensions',
    description:
      'Five free tools for Twitch and Kick streamers: Chat Box, Emote Wall, Sub Sprout, Raffle and OBS Bridge. Set one up, copy its URL and add it to OBS. No login.',
  },
  'chat-box': {
    title: 'Twitch + Kick Chat Overlay for OBS (Free) | Senchabot',
    description:
      'Merge Twitch and Kick chat into one OBS browser source (400×600). 7TV emotes on both platforms, BTTV and FFZ on Twitch, plus filters for bots and ! commands.',
  },
  'emote-wall': {
    title: 'Emote Wall Overlay for Twitch, Kick & 7TV | Senchabot',
    description:
      'Emote-only Twitch and Kick messages pop up on your stream in Calm, Chaos or Bounce mode, 7TV emotes from your Twitch channel included. Free, no login needed.',
  },
  'sub-sprout': {
    title: 'Sub Sprout: Sub Goal Plant Overlay for Twitch & Kick',
    description:
      'A plant overlay that grows one stage with every new sub, resub or gifted sub on Twitch and Kick. Pick one of 10 plants and add rain or sparkles. Free, no login.',
  },
  raffle: {
    title: 'Twitch & Kick Chat Giveaway Picker (Free) | Senchabot',
    description:
      'Run a chat giveaway on Twitch or Kick: viewers type !join, you set subs-only rules and a win limit, then draw a winner with a secure random pick. No login.',
  },
  'obs-bridge': {
    title: 'Switch OBS Scenes from Twitch & Kick Chat | Senchabot',
    description:
      'Let mods switch OBS scenes from Twitch or Kick chat with !scene, brb and back, or start and stop the stream. Runs in a browser tab and talks to obs-websocket 5.',
  },
  notFound: {
    title: 'Page Not Found | Senchabot Extensions',
    description:
      "This page doesn't exist on Senchabot Extensions. Pick one of the free Twitch and Kick widgets, like Chat Box or Emote Wall, or go back to the home page.",
  },
} as const satisfies Record<WidgetId | 'home' | 'notFound', PageMeta>;

/** featureList of each setup page's WebApplication: facts the page itself shows. */
export const APP_FEATURES: Record<WidgetId, readonly string[]> = {
  'chat-box': [
    'Twitch and Kick chat merged into one overlay',
    '7TV emotes on Twitch and Kick, BTTV and FFZ emotes on Twitch',
    'Hides known bots and messages that start with !',
    'Messages stay 10 seconds to 5 minutes, or forever',
    'Highlights for mentions, replies, first-time chatters, announcements and Highlight My Message',
    'Four message layouts, eight entry animations and six fonts',
    'Vertical or horizontal orientation',
    'Recommended browser source size: 400x600',
  ],
  'emote-wall': [
    'Emote-only Twitch and Kick messages appear as emotes on screen',
    'Show All Emotes also picks up to 5 emotes out of normal messages',
    "7TV emotes from the Twitch channel's active set, in Kick chat too",
    'Calm, Chaos and Bounce animation modes',
    'Emote size 32 to 256 px, 2 to 30 seconds on screen, up to 120 at once',
    'Subscribers only, longer sub emotes, Hype Mode and emote spam blocking',
    'Recommended browser source size: 1920x1080',
  ],
  'sub-sprout': [
    'Grows one stage with every new sub, resub or gifted sub on Twitch and Kick',
    '10 plant varieties',
    'After full growth: the same plant, the next one in order, or a random one',
    'Rain or sparkle watering effect',
    'Optional sub count and stage label on the pot',
    'The broadcaster and mods can type !grow to grow it by hand',
    'Recommended browser source size: 800x600',
  ],
  raffle: [
    'Viewers enter by typing a keyword in chat, !join by default',
    'Runs on Twitch or Kick, one platform per raffle',
    'Subscribers only, with a minimum number of sub months',
    'Max wins per viewer from 1 to 5, or unlimited',
    'Minimum time before the draw, 0 to 300 seconds',
    'Known bots are skipped',
    'Winner overlay with confetti, as a 1920x1080 browser source in the same browser or app',
  ],
  'obs-bridge': [
    'Switch OBS scenes from Twitch or Kick chat with !scene and a scene name',
    'brb and back switch to the BRB and Main scenes',
    'Start and stop the stream and the recording from chat',
    'Only authorized users, each tied to a platform, can run commands',
    'Every command can be renamed',
    'Connects to obs-websocket 5 (OBS Studio 28 and later), ws://127.0.0.1:4455 by default',
    'Runs in a browser tab or an OBS Custom Browser Dock',
  ],
};

/** getPageHead plus the page's JSON-LD graph, for every indexable page. */
export function getSeoHead(
  page: GraphPage & { ogType?: 'website' | 'article' },
  graph: PageGraphOptions = {},
) {
  return getPageHead({ ...page, jsonLd: [getPageGraph(page, graph)] });
}

/** A setup page: its app as the main entity, Home > setup page, and the FAQ it shows. */
export function getSetupPageHead(
  id: WidgetId,
  { breadcrumb, faq }: { breadcrumb: TranslationKey; faq: readonly FaqEntry[] },
) {
  const widget = getWidget(id);
  return getSeoHead(
    { path: widget.setupPath, meta: PAGE_META[id], image: id },
    {
      breadcrumbs: [{ name: translate('en', breadcrumb) }],
      faq,
      mainEntity: getAppNode({
        path: widget.setupPath,
        name: translate('en', widget.nameKey),
        description: translate('en', widget.taglineKey),
        image: id,
        features: APP_FEATURES[id],
      }),
    },
  );
}

/** A guide: an Article under Home > Guides > guide. */
export function getGuideHead(guide: GuideEntry) {
  return getSeoHead(
    { path: guide.path, meta: guide.meta, image: 'guides', ogType: 'article' },
    {
      breadcrumbs: [
        { name: translate('en', 'guides.breadcrumb'), path: GUIDES_PATH },
        { name: translate('en', guide.shortKey) },
      ],
      mainEntity: getArticleNode({
        path: guide.path,
        headline: translate('en', guide.titleKey),
        description: guide.meta.description,
        datePublished: GUIDES_PUBLISHED,
      }),
    },
  );
}
