'use client'

import { useTransition } from 'react'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { LoaderIcon } from '@/components/ui/icons'

import { deleteCommand } from '@/services/actions/commands'

import type { Platform } from '@/types/platform'

interface Props {
  id: number
  platform: Platform
  platformEntityId: string
}

export function DeleteCommand({ id, platform, platformEntityId }: Props) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm('Are you sure you want to perform this action?')) return

        startTransition(async () => {
          const [, error] = await deleteCommand({
            id,
            platform,
            platformEntityId,
          })

          if (error) {
            toast.error(error.message)
            return
          }

          toast.success('Successfully deleted!')
        })
      }}
    >
      {pending ? <LoaderIcon /> : 'Delete'}
    </Button>
  )
}
