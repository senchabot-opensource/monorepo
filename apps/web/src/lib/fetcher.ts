import { notFound } from 'next/navigation'

import { env } from '@/config/env'

const BASE_URL = env.API_URL

export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function getUserSessionToken(): Promise<string> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const cookieName = 'authjs.session-token'

  const getSecureToken = cookieStore.get(`__Secure-${cookieName}`)
  const getNotSecureToken = cookieStore.get(cookieName)

  const token = getSecureToken ?? getNotSecureToken

  if (!token) {
    return ''
  }

  return token.value
}

export async function fetcher<JSON = any>(
  endpoint: RequestInfo,
  options?: RequestInit & { authToken?: string },
): Promise<JSON> {
  if (typeof window !== 'undefined') {
    throw new Error('fetcher should not be used in client components')
  }

  const token = options?.authToken ?? (await getUserSessionToken())

  const response = await fetch(BASE_URL + endpoint, {
    headers: {
      Authorization: env.API_AUTHORIZATION_PREFIX + ' ' + token,
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (!response.ok) {
    if (response.status === 401) {
      notFound()
    }

    const json = await response.json()
    if (json.message) {
      throw new ApiError(response.status, json.message)
    } else {
      throw new Error('An unexpected error occurred.')
    }
  }

  return response.json()
}
