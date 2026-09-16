import { createFileRoute, useLocation } from '@tanstack/react-router';
import { FrameWidget } from '#/features/widgets/frame/frame-widget';
import { OVERLAY_FONT_URL } from '#/features/widgets/overlay-style';
import { readFrameSettings } from '#/lib/frame-url';
import { readFlag } from '#/lib/url-params';

export const Route = createFileRoute('/widgets/frame')({
  ssr: false,
  head: () => ({
    links: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      // The classic frame's label font, shared with the other classic overlays.
      { rel: 'stylesheet', href: OVERLAY_FONT_URL },
    ],
  }),
  component: RouteComponent,
});

// Read as text, like the setup page's paste-to-edit does, so both read a URL the same way.
function RouteComponent() {
  const params = new URLSearchParams(useLocation({ select: (location) => location.searchStr }));
  const demo = readFlag(params.get('demo'), false);
  return (
    <FrameWidget settings={readFrameSettings(params)} demo={demo} scene={!params.has('piece')} />
  );
}
