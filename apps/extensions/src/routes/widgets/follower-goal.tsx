import { createFileRoute, useLocation } from '@tanstack/react-router';
import { FollowerGoalWidget } from '#/features/widgets/follower-goal/follower-goal-widget';
import { OVERLAY_FONT_URL } from '#/features/widgets/overlay-style';
import { readFollowerGoalSettings } from '#/lib/follower-goal-url';
import { readFlag } from '#/lib/url-params';

export const Route = createFileRoute('/widgets/follower-goal')({
  ssr: false,
  head: () => ({
    links: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: OVERLAY_FONT_URL },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const params = new URLSearchParams(useLocation({ select: (location) => location.searchStr }));
  const text = (key: string) => params.get(key)?.trim() || undefined;
  const simPlatform = params.get('simplatform');
  return (
    <FollowerGoalWidget
      twitchChannel={text('twitch')}
      kickChannel={text('kick')}
      token={text('token')}
      settings={readFollowerGoalSettings(params)}
      simulate={readFlag(params.get('simulate'), false)}
      simPlatform={simPlatform === 'twitch' || simPlatform === 'kick' ? simPlatform : undefined}
      previewId={text('preview')}
    />
  );
}
