export type EventChannel = {
  id: number
  server_id: string
  channel_id: string
  created_at: string
  created_by: string
}

export type LivestreamAnnouncement = {
  id: number
  twitch_username: string
  twitch_user_id: string
  anno_channel_id: string
  anno_server_id: string
  anno_content: string | null
  last_anno_date: string | null
  type: number
  created_by: string
  created_at: string
}
