import { fetcher } from '@/lib/fetcher'

import { env } from '@/config/env'
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

/**
 * Fetch public commands for a Twitch channel (no auth required)
 * @param channelName - The Twitch channel name
 * @returns Array of public commands
 */
export async function getPublicCommands(
  channelName: string,
): Promise<EntityCommand[]> {
  const params = new URLSearchParams()
  params.append('channel', channelName)

  const response = await fetch(`${env.API_URL}/commands?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: 60, // Cache for 60 seconds
      tags: [`public-commands-${channelName}`],
    },
  })

  if (!response.ok) {
    if (response.status === 404 || response.status === 400) {
      return []
    }
    throw new Error('Failed to fetch commands')
  }

  return response.json()
}
