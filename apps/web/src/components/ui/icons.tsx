import { Loader2Icon as LucideLoaderIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export function LoaderIcon({
  className,
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <LucideLoaderIcon
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  )
}

export function TwitchIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-4', className)}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M4.265 3L3 6.236v13.223h4.502V21l2.531.85l2.392-2.391h3.658l4.923-4.924V3zm15.052 10.691l-2.813 2.814h-4.502l-2.391 2.391v-2.391H5.813V4.688h13.504zm-2.812-5.767v4.923h-1.688V7.924zm-4.502 0v4.923h-1.688V7.924z"
      ></path>
    </svg>
  )
}

export function DiscordIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-4', className)}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1a14.66 14.66 0 0 0-4.58 0a10.14 10.14 0 0 0-.53-1.1a16 16 0 0 0-4.13 1.3a17.33 17.33 0 0 0-3 11.59a16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83a3.39 3.39 0 0 0 .42-.33a11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84a12.41 12.41 0 0 0 1.08 1.78a16.44 16.44 0 0 0 5.06-2.59a17.22 17.22 0 0 0-3-11.59a16.09 16.09 0 0 0-4.09-1.35M8.68 14.81a1.94 1.94 0 0 1-1.8-2a1.93 1.93 0 0 1 1.8-2a1.93 1.93 0 0 1 1.8 2a1.93 1.93 0 0 1-1.8 2m6.64 0a1.94 1.94 0 0 1-1.8-2a1.93 1.93 0 0 1 1.8-2a1.92 1.92 0 0 1 1.8 2a1.92 1.92 0 0 1-1.8 2"
      ></path>
    </svg>
  )
}
