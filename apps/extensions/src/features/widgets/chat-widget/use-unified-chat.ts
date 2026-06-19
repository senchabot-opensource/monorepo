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
    const userIndex = new Map<string, Set<string>>();

    const pruneUserIndex = (id: string, userLower?: string) => {
      if (!userLower) {
        return;
      }
      const set = userIndex.get(userLower);
      if (!set) {
        return;
      }
      set.delete(id);
      if (set.size === 0) {
        userIndex.delete(userLower);
      }
    };

    const pushToMessages = (payload: ChatMessagesType) => {
      const userLower = payload.user.toLowerCase();
      const message: ChatMessagesType = {
        ...payload,
        receivedAt: new Date(),
        userLower,
      };
      chatMessagesCollection.insert(message);

      if (seenIds.has(message.id)) {
        const existingIndex = messageOrder.indexOf(message.id);
        if (existingIndex !== -1) {
          messageOrder.splice(existingIndex, 1);
        }
        pruneUserIndex(message.id, userLower);
      } else {
        seenIds.add(message.id);
      }
      messageOrder.push(message.id);
      const bucket = userIndex.get(userLower) ?? new Set<string>();
      bucket.add(message.id);
      userIndex.set(userLower, bucket);

      while (messageOrder.length > MAX_CHAT_HISTORY) {
        const oldestId = messageOrder.shift();
        if (!oldestId) {
          break;
        }

        const oldest = chatMessagesCollection.get(oldestId);
        seenIds.delete(oldestId);
        pruneUserIndex(oldestId, oldest?.userLower);
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
        seenIds.delete(id);
        const idx = messageOrder.indexOf(id);
        if (idx !== -1) {
          messageOrder.splice(idx, 1);
        }
        pruneUserIndex(id, existing?.userLower);
        chatMessagesCollection.delete(id);
      }
      if (typeof window !== "undefined") {
        console.debug(
          `[chat-widget] deleteMessage(${id}) hadIt=${hadIt} seenIds.has=${seenIds.has(id)}`,
        );
      }
    };

    const banUser = (usernameLower: string) => {
      const bucket = userIndex.get(usernameLower);
      if (!bucket || bucket.size === 0) {
        return;
      }
      const ids = Array.from(bucket);
      for (const id of ids) {
        if (!seenIds.has(id)) {
          continue;
        }
        seenIds.delete(id);
        const idx = messageOrder.indexOf(id);
        if (idx !== -1) {
          messageOrder.splice(idx, 1);
        }
        chatMessagesCollection.delete(id);
      }
      userIndex.delete(usernameLower);
    };

    const clearAll = () => {
      for (const id of messageOrder) {
        chatMessagesCollection.delete(id);
      }
      messageOrder.length = 0;
      seenIds.clear();
      userIndex.clear();
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
          banUser,
          clearAll,
        ),
      );
    }

    if (normalizedKickChannelId) {
      clients.push(
        new KickChat(
          normalizedKickChannelId,
          pushToMessages,
          deleteMessage,
          banUser,
          clearAll,
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
