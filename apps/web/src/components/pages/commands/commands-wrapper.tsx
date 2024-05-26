import { Suspense } from 'react'

import { redirect } from 'next/navigation'

import { Commands } from '@/components/pages/commands/commands'
import { LoaderIcon } from '@/components/ui/icons'

import { auth } from '@/lib/auth'

interface Props {
  platform: Platform
  id: string
  type: CommandType
}

export default async function CommandsWrapper({ platform, id, type }: Props) {
  const session = await auth()

  if (!session) {
    redirect('/signin')
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center">
          <LoaderIcon />
        </div>
      }
      key={Math.random()}
    >
      <Commands platform={platform} id={id} type={type} />
    </Suspense>
  )
}
