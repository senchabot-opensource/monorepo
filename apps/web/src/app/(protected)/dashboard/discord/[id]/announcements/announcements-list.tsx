import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { getLivestreamAnnouncements } from '@/services/queries/livestreams'

import { DeleteAnnouncementButton } from './delete-announcement-button'

interface Props {
  id: string
}

export async function AnnouncementsList({ id }: Props) {
  const announcements = await getLivestreamAnnouncements(id)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Announcements</CardTitle>
        <CardDescription>
          Twitch streamers that will be announced in your server.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {announcements.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No announcements configured yet. Add a Twitch streamer to get
            started.
          </p>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {announcement.twitch_username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      (Twitch)
                    </span>
                  </div>
                  {announcement.anno_content && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {announcement.anno_content}
                    </p>
                  )}
                  {announcement.last_anno_date && (
                    <p className="text-xs text-muted-foreground">
                      Last announced:{' '}
                      {new Date(
                        announcement.last_anno_date,
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <DeleteAnnouncementButton
                  id={announcement.id}
                  platformEntityId={id}
                  twitchUsername={announcement.twitch_username}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
