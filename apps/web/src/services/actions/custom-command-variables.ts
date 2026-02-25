'use server'

import { revalidateTag } from 'next/cache'

import { ZSAError, createServerAction } from 'zsa'

import { ApiError, fetcher } from '@/lib/fetcher'

import {
  createCustomCommandVariableSchema,
  deleteCustomCommandVariableSchema,
  updateCustomCommandVariableSchema,
} from '../schemas/custom-command-variables'

/**
 *
 */
export const createCustomCommandVariable = createServerAction()
  .input(createCustomCommandVariableSchema, {
    type: 'formData',
  })
  .handler(async ({ input }) => {
    try {
      const params = new URLSearchParams()
      params.append('platform', input.platform)
      params.append('platformEntityId', input.platformEntityId)

      await fetcher('/me/commands/variables?' + params, {
        method: 'POST',
        body: JSON.stringify(input),
      })

      revalidateTag(
        `getCustomCommandVariables-${input.platformEntityId}`,
      )
    } catch (error) {
      console.error('createCustomCommandVariable =>', error)
      if (error instanceof ApiError) {
        if (error.status === 409) {
          throw new ZSAError('CONFLICT', 'This variable already exists!')
        }
      }
      throw new ZSAError('ERROR', 'Something went wrong!')
    }
  })

/**
 *
 */
export const updateCustomCommandVariable = createServerAction()
  .input(updateCustomCommandVariableSchema)
  .handler(async ({ input }) => {
    try {
      const params = new URLSearchParams()
      params.append('platform', input.platform)
      params.append('platformEntityId', input.platformEntityId)

      await fetcher(`/me/commands/variables/${input.id}?` + params, {
        method: 'PATCH',
        body: JSON.stringify(input),
      })

      revalidateTag(
        `getCustomCommandVariables-${input.platformEntityId}`,
      )
    } catch (error) {
      console.error('updateCustomCommandVariable =>', error)
      throw new ZSAError('ERROR', 'Something went wrong!')
    }
  })

/**
 *
 */
export const deleteCustomCommandVariable = createServerAction()
  .input(deleteCustomCommandVariableSchema)
  .handler(async ({ input }) => {
    try {
      const params = new URLSearchParams()
      params.append('platform', input.platform)
      params.append('platformEntityId', input.platformEntityId)

      await fetcher(`/me/commands/variables/${input.id}?` + params, {
        method: 'DELETE',
      })

      revalidateTag(
        `getCustomCommandVariables-${input.platformEntityId}`,
      )
    } catch (error) {
      console.error('deleteCustomCommandVariable =>', error)
      throw new ZSAError('ERROR', 'Something went wrong!')
    }
  })
