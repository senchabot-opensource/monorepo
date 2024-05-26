import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { auth } from '@/lib/auth'
import { maskEmail } from '@/lib/utils'

export async function PersonalInformation() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  return (
    <div className="space-y-4 *:space-y-1">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue={session.user.name!} disabled />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          defaultValue={maskEmail(session.user.email!)}
          disabled
        />
      </div>
    </div>
  )
}
