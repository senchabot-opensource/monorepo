import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';
import { LeaderboardWidget } from '#/features/widgets/leaderboard/leaderboard-widget';
import { OVERLAY_FONT_URL } from '#/features/widgets/overlay-style';
import { readLeaderboardSettings } from '#/lib/leaderboard-url';
import { readFlag } from '#/lib/url-params';

export const Route = createFileRoute('/widgets/leaderboard')({
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
  const search = useLocation({ select: (location) => location.searchStr });
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const settings = useMemo(() => readLeaderboardSettings(params), [params]);
  const text = (key: string) => params.get(key)?.trim() || undefined;
  const simPlatform = params.get('simplatform');
  return (
    <LeaderboardWidget
      twitchChannel={text('twitch')}
      kickChannel={text('kick')}
      settings={settings}
      simulate={readFlag(params.get('simulate'), false)}
      simPlatform={simPlatform === 'twitch' || simPlatform === 'kick' ? simPlatform : undefined}
      previewId={text('preview')}
    />
  );
}
