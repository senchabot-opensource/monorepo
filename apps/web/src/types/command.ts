import type { Platform } from './platform'

export type EntityCommand = {
  id: number
  name: string
  content: string
  status: boolean
  platform: Platform
  platform_entity_id: string
  type: number
  created_by: string
  updated_by: string
  created_at: string
}
