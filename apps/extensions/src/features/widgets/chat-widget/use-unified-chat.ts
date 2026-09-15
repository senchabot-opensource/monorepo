import React from 'react';
import { type ChatMessagesType, chatMessagesCollection } from './chat-messages';
import { TwitchChat } from '#/lib/twitch';
import { KickChat } from '#/lib/kick';

const MAX_CHAT_HISTORY = 100;

/** The last messages on screen and who wrote them, fed by both platforms' chat clients. */
function createChatStore() {
  const messageOrder: string[] = [];
  const seenIds = new Set<string>();
  // Keyed by platform too: a ban or /clear on one platform leaves the other's messages alone.
  const userIndex = new Map<string, Set<string>>();
  const userKey = (platform: ChatMessagesType['platform'], userLower: string) =>
    `${platform}:${userLower}`;

  const pruneUserIndex = (id: string, key?: string) => {
    if (!key) {
      return;
    }
    const set = userIndex.get(key);
    if (!set) {
      return;
    }
    set.delete(id);
    if (set.size === 0) {
      userIndex.delete(key);
    }
  };

  const keyOf = (message?: ChatMessagesType) =>
    message?.userLower ? userKey(message.platform, message.userLower) : undefined;

  const forget = (id: string) => {
    seenIds.delete(id);
    const idx = messageOrder.indexOf(id);
    if (idx !== -1) {
      messageOrder.splice(idx, 1);
    }
    chatMessagesCollection.delete(id);
  };

  // The overlay orders by receivedAt and breaks ties by id, which Twitch makes random UUIDs, so
  // the lines of one frame (arriving in the same millisecond) each get their own later time.
  let lastReceivedAt = 0;

  const pushToMessages = (payload: ChatMessagesType) => {
    const userLower = payload.userLower ?? payload.user.toLowerCase();
    lastReceivedAt = Math.max(Date.now(), lastReceivedAt + 1);
    const message: ChatMessagesType = {
      ...payload,
      receivedAt: new Date(lastReceivedAt),
      userLower,
    };
    const key = userKey(message.platform, userLower);
    chatMessagesCollection.insert(message);

    if (seenIds.has(message.id)) {
      const existingIndex = messageOrder.indexOf(message.id);
      if (existingIndex !== -1) {
        messageOrder.splice(existingIndex, 1);
      }
      pruneUserIndex(message.id, key);
    } else {
      seenIds.add(message.id);
    }
    messageOrder.push(message.id);
    const bucket = userIndex.get(key) ?? new Set<string>();
    bucket.add(message.id);
    userIndex.set(key, bucket);

    while (messageOrder.length > MAX_CHAT_HISTORY) {
      const oldestId = messageOrder.shift();
      if (!oldestId) {
        break;
      }

      const oldest = chatMessagesCollection.get(oldestId);
      seenIds.delete(oldestId);
      pruneUserIndex(oldestId, keyOf(oldest));
      chatMessagesCollection.delete(oldestId);
    }
  };

  const deleteMessage = (id: string) => {
    const existing = chatMessagesCollection.get(id);
    const hadIt = existing !== undefined;
    if (hadIt) {
      pruneUserIndex(id, keyOf(existing));
      forget(id);
    }
    if (typeof window !== 'undefined') {
      console.debug(
        `[chat-widget] deleteMessage(${id}) hadIt=${hadIt} seenIds.has=${seenIds.has(id)}`,
      );
    }
  };

  const banUser = (platform: ChatMessagesType['platform']) => (usernameLower: string) => {
    const key = userKey(platform, usernameLower);
    const bucket = userIndex.get(key);
    if (!bucket || bucket.size === 0) {
      return;
    }
    for (const id of Array.from(bucket)) {
      if (seenIds.has(id)) {
        forget(id);
      }
    }
    userIndex.delete(key);
  };

  const clearAll = (platform: ChatMessagesType['platform']) => () => {
    for (const id of [...messageOrder]) {
      const message = chatMessagesCollection.get(id);
      if (message && message.platform !== platform) {
        continue;
      }
      pruneUserIndex(id, keyOf(message));
      forget(id);
    }
  };

  return { pushToMessages, deleteMessage, banUser, clearAll };
}

export const useUnifiedChat = (twitchChannel?: string | null, kickChannelId?: string | null) => {
  const store = React.useMemo(createChatStore, []);

  // One connection each, so a Kick id that arrives late (the lookup retries) leaves Twitch be.
  React.useEffect(() => {
    const channel = twitchChannel?.trim();
    if (!channel) return;
    const client = new TwitchChat(
      channel,
      store.pushToMessages,
      store.deleteMessage,
      store.banUser('twitch'),
      store.clearAll('twitch'),
    );
    return () => client.disconnect();
  }, [twitchChannel, store]);

  React.useEffect(() => {
    const chatroomId = kickChannelId?.trim();
    if (!chatroomId) return;
    const client = new KickChat(
      chatroomId,
      store.pushToMessages,
      store.deleteMessage,
      store.banUser('kick'),
      store.clearAll('kick'),
    );
    return () => client.disconnect();
  }, [kickChannelId, store]);
};
