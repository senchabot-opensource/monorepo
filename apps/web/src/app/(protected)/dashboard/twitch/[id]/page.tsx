import type { Metadata } from 'next'

import { OverviewView } from '@/components/pages/overview/overview-view'

export const metadata: Metadata = {
  title: 'Overview',
}

interface Props {
  params: {
    id: string
  }
}

export default function Page({ params }: Props) {
  return <OverviewView platform="twitch" id={params.id} />
}
