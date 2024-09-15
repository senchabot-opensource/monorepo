'use client'

import { useTransition } from 'react'

import { toast } from 'sonner'

import { Switch } from '@/components/ui/switch'

import { setCommandStatus } from '@/services/actions/commands'

import type { EntityCommand } from '@/types/command'

interface Props {
  command: EntityCommand
}

export function CommandStatusSwitch({ command }: Props) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex size-full items-center">
      <Switch
        key={command.id}
        disabled={pending}
        defaultChecked={command.status}
        onCheckedChange={(checked) => {
          startTransition(async () => {
            const [, error] = await setCommandStatus({
              id: command.id,
              platform: command.platform,
              platformEntityId: command.platform_entity_id,
              status: checked,
            })

            if (error) {
              toast.error(error.message)
              return
            }

            toast.success('Successfully updated!')
          })
        }}
      />
    </div>
  )
}
