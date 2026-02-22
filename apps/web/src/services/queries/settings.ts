import { fetcher } from '@/lib/fetcher'

import type { Platform } from '@/types/platform'
import type { BotSetting } from '@/types/settings'

/**
 * Get bot settings for a platform entity
 * @param platform - The platform (twitch or discord)
 * @param platformEntityId - The entity ID
 * @returns Array of bot settings
 */
export async function getEntitySettings(
  platform: Platform,
  platformEntityId: string,
): Promise<BotSetting[]> {
  const params = new URLSearchParams()
  params.append('noCache', 'true')
  params.append('platform', platform)
  params.append('platformEntityId', platformEntityId)

  return fetcher('/me/platforms/settings?' + params, {
    next: {
      tags: [`getEntitySettings-${platformEntityId}`],
    },
  })
}
