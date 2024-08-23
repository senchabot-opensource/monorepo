'use client'

import { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { LoaderIcon } from '@/components/ui/icons'

import { signInWithProvider } from '@/services/actions/auth'

interface Props {
  provider: 'twitch' | 'discord'
}

export function LinkAccount({ provider }: Props) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={(e) => {
        e.preventDefault()
        startTransition(async () => {
          await signInWithProvider({
            provider,
            redirectTo: '/dashboard/settings',
          })
        })
      }}
      disabled={pending}
    >
      {pending ? <LoaderIcon /> : <span>Connect</span>}
    </Button>
  )
}
