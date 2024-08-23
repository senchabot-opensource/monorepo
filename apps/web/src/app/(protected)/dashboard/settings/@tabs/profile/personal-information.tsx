import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { maskEmail } from '@/lib/utils'

import { useSession } from '@/hooks/use-session'

export async function PersonalInformation() {
  const session = await useSession()

  if (!session?.user) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue={session.user.name!} disabled />
      </div>
      <div className="space-y-1">
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
