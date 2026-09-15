import { KickPusherReader, TwitchIrcReader } from '#/lib/chat-readers';
import {
  createKickDedupe,
  kickEvent,
  kickSubathonChannels,
  type SubathonEvent,
  twitchEvent,
} from './subathon-events';

type EventCallback = (event: SubathonEvent) => void;

/** Anonymous Twitch IRC reader for subs, gifts, Bits, raids and mod commands. */
export class TwitchEventSource extends TwitchIrcReader<SubathonEvent> {
  constructor(channel: string, onEvent: EventCallback) {
    const bundles = new Map<string, number>();
    super(channel, (line) => twitchEvent(line, bundles), onEvent);
  }
}

/** Kick Pusher reader for subs, gifted subs, Kicks, raids and mod commands. */
export class KickEventSource extends KickPusherReader<SubathonEvent> {
  constructor(chatroomId: string, channelId: string | null, onEvent: EventCallback) {
    const dedupe = createKickDedupe();
    super(
      kickSubathonChannels(chatroomId, channelId),
      (name, data) => kickEvent(name, data, dedupe),
      onEvent,
    );
  }
}
