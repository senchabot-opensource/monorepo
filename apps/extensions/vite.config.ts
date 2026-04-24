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
        { path: '/setup/chat-widget' },
        { path: '/setup/raffle' },
      ],
      sitemap: {
        enabled: true,
        host: 'https://extensions.senchabot.com',
        outputPath: 'sitemap.xml',
      },
    }),
    viteReact(),
  ],
});

export default config;
