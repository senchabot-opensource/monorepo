import type { TranslationKey } from './index';
import { DEFAULT_LOCALE, type Locale, LOCALES } from './locales';
import { localizePath } from './paths';

export const SITE_URL = 'https://extensions.senchabot.com';

/** Absolute URL of a site path in `locale`; the English home page is the bare origin. */
export function siteUrl(path: string, locale: Locale = DEFAULT_LOCALE): string {
  const localized = localizePath(path, locale);
  return localized === '/' || localized === '' ? SITE_URL : `${SITE_URL}${localized}`;
}

interface LocaleLink {
  rel: string;
  href: string;
  hrefLang?: string;
}

/**
 * The page's self-referencing canonical in its own language, plus hreflang alternates for every
 * language and x-default (English). Both versions of a page list the same alternates, so each
 * points back at the other.
 */
export function getLocaleLinks(path: string, locale: Locale): LocaleLink[] {
  return [
    { rel: 'canonical', href: siteUrl(path, locale) },
    ...LOCALES.map((hrefLang) => ({ rel: 'alternate', hrefLang, href: siteUrl(path, hrefLang) })),
    { rel: 'alternate', hrefLang: 'x-default', href: siteUrl(path, DEFAULT_LOCALE) },
  ];
}

/** A visible FAQ entry as [question key, answer key]. */
export type FaqEntry = readonly [question: TranslationKey, answer: TranslationKey];
