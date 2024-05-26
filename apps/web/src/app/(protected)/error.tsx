'use client'

import { useEffect } from 'react'

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-xs p-4">
        <h2 className="text-center text-xl">Something went wrong!</h2>
      </div>
    </main>
  )
}
