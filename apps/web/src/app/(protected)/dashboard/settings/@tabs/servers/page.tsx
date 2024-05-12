import { Suspense } from 'react'

import type { Metadata } from 'next'

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

export const metadata: Metadata = {
  title: 'Servers & Channels',
}

export default function Page() {
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
