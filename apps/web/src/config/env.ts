import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    // Database
    DATABASE_URL: z.string().url(),
    DATABASE_DIRECT_URL: z.string().url(),
    // Auth
    AUTH_SECRET: z.string(),
    AUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    // Auth Providers
    AUTH_TWITCH_ID: z.string(),
    AUTH_TWITCH_SECRET: z.string(),
    AUTH_DISCORD_ID: z.string(),
    AUTH_DISCORD_SECRET: z.string(),
    // API
    API_URL: z.string().url(),
    API_AUTHORIZATION_PREFIX: z.string(),
    // etc
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_DIRECT_URL: process.env.DATABASE_DIRECT_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    AUTH_TWITCH_ID: process.env.AUTH_TWITCH_ID,
    AUTH_TWITCH_SECRET: process.env.AUTH_TWITCH_SECRET,
    AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
    AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
    API_URL: process.env.API_URL,
    API_AUTHORIZATION_PREFIX: process.env.API_AUTHORIZATION_PREFIX,
    NODE_ENV: process.env.NODE_ENV,
  },
  emptyStringAsUndefined: true,
})
