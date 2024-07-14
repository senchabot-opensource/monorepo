'use client'

import { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { DiscordIcon, LoaderIcon, TwitchIcon } from '@/components/ui/icons'

import { signInWithProvider } from '@/services/auth/actions'

interface Props {
  provider: 'twitch' | 'discord'
  isDisabled?: boolean
}

export function SignInButton({ provider, isDisabled = false }: Props) {
  const [pending, startTrantision] = useTransition()

  return (
    <Button
      className="w-full"
      variant="outline"
      onClick={async (e) => {
        e.preventDefault()
        startTrantision(async () => {
          await signInWithProvider({ provider, redirectTo: '/dashboard' })
        })
      }}
      disabled={pending || isDisabled}
    >
      {pending ? (
        <LoaderIcon />
      ) : provider === 'twitch' ? (
        <TwitchIcon />
      ) : (
        <DiscordIcon />
      )}
      <span className="capitalize">Continue with {provider}</span>
    </Button>
  )
}
