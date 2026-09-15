import { describe, expect, it } from "vitest";
import { kickSubChannels, kickSubCount } from "./kick-sub-events";

// Payloads captured from live Kick Pusher, names replaced.
const gift = (extra: Record<string, unknown> = {}) => ({
  chatroom_id: 1,
  correlation_id: "110003713021787",
  gifted_usernames: ["a", "b", "c", "d", "e"],
  gifter_username: "Gifter",
  gifted_total: 5,
  gifter_total: 5,
  chunk_details: null,
  ...extra,
});

describe("kickSubChannels", () => {
  it("listens where kick.com gets subs and gifted subs", () => {
    expect(kickSubChannels("42")).toEqual(["chatrooms.42.v2", "chatroom_42"]);
  });
});

describe("kickSubCount", () => {
  it("counts every sub in a gift", () => {
    expect(kickSubCount("GiftedSubscriptionsEvent", gift(), new Set())).toBe(5);
  });

  it("counts a gift split into chunks once, and forgets it after the last chunk", () => {
    const seen = new Set<string>();
    const chunk = (index: number) =>
      gift({
        gifted_total: 150,
        gifted_usernames: ["a"],
        chunk_details: { correlation_id: "c1", chunk_index: index, total_chunks: 3 },
      });

    expect(kickSubCount("GiftedSubscriptionsEvent", chunk(0), seen)).toBe(150);
    expect(kickSubCount("GiftedSubscriptionsEvent", chunk(1), seen)).toBe(0);
    expect(kickSubCount("GiftedSubscriptionsEvent", chunk(2), seen)).toBe(0);
    expect(seen.size).toBe(0);
  });

  it("counts a gift once when its parts only share the top-level correlation_id", () => {
    const seen = new Set<string>();
    const part = (names: string[]) =>
      gift({ gifted_total: 150, gifted_usernames: names, chunk_details: null });

    expect(kickSubCount("GiftedSubscriptionsEvent", part(["a"]), seen)).toBe(150);
    expect(kickSubCount("GiftedSubscriptionsEvent", part(["b"]), seen)).toBe(0);
    expect(
      kickSubCount("GiftedSubscriptionsEvent", gift({ correlation_id: "other" }), seen),
    ).toBe(5);
  });

  it("falls back to the gifted names when there is no total", () => {
    expect(
      kickSubCount("GiftedSubscriptionsEvent", gift({ gifted_total: undefined }), new Set()),
    ).toBe(5);
  });

  it("ignores other events", () => {
    const events = ["App\\Events\\SubscriptionEvent", "App\\Events\\ChatMessageEvent", "KicksGifted"];
    for (const event of events) {
      expect(kickSubCount(event, gift(), new Set())).toBe(0);
    }
  });
});
