import { Suspense } from 'react'

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { JoinedEntities } from '@/components/pages/dashboard/joined-entities'
import { LoaderIcon } from '@/components/ui/icons'

import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function Page() {
  const session = await auth()

  if (!session) {
    redirect('/signin')
  }

  return (
    <div className="max-w-screen-lg space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage your servers and channels from your dashboard.
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
