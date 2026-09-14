import { createFileRoute, useLocation } from '@tanstack/react-router';
import {
  StreamAlertsWidget,
  themeFont,
} from '#/features/widgets/stream-alerts/stream-alerts-widget';
import { readStreamAlertsSettings } from '#/lib/stream-alerts-url';
import { readFlag } from '#/lib/subathon-url';

export const Route = createFileRoute('/widgets/stream-alerts')({
  ssr: false,
  component: RouteComponent,
});

// Read as text, like the setup page's paste-to-edit does: the router would turn "12" into a
// number and "0" flags into numbers, and the readers take strings.
function RouteComponent() {
  const params = new URLSearchParams(useLocation({ select: (location) => location.searchStr }));
  const text = (key: string) => params.get(key)?.trim() || undefined;
  const settings = readStreamAlertsSettings(params);
  const simPlatform = params.get('simplatform');
  return (
    <>
      {/* React hoists it into <head>; the font follows the theme, which only the URL knows. */}
      <link rel="stylesheet" href={themeFont(settings.theme)} precedence="default" />
      <StreamAlertsWidget
        twitchChannel={text('twitch')}
        kickChannel={text('kick')}
        settings={settings}
        simulate={readFlag(params.get('simulate'), false)}
        simPlatform={simPlatform === 'twitch' || simPlatform === 'kick' ? simPlatform : undefined}
        previewId={text('preview')}
      />
    </>
  );
}
