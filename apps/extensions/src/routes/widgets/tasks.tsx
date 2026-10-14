import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';
import { OVERLAY_FONT_URL } from '#/features/widgets/overlay-style';
import { TasksWidget } from '#/features/widgets/tasks/tasks-widget';
import { readTasksSettings } from '#/lib/tasks-url';
import { readFlag } from '#/lib/url-params';

export const Route = createFileRoute('/widgets/tasks')({
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
  const settings = useMemo(() => readTasksSettings(params), [params]);
  const text = (key: string) => params.get(key)?.trim() || undefined;
  return (
    <TasksWidget
      twitchChannel={text('twitch')}
      kickChannel={text('kick')}
      settings={settings}
      simulate={readFlag(params.get('simulate'), false)}
      previewId={text('preview')}
    />
  );
}
