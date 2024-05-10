'use client'

import { HomeIcon } from 'lucide-react'

import { NavLinkItem } from './nav-link-item'

const items = [
  {
    label: 'Dashboard',
    href: `/dashboard`,
    icon: HomeIcon,
  },
]

export function MainNav() {
  return (
    <nav className="grow space-y-1">
      {items.map((item) => {
        const ItemIcon = item.icon
        return (
          <NavLinkItem href={item.href} key={item.href}>
            <ItemIcon className="size-4" />
            <span>{item.label}</span>
          </NavLinkItem>
        )
      })}
    </nav>
  )
}
