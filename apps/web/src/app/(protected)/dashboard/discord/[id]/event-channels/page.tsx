import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { formatDate } from '@/lib/utils'

import { useSession } from '@/hooks/use-session'

import { getDiscordGuildChannels } from '@/services/queries/discord'
import { getEventChannels } from '@/services/queries/livestreams'

import { CreateEventChannelForm } from './create-event-channel-form'
import { DeleteChannel } from './delete-channel-button'

export const metadata: Metadata = {
  title: 'Event Channels',
}

interface Props {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const session = await useSession()

  if (!session) {
    throw redirect('/signin')
  }

  const [guildChannels, eventChannels] = await Promise.all([
    getDiscordGuildChannels(params.id),
    getEventChannels(params.id),
  ])

  const filterChannels = guildChannels.filter(
    (guildChannel) =>
      !eventChannels.some(
        (eventChannel) => eventChannel.channel_id === guildChannel.id,
      ),
  )

  // fixthis
  function getEventChannelName(eventChannelId: String) {
    return guildChannels.find((channel) => channel.id === eventChannelId)?.name
  }

  return (
    <div className="max-w-screen-sm space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">Event Channels</h1>
        <p className="text-sm text-muted-foreground">
          Manage channels to create automated Discord events for your livestream announcements.
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-end">
          <CreateEventChannelForm
            platformEntityId={params.id}
            channels={filterChannels}
          />
        </div>
        <div className="overflow-hidden rounded-xl border">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead>Added Date</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventChannels.map((channel) => (
                <TableRow key={channel.id}>
                  <TableCell>
                    {getEventChannelName(channel.channel_id)}
                  </TableCell>
                  <TableCell>{formatDate(channel.created_at)}</TableCell>
                  <TableCell className="w-24">
                    <div className="flex justify-end">
                      <DeleteChannel
                        id={String(channel.id)}
                        platformEntityId={params.id}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
