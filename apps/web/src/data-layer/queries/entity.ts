import { fetcher } from '../fetcher'

/**
 *
 * @param platform
 * @param platformEntityId
 * @param type
 * @returns
 */
export async function getEntityCommands(
  platform: Platform,
  platformEntityId: string,
  type: CommandType,
): Promise<EntityCommand[]> {
  const params = new URLSearchParams({
    noCache: 'true',
    platform,
    platformEntityId,
    type,
  })
  return fetcher('/me/commands?' + params, {
    next: {
      tags: [`getEntityCommands-${platformEntityId}-${type}`],
    },
  })
}
