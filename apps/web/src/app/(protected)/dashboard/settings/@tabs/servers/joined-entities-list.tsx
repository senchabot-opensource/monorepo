import { getUserEntities } from '@/services/queries/users'

import { EntitiesList } from './entities-list'
import { env } from '@/config/env'

export async function JoinedEntities() {
  const entities = await getUserEntities('joined')
  return <EntitiesList entities={entities} discordClientId={env.AUTH_DISCORD_ID} />
}
