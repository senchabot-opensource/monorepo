import Image from 'next/image'
import NextLink from 'next/link'

import { CheckCircleIcon, XIcon } from 'lucide-react'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { GitHubIcon } from '@/components/ui/icons'
import { Link } from '@/components/ui/link'

import { ThemedImage } from './themed-image'

const navLinks = [
  {
    label: 'Documentation',
    path: '/docs',
    options: {
      target: '_blank',
      rel: 'noreferrer',
    },
  },
]

const productLinks = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Documentation',
    href: '/docs',
    options: {
      target: '_blank',
      rel: 'noreferrer',
    },
  },
]

const legalLinks = [
  {
    label: 'Terms of Service',
    href: '/terms-of-service',
  },
  {
    label: 'Privacy Policy',
    href: '/privacy-policy',
  },
  {
    label: 'Cookie Policy',
    href: '/cookie-policy',
  },
  {
    label: 'EULA',
    href: '/eula',
  },
]

const socialLinks = [
  {
    label: 'Twitter',
    href: 'https://x.com/senchabot',
  },
  {
    label: 'Discord',
    href: '/discord',
  },
  {
    label: 'GitHub',
    href: '/github',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/senchabot/',
  },
]

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* header */}
      <header className="sticky inset-x-0 top-0 z-50 bg-background/50 backdrop-blur-xl">
        <nav className="mx-auto grid h-16 w-full max-w-screen-lg grid-cols-2 items-center px-4 md:grid-cols-3">
          <NextLink
            className="relative inline-flex w-fit cursor-pointer select-none items-center space-x-2 text-2xl font-medium tracking-wide transition-all hover:opacity-75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            href="/"
          >
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
          </NextLink>
          <div className="hidden justify-center space-x-4 md:flex">
            {navLinks.map((item) => (
              <Link
                className="text-sm font-normal"
                href={item.path}
                key={item.path}
                {...item.options}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <ThemeToggle />
            <Button variant="secondary" asChild>
              <NextLink href="/signin">Sign in</NextLink>
            </Button>
          </div>
        </nav>
      </header>

      {/* hero */}
      <section id="hero">
        <div className="mx-auto flex max-w-screen-lg flex-col space-y-8 px-4 py-8 lg:space-y-12 lg:py-16">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl font-semibold md:max-w-md lg:max-w-3xl lg:text-6xl lg:leading-tight">
              Manage Your Community from One Place
            </h1>
            <p className="md:max-w-sm md:text-lg">
              Multi-platform bot designed for seamless integration with Twitch
              and Discord.
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

      {/* features */}
      <section id="features" className="bg-secondary/50">
        <div className="mx-auto w-full max-w-screen-lg px-4 py-8">
          <ul className="grid grid-cols-1 justify-center gap-4 py-8 text-3xl font-medium lg:grid-cols-3 lg:text-4xl">
            <li className="inline-flex items-center justify-center space-x-4 lg:justify-start">
              <XIcon className="size-12 shrink-0 text-red-500" />
              <p className="text-nowrap lg:text-wrap">
                Download required
              </p>
            </li>
            <li className="inline-flex items-center justify-center space-x-4 lg:justify-start">
              <CheckCircleIcon className="size-12 shrink-0 text-green-500" />
              <p>Free</p>
            </li>
            <li className="inline-flex items-center justify-center space-x-4 lg:justify-start">
              <CheckCircleIcon className="size-12 shrink-0 text-green-500" />
              <p>Open-source</p>
            </li>
          </ul>
        </div>
      </section>

      {/* footer */}
      <footer>
        <div className="mx-auto grid w-full max-w-screen-lg grid-cols-1 gap-9 px-4 py-12 lg:grid-cols-2 lg:gap-4">
          <div className="flex flex-col space-y-2">
            <div className="inline-flex w-fit select-none items-center space-x-2 text-2xl font-medium tracking-wide">
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
            <p className="text-balance text-sm text-muted-foreground">
              Manage your Discord and Twitch community with an open-source
              multi-platform bot.
            </p>
          </div>
          <div className="grid auto-cols-max grid-flow-col justify-between gap-4">
            <div className="space-y-2">
              <span className="text-sm font-medium uppercase text-foreground">
                Product
              </span>
              <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
                {productLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="font-normal hover:text-primary"
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
              <span className="text-sm font-medium uppercase text-foreground">
                Legal
              </span>
              <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
                {legalLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="font-normal hover:text-primary"
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
              <span className="text-sm font-medium uppercase text-foreground">
                Social
              </span>
              <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
                {socialLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="font-normal hover:text-primary"
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
        <div className="bg-secondary/50">
          <div className="mx-auto grid w-full max-w-screen-lg grid-cols-1 gap-2 p-4 text-center text-xs text-muted-foreground lg:grid-cols-2 lg:text-start">
            <p>© {new Date().getFullYear()} Senchabot. All Rights Reserved.</p>
            <p className="lg:text-end">
              Made with <span className="text-red-500">♥</span> from the
              community.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
