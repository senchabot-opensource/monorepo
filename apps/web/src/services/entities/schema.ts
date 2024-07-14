import { z } from 'zod'

import { platformEnum } from '../shared/schema'

export const linkEntitySchema = z.object({
  provider: platformEnum,
  providerAccountId: z.string().min(1),
  userId: z.string().min(1),
})

export const executeEntityActionSchema = z.object({
  action: z.enum(['join', 'depart']),
  platform: platformEnum,
  platformEntityId: z.string().min(1),
})
