export type RafflePlatform = 'twitch' | 'kick'

export type RaffleStatus = 'idle' | 'running' | 'stopped'

export interface RaffleConfig {
  platform: RafflePlatform
  channel: string
  keyword: string
  subscribersOnly: boolean
  minSubMonths: number
  allowMultipleWins: boolean
}

export interface RaffleParticipant {
  id: string
  username: string
  displayName?: string
  platform: RafflePlatform
  subMonths: number
  timestamp: number
}

export interface RaffleWinner {
  id: string
  username: string
  displayName?: string
  platform: RafflePlatform
  subMonths: number
  drawnAt: number
}

export interface RaffleState {
  status: RaffleStatus
  config: RaffleConfig
  participants: RaffleParticipant[]
  winners: RaffleWinner[]
}
