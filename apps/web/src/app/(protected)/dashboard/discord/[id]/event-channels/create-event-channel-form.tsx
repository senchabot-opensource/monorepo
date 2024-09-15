'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'

import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { LoaderIcon } from '@/components/ui/icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { createEventChannel } from '@/services/actions/livestreams'

import type { GuildChannel } from '@/types/discord'

interface Props {
  platformEntityId: string
  channels: GuildChannel[]
}

export function CreateEventChannelForm({ platformEntityId, channels }: Props) {
  const [key, setKey] = useState<number>(+new Date())

  return (
    <form
      action={async (formData) => {
        formData.append('platformEntityId', platformEntityId)

        const [_, error] = await createEventChannel(formData)

        if (error) {
          if (error.code === 'INPUT_PARSE_ERROR') {
            return toast.error('Invalid submission!')
          } else {
            return toast.error(error.message)
          }
        }

        toast.success('Successfully added.')
        setKey(+new Date())
      }}
    >
      <div className="flex rounded-md border">
        <Select
          name="guild_channel_id"
          key={key}
          disabled={!channels.length}
          required
        >
          <SelectTrigger className="w-48 border-none">
            <SelectValue placeholder="# select-channel" />
          </SelectTrigger>
          <SelectContent>
            {channels.map((channel) => (
              <SelectItem value={channel.id} key={channel.id}>
                {channel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <SubmitButton isDisabled={!channels.length} />
      </div>
    </form>
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
          <span>Add</span>
        </>
      )}
    </Button>
  )
}
