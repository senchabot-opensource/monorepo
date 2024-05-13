import { Suspense } from 'react'

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { LinkedAccounts } from '@/components/pages/settings/linked-accounts'
import { PersonalInformation } from '@/components/pages/settings/personal-information'
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
  title: 'Profile',
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
          <CardTitle>Personal information</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </CardDescription>
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
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
