import type { Platform } from './platform'

export type BotSetting = {
  key: string
  value: string
  platform: Platform
  platform_entity_id: string
}

export type BotSettingKey = 'bot_activity_enabled' | 'mods_manage_cmds_enabled'

export const BOT_SETTING_LABELS: Record<
  BotSettingKey,
  { label: string; description: string }
> = {
  bot_activity_enabled: {
    label: 'Bot Activity',
    description: 'Enable or disable bot activity logging',
  },
  mods_manage_cmds_enabled: {
    label: 'Mods Manage Commands',
    description: 'Allow moderators to manage commands',
  },
}
