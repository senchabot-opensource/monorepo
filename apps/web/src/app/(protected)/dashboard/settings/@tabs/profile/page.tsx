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

import { useSession } from '@/hooks/use-session'

import { LinkedAccounts } from './linked-accounts-list'
import { PersonalInformation } from './personal-information'

export const metadata: Metadata = {
  title: 'Profile',
}

export default async function Page() {
  const session = await useSession()

  if (!session) {
    throw redirect('/signin')
  }

  return (
    <Card className="divide-y divide-border">
      <section>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>View your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoaderIcon />}>
            <PersonalInformation />
          </Suspense>
        </CardContent>
      </section>
      <section>
        <CardHeader>
          <CardTitle>Linked accounts</CardTitle>
          <CardDescription>
            Link a Twitch.tv or Discord.com account to your Senchabot account to
            log in and manage your servers or channels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoaderIcon />}>
            <LinkedAccounts />
          </Suspense>
        </CardContent>
      </section>
    </Card>
  )
}
