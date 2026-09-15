// Pusher channels kick.com's own chat listens on: subs and chat on chatrooms.{id}.v2, gifted subs
// on chatroom_{id}. Both take the chatroom id, not the channel id.
export const kickSubChannels = (chatroomId: string): string[] => [
  `chatrooms.${chatroomId}.v2`,
  `chatroom_${chatroomId}`,
];

type GiftedSubscriptions = {
  correlation_id?: unknown;
  gifted_usernames?: unknown;
  gifted_total?: unknown;
  chunk_details?: {
    correlation_id?: unknown;
    chunk_index?: unknown;
    total_chunks?: unknown;
  } | null;
};

// Only the ids of recent gifts matter for spotting a later chunk or a repeat.
const SEEN_GIFTS_MAX = 500;
const idOf = (value: unknown) => (typeof value === "string" && value ? value : null);

/**
 * How many subs a Kick GiftedSubscriptionsEvent adds, 0 for any other event. A large gift arrives
 * in several chunks that share a correlation_id and all carry the gift's gifted_total, so only
 * the first chunk counts. seenGifts keeps the ids of gifts in flight.
 */
export function kickSubCount(
  eventName: string,
  payload: Record<string, unknown> | null,
  seenGifts: Set<string>,
): number {
  if (eventName !== "GiftedSubscriptionsEvent" || !payload) {
    return 0;
  }

  const gift = payload as GiftedSubscriptions;
  const chunk = gift.chunk_details;
  // Live gifts carry the id at the top level with chunk_details null (every one of 29 probed),
  // so it is read there as well as from a chunk's own details.
  const correlationId = idOf(chunk?.correlation_id) ?? idOf(gift.correlation_id);
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
      if (seenGifts.size > SEEN_GIFTS_MAX) {
        seenGifts.delete(seenGifts.values().next().value as string);
      }
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
