'use client'

import { useTransition } from 'react'

import { toast } from 'sonner'

import { Switch } from '@/components/ui/switch'

import { updateEntityCommandStatus } from '@/data-layer/actions/command'

interface Props {
  command: EntityCommand
}

export function UpdateCommandStatus({ command }: Props) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex size-full items-center">
      <Switch
        key={command.id}
        disabled={pending}
        defaultChecked={command.status}
        onCheckedChange={(checked) => {
          startTransition(() => {
            const dispatch = updateEntityCommandStatus(
              command.id,
              command.platform,
              command.platform_entity_id,
              checked,
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
          })
        }}
      />
    </div>
  )
}
