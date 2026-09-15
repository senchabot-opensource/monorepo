import { describe, expect, it } from 'vitest';
import type { ChatMessagesType } from './chat-messages';
import { isHiddenMessage } from './message-filters';

const message = (overrides: Partial<ChatMessagesType>): ChatMessagesType => ({
  id: '1',
  user: 'viewer',
  message: 'hello',
  platform: 'twitch',
  timestamp: new Date(0),
  receivedAt: new Date(0),
  ...overrides,
});

const ALL = { hideBots: true, hideCommands: true };
const NONE = { hideBots: false, hideCommands: false };

describe('isHiddenMessage', () => {
  it('keeps everything when both filters are off', () => {
    expect(isHiddenMessage(message({ user: 'Nightbot', message: '!uptime' }), NONE)).toBe(false);
  });

  it('hides known bots by name, in any case, on both platforms', () => {
    expect(isHiddenMessage(message({ user: 'Nightbot' }), ALL)).toBe(true);
    expect(isHiddenMessage(message({ user: 'BotRix', platform: 'kick' }), ALL)).toBe(true);
    expect(isHiddenMessage(message({ user: 'robotlover' }), ALL)).toBe(false);
  });

  it("hides accounts with Twitch's Chat Bot badge", () => {
    expect(isHiddenMessage(message({ user: 'mycustombot', badges: ['bot-badge/1'] }), ALL)).toBe(
      true,
    );
  });

  it("hides accounts with Kick's Bot badge, like @Kicklet and @StreamElements", () => {
    // As Kick sent them live (2026-09-15): an "@" in the name and a "bot" badge.
    expect(
      isHiddenMessage(
        message({ user: '@Kicklet', platform: 'kick', badges: ['bot', 'verified'] }),
        ALL,
      ),
    ).toBe(true);
    expect(
      isHiddenMessage(
        message({
          user: '@StreamElements',
          platform: 'kick',
          badges: ['bot', 'moderator', 'verified'],
        }),
        ALL,
      ),
    ).toBe(true);
    expect(
      isHiddenMessage(message({ user: 'viewer', platform: 'kick', badges: ['og'] }), ALL),
    ).toBe(false);
  });

  it('hides a listed bot that Kick sends with an "@" and no Bot badge, like @Streamlabs', () => {
    // Seen live 2026-09-15: @Streamlabs carried only "verified".
    expect(
      isHiddenMessage(
        message({ user: '@Streamlabs', platform: 'kick', badges: ['verified'] }),
        ALL,
      ),
    ).toBe(true);
  });

  it('hides commands, but not a "!" later in the message', () => {
    expect(isHiddenMessage(message({ message: '  !discord' }), ALL)).toBe(true);
    expect(isHiddenMessage(message({ message: 'wow!' }), ALL)).toBe(false);
  });

  it('applies each filter on its own', () => {
    const bot = message({ user: 'StreamElements' });
    const command = message({ message: '!points' });
    expect(isHiddenMessage(bot, { hideBots: false, hideCommands: true })).toBe(false);
    expect(isHiddenMessage(command, { hideBots: true, hideCommands: false })).toBe(false);
  });
});
