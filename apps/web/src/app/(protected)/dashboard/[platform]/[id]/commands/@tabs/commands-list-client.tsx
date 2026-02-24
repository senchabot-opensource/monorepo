'use client'

import { useMemo, useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { SearchIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'

import type { EntityCommand } from '@/types/command'

import { CommandStatusSwitch } from './command-status-switch'
import { DeleteCommand } from './delete-command-button'
import { UpdateCommand } from './update-command-dialog'

interface Props {
  commands: EntityCommand[]
  type: 'custom' | 'global'
}

export function CommandsListClient({ commands, type }: Props) {
  const [search, setSearch] = useState('')

  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands

    const query = search.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(query) ||
        cmd.content.toLowerCase().includes(query),
    )
  }, [commands, search])

  if (!commands.length) {
    return <p className="text-sm text-muted-foreground">No command found.</p>
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search commands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="text-sm text-muted-foreground">
        {filteredCommands.length} command
        {filteredCommands.length !== 1 ? 's' : ' '}
        {search && `found for "${search}"`}
        {!search && 'available'}
      </div>

      {filteredCommands.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            {search ? 'No commands match your search.' : 'No commands found.'}
          </p>
        </div>
      ) : type === 'custom' ? (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Status</TableHead>
                <TableHead className="min-w-[100px]">Name</TableHead>
                <TableHead>Content</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommands.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <CommandStatusSwitch command={item} />
                  </TableCell>
                  <TableCell className="align-top">
                    <span className="break-all font-mono text-sm">{item.name}</span>
                  </TableCell>
                  <TableCell className="align-top">
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
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]">Name</TableHead>
                <TableHead>Content</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommands.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="align-top">
                    <span className="break-all font-mono text-sm">{item.name}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <p className="text-wrap break-words" title={item.content}>
                      {item.content}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
