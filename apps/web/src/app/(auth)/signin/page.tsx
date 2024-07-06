import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ArrowLeft, TriangleAlertIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import { auth } from '@/lib/auth'

import { SignInForm } from './signin-form'

export const metadata: Metadata = {
  title: 'Sign in',
}

type Error = 'OAuthAccountNotLinked'
function getErrorMessage(error: Error) {
  switch (error) {
    case 'OAuthAccountNotLinked':
      return 'The account is already associated with another user.'
    default:
      return 'Something went wrong!'
  }
}

interface Props {
  searchParams: {
    error: Error
  }
}

export default async function Page({ searchParams }: Props) {
  const session = await auth()

  // show error if user received an error while linking an account
  if (session && !searchParams.error) {
    redirect('/dashboard')
  }

  const errorMessage = getErrorMessage(searchParams.error)

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-screen-xl flex-col items-center justify-center">
      <Button variant="ghost" asChild>
        <Link
          className="absolute inset-4 w-fit"
          href={session ? '/dashboard/settings' : '/'}
        >
          <ArrowLeft className="size-4" />
          <span>{session ? 'Back to Dashboard' : 'Back'}</span>
        </Link>
      </Button>

      <div className="m-auto w-full max-w-xs space-y-4 p-4">
        {session ? (
          <h1 className="text-center text-2xl font-medium tracking-tighter">
            Link an Account
          </h1>
        ) : (
          <>
            <h1 className="text-center text-2xl font-medium tracking-tighter">
              Sign in
            </h1>
            <SignInForm />
          </>
        )}

        {searchParams.error && (
          <Alert variant="destructive">
            <TriangleAlertIcon className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>
    </main>
  )
}
