import { TabGroup, TabGroupItem } from '@/components/ui/tab-group'

interface Props {
  platform: Platform
  id: string
  children: React.ReactNode
}

const tabs = [
  { label: 'Custom Commands', slug: 'custom' },
  { label: 'Global Commands', slug: 'global' },
]

export function CommandsTabsLayout({ platform, id, children }: Props) {
  return (
    <div className="space-y-4">
      <TabGroup>
        {tabs.map((item) => {
          return (
            <TabGroupItem
              href={`/dashboard/${platform}/${id}/commands/${item.slug}`}
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
