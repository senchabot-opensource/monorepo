import { useEffect, useRef } from 'react';
import type { SubathonPlatform } from '#/features/widgets/subathon/subathon-events';
import { FollowerGoalClient } from '#/lib/follower-goal';

/** A new follower on Twitch or Kick. Chat never says who followed; Senchabot does. */
export interface Follow {
  kind: 'follow';
  platform: SubathonPlatform;
  name: string;
}

/** The token a Senchabot connection gives, from a Follower Goal URL or as it was pasted. */
export function readFollowToken(text: string): string | null {
  const value = text.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.searchParams.get('token')?.trim() || null;
  } catch {
    // Not a URL: the token itself, which never has spaces in it.
    return /^\S+$/.test(value) ? value : null;
  }
}

/**
 * Calls `onFollow` with every new follower while `token`, a Senchabot connection, is set and
 * `enabled` is true. Senchabot's connection is the Follower Goal's; YouTube follows are left out.
 */
export function useFollows(
  token: string | undefined,
  channel: string | undefined,
  enabled: boolean,
  onFollow: (follow: Follow) => void,
) {
  const onFollowRef = useRef(onFollow);
  onFollowRef.current = onFollow;
  const key = token?.trim() ?? '';
  useEffect(() => {
    if (!enabled || !key) return;
    const client = new FollowerGoalClient(key, channel?.trim() ?? '', (follow) => {
      if (follow.platform !== 'twitch' && follow.platform !== 'kick') return;
      onFollowRef.current({ kind: 'follow', platform: follow.platform, name: follow.user });
    });
    return () => client.disconnect();
  }, [enabled, key, channel]);
}
