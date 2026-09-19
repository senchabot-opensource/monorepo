import { useEffect } from 'react';
import { useKickChannel } from '#/hooks/use-kick-channel';
import type { SubathonEvent } from './subathon-events';
import { KickEventSource, TwitchEventSource } from './subathon-sources';

/**
 * Reads subs, gifts, Bits and Kicks, raids and mod commands from both chats while `enabled`.
 * `onEvent` should be stable: a new one reconnects.
 */
export function useSubEvents(
  twitch: string | undefined,
  kick: string | undefined,
  enabled: boolean,
  onEvent: (event: SubathonEvent) => void,
) {
  const kickChannel = useKickChannel(kick, enabled).channel;

  // One effect per platform: a Kick lookup that lands later must not restart the Twitch reader,
  // which would lose Twitch events meanwhile and forget the gift bundles in flight.
  useEffect(() => {
    if (!enabled || !twitch) return;
    const source = new TwitchEventSource(twitch, onEvent);
    return () => source.disconnect();
  }, [enabled, twitch, onEvent]);

  const chatroomId = kickChannel?.chatroomId;
  const channelId = kickChannel?.channelId ?? null;
  useEffect(() => {
    if (!enabled || !chatroomId) return;
    const source = new KickEventSource(chatroomId, channelId, onEvent);
    return () => source.disconnect();
  }, [enabled, chatroomId, channelId, onEvent]);
}
