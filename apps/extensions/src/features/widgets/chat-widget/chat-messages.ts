import { createCollection, localOnlyCollectionOptions } from '@tanstack/react-db';
import { z } from 'zod';

export const ANNOUNCEMENT_COLORS = ['PRIMARY', 'BLUE', 'GREEN', 'ORANGE', 'PURPLE'] as const;

const schema = z.object({
  id: z.string(),
  user: z.string(),
  message: z.string(),
  platform: z.enum(['twitch', 'kick']),
  timestamp: z.date(),
  color: z.string().optional(),
  badges: z.array(z.string()).optional(),
  emotes: z.string().optional(),
  receivedAt: z.date(),
  /** The lowercase name bans and allow-lists go by: Twitch's login, Kick's username. */
  userLower: z.string().optional(),
  deletedAt: z.date().optional(),
  variant: z.enum(['announcement', 'highlighted']).optional(),
  announcementColor: z.enum(ANNOUNCEMENT_COLORS).optional(),
  firstMessage: z.boolean().optional(),
  replyTo: z
    .object({ user: z.string(), login: z.string().optional(), message: z.string() })
    .optional(),
});

export type ChatMessagesType = z.infer<typeof schema>;
export type AnnouncementColor = (typeof ANNOUNCEMENT_COLORS)[number];

export const chatMessagesCollection = createCollection(
  localOnlyCollectionOptions({
    id: 'chat-messages',
    getKey: (item) => item.id,
    schema: schema,
  }),
);
