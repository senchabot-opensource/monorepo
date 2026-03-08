'use client'

import { useState } from 'react'

import {
  BadgeCheckIcon,
  BotIcon,
  CrownIcon,
  HammerIcon,
  ShieldIcon,
  StarIcon,
  SwordIcon,
  Tv2Icon,
  TwitchIcon,
  WrenchIcon,
  YoutubeIcon,
} from 'lucide-react'

type BadgeKey =
  | 'tw-broadcaster'
  | 'tw-mod'
  | 'tw-vip'
  | 'tw-sub'
  | 'tw-bot'
  | 'dc-owner'
  | 'dc-admin'
  | 'dc-mod'
  | 'dc-bot'
  | 'kick-host'
  | 'kick-mod'
  | 'kick-vip'
  | 'kick-bot'
  | 'yt-owner'
  | 'yt-mod'
  | 'yt-member'
  | 'yt-verified'
  | 'yt-bot'

type ChatLine = {
  name: string
  text: string
  isBot?: boolean
  badges: BadgeKey[]
}

export type PlatformId = 'twitch' | 'discord' | 'kick' | 'youtube'

type Platform = {
  id: PlatformId
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  iconColor: string
  tabAccent: string
  channel: string
  lines: ChatLine[]
}

const badgeConfig: Record<
  BadgeKey,
  {
    label: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    className: string
    short: string
  }
> = {
  'tw-broadcaster': {
    label: 'Broadcaster',
    icon: CrownIcon,
    className: 'border-[#ff4f8b]/40 bg-[#ff4f8b]/10 text-[#ff4f8b]',
    short: 'BC',
  },
  'tw-mod': {
    label: 'Moderator',
    icon: SwordIcon,
    className: 'border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]',
    short: 'MOD',
  },
  'tw-vip': {
    label: 'VIP',
    icon: StarIcon,
    className: 'border-[#a855f7]/40 bg-[#a855f7]/10 text-[#a855f7]',
    short: 'VIP',
  },
  'tw-sub': {
    label: 'Subscriber',
    icon: BadgeCheckIcon,
    className: 'border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#3b82f6]',
    short: 'SUB',
  },
  'tw-bot': {
    label: 'Bot',
    icon: BotIcon,
    className: 'border-[#20ab8c]/40 bg-[#20ab8c]/10 text-[#20ab8c]',
    short: 'BOT',
  },
  'dc-owner': {
    label: 'Server Owner',
    icon: CrownIcon,
    className: 'border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#f59e0b]',
    short: 'OWNER',
  },
  'dc-admin': {
    label: 'Admin',
    icon: ShieldIcon,
    className: 'border-[#ef4444]/40 bg-[#ef4444]/10 text-[#ef4444]',
    short: 'ADMIN',
  },
  'dc-mod': {
    label: 'Moderator',
    icon: SwordIcon,
    className: 'border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]',
    short: 'MOD',
  },
  'dc-bot': {
    label: 'App Bot',
    icon: BotIcon,
    className: 'border-[#5865f2]/40 bg-[#5865f2]/10 text-[#5865f2]',
    short: 'APP',
  },
  'kick-host': {
    label: 'Host',
    icon: CrownIcon,
    className: 'border-[#53fc18]/40 bg-[#53fc18]/10 text-[#3ba812]',
    short: 'HOST',
  },
  'kick-mod': {
    label: 'Moderator',
    icon: SwordIcon,
    className: 'border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]',
    short: 'MOD',
  },
  'kick-vip': {
    label: 'VIP',
    icon: StarIcon,
    className: 'border-[#84cc16]/40 bg-[#84cc16]/10 text-[#65a30d]',
    short: 'VIP',
  },
  'kick-bot': {
    label: 'Bot',
    icon: BotIcon,
    className: 'border-[#20ab8c]/40 bg-[#20ab8c]/10 text-[#20ab8c]',
    short: 'BOT',
  },
  'yt-owner': {
    label: 'Channel Owner',
    icon: CrownIcon,
    className: 'border-[#ef4444]/40 bg-[#ef4444]/10 text-[#ef4444]',
    short: 'OWNER',
  },
  'yt-mod': {
    label: 'Moderator',
    icon: WrenchIcon,
    className: 'border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#3b82f6]',
    short: 'MOD',
  },
  'yt-member': {
    label: 'Member',
    icon: StarIcon,
    className: 'border-[#a855f7]/40 bg-[#a855f7]/10 text-[#a855f7]',
    short: 'MEM',
  },
  'yt-verified': {
    label: 'Verified',
    icon: BadgeCheckIcon,
    className: 'border-[#2563eb]/40 bg-[#2563eb]/10 text-[#2563eb]',
    short: 'VER',
  },
  'yt-bot': {
    label: 'Bot',
    icon: BotIcon,
    className: 'border-[#20ab8c]/40 bg-[#20ab8c]/10 text-[#20ab8c]',
    short: 'BOT',
  },
}

const platforms: Platform[] = [
  {
    id: 'twitch',
    label: 'Twitch',
    icon: TwitchIcon,
    iconColor: 'text-[#9146FF]',
    tabAccent: 'bg-[#9146FF]',
    channel: 'streamer1',
    lines: [
      {
        name: 'streamer1',
        badges: ['tw-broadcaster', 'tw-sub'],
        text: '!so @streamer2',
      },
      {
        name: 'Senchabot',
        badges: ['tw-mod', 'tw-bot'],
        isBot: true,
        text: 'Go check @streamer2, last seen on Just Chatting.',
      },
      {
        name: 'user1',
        badges: ['tw-mod'],
        text: '!clip',
      },
      {
        name: 'Senchabot',
        badges: ['tw-mod', 'tw-bot'],
        isBot: true,
        text: 'Clip created: clip.twitch.tv/EpicMoment2026',
      },
      {
        name: 'user2',
        badges: ['tw-vip'],
        text: '!schedule',
      },
      {
        name: 'Senchabot',
        badges: ['tw-mod', 'tw-bot'],
        isBot: true,
        text: 'Next stream: Tomorrow 20:00 CET - Ranked Grind',
      },
      {
        name: 'user1',
        badges: ['tw-mod'],
        text: '!acmd merch New merch is live: shop.streamer1.gg',
      },
      {
        name: 'Senchabot',
        badges: ['tw-mod', 'tw-bot'],
        isBot: true,
        text: 'Command !merch created successfully.',
      },
      {
        name: 'user3',
        badges: ['tw-sub'],
        text: '!discord',
      },
      {
        name: 'Senchabot',
        badges: ['tw-mod', 'tw-bot'],
        isBot: true,
        text: 'Join Discord: discord.gg/streamer1',
      },
    ],
  },
  {
    id: 'discord',
    label: 'Discord',
    icon: BotIcon,
    iconColor: 'text-[#5865F2]',
    tabAccent: 'bg-[#5865F2]',
    channel: '#general',
    lines: [
      {
        name: 'user1',
        badges: ['dc-mod'],
        text: '/purge 25',
      },
      {
        name: 'Senchabot',
        badges: ['dc-bot'],
        isBot: true,
        text: 'Purged 25 messages from this channel.',
      },
      {
        name: 'streamer1',
        badges: ['dc-owner'],
        text: '/set-twitch streamer1',
      },
      {
        name: 'Senchabot',
        badges: ['dc-bot'],
        isBot: true,
        text: 'Twitch linked. Live updates now post to #go-live.',
      },
      {
        name: 'user2',
        badges: ['dc-admin'],
        text: '/streamer-list',
      },
      {
        name: 'Senchabot',
        badges: ['dc-bot'],
        isBot: true,
        text: 'Tracked streamers: streamer1, streamer2, streamer3',
      },
      {
        name: 'user1',
        badges: ['dc-mod'],
        text: '/cmds',
      },
      {
        name: 'Senchabot',
        badges: ['dc-bot'],
        isBot: true,
        text: 'Command list: senchabot.com/commands/',
      },
    ],
  },
  {
    id: 'kick',
    label: 'Kick',
    icon: Tv2Icon,
    iconColor: 'text-[#53FC18]',
    tabAccent: 'bg-[#53FC18]',
    channel: 'streamer1',
    lines: [
      {
        name: 'streamer1',
        badges: ['kick-host'],
        text: '!so @streamer2',
      },
      {
        name: 'Senchabot',
        badges: ['kick-bot'],
        isBot: true,
        text: 'Check @streamer2, last seen on Just Chatting.',
      },
      {
        name: 'user1',
        badges: ['kick-mod'],
        text: '!rules',
      },
      {
        name: 'Senchabot',
        badges: ['kick-bot'],
        isBot: true,
        text: 'Rules: be respectful, no spam, no ads.',
      },
      {
        name: 'user2',
        badges: ['kick-vip'],
        text: '!schedule',
      },
      {
        name: 'Senchabot',
        badges: ['kick-bot'],
        isBot: true,
        text: 'Next stream: Tomorrow 20:00 CET - Ranked Grind',
      },
      {
        name: 'user1',
        badges: ['kick-mod'],
        text: '!cmds',
      },
      {
        name: 'Senchabot',
        badges: ['kick-bot'],
        isBot: true,
        text: 'Command list: senchabot.com/commands/',
      },
      {
        name: 'user3',
        badges: ['kick-vip'],
        text: '!discord',
      },
      {
        name: 'Senchabot',
        badges: ['kick-bot'],
        isBot: true,
        text: 'Join the community: discord.gg/streamer1',
      },
    ],
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: YoutubeIcon,
    iconColor: 'text-[#FF0000]',
    tabAccent: 'bg-[#FF0000]',
    channel: 'streamer1 live',
    lines: [
      {
        name: 'streamer1',
        badges: ['yt-owner', 'yt-verified'],
        text: '!social',
      },
      {
        name: '@senchabot',
        badges: ['yt-bot'],
        isBot: true,
        text: 'Twitter, Instagram, TikTok: @streamer1',
      },
      {
        name: 'user1',
        badges: ['yt-mod'],
        text: '!discord',
      },
      {
        name: '@senchabot',
        badges: ['yt-bot'],
        isBot: true,
        text: 'Join the community: discord.gg/streamer1',
      },
      {
        name: 'user2',
        badges: ['yt-member'],
        text: '!latest',
      },
      {
        name: '@senchabot',
        badges: ['yt-bot'],
        isBot: true,
        text: 'Latest upload: youtube.com/watch?v=stream-update',
      },
      {
        name: 'user1',
        badges: ['yt-mod'],
        text: '!cmds',
      },
      {
        name: '@senchabot',
        badges: ['yt-bot'],
        isBot: true,
        text: 'Command list: senchabot.com/commands/',
      },
      {
        name: 'user3',
        badges: ['yt-member'],
        text: '!rules',
      },
      {
        name: '@senchabot',
        badges: ['yt-bot'],
        isBot: true,
        text: 'Rules: be respectful, no spam, no self-promo.',
      },
    ],
  },
]

const platformTimeSeed: Record<PlatformId, { hour: number; minute: number }> = {
  twitch: { hour: 0, minute: 41 },
  discord: { hour: 3, minute: 12 },
  kick: { hour: 19, minute: 27 },
  youtube: { hour: 21, minute: 5 },
}

function getLineTimestamp(platformId: PlatformId, lineIndex: number) {
  const seed = platformTimeSeed[platformId]
  const offset = lineIndex * 3 + ((lineIndex + seed.minute) % 2)
  const totalMinutes = (seed.hour * 60 + seed.minute + offset) % (24 * 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function RoleBadge({ badge }: { badge: BadgeKey }) {
  const config = badgeConfig[badge]
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center justify-center rounded-sm border p-0.5 ${config.className}`}
      title={config.label}
    >
      <Icon className="size-3" />
    </span>
  )
}

export function HeroChatDemo() {
  const [activeTab, setActiveTab] = useState<PlatformId>('twitch')
  const active = platforms.find((p) => p.id === activeTab) ?? platforms[0]

  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-2xl shadow-foreground/[0.04]">
      <div className="flex items-center border-b border-border/50">
        <div className="flex items-center gap-1.5 border-r border-border/30 px-4 py-3">
          <div className="size-2.5 rounded-full bg-red-400/60" />
          <div className="size-2.5 rounded-full bg-yellow-400/60" />
          <div className="size-2.5 rounded-full bg-green-400/60" />
        </div>
        <div className="flex flex-1 items-center">
          {platforms.map((platform) => {
            const Icon = platform.icon
            const isActive = platform.id === activeTab

            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => setActiveTab(platform.id)}
                className={`group relative flex items-center gap-1.5 border-r border-border/30 px-3.5 py-3 text-xs transition-colors last:border-r-0 ${isActive
                    ? 'bg-background/50 text-foreground'
                    : 'text-muted-foreground/60 hover:bg-background/30 hover:text-muted-foreground'
                  }`}
              >
                <Icon className={`size-3.5 ${isActive ? platform.iconColor : ''}`} />
                <span className="hidden font-medium sm:inline">{platform.label}</span>
                {isActive && (
                  <span className={`absolute inset-x-0 bottom-0 h-0.5 ${platform.tabAccent}`} />
                )}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-1.5 px-3">
          <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-medium text-muted-foreground">LIVE</span>
        </div>
      </div>

      <div className="h-[340px] space-y-0.5 overflow-hidden p-3">
        {active.lines.map((line, index) => {
          const isYouTubeBotLine = active.id === 'youtube' && line.badges.includes('yt-bot')
          const isTwitchBotLine = active.id === 'twitch' && line.badges.includes('tw-bot')
          const isDiscordBotLine = active.id === 'discord' && line.badges.includes('dc-bot')
          const isKickBotLine = active.id === 'kick' && line.badges.includes('kick-bot')
          const rowPaddingYClass = active.id === 'discord' ? 'py-1.5' : 'py-1'

          return (
            <div
              key={`${activeTab}-${index}`}
              className={`flex items-center gap-2 rounded-md px-2 ${rowPaddingYClass} ${line.isBot &&
                  !isYouTubeBotLine &&
                  !isTwitchBotLine &&
                  !isDiscordBotLine &&
                  !isKickBotLine
                  ? 'bg-[#20ab8c]/[0.04]'
                  : ''
                }`}
            >
              {isDiscordBotLine ? (
                <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f23f62]">
                  <BotIcon className="size-3.5 text-white" />
                </span>
              ) : active.id === 'discord' ? (
                <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#5865f2]/20 text-[#5865f2]">
                  <span className="text-[11px] font-bold">{line.name.charAt(0).toUpperCase()}</span>
                </span>
              ) : (
                <span className="mt-0.5 shrink-0 text-[12px] tabular-nums text-muted-foreground/40">
                  {getLineTimestamp(active.id, index)}
                </span>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex w-full min-w-0 items-center gap-1.5">
                  {!isYouTubeBotLine &&
                    !isTwitchBotLine &&
                    !isDiscordBotLine &&
                    !isKickBotLine &&
                    line.badges.map((badge) => (
                      <RoleBadge key={`${line.name}-${badge}-${index}`} badge={badge} />
                    ))}

                  {isDiscordBotLine ? (
                    <>
                      <span className="shrink-0 text-sm font-semibold text-foreground">
                        {line.name}
                      </span>
                      <span className="rounded-sm bg-[#5865f2] px-1 py-[1px] text-[9px] font-bold uppercase leading-none text-white">
                        BOT
                      </span>
                      <span className="text-[11px] text-muted-foreground/70">
                        {getLineTimestamp(active.id, index)}
                      </span>
                    </>
                  ) : isTwitchBotLine ? (
                    <>
                      {line.badges.includes('tw-mod') && (
                        <RoleBadge badge="tw-mod" />
                      )}
                      {line.badges.includes('tw-bot') && (
                        <RoleBadge badge="tw-bot" />
                      )}
                      <span className="shrink-0 text-sm font-semibold text-[#22c55e]">
                        {line.name}:
                      </span>
                    </>
                  ) : isKickBotLine ? (
                    <>
                      <span
                        className="inline-flex size-4 items-center justify-center rounded-sm bg-[#35b8ff]"
                        title="Kick tool badge"
                      >
                        <HammerIcon className="size-2.5 text-[#07121a]" />
                      </span>
                      <span
                        className="inline-flex size-4 items-center justify-center rounded-sm bg-[#53fc18]"
                        title="Verified bot"
                      >
                        <BadgeCheckIcon className="size-2.5 text-[#0a1707]" />
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-[#53fc18]">
                        {line.name}:
                      </span>
                    </>
                  ) : isYouTubeBotLine ? (
                    <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#3ea6ff]">
                      {line.name}
                      <span title="Verified bot">
                        <BadgeCheckIcon className="size-4 fill-[#3ea6ff] text-white" />
                      </span>
                    </span>
                  ) : (
                    <span
                      className={`shrink-0 text-sm font-semibold ${line.isBot ? 'text-[#20ab8c]' : 'text-foreground/85'
                        }`}
                    >
                      {line.name}
                    </span>
                  )}

                  <p
                    className={`min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm ${isDiscordBotLine || isKickBotLine ? 'text-foreground/90' : 'text-muted-foreground'
                      }`}
                  >
                    {line.text}
                  </p>
                </div>
              </div>
            </div>
          )
        })}


      </div>
    </div>
  )
}
