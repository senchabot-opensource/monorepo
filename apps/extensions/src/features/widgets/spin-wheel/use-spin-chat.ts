import { useEffect, useRef, useState } from 'react';
import { useKickChannel } from '#/hooks/use-kick-channel';
import { KNOWN_BOTS } from '#/hooks/use-raffle-chat';
import type { SpinPermission } from '#/lib/spin-wheel-url';
import type { PollChatEvent } from '../poll/poll-chat';
import { KickPollSource, TwitchPollSource } from '../poll/poll-sources';
import { isSpinRequest, maySpin } from './spin-chat';

interface UseSpinChatOptions {
  twitch?: string;
  kick?: string;
  permission: SpinPermission;
  /** Seconds between accepted chat spins; 0 turns the cooldown off. */
  cooldownSec: number;
  /** The wheel is mid-spin: requests wait instead of queueing. */
  busy: boolean;
  /** False in the simulated preview, which never touches a channel. */
  enabled: boolean;
  /** An accepted `!spin`, with the viewer's login. */
  onSpin: (login: string) => void;
}

/**
 * Joins the Twitch and Kick chats and turns `!spin` into spin requests. One
 * global cooldown gates every viewer; the overlay shows what's left of it.
 */
export function useSpinChat({
  twitch,
  kick,
  permission,
  cooldownSec,
  busy,
  enabled,
  onSpin,
}: UseSpinChatOptions): { cooldownMs: number } {
  const [cooldownMs, setCooldownMs] = useState(0);
  const cooldownUntilRef = useRef(0);

  const optionsRef = useRef({ permission, cooldownSec, busy, enabled, onSpin });
  optionsRef.current = { permission, cooldownSec, busy, enabled, onSpin };

  const accept = useRef((event: PollChatEvent) => {
    if (event.kind !== 'message') return;
    const options = optionsRef.current;
    if (!options.enabled || options.busy) return;
    if (KNOWN_BOTS.has(event.login)) return;
    if (!isSpinRequest(event.text)) return;
    if (!maySpin(event, options.permission)) return;
    const now = Date.now();
    if (now < cooldownUntilRef.current) return;
    cooldownUntilRef.current = now + Math.max(0, options.cooldownSec) * 1000;
    setCooldownMs(Math.max(0, options.cooldownSec) * 1000);
    options.onSpin(event.login);
  });

  // The pill counts the cooldown down while it runs.
  const cooling = cooldownMs > 0;
  useEffect(() => {
    if (!cooling) return;
    const timer = window.setInterval(() => {
      setCooldownMs(Math.max(0, cooldownUntilRef.current - Date.now()));
    }, 250);
    return () => window.clearInterval(timer);
  }, [cooling]);

  useEffect(() => {
    if (!enabled || !twitch?.trim()) return;
    const source = new TwitchPollSource(twitch.trim(), (event) => accept.current(event));
    return () => source.disconnect();
  }, [enabled, twitch]);

  const chatroomId = useKickChannel(kick, enabled).channel?.chatroomId;
  useEffect(() => {
    if (!enabled || !chatroomId) return;
    const source = new KickPollSource(chatroomId, (event) => accept.current(event));
    return () => source.disconnect();
  }, [enabled, chatroomId]);

  return { cooldownMs };
}
