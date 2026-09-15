import { createFileRoute, useLocation } from '@tanstack/react-router';
import { PollWidget } from '#/features/widgets/poll/poll-widget';
import { OVERLAY_FONT_URL } from '#/features/widgets/overlay-style';
import { readPollSettings } from '#/lib/poll-url';
import { readFlag } from '#/lib/subathon-url';

export const Route = createFileRoute('/widgets/poll')({
  ssr: false,
  head: () => ({
    links: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      // Subathon Timer's font, so the chat-run tools read as one family on stream.
      { rel: 'stylesheet', href: OVERLAY_FONT_URL },
    ],
  }),
  component: RouteComponent,
});

// Read as text, like the setup page's paste-to-edit does: the router would turn "60" into a
// number, and the readers take strings.
function RouteComponent() {
  const params = new URLSearchParams(useLocation({ select: (location) => location.searchStr }));
  const text = (key: string) => params.get(key)?.trim() || undefined;
  const simPlatform = params.get('simplatform');
  return (
    <PollWidget
      twitchChannel={text('twitch')}
      kickChannel={text('kick')}
      settings={readPollSettings(params)}
      simulate={readFlag(params.get('simulate'), false)}
      simPlatform={simPlatform === 'twitch' || simPlatform === 'kick' ? simPlatform : undefined}
      previewId={text('preview')}
    />
  );
}
