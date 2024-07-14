'use server'

import { revalidateTag } from 'next/cache'

import { ZSAError, createServerAction } from 'zsa'

import { fetcher } from '@/lib/fetcher'

import { executeEntityActionSchema, linkEntitySchema } from './schema'

/**
 *
 */
export const linkEntity = createServerAction()
  .input(linkEntitySchema)
  .handler(async ({ input }) => {
    await fetcher('/platforms/link', {
      method: 'POST',
      body: JSON.stringify({
        provider: input.provider,
        provider_account_id: input.providerAccountId,
        user_id: input.userId,
      }),
    })
  })

/**
 *
 */
export const executeEntityAction = createServerAction()
  .input(executeEntityActionSchema)
  .handler(async ({ input }) => {
    try {
      const params = new URLSearchParams()
      params.append('platform', input.platform)
      params.append('platformEntityId', input.platformEntityId)

      await fetcher(`/me/platforms/actions/${input.action}?` + params, {
        method: 'POST',
      })

      revalidateTag('getUserEntities')
    } catch (error) {
      console.error('executeEntityAction => ', error)
      throw new ZSAError('ERROR', 'Something went wrong!')
    }
  })
