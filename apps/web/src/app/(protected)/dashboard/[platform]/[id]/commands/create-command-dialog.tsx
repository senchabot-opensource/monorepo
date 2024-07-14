'use client'

import { useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'

import { PlusIcon } from 'lucide-react'
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

import { createCommand } from '@/services/commands/actions'
import type { Platform } from '@/services/shared/type'

interface Props {
  platform: Platform
  entityId: string
}

export function CreateCommand({ platform, entityId }: Props) {
  const ref = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="size-4" />
          <span>Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Command</DialogTitle>
        </DialogHeader>
        <form
          ref={ref}
          action={async (formData) => {
            // set platform field
            formData.append('platform', platform)
            formData.append('platformEntityId', entityId)

            const [, error] = await createCommand(formData)

            if (error) {
              if (error.code === 'INPUT_PARSE_ERROR') {
                toast.error('Invalid submission!')
                return
              } else {
                toast.error(error.message)
                return
              }
            }

            ref.current?.reset()
            setOpen(false)
            toast.success('Successfully added!')
          }}
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="command_name">Name</Label>
              <Input
                type="text"
                id="command_name"
                name="command_name"
                placeholder=""
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="command_content">Content</Label>
              <Input
                type="text"
                id="command_content"
                name="command_content"
                placeholder=""
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
              <Switch id="status" name="status" defaultChecked />
              <Label htmlFor="status">Enabled</Label>
            </div>
          </div>
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <div className="flex justify-end">
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? <LoaderIcon /> : 'Submit'}
      </Button>
    </div>
  )
}
