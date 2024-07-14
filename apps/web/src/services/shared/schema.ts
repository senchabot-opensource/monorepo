import { z } from 'zod'

export const platformEnum = z.enum(['twitch', 'discord'])
