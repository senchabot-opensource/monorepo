export const LOCALES = ['en', 'de', 'es', 'fr', 'ja', 'pt', 'tr'] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  de: 'DE',
  es: 'ES',
  fr: 'FR',
  ja: 'JA',
  pt: 'PT',
  tr: 'TR',
};
/** Each language in its own words, for pickers that list them all. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  ja: '日本語',
  pt: 'Português',
  tr: 'Türkçe',
};
export const DEFAULT_LOCALE: Locale = 'en';
export const LANG_PARAM = 'lang';
/** localStorage key holding the language the visitor picked (or arrived in via a /tr link). */
export const LANG_STORAGE_KEY = 'lang';

export function isValidLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** The first browser language we support (`tr-TR` counts as `tr`), else the default. */
export function pickBrowserLocale(languages: readonly string[]): Locale {
  for (const tag of languages) {
    const base = tag?.slice(0, 2).toLowerCase();
    if (isValidLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}
