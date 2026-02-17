import type { Metadata } from 'next'
import Link from 'next/link'

import { ArrowLeftIcon, ExternalLinkIcon } from 'lucide-react'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

import { getPublicCommands } from '@/services/queries/commands'

import { CommandsList } from './commands-list'

interface Props {
  params: Promise<{
    channel: string
  }>
}

// Twitch usernames only contain alphanumeric characters and underscores, 4-25 chars
const VALID_CHANNEL_NAME = /^[a-zA-Z0-9_]{1,50}$/

function isValidChannelName(name: string): boolean {
  return VALID_CHANNEL_NAME.test(name)
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const channel = decodeURIComponent(params.channel)

  return {
    title: `${channel}'s Commands`,
    description: `View the bot commands for ${channel}'s Twitch channel`,
  }
}

export default async function PublicCommandsPage(props: Props) {
  const params = await props.params
  const channel = decodeURIComponent(params.channel)

  // Validate channel name format
  const isValidChannel = isValidChannelName(channel)
  const commands = isValidChannel ? await getPublicCommands(channel) : []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-lg items-center">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeftIcon className="size-4" />
            <span className="font-bold">Senchabot</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-screen-lg py-8">
        <div className="space-y-8">
          {/* Title Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {channel}&apos;s Commands
              </h1>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={`https://twitch.tv/${channel}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon className="size-4" />
                  <span className="sr-only">Visit Twitch channel</span>
                </a>
              </Button>
            </div>
            <p className="text-muted-foreground">
              A list of all available bot commands for this channel.
            </p>
          </div>

          {/* Commands List */}
          {commands.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                No commands found for this channel.
              </p>
            </div>
          ) : (
            <CommandsList commands={commands} />
          )}

          {/* Footer CTA */}
          <div className="rounded-lg border bg-muted/50 p-6 text-center">
            <h2 className="text-lg font-semibold">
              Want Senchabot in your channel?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add Senchabot to your Twitch channel for free!
            </p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
