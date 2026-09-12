export const LOCALES = ['en', 'tr'] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_LABELS: Record<Locale, string> = { en: 'EN', tr: 'TR' };
export const DEFAULT_LOCALE: Locale = 'en';
export const LANG_PARAM = 'lang';

export function isValidLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
