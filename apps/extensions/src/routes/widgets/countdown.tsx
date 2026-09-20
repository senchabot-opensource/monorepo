import { createFileRoute, useLocation } from '@tanstack/react-router';
import { CountdownWidget } from '#/features/widgets/countdown/countdown-widget';
import { OVERLAY_FONT_URL } from '#/features/widgets/overlay-style';
import { readCountdownSettings } from '#/lib/countdown-url';
import { readFlag } from '#/lib/url-params';

export const Route = createFileRoute('/widgets/countdown')({
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

// Read as text, like the setup page's paste-to-edit does, so both read a URL the same way.
function RouteComponent() {
  const params = new URLSearchParams(useLocation({ select: (location) => location.searchStr }));
  const text = (key: string) => params.get(key)?.trim() || undefined;
  return (
    <CountdownWidget
      twitchChannel={text('twitch')}
      kickChannel={text('kick')}
      settings={readCountdownSettings(params)}
      simulate={readFlag(params.get('simulate'), false)}
      previewId={text('preview')}
    />
  );
}
