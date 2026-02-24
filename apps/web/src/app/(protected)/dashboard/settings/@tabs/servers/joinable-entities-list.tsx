import { getUserEntities } from '@/services/queries/users'

import { env } from '@/config/env'

import { EntitiesList } from './entities-list'

export async function JoinableEntities() {
  const entities = await getUserEntities('not_joined')
  return <EntitiesList entities={entities} discordClientId={env.AUTH_DISCORD_ID} />
}
