import { createFileRoute, useLocation } from '@tanstack/react-router';
import { OVERLAY_FONT_URL } from '#/features/widgets/overlay-style';
import { SubathonWidget } from '#/features/widgets/subathon/subathon-widget';
import { readSubathonSettings } from '#/lib/subathon-url';
import { readFlag } from '#/lib/url-params';

export const Route = createFileRoute('/widgets/subathon')({
  ssr: false,
  head: () => ({
    links: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: OVERLAY_FONT_URL },
    ],
  }),
  component: RouteComponent,
});

// Read as text, like the setup page's paste-to-edit does: the router would turn "3600" into a
// number and "0" flags into numbers, and the readers take strings.
function RouteComponent() {
  const params = new URLSearchParams(useLocation({ select: (location) => location.searchStr }));
  const text = (key: string) => params.get(key)?.trim() || undefined;
  const simPlatform = params.get('simplatform');
  const simSpeed = Number(params.get('simspeed'));
  return (
    <SubathonWidget
      twitchChannel={text('twitch')}
      kickChannel={text('kick')}
      settings={readSubathonSettings(params)}
      simulate={readFlag(params.get('simulate'), false)}
      simSpeed={Number.isFinite(simSpeed) && simSpeed > 0 ? simSpeed : undefined}
      simPlatform={simPlatform === 'twitch' || simPlatform === 'kick' ? simPlatform : undefined}
      previewId={text('preview')}
    />
  );
}
