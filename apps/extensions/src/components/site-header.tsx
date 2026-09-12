import { Link, useLocation } from '@tanstack/react-router';
import { useEffect, useId, useRef, useState } from 'react';
import { ExternalLink } from '#/components/external-link';
import { CloseIcon, ExternalIcon, GithubIcon, MenuIcon } from '#/components/icons';
import { PlatformChips } from '#/components/platform-chips';
import { ICON_BUTTON_CLASS, SiteControls } from '#/components/site-controls';
import { DROPDOWN_ITEM_CLASS, DropdownMenu } from '#/components/ui/dropdown-menu';
import { useI18n } from '#/lib/i18n';
import { CONTENT_PATHS, LINKS, useRouteExists } from '#/lib/links';
import { getWidget, OVERLAYS, TOOLS, type WidgetEntry, type WidgetId } from '#/lib/widgets';

export type SiteHeaderProps =
  | {
      /** Sticky 56px bar with the full navigation, for the landing and content pages. */
      variant?: 'full';
    }
  | {
      /** One 48px row for setup and tool pages; it holds the page's H1. Not sticky. */
      variant: 'compact';
      /** The page H1. */
      title: string;
      /** Marks the current entry in the widget switcher and shows its icon; omit to hide both. */
      widgetId?: WidgetId;
    };

const NAV_LINK_CLASS =
  'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 aria-[current=page]:text-zinc-900 aria-expanded:bg-zinc-200/60 aria-expanded:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white dark:aria-[current=page]:text-white dark:aria-expanded:bg-zinc-800 dark:aria-expanded:text-white';
const GROUP_LABEL_CLASS =
  'px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400';

export function SiteHeader(props: SiteHeaderProps) {
  return props.variant === 'compact' ? <CompactHeader {...props} /> : <FullHeader />;
}

function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="sr-only rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-4 focus:z-[70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
    >
      {t('common.skipToContent')}
    </a>
  );
}

function HomeLink({ showName }: { showName: boolean }) {
  const { t } = useI18n();
  return (
    <Link
      to="/"
      aria-label={showName ? undefined : t('common.homeLink')}
      className="flex shrink-0 items-center gap-2 rounded-md text-sm font-semibold text-zinc-900 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-white"
    >
      <img src="/senchabot-logo.svg" alt="" width={28} height={28} className="size-7" />
      {showName && <span className="whitespace-nowrap">{t('common.siteName')}</span>}
    </Link>
  );
}

function WidgetIconTile({ widget, size = 'md' }: { widget: WidgetEntry; size?: 'sm' | 'md' }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-green-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-green-400 ${
        size === 'md' ? 'size-9' : 'size-7'
      }`}
    >
      <widget.Icon className={size === 'md' ? 'size-5' : 'size-4'} />
    </span>
  );
}

function WidgetMenuLink({ widget }: { widget: WidgetEntry }) {
  const { t } = useI18n();
  return (
    <Link
      to={widget.setupPath}
      className="flex gap-3 rounded-lg p-2.5 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:hover:bg-zinc-800/70"
    >
      <WidgetIconTile widget={widget} />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-zinc-900 dark:text-white">
          {t(widget.nameKey)}
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-zinc-500 dark:text-zinc-400">
          {t(widget.taglineKey)}
        </span>
        <PlatformChips platforms={widget.platforms} className="mt-1.5" />
      </span>
    </Link>
  );
}

/** Overlays and Tools lists, shared by the desktop menu (side by side) and the mobile sheet. */
function WidgetGroups({ sideBySide }: { sideBySide: boolean }) {
  const { t } = useI18n();
  const id = useId();
  return (
    <div className={`grid gap-3 ${sideBySide ? 'grid-cols-2' : ''}`}>
      {(
        [
          ['overlays', OVERLAYS],
          ['tools', TOOLS],
        ] as const
      ).map(([group, widgets]) => (
        <div key={group}>
          <p id={`${id}-${group}`} className={GROUP_LABEL_CLASS}>
            {t(`widgets.${group}`)}
          </p>
          <ul aria-labelledby={`${id}-${group}`}>
            {widgets.map((widget) => (
              <li key={widget.id}>
                <WidgetMenuLink widget={widget} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function WidgetsMenu() {
  const { t } = useI18n();
  return (
    // Anchored to the header row, not the button, so the wide panel never runs off a tablet.
    <DropdownMenu
      label={t('common.nav.widgets')}
      triggerClassName={NAV_LINK_CLASS}
      anchor="container"
      positionClassName="left-4"
      panelClassName="w-[min(44rem,calc(100%-2rem))] p-3"
    >
      <WidgetGroups sideBySide />
    </DropdownMenu>
  );
}

function useCurrent(path: string) {
  const pathname = useLocation({ select: (location) => location.pathname });
  return pathname === path || pathname.startsWith(`${path}/`) ? ('page' as const) : undefined;
}

function ContentLinks({ className }: { className: string }) {
  const { t } = useI18n();
  const guidesCurrent = useCurrent(CONTENT_PATHS.guides);
  const faqCurrent = useCurrent(CONTENT_PATHS.faq);
  const hasGuides = useRouteExists(CONTENT_PATHS.guides);
  const hasFaq = useRouteExists(CONTENT_PATHS.faq);
  return (
    <>
      {hasGuides && (
        <a href={CONTENT_PATHS.guides} aria-current={guidesCurrent} className={className}>
          {t('common.nav.guides')}
        </a>
      )}
      {hasFaq && (
        <a href={CONTENT_PATHS.faq} aria-current={faqCurrent} className={className}>
          {t('common.nav.faq')}
        </a>
      )}
      <ExternalLink href={LINKS.senchabot} className={className}>
        {t('common.nav.senchabot')}
        <ExternalIcon className="size-3.5 opacity-60" />
      </ExternalLink>
    </>
  );
}

function MobileMenu() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={dialogId}
        aria-label={t('common.nav.openMenu')}
        onClick={() => setOpen(true)}
        className={`${ICON_BUTTON_CLASS} md:hidden`}
      >
        <MenuIcon />
      </button>
      {/* Native modal dialog: focus trap, Escape and the inert page come from the browser. */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape is handled natively by <dialog>; the click only catches backdrop and link clicks. */}
      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-label={t('common.nav.menu')}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target === e.currentTarget || target.closest('a')) setOpen(false);
        }}
        className="m-0 ml-auto h-dvh max-h-none w-80 max-w-full border-l border-zinc-200 bg-white p-0 text-zinc-900 backdrop:bg-zinc-950/50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-zinc-200 px-4 dark:border-zinc-800">
            <HomeLink showName />
            <button
              type="button"
              aria-label={t('common.nav.closeMenu')}
              onClick={() => setOpen(false)}
              className={ICON_BUTTON_CLASS}
            >
              <CloseIcon />
            </button>
          </div>
          <nav aria-label={t('common.nav.label')} className="flex-1 overflow-y-auto p-3">
            <p className={`${GROUP_LABEL_CLASS} pt-1`}>{t('common.nav.widgets')}</p>
            <WidgetGroups sideBySide={false} />
            <div className="mt-3 flex flex-col border-t border-zinc-200 pt-3 dark:border-zinc-800">
              <ContentLinks className={NAV_LINK_CLASS} />
              <ExternalLink href={LINKS.source} className={NAV_LINK_CLASS}>
                <GithubIcon className="size-4" />
                {t('common.nav.github')}
              </ExternalLink>
            </div>
          </nav>
        </div>
      </dialog>
    </>
  );
}

function FullHeader() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-zinc-50/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/75">
      <SkipLink />
      <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
        <HomeLink showName />
        <nav
          aria-label={t('common.nav.label')}
          className="ml-4 flex items-center gap-0.5 max-md:hidden"
        >
          <WidgetsMenu />
          <ContentLinks className={NAV_LINK_CLASS} />
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <SiteControls />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function WidgetSwitcher({ current }: { current: WidgetId }) {
  const { t } = useI18n();
  return (
    <DropdownMenu
      label={null}
      ariaLabel={t('common.nav.switchWidget')}
      triggerClassName="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 aria-expanded:bg-zinc-200/70 aria-expanded:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white dark:aria-expanded:bg-zinc-800 dark:aria-expanded:text-white"
      anchor="container"
    >
      {(
        [
          ['overlays', OVERLAYS],
          ['tools', TOOLS],
        ] as const
      ).map(([group, widgets]) => (
        <div key={group} className="py-1">
          <p className={`${GROUP_LABEL_CLASS} pt-1`}>{t(`widgets.${group}`)}</p>
          <ul>
            {widgets.map((widget) => {
              const isCurrent = widget.id === current;
              return (
                <li key={widget.id}>
                  <Link
                    to={widget.setupPath}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={DROPDOWN_ITEM_CLASS}
                  >
                    <WidgetIconTile widget={widget} size="sm" />
                    <span className="flex-1">{t(widget.nameKey)}</span>
                    {isCurrent && (
                      <svg
                        className="size-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7" />
                      </svg>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </DropdownMenu>
  );
}

function CompactHeader({ title, widgetId }: Extract<SiteHeaderProps, { variant: 'compact' }>) {
  const { t } = useI18n();
  const widget = widgetId ? getWidget(widgetId) : null;

  return (
    <header className="mx-auto flex h-12 w-full max-w-6xl items-center gap-2 px-4">
      <SkipLink />
      <HomeLink showName={false} />
      <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">
        /
      </span>
      <div className="relative flex min-w-0 items-center gap-1.5">
        {widget && (
          <widget.Icon className="size-[18px] shrink-0 text-green-600 dark:text-green-400" />
        )}
        <h1 className="truncate text-base font-semibold text-zinc-900 dark:text-white">{title}</h1>
        {widget && <WidgetSwitcher current={widget.id} />}
      </div>
      <span className="shrink-0 whitespace-nowrap rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700 max-lg:hidden dark:text-green-400">
        {t('common.freeBadge')}
      </span>
      <div className="ml-auto">
        <SiteControls />
      </div>
    </header>
  );
}
