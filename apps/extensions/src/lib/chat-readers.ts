import { BaseChatClient } from './basechat';
import { KICK_PUSHER_URL } from './kick';
import { anonymousJoin, type IrcLine, parseIrcLine, TWITCH_IRC_URL } from './twitch';

/**
 * Anonymous Twitch IRC reader: `parse` turns each line into an event for `onEvent`, or null.
 * It answers PINGs and moves to a new connection when Twitch announces maintenance.
 */
export class TwitchIrcReader<T> extends BaseChatClient {
  constructor(
    channel: string,
    private readonly parse: (line: IrcLine) => T | null,
    private readonly onEvent: (event: T) => void,
    label = 'Twitch',
  ) {
    super(label, () => {});
    const name = channel.trim().toLowerCase();
    this.connect(TWITCH_IRC_URL, {
      onOpen: () => {
        for (const line of anonymousJoin(name)) this.send(line);
      },
      onMessage: (event) => this.handle(event),
    });
  }

  // Answered with "PONG tmi.twitch.tv :tmi.twitch.tv", which no parser reads as an event.
  protected override pingFrame() {
    return 'PING :tmi.twitch.tv';
  }

  private handle(event: MessageEvent) {
    if (typeof event.data !== 'string') return;
    for (const raw of event.data.split('\r\n')) {
      const line = parseIrcLine(raw);
      if (!line) continue;
      if (line.command === 'PING') {
        this.send('PONG');
        continue;
      }
      // Sent before maintenance closes this connection; the rest of the frame is the old one's.
      if (line.command === 'RECONNECT') {
        this.restart();
        return;
      }
      const parsed = this.parse(line);
      if (parsed) this.onEvent(parsed);
    }
  }
}

/**
 * Kick Pusher reader: subscribes to `channels`, and `parse` turns each event (its name and
 * decoded data) into an event for `onEvent`, or null.
 */
export class KickPusherReader<T> extends BaseChatClient {
  constructor(
    channels: readonly string[],
    private readonly parse: (name: string, data: unknown) => T | null,
    private readonly onEvent: (event: T) => void,
    label = 'Kick',
  ) {
    super(label, () => {});
    this.connect(KICK_PUSHER_URL, {
      onOpen: () => {
        for (const channel of channels) {
          this.send(JSON.stringify({ event: 'pusher:subscribe', data: { channel } }));
        }
      },
      onMessage: (event) => this.handle(event),
    });
  }

  // Answered with pusher:pong. Pusher's own liveness pings are protocol frames the page never sees.
  protected override pingFrame() {
    return JSON.stringify({ event: 'pusher:ping', data: {} });
  }

  private handle(event: MessageEvent) {
    if (typeof event.data !== 'string') return;
    let name: unknown;
    let data: unknown;
    try {
      const message = JSON.parse(event.data);
      name = message.event;
      data = typeof message.data === 'string' ? JSON.parse(message.data) : message.data;
    } catch {
      return;
    }
    const parsed = typeof name === 'string' ? this.parse(name, data) : null;
    if (parsed) this.onEvent(parsed);
  }
}

/** The chatroom channel Kick sends chat messages, bans and deletions on. */
export const kickChatroomChannel = (chatroomId: string) => `chatrooms.${chatroomId}.v2`;
