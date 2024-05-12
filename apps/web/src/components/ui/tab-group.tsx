'use client'

import Link, { type LinkProps } from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

import { cn } from '@/lib/utils'

function TabGroup({ ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <nav className="flex space-x-4 border-b" {...props} />
}

function TabGroupItem({
  slug,
  ...props
}: {
  slug: string
} & React.AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkProps) {
  const segment = useSelectedLayoutSegment()
  const isActive = segment === slug

  return (
    <Link
      className={cn(
        'relative inline-flex h-9 select-none flex-nowrap items-center pb-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        isActive &&
          'text-foreground after:absolute after:-bottom-0.5 after:w-full after:border-b-2',
      )}
      {...props}
    />
  )
}

export { TabGroup, TabGroupItem }
