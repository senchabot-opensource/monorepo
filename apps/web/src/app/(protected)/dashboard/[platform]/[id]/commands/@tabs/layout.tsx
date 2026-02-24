import { TabGroup, TabGroupItem } from '@/components/ui/tab-group'

const tabs = [
  {
    label: 'Custom Commands',
    slug: 'custom',
  },
  {
    label: 'Global Commands',
    slug: 'global',
  },
  {
    label: 'System Commands',
    slug: 'system',
  },
]

interface Props {
  params: Promise<{
    platform: string
    id: string
  }>
  children: React.ReactNode
}

export default async function TabsLayout(props: Props) {
  const params = await props.params

  const { children } = props

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
