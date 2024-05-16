type Platform = 'twitch' | 'discord'
type CommandType = 'custom' | 'global'

type UserAccount = {
  user_id: string
  account_username: string
  provider: Platform
  provider_account_id: string
  created_at: Date
  updated_at: Date
}

type UserEntity = {
  entity_name: string
  entity_icon: string
  entity_owner_id: string
  entity_bot_joined: boolean
  platform: Platform
  platform_entity_id: string
}

type EntityCommand = {
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
