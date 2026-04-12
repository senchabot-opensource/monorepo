import Image from 'next/image'
import NextLink from 'next/link'

import {
  ArrowRightIcon,
  BellIcon,
  BotIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  CodeIcon,
  FileIcon,
  GithubIcon,
  HomeIcon,
  LinkIcon,
  ListIcon,
  MessagesSquareIcon,
  MousePointerClickIcon,
  SettingsIcon,
  ShieldCheckIcon,
  Tv2Icon,
  TwitchIcon,
  WorkflowIcon,
  WrenchIcon,
  YoutubeIcon,
  ZapIcon,
} from 'lucide-react'

import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link } from '@/components/ui/link'

import { HeroChatDemo } from './hero-chat-demo'

const navLinks = [
  { label: 'Commands', path: '#commands' },
  { label: 'Dashboard', path: '#dashboard' },
  { label: 'Platforms', path: '#platforms' },
]

const twitchCommands = [
  {
    name: '!so',
    desc: 'Give a shoutout with game info and follow link.',
  },
  {
    name: '!clip',
    desc: 'Create a clip from the current stream moment.',
  },
  {
    name: '!cmds',
    desc: 'Share a full list of available commands.',
  },
  {
    name: '!acmd',
    desc: 'Create a custom command directly from chat.',
  },
  {
    name: '!timer',
    desc: 'Set recurring automated chat messages.',
  },
  {
    name: '!help',
    desc: 'Display system and custom command help.',
  },
]

const discordCommands = [
  {
    name: '/purge',
    desc: 'Bulk delete messages with count and filters.',
  },
  {
    name: '/set-twitch',
    desc: 'Link a Twitch account for live notifications.',
  },
  {
    name: '/cmds',
    desc: 'List custom and system commands in this server.',
  },
  {
    name: '/invite',
    desc: 'Generate an invite URL for Senchabot.',
  },
  {
    name: '/acmd',
    desc: 'Create custom slash command responses.',
  },
  {
    name: '/streamer-list',
    desc: 'List currently tracked streamers.',
  },
]

const automationSteps = [
  {
    icon: ZapIcon,
    title: 'Event Detected',
    desc: 'Stream start, command trigger, timer tick, or webhook received.',
    details: [
      'Live start and stop events',
      'Chat command parsing',
      'Scheduled timer checks',
      'Platform webhook listeners',
    ],
  },
  {
    icon: ShieldCheckIcon,
    title: 'Rules Evaluated',
    desc: 'Roles, cooldowns, variables, and platform context are resolved.',
    details: [
      'Role-based access',
      'Prefix and command scope',
      'Cooldown enforcement',
      'Variable resolution',
    ],
  },
  {
    icon: BellIcon,
    title: 'Action Delivered',
    desc: 'Response is sent to the right platform and channel in milliseconds.',
    details: [
      'Cross-platform routing',
      'Announcement posting',
      'Command output delivery',
      'Overlay and tool hooks',
    ],
  },
]

const platformCards = [
  {
    name: 'Twitch',
    icon: TwitchIcon,
    iconColor: 'text-[#9146FF]',
    status: 'Online',
    desc: 'Chat command workflows optimized for live streams.',
    points: [
      'Shoutouts with last game',
      'Clip creation',
      'Recurring timers',
      'Custom commands',
      'Command aliases',
      'Cooldown controls',
      'Role-based permissions',
      'Dynamic response variables',
    ],
  },
  {
    name: 'Discord',
    icon: BotIcon,
    iconColor: 'text-[#5865F2]',
    status: 'Online',
    desc: 'Slash commands, notifications, and moderation support.',
    points: [
      'Slash commands',
      'Live notifications',
      'Announcement channels',
      'Message purging',
      'Role-based controls',
      'Server-specific settings',
      'Command categories',
      'Audit-friendly action flow',
    ],
  },
  {
    name: 'Kick',
    icon: Tv2Icon,
    iconColor: 'text-[#53FC18]',
    status: 'Beta',
    statusDescription: 'Beta for selected streamers',
    desc: 'Keep command behavior consistent with Twitch.',
    points: [
      'Command parity',
      'Cross-platform sync',
      'Shared moderation',
      'Unified logic',
      'Channel-level command scopes',
      'Live status triggers',
    ],
  },
  {
    name: 'YouTube',
    icon: YoutubeIcon,
    iconColor: 'text-[#FF0000]',
    status: 'Beta',
    statusDescription: 'Beta for selected streamers',
    desc: 'Integrate live chat and video links in one command model.',
    points: [
      'Live chat commands',
      'Video link sharing',
      'Community sync',
      'Dashboard control',
      'Keyword-based responses',
      'Live stream announcement hooks',
    ],
  },
]

const dashboardSidebarMainLinks = [
  { label: 'Dashboard', icon: HomeIcon, active: true },
  { label: 'Commands', icon: ListIcon, active: false },
  { label: 'Settings', icon: SettingsIcon, active: false },
]

const dashboardSidebarBottomLinks = [
  { label: 'Tools', icon: WrenchIcon },
  { label: 'Docs', icon: FileIcon },
  { label: 'Community', icon: MessagesSquareIcon },
]

const dashboardPreviewEntities = [
  {
    platform: 'twitch',
    name: 'streamer',
    avatar: '',
    fallback: 'S',
  },
  {
    platform: 'discord',
    name: 'streamer',
    avatar: '',
    fallback: 'H',
  },
  {
    platform: 'kick',
    name: 'streamer',
    avatar: '',
    fallback: 'S',
  },
  {
    platform: 'youtube',
    name: 'streamer',
    avatar: '',
    fallback: 'S',
  },
]

const productLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  {
    label: 'Documentation',
    href: '/docs',
    options: { target: '_blank', rel: 'noreferrer' },
  },
]

const legalLinks = [
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
  { label: 'EULA', href: '/eula' },
]

const socialLinks = [
  { label: 'Twitter', href: 'https://x.com/senchabot' },
  { label: 'Discord', href: '/discord' },
  { label: 'GitHub', href: '/github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/senchabot/' },
]

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] bg-gradient-to-b from-[#20ab8c]/[0.04] via-foreground/[0.02] to-transparent" />
      <div className="pointer-events-none absolute -left-40 top-56 -z-10 size-[28rem] rounded-full bg-[#20ab8c]/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-20 -z-10 size-[28rem] rounded-full bg-foreground/[0.015] blur-3xl" />

      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto grid h-16 w-full max-w-screen-xl grid-cols-2 items-center px-4 md:grid-cols-3 lg:px-8">
          <NextLink
            className="relative inline-flex w-fit cursor-pointer select-none items-center space-x-2 text-xl font-semibold tracking-wide transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            href="/"
          >
            <div className="inline-flex size-8 shrink-0">
              <Image
                src="/senchabot-logo.svg"
                alt="Senchabot"
                width={32}
                height={32}
                unoptimized
              />
            </div>
            <span>Senchabot</span>
          </NextLink>

          <div className="hidden justify-center gap-6 md:flex">
            {navLinks.map((item) => (
              <Link
                className="text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
                href={item.path}
                key={item.path}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <ThemeToggle />
            <Button variant="secondary" size="sm" asChild>
              <NextLink href="/signin">Sign in</NextLink>
            </Button>
          </div>
        </nav>
      </header>

      <section className="mx-auto w-full max-w-screen-xl px-4 pb-16 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="space-y-6">
            <Badge variant="outline" className="border-border/60 text-muted-foreground">
              <span className="mr-1.5 inline-block size-1.5 rounded-full bg-emerald-500" />
              Open Source · Multi-Platform
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.08]">
                One bot. <span className="text-[#20ab8c]">Every platform.</span>
                <br />
                <span className="text-muted-foreground">Zero friction.</span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                Senchabot brings Twitch, Discord, Kick, and YouTube under one
                dashboard. Commands, automations, moderation: unified and instant.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button size="lg" asChild>
                <NextLink href="/signin">
                  <span>Open Dashboard</span>
                  <ArrowRightIcon className="ml-1.5 size-4" />
                </NextLink>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <NextLink href="/github" target="_blank" rel="noreferrer">
                  <GithubIcon className="mr-1.5 size-4" />
                  <span>View on GitHub</span>
                </NextLink>
              </Button>
            </div>
          </div>

          <div className="relative" id="hero-chat">
            <HeroChatDemo />
          </div>
        </div>
      </section>

      <section id="commands" className="border-y border-border/50 bg-secondary/15">
        <div className="mx-auto w-full max-w-screen-xl space-y-8 px-4 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CodeIcon className="size-5 text-[#20ab8c]" />
                <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                  Built-in Command Arsenal
                </h2>
              </div>
              <p className="max-w-lg text-[15px] leading-[1.65] text-muted-foreground/90">
                30+ system commands ship out of the box across Twitch and Discord.
                Each one is customizable and ready after connect.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="flex size-7 items-center justify-center rounded-md bg-[#9146FF]/10">
                      <TwitchIcon className="size-3.5 text-[#9146FF]" />
                    </div>
                    Twitch
                  </CardTitle>
                  <Badge variant="outline" className="text-xs font-normal">
                    <span className="mr-1 inline-block size-1.5 rounded-full bg-emerald-500" />
                    {twitchCommands.length} commands
                  </Badge>
                </div>
                <CardDescription className="text-[13px]">
                  Prefix:{' '}
                  <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-xs">
                    !
                  </code>{' '}
                  · Chat-native interaction
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/30 p-0">
                {twitchCommands.map((cmd) => (
                  <div key={cmd.name} className="flex items-start gap-3 px-5 py-3.5">
                    <code className="mt-0.5 shrink-0 rounded bg-foreground/[0.06] px-2.5 py-1 font-mono text-[13px] font-medium text-foreground">
                      {cmd.name}
                    </code>
                    <span className="text-[13px] leading-relaxed text-muted-foreground">
                      {cmd.desc}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="flex size-7 items-center justify-center rounded-md bg-[#5865F2]/10">
                      <BotIcon className="size-3.5 text-[#5865F2]" />
                    </div>
                    Discord
                  </CardTitle>
                  <Badge variant="outline" className="text-xs font-normal">
                    <span className="mr-1 inline-block size-1.5 rounded-full bg-emerald-500" />
                    {discordCommands.length} commands
                  </Badge>
                </div>
                <CardDescription className="text-[13px]">
                  Prefix:{' '}
                  <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-xs">
                    /
                  </code>{' '}
                  · Slash command workflows
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/30 p-0">
                {discordCommands.map((cmd) => (
                  <div key={cmd.name} className="flex items-start gap-3 px-5 py-3.5">
                    <code className="mt-0.5 shrink-0 rounded bg-foreground/[0.06] px-2.5 py-1 font-mono text-[13px] font-medium text-foreground">
                      {cmd.name}
                    </code>
                    <span className="text-[13px] leading-relaxed text-muted-foreground">
                      {cmd.desc}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="dashboard" className="mx-auto w-full max-w-screen-xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xl shadow-foreground/[0.03]">
          <div className="pointer-events-none relative flex min-h-[720px] bg-background/90 select-none">
            <section className="hidden w-64 shrink-0 border-r px-4 py-6 md:flex md:flex-col md:space-y-8">
              <div className="flex w-full items-center justify-between space-x-2">
                <div className="relative inline-flex select-none items-center space-x-2 text-2xl font-medium tracking-wide">
                  <div className="inline-flex size-8 shrink-0">
                    <Image
                      src="/senchabot-logo.svg"
                      alt="Senchabot"
                      width={32}
                      height={32}
                      unoptimized
                    />
                  </div>
                  <span>Senchabot</span>
                  <span className="absolute -top-3 right-0 inline-flex text-xs font-light uppercase text-muted-foreground">
                    Beta
                  </span>
                </div>
                <div className="inline-flex size-8 items-center justify-center rounded-md border border-border/50 text-xs font-medium text-muted-foreground">
                  UI
                </div>
              </div>

              <div className="rounded-md border bg-muted/30 p-2">
                <p className="px-2 text-xs text-muted-foreground">Workspace</p>
                <div className="inline-flex h-9 w-full items-center justify-between rounded-md px-2 text-sm">
                  <span>Main Community</span>
                  <span className="uppercase text-muted-foreground">live</span>
                </div>
              </div>

              <nav className="grow space-y-1">
                {dashboardSidebarMainLinks.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.label}
                      className={`inline-flex h-9 w-full items-center space-x-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        item.active
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </div>
                  )
                })}
              </nav>

              <nav className="space-y-1">
                {dashboardSidebarBottomLinks.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.label}
                      className="inline-flex h-9 w-full items-center space-x-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </div>
                  )
                })}
              </nav>
            </section>

              <div
                className="grow px-4 py-5 md:px-8 md:py-6"
                role="region"
                aria-label="Dashboard preview"
              >
                <div className="max-w-screen-lg space-y-8">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-medium tracking-tight">Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your servers and channels from your dashboard.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium tracking-tight">My Servers & Channels</h4>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {dashboardPreviewEntities.map((item) => (
                        <div
                          key={`${item.platform}-${item.name}`}
                          className="flex items-center space-x-2 rounded-md border bg-muted/25 px-4 py-2 text-sm font-medium shadow-sm transition-all"
                        >
                          <div className="inline-flex size-6 items-center justify-center rounded bg-muted text-[11px] font-semibold uppercase text-foreground/80">
                            {item.fallback}
                          </div>
                        <span className="truncate">
                          <span className="capitalize text-muted-foreground">
                            {item.platform}/
                            </span>
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/50 bg-secondary/15">
        <div className="mx-auto w-full max-w-screen-xl px-4 py-16 lg:px-8 lg:py-24">
          <div className="mb-10 max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <WorkflowIcon className="size-5 text-[#20ab8c]" />
              <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                How It Works
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              Every interaction flows through a predictable pipeline from event
              detection to action delivery.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {automationSteps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="relative">
                  <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex size-11 items-center justify-center rounded-xl border border-border/50 bg-secondary/30">
                          <Icon className="size-5 text-foreground/70" />
                        </div>
                        <div>
                          <span className="block text-[11px] font-semibold uppercase tracking-widest text-[#20ab8c]/70">
                            Step {i + 1}
                          </span>
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-[13px] leading-relaxed text-muted-foreground">
                        {step.desc}
                      </p>
                      <div className="space-y-1.5">
                        {step.details.map((detail) => (
                          <div
                            key={detail}
                            className="flex items-center gap-2 text-[12px] text-muted-foreground/80"
                          >
                            <ChevronRightIcon className="size-3 shrink-0 text-[#20ab8c]/40" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  {i < automationSteps.length - 1 && (
                    <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                      <div className="flex size-6 items-center justify-center rounded-full border border-border/40 bg-background">
                        <ArrowRightIcon className="size-3 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-2 rounded-xl border border-border/40 bg-card/60 px-6 py-5 text-center sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <LinkIcon className="size-4 text-muted-foreground" />
              Cross-platform sync: <span className="font-mono">real-time</span>
            </div>
            <span className="hidden text-border sm:inline">|</span>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MousePointerClickIcon className="size-4 text-muted-foreground" />
              Zero config required
            </div>
          </div>
        </div>
      </section>

      <section id="platforms" className="mx-auto w-full max-w-screen-xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-10 max-w-2xl space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
            Platform Coverage
          </h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Write your commands once and run them everywhere with consistent behavior.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {platformCards.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.name} className="flex h-full flex-col border-border/50 bg-card/80">
                <CardHeader className="space-y-3 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex size-12 items-center justify-center rounded-xl border border-border/50 bg-secondary/30">
                        <Icon className={`size-6 ${item.iconColor}`} />
                      </div>
                      <CardTitle>{item.name}</CardTitle>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      <span
                        className={`inline-block size-1.5 rounded-full ${
                          item.status === 'Beta' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                      {item.status}
                    </span>
                  </div>
                  <CardDescription className="text-[13px] leading-relaxed">
                    {item.desc}
                  </CardDescription>
                  {item.statusDescription && (
                    <p className="text-[12px] font-medium text-amber-600 dark:text-amber-400">
                      {item.statusDescription}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="mt-auto space-y-1.5 pt-2">
                  {item.points.map((point) => (
                    <div key={point} className="flex items-center gap-2 text-[13px]">
                      <CheckCircle2Icon className="size-3.5 shrink-0 text-[#20ab8c]/50" />
                      <span className="text-muted-foreground">{point}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-xl px-4 py-16 lg:px-8 lg:py-24">
        <Card className="overflow-hidden border-border/50">
          <CardContent className="relative flex flex-col items-center space-y-6 p-10 text-center lg:p-16">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/20 via-transparent to-secondary/10" />
            <div className="relative space-y-4">
              <h2 className="max-w-lg text-3xl font-bold tracking-tight lg:text-4xl">
                Ready to unify your community?
              </h2>
              <p className="mx-auto max-w-md text-muted-foreground">
                Connect your platforms in minutes. Open source, transparent, and
                built for creators who care about their community.
              </p>
              <p className="mx-auto text-sm font-medium text-muted-foreground/90">
                Free. Open-source. Remove anytime.
              </p>
            </div>
            <div className="relative flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <NextLink href="/signin">
                  <span>Get Started</span>
                  <ArrowRightIcon className="ml-1.5 size-4" />
                </NextLink>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <NextLink href="/docs" target="_blank" rel="noreferrer">
                  Read the Docs
                </NextLink>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-border/50 bg-secondary/10">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-9 px-4 py-12 lg:grid-cols-[1.2fr_1fr] lg:gap-4 lg:px-8">
          <div className="flex flex-col space-y-3">
            <div className="inline-flex w-fit select-none items-center space-x-2 text-xl font-semibold tracking-wide">
              <div className="inline-flex size-8">
                <Image
                  src="/senchabot-logo.svg"
                  alt="Senchabot"
                  width={32}
                  height={32}
                  unoptimized
                />
              </div>
              <span>Senchabot</span>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Open-source, multi-platform community bot for modern creator teams.
            </p>
          </div>
          <div className="grid auto-cols-max grid-flow-col justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Product
              </span>
              <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
                {productLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="font-normal transition-colors hover:text-foreground"
                      href={item.href}
                      {...item.options}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Legal
              </span>
              <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
                {legalLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="font-normal transition-colors hover:text-foreground"
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Social
              </span>
              <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
                {socialLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="font-normal transition-colors hover:text-foreground"
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-border/40">
          <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-2 p-4 text-center text-xs text-muted-foreground lg:grid-cols-2 lg:px-8 lg:text-start">
            <p>Copyright {new Date().getFullYear()} Senchabot. All Rights Reserved.</p>
            <p className="lg:text-end">Built for creators and community teams.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
