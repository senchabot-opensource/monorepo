import { Suspense } from 'react'

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { JoinableEntities } from '@/components/pages/settings/joinable-entities'
import { JoinedEntities } from '@/components/pages/settings/joined-entities'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoaderIcon } from '@/components/ui/icons'

import { auth } from '@/lib/auth'

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
          <CardTitle>Senchabot joined</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoaderIcon />}>
            <JoinedEntities />
          </Suspense>
        </CardContent>
      </section>
      <section>
        <CardHeader>
          <CardTitle>Get Senchabot</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoaderIcon />}>
            <JoinableEntities />
          </Suspense>
        </CardContent>
      </section>
    </Card>
  )
}
