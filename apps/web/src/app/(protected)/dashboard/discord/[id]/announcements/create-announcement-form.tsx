import { getDiscordGuildChannels } from '@/services/queries/discord'

import { CreateAnnouncementFormClient } from './create-announcement-form-client'

interface Props {
  id: string
}

export async function CreateAnnouncementForm({ id }: Props) {
  const channels = await getDiscordGuildChannels(id)

  return <CreateAnnouncementFormClient id={id} channels={channels} />
}
