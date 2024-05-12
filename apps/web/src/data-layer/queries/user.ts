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
