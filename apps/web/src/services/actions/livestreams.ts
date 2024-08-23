'use server'

import { revalidateTag } from 'next/cache'

import { ZSAError, createServerAction } from 'zsa'

import { fetcher } from '@/lib/fetcher'

import {
  createEventChannelSchema,
  deleteEventChannelSchema,
} from '../schemas/livestreams'

/**
 *
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
 *
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
