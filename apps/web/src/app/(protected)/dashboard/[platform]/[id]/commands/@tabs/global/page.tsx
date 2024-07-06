import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import type { Platform } from '@/services/shared/type'

import { CommandsList } from '../commands-list'

export const metadata: Metadata = {
  title: 'Global Commands',
}

interface Props {
  params: {
    platform: Platform
    id: string
  }
}

export default async function Page({ params }: Props) {
  const session = await auth()

  if (!session) {
    redirect('/signin')
  }

  return (
    <CommandsList platform={params.platform} id={params.id} type="global" />
  )
}
