import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { getEntityCommands } from '@/data-layer/queries/entity'

import { DeleteCommand } from './delete-command'
import { UpdateCommand } from './update-command'
import { UpdateCommandStatus } from './update-command-status'

interface Props {
  platform: Platform
  id: string
  type: CommandType
}

export async function Commands({ platform, id, type }: Props) {
  const commands = await getEntityCommands(platform, id, type)

  if (!commands.length) {
    return <p className="text-sm text-muted-foreground">No command found.</p>
  }

  if (type === 'custom') {
    return (
      <div className="overflow-hidden rounded-xl border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {commands.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <UpdateCommandStatus command={item} />
                </TableCell>
                <TableCell>!{item.name}</TableCell>
                <TableCell>
                  <p className="truncate" title={item.content}>
                    {item.content}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end space-x-2">
                    <UpdateCommand command={item} />
                    <DeleteCommand
                      id={item.id}
                      platform={item.platform}
                      platformEntityId={item.platform_entity_id}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  } else if (type === 'global') {
    return (
      <div className="overflow-hidden rounded-xl border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Content</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commands.map((item) => (
              <TableRow key={item.id}>
                <TableCell>!{item.name}</TableCell>
                <TableCell>
                  <p className="truncate" title={item.content}>
                    {item.content}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}
