import { redirect } from 'next/navigation'

import type { Metadata } from 'next'
import Link from 'next/link'

import { auth } from '@/lib/auth'

import { LayersIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Tools',
}

export default async function ToolsPage() {
  const session = await auth()

  if (!session) {
    throw redirect('/signin')
  }

  const tools = [
    {
      title: 'Twitch Sub Badge Creator',
      description:
        'Upload an image to create Twitch subscription badges in 18x18, 36x36, and 72x72 sizes with transparent backgrounds.',
      href: '/dashboard/tools/sub-badge-creator',
      icon: LayersIcon,
    },
  ]

  return (
    <div className="max-w-screen-lg space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">Tools</h1>
        <p className="text-sm text-muted-foreground">
          Useful utilities for your streaming needs.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.href} href={tool.href}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                  <Icon className="size-5" />
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
