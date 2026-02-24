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

import { ServersContent } from './servers-content'
import { getUserEntities } from '@/services/queries/users'

export const metadata: Metadata = {
  title: 'Servers & Channels',
}

export default async function Page() {
  const session = await auth()

  if (!session) {
    throw redirect('/signin')
  }

  const initialEntities = await getUserEntities()

  return (
    <Suspense fallback={<Card className="divide-y divide-border"><CardContent className="pt-6"><LoaderIcon /></CardContent></Card>}>
      <ServersContent initialEntities={initialEntities} />
    </Suspense>
  )
}
