import NextLink from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@/components/ui/link'

import { getUserEntities } from '@/services/queries/users'

export async function JoinedEntitiesList() {
  const entities = await getUserEntities('joined')

  if (!entities.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No server or channel found, click{' '}
        <Link href="/dashboard/settings/servers">here</Link> to add a new one.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {entities.map((item) => (
        <NextLink
          className="flex items-center space-x-2 rounded-md border bg-muted/25 px-4 py-2 text-sm font-medium shadow-sm transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          href={`/dashboard/${item.platform}/${item.platform_entity_id}`}
          key={item.platform_entity_id}
        >
          <Avatar className="size-6 rounded">
            <AvatarImage src={item.entity_icon} />
            <AvatarFallback>{item.entity_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>
            <span className='text-muted-foreground after:content-["/"]'>
              {item.platform}
            </span>
            {item.entity_name}
          </span>
        </NextLink>
      ))}
    </div>
  )
}
