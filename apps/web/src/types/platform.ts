import { z } from 'zod'

import { platform } from '@/services/schemas/platform'

export type Platform = z.infer<typeof platform>
