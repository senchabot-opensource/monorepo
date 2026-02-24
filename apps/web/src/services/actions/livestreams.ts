'use server'

import { revalidateTag } from 'next/cache'

import { ZSAError, createServerAction } from 'zsa'

import { fetcher } from '@/lib/fetcher'

import {
  createAnnouncementSchema,
  createEventChannelSchema,
  deleteAnnouncementSchema,
  deleteEventChannelSchema,
} from '../schemas/livestreams'

/**
 * Create an event channel for Discord events
 */
export const createEventChannel = createServerAction()
  .input(createEventChannelSchema, {
    type: 'formData',
  })
  .handler(async ({ input }) => {
    try {
      const params = new URLSearchParams()
      params.append('platformEntityId', input.platformEntityId)

      await fetcher('/me/livestreams/event-channels?' + params, {
        method: 'POST',
        body: JSON.stringify({
          guild_channel_id: input.guild_channel_id,
        }),
      })

      revalidateTag(`getEventChannels-${input.platformEntityId}`)
    } catch (error) {
      console.error('createEventChannel =>', error)
     
      throw new ZSAError('ERROR', 'Something went wrong!')
    }
  })

/**
 * Delete an event channel
 */
export const deleteEventChannel = createServerAction()
  .input(deleteEventChannelSchema)
  .handler(async ({ input }) => {
    try {
      const params = new URLSearchParams()
      params.append('platformEntityId', input.platformEntityId)

      await fetcher(`/me/livestreams/event-channels/${input.id}?` + params, {
        method: 'DELETE',
      })

      revalidateTag(`getEventChannels-${input.platformEntityId}`)
    } catch (error) {
      console.error('deleteEventChannel =>', error)
     
      throw new ZSAError('ERROR', 'Something went wrong!')
    }
  })

/**
 * Create a livestream announcement
 */
export const createAnnouncement = createServerAction()
  .input(createAnnouncementSchema, {
    type: 'formData',
  })
  .handler(async ({ input }) => {
    try {
      const params = new URLSearchParams()
      params.append('platformEntityId', input.platformEntityId)

      await fetcher('/me/livestreams/announcements?' + params, {
        method: 'POST',
        body: JSON.stringify({
          twitch_username: input.twitch_username,
          guild_channel_id: input.guild_channel_id,
          announcement_content: input.announcement_content || null,
        }),
      })

      revalidateTag(`getLivestreamAnnouncements-${input.platformEntityId}`)
    } catch (error) {
      console.error('createAnnouncement =>', error)
     
      throw new ZSAError('ERROR', 'Something went wrong!')
    }
  })

/**
 * Delete a livestream announcement
 */
export const deleteAnnouncement = createServerAction()
  .input(deleteAnnouncementSchema)
  .handler(async ({ input }) => {
    try {
      const params = new URLSearchParams()
      params.append('platformEntityId', input.platformEntityId)

      await fetcher(`/me/livestreams/announcements/${input.id}?` + params, {
        method: 'DELETE',
      })

      revalidateTag(`getLivestreamAnnouncements-${input.platformEntityId}`)
    } catch (error) {
      console.error('deleteAnnouncement =>', error)
     
      throw new ZSAError('ERROR', 'Something went wrong!')
    }
  })
