import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';
import { CounterWidget } from '#/features/widgets/counter/counter-widget';
import { OVERLAY_FONT_URL } from '#/features/widgets/overlay-style';
import { readCounterSettings } from '#/lib/counter-url';
import { readFlag } from '#/lib/url-params';

export const Route = createFileRoute('/widgets/counter')({
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

// Read as text, like the setup page's paste-to-edit does: the router would turn "120" into a
// number, and the readers take strings.
function RouteComponent() {
  const search = useLocation({ select: (location) => location.searchStr });
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const settings = useMemo(() => readCounterSettings(params), [params]);
  const text = (key: string) => params.get(key)?.trim() || undefined;
  return (
    <CounterWidget
      twitchChannel={text('twitch')}
      kickChannel={text('kick')}
      settings={settings}
      simulate={readFlag(params.get('simulate'), false)}
      previewId={text('preview')}
    />
  );
}
