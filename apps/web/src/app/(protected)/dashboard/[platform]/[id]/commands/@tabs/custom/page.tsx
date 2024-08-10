import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { useSession } from '@/hooks/use-session'

import type { Platform } from '@/services/shared/type'

import { CommandsList } from '../commands-list'

export const metadata: Metadata = {
  title: 'Custom Commands',
}

interface Props {
  params: {
    platform: Platform
    id: string
  }
}

export default async function Page({ params }: Props) {
  const session = await useSession()

  if (!session) {
    throw redirect('/signin')
  }

  return (
    <CommandsList platform={params.platform} id={params.id} type="custom" />
  )
}
