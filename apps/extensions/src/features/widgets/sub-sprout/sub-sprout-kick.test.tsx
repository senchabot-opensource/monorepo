import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FakeWebSocket } from "#/test/browser";
import { SubSproutWidget } from "./sub-sprout-widget";

const kickLookup = vi.hoisted(() => vi.fn());
vi.mock("#/lib/kick", async (importOriginal) => ({
  ...(await importOriginal<typeof import("#/lib/kick")>()),
  getKickChannelInfo: kickLookup,
}));

const KICK_42 = { chatroomId: "42", channelId: "7", userId: null, subscriberBadges: [] };
const NOT_FOUND = { chatroomId: null, channelId: null, userId: null, subscriberBadges: [] };

// The newest one: an unanswered connect or heartbeat makes the client swap in a new socket.
const kickSocket = () => {
  const found = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes("pusher"));
  if (!found) throw new Error("no Kick socket");
  return found;
};
const pusher = (channel: string, event: string, data: unknown) =>
  act(() => kickSocket().receive(JSON.stringify({ event, channel, data: JSON.stringify(data) })));
const chat = (content: string, badges: { type: string }[]) =>
  pusher("chatrooms.42.v2", "App\\Events\\ChatMessageEvent", {
    id: `m-${Math.random()}`,
    chatroom_id: 42,
    content,
    type: "message",
    sender: { id: 1, username: "Someone", identity: { color: "#fff", badges } },
  });
const grow = (subs: number) => act(() => vi.advanceTimersByTime(subs * 800));

async function renderRose() {
  const view = render(
    <SubSproutWidget kickChannel="streamer" variety="rose" potLabel countFx={false} />,
  );
  await act(async () => {});
  act(() => kickSocket().open());
  return view;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, "log").mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(KICK_42);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("SubSproutWidget on Kick", () => {
  it("subscribes to the chatroom channels and to channel_{channelId}", async () => {
    await renderRose();
    const channels = kickSocket().sent.map((s) => JSON.parse(s).data.channel);
    expect(channels).toEqual(["chatrooms.42.v2", "chatroom_42", "channel_7"]);
  });

  it("grows on a ChannelSubscriptionEvent that comes alone", async () => {
    const { container } = await renderRose();
    pusher("channel_7", "App\\Events\\ChannelSubscriptionEvent", {
      user_ids: [1],
      username: "Viewer",
      channel_id: 7,
    });
    grow(1);
    expect(container.textContent).toContain("1/10");
  });

  it("grows once when both sub events come for the same sub", async () => {
    const { container } = await renderRose();
    pusher("channel_7", "App\\Events\\ChannelSubscriptionEvent", {
      user_ids: [1],
      username: "Viewer",
      channel_id: 7,
    });
    pusher("chatrooms.42.v2", "App\\Events\\SubscriptionEvent", {
      chatroom_id: 42,
      username: "Viewer",
      months: 3,
    });
    grow(3);
    expect(container.textContent).toContain("1/10");
  });

  it("grows one stage per gifted sub", async () => {
    const { container } = await renderRose();
    // Payload captured from live Kick, names replaced.
    pusher("chatroom_42", "GiftedSubscriptionsEvent", {
      chatroom_id: 42,
      correlation_id: "110003713021787",
      gifted_usernames: ["a", "b", "c", "d", "e"],
      gifter_username: "Gifter",
      gifted_total: 5,
      gifter_total: 5,
      chunk_details: null,
    });
    grow(5);
    expect(container.textContent).toContain("5/10");

    pusher("chatrooms.42.v2", "App\\Events\\SubscriptionEvent", {
      chatroom_id: 42,
      username: "Viewer",
      months: 1,
    });
    grow(1);
    expect(container.textContent).toContain("6/10");
  });

  it("grows on a moderator's !grow but not on a viewer's", async () => {
    const { container } = await renderRose();
    chat("!grow", [{ type: "subscriber" }]);
    grow(1);
    expect(container.textContent).toContain("0/10");

    chat(" !GROW ", [{ type: "moderator" }]);
    grow(1);
    expect(container.textContent).toContain("1/10");

    chat("!grow now", [{ type: "broadcaster" }]);
    grow(1);
    expect(container.textContent).toContain("1/10");
  });

  it("looks the channel up again until kick.com answers", async () => {
    kickLookup.mockResolvedValueOnce(NOT_FOUND);
    render(<SubSproutWidget kickChannel="streamer" variety="rose" />);
    await act(async () => {});
    expect(FakeWebSocket.instances).toHaveLength(0);
    await act(async () => vi.advanceTimersByTime(5000));
    expect(kickLookup).toHaveBeenCalledTimes(2);
    expect(kickSocket().url).toContain("pusher");
  });

  it("replaces a Kick socket that goes silent", async () => {
    await renderRose();
    const first = kickSocket();
    act(() => vi.advanceTimersByTime(45_000));
    expect(first.sent.some((s) => JSON.parse(s).event === "pusher:ping")).toBe(true);
    expect(kickSocket()).not.toBe(first);
  });

  it("stops the auto preview and clears its growth once Kick connects", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { container } = render(
      <SubSproutWidget
        kickChannel="streamer"
        variety="rose"
        potLabel
        countFx={false}
        simulate="auto"
      />,
    );
    await act(async () => {});
    expect(container.textContent).toContain("1/10");
    act(() => kickSocket().open());
    expect(container.textContent).toContain("0/10");
    act(() => vi.advanceTimersByTime(10_000));
    expect(container.textContent).toContain("0/10");
  });

  it("never looks up or connects to Kick in a preview", async () => {
    render(<SubSproutWidget kickChannel="streamer" variety="rose" simulate />);
    await act(async () => {});
    expect(kickLookup).not.toHaveBeenCalled();
    expect(FakeWebSocket.instances).toHaveLength(0);
  });
});
