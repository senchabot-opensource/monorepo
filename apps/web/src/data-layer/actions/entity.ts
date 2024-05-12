'use server'

import { revalidateTag } from 'next/cache'

import { fetcher } from '../fetcher'

/**
 *
 * @param action
 * @param platform
 * @param platformEntityId
 * @returns
 */
export async function executeEntityAction(
  action: 'join' | 'depart',
  platform: Platform,
  platformEntityId: string,
): Promise<{ message: string }> {
  const params = new URLSearchParams({ platform, platformEntityId })

  try {
    await fetcher(`/me/platforms/actions/${action}?` + params, {
      method: 'POST',
    })

    revalidateTag('getUserEntities')

    return {
      message: 'Successfully!',
    }
  } catch (error) {
    console.log('executeEntityAction =>', error)
    throw new Error('Something went wrong!')
  }
}
