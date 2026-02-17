'use client'

import { useMemo, useState } from 'react'

import { SearchIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'

import type { EntityCommand } from '@/types/command'

interface Props {
  commands: EntityCommand[]
}

export function CommandsList({ commands }: Props) {
  const [search, setSearch] = useState('')

  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands

    const query = search.toLowerCase()
    return commands.filter(
      (command) =>
        command.name.toLowerCase().includes(query) ||
        command.content.toLowerCase().includes(query),
    )
  }, [commands, search])

  return (
    <div className="space-y-4">
      {/* Search Input */}
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

      {/* Commands Count */}
      <div className="text-sm text-muted-foreground">
        {filteredCommands.length} command
        {filteredCommands.length !== 1 ? 's' : ''}{' '}
        {search && `found for "${search}"`}
        {!search && 'available'}
      </div>

      {/* Commands List */}
      {filteredCommands.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            {search
              ? 'No commands match your search.'
              : 'No commands found for this channel.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredCommands.map((command) => (
            <div
              key={command.id}
              className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <code className="rounded bg-primary/10 px-2 py-1 text-sm font-semibold text-primary">
                    !{command.name}
                  </code>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {command.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
