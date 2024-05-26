import { CommandsTabsLayout } from '@/components/pages/commands/commands-tabs-layout'

interface Props {
  params: {
    id: string
  }
  children: React.ReactNode
}

export default function TabsLayout({ params, children }: Props) {
  return (
    <CommandsTabsLayout platform="twitch" id={params.id}>
      {children}
    </CommandsTabsLayout>
  )
}
