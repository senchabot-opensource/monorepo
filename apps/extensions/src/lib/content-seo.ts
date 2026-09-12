import { SITE_URL } from '#/lib/i18n/seo';
import { pageUrl } from '#/lib/seo/head';

const SENCHABOT = {
  '@type': 'Organization',
  name: 'Senchabot',
  url: 'https://senchabot.com',
  logo: `${SITE_URL}/senchabot-logo.svg`,
};

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
