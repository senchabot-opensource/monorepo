import type { Metadata } from 'next'

import CommandsWrapper from '@/components/pages/commands/commands-wrapper'

export const metadata: Metadata = {
  title: 'Custom Commands',
}

interface Props {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  return <CommandsWrapper platform="discord" id={params.id} type="custom" />
}
