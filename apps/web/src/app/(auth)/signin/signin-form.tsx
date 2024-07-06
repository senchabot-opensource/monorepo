'use client'

import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Link } from '@/components/ui/link'

import { SignInButton } from './signin-button'

const legalLinks = [
  {
    label: 'Privacy Policy',
    href: '/privacy-policy',
  },
  {
    label: 'Terms of Service',
    href: '/terms-of-service',
  },
  {
    label: 'Cookie Policy',
    href: '/cookie-policy',
  },
  {
    label: 'EULA',
    href: '/eula',
  },
]

export function SignInForm() {
  const [checked, setChecked] = useState<boolean>(false)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <SignInButton provider="twitch" isDisabled={!checked} />
        <SignInButton provider="discord" isDisabled={!checked} />
      </div>
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
            {legalLinks.map((item) => (
              <span
                className='after:mr-1 after:content-[","] after:last:content-none'
                key={item.href}
              >
                <Link
                  className="hover:text-foreground"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  )
}
