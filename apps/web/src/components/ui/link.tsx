import NextLink, { type LinkProps } from 'next/link'

import { cn } from '@/lib/utils'

function Link({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps) {
  return (
    <NextLink
      className={cn(
        'font-semibold transition-all hover:text-foreground',
        className,
      )}
      {...props}
    />
  )
}

export { Link }
