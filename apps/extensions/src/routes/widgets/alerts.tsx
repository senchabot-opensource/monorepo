import { createFileRoute } from '@tanstack/react-router';
import Pusher from 'pusher-js';
import { useEffect } from 'react';
import { z } from 'zod';
import { AlertContainer } from '#/features/widgets/alerts/alert-container';
import { useAlertQueue } from '#/features/widgets/alerts/use-alert-queue';
import type { AlertPosition } from '#/lib/alert-config';
import { pusherAuth } from '#/lib/pusher-auth';
import { readFlag } from '#/lib/url-params';

const searchSchema = z.object({
  kick: z.string(),
  // A mistyped value falls back instead of putting the router's error screen on stream.
  pos: z.enum(['center', 'center-right', 'center-left']).optional().catch(undefined),
  // The router hands over glow=1 as a number and glow=yes as text; read them as the other
  // overlays read a flag, so they turn the glow on instead of failing.
  glow: z.preprocess(
    (value) => readFlag(value === undefined ? null : String(value), false),
    z.boolean(),
  ),
});

interface FollowData {
  name: string;
  platform: 'kick';
}

export const Route = createFileRoute('/widgets/alerts')({
  ssr: false,
  validateSearch: (search) => searchSchema.parse(search),
  // Only the alert card uses font-display (400 and 700), so Orbitron loads here, not site-wide.
  head: () => ({
    links: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap',
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { kick, pos, glow } = Route.useSearch();
  const glowEnabled = glow !== false;
  const { visibleAlerts, addAlert } = useAlertQueue();

  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_SOCKETO_KEY, {
      wsHost: import.meta.env.VITE_SOCKETO_HOST,
      wsPort: Number(import.meta.env.VITE_SOCKETO_PORT) || undefined,
      forceTLS: import.meta.env.PROD,
      enabledTransports: ['ws', 'wss'],
      cluster: 'socketo',
      authorizer: (channel) => ({
        authorize: async (socketId, callback) => {
          try {
            const result = await pusherAuth({
              data: {
                socketId: socketId,
                channelName: channel.name,
              },
            });
            callback(null, result);
          } catch (err) {
            callback(err instanceof Error ? err : new Error('Auth failed'), null);
          }
        },
      }),
    });

    const channel = pusher.subscribe(`private-${kick}`);

    channel.bind('follow', (data: FollowData) => {
      addAlert('follow', data);
    });

    channel.bind('sub', (data: FollowData) => {
      addAlert('sub', data);
    });

    channel.bind('donate', (data: FollowData & { amount: string }) => {
      addAlert('donate', data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [kick, addAlert]);

  return (
    <div className="min-h-screen bg-transparent overflow-hidden">
      <AlertContainer
        alerts={visibleAlerts}
        position={(pos as AlertPosition) || 'center-right'}
        glow={glowEnabled}
      />
    </div>
  );
}
