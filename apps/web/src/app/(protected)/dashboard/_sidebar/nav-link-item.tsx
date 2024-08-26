import Link, { type LinkProps } from 'next/link'

import { cn } from '@/lib/utils'

interface Props
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    LinkProps {}

export function NavLinkItem({ className, ...props }: Props) {
  return (
    <Link
      className={cn(
        'inline-flex h-9 w-full items-center space-x-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
