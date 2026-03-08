import type { Metadata, Viewport } from 'next'

import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { GeistSans } from 'geist/font/sans'

import { ThemeProvider } from '@/components/theme-provider'

import { cn } from '@/lib/utils'

import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(`https://${process.env.VERCEL_URL}`),
  title: {
    default:
      'Senchabot - Free, Community Management Bot for Twitch, Discord, Kick, and YouTube',
    template: `%s - Senchabot`,
  },
  description:
    'One bot, four platforms. Manage Twitch, Discord, Kick, and YouTube communities with an open-source multi-platform bot.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-16x16.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID ?? 'G-0N948SR48C'
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-full scroll-smooth font-sans antialiased',
          GeistSans.variable,
        )}
      >
        <ThemeProvider>{children}</ThemeProvider>
        {gaId.startsWith('G-') && <GoogleAnalytics gaId={gaId} />}
        {gtmId?.startsWith('GTM-') && <GoogleTagManager gtmId={gtmId} />}
      </body>
    </html>
  )
}
