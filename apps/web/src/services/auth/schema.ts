import { z } from 'zod'

import { platformEnum } from '../shared/schema'

export const signInWithProviderSchema = z.object({
  provider: platformEnum,
  redirectTo: z.string().min(1),
})
