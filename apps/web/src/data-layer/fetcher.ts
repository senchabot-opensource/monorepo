import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

import { env } from '@/env'

const BASE_URL = env.API_URL

export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

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
