import { z } from 'zod'

import { platform } from './platform'

export const signInWithProviderSchema = z.object({
  provider: platform,
  redirectTo: z.string().min(1),
})
