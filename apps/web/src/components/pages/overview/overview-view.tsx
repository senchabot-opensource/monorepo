import { Suspense } from 'react'

import { redirect } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoaderIcon } from '@/components/ui/icons'

import { auth } from '@/lib/auth'

import { EntityLogs } from './entity-logs'

interface Props {
  platform: Platform
  id: string
}

export async function OverviewView({ platform, id }: Props) {
  const session = await auth()

  if (!session) {
    redirect('/signin')
  }

  return (
    <div className="max-w-screen-lg space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your server or channel.
        </p>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoaderIcon />}>
              <EntityLogs platform={platform} platformEntityId={id} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
