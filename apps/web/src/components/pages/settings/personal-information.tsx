import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { auth } from '@/lib/auth'

export async function PersonalInformation() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  return (
    <div className="space-y-4 *:space-y-1">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue={session.user.name!} readOnly />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" defaultValue={session.user.email!} readOnly />
      </div>
    </div>
  )
}
