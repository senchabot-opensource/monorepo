import type { Platform } from '@/services/shared/type'

import { CreateCommand } from './create-command-dialog'
import { ShareCommands } from './share-commands-button'

interface Props {
  params: {
    platform: Platform
    id: string
  }
  tabs: React.ReactNode
}

export default function Layout({ params, tabs }: Props) {
  return (
    <div className="max-w-screen-lg space-y-8">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-medium tracking-tight">Commands</h1>
          <CreateCommand platform={params.platform} entityId={params.id} />
          <ShareCommands />
        </div>
        <p className="text-sm text-muted-foreground">Manage your commands.</p>
      </div>
      {tabs}
    </div>
  )
}
