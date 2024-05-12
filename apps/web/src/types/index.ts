type Platform = 'twitch' | 'discord'

type UserAccount = {
  provider: Platform
  provider_account_id: string
  user_id: string
}

type UserEntity = {
  entity_name: string
  entity_icon: string
  entity_owner_id: string
  entity_bot_joined: boolean
  platform: Platform
  platform_entity_id: string
}
