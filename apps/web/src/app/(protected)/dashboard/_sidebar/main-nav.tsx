'use client'

import { useMemo } from 'react'

import { useParams, useSelectedLayoutSegment } from 'next/navigation'

import { CalendarIcon, HomeIcon, ListIcon, MegaphoneIcon } from 'lucide-react'

import { NavLinkItem } from './nav-link-item'

export function MainNav() {
  const params = useParams<{ id: string }>()
  const segment = useSelectedLayoutSegment()

  const items = useMemo(() => {
    const BASE_URL = `/dashboard/${segment}/${params.id}`
    if (segment === 'twitch') {
      return [
        {
          label: 'Overview',
          href: `${BASE_URL}`,
          icon: HomeIcon,
        },
        {
          label: 'Commands',
          href: `${BASE_URL}/commands`,
          icon: ListIcon,
        },
      ]
    } else if (segment === 'discord') {
      return [
        {
          label: 'Overview',
          href: `${BASE_URL}`,
          icon: HomeIcon,
        },
        {
          label: 'Commands',
          href: `${BASE_URL}/commands`,
          icon: ListIcon,
        },
        {
          label: 'Event Channels',
          href: `${BASE_URL}/event-channels`,
          icon: CalendarIcon,
        },
      ]
    } else {
      return [
        {
          label: 'Dashboard',
          href: `/dashboard`,
          icon: HomeIcon,
        },
      ]
    }
  }, [params, segment])

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
