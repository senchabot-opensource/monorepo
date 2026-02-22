'use client'

import { useState, useTransition } from 'react'

import { Switch } from '@/components/ui/switch'

import { updateSetting } from '@/services/actions/settings'

import type { Platform } from '@/types/platform'

interface Props {
  platform: Platform
  platformEntityId: string
  settingKey: string
  initialValue: boolean
}

export function SettingSwitch({
  platform,
  platformEntityId,
  settingKey,
  initialValue,
}: Props) {
  const [checked, setChecked] = useState(initialValue)
  const [isPending, startTransition] = useTransition()

  const handleCheckedChange = (newChecked: boolean) => {
    setChecked(newChecked)
    startTransition(async () => {
      const [, error] = await updateSetting({
        platform,
        platformEntityId,
        key: settingKey,
        value: newChecked ? 'true' : 'false',
      })

      if (error) {
        // Revert on error
        setChecked(!newChecked)
        console.error('Failed to update setting:', error)
      }
    })
  }

  return (
    <Switch
      id={settingKey}
      checked={checked}
      onCheckedChange={handleCheckedChange}
      disabled={isPending}
    />
  )
}
