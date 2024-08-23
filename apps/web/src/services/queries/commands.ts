import { fetcher } from '@/lib/fetcher'

import type { EntityCommand } from '@/types/command'
import type { Platform } from '@/types/platform'

/**
 *
 * @param platform
 * @param platformEntityId
 * @param type
 * @returns
 */
export async function getCommands(
  platform: Platform,
  platformEntityId: string,
  type: 'custom' | 'global',
): Promise<EntityCommand[]> {
  const params = new URLSearchParams()
  params.append('noCache', 'true')
  params.append('platform', platform)
  params.append('platformEntityId', platformEntityId)
  params.append('type', type)

  return fetcher('/me/commands?' + params, {
    next: {
      tags: [`getEntityCommands-${platformEntityId}-${type}`],
    },
  })
}
