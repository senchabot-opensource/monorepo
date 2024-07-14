import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import type { UserEntity } from '@/services/users/type'

import { env } from '@/config/env'

import { DepartEntity } from './depart-entity-button'
import { JoinEntity } from './join-entity-button'

interface Props {
  entities: UserEntity[]
}

export function EntitiesList({ entities }: Props) {
  const DISCORD_CLIENT_ID = env.AUTH_DISCORD_ID

  return (
    <ul className="flex flex-col space-y-2">
      {Boolean(entities.length) ? (
        entities.map((item) => (
          <li
            className="flex select-none items-center justify-between rounded-md border bg-muted/25 px-4 py-2"
            key={item.platform_entity_id}
          >
            <div className="flex items-center space-x-2 text-sm">
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
            </div>
            {item.entity_bot_joined ? (
              <DepartEntity
                platform={item.platform}
                platformEntityId={item.platform_entity_id}
              />
            ) : (
              <JoinEntity
                platform={item.platform}
                platformEntityId={item.platform_entity_id}
                discordClientId={DISCORD_CLIENT_ID}
              />
            )}
          </li>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">
          No server or channel found.
        </p>
      )}
    </ul>
  )
}
