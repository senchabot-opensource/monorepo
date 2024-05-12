import type { Metadata } from 'next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Privacy',
}

export default function Page() {
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
