'use client'

import { TrashIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { deleteCustomCommandVariable } from '@/services/actions/custom-command-variables'

import type { CustomCommandVariable } from '@/types/custom-command-variable'
import type { Platform } from '@/types/platform'

interface Props {
  id: number
  platform: Platform
  platformEntityId: string
}

export function DeleteCustomCommandVariable({
  id,
  platform,
  platformEntityId,
}: Props) {
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={async () => {
        const [, error] = await deleteCustomCommandVariable({
          id,
          platform,
          platformEntityId,
        })

        if (error) {
          toast.error(error.message)
          return
        }

        toast.success('Variable deleted!')
      }}
    >
      <TrashIcon className="size-4 text-destructive" />
    </Button>
  )
}
