import { CheckCircle } from 'lucide-react'

import { DiscordIcon, TwitchIcon } from '@/components/ui/icons'

import { formatDate } from '@/lib/utils'

import { getUserAccounts } from '@/data-layer/queries/user'

import { LinkAccount } from './link-account'

export async function LinkedAccounts() {
  const accounts = await getUserAccounts()

  const findTwitchAcc = accounts.find((item) => item.provider === 'twitch')
  const findDiscordAcc = accounts.find((item) => item.provider === 'discord')

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col space-y-4 rounded-md border bg-secondary/25 p-4">
        <div className="flex h-8 items-center justify-between">
          <div className="flex items-center space-x-2">
            <TwitchIcon className="size-4" />
            <span className="text-sm font-medium">Twitch</span>
          </div>
          {findTwitchAcc ? (
            <span className="text-sm text-muted-foreground">
              {formatDate(findTwitchAcc.created_at)}
            </span>
          ) : (
            <LinkAccount platform="twitch" />
          )}
        </div>
        <div className="flex items-center space-x-2">
          {findTwitchAcc ? (
            <>
              <CheckCircle className="size-4 text-green-600" />
              <span className="text-sm">
                Connected as {findTwitchAcc.account_username}
              </span>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Recusandae blanditiis incidunt saepe amet facilis optio odit nam.
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-4 rounded-md border bg-secondary/25 p-4">
        <div className="flex h-8 items-center justify-between">
          <div className="flex items-center space-x-2">
            <DiscordIcon className="size-4" />
            <span className="text-sm font-medium">Discord</span>
          </div>
          {findDiscordAcc ? (
            <span className="text-sm text-muted-foreground">
              {formatDate(findDiscordAcc.created_at)}
            </span>
          ) : (
            <LinkAccount platform="discord" />
          )}
        </div>
        <div className="flex items-center space-x-2">
          {findDiscordAcc ? (
            <>
              <CheckCircle className="size-4 text-green-600" />
              <span className="text-sm">
                Connected as {findDiscordAcc.account_username}
              </span>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Recusandae blanditiis incidunt saepe amet facilis optio odit nam.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
