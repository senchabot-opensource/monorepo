'use server'

import { revalidateTag } from 'next/cache'

import { ApiError, fetcher } from '../fetcher'
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
): Promise<{ success: boolean; message: string }> {
  try {
    const parsed = createCommandSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
      return {
        success: false,
        message: 'Invalid submission!',
      }
    }

    const { platform, platformEntityId, ...input } = parsed.data

    const params = new URLSearchParams({ platform, platformEntityId })
    await fetcher('/me/commands?' + params, {
      method: 'POST',
      body: JSON.stringify(input),
    })

    revalidateTag(`getEntityCommands-${platformEntityId}-custom`)

    return {
      success: true,
      message: 'Successfully!',
    }
  } catch (error) {
    console.log('createEntityCommand =>', error)
    if (error instanceof ApiError) {
      if (error.status === 409) {
        return {
          success: false,
          message: 'This command already exists.',
        }
      } else {
        return {
          success: false,
          message: 'Something went wrong!',
        }
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong!',
      }
    }
  }
}

/**
 *
 * @param formData
 * @returns
 */
export async function updateEntityCommand(
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  try {
    const parsed = updateCommandSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
      return {
        success: false,
        message: 'Invalid submission!',
      }
    }

    const { id, platform, platformEntityId, ...input } = parsed.data

    const params = new URLSearchParams({ platform, platformEntityId })
    await fetcher(`/me/commands/${id}?` + params, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })

    revalidateTag(`getEntityCommands-${platformEntityId}-custom`)

    return {
      success: true,
      message: 'Successfully!',
    }
  } catch (error) {
    console.log('updateEntityCommand =>', error)
    return {
      success: false,
      message: 'Something went wrong!',
    }
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
): Promise<{ success: boolean; message: string }> {
  try {
    const params = new URLSearchParams({ platform, platformEntityId })
    await fetcher(`/me/commands/${id}?` + params, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })

    return {
      success: true,
      message: 'Successfully!',
    }
  } catch (error) {
    console.log('updateEntityCommandStatus =>', error)
    return {
      success: false,
      message: 'Something went wrong!',
    }
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
): Promise<{ success: boolean; message: string }> {
  try {
    const params = new URLSearchParams({ platform, platformEntityId })
    await fetcher(`/me/commands/${id}?` + params, {
      method: 'DELETE',
    })

    revalidateTag(`getEntityCommands-${platformEntityId}-custom`)

    return {
      success: true,
      message: 'Successfully!',
    }
  } catch (error) {
    console.log('deleteEntityCommand =>', error)
    return {
      success: false,
      message: 'Something went wrong!',
    }
  }
}
