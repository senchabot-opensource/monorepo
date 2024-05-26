import { z } from 'zod'

import { platform } from '.'

export const createCommandSchema = z.object({
  platform: platform,
  platformEntityId: z.string().min(1),
  command_name: z
    .string()
    .min(1)
    .refine((value) => !value.includes(' ')),
  command_content: z.string().min(1),
  status: z.coerce.boolean(),
})

export const updateCommandSchema = z.object({
  id: z.string(),
  platform: platform,
  platformEntityId: z.string().min(1),
  command_content: z.string().min(1),
  status: z.coerce.boolean(),
})
