'use client'

import { useTransition } from 'react'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { LoaderIcon } from '@/components/ui/icons'

import { deleteEventChannel } from '@/services/actions/livestreams'

interface Props {
  id: string
  platformEntityId: string
}

export function DeleteChannel({ id, platformEntityId }: Props) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          if (pending) return

          const [, error] = await deleteEventChannel({ id, platformEntityId })

          if (error) {
            toast.error(error.message)
            return
          }

          toast.success('Successfully deleted.')
        })
      }}
    >
      {pending ? <LoaderIcon /> : 'Delete'}
    </Button>
  )
}
