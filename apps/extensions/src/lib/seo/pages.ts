import type { WidgetId } from '#/lib/widgets';
import type { PageMeta } from './head';

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
