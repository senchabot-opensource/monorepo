import { Suspense } from 'react'

import { Commands } from '@/components/pages/commands/commands'
import { LoaderIcon } from '@/components/ui/icons'

interface Props {
  platform: Platform
  id: string
  type: CommandType
}

export default async function CommandsWrapper({ platform, id, type }: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center">
          <LoaderIcon />
        </div>
      }
    >
      <Commands platform={platform} id={id} type={type} />
    </Suspense>
  )
}
