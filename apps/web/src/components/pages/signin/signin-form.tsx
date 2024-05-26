'use client'

import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Link } from '@/components/ui/link'

import { cn } from '@/lib/utils'

import { SignInButton } from './signin-button'

const platforms: {
  platform: Platform
  label: string
}[] = [
  {
    platform: 'twitch',
    label: 'Continue with Twitch',
  },
  {
    platform: 'discord',
    label: 'Continue with Discord',
  },
]

export function SignInForm() {
  const [checked, setChecked] = useState<boolean>(false)

  return (
    <div className="space-y-6">
      <ul className={cn('flex flex-col space-y-2')}>
        {platforms.map((item) => (
          <li key={item.platform}>
            <SignInButton
              platform={item.platform}
              label={item.label}
              callbackUrl="/dashboard"
              isDisabled={!checked}
            />
          </li>
        ))}
      </ul>
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={checked}
          onCheckedChange={() => setChecked((prev) => !prev)}
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor="terms">Accept terms and conditions</Label>
          <p className="text-sm text-muted-foreground">
            You agree to our{' '}
            <Link href="/privacy-policy" target="_blank" rel="noreferrer">
              Privacy Policy
            </Link>
            ,{' '}
            <Link href="/terms-of-service" target="_blank" rel="noreferrer">
              Terms of Service
            </Link>
            ,{' '}
            <Link href="/cookie-policy" target="_blank" rel="noreferrer">
              Cookie Policy
            </Link>{' '}
            and{' '}
            <Link href="/eula" target="_blank" rel="noreferrer">
              EULA
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
