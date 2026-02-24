import { getCommands } from '@/services/queries/commands'

import type { Platform } from '@/types/platform'

import { CommandsListClient } from './commands-list-client'

interface Props {
  platform: Platform
  id: string
  type: 'custom' | 'global'
}

export async function CommandsList({ platform, id, type }: Props) {
  const commands = await getCommands(platform, id, type)

  return <CommandsListClient commands={commands} type={type} />
}
