import { Suspense } from 'react'

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { LoaderIcon } from '@/components/ui/icons'

import { auth } from '@/lib/auth'

import { AnnouncementsList } from './announcements-list'
import { CreateAnnouncementForm } from './create-announcement-form'

export const metadata: Metadata = {
  title: 'Livestream Announcements',
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

  return (
    <div className="max-w-screen-lg space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">
          Livestream Announcements
        </h1>
        <p className="text-sm text-muted-foreground">
          Add Twitch streamers to automatically announce when they go live in
          your Discord server.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <Suspense
            fallback={
              <div className="flex justify-center">
                <LoaderIcon />
              </div>
            }
          >
            <CreateAnnouncementForm id={params.id} />
          </Suspense>
        </div>
        <div>
          <Suspense
            fallback={
              <div className="flex justify-center">
                <LoaderIcon />
              </div>
            }
          >
            <AnnouncementsList id={params.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
