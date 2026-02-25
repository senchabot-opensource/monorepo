import { fetcher } from '@/lib/fetcher'

import type { CustomCommandVariable } from '@/types/custom-command-variable'
import type { Platform } from '@/types/platform'

/**
 *
 * @param platform
 * @param platformEntityId
 * @returns
 */
export async function getCustomCommandVariables(
  platform: Platform,
  platformEntityId: string,
): Promise<CustomCommandVariable[]> {
  const params = new URLSearchParams()
  params.append('platform', platform)
  params.append('platformEntityId', platformEntityId)

  return fetcher('/me/commands/variables?' + params, {
    next: {
      tags: [`getCustomCommandVariables-${platformEntityId}`],
    },
  })
}
