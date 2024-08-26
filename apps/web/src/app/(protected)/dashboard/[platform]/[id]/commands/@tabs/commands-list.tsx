import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { getCommands } from '@/services/queries/commands'

import type { Platform } from '@/types/platform'

import { CommandStatusSwitch } from './command-status-switch'
import { DeleteCommand } from './delete-command-button'
import { UpdateCommand } from './update-command-dialog'

interface Props {
  platform: Platform
  id: string
  type: 'custom' | 'global'
}

export async function CommandsList({ platform, id, type }: Props) {
  const commands = await getCommands(platform, id, type)

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
                  <CommandStatusSwitch command={item} />
                </TableCell>
                <TableCell>{item.name}</TableCell>
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
        <Table className="table-fixed overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Content</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commands.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <p className="text-wrap break-words" title={item.content}>
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
