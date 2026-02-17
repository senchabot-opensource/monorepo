import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { auth } from '@/lib/auth'
import { formatDate } from '@/lib/utils'

import { getDiscordGuildChannels } from '@/services/queries/discord'
import { getEventChannels } from '@/services/queries/livestreams'

import { CreateEventChannelForm } from './create-event-channel-form'
import { DeleteChannel } from './delete-channel-button'

export const metadata: Metadata = {
  title: 'Event Channels',
}

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const session = await auth()

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
          Manage channels to create automated Discord events for your livestream
          announcements.
        </p>
      </div>

      <Card className="divide-y divide-border">
        <section>
          <CardHeader>
            <CardTitle>Create Event Channel</CardTitle>
            <CardDescription>
              Select a channel to create automated Discord events for your
              livestream announcements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateEventChannelForm
              channels={filterChannels}
              platformEntityId={params.id}
            />
          </CardContent>
        </section>
        <section>
          <CardHeader>
            <CardTitle>Event Channels</CardTitle>
            <CardDescription>Manage your event channels.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventChannels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {getEventChannelName(channel.channel_id)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {formatDate(channel.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DeleteChannel
                      id={String(channel.id)}
                      platformEntityId={params.id}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </section>
      </Card>
    </div>
  )
}
