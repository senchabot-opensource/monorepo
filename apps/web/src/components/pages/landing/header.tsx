import Image from 'next/image'
import NextLink from 'next/link'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'

const navLinks = [
  {
    label: 'Documentation',
    path: '/docs',
    options: {
      target: '_blank',
      rel: 'noreferrer',
    },
  },
]

export function Header() {
  return (
    <header className="sticky inset-x-0 top-0 z-50 bg-background/50 backdrop-blur-xl">
      <nav className="mx-auto grid h-16 w-full max-w-screen-lg grid-cols-2 items-center px-4 md:grid-cols-3">
        <NextLink
          className="relative inline-flex w-fit cursor-pointer select-none items-center space-x-2 text-2xl font-medium tracking-wide transition-all hover:opacity-75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          href="/"
        >
          <div className="inline-flex size-8">
            <Image
              src="/senchabot-logo.svg"
              alt="Senchabot"
              width={32}
              height={32}
              unoptimized
            />
          </div>
          <span>Senchabot</span>
        </NextLink>
        <div className="hidden justify-center space-x-4 md:flex">
          {navLinks.map((item) => (
            <Link
              className="text-sm font-normal"
              href={item.path}
              key={item.path}
              {...item.options}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <ThemeToggle />
          <Button variant="secondary" asChild>
            <NextLink href="/signin">Sign in</NextLink>
          </Button>
        </div>
      </nav>
    </header>
  )
}
