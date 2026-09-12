import { createRootRoute, HeadContent, Link, Scripts, useLocation } from '@tanstack/react-router';

import { SiteLayout } from '#/components/site-layout';
import { BUTTON_PRIMARY } from '#/components/ui/button-styles';
import { WidgetCrossLinks } from '#/components/widget-cross-links';
import { LocaleProvider, useI18n } from '#/lib/i18n';
import { ThemeProvider } from '#/lib/theme';

import appCss from '../styles.css?url';

// Runs before first paint to avoid a flash of the wrong theme/language.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":!window.matchMedia||window.matchMedia("(prefers-color-scheme: dark)").matches;var el=document.documentElement;el.classList.toggle("dark",d);el.style.colorScheme=d?"dark":"light";var l=new URLSearchParams(location.search).get("lang")||localStorage.getItem("lang");if(l)el.lang=l;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",d?"#09090b":"#fafafa")}catch(e){}})();`;

// Overlays run inside streamers' OBS scenes: they keep their old font and never download Geist.
const isWidgetPath = (pathname: string) => pathname.startsWith('/widgets/');

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
  head: ({ matches }) => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'theme-color',
        content: '#09090b',
      },
      {
        title:
          'Senchabot Extensions — Free Customizable Stream Overlays, Browser Sources & Stream Tools',
      },
      {
        name: 'description',
        content:
          '100% Free customizable stream overlays, multi-chat widgets, subscriber goal plants, transparent chat box overlays, and interactive stream tools for Twitch & Kick with zero login required. Works with OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, and any software supporting browser sources.',
      },
      {
        name: 'keywords',
        content:
          'customizable stream overlays, multi-chat widgets, subscriber goal plants, chat box, stream chat box, free streaming widgets, stream tools, obs studio, streamlabs desktop, xsplit broadcaster, vmix, lightstream, prism live studio, meld studio, twitch widgets free, kick widgets free, free obs overlays, senchabot extensions',
      },
      {
        property: 'og:site_name',
        content: 'Senchabot Extensions — Free Stream Overlays, Browser Sources & Stream Tools',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:image',
        content: 'https://extensions.senchabot.com/senchabot-logo.svg',
      },
      {
        name: 'twitter:card',
        content: 'summary',
      },
      {
        name: 'twitter:image',
        content: 'https://extensions.senchabot.com/senchabot-logo.svg',
      },
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
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),
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
          <Link to="/" className={BUTTON_PRIMARY}>
            {t('common.notFound.home')}
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const isWidget = useLocation({ select: (location) => isWidgetPath(location.pathname) });

  return (
    <html lang="en" suppressHydrationWarning>
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
