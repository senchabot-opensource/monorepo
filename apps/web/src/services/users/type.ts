import type { Platform } from '../shared/type'

export type UserAccount = {
  user_id: string
  account_username: string
  provider: Platform
  provider_account_id: string
  created_at: Date
  updated_at: Date
}

export type UserEntity = {
  entity_name: string
  entity_icon: string
  entity_owner_id: string
  entity_bot_joined: boolean
  platform: Platform
  platform_entity_id: string
}
