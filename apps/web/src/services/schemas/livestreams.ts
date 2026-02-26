import { z } from 'zod'

export const createEventChannelSchema = z.object({
  platformEntityId: z.string(),
  guild_channel_id: z.string(),
})

export const deleteEventChannelSchema = z.object({
  id: z.string(),
  platformEntityId: z.string(),
})

export const createAnnouncementSchema = z
  .object({
    platformEntityId: z.string().min(1),
    twitch_username: z.string().min(4),
    guild_channel_id: z.string().min(1),
    announcement_content: z.string().optional(),
  })
  .transform((val) => ({
    ...val,
    twitch_username: val.twitch_username.replace(
      /^https?:\/\/(www\.)?twitch\.tv\//,
      '',
    ),
  }))

export const deleteAnnouncementSchema = z.object({
  id: z.number(),
  platformEntityId: z.string().min(1),
})

export const updateAnnouncementSchema = z.object({
  id: z.number(),
  platformEntityId: z.string().min(1),
  announcement_content: z.string().optional(),
})
