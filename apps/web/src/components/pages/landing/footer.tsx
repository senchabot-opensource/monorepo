import Image from 'next/image'

import { Link } from '@/components/ui/link'

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

export function Footer() {
  return (
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
            All Bots and Stream overlays, Manage from one place!
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
  )
}
