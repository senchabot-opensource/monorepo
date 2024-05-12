import createJiti from 'jiti'
import { fileURLToPath } from 'node:url'

const jiti = createJiti(fileURLToPath(import.meta.url))

// Validate env during build.
jiti('./src/env')

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/docs',
        destination: 'https://docs.senchabot.app',
        permanent: true,
      },
      {
        source: '/discord',
        destination: 'https://discord.gg/senchabot',
        permanent: true,
      },
      // Dashboard
      {
        source: '/dashboard/settings',
        destination: '/dashboard/settings/profile',
        permanent: true,
      },
      {
        source: '/dashboard/:platform/:id/commands',
        destination: '/dashboard/:platform/:id/commands/custom',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
