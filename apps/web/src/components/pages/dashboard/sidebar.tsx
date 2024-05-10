import Image from 'next/image'
import Link from 'next/link'

import { ThemeToggle } from '@/components/theme-toggle'

import { BottomNav } from './bottom-nav'
import { MainNav } from './main-nav'

export function Sidebar() {
  return (
    <section className="fixed inset-y-0 flex w-full max-w-64 shrink-0 grow flex-col space-y-8 overflow-y-auto border-r px-4 py-6">
      <Brand />
      <div className="flex grow flex-col gap-y-4">
        <MainNav />
        <BottomNav />
      </div>
    </section>
  )
}

function Brand() {
  return (
    <div className="flex w-full items-center justify-between space-x-2">
      <Link
        className="relative inline-flex cursor-pointer select-none items-center space-x-2 text-2xl font-medium tracking-wide transition-all hover:opacity-75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        href="/dashboard"
      >
        <div className="inline-flex size-8 shrink-0">
          <Image
            src="/senchabot-logo.svg"
            alt="Senchabot"
            width={32}
            height={32}
            unoptimized
          />
        </div>
        <span>Senchabot</span>
        <span className="absolute -top-3 right-0 inline-flex text-xs font-light uppercase text-muted-foreground">
          Beta
        </span>
      </Link>
      <ThemeToggle className="size-8 text-muted-foreground" />
    </div>
  )
}
