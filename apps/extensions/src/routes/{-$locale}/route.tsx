import { createFileRoute, Outlet, redirect, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { DEFAULT_LOCALE, isValidLocale, type Locale } from '#/lib/i18n/locales';
import { getLangRedirect } from '#/lib/i18n/paths';

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
  // Old ?lang= links get a 301 to the page in that language when the server renders them.
  beforeLoad: ({ location }) => {
    const href = getLangRedirect(location.pathname, location.searchStr, location.hash);
    if (href) throw redirect({ href, statusCode: 301 });
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const router = useRouter();

  // Prerendered pages are static files that never reach the worker, and hydration reuses the
  // server's matches without running beforeLoad, so the redirect happens here instead.
  useEffect(() => {
    const { pathname, search, hash } = window.location;
    const href = getLangRedirect(pathname, search, hash.slice(1));
    if (href) router.navigate({ href, replace: true });
  }, [router]);

  return <Outlet />;
}
