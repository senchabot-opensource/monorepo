'use client'

import { useMemo } from 'react'

import { useSearchParams } from 'next/navigation'

import { TriangleAlertIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type Error = 'OAuthAccountNotLinked'

export function SignInError() {
  const search = useSearchParams()
  const error = search.get('error') as Error

  let errorMessage = useMemo(() => {
    if (error) {
      switch (error) {
        case 'OAuthAccountNotLinked':
          return 'The account is already associated with another user.'
        default:
          return 'Something went wrong!'
      }
    }
  }, [error])

  if (!errorMessage) {
    return null
  }

  return (
    <Alert variant="destructive">
      <TriangleAlertIcon className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  )
}
