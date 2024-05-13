'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { UpdateCommandForm } from './update-command-form'

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
        <UpdateCommandForm
          command={command}
          afterSubmission={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
