import { fetcher } from '@/lib/fetcher'

import type { UserAccount, UserEntity } from '@/types/user'

/**
 *
 * @returns
 */
export async function getUserAccounts(): Promise<UserAccount[]> {
  const params = new URLSearchParams()
  params.append('noCache', 'true')

  return fetcher('/me/accounts?' + params, {
    next: {
      tags: ['getUserAccounts'],
    },
  })
}

/**
 *
 * @param type
 * @returns
 */
export async function getUserEntities(
  type?: 'joined' | 'not_joined',
): Promise<UserEntity[]> {
  const params = new URLSearchParams()
  params.append('noCache', 'true')

  if (type) {
    params.append('joined', type === 'joined' ? 'true' : 'false')
  }

  return fetcher('/me/platforms?' + params, {
    next: {
      tags: ['getUserEntities'],
    },
  })
}
