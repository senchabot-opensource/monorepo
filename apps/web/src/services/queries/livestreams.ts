import { fetcher } from '@/lib/fetcher'

import type { EventChannel } from '@/types/livestreams'

/**
 *
 * @param platformEntityId
 * @returns
 */
export async function getEventChannels(
  platformEntityId: string,
): Promise<EventChannel[]> {
  const params = new URLSearchParams()
  params.append('noCache', 'true')
  params.append('platformEntityId', platformEntityId)

  return fetcher('/me/livestreams/event-channels?' + params, {
    next: {
      tags: [`getEventChannels-${platformEntityId}`],
    },
  })
}
