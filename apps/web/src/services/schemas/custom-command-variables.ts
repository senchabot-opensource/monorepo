import { z } from 'zod'

import { platform } from './platform'

export const createCustomCommandVariableSchema = z.object({
  platform: platform,
  platformEntityId: z.string().min(1),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name is too long')
    .refine((val) => !val.includes('{') && !val.includes('}'), {
      message: "Name cannot contain { or } characters",
    }),
  value: z
    .string()
    .min(1, 'Value is required')
    .max(5000, 'Value is too long'),
})

export const updateCustomCommandVariableSchema = z.object({
  id: z.number(),
  platform: platform,
  platformEntityId: z.string().min(1),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name is too long')
    .refine((val) => !val.includes('{') && !val.includes('}'), {
      message: "Name cannot contain { or } characters",
    })
    .optional(),
  value: z
    .string()
    .min(1, 'Value is required')
    .max(5000, 'Value is too long')
    .optional(),
})

export const deleteCustomCommandVariableSchema = z.object({
  id: z.number(),
  platform: platform,
  platformEntityId: z.string().min(1),
})
