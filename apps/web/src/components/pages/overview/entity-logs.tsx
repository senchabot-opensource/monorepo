import { Badge } from '@/components/ui/badge'

import { formatDate } from '@/lib/utils'

import { getEntityLogs } from '@/data-layer/queries/entity'

interface Props {
  platform: Platform
  platformEntityId: string
}

export async function EntityLogs({ platform, platformEntityId }: Props) {
  const logs = await getEntityLogs(platform, platformEntityId)

  /**
   * IMPORTANT
   * add here "activity logs are disabled" texts when added [platform]/settings page
   */
  if (!logs.length) {
    return <p className="text-sm text-muted-foreground">No logs found.</p>
  }

  return (
    <ul className="divide-y divide-border">
      {logs
        .map((item) => (
          <li
            className="flex select-none items-center justify-between space-x-2 py-3 text-sm first:pt-0 last:pb-0"
            key={item.id}
          >
            <div className="flex flex-wrap items-center space-x-2">
              <Badge variant="secondary">@{item.author}</Badge>
              <span className="text-sm">{item.activity}</span>
            </div>
            <span className="text-muted-foreground">
              {formatDate(item.activity_date)}
            </span>
          </li>
        ))
        .slice(0, 10)}
    </ul>
  )
}
