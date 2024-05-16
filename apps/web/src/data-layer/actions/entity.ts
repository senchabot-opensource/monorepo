'use server'

import { revalidateTag } from 'next/cache'

import { fetcher } from '../fetcher'

/**
 *
 * @param provider
 * @param providerAccountId
 * @param userId
 * @returns
 */
export async function linkEntity(
  provider: string,
  providerAccountId: string,
  userId: string,
) {
  return fetcher('/platforms/link', {
    method: 'POST',
    body: JSON.stringify({
      provider: provider,
      provider_account_id: providerAccountId,
      user_id: userId,
    }),
  })
}

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
): Promise<{ success: boolean; message: string }> {
  try {
    const params = new URLSearchParams({ platform, platformEntityId })
    await fetcher(`/me/platforms/actions/${action}?` + params, {
      method: 'POST',
    })

    revalidateTag('getUserEntities')

    return {
      success: false,
      message: 'Successfully!',
    }
  } catch (error) {
    console.log('executeEntityAction =>', error)
    return {
      success: false,
      message: 'Something went wrong!',
    }
  }
}
