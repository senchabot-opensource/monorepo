import { Suspense } from 'react'

import { SubSproutOverlay } from '@/components/sub-sprout-overlay'

interface SubSproutPageProps {
  searchParams: Promise<{ channel?: string }>
}

export default async function SubSproutPage({
  searchParams,
}: SubSproutPageProps) {
  const { channel } = await searchParams

  return (
    <div className="size-full min-h-screen bg-transparent">
      <Suspense fallback={<div className="size-full bg-transparent" />}>
        <SubSproutOverlay channel={channel ?? ''} />
      </Suspense>
    </div>
  )
}
