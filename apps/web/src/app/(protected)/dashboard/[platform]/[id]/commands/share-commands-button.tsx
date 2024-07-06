'use client'

import { Share2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ShareCommands() {
  return (
    <Button variant="secondary" size="sm" onClick={() => alert('Coming soon!')}>
      <Share2Icon className="size-4" />
      <span>Share</span>
    </Button>
  )
}
