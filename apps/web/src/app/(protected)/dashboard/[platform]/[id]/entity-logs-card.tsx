import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { formatDate } from '@/lib/utils'

import { getEntityLogs } from '@/services/queries/entities'

import type { Platform } from '@/types/platform'

interface Props {
  platform: Platform
  id: string
}

export async function EntityLogsCard({ platform, id }: Props) {
  const logs = await getEntityLogs(platform, id)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length > 0 ? (
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
        ) : (
          <p className="text-sm text-muted-foreground">No logs found.</p>
        )}
      </CardContent>
    </Card>
  )
}
