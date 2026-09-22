import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { LOCALES } from './src/lib/i18n/locales';
import { localizePath } from './src/lib/i18n/paths';

/** Every site page by its English path; each language prerenders it under its own prefix. */
const SITE_PAGES = [
  '/',
  '/setup/sub-growing-plant',
  '/setup/subathon-timer',
  '/setup/stream-alerts',
  '/setup/sub-goal',
  '/setup/stream-frames',
  '/setup/stream-countdown',
  '/setup/chat-poll',
  '/setup/chat-widget',
  '/setup/raffle',
  '/setup/obs-bridge',
  '/setup/emote-wall',
  '/setup/socials',
  '/guides',
  '/guides/obs-browser-source',
  '/guides/twitch-kick-chat-overlay',
  '/guides/chat-giveaway',
  '/guides/obs-scene-switcher',
  '/guides/obs-chat-dock',
  '/guides/stream-alerts',
  '/guides/subathon-timer',
  '/guides/chat-poll',
  '/guides/stream-countdown',
  '/guides/stream-frames',
  '/presets',
  '/faq',
  '/changelog',
];

const config = defineConfig({
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: false,
      },
      pages: LOCALES.flatMap((locale) =>
        SITE_PAGES.map((path) => ({ path: localizePath(path, locale) })),
      ),
      // public/sitemap.xml is the source of truth. The generated one overwrote it with an
      // invalid https:// xmlns and the build date as every page's lastmod.
      sitemap: {
        enabled: false,
      },
    }),
    viteReact(),
  ],
});

export default config;
