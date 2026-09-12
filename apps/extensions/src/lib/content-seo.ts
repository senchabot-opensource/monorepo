import type { JSX } from 'react';
import type { PageMeta } from '#/lib/guides';
import { getLocaleLinks, SITE_URL } from '#/lib/i18n/seo';

type MetaTag = JSX.IntrinsicElements['meta'];

const SENCHABOT = {
  '@type': 'Organization',
  name: 'Senchabot',
  url: 'https://senchabot.com',
  logo: `${SITE_URL}/senchabot-logo.svg`,
};

export const pageUrl = (path: string) => (path === '/' ? SITE_URL : `${SITE_URL}${path}`);

/** Title, description, Open Graph, Twitter, JSON-LD and canonical links for a content page. */
export function getContentHead({
  path,
  meta,
  ogType = 'website',
  jsonLd = [],
}: {
  path: string;
  meta: PageMeta;
  ogType?: 'website' | 'article';
  jsonLd?: readonly Record<string, unknown>[];
}) {
  const tags: MetaTag[] = [
    { title: meta.title },
    { name: 'description', content: meta.description },
    { property: 'og:title', content: meta.title },
    { property: 'og:description', content: meta.description },
    { property: 'og:type', content: ogType },
    { property: 'og:url', content: pageUrl(path) },
    { name: 'twitter:title', content: meta.title },
    { name: 'twitter:description', content: meta.description },
    // TanStack renders `script:ld+json` entries as JSON-LD scripts; React's meta type doesn't know
    // the key, so it goes in through a cast.
    ...jsonLd.map((data) => ({ 'script:ld+json': data }) as unknown as MetaTag),
  ];
  return { meta: tags, links: getLocaleLinks(path) };
}

export function getArticleJsonLd({
  path,
  headline,
  description,
  datePublished,
}: {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: pageUrl(path),
    mainEntityOfPage: pageUrl(path),
    inLanguage: 'en',
    datePublished,
    dateModified: datePublished,
    author: SENCHABOT,
    publisher: SENCHABOT,
  };
}
