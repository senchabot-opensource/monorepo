type Platform = 'twitch' | 'discord'

type UserAccount = {
  provider: Platform
  provider_account_id: string
  user_id: string
}
