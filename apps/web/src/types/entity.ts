import type { Platform } from '@/types/platform'

export type EntityLog = {
  id: string
  author: string
  author_id: string
  activity: string
  activity_date: Date
  platform: Platform
  platform_entity_id: string
}
