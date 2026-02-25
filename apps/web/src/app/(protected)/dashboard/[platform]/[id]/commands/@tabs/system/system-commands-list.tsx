'use client'

import { useMemo, useState } from 'react'

import { SearchIcon } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Input } from '@/components/ui/input'

import type { Platform } from '@/types/platform'

const TWITCH_SYSTEM_COMMANDS = [
  { name: 'ping', description: 'Check if the bot is responding' },
  { name: 'invite', description: 'Invite the bot to your channel' },
  { name: 'leave', description: 'Remove the bot from your channel' },
  { name: 'so', description: 'Give a shoutout to another streamer' },
  { name: 'acmd', description: 'Add a new custom command' },
  { name: 'ucmd', description: 'Update an existing custom command' },
  { name: 'dcmd', description: 'Delete a custom command' },
  { name: 'cmds', description: 'List all custom commands' },
  { name: 'acmda', description: 'Add an alias to a command' },
  { name: 'dcmda', description: 'Delete a command alias' },
  { name: 'atimer', description: 'Add a new timer' },
  { name: 'dtimer', description: 'Delete a timer' },
  { name: 'timers', description: 'List all timers' },
  { name: 'timer', description: 'Show timer information' },
  { name: 'help', description: 'Show list of all available commands' },
]

const DISCORD_SYSTEM_COMMANDS = [
  { name: 'set-twitch', description: 'Link a Twitch account to Discord' },
  { name: 'del-twitch', description: 'Unlink a Twitch account from Discord' },
  { name: 'streamer-list', description: 'List tracked Twitch streamers' },
  { name: 'purge', description: 'Delete multiple messages in a channel' },
  { name: 'invite', description: 'Get the bot invite link' },
  { name: 'do-not-track-my-messages', description: 'Opt out of message tracking' },
  { name: 'track-my-messages', description: 'Opt in to message tracking' },
  { name: 'cmds', description: 'List all custom commands' },
  { name: 'acmd', description: 'Add a new custom command' },
  { name: 'ucmd', description: 'Update an existing custom command' },
  { name: 'dcmd', description: 'Delete a custom command' },
]

interface SystemCommand {
  name: string
  description: string
}

interface Props {
  platform: Platform
}

export function SystemCommandsList({ platform }: Props) {
  const [search, setSearch] = useState('')

  const systemCommands = platform === 'twitch' ? TWITCH_SYSTEM_COMMANDS : DISCORD_SYSTEM_COMMANDS
  const platformPrefix = platform === 'twitch' ? '!' : '/'

  const filteredCommands = useMemo(() => {
    if (!search.trim()) return systemCommands

    const query = search.toLowerCase()
    return systemCommands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query),
    )
  }, [systemCommands, search])

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
        {filteredCommands.length}{" "}command
        {filteredCommands.length !== 1 ? 's' : ' '}
        {search && `found for "${search}"`}
        {!search && 'available'}
      </div>

      {/* System Commands List */}
      {filteredCommands.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            {search
              ? 'No commands match your search.'
              : 'No system commands found.'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[140px]">Name</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommands.map((cmd) => (
                <TableRow key={cmd.name}>
                  <TableCell className="align-top">
                    <code className="break-all rounded bg-primary/10 px-2 py-1 text-sm font-semibold text-primary">
                      {platformPrefix}{cmd.name}
                    </code>
                  </TableCell>
                  <TableCell className="align-top">{cmd.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
