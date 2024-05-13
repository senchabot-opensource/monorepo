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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias,
          alias. Facere temporibus excepturi nostrum dignissimos numquam
          nesciunt accusamus, voluptas id beatae nihil molestiae maxime facilis
          iure quod magni. Minus, quod!
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
