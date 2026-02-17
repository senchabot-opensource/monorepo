'use client'

import { useState } from 'react'

import { CheckIcon, Share2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import type { Platform } from '@/types/platform'

interface Props {
  platform: Platform
  entityName?: string
}

export function ShareCommands({ platform, entityName }: Props) {
  const [copied, setCopied] = useState(false)

  // Only enable sharing for Twitch channels
  const canShare = platform === 'twitch' && !!entityName

  const handleShare = async () => {
    if (!canShare) return

    const shareUrl = `${window.location.origin}/commands/${encodeURIComponent(entityName)}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleShare}
      disabled={!canShare}
      title={
        !canShare && platform === 'discord'
          ? 'Sharing is only available for Twitch channels'
          : undefined
      }
    >
      {copied ? (
        <CheckIcon className="size-4" />
      ) : (
        <Share2Icon className="size-4" />
      )}
      <span>{copied ? 'Copied!' : 'Share'}</span>
    </Button>
  )
}
