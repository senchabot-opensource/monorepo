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

import { updateAnnouncement } from '@/services/actions/livestreams'

import type { LivestreamAnnouncement } from '@/types/livestreams'

interface Props {
  announcement: LivestreamAnnouncement
  platformEntityId: string
}

export function UpdateAnnouncementDialog({
  announcement,
  platformEntityId,
}: Props) {
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
          <DialogTitle>Update Announcement</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            formData.append('id', String(announcement.id))
            formData.append('platformEntityId', platformEntityId)

            const [, error] = await updateAnnouncement({
              id: announcement.id,
              platformEntityId,
              announcement_content: formData.get('announcement_content') as string,
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

            toast.success('Announcement updated!')
            setOpen(false)
          }}
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="twitch_username">Twitch Username</Label>
              <Input
                type="text"
                id="twitch_username"
                defaultValue={announcement.twitch_username}
                disabled
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="announcement_content">
                Custom Message (Optional)
              </Label>
              <Input
                type="text"
                id="announcement_content"
                name="announcement_content"
                placeholder="Custom announcement message..."
                defaultValue={announcement.anno_content || ''}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use the default announcement message.
              </p>
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
