import { BaseChatClient } from '#/lib/basechat';
import { KICK_PUSHER_URL } from '#/lib/kick';
import { anonymousJoin, parseIrcLine, TWITCH_IRC_URL } from '#/lib/twitch';
import {
  createKickDedupe,
  kickEvent,
  kickSubathonChannels,
  type SubathonEvent,
  twitchEvent,
} from './subathon-events';

type EventCallback = (event: SubathonEvent) => void;

/** Anonymous Twitch IRC reader for subs, gifts, Bits, raids and mod commands. */
export class TwitchEventSource extends BaseChatClient {
  private readonly bundles = new Map<string, number>();

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

  // Answered with "PONG tmi.twitch.tv :tmi.twitch.tv", which twitchEvent ignores.
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
      const subathonEvent = twitchEvent(line, this.bundles);
      if (subathonEvent) this.onEvent(subathonEvent);
    }
  }
}

/** Kick Pusher reader for subs, gifted subs, Kicks, raids and mod commands. */
export class KickEventSource extends BaseChatClient {
  private readonly dedupe = createKickDedupe();

  constructor(
    chatroomId: string,
    channelId: string | null,
    private readonly onEvent: EventCallback,
  ) {
    super('Kick', () => {});
    this.connect(KICK_PUSHER_URL, {
      onOpen: () => {
        for (const channel of kickSubathonChannels(chatroomId, channelId)) {
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
    const subathonEvent = typeof name === 'string' ? kickEvent(name, data, this.dedupe) : null;
    if (subathonEvent) this.onEvent(subathonEvent);
  }
}
