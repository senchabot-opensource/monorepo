import { createFileRoute, useLocation } from '@tanstack/react-router';
import { SpinWheelOverlay } from '#/features/widgets/spin-wheel/spin-wheel-overlay';
import { readSpinWheelSettings } from '#/lib/spin-wheel-url';
import { readFlag } from '#/lib/url-params';

export const Route = createFileRoute('/widgets/spin-wheel')({
  ssr: false,
  component: RouteComponent,
});

// Read as text, like the setup page's paste-to-edit does: the router would turn "30" into a
// number, and the readers take strings.
function RouteComponent() {
  const params = new URLSearchParams(useLocation({ select: (location) => location.searchStr }));
  const text = (key: string) => params.get(key)?.trim() || undefined;
  return (
    <div className="size-full min-h-screen bg-transparent">
      <SpinWheelOverlay
        twitchChannel={text('twitch')}
        kickChannel={text('kick')}
        settings={readSpinWheelSettings(params)}
        simulate={readFlag(params.get('simulate'), false)}
        previewId={text('preview')}
      />
    </div>
  );
}
