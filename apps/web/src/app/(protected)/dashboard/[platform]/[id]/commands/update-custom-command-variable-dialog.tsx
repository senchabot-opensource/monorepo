'use client'

import { useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'

import { PencilIcon } from 'lucide-react'
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

import { updateCustomCommandVariable } from '@/services/actions/custom-command-variables'

import type { CustomCommandVariable } from '@/types/custom-command-variable'
import type { Platform } from '@/types/platform'

interface Props {
  variable: CustomCommandVariable
}

export function UpdateCustomCommandVariable({ variable }: Props) {
  const ref = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <PencilIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Variable</DialogTitle>
        </DialogHeader>
        <form
          ref={ref}
          action={async (formData) => {
            formData.append('platform', variable.platform)
            formData.append('platformEntityId', variable.platform_entity_id)
            formData.append('id', String(variable.id))

            const [, error] = await updateCustomCommandVariable({
              id: variable.id,
              platform: variable.platform as Platform,
              platformEntityId: variable.platform_entity_id,
              name: formData.get('name') as string,
              value: formData.get('value') as string,
            })

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
            toast.success('Variable updated!')
          }}
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                defaultValue={variable.name}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="value">Value</Label>
              <Input
                type="text"
                id="value"
                name="value"
                defaultValue={variable.value}
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
        {pending ? <LoaderIcon /> : 'Save'}
      </Button>
    </div>
  )
}
