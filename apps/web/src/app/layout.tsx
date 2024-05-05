import type { Metadata, Viewport } from 'next'

import { GeistSans } from 'geist/font/sans'

import { ThemeProvider } from '@/components/theme-provider'

import { cn } from '@/lib/utils'

import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://localhost:3000'),
  title: {
    default: 'Senchabot',
    template: `%s - Senchabot`,
  },
  description: '',
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

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-sans antialiased', GeistSans.variable)}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
