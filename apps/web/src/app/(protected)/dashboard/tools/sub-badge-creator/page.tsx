import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import SubBadgeCreator from './sub-badge-creator-client'

export default async function SubBadgeCreatorPage() {
  const session = await auth()

  if (!session) {
    throw redirect('/signin')
  }

  return <SubBadgeCreator />
}
