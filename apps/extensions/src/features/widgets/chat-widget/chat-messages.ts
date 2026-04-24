import { createCollection, localOnlyCollectionOptions } from '@tanstack/react-db';
import { z } from 'zod';

const schema = z.object({
  id: z.string(),
  user: z.string(),
  message: z.string(),
  platform: z.enum(['twitch', 'kick']),
  timestamp: z.date(),
  color: z.string().optional(),
  badges: z.array(z.string()).optional(),
  emotes: z.string().optional(),
  receivedAt: z.date().optional(),
});

export type ChatMessagesType = z.infer<typeof schema>;

export const chatMessagesCollection = createCollection(
  localOnlyCollectionOptions({
    id: 'chat-messages',
    getKey: (item) => item.id,
    schema: schema,
  }),
);
