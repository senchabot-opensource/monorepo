import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';

import appCss from '../styles.css?url';

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
        content: '#000000',
      },
      {
        title: 'Senchabot Extensions — Free Customizable Stream Overlays, Browser Sources & Stream Tools',
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
        <HeadContent />
      </head>
      <body className="font-sans antialiased bg-zinc-950 text-zinc-100 min-h-screen">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
