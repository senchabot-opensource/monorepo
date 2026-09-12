import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SubSproutWidget } from "./sub-sprout-widget";

class FakeWebSocket {
  static last: FakeWebSocket;
  sent: string[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;
  constructor() {
    FakeWebSocket.last = this;
  }
  send(data: string) {
    this.sent.push(data);
  }
  close() {}
}

const pusher = (channel: string, event: string, data: unknown) =>
  act(() => {
    FakeWebSocket.last.onmessage?.({
      data: JSON.stringify({ event, channel, data: JSON.stringify(data) }),
    });
  });

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("WebSocket", FakeWebSocket);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("SubSproutWidget on Kick", () => {
  it("subscribes to the chatroom channels Kick sends subs and gifts on", () => {
    render(<SubSproutWidget kickChannel="streamer" kickId="42" variety="rose" />);
    act(() => FakeWebSocket.last.onopen?.());
    const channels = FakeWebSocket.last.sent.map((s) => JSON.parse(s).data.channel);
    expect(channels).toEqual(["chatrooms.42.v2", "chatroom_42"]);
  });

  it("grows one stage per gifted sub", () => {
    const { container } = render(
      <SubSproutWidget
        kickChannel="streamer"
        kickId="42"
        variety="rose"
        potLabel
        countFx={false}
      />,
    );
    act(() => FakeWebSocket.last.onopen?.());

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
    act(() => vi.advanceTimersByTime(5 * 800));
    expect(container.textContent).toContain("5/10");

    pusher("chatrooms.42.v2", "App\\Events\\SubscriptionEvent", {
      chatroom_id: 42,
      username: "Viewer",
      months: 1,
    });
    act(() => vi.advanceTimersByTime(800));
    expect(container.textContent).toContain("6/10");
  });
});
