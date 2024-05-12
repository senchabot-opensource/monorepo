'use client'

import { useState } from 'react'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { CreateCommandForm } from './create-command-form'

interface Props {
  platform: Platform
}

export function CreateCommand({ platform }: Props) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <PlusIcon className="size-4" />
          <span>Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Command</DialogTitle>
        </DialogHeader>
        <CreateCommandForm
          platform={platform}
          afterSubmission={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
