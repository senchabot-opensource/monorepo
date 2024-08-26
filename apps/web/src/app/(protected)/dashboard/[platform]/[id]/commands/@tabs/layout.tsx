import { TabGroup, TabGroupItem } from '@/components/ui/tab-group'

import type { Platform } from '@/types/platform'

const tabs = [
  {
    label: 'Custom Commands',
    slug: 'custom',
  },
  {
    label: 'Global Commands',
    slug: 'global',
  },
]

interface Props {
  params: {
    platform: Platform
    id: string
  }
  children: React.ReactNode
}

export default function TabsLayout({ params, children }: Props) {
  return (
    <div className="space-y-4">
      <TabGroup>
        {tabs.map((item) => {
          return (
            <TabGroupItem
              href={`/dashboard/${params.platform}/${params.id}/commands/${item.slug}`}
              slug={item.slug}
              key={item.slug}
            >
              {item.label}
            </TabGroupItem>
          )
        })}
      </TabGroup>
      <div>{children}</div>
    </div>
  )
}
