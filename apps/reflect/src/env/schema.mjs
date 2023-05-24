// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  TWITCH_CLIENT_ID: z.string(),
  TWITCH_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  TWITCH_BOT_HOST: z.string(),
  WEBHOOK_TOKEN: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  // NEXT_PUBLIC_BAR: z.string(),
  NEXT_PUBLIC_APP_NAME: z.string(),
  NEXT_PUBLIC_APP_URL: z.string(),
  NEXT_PUBLIC_APP_VERSION: z.string(),
  NEXT_PUBLIC_APP_GITHUB_PROFILE: z.string(),
  NEXT_PUBLIC_APP_TWITTER_PROFILE: z.string(),
  NEXT_PUBLIC_APP_DOMAIN_STRING: z.string(),
  NEXT_PUBLIC_APP_CONTENT_STRING: z.string(),
  NEXT_PUBLIC_APP_DISCORD_BOT_INVITE_URL: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  // NEXT_PUBLIC_BAR: process.env.NEXT_PUBLIC_BAR,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  NEXT_PUBLIC_APP_GITHUB_PROFILE: process.env.NEXT_PUBLIC_APP_GITHUB_PROFILE,
  NEXT_PUBLIC_APP_TWITTER_PROFILE: process.env.NEXT_PUBLIC_APP_TWITTER_PROFILE,
  NEXT_PUBLIC_APP_DOMAIN_STRING: process.env.NEXT_PUBLIC_APP_DOMAIN_STRING,
  NEXT_PUBLIC_APP_CONTENT_STRING: process.env.NEXT_PUBLIC_APP_CONTENT_STRING,
  NEXT_PUBLIC_APP_DISCORD_BOT_INVITE_URL:
    process.env.NEXT_PUBLIC_APP_DISCORD_BOT_INVITE_URL,
};
