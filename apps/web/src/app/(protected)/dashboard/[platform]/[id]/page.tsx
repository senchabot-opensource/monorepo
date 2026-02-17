import { Suspense } from 'react'

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { LoaderIcon } from '@/components/ui/icons'

import { auth } from '@/lib/auth'

import type { Platform } from '@/types/platform'

import { EntityLogsCard } from './entity-logs-card'

export const metadata: Metadata = {
  title: 'Overview',
}

interface Props {
  params: Promise<{
    platform: Platform
    id: string
  }>
}

export default async function Page(props: Props) {
  const params = await props.params;
  const session = await auth()

  if (!session) {
    throw redirect('/signin')
  }

  return (
    <div className="max-w-screen-lg space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your server or channel.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8">
        <Suspense
          fallback={
            <div className="flex justify-center">
              <LoaderIcon />
            </div>
          }
        >
          <EntityLogsCard platform={params.platform} id={params.id} />
        </Suspense>
      </div>
    </div>
  )
}
