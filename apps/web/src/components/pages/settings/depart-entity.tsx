'use client'

import { useTransition } from 'react'

import { LogOutIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { LoaderIcon } from '@/components/ui/icons'

import { executeEntityAction } from '@/data-layer/actions/entity'

interface Props {
  platform: Platform
  platformEntityId: string
}

export function DepartEntity({ platform, platformEntityId }: Props) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm('Are you sure you want to perform this action?')) return

        startTransition(() => {
          const dispatch = executeEntityAction(
            'depart',
            platform,
            platformEntityId,
          )

          toast.promise(dispatch, {
            loading: 'Loading...',
            success: ({ message }) => {
              return message
            },
            error: ({ message }) => {
              return message
            },
          })
        })
      }}
    >
      {pending ? <LoaderIcon /> : <LogOutIcon className="size-4" />}
      <span>Depart</span>
    </Button>
  )
}
