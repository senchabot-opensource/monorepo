import NextLink, { type LinkProps } from 'next/link'

import { cn } from '@/lib/utils'

function Link({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps) {
  return (
    <NextLink
      className={cn(
        'font-medium underline-offset-4 transition-all hover:text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export { Link }
