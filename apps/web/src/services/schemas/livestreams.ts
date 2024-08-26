import { z } from 'zod'

export const createEventChannelSchema = z.object({
  platformEntityId: z.string(),
  guild_channel_id: z.string(),
})

export const deleteEventChannelSchema = z.object({
  id: z.string(),
  platformEntityId: z.string(),
})
