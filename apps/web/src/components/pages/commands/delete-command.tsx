'use client'

import { useTransition } from 'react'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { LoaderIcon } from '@/components/ui/icons'

import { deleteEntityCommand } from '@/data-layer/actions/command'

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

        startTransition(() => {
          const dispatch = deleteEntityCommand(id, platform, platformEntityId)

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
        })
      }}
    >
      {pending ? <LoaderIcon /> : 'Delete'}
    </Button>
  )
}
