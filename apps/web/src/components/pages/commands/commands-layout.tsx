import { CreateCommand } from './create-command'
import { ShareCommands } from './share-commands'

interface Props {
  tabs: React.ReactNode
  platform: Platform
}

export function CommandsLayout({ tabs, platform }: Props) {
  return (
    <div className="max-w-screen-lg space-y-8">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-medium tracking-tight">Commands</h1>
          <CreateCommand platform={platform} />
          <ShareCommands />
        </div>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
      {tabs}
    </div>
  )
}
