import { getUserEntities } from '@/data-layer/queries/user'

import { Entities } from './entities'

export async function JoinableEntities() {
  const entities = await getUserEntities('not_joined')
  return <Entities entities={entities} />
}
