import { createFileRoute } from '@tanstack/react-router';
import { DEFAULT_LOCALE, isValidLocale, type Locale } from '#/lib/i18n/locales';

type PrefixLocale = Exclude<Locale, typeof DEFAULT_LOCALE>;

// English pages have no prefix. Returning false for any other first segment makes the route
// skip it while matching, so `/faq` never reads as the locale "faq" and `/en/...` is a 404.
export const Route = createFileRoute('/{-$locale}')({
  params: {
    parse: ({ locale }) =>
      locale === undefined || (isValidLocale(locale) && locale !== DEFAULT_LOCALE)
        ? { locale: locale as PrefixLocale | undefined }
        : false,
  },
});
