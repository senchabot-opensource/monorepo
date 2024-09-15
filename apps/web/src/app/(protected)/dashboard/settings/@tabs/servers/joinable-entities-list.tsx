import { getUserEntities } from '@/services/queries/users'

import { EntitiesList } from './entities-list'

export async function JoinableEntities() {
  const entities = await getUserEntities('not_joined')
  return <EntitiesList entities={entities} />
}
