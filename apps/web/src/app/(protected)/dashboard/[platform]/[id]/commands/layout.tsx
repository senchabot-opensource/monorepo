import { getUserEntities } from '@/services/queries/users'

import { Platform } from '@/types/platform'

import { CreateCommand } from './create-command-dialog'
import { ShareCommands } from './share-commands-button'

interface Props {
  params: Promise<{
    platform: string
    id: string
  }>
  tabs: React.ReactNode
}

export default async function Layout(props: Props) {
  const params = await props.params

  const { tabs } = props

  const platform = params.platform as Platform

  // Fetch entities to get the entity name for sharing
  const entities = await getUserEntities('joined')
  const currentEntity = entities.find(
    (entity) => entity.platform_entity_id === params.id,
  )

  return (
    <div className="max-w-screen-lg space-y-8">
      <div className="space-y-1">
        <div className="flex items-center justify-between space-x-2">
          <h1 className="text-2xl font-medium tracking-tight">Commands</h1>
          <div className="space-x-2">
            <CreateCommand platform={platform} entityId={params.id} />
            <ShareCommands
              platform={platform}
              entityName={currentEntity?.entity_name}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Manage your commands.</p>
      </div>
      {tabs}
    </div>
  )
}
