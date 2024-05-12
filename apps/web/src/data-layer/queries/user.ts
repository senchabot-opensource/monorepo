import { fetcher } from '../fetcher'

/**
 *
 * @returns
 */
export async function getUserAccounts(): Promise<UserAccount[]> {
  return fetcher('/me/accounts?noCache=true', {
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
  const params = new URLSearchParams({ noCache: 'true' })

  if (type) {
    params.append('joined', type === 'joined' ? 'true' : 'false')
  }

  return fetcher('/me/platforms?' + params, {
    next: {
      tags: ['getUserEntities'],
    },
  })
}
