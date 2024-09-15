import { z } from 'zod'

import { platform } from './platform'

export const linkEntitySchema = z.object({
  provider: platform,
  providerAccountId: z.string().min(1),
  userId: z.string().min(1),
})

export const executeEntityActionSchema = z.object({
  action: z.enum(['join', 'depart']),
  platform: platform,
  platformEntityId: z.string().min(1),
})
