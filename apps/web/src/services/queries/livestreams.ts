import { fetcher } from '@/lib/fetcher'

import type { EventChannel, LivestreamAnnouncement } from '@/types/livestreams'

/**
 * Get event channels for a Discord server
 * @param platformEntityId - The Discord server ID
 * @returns Array of event channels
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

/**
 * Get livestream announcements for a Discord server
 * @param platformEntityId - The Discord server ID
 * @returns Array of livestream announcements
 */
export async function getLivestreamAnnouncements(
  platformEntityId: string,
): Promise<LivestreamAnnouncement[]> {
  const params = new URLSearchParams()
  params.append('noCache', 'true')
  params.append('platformEntityId', platformEntityId)

  return fetcher('/me/livestreams/announcements?' + params, {
    next: {
      tags: [`getLivestreamAnnouncements-${platformEntityId}`],
    },
  })
}
