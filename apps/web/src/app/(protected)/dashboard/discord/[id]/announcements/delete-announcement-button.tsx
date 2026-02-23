'use client'

import { useTransition } from 'react'

import { Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { LoaderIcon } from '@/components/ui/icons'

import { deleteAnnouncement } from '@/services/actions/livestreams'

interface Props {
  id: number
  platformEntityId: string
  twitchUsername: string
}

export function DeleteAnnouncementButton({
  id,
  platformEntityId,
  twitchUsername,
}: Props) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={pending}
      onClick={() => {
        if (
          !confirm(
            `Are you sure you want to remove ${twitchUsername} from livestream announcements?`,
          )
        ) {
          return
        }

        startTransition(async () => {
          if (pending) return

          const [, error] = await deleteAnnouncement({
            id,
            platformEntityId,
          })

          if (error) {
            toast.error(error.message)
            return
          }

          toast.success('Announcement deleted successfully!')
        })
      }}
    >
      {pending ? (
        <LoaderIcon />
      ) : (
        <Trash2Icon className="size-4 text-destructive" />
      )}
    </Button>
  )
}
