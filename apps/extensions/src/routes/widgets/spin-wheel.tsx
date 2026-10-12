import { createFileRoute, useLocation } from '@tanstack/react-router';
import { SpinWheelOverlay } from '#/features/widgets/spin-wheel/spin-wheel-overlay';
import { readSpinWheelSettings, SAMPLE_SPIN_OPTIONS } from '#/lib/spin-wheel-url';
import { readFlag } from '#/lib/url-params';

export const Route = createFileRoute('/widgets/spin-wheel')({
  ssr: false,
  component: RouteComponent,
});

// Read as text, like the setup page's paste-to-edit does: the router would turn "30" into a
// number, and the readers take strings. `demo=1` spins the sample options on repeat, for previews
// like the presets page that bring no options of their own.
function RouteComponent() {
  const params = new URLSearchParams(useLocation({ select: (location) => location.searchStr }));
  const text = (key: string) => params.get(key)?.trim() || undefined;
  const demo = readFlag(params.get('demo'), false);
  const settings = readSpinWheelSettings(params);
  return (
    <div className="size-full min-h-screen bg-transparent">
      <SpinWheelOverlay
        twitchChannel={text('twitch')}
        kickChannel={text('kick')}
        settings={
          demo && settings.options.length < 2
            ? { ...settings, options: SAMPLE_SPIN_OPTIONS }
            : settings
        }
        simulate={demo || readFlag(params.get('simulate'), false)}
        previewId={text('preview')}
      />
    </div>
  );
}
