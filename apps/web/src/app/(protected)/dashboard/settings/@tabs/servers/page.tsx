import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { env } from '@/config/env'

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

  const allEntities = await getUserEntities()
  const joinableEntities = allEntities.filter((e) => !e.entity_bot_joined)
  const joinedEntities = allEntities.filter((e) => e.entity_bot_joined)

  return (
    <ServersContent 
      initialJoinableEntities={joinableEntities} 
      initialJoinedEntities={joinedEntities}
      discordClientId={env.AUTH_DISCORD_ID}
    />
  )
}
