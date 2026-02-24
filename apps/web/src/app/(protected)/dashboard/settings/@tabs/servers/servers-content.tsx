'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

import type { Platform } from '@/types/platform'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoaderIcon } from '@/components/ui/icons'

import { JoinableEntities } from './joinable-entities-list'
import { JoinedEntities } from './joined-entities-list'
import { SharedCommandsDialog } from './shared-commands-dialog'

interface Props {
  initialEntities: Array<{
    entity_name: string
    entity_icon: string
    entity_owner_id: string
    entity_bot_joined: boolean
    platform: Platform
    platform_entity_id: string
  }>
}

function ServersContent({ initialEntities }: Props) {
  const searchParams = useSearchParams()
  const [showSharedCommandsDialog, setShowSharedCommandsDialog] = useState(false)
  const [entities, setEntities] = useState(initialEntities)
  const [dialogTriggered, setDialogTriggered] = useState(false)

  const justJoined = searchParams.get('joined')
  const joinedParam = searchParams.get('joined_platform')
  const joinedEntityId = searchParams.get('joined_entity_id')

  useEffect(() => {
    const joinedPlatforms = entities.filter((e) => e.entity_bot_joined)
    const uniquePlatforms = new Set(joinedPlatforms.map((e) => e.platform))
    const hasMultiplePlatforms = uniquePlatforms.size > 1

    if (justJoined && joinedParam && joinedEntityId && !dialogTriggered) {
      const newPlatform = joinedParam as Platform
      const newEntityId = joinedEntityId

      const otherPlatforms = joinedPlatforms.filter(
        (e) => e.platform !== newPlatform,
      )

      if (otherPlatforms.length > 0) {
        setShowSharedCommandsDialog(true)
        setDialogTriggered(true)
      }

      setEntities((prev) =>
        prev.map((e) =>
          e.platform_entity_id === newEntityId
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
            <Suspense fallback={<LoaderIcon />}>
              <JoinableEntities />
            </Suspense>
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
            <Suspense fallback={<LoaderIcon />}>
              <JoinedEntities />
            </Suspense>
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
