import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';

import { SettingsControls } from '#/components/settings-controls';
import { LocaleProvider } from '#/lib/i18n';
import { ThemeProvider } from '#/lib/theme';

import appCss from '../styles.css?url';

// Runs before first paint to avoid a flash of the wrong theme/language.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":!window.matchMedia||window.matchMedia("(prefers-color-scheme: dark)").matches;var el=document.documentElement;el.classList.toggle("dark",d);el.style.colorScheme=d?"dark":"light";var l=new URLSearchParams(location.search).get("lang")||localStorage.getItem("lang");if(l)el.lang=l;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",d?"#09090b":"#fafafa")}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
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
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: inline bootstrap script must run before first paint */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider>
          <LocaleProvider>
            {children}
            <SettingsControls />
          </LocaleProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
