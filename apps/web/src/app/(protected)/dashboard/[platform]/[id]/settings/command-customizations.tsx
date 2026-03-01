import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { getEntitySettings } from '@/services/queries/settings'

import type { Platform } from '@/types/platform'
import { BOT_SETTING_LABELS, type BotSettingKey } from '@/types/settings'

import { SettingSwitch } from './setting-switch'
import { SettingTextInput } from './setting-text-input'

interface Props {
  platform: Platform
  id: string
}

export async function CommandCustomizations({ platform, id }: Props) {
  const settings = await getEntitySettings(platform, id)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Command Customizations</CardTitle>
        <CardDescription>
          Customize system commands content for this{' '}
          {platform === 'discord' ? 'server' : 'channel'}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No settings available.
          </p>
        ) : (
          settings.filter((setting) => setting.key === 'so_command_message_format').map((setting) => {
            const settingInfo = BOT_SETTING_LABELS[setting.key as BotSettingKey]
            return (
                <div
                  key={setting.key}
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="space-y-0.5">
                    <label htmlFor={setting.key} className="text-sm font-medium leading-none">
                      {settingInfo?.label || setting.key}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {settingInfo?.description || `Configure ${setting.key}`}
                    </p>
                  </div>
                  <SettingTextInput
                    platform={platform}
                    platformEntityId={id}
                    settingKey={setting.key}
                    initialValue={setting.value}
                  />
                </div>
              )
            }
          )
        )}
      </CardContent>
    </Card>
  )
}
