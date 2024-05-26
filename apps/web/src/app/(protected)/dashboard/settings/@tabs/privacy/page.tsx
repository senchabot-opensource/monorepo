import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Privacy',
}

export default async function Page() {
  const session = await auth()

  if (!session) {
    redirect('/signin')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danger zone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Deleting your account is a permanent action that cannot be undone. All
          your data, settings, and any content you have created will be deleted.
          If you have any concerns, please contact our support team for
          assistance.
        </p>
        <form>
          <Button type="submit" variant="destructive" disabled>
            Delete My Account
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
