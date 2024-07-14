import { fetcher } from '@/lib/fetcher'

import type { Platform } from '../shared/type'
import { EntityLog } from './type'

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
