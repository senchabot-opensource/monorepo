// @ts-ignore
import { env } from 'cloudflare:workers';
import crypto from 'node:crypto';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

export const pusherAuth = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      socketId: z.string(),
      channelName: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const { socketId, channelName } = data;
    // @ts-ignore
    const { VITE_SOCKETO_KEY: key, SOCKETO_SECRET: secret } = env || {};

    if (!key || !secret) {
      throw new Error('VITE_SOCKETO_KEY or SOCKETO_SECRET not configured');
    }

    const hexSignature = crypto
      .createHmac('sha256', secret)
      .update(`${socketId}:${channelName}`)
      .digest('hex');

    return { auth: `${key}:${hexSignature}` };
  });
