import { Suspense } from 'react'

import type { Metadata } from 'next'

import { JoinedEntities } from '@/components/pages/dashboard/joined-entities'
import { LoaderIcon } from '@/components/ui/icons'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function Page() {
  return (
    <div className="max-w-screen-lg space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
      <div className="space-y-4">
        <h1 className="font-medium tracking-tight">My Servers & Channels</h1>
        <Suspense fallback={<LoaderIcon />}>
          <JoinedEntities />
        </Suspense>
      </div>
    </div>
  )
}
