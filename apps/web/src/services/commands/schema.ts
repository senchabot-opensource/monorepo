import { z } from 'zod'

import { platformEnum } from '../shared/schema'

export const createCommandSchema = z.object({
  platform: platformEnum,
  platformEntityId: z.string().min(1),
  command_name: z
    .string()
    .min(1)
    .refine((value) => !value.includes(' ')),
  command_content: z.string().min(1),
  status: z.coerce.boolean(),
})

export const updateCommandSchema = z.object({
  id: z.number(),
  platform: platformEnum,
  platformEntityId: z.string().min(1),
  command_content: z.string().min(1),
  status: z.coerce.boolean(),
})

export const setCommandStatusSchema = z.object({
  id: z.number(),
  platform: platformEnum,
  platformEntityId: z.string().min(1),
  status: z.coerce.boolean(),
})

export const deleteCommandSchema = z.object({
  id: z.number(),
  platform: platformEnum,
  platformEntityId: z.string().min(1),
})
