import { TabGroup, TabGroupItem } from '@/components/ui/tab-group'

interface Props {
  children: React.ReactNode
}

export default function TabsLayout({ children }: Props) {
  return (
    <div className="space-y-4">
      <TabGroup>
        {[
          {
            label: 'Profile',
            slug: 'profile',
          },
          {
            label: 'Servers & Channels',
            slug: 'servers',
          },
          {
            label: 'Privacy',
            slug: 'privacy',
          },
        ].map((item) => {
          return (
            <TabGroupItem
              href={`/dashboard/settings/${item.slug}`}
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
