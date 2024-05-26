import Link from 'next/link'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { getUserEntities } from '@/data-layer/queries/user'

import { EntitiesDropdown } from './entities-dropdown'

export async function EntitiesDropdownWrapper() {
  const entities = await getUserEntities('joined')

  if (!entities.length) {
    return (
      <Button variant="outline" asChild>
        <Link
          className="flex items-center space-x-2"
          href="/dashboard/settings/servers"
        >
          <PlusIcon className="size-4" />
          <span>Get Senchabot</span>
        </Link>
      </Button>
    )
  }

  return <EntitiesDropdown entities={entities} />
}
