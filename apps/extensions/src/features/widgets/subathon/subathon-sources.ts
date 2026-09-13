import { BaseChatClient } from '#/lib/basechat';
import { parseIrcLine } from '#/lib/twitch';
import {
  createKickDedupe,
  kickEvent,
  kickSubathonChannels,
  type SubathonEvent,
  twitchEvent,
} from './subathon-events';

export type SubathonEventCallback = (event: SubathonEvent) => void;

const KICK_PUSHER_URL =
  'wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0&flash=false';
// Same window as Sub Sprout: Kick can deliver one gift event twice in a row.
const KICK_DUPLICATE_WINDOW_MS = 10_000;

/** Anonymous Twitch IRC reader for subs, gifts, Bits and mod commands. */
export class TwitchSubathonSource extends BaseChatClient {
  private readonly bundles = new Map<string, number>();

  constructor(
    channel: string,
    private readonly onEvent: SubathonEventCallback,
  ) {
    super('Twitch', () => {});
    const name = channel.trim().toLowerCase();
    this.connect('wss://irc-ws.chat.twitch.tv:443', {
      onOpen: () => {
        this.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
        this.send('PASS SCHMOOPIIE');
        this.send(`NICK justinfan${Math.floor(Math.random() * 100000)}`);
        this.send(`JOIN #${name}`);
      },
      onMessage: (event) => this.handle(event),
    });
  }

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

/** Kick Pusher reader for subs, gifted subs, Kicks and mod commands. */
export class KickSubathonSource extends BaseChatClient {
  private readonly dedupe = createKickDedupe();
  private readonly recent: { key: string; at: number }[] = [];

  constructor(
    chatroomId: string,
    channelId: string | null,
    private readonly onEvent: SubathonEventCallback,
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

  protected override pingFrame() {
    return JSON.stringify({ event: 'pusher:ping', data: {} });
  }

  private isDuplicate(key: string): boolean {
    const now = Date.now();
    while (this.recent.length > 0 && now - this.recent[0].at > KICK_DUPLICATE_WINDOW_MS) {
      this.recent.shift();
    }
    if (this.recent.some((entry) => entry.key === key)) return true;
    this.recent.push({ key, at: now });
    return false;
  }

  private handle(event: MessageEvent) {
    if (typeof event.data !== 'string') return;
    let message: { event?: unknown; data?: unknown };
    let payload: unknown;
    try {
      message = JSON.parse(event.data);
      payload = typeof message.data === 'string' ? JSON.parse(message.data) : message.data;
    } catch {
      return;
    }
    const name = typeof message.event === 'string' ? message.event : '';
    if (name === 'pusher:ping') {
      this.send(JSON.stringify({ event: 'pusher:pong' }));
      return;
    }
    if (name === 'GiftedSubscriptionsEvent' && this.isDuplicate(JSON.stringify(payload))) {
      return;
    }
    const subathonEvent = kickEvent(
      name,
      payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : null,
      this.dedupe,
    );
    if (subathonEvent) this.onEvent(subathonEvent);
  }
}
