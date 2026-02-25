import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import type { Platform } from '@/types/platform'

import { SystemCommandsList } from './system-commands-list'

export const metadata: Metadata = {
  title: 'System Commands',
}

interface Props {
  params: Promise<{
    platform: Platform
    id: string
  }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const session = await auth()

  if (!session) {
    throw redirect('/signin')
  }

  return <SystemCommandsList platform={params.platform} />
}
