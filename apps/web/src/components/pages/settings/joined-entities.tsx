import { getUserEntities } from '@/data-layer/queries/user'

import { Entities } from './entities'

export async function JoinedEntities() {
  const entities = await getUserEntities('joined')
  return <Entities entities={entities} />
}
