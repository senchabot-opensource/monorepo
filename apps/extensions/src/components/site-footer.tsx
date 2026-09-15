import type { ComponentType, ReactNode } from 'react';
import { ExternalLink } from '#/components/external-link';
import {
  DiscordIcon,
  type IconProps,
  InstagramIcon,
  RedditIcon,
  XIcon,
  YoutubeIcon,
} from '#/components/icons';
import { LocaleLink } from '#/components/locale-link';
import { useI18n } from '#/lib/i18n';
import { CONTENT_PATHS, LINKS } from '#/lib/links';
import { OVERLAYS, TOOLS } from '#/lib/widgets';

const LINK_CLASS =
  'rounded text-sm text-zinc-600 transition-colors hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-zinc-400 dark:hover:text-green-400';

const SOCIALS: { href: string; label: string; Icon: ComponentType<IconProps> }[] = [
  { href: LINKS.x, label: 'X (Twitter)', Icon: XIcon },
  { href: LINKS.instagram, label: 'Instagram', Icon: InstagramIcon },
  { href: LINKS.youtube, label: 'YouTube', Icon: YoutubeIcon },
  { href: LINKS.discord, label: 'Discord', Icon: DiscordIcon },
  { href: LINKS.reddit, label: 'Reddit', Icon: RedditIcon },
];

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
        {title}
      </h2>
      <ul className="mt-3 space-y-2.5">{children}</ul>
    </div>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  const guideLinks = [
    { path: CONTENT_PATHS.guides, label: t('common.footer.setupGuides') },
    { path: CONTENT_PATHS.faq, label: t('common.footer.faq') },
    { path: CONTENT_PATHS.changelog, label: t('common.footer.changelog') },
  ];

  return (
    <footer className="border-t border-zinc-200 bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/30">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <LocaleLink
              to="/"
              className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-white"
            >
              <img src="/senchabot-logo.svg" alt="" width={28} height={28} className="size-7" />
              {t('common.siteName')}
            </LocaleLink>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t('common.footer.about')}
            </p>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              <ExternalLink href={LINKS.source} className={LINK_CLASS}>
                {t('common.footer.license')}
              </ExternalLink>
            </p>
            <ul aria-label={t('common.footer.social')} className="mt-4 flex gap-1">
              {SOCIALS.map(({ href, label, Icon }) => (
                <li key={href}>
                  <ExternalLink
                    href={href}
                    title={label}
                    className="inline-flex size-9 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                  >
                    <Icon className="size-[18px]" />
                    <span className="sr-only">{label}</span>
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>

          <FooterColumn title={t('widgets.overlays')}>
            {OVERLAYS.map((widget) => (
              <li key={widget.id}>
                <LocaleLink to={widget.setupPath} className={LINK_CLASS}>
                  {t(widget.nameKey)}
                </LocaleLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={t('widgets.tools')}>
            {TOOLS.map((widget) => (
              <li key={widget.id}>
                <LocaleLink to={widget.setupPath} className={LINK_CLASS}>
                  {t(widget.nameKey)}
                </LocaleLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={t('common.footer.guides')}>
            {guideLinks.map(({ path, label }) => (
              <li key={path}>
                <LocaleLink to={path} className={LINK_CLASS}>
                  {label}
                </LocaleLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={t('common.nav.senchabot')}>
            {(
              [
                [LINKS.senchabot, t('common.footer.senchabotBot')],
                [LINKS.docs, t('common.footer.docs')],
                [LINKS.discord, 'Discord'],
                [LINKS.discussions, t('common.footer.discussions')],
                [LINKS.newIssue, t('common.footer.reportBug')],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <ExternalLink href={href} className={LINK_CLASS}>
                  {label}
                </ExternalLink>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-zinc-200 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
          <p>
            © {new Date().getFullYear()} Senchabot ·{' '}
            <ExternalLink
              href={LINKS.license}
              className="rounded hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:hover:text-green-400"
            >
              GPL-3.0
            </ExternalLink>
          </p>
          <p>{t('common.footer.notAffiliated')}</p>
        </div>
      </div>
    </footer>
  );
}
