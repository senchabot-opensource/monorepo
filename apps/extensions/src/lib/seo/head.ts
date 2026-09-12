import type { JSX } from 'react';
import { DEFAULT_LOCALE, type Locale, LOCALES } from '#/lib/i18n/locales';
import { getLocaleLinks, SITE_URL, siteUrl } from '#/lib/i18n/seo';

type MetaTag = JSX.IntrinsicElements['meta'];

export const SITE_NAME = 'Senchabot Extensions';
/** The X account the site footer links to. */
export const X_HANDLE = '@senchabot';

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 160;

/** `<title>` and meta description, in the page's language. */
export interface PageMeta {
  title: string;
  description: string;
}

/** A page's meta in every language, side by side so a change to one is easy to mirror. */
export type LocalizedMeta = Record<Locale, PageMeta>;

export const OG_LOCALES: Record<Locale, string> = { en: 'en_US', tr: 'tr_TR' };

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

// The images are in English on both versions of a page; only their alt text is translated.
export const OG_IMAGES = {
  home: {
    path: '/og/home.png',
    alt: {
      en: 'Senchabot Extensions, free Twitch and Kick overlays for OBS',
      tr: "Senchabot Extensions, OBS için ücretsiz Twitch ve Kick overlay'leri",
    },
  },
  'chat-box': {
    path: '/og/chat-box.png',
    alt: {
      en: 'Chat Box, a Twitch and Kick chat overlay',
      tr: "Sohbet Kutusu, Twitch ve Kick sohbet overlay'i",
    },
  },
  'emote-wall': {
    path: '/og/emote-wall.png',
    alt: {
      en: 'Emote Wall, an emote overlay for Twitch and Kick',
      tr: "Emote Duvarı, Twitch ve Kick için emote overlay'i",
    },
  },
  'sub-sprout': {
    path: '/og/sub-sprout.png',
    alt: {
      en: 'Sub Sprout, a plant overlay that grows with subs',
      tr: "Sub Sprout, aboneliklerle büyüyen bitki overlay'i",
    },
  },
  raffle: {
    path: '/og/raffle.png',
    alt: {
      en: 'Raffle, a chat giveaway picker for Twitch and Kick',
      tr: 'Çekiliş, Twitch ve Kick için sohbet çekilişi aracı',
    },
  },
  'obs-bridge': {
    path: '/og/obs-bridge.png',
    alt: {
      en: 'OBS Bridge, switch OBS scenes from chat',
      tr: 'OBS Bridge, sohbetten OBS sahnesi değiştirme aracı',
    },
  },
  guides: {
    path: '/og/guides.png',
    alt: {
      en: 'Senchabot Extensions guides for OBS overlays',
      tr: "OBS overlay'leri için Senchabot Extensions rehberleri",
    },
  },
} as const satisfies Record<string, { path: string; alt: Record<Locale, string> }>;

export type OgImage = keyof typeof OG_IMAGES;

export const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1';
export const ROBOTS_NOINDEX = 'noindex, follow';

/** Absolute URL of a site path, in English unless a locale is given. */
export const pageUrl = siteUrl;
export const ogImageUrl = (image: OgImage) => `${SITE_URL}${OG_IMAGES[image].path}`;

/** Tags every page shares; the root route sets them once. Pages replace og:locale with theirs. */
export const SITE_META: MetaTag[] = [
  { property: 'og:site_name', content: SITE_NAME },
  { property: 'og:locale', content: OG_LOCALES[DEFAULT_LOCALE] },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:site', content: X_HANDLE },
];

export interface PageHeadOptions {
  /** English site path; omit it for a page without a URL of its own, like the 404. */
  path?: string;
  /** The page's language: picks the localized URL, og:locale and image alt. */
  locale: Locale;
  meta: PageMeta;
  image: OgImage;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: readonly Record<string, unknown>[];
}

/**
 * Title, description, robots, Open Graph, Twitter and JSON-LD tags plus canonical and hreflang
 * links for one page. TanStack keeps the deepest route's tag per name/property, so these replace
 * the root route's fallbacks instead of adding a second copy. That also means one
 * og:locale:alternate per page, which is all two languages need.
 */
export function getPageHead({
  path,
  locale,
  meta,
  image,
  ogType = 'website',
  noindex = false,
  jsonLd = [],
}: PageHeadOptions) {
  const imageUrl = ogImageUrl(image);
  const alt = OG_IMAGES[image].alt[locale];
  const tags: MetaTag[] = [
    { title: meta.title },
    { name: 'description', content: meta.description },
    { name: 'robots', content: noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX },
    { property: 'og:type', content: ogType },
    { property: 'og:title', content: meta.title },
    { property: 'og:description', content: meta.description },
    ...(path === undefined ? [] : [{ property: 'og:url', content: pageUrl(path, locale) }]),
    { property: 'og:locale', content: OG_LOCALES[locale] },
    ...LOCALES.filter((other) => other !== locale).map((other) => ({
      property: 'og:locale:alternate',
      content: OG_LOCALES[other],
    })),
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
  return { meta: tags, links: path === undefined || noindex ? [] : getLocaleLinks(path, locale) };
}
