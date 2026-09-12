import type { JSX } from 'react';
import { getLocaleLinks, SITE_URL } from '#/lib/i18n/seo';

type MetaTag = JSX.IntrinsicElements['meta'];

export const SITE_NAME = 'Senchabot Extensions';
/** The X account the site footer links to. */
export const X_HANDLE = '@senchabot';

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 160;

/** `<title>` and meta description, in English: the server always renders English. */
export interface PageMeta {
  title: string;
  description: string;
}

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export const OG_IMAGES = {
  home: {
    path: '/og/home.png',
    alt: 'Senchabot Extensions, free Twitch and Kick overlays for OBS',
  },
  'chat-box': { path: '/og/chat-box.png', alt: 'Chat Box, a Twitch and Kick chat overlay' },
  'emote-wall': {
    path: '/og/emote-wall.png',
    alt: 'Emote Wall, an emote overlay for Twitch and Kick',
  },
  'sub-sprout': {
    path: '/og/sub-sprout.png',
    alt: 'Sub Sprout, a plant overlay that grows with subs',
  },
  raffle: { path: '/og/raffle.png', alt: 'Raffle, a chat giveaway picker for Twitch and Kick' },
  'obs-bridge': { path: '/og/obs-bridge.png', alt: 'OBS Bridge, switch OBS scenes from chat' },
  guides: { path: '/og/guides.png', alt: 'Senchabot Extensions guides for OBS overlays' },
} as const satisfies Record<string, { path: string; alt: string }>;

export type OgImage = keyof typeof OG_IMAGES;

export const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1';
export const ROBOTS_NOINDEX = 'noindex, follow';

export const pageUrl = (path: string) =>
  path === '/' || path === '' ? SITE_URL : `${SITE_URL}${path}`;
export const ogImageUrl = (image: OgImage) => `${SITE_URL}${OG_IMAGES[image].path}`;

/** Tags every page shares; the root route sets them once. */
export const SITE_META: MetaTag[] = [
  { property: 'og:site_name', content: SITE_NAME },
  { property: 'og:locale', content: 'en_US' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:site', content: X_HANDLE },
];

export interface PageHeadOptions {
  /** Site path; omit it for a page without a URL of its own, like the 404. */
  path?: string;
  meta: PageMeta;
  image: OgImage;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: readonly Record<string, unknown>[];
}

/**
 * Title, description, robots, Open Graph, Twitter and JSON-LD tags plus canonical and hreflang
 * links for one page. TanStack keeps the deepest route's tag per name/property, so these replace
 * the root route's fallbacks instead of adding a second copy.
 */
export function getPageHead({
  path,
  meta,
  image,
  ogType = 'website',
  noindex = false,
  jsonLd = [],
}: PageHeadOptions) {
  const imageUrl = ogImageUrl(image);
  const { alt } = OG_IMAGES[image];
  const tags: MetaTag[] = [
    { title: meta.title },
    { name: 'description', content: meta.description },
    { name: 'robots', content: noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX },
    { property: 'og:type', content: ogType },
    { property: 'og:title', content: meta.title },
    { property: 'og:description', content: meta.description },
    ...(path === undefined ? [] : [{ property: 'og:url', content: pageUrl(path) }]),
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:width', content: String(OG_IMAGE_SIZE.width) },
    { property: 'og:image:height', content: String(OG_IMAGE_SIZE.height) },
    { property: 'og:image:alt', content: alt },
    { name: 'twitter:title', content: meta.title },
    { name: 'twitter:description', content: meta.description },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:image:alt', content: alt },
    // TanStack renders `script:ld+json` entries as JSON-LD scripts; React's meta type doesn't know
    // the key, so it goes in through a cast.
    ...jsonLd.map((data) => ({ 'script:ld+json': data }) as unknown as MetaTag),
  ];
  return { meta: tags, links: path === undefined || noindex ? [] : getLocaleLinks(path) };
}
