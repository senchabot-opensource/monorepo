import { createFileRoute, useLocation } from '@tanstack/react-router';
import { HUD_FONT_URL } from '#/features/widgets/irl-hud/hud-text';
import { IrlHudWidget } from '#/features/widgets/irl-hud/irl-hud-widget';
import { readHudSettings } from '#/lib/irl-hud-url';
import { readFlag } from '#/lib/url-params';

export const Route = createFileRoute('/widgets/irl-hud')({
  ssr: false,
  head: () => ({
    links: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: HUD_FONT_URL },
    ],
  }),
  component: RouteComponent,
});

// Read as text, like the setup page's paste-to-edit does: the router would turn "100" into a
// number and "0" flags into numbers, and the readers take strings.
function RouteComponent() {
  const params = new URLSearchParams(useLocation({ select: (location) => location.searchStr }));
  const text = (key: string) => params.get(key)?.trim() || undefined;
  const simPlatform = params.get('simplatform');
  return (
    <IrlHudWidget
      twitchChannel={text('twitch')}
      kickChannel={text('kick')}
      settings={readHudSettings(params)}
      simulate={readFlag(params.get('simulate'), false)}
      simPlatform={simPlatform === 'twitch' || simPlatform === 'kick' ? simPlatform : undefined}
      previewId={text('preview')}
    />
  );
}
