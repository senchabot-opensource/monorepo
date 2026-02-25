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

interface Props {
  platform: Platform
  id: string
}

export async function SettingsList({ platform, id }: Props) {
  const settings = await getEntitySettings(platform, id)

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Toggle bot features on or off for this{' '}
          {platform === 'discord' ? 'server' : 'channel'}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No settings available.
          </p>
        ) : (
          settings.map((setting) => {
            const settingInfo = BOT_SETTING_LABELS[setting.key as BotSettingKey]
            return (
              <div
                key={setting.key}
                className="flex items-center justify-between space-x-4"
              >
                <div className="space-y-0.5">
                  <label
                    htmlFor={setting.key}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {settingInfo?.label || setting.key}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {settingInfo?.description || `Configure ${setting.key}`}
                  </p>
                </div>
                <SettingSwitch
                  platform={platform}
                  platformEntityId={id}
                  settingKey={setting.key}
                  initialValue={setting.value === 'true'}
                />
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
