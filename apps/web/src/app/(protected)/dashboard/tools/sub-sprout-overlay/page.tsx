import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import SubSproutOverlayClient from './sub-sprout-overlay-client'

interface SubSproutOverlayPageProps {
  searchParams: Promise<{ channel?: string }>
}

export default async function SubSproutOverlayPage({
  searchParams,
}: SubSproutOverlayPageProps) {
  const session = await auth()

  if (!session) {
    throw redirect('/signin')
  }

  const { channel } = await searchParams

  return <SubSproutOverlayClient initialChannel={channel} />
}
