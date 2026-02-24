'use server'

import { revalidateTag } from 'next/cache'

import { ZSAError, createServerAction } from 'zsa'

import { RateLimitError, fetcher } from '@/lib/fetcher'

import { updateSettingSchema, updateSettingsSchema } from '../schemas/settings'

/**
 * Update a single bot setting
 */
export const updateSetting = createServerAction()
  .input(updateSettingSchema)
  .handler(async ({ input }) => {
    try {
      const params = new URLSearchParams()
      params.append('platform', input.platform)
      params.append('platformEntityId', input.platformEntityId)

      await fetcher('/me/platforms/settings?' + params, {
        method: 'PUT',
        body: JSON.stringify([
          {
            key: input.key,
            value: input.value,
          },
        ]),
      })

      revalidateTag(`getEntitySettings-${input.platformEntityId}`)
    } catch (error) {
      console.error('updateSetting =>', error)
     
      throw new ZSAError('ERROR', 'Something went wrong!')
    }
  })

/**
 * Update multiple bot settings at once
 */
export const updateSettings = createServerAction()
  .input(updateSettingsSchema)
  .handler(async ({ input }) => {
    try {
      const params = new URLSearchParams()
      params.append('platform', input.platform)
      params.append('platformEntityId', input.platformEntityId)

      await fetcher('/me/platforms/settings?' + params, {
        method: 'PUT',
        body: JSON.stringify(input.settings),
      })

      revalidateTag(`getEntitySettings-${input.platformEntityId}`)
    } catch (error) {
      console.error('updateSettings =>', error)
     
      throw new ZSAError('ERROR', 'Something went wrong!')
    }
  })
