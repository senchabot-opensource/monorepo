import { getUserEntities } from '@/services/users/queries'

import { EntitiesList } from './entities-list'

export async function JoinableEntities() {
  const entities = await getUserEntities('not_joined')
  return <EntitiesList entities={entities} />
}
