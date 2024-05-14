'use client'

import { useTransition } from 'react'

import { LogInIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { LoaderIcon } from '@/components/ui/icons'

import { executeEntityAction } from '@/data-layer/actions/entity'

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
        startTransition(() => {
          if (platform === 'twitch') {
            const dispatch = executeEntityAction(
              'join',
              platform,
              platformEntityId,
            )

            toast.promise(dispatch, {
              loading: 'Loading...',
              success: ({ success, message }) => {
                if (!success) {
                  throw new Error(message)
                }
                return message
              },
              error: ({ message }) => {
                return message
              },
            })
          } else if (platform === 'discord') {
            const BASE_URL = 'https://discord.com/oauth2/authorize?'
            const params = new URLSearchParams({
              client_id: discordClientId,
              guild_id: platformEntityId,
              disable_guild_select: 'true',
              permission: '2199022698327',
              scope: ['bot', 'applications.commands'].join(' '),
            })

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
