import { FileIcon, MessagesSquareIcon } from 'lucide-react'

import { NavLinkItem } from './nav-link-item'
import { UserDropdown } from './user-dropdown'

export function BottomNav() {
  return (
    <nav className="space-y-1">
      {[
        {
          label: 'Docs',
          href: '/docs',
          icon: FileIcon,
        },
        {
          label: 'Community',
          href: '/discord',
          icon: MessagesSquareIcon,
        },
      ].map((item) => {
        const ItemIcon = item.icon
        return (
          <NavLinkItem href={item.href} target="_blank" key={item.href}>
            <ItemIcon className="size-4" />
            <span>{item.label}</span>
          </NavLinkItem>
        )
      })}
      <UserDropdown />
    </nav>
  )
}
