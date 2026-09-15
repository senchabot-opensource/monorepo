import type { ComponentType, ReactNode } from 'react';
import { ExternalLink } from '#/components/external-link';
import { DiscordIcon, GithubIcon, type IconProps } from '#/components/icons';
import { useI18n } from '#/lib/i18n';
import { LINKS } from '#/lib/links';
import { formatStarCount, REPO_URL, useGithubStars } from './github-stars';
import { ArrowRightIcon, LightbulbIcon, StarIcon } from './landing-icons';

interface CommunityItem {
  href: string;
  Icon: ComponentType<IconProps>;
  title: string;
  text: string;
  badge?: ReactNode;
}

/** Star the repo (with its live star count), request a widget, join Discord. */
export function CommunityLinks() {
  const { locale, t } = useI18n();
  const stars = useGithubStars();

  const items: CommunityItem[] = [
    {
      href: REPO_URL,
      Icon: GithubIcon,
      title: t('home.starTitle'),
      text: t('home.starText'),
      badge: stars !== null && (
        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-semibold text-zinc-700 tabular-nums dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          <StarIcon className="size-3.5 text-amber-500" />
          <span aria-hidden="true">{formatStarCount(stars, locale)}</span>
          <span className="sr-only">
            {t('home.starCount', { count: formatStarCount(stars, locale) })}
          </span>
        </span>
      ),
    },
    {
      href: LINKS.newIssue,
      Icon: LightbulbIcon,
      title: t('home.requestTitle'),
      text: t('home.requestText'),
    },
    {
      href: LINKS.discord,
      Icon: DiscordIcon,
      title: t('home.discordTitle'),
      text: t('home.discordText'),
    },
  ];

  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {items.map(({ href, Icon, title, text, badge }) => (
        <li key={href} className="flex">
          <ExternalLink
            href={href}
            className="group flex w-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-[border-color,box-shadow] hover:border-zinc-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            {/* Fixed-height row, so the star count shows up later without shifting the card. */}
            <span className="flex h-9 items-center justify-between gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                <Icon className="size-[18px]" />
              </span>
              {badge}
            </span>
            <span className="mt-4 flex items-center gap-1.5 text-base font-semibold text-zinc-900 dark:text-white">
              {title}
              <ArrowRightIcon className="size-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </span>
            <span className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {text}
            </span>
          </ExternalLink>
        </li>
      ))}
    </ul>
  );
}
