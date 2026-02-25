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

import { createCustomCommandVariable } from '@/services/actions/custom-command-variables'

import type { Platform } from '@/types/platform'

interface Props {
  platform: Platform
  entityId: string
}

export function CreateCustomCommandVariable({ platform, entityId }: Props) {
  const ref = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="size-4" />
          <span>Add Variable</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Custom Variable</DialogTitle>
        </DialogHeader>
        <form
          ref={ref}
          action={async (formData) => {
            formData.append('platform', platform)
            formData.append('platformEntityId', entityId)

            const [, error] = await createCustomCommandVariable(formData)

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
            toast.success('Variable added!')
          }}
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="social"
                required
              />
              <p className="text-sm text-muted-foreground">
                Use this as {'{variable_name}'} in commands
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="value">Value</Label>
              <Input
                type="text"
                id="value"
                name="value"
                placeholder="https://instagram.com/..."
                required
              />
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
