import { CommandsLayout } from '@/components/pages/commands/commands-layout'

interface Props {
  tabs: React.ReactNode
}

export default function Layout({ tabs }: Props) {
  return <CommandsLayout platform="twitch" tabs={tabs} />
}
