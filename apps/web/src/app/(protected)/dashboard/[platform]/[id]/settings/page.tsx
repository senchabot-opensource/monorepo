import { Suspense } from 'react'

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { LoaderIcon } from '@/components/ui/icons'

import { auth } from '@/lib/auth'

import type { Platform } from '@/types/platform'

import { GeneralSettingsList } from './general-settings-list'
import { CommandCustomizations } from './command-customizations'

export const metadata: Metadata = {
  title: 'Bot Settings',
}

interface Props {
  params: Promise<{
    platform: Platform
    id: string
  }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const session = await auth()

  if (!session) {
    throw redirect('/signin')
  }

  if (!['twitch', 'discord'].includes(params.platform)) {
    throw redirect('/dashboard')
  }

  if (params.platform === 'discord') {
    throw redirect('/dashboard')
  }

  return (
    <div className="max-w-screen-lg space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">
          {params.platform.charAt(0).toUpperCase() + params.platform.slice(1)}{' '}
          Bot Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure bot settings for your{' '}
          {/*params.platform === 'discord' ? 'server' : */ 'channel'}.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8">
        <Suspense
          fallback={
            <div className="flex justify-center">
              <LoaderIcon />
            </div>
          }
        >
          <GeneralSettingsList platform={params.platform} id={params.id} />
          <CommandCustomizations platform={params.platform} id={params.id} />
        </Suspense>
      </div>
    </div>
  )
}
