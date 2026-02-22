'use client'

import { useEffect } from 'react'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; status?: number }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  // Check if this is a 404/access error (bot not joined or channel not found)
  const isNotFoundError =
    error.name === 'NotFoundError' ||
    (error as Error & { status?: number }).status === 404 ||
    error.message?.includes('Record not found') ||
    error.message?.includes('not found')

  if (isNotFoundError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-4 p-4 text-center">
          <h2 className="text-2xl font-semibold">Channel Not Available</h2>
          <p className="text-muted-foreground">
            This channel or server is not accessible. Please make sure the bot
            has joined your channel before accessing this page.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild variant="outline">
              <Link href="/dashboard/settings">Go to Settings</Link>
            </Button>
            <Button onClick={reset}>Try Again</Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-4 p-4 text-center">
        <h2 className="text-2xl font-semibold">Something went wrong!</h2>
        <p className="text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </main>
  )
}
