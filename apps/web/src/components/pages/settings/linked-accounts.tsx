import { SignInButton } from '@/components/pages/signin/signin-button'
import { DiscordIcon, TwitchIcon } from '@/components/ui/icons'

import { formatDate } from '@/lib/utils'

import { getUserAccounts } from '@/data-layer/queries/user'

export async function LinkedAccounts() {
  const accounts = await getUserAccounts()

  const findTwitchAcc = accounts.find((item) => item.provider === 'twitch')
  const findDiscordAcc = accounts.find((item) => item.provider === 'discord')

  return (
    <ul className="flex flex-col space-y-2">
      {findTwitchAcc ? (
        <li className="flex select-none items-center justify-between space-x-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <TwitchIcon className="size-4" />
            <span>{findTwitchAcc.account_username}</span>
          </div>
          <span>Linked at {formatDate(findTwitchAcc.created_at)}</span>
        </li>
      ) : (
        <li className="max-w-52">
          <SignInButton
            platform="twitch"
            label="Link Twitch Account"
            callbackUrl="/dashboard/settings"
          />
        </li>
      )}
      {findDiscordAcc ? (
        <li className="flex select-none items-center justify-between space-x-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <DiscordIcon className="size-4" />
            <span>{findDiscordAcc.account_username}</span>
          </div>
          <span>Linked at {formatDate(findDiscordAcc.created_at)}</span>
        </li>
      ) : (
        <li className="max-w-52">
          <SignInButton
            platform="discord"
            label="Link Discord Account"
            callbackUrl="/dashboard/settings"
          />
        </li>
      )}
    </ul>
  )
}
