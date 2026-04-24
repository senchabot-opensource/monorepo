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
        title: 'Extensions - Senchabot',
      },
      {
        name: 'description',
        content:
          'Free, open-source streaming widgets for Twitch and Kick. Configure Sub Sprout, Universal Chat, and Raffle overlays for OBS.',
      },
      {
        property: 'og:site_name',
        content: 'Senchabot Extensions',
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
      <body className="font-sans antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
