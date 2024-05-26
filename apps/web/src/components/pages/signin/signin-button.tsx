'use client'

import { useState } from 'react'

import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { DiscordIcon, LoaderIcon, TwitchIcon } from '@/components/ui/icons'

interface Props {
  platform: Platform
  label: string
  callbackUrl?: string
  isDisabled?: boolean
}

export function SignInButton({
  platform,
  label,
  callbackUrl,
  isDisabled = false,
}: Props) {
  const [pending, setPending] = useState<boolean>(false)

  return (
    <Button
      className="w-full"
      variant="outline"
      onClick={async (e) => {
        e.preventDefault()
        setPending(true)
        await signIn(
          platform,
          { callbackUrl: callbackUrl },
          platform === 'discord' &&
            new URLSearchParams({
              scope: ['identify', 'email', 'guilds'].join(' '),
            }),
        )
      }}
      disabled={pending || isDisabled}
    >
      {pending ? (
        <LoaderIcon />
      ) : platform === 'twitch' ? (
        <TwitchIcon />
      ) : (
        <DiscordIcon />
      )}
      <span>{label}</span>
    </Button>
  )
}
