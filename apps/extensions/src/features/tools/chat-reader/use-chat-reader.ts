import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatPlatform } from '#/features/tools/command-users';
import type { ChatMessagesType } from '#/features/widgets/chat-widget/chat-messages';
import type { BaseChatClient, ChatConnectionStatus } from '#/lib/basechat';
import { KickChat } from '#/lib/kick';
import { TwitchChat } from '#/lib/twitch';
import {
  applyOps,
  deserializeLog,
  type ReaderEntry,
  type ReaderEvent,
  type ReaderOp,
  serializeLog,
  storageKey,
} from './reader-log';

// Busy chats deliver dozens of messages a second; one render per batch keeps scrolling smooth.
const FLUSH_MS = 100;
const SAVE_MS = 1000;

type Options = {
  twitchChannel: string;
  kick: { slug: string; chatroomId: string } | null;
};

function readSaved(key: string, now: number): ReaderEntry[] {
  let text: string | null = null;
  try {
    text = window.localStorage.getItem(key);
  } catch {
    // localStorage unavailable
  }
  const saved = deserializeLog(text, now);
  if (!saved || saved.entries.length === 0) return [];
  return applyOps(saved.entries, [
    { op: 'event', event: { kind: 'resumed', savedAt: saved.savedAt }, at: now },
  ]);
}

/** Runs the reader's chat connections and keeps its message and event log. */
export function useChatReader({ twitchChannel, kick }: Options) {
  const key = storageKey(twitchChannel, kick?.slug ?? '');
  const [entries, setEntries] = useState<ReaderEntry[]>(() => readSaved(key, Date.now()));
  const [status, setStatus] = useState<Partial<Record<ChatPlatform, ChatConnectionStatus>>>({});
  /** When each lost connection dropped, until it is back. */
  const [downSince, setDownSince] = useState<Partial<Record<ChatPlatform, number>>>({});
  const [online, setOnline] = useState(() => navigator.onLine);
  const clientsRef = useRef<Partial<Record<ChatPlatform, BaseChatClient>>>({});

  const queueRef = useRef<ReaderOp[]>([]);
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const push = useCallback((op: ReaderOp) => {
    queueRef.current.push(op);
    if (flushTimerRef.current !== null) return;
    flushTimerRef.current = setTimeout(() => {
      flushTimerRef.current = null;
      const ops = queueRef.current;
      queueRef.current = [];
      setEntries((current) => applyOps(current, ops));
    }, FLUSH_MS);
  }, []);
  const pushEvent = useCallback(
    (event: ReaderEvent) => push({ op: 'event', event, at: Date.now() }),
    [push],
  );

  useEffect(
    () => () => {
      if (flushTimerRef.current !== null) clearTimeout(flushTimerRef.current);
    },
    [],
  );

  // Saved at most once a second, and once more when the page goes away.
  const entriesRef = useRef(entries);
  entriesRef.current = entries;
  useEffect(() => {
    const save = () => {
      try {
        // Rows still waiting for the next batch are saved too.
        const entries = applyOps(entriesRef.current, queueRef.current);
        window.localStorage.setItem(key, serializeLog(entries, Date.now()));
      } catch {
        // Full or unavailable: the reader still works, it just won't remember.
      }
    };
    const id = setInterval(save, SAVE_MS);
    window.addEventListener('pagehide', save);
    return () => {
      clearInterval(id);
      window.removeEventListener('pagehide', save);
      save();
    };
  }, [key]);

  useEffect(() => {
    const onOnline = () => {
      setOnline(true);
      pushEvent({ kind: 'networkBack' });
    };
    const onOffline = () => {
      setOnline(false);
      pushEvent({ kind: 'networkLost' });
    };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [pushEvent]);

  const kickSlug = kick?.slug ?? '';
  const kickChatroomId = kick?.chatroomId ?? '';

  useEffect(() => {
    const clients: Partial<Record<ChatPlatform, BaseChatClient>> = {};

    const watch = (platform: ChatPlatform, channel: string, client: BaseChatClient) => {
      let everConnected = false;
      let downSince: number | null = null;
      client.onStatus = (next) => {
        setStatus((current) => ({ ...current, [platform]: next }));
        const now = Date.now();
        if (next.state === 'connected') {
          if (!everConnected) {
            pushEvent({ kind: 'connected', platform, channel });
          } else if (downSince !== null) {
            pushEvent({ kind: 'reconnected', platform, downMs: now - downSince });
          }
          everConnected = true;
          downSince = null;
          setDownSince(({ [platform]: _, ...rest }) => rest);
        } else if (next.state === 'reconnecting' && everConnected && downSince === null) {
          downSince = now;
          setDownSince((current) => ({ ...current, [platform]: now }));
          pushEvent({ kind: 'disconnected', platform });
        }
      };
      clients[platform] = client;
    };

    const onMessage = (msg: ChatMessagesType) => push({ op: 'message', msg, at: Date.now() });
    const onDelete = (id: string) => push({ op: 'delete', id });
    const onBan = (platform: ChatPlatform) => (userLower: string) =>
      push({ op: 'deleteUser', platform, userLower });
    const onClear = (platform: ChatPlatform) => () => pushEvent({ kind: 'chatCleared', platform });

    // onStatus is set after the constructor has opened the socket, so the first "connecting" is
    // reported here.
    if (twitchChannel) {
      setStatus((current) => ({ ...current, twitch: { state: 'connecting' } }));
      watch(
        'twitch',
        twitchChannel,
        new TwitchChat(twitchChannel, onMessage, onDelete, onBan('twitch'), onClear('twitch')),
      );
    }
    if (kickChatroomId) {
      setStatus((current) => ({ ...current, kick: { state: 'connecting' } }));
      watch(
        'kick',
        kickSlug,
        new KickChat(kickChatroomId, onMessage, onDelete, onBan('kick'), onClear('kick')),
      );
    }
    clientsRef.current = clients;

    return () => {
      clientsRef.current = {};
      for (const client of Object.values(clients)) client.disconnect();
    };
  }, [twitchChannel, kickSlug, kickChatroomId, push, pushEvent]);

  const retryNow = useCallback((platform: ChatPlatform) => {
    clientsRef.current[platform]?.reconnectNow();
  }, []);

  const clearHistory = useCallback(() => {
    queueRef.current = [];
    setEntries([]);
  }, []);

  return { entries, status, downSince, online, retryNow, clearHistory };
}
