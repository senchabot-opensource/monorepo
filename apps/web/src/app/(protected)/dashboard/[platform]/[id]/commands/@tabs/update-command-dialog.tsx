'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LoaderIcon } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@/components/ui/link'
import { Switch } from '@/components/ui/switch'

import { updateCommand } from '@/services/commands/actions'
import type { EntityCommand } from '@/services/commands/type'

interface Props {
  command: EntityCommand
}

export function UpdateCommand({ command }: Props) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="submit" variant="secondary" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Command</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            // set platform fields
            formData.append('id', String(command.id))
            formData.append('platform', command.platform)
            formData.append('platformEntityId', command.platform_entity_id)

            const [, error] = await updateCommand(formData)

            if (error) {
              if (error.code === 'INPUT_PARSE_ERROR') {
                toast.error('Invalid submission!')
                return
              } else {
                toast.error(error.message)
                return
              }
            }

            toast.success('Successfully updated!')
          }}
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="command_name">Name</Label>
              <Input
                type="text"
                id="command_name"
                name="command_name"
                defaultValue={command.name}
                required
                disabled
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="command_content">Content</Label>
              <Input
                type="text"
                id="command_content"
                name="command_content"
                placeholder=""
                defaultValue={command.content}
                required
              />
              <p className="text-sm text-muted-foreground">
                See our{' '}
                <Link href="/docs" target="_blank" prefetch={false}>
                  docs
                </Link>{' '}
                for more variables.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Switch
                id="status"
                name="status"
                defaultChecked={command.status}
              />
              <Label htmlFor="status">Enabled</Label>
            </div>
          </div>
          <SaveButton />
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <div className="flex justify-end">
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? <LoaderIcon /> : 'Save'}
      </Button>
    </div>
  )
}
