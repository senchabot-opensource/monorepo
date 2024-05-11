import { cookies } from 'next/headers'

import { env } from '@/env'

const BASE_URL = 'https://api.senchabot.dev/v1'

function getUserSessionToken() {
  const cookieStore = cookies()
  const token = cookieStore.get('authjs.session-token')
  if (!token) {
    return ''
  }
  return token.value
}

export async function fetcher<JSON = any>(
  endpoint: RequestInfo,
  options?: RequestInit,
): Promise<JSON> {
  const response = await fetch(BASE_URL + endpoint, {
    headers: {
      Authorization: env.API_AUTHORIZATION_PREFIX + ' ' + getUserSessionToken(),
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (!response.ok) {
    const json = await response.json()
    if (json.message) {
      const error = new Error(json.message) as Error & {
        status: number
      }
      error.status = response.status
      throw error
    } else {
      throw new Error('An unexpected error occurred.')
    }
  }

  return response.json()
}
