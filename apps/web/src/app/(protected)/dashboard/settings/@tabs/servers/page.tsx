import { Suspense } from 'react'

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoaderIcon } from '@/components/ui/icons'

import { auth } from '@/lib/auth'

import { JoinableEntities } from './joinable-entities-list'
import { JoinedEntities } from './joined-entities-list'

export const metadata: Metadata = {
  title: 'Servers & Channels',
}

export default async function Page() {
  const session = await auth()

  if (!session) {
    redirect('/signin')
  }

  return (
    <Card className="divide-y divide-border">
      <section>
        <CardHeader>
          <CardTitle>Get Senchabot</CardTitle>
          <CardDescription>
            Select a server or channel where you want to add Senchabot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoaderIcon />}>
            <JoinableEntities />
          </Suspense>
        </CardContent>
      </section>
      <section>
        <CardHeader>
          <CardTitle>Senchabot joined</CardTitle>
          <CardDescription>
            Manage the server or channel where you use Senchabot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoaderIcon />}>
            <JoinedEntities />
          </Suspense>
        </CardContent>
      </section>
    </Card>
  )
}
