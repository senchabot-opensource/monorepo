'use server'

import { createServerAction } from 'zsa'

import { signIn as _signIn, signOut as _signOut } from '@/lib/auth'

import { signInWithProviderSchema } from '../schemas/auth'

/**
 *
 */
export const signInWithProvider = createServerAction()
  .input(signInWithProviderSchema)
  .handler(async ({ input }) => {
    if (input.provider === 'twitch') {
      await _signIn(input.provider, { reditectTo: input.redirectTo })
    } else if (input.provider === 'discord') {
      await _signIn(
        input.provider,
        { reditectTo: input.redirectTo },
        { scope: ['identify', 'email', 'guilds'].join(' ') },
      )
    }
  })

/**
 *
 */
export const signOut = createServerAction().handler(async () => {
  await _signOut({ redirectTo: '/signin' })
})
