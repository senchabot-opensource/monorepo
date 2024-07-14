import { z } from 'zod'

import { platformEnum } from './schema'

export type Platform = z.infer<typeof platformEnum>
