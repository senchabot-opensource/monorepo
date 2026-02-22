import { z } from 'zod'

import { platform } from './platform'

export const updateSettingSchema = z.object({
  platform: platform,
  platformEntityId: z.string().min(1),
  key: z.string().min(1),
  value: z.string(),
})

export const updateSettingsSchema = z.object({
  platform: platform,
  platformEntityId: z.string().min(1),
  settings: z.array(
    z.object({
      key: z.string().min(1),
      value: z.string(),
    }),
  ),
})
