'use client'

import { useState } from 'react'

import { CopyIcon, ExternalLinkIcon } from '@radix-ui/react-icons'
import { SproutIcon } from 'lucide-react'
import { toast } from 'sonner'

import { SubSproutOverlay } from '@/components/sub-sprout-overlay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Platform = 'twitch' | 'kick'

interface SubSproutOverlayClientProps {
  initialChannel?: string
  initialPlatform?: Platform
}

export default function SubSproutOverlayClient({
  initialChannel = '',
  initialPlatform = 'twitch',
}: SubSproutOverlayClientProps) {
  const [channel, setChannel] = useState(initialChannel)
  const [platform, setPlatform] = useState<Platform>(initialPlatform)

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/overlay/sub-sprout?channel=${channel}&platform=${platform}`
    navigator.clipboard.writeText(url)
    toast.success('Overlay URL copied to clipboard!')
  }

  return (
    <div className="max-w-screen-lg space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">
          Sub Sprout Overlay
        </h1>
        <p className="text-sm text-muted-foreground">
          A sprout overlay that grows with each subscription. Add as a browser
          source in OBS to show your sub progression.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full overflow-hidden rounded-lg border bg-[#1a1a1a]">
              <SubSproutOverlay channel={channel} platform={platform} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              The preview shows the default state. Connect to your{' '}
              {platform === 'kick' ? 'Kick' : 'Twitch'} channel to see the
              animation in action.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SproutIcon className="size-5" />
              Setup Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={platform}
                onValueChange={(value) => setPlatform(value as Platform)}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitch">Twitch</SelectItem>
                  <SelectItem value="kick">Kick</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel">
                Your {platform === 'kick' ? 'Kick' : 'Twitch'} Channel
              </Label>
              <Input
                id="channel"
                placeholder={`Enter your ${platform === 'kick' ? 'Kick' : 'Twitch'} username`}
                value={channel}
                onChange={(e) => setChannel(e.target.value.trim())}
              />
              <p className="text-xs text-muted-foreground">
                Enter your{' '}
                {platform === 'kick' ? 'Kick' : 'Twitch'} username to see the
                overlay connect to your chat
              </p>
            </div>

            <div className="space-y-2">
              <Label>How to add to OBS</Label>
              <ol className="list-decimal pl-4 text-sm text-muted-foreground">
                <li>Copy the overlay URL below</li>
                <li>In OBS, add a new Browser Source</li>
                <li>Paste the URL into the URL field</li>
                <li>
                  Set width to{' '}
                  <code className="rounded bg-muted px-1">800</code> and height
                  to <code className="rounded bg-muted px-1">600</code>
                </li>
                <li>
                  Check &quot;Shutdown source when not visible&quot; to save
                  resources
                </li>
              </ol>
            </div>

            <div className="space-y-2">
              <Label>How it works</Label>
              <ul className="list-disc pl-4 text-sm text-muted-foreground">
                <li>
                  The overlay connects to your{' '}
                  {platform === 'kick' ? 'Kick' : 'Twitch'} chat{' '}
                  {platform === 'kick' ? 'using kick-js' : 'using ComfyJS'}
                </li>
                <li>
                  Each subscription (new sub, resub, or gift sub) triggers the
                  sprout growth animation
                </li>
                <li>
                  After 4 subscriptions, the plant resets and starts growing
                  again
                </li>
                <li>
                  Test by typing{' '}
                  <code className="rounded bg-muted px-1">!grow</code> in your{' '}
                  {platform === 'kick' ? 'Kick' : 'Twitch'} chat
                </li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleCopyUrl}
                disabled={!channel}
              >
                <CopyIcon className="mr-2 size-4" />
                Copy Overlay URL
              </Button>
              <Button className="flex-1" asChild>
                <a
                  href={platform === 'kick' ? 'https://kick.com/' : 'https://twitch.tv/'}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <ExternalLinkIcon className="mr-2 size-4" />
                  Open {platform === 'kick' ? 'Kick' : 'Twitch'}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
