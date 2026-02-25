import { getCommands } from '@/services/queries/commands'
import { getCustomCommandVariables } from '@/services/queries/custom-command-variables'

import type { Platform } from '@/types/platform'

import { CommandsListClient } from './commands-list-client'

interface Props {
  platform: Platform
  id: string
  type: 'custom' | 'global'
}

export async function CommandsList({ platform, id, type }: Props) {
  const [commands, variables] = await Promise.all([
    getCommands(platform, id, type),
    getCustomCommandVariables(platform, id),
  ])

  return <CommandsListClient commands={commands} type={type} variables={variables} />
}
