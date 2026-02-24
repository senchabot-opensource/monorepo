'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import type { Platform } from '@/types/platform'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { SharedCommandsDialog } from './shared-commands-dialog'
import { EntitiesList } from './entities-list'

interface Entity {
  entity_name: string
  entity_icon: string
  entity_owner_id: string
  entity_bot_joined: boolean
  platform: Platform
  platform_entity_id: string
}

interface Props {
  initialJoinableEntities: Entity[]
  initialJoinedEntities: Entity[]
}

function ServersContent({ initialJoinableEntities, initialJoinedEntities }: Props) {
  const searchParams = useSearchParams()
  const [showSharedCommandsDialog, setShowSharedCommandsDialog] = useState(false)
  const [entities, setEntities] = useState([...initialJoinableEntities, ...initialJoinedEntities])
  const [dialogTriggered, setDialogTriggered] = useState(false)

  const justJoined = searchParams.get('joined')
  const joinedParam = searchParams.get('joined_platform')
  const joinedEntityId = searchParams.get('joined_entity_id')

  useEffect(() => {
    const joinedPlatforms = entities.filter((e) => e.entity_bot_joined)
    const uniquePlatforms = new Set(joinedPlatforms.map((e) => e.platform))
    const hasMultiplePlatforms = uniquePlatforms.size > 1

    if (justJoined && joinedParam && joinedEntityId && !dialogTriggered) {
      const otherPlatforms = joinedPlatforms.filter(
        (e) => e.platform !== joinedParam,
      )

      if (otherPlatforms.length > 0) {
        setShowSharedCommandsDialog(true)
        setDialogTriggered(true)
      }

      setEntities((prev) =>
        prev.map((e) =>
          e.platform_entity_id === joinedEntityId
            ? { ...e, entity_bot_joined: true }
            : e,
        ),
      )
    } else if (hasMultiplePlatforms && !dialogTriggered && !justJoined) {
      const hasAskedBefore = localStorage.getItem('shared_commands_asked')
      if (!hasAskedBefore) {
        setShowSharedCommandsDialog(true)
        setDialogTriggered(true)
      }
    }
  }, [justJoined, joinedParam, joinedEntityId, entities, dialogTriggered])

  const handleDialogClose = () => {
    setShowSharedCommandsDialog(false)
    localStorage.setItem('shared_commands_asked', 'true')
  }

  const joinedPlatforms = entities.filter((e) => e.entity_bot_joined)
  const joinableEntities = entities.filter((e) => !e.entity_bot_joined)

  return (
    <>
      <Card className="divide-y divide-border">
        <section>
          <CardHeader>
            <CardTitle>Get Senchabot</CardTitle>
            <CardDescription>
              Select a server or channel where you want to add Senchabot.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EntitiesList entities={joinableEntities} />
          </CardContent>
        </section>
        <section>
          <CardHeader>
            <CardTitle>Senchabot joined</CardTitle>
            <CardDescription>
              Manage the server or channel where you use Senchabot.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EntitiesList entities={joinedPlatforms} />
          </CardContent>
        </section>
      </Card>

      {showSharedCommandsDialog && joinedPlatforms.length > 1 && (
        <SharedCommandsDialog
          open={showSharedCommandsDialog}
          onOpenChange={(open) => {
            if (!open) handleDialogClose()
          }}
          newPlatform={joinedPlatforms[joinedPlatforms.length - 1].platform}
          newPlatformEntityId={
            joinedPlatforms[joinedPlatforms.length - 1].platform_entity_id
          }
          existingPlatforms={joinedPlatforms
            .slice(0, -1)
            .map((e) => ({
              platform: e.platform,
              platformEntityId: e.platform_entity_id,
            }))}
        />
      )}
    </>
  )
}

export { ServersContent }
