import { getUserEntities } from '@/data-layer/queries/user'

import { EntitiesDropdown } from './entities-dropdown'

export async function EntitiesDropdownWrapper() {
  const entities = await getUserEntities('joined')
  return <EntitiesDropdown entities={entities} />
}
