'use client'

import { useState } from 'react'

import { useParams, useRouter, useSelectedLayoutSegment } from 'next/navigation'

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

  const segment = useSelectedLayoutSegment()
  const params = useParams<{ id: string }>()
  const router = useRouter()

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
          platformEntityId={params.id}
          afterSubmission={() => {
            setOpen(false)
            if (segment !== 'custom') {
              router.push(`/dashboard/${platform}/${params.id}/commands`)
            }
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
