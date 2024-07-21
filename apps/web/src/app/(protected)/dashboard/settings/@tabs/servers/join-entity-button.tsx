'use client'

import { useTransition } from 'react'

import { LogInIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { LoaderIcon } from '@/components/ui/icons'

import { executeEntityAction } from '@/services/entities/actions'
import type { Platform } from '@/services/shared/type'

interface Props {
  platform: Platform
  platformEntityId: string
  discordClientId: string
}

export function JoinEntity({
  platform,
  platformEntityId,
  discordClientId,
}: Props) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          if (platform === 'twitch') {
            const [, error] = await executeEntityAction({
              platform,
              platformEntityId,
              action: 'join',
            })

            if (error) {
              toast.error(error.message)
              return
            }

            toast.success('Successfully joined!')
          } else if (platform === 'discord') {
            const BASE_URL = 'https://discord.com/oauth2/authorize?'
            const params = new URLSearchParams()
            params.append('client_id', discordClientId)
            params.append('guild_id', platformEntityId)
            params.append('disable_guild_select', 'true')
            params.append('permission', '2199022698327')
            params.append('scope', ['bot', 'applications.commands'].join(' '))

            window.open(new URL(BASE_URL + params), '_blank', 'noreferrer')
          }
        })
      }}
    >
      {pending ? <LoaderIcon /> : <LogInIcon className="size-4" />}
      <span>Join</span>
    </Button>
  )
}
