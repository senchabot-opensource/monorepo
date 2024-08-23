'use server'

import { revalidateTag } from 'next/cache'

import { ZSAError, createServerAction } from 'zsa'

import { ApiError, fetcher } from '@/lib/fetcher'

import {
  createCommandSchema,
  deleteCommandSchema,
  setCommandStatusSchema,
  updateCommandSchema,
} from '../schemas/commands'

/**
 *
 */
export const createCommand = createServerAction()
  .input(createCommandSchema, {
    type: 'formData',
  })
  .handler(async ({ input }) => {
    try {
      const params = new URLSearchParams()
      params.append('platform', input.platform)
      params.append('platformEntityId', input.platformEntityId)

      await fetcher('/me/commands?' + params, {
        method: 'POST',
        body: JSON.stringify(input),
      })

      revalidateTag(`getEntityCommands-${input.platformEntityId}-custom`)
    } catch (error) {
      console.error('updateEntityCommand =>', error)
      if (error instanceof ApiError) {
        if (error.status === 409) {
          throw new ZSAError('CONFLICT', 'This command already exists!')
        }
      }
      throw new ZSAError('ERROR', 'Something went wrong!')
    }
  })

/**
 *
 */
export const updateCommand = createServerAction()
  .input(updateCommandSchema, {
    type: 'formData',
  })
  .handler(async ({ input }) => {
    try {
      const params = new URLSearchParams()
      params.append('platform', input.platform)
      params.append('platformEntityId', input.platformEntityId)

      await fetcher(`/me/commands/${input.id}?` + params, {
        method: 'PATCH',
        body: JSON.stringify(input),
      })
    } catch (error) {
      console.error('updateEntityCommand =>', error)
      throw new ZSAError('ERROR', 'Something went wrong!')
    }
  })

/**
 *
 */
export const setCommandStatus = createServerAction()
  .input(setCommandStatusSchema)
  .handler(async ({ input }) => {
    try {
      const params = new URLSearchParams()
      params.append('platform', input.platform)
      params.append('platformEntityId', input.platformEntityId)

      await fetcher(`/me/commands/${input.id}?` + params, {
        method: 'PATCH',
        body: JSON.stringify(input),
      })
    } catch (error) {
      console.error('setCommandStatus =>', error)
      throw new ZSAError('ERROR', 'Something went wrong!')
    }
  })

/**
 *
 */
export const deleteCommand = createServerAction()
  .input(deleteCommandSchema)
  .handler(async ({ input }) => {
    try {
      const params = new URLSearchParams()
      params.append('platform', input.platform)
      params.append('platformEntityId', input.platformEntityId)

      await fetcher(`/me/commands/${input.id}?` + params, {
        method: 'DELETE',
      })

      revalidateTag(`getEntityCommands-${input.platformEntityId}-custom`)
    } catch (error) {
      console.error('deleteCommand =>', error)
      throw new ZSAError('ERROR', 'Something went wrong!')
    }
  })
