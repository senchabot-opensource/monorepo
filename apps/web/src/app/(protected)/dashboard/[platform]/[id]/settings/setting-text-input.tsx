'use client'

import { useState, useTransition } from 'react'

import { Input } from '@/components/ui/input'

import { updateSetting } from '@/services/actions/settings'
import type { Platform } from '@/types/platform'

interface Props { 
    platform: Platform
    platformEntityId: string
    settingKey: string
    initialValue: string
}   

export function SettingTextInput({
    platform,
    platformEntityId,
    settingKey,
    initialValue,
}: Props) {
    const [value, setValue] = useState(initialValue)
    const [isPending, startTransition] = useTransition()

    const handleBlur = (newValue: string) => {
        startTransition(async () => {
            const [, error] = await updateSetting({ 
                platform,
                platformEntityId,
                key: settingKey,
                value: newValue,
            })

            if (error) {
                // Revert on error
                setValue(initialValue)
                console.error('Failed to update setting:', error)
            }
        })
    } 
    
    return (
        <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={(e) => handleBlur(e.target.value)}
            disabled={isPending}
        />
    )
}