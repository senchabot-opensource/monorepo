import type { Platform } from './platform'

export type CustomCommandVariable = {
  id: number
  name: string
  value: string
  platform: Platform
  platform_entity_id: string
  created_at: string
  updated_at: string
}
