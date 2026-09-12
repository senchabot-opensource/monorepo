import { translate } from '#/lib/i18n';
import { type FaqEntry, SITE_URL } from '#/lib/i18n/seo';
import { LINKS } from '#/lib/links';
import { OG_IMAGE_SIZE, type OgImage, ogImageUrl, type PageMeta, pageUrl, SITE_NAME } from './head';

type JsonLdNode = Record<string, unknown>;

export const ORGANIZATION_ID = 'https://senchabot.com/#organization';
export const WEBSITE_ID = `${SITE_URL}/#website`;

const ORGANIZATION: JsonLdNode = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'Senchabot',
  url: LINKS.senchabot,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/senchabot-logo.svg` },
  description:
    'Senchabot is an open source, multi-platform community bot for Twitch, Discord, Kick and YouTube.',
  sameAs: [
    'https://github.com/senchabot-opensource',
    LINKS.x,
    LINKS.instagram,
    LINKS.youtube,
    LINKS.reddit,
  ],
};

const WEBSITE: JsonLdNode = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description:
    'Free, open source overlays and stream tools for Twitch and Kick, made by Senchabot. No login.',
  inLanguage: 'en',
  publisher: { '@id': ORGANIZATION_ID },
};

const ref = (id: string) => ({ '@id': id });

export interface GraphPage {
  path: string;
  meta: PageMeta;
  image: OgImage;
}

export interface Crumb {
  name: string;
  /** Omit on the last crumb: it is the page itself. */
  path?: string;
}

export interface PageGraphOptions {
  /** The trail after Home. Omit on the home page. */
  breadcrumbs?: readonly Crumb[];
  /** The FAQ the page shows, in its visible order; never pass one the page doesn't render. */
  faq?: readonly FaqEntry[];
  /** What the page is about: its app, article or list, with an `@id`. */
  mainEntity?: JsonLdNode;
}

const imageObject = (image: OgImage) => ({
  '@type': 'ImageObject',
  url: ogImageUrl(image),
  width: OG_IMAGE_SIZE.width,
  height: OG_IMAGE_SIZE.height,
});

/** FAQPage built from the same keys the page renders, in English like the prerendered HTML. */
export function getFaqNode(path: string, entries: readonly FaqEntry[]): JsonLdNode {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl(path)}#faq`,
    isPartOf: ref(`${pageUrl(path)}#webpage`),
    mainEntity: entries.map(([question, answer]) => ({
      '@type': 'Question',
      name: translate('en', question),
      acceptedAnswer: { '@type': 'Answer', text: translate('en', answer) },
    })),
  };
}

/**
 * One JSON-LD `@graph` per page: Senchabot as the Organization every node's publisher points to,
 * the WebSite, the WebPage, and the page's breadcrumb, main entity and FAQ when it has them.
 */
export function getPageGraph(page: GraphPage, options: PageGraphOptions = {}) {
  const { breadcrumbs, faq, mainEntity } = options;
  const url = pageUrl(page.path);
  const webPage: JsonLdNode = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.meta.title,
    description: page.meta.description,
    inLanguage: 'en',
    isPartOf: ref(WEBSITE_ID),
    publisher: ref(ORGANIZATION_ID),
    primaryImageOfPage: imageObject(page.image),
  };
  const nodes: JsonLdNode[] = [ORGANIZATION, WEBSITE, webPage];

  if (breadcrumbs?.length) {
    const trail: Crumb[] = [{ name: translate('en', 'common.home'), path: '/' }, ...breadcrumbs];
    webPage.breadcrumb = ref(`${url}#breadcrumb`);
    nodes.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: trail.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: pageUrl(crumb.path ?? page.path),
      })),
    });
  }
  if (mainEntity) {
    webPage.mainEntity = ref(String(mainEntity['@id']));
    nodes.push(mainEntity);
  }
  if (faq?.length) {
    const faqNode = getFaqNode(page.path, faq);
    webPage.mainEntity ??= ref(String(faqNode['@id']));
    nodes.push(faqNode);
  }

  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** A setup page's widget or tool: free, runs in a browser, so any desktop OS. */
export function getAppNode({
  path,
  name,
  description,
  image,
  features,
}: {
  path: string;
  name: string;
  description: string;
  image: OgImage;
  /** Facts the page shows, one per entry. */
  features: readonly string[];
}): JsonLdNode {
  const url = pageUrl(path);
  return {
    '@type': 'WebApplication',
    '@id': `${url}#app`,
    name,
    url,
    description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Windows, macOS, Linux',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: features,
    image: ogImageUrl(image),
    screenshot: ogImageUrl(image),
    license: LINKS.license,
    publisher: ref(ORGANIZATION_ID),
  };
}

export function getArticleNode({
  path,
  headline,
  description,
  datePublished,
}: {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
}): JsonLdNode {
  const url = pageUrl(path);
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline,
    description,
    url,
    mainEntityOfPage: ref(`${url}#webpage`),
    image: ogImageUrl('guides'),
    inLanguage: 'en',
    datePublished,
    dateModified: datePublished,
    author: ref(ORGANIZATION_ID),
    publisher: ref(ORGANIZATION_ID),
  };
}

export function getItemListNode({
  id,
  name,
  items,
}: {
  /** Fragment id, e.g. `${url}#widgets`. */
  id: string;
  name: string;
  items: readonly { name: string; path: string; description?: string }[];
}): JsonLdNode {
  return {
    '@type': 'ItemList',
    '@id': id,
    name,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: pageUrl(item.path),
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}
