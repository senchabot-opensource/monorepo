import { KickPusherReader, kickChatroomChannel, TwitchIrcReader } from '#/lib/chat-readers';
import { kickPollEvent, type PollChatEvent, twitchPollEvent } from './poll-chat';

type EventCallback = (event: PollChatEvent) => void;

/** Anonymous Twitch IRC reader for votes, mod commands and timeouts. */
export class TwitchPollSource extends TwitchIrcReader<PollChatEvent> {
  constructor(channel: string, onEvent: EventCallback) {
    super(channel, twitchPollEvent, onEvent);
  }
}

/** Kick Pusher reader for votes, mod commands and timeouts. */
export class KickPollSource extends KickPusherReader<PollChatEvent> {
  constructor(chatroomId: string, onEvent: EventCallback) {
    super([kickChatroomChannel(chatroomId)], kickPollEvent, onEvent);
  }
}
