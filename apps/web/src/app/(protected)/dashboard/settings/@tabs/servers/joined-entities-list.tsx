import { getUserEntities } from '@/services/users/queries'

import { EntitiesList } from './entities-list'

export async function JoinedEntities() {
  const entities = await getUserEntities('joined')
  return <EntitiesList entities={entities} />
}
