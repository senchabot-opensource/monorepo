import NextLink from 'next/link'

import { Button } from '@/components/ui/button'
import { GitHubIcon } from '@/components/ui/icons'
import { Link } from '@/components/ui/link'

import { ThemedImage } from './themed-image'

export function Hero() {
  return (
    <section id="hero">
      <div className="mx-auto flex max-w-screen-lg flex-col space-y-8 px-4 py-8 lg:space-y-12 lg:py-16">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <h1 className="text-4xl font-semibold md:max-w-md lg:max-w-3xl lg:text-6xl lg:leading-tight">
            Manage Your Community from One Place
          </h1>
          <p className="md:max-w-sm md:text-lg">
            Multi-platform bot designed for seamless integration with Twitch and
            Discord.
          </p>
          <div className="space-y-4">
            <Button asChild>
              <NextLink href="/signin">Get Senchabot</NextLink>
            </Button>
            <p className="flex items-center space-x-2 text-sm">
              <span>We&apos;re open source on</span>
              <Link
                className="inline-flex items-center space-x-1 font-normal underline"
                href="/github"
                target="_blank"
                rel="noreferrer"
              >
                <GitHubIcon />
                <span>GitHub</span>
              </Link>
            </p>
          </div>
        </div>
        <div className="rounded-2xl border-[1rem] bg-secondary shadow">
          <ThemedImage
            darkSrc="/images/dashboard-dark.png"
            lightSrc="/images/dashboard-light.png"
            alt="Dashboard"
            width={960}
            height={460}
            unoptimized
          />
        </div>
      </div>
    </section>
  )
}
