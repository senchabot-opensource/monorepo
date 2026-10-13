import { createServerFn } from '@tanstack/react-start';

/** The Pusher app kick.com's own pages connect to. */
export interface KickPusherApp {
  key: string;
  cluster: string;
}

// kick.com's pages ask this endpoint which realtime app to use. Its CORS only lets kick.com and
// localhost read the answer, so the site's server asks on the browser's behalf.
const KICK_REALTIME_URL = 'https://web.kick.com/api/v1/realtime/connection';
const LOOKUP_TIMEOUT_MS = 5_000;
const CACHE_MS = 10 * 60_000;

/**
 * Reads the Pusher app out of Kick's answer, or null. Both parts end up in the socket URL, the
 * cluster in its host name, so anything but plain letters and digits is refused.
 */
export function parseKickPusherApp(body: unknown): KickPusherApp | null {
  const connections = (body as { data?: { connections?: unknown } } | null)?.data?.connections;
  if (!Array.isArray(connections)) return null;
  for (const connection of connections) {
    if (connection?.provider !== 'pusher') continue;
    const key = connection.credentials?.app_key;
    const cluster = connection.credentials?.cluster;
    if (
      typeof key === 'string' &&
      /^[A-Za-z0-9]{8,64}$/.test(key) &&
      typeof cluster === 'string' &&
      /^[a-z0-9]{2,16}$/.test(cluster)
    ) {
      return { key, cluster };
    }
  }
  return null;
}

let cached: { app: KickPusherApp; at: number } | null = null;

/** Asks Kick which Pusher app its chat runs on now; null when Kick doesn't say. */
export const getKickPusherApp = createServerFn({ method: 'GET' }).handler(
  async (): Promise<KickPusherApp | null> => {
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.app;
    try {
      const response = await fetch(KICK_REALTIME_URL, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        // Offering only Pusher: offered Centrifugo as well, Kick answers with Centrifugo alone.
        body: JSON.stringify({
          client: { id: crypto.randomUUID(), type: 'web' },
          capabilities: { accepted_providers: [{ provider: 'pusher' }] },
        }),
        signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
      });
      if (!response.ok) return null;
      const app = parseKickPusherApp(await response.json());
      if (app) cached = { app, at: Date.now() };
      return app;
    } catch {
      return null;
    }
  },
);
