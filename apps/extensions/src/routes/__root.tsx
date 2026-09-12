import { createRootRoute, HeadContent, Scripts, useLocation } from '@tanstack/react-router';

import { LocaleLink } from '#/components/locale-link';
import { SiteLayout } from '#/components/site-layout';
import { BUTTON_PRIMARY } from '#/components/ui/button-styles';
import { WidgetCrossLinks } from '#/components/widget-cross-links';
import { LocaleProvider, useI18n } from '#/lib/i18n';
import { DEFAULT_LOCALE } from '#/lib/i18n/locales';
import { getPathLocale, isAppPath } from '#/lib/i18n/paths';
import { getPageHead, ROBOTS_INDEX, ROBOTS_NOINDEX, SITE_META, SITE_NAME } from '#/lib/seo/head';
import { PAGE_META } from '#/lib/seo/pages';
import { isOverlayPath, ThemeProvider } from '#/lib/theme';

import appCss from '../styles.css?url';

// Runs before first paint to avoid a flash of the wrong theme/language. Only overlays and tools
// take the language from ?lang= or storage; site pages render theirs from the path.
// Skips the theme on overlays (see isOverlayPath in lib/theme).
const themeInitScript = `(function(){try{var el=document.documentElement;var p=location.pathname;if(p.indexOf("/widgets/")===0||p.indexOf("/tools/")===0){var l=new URLSearchParams(location.search).get("lang")||localStorage.getItem("lang");if(l)el.lang=l}if(p.indexOf("/widgets/")===0)return;var t=localStorage.getItem("theme");var d=t?t==="dark":!window.matchMedia||window.matchMedia("(prefers-color-scheme: dark)").matches;el.classList.toggle("dark",d);el.style.colorScheme=d?"dark":"light";var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",d?"#09090b":"#fafafa")}catch(e){}})();`;

// Overlays run inside streamers' OBS scenes: they keep their old font and never download Geist.
const isWidgetPath = isOverlayPath;

// Geist is variable, so one 400..800 range (the weights the site uses) serves one file per subset.
const geistLinks = [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400..800&display=swap',
  },
];

export const Route = createRootRoute({
  // Root head sees every match, so this is the one place that can skip Geist for all widget routes.
  // Its title, robots and 404 tags are fallbacks: a page's own getPageHead tags replace them.
  head: ({ matches }) => {
    const isNotFound = matches.some((match) => match._notFound || match.status === 'notFound');
    const isAppPage = matches.some((match) => isAppPath(match.pathname));
    // A 404 under /tr still matches the locale route, so its deepest match carries the prefix.
    const locale = getPathLocale(matches[matches.length - 1]?.pathname ?? '/');
    const page = isNotFound
      ? getPageHead({ locale, meta: PAGE_META.notFound[locale], image: 'guides', noindex: true })
          .meta
      : [
          { title: SITE_NAME },
          { name: 'robots', content: isAppPage ? ROBOTS_NOINDEX : ROBOTS_INDEX },
        ];
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#09090b' },
        ...SITE_META,
        ...page,
      ],
      links: [
        {
          rel: 'stylesheet',
          href: appCss,
        },
        ...(matches.some((match) => isWidgetPath(match.pathname)) ? [] : geistLinks),
        {
          rel: 'icon',
          href: '/favicon.ico',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/senchabot-logo.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        {
          rel: 'manifest',
          href: '/manifest.json',
        },
      ],
    };
  },
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function NotFound() {
  const { t } = useI18n();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">404</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            {t('common.notFound.title')}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t('common.notFound.text')}
          </p>
        </div>
        <div className="mt-12">
          <WidgetCrossLinks columns={3} />
        </div>
        <div className="mt-10 text-center">
          <LocaleLink to="/" className={BUTTON_PRIMARY}>
            {t('common.notFound.home')}
          </LocaleLink>
        </div>
      </div>
    </SiteLayout>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const isWidget = isWidgetPath(pathname);
  const lang = isAppPath(pathname) ? DEFAULT_LOCALE : getPathLocale(pathname);

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: inline bootstrap script must run before first paint */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body className={`${isWidget ? 'font-widget' : 'font-sans'} antialiased min-h-screen`}>
        <ThemeProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
