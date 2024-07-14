import NextAuth from 'next-auth'
import Discord from 'next-auth/providers/discord'
import Twitch from 'next-auth/providers/twitch'

import { PrismaAdapter } from '@auth/prisma-adapter'

import { linkEntity } from '@/services/entities/actions'

import { prisma } from './db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Twitch, Discord],
  events: {
    linkAccount: ({ account, user }) => {
      linkEntity({
        provider: account.provider as 'twitch' | 'discord',
        providerAccountId: account.providerAccountId,
        userId: user.id!,
      })
    },
  },
  pages: {
    signIn: '/signin',
    signOut: '/signout',
    error: '/signin',
  },
})
