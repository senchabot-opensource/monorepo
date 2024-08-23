import { fetcher } from '@/lib/fetcher'

import type { EntityLog } from '@/types/entity'
import type { Platform } from '@/types/platform'

/**
 *
 * @param platform
 * @param platformEntityId
 * @returns
 */
export async function getEntityLogs(
  platform: Platform,
  platformEntityId: string,
): Promise<EntityLog[]> {
  const params = new URLSearchParams()
  params.append('noCache', 'true')
  params.append('platform', platform)
  params.append('platformEntityId', platformEntityId)

  return fetcher('/me/platforms/logs?' + params, {
    next: {
      tags: [`getEntityLogs-${platformEntityId}`],
    },
  })
}
