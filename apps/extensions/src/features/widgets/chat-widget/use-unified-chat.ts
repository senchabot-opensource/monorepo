import React from "react";
import { type ChatMessagesType, chatMessagesCollection } from "./chat-messages";
import { TwitchChat } from "#/lib/twitch";
import { KickChat } from "#/lib/kick";


type Disconnectable = {
  disconnect: () => void;
};

const MAX_CHAT_HISTORY = 100;

export const useUnifiedChat = (
  twitchChannel?: string | null,
  kickChannelId?: string | null,
) => {
  React.useEffect(() => {
    const messageOrder: string[] = [];
    const seenIds = new Set<string>();
    // Keyed by platform too: a ban or /clear on one platform leaves the other's messages alone.
    const userIndex = new Map<string, Set<string>>();
    const userKey = (platform: ChatMessagesType["platform"], userLower: string) =>
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

    const pushToMessages = (payload: ChatMessagesType) => {
      const userLower = payload.userLower ?? payload.user.toLowerCase();
      const message: ChatMessagesType = {
        ...payload,
        receivedAt: new Date(),
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
      /*if (!seenIds.has(id)) {
        return;
      }*/
      const existing = chatMessagesCollection.get(id);
      const hadIt = existing !== undefined;
      if (hadIt) {
        pruneUserIndex(id, keyOf(existing));
        forget(id);
      }
      if (typeof window !== "undefined") {
        console.debug(
          `[chat-widget] deleteMessage(${id}) hadIt=${hadIt} seenIds.has=${seenIds.has(id)}`,
        );
      }
    };

    const banUser =
      (platform: ChatMessagesType["platform"]) => (usernameLower: string) => {
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

    const clearAll = (platform: ChatMessagesType["platform"]) => () => {
      for (const id of [...messageOrder]) {
        const message = chatMessagesCollection.get(id);
        if (message && message.platform !== platform) {
          continue;
        }
        pruneUserIndex(id, keyOf(message));
        forget(id);
      }
    };

    const clients: Disconnectable[] = [];
    const normalizedTwitchChannel = twitchChannel?.trim();
    const normalizedKickChannelId = kickChannelId?.trim();

    if (normalizedTwitchChannel) {
      clients.push(
        new TwitchChat(
          normalizedTwitchChannel,
          pushToMessages,
          deleteMessage,
          banUser("twitch"),
          clearAll("twitch"),
        ),
      );
    }

    if (normalizedKickChannelId) {
      clients.push(
        new KickChat(
          normalizedKickChannelId,
          pushToMessages,
          deleteMessage,
          banUser("kick"),
          clearAll("kick"),
        ),
      );
    }

    return () => {
      for (const client of clients) {
        client.disconnect();
      }
    };
  }, [twitchChannel, kickChannelId]);
};
