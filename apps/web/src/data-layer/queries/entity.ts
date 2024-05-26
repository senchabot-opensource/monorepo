import { fetcher } from '../fetcher'

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
  const params = new URLSearchParams({
    noCache: 'true',
    platform,
    platformEntityId,
  })

  return fetcher('/me/platforms/logs?' + params, {
    next: {
      tags: [`getEntityLogs-${platformEntityId}`],
    },
  })
}

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
