'use client'

import { useState } from 'react'

import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { LoaderIcon } from '@/components/ui/icons'

interface Props {
  platform: Platform
}

export function LinkAccount({ platform }: Props) {
  const [pending, setPending] = useState<boolean>(false)

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async (e) => {
        e.preventDefault()
        setPending(true)
        await signIn(
          platform,
          { callbackUrl: '/dashboard/settings' },
          platform === 'discord' &&
            new URLSearchParams({
              scope: ['identify', 'email', 'guilds'].join(' '),
            }),
        )
      }}
      disabled={pending}
    >
      {pending ? <LoaderIcon /> : <span>Connect</span>}
    </Button>
  )
}
