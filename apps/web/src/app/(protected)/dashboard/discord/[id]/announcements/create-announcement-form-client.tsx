'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'

import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoaderIcon } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { createAnnouncement } from '@/services/actions/livestreams'

import type { GuildChannel } from '@/types/discord'

interface Props {
  id: string
  channels: GuildChannel[]
}

export function CreateAnnouncementFormClient({ id, channels }: Props) {
  const [key, setKey] = useState<number>(+new Date())

  // Filter to only text channels (type 0) and news channels (type 5)
  const textChannels = channels.filter(
    (channel) => channel.type === 0 || channel.type === 5,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Streamer</CardTitle>
        <CardDescription>
          Add a Twitch streamer to announce their livestreams in a channel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          key={key}
          action={async (formData) => {
            formData.append('platformEntityId', id)

            const [, error] = await createAnnouncement(formData)

            if (error) {
              if (error.code === 'INPUT_PARSE_ERROR') {
                toast.error('Invalid submission!')
                return
              } else {
                toast.error(error.message)
                return
              }
            }

            toast.success('Streamer added successfully!')
            setKey(+new Date())
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="twitch_username">Twitch Username</Label>
            <Input
              id="twitch_username"
              name="twitch_username"
              placeholder="Enter Twitch username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guild_channel_id">Announcement Channel</Label>
            <Select name="guild_channel_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a channel" />
              </SelectTrigger>
              <SelectContent>
                {textChannels.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No text channels available
                  </SelectItem>
                ) : (
                  textChannels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      #{channel.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="announcement_content">
              Custom Message (Optional)
            </Label>
            <Input
              id="announcement_content"
              name="announcement_content"
              placeholder="Custom announcement message..."
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use the default announcement message.
            </p>
          </div>
          <SubmitButton isDisabled={textChannels.length === 0} />
        </form>
      </CardContent>
    </Card>
  )
}

function SubmitButton({ isDisabled }: { isDisabled?: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending || isDisabled}>
      {pending ? (
        <LoaderIcon />
      ) : (
        <>
          <PlusIcon className="size-4" />
          <span>Add Streamer</span>
        </>
      )}
    </Button>
  )
}
