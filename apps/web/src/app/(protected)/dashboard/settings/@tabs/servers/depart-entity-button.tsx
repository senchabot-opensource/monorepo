'use client'

import { useTransition } from 'react'

import { LogOutIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { LoaderIcon } from '@/components/ui/icons'

import { executeEntityAction } from '@/services/entities/actions'
import type { Platform } from '@/services/shared/type'

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

        startTransition(async () => {
          const [, error] = await executeEntityAction({
            platform,
            platformEntityId,
            action: 'depart',
          })

          if (error) {
            toast.error(error.message)
            return
          }

          toast.success('Successfully departed!')
        })
      }}
    >
      {pending ? <LoaderIcon /> : <LogOutIcon className="size-4" />}
      <span>Depart</span>
    </Button>
  )
}
