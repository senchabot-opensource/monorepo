import { type TranslationKey, translate } from './index';

export const SITE_URL = 'https://extensions.senchabot.com';

interface LocaleLink {
  rel: string;
  href: string;
  hreflang?: string;
}

/**
 * Self-referencing canonical plus hreflang alternates for language variants.
 * Language variants are served via the `?lang=` query param (client-side).
 */
export function getLocaleLinks(path: string): LocaleLink[] {
  const url = path === '/' || path === '' ? SITE_URL : `${SITE_URL}${path}`;
  return [
    { rel: 'canonical', href: url },
    { rel: 'alternate', hreflang: 'en', href: url },
    { rel: 'alternate', hreflang: 'tr', href: `${url}?lang=tr` },
    { rel: 'alternate', hreflang: 'x-default', href: url },
  ];
}

/** A visible FAQ entry as [question key, answer key]. */
export type FaqEntry = readonly [question: TranslationKey, answer: TranslationKey];

/**
 * FAQPage JSON-LD built from the same keys the page renders, so the markup always
 * mirrors the visible Q&A. English, because that is what the prerendered HTML serves.
 */
export function getFaqJsonLd(entries: readonly FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map(([question, answer]) => ({
      '@type': 'Question',
      name: translate('en', question),
      acceptedAnswer: { '@type': 'Answer', text: translate('en', answer) },
    })),
  };
}
