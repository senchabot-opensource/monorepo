import type { TranslationKey } from './index';

export const SITE_URL = 'https://extensions.senchabot.com';

interface LocaleLink {
  rel: string;
  href: string;
  hrefLang?: string;
}

/**
 * Self-referencing canonical plus hreflang alternates for language variants.
 * No `tr` alternate yet: Turkish is client-side only (`?lang=`) and the server always
 * renders English, so crawlers would never see it. Add it once real `/tr/...` URLs exist.
 */
export function getLocaleLinks(path: string): LocaleLink[] {
  const url = path === '/' || path === '' ? SITE_URL : `${SITE_URL}${path}`;
  return [
    { rel: 'canonical', href: url },
    { rel: 'alternate', hrefLang: 'en', href: url },
    { rel: 'alternate', hrefLang: 'x-default', href: url },
  ];
}

/** A visible FAQ entry as [question key, answer key]. */
export type FaqEntry = readonly [question: TranslationKey, answer: TranslationKey];
