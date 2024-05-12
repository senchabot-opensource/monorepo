import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { getUserEntities } from '@/data-layer/queries/user'

export async function JoinedEntities() {
  const entities = await getUserEntities('joined')

  return (
    <div className="grid grid-cols-4 gap-4">
      {entities.map((item) => (
        <Link
          className="flex items-center space-x-2 rounded-md border bg-muted/25 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          href={`/dashboard/${item.platform}/${item.platform_entity_id}`}
          key={item.platform_entity_id}
        >
          <Avatar className="size-6 rounded">
            <AvatarImage src={item.entity_icon} />
            <AvatarFallback>{item.entity_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{item.entity_name}</span>
        </Link>
      ))}
    </div>
  )
}
