import NextAuth from 'next-auth'
import Discord from 'next-auth/providers/discord'
import Twitch from 'next-auth/providers/twitch'

import { PrismaAdapter } from '@auth/prisma-adapter'

import { prisma } from './db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Twitch, Discord],
  pages: {
    signIn: '/signin',
    signOut: '/signout',
    error: '/signin',
  },
})
