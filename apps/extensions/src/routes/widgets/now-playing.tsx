import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';
import { NowPlayingWidget } from '#/features/widgets/now-playing/now-playing-widget';
import { OVERLAY_FONT_URL } from '#/features/widgets/overlay-style';
import { readNowPlayingSettings } from '#/lib/now-playing-url';
import { readFlag } from '#/lib/url-params';

export const Route = createFileRoute('/widgets/now-playing')({
  ssr: false,
  head: () => ({
    links: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      // The classic look's font, shared with the other classic overlays. A preset loads its own.
      { rel: 'stylesheet', href: OVERLAY_FONT_URL },
    ],
  }),
  component: RouteComponent,
});

// Read as text, like the setup page's paste-to-edit does: the router would turn a username like
// "1234" into a number, and the readers take strings.
function RouteComponent() {
  const search = useLocation({ select: (location) => location.searchStr });
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const settings = useMemo(() => readNowPlayingSettings(params), [params]);
  return (
    <NowPlayingWidget
      settings={settings}
      demo={readFlag(params.get('demo'), false)}
      previewId={params.get('preview')?.trim() || undefined}
    />
  );
}
