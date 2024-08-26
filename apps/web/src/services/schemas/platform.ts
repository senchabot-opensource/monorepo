import { z } from 'zod'

export const platform = z.enum(['twitch', 'discord'])
