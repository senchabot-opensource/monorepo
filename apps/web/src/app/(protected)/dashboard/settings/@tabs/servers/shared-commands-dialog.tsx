'use client'

import { useState, useTransition } from 'react'

import { LoaderIcon, Share2Icon } from 'lucide-react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { updateSettings } from '@/services/actions/settings'

import type { Platform } from '@/types/platform'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  newPlatform: Platform
  newPlatformEntityId: string
  existingPlatforms: Array<{
    platform: Platform
    platformEntityId: string
  }>
}

export function SharedCommandsDialog({
  open,
  onOpenChange,
  newPlatform,
  newPlatformEntityId,
  existingPlatforms,
}: Props) {
  const [pending, startTransition] = useTransition()

  const handleEnable = () => {
    startTransition(async () => {
      const allPlatforms = [
        ...existingPlatforms,
        { platform: newPlatform, platformEntityId: newPlatformEntityId },
      ]

      const settingsToUpdate = allPlatforms.map((p) => ({
        key: 'use_shared_command',
        value: 'true',
      }))

      for (const p of allPlatforms) {
        const [, error] = await updateSettings({
          platform: p.platform,
          platformEntityId: p.platformEntityId,
          settings: settingsToUpdate,
        })

        if (error) {
          toast.error(`Failed to enable shared commands for ${p.platform}`)
          return
        }
      }

      toast.success('Shared commands enabled across all platforms!')
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2Icon className="size-5" />
            Enable Shared Commands?
          </DialogTitle>
          <DialogDescription>
            You now have bots on multiple platforms. Would you like to enable
            shared commands? This allows commands to work across both Discord
            and Twitch.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Not Now
          </Button>
          <Button onClick={handleEnable} disabled={pending}>
            {pending ? <LoaderIcon className="mr-2 animate-spin" /> : null}
            Yes, Enable Shared Commands
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
