import Link from 'next/link'

import { ChevronsUpDownIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { signOut } from '@/lib/auth'

import { useSession } from '@/hooks/use-session'

export async function UserDropdown() {
  const session = await useSession()

  if (!session?.user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex h-9 w-full items-center justify-between space-x-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Avatar className="size-4 rounded">
                <AvatarImage src={session.user.image ?? ''} />
                <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="max-w-36 truncate">{session.user.name}</span>
            </div>
          </div>
          <ChevronsUpDownIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width]"
        side="top"
      >
        <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {[
          {
            label: 'Settings',
            href: '/dashboard/settings',
          },
          {
            label: 'Manage Servers',
            href: '/dashboard/settings/servers',
          },
        ].map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/signin' })
          }}
        >
          <DropdownMenuItem asChild>
            <button type="submit" className="size-full">
              Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
