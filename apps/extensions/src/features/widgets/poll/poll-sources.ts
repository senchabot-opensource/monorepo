import { BaseChatClient } from '#/lib/basechat';
import { KICK_PUSHER_URL } from '#/lib/kick';
import { anonymousJoin, parseIrcLine, TWITCH_IRC_URL } from '#/lib/twitch';
import { kickPollEvent, type PollChatEvent, twitchPollEvent } from './poll-chat';

type EventCallback = (event: PollChatEvent) => void;

/** Anonymous Twitch IRC reader for votes, mod commands and timeouts. */
export class TwitchPollSource extends BaseChatClient {
  constructor(
    channel: string,
    private readonly onEvent: EventCallback,
  ) {
    super('Twitch', () => {});
    const name = channel.trim().toLowerCase();
    this.connect(TWITCH_IRC_URL, {
      onOpen: () => {
        for (const line of anonymousJoin(name)) this.send(line);
      },
      onMessage: (event) => this.handle(event),
    });
  }

  // Answered with "PONG tmi.twitch.tv :tmi.twitch.tv", which twitchPollEvent ignores.
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
      const pollEvent = twitchPollEvent(line);
      if (pollEvent) this.onEvent(pollEvent);
    }
  }
}

/** Kick Pusher reader for votes, mod commands and timeouts. */
export class KickPollSource extends BaseChatClient {
  constructor(
    chatroomId: string,
    private readonly onEvent: EventCallback,
  ) {
    super('Kick', () => {});
    this.connect(KICK_PUSHER_URL, {
      onOpen: () => {
        const channel = `chatrooms.${chatroomId}.v2`;
        this.send(JSON.stringify({ event: 'pusher:subscribe', data: { channel } }));
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
    const pollEvent = typeof name === 'string' ? kickPollEvent(name, data) : null;
    if (pollEvent) this.onEvent(pollEvent);
  }
}
