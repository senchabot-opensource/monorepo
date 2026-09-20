import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

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
      pages: [
        { path: '/' },
        { path: '/setup/sub-growing-plant' },
        { path: '/setup/subathon-timer' },
        { path: '/setup/stream-alerts' },
        { path: '/setup/sub-goal' },
        { path: '/setup/stream-frames' },
        { path: '/setup/chat-poll' },
        { path: '/setup/chat-widget' },
        { path: '/setup/raffle' },
        { path: '/setup/obs-bridge' },
        { path: '/setup/emote-wall' },
        { path: '/guides' },
        { path: '/guides/obs-browser-source' },
        { path: '/guides/twitch-kick-chat-overlay' },
        { path: '/guides/chat-giveaway' },
        { path: '/guides/obs-scene-switcher' },
        { path: '/guides/obs-chat-dock' },
        { path: '/guides/stream-alerts' },
        { path: '/guides/subathon-timer' },
        { path: '/guides/chat-poll' },
        { path: '/guides/stream-frames' },
        { path: '/presets' },
        { path: '/faq' },
        { path: '/changelog' },
        { path: '/tr' },
        { path: '/tr/setup/sub-growing-plant' },
        { path: '/tr/setup/subathon-timer' },
        { path: '/tr/setup/stream-alerts' },
        { path: '/tr/setup/sub-goal' },
        { path: '/tr/setup/stream-frames' },
        { path: '/tr/setup/chat-poll' },
        { path: '/tr/setup/chat-widget' },
        { path: '/tr/setup/raffle' },
        { path: '/tr/setup/obs-bridge' },
        { path: '/tr/setup/emote-wall' },
        { path: '/tr/guides' },
        { path: '/tr/guides/obs-browser-source' },
        { path: '/tr/guides/twitch-kick-chat-overlay' },
        { path: '/tr/guides/chat-giveaway' },
        { path: '/tr/guides/obs-scene-switcher' },
        { path: '/tr/guides/obs-chat-dock' },
        { path: '/tr/guides/stream-alerts' },
        { path: '/tr/guides/subathon-timer' },
        { path: '/tr/guides/chat-poll' },
        { path: '/tr/guides/stream-frames' },
        { path: '/tr/presets' },
        { path: '/tr/faq' },
        { path: '/tr/changelog' },
      ],
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
