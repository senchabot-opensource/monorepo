'use server'

import { revalidateTag } from 'next/cache'

import { fetcher } from '../fetcher'
import {
  createCommandSchema,
  updateCommandSchema,
} from '../validations/command'

/**
 *
 * @param formData
 * @returns
 */
export async function createEntityCommand(
  formData: FormData,
): Promise<{ message: string }> {
  const parsed = createCommandSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    console.log('createEntityCommand =>', parsed.error.flatten().fieldErrors)
    throw new Error('Invalid submission!')
  }

  try {
    const { platform, platformEntityId, ...input } = parsed.data

    const params = new URLSearchParams({ platform, platformEntityId })
    await fetcher('/me/commands?' + params, {
      method: 'POST',
      body: JSON.stringify(input),
    })

    revalidateTag(`getEntityCommands-${platformEntityId}-custom`)

    return {
      message: 'Successfully!',
    }
  } catch (error) {
    console.log('createEntityCommand =>', error)
    throw new Error('Something went wrong!')
  }
}

/**
 *
 * @param formData
 * @returns
 */
export async function updateEntityCommand(
  formData: FormData,
): Promise<{ message: string }> {
  const parsed = updateCommandSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    console.log('updateEntityCommand =>', parsed.error.flatten().fieldErrors)
    throw new Error('Invalid submission!')
  }

  try {
    const { id, platform, platformEntityId, ...input } = parsed.data

    const params = new URLSearchParams({ platform, platformEntityId })
    await fetcher(`/me/commands/${id}?` + params, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })

    revalidateTag(`getEntityCommands-${platformEntityId}-custom`)

    return {
      message: 'Successfully!',
    }
  } catch (error) {
    console.log('updateEntityCommand =>', error)
    throw new Error('Something went wrong!')
  }
}

/**
 *
 * @param id
 * @param platform
 * @param platformEntityId
 * @param status
 * @returns
 */
export async function updateEntityCommandStatus(
  id: number,
  platform: Platform,
  platformEntityId: string,
  status: boolean,
): Promise<{ message: string }> {
  try {
    const params = new URLSearchParams({ platform, platformEntityId })
    await fetcher(`/me/commands/${id}?` + params, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })

    return {
      message: 'Successfully!',
    }
  } catch (error) {
    console.log('updateEntityCommandStatus =>', error)
    throw new Error('Something went wrong!')
  }
}

/**
 *
 * @param id
 * @param platform
 * @param platformEntityId
 * @returns
 */
export async function deleteEntityCommand(
  id: number,
  platform: Platform,
  platformEntityId: string,
): Promise<{ message: string }> {
  try {
    const params = new URLSearchParams({ platform, platformEntityId })
    await fetcher(`/me/commands/${id}?` + params, {
      method: 'DELETE',
    })

    revalidateTag(`getEntityCommands-${platformEntityId}-custom`)

    return {
      message: 'Successfully!',
    }
  } catch (error) {
    console.log('deleteEntityCommand =>', error)
    throw new Error('Something went wrong!')
  }
}
