import { getCustomCommandVariables } from '@/services/queries/custom-command-variables'

import type { Platform } from '@/types/platform'

import { CustomCommandVariablesList } from '../../custom-command-variables-list'

interface Props {
  params: Promise<{
    platform: string
    id: string
  }>
}

export default async function VariablesPage(props: Props) {
  const params = await props.params
  const platform = params.platform as Platform
  const entityId = params.id

  const variables = await getCustomCommandVariables(platform, entityId)

  return (
    <CustomCommandVariablesList
      variables={variables}
      platform={params.platform}
      entityId={params.id}
    />
  )
}
