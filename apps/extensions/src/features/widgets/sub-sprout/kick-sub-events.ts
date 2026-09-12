// Pusher channels kick.com's own chat listens on: subs and chat on chatrooms.{id}.v2, gifted subs
// on chatroom_{id}. Both take the chatroom id, not the channel id.
export const kickSubChannels = (chatroomId: string): string[] => [
  `chatrooms.${chatroomId}.v2`,
  `chatroom_${chatroomId}`,
];

type GiftedSubscriptions = {
  gifted_usernames?: unknown;
  gifted_total?: unknown;
  chunk_details?: {
    correlation_id?: unknown;
    chunk_index?: unknown;
    total_chunks?: unknown;
  } | null;
};

/**
 * How many subs a Kick event adds, 0 when it isn't a sub. A large gift arrives in several
 * GiftedSubscriptionsEvent chunks that share a correlation_id and all carry the gift's
 * gifted_total, so only the first chunk counts. seenGifts keeps the ids of gifts in flight.
 */
export function kickSubCount(
  eventName: string,
  payload: Record<string, unknown> | null,
  seenGifts: Set<string>,
): number {
  if (eventName === "App\\Events\\SubscriptionEvent") {
    return 1;
  }
  if (eventName !== "GiftedSubscriptionsEvent" || !payload) {
    return 0;
  }

  const gift = payload as GiftedSubscriptions;
  const chunk = gift.chunk_details;
  const correlationId =
    typeof chunk?.correlation_id === "string" ? chunk.correlation_id : null;
  const firstChunk = !correlationId || !seenGifts.has(correlationId);
  if (correlationId) {
    const last =
      typeof chunk?.chunk_index === "number" &&
      typeof chunk.total_chunks === "number" &&
      chunk.chunk_index >= chunk.total_chunks - 1;
    if (last) {
      seenGifts.delete(correlationId);
    } else {
      seenGifts.add(correlationId);
    }
  }
  if (!firstChunk) {
    return 0;
  }

  const total = typeof gift.gifted_total === "number" ? gift.gifted_total : NaN;
  if (Number.isFinite(total) && total > 0) {
    return Math.floor(total);
  }
  return Array.isArray(gift.gifted_usernames) && gift.gifted_usernames.length > 0
    ? gift.gifted_usernames.length
    : 1;
}
