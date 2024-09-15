import { fetcher } from '@/lib/fetcher'

import type { GuildChannel } from '@/types/discord'

/**
 *
 * @param platformEntityId
 * @returns
 */
export async function getDiscordGuildChannels(
  platformEntityId: string,
): Promise<GuildChannel[]> {
  const params = new URLSearchParams()
  params.append('noCache', 'true')
  params.append('platformEntityId', platformEntityId)

  return fetcher('/me/discord/guild-channels?' + params, {
    cache: 'no-store',
    next: {
      tags: [`getEventChannels-${platformEntityId}`],
    },
  })
}
