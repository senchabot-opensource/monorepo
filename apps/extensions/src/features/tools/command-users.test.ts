import { describe, expect, it } from 'vitest';
import {
  commandUserKey,
  formatCommandUsers,
  parseCommandUsers,
  resolveCommandUsers,
  summarizeCommandUsers,
} from './command-users';

const both = { twitch: true, kick: true };

describe('parseCommandUsers', () => {
  it('reads platform-tagged and old untagged names', () => {
    expect(parseCommandUsers(' Twitch:Bob , kick:ali,carol,,twitch:bob')).toEqual([
      { platform: 'twitch', name: 'bob' },
      { platform: 'kick', name: 'ali' },
      { platform: null, name: 'carol' },
    ]);
  });

  it('drops the "@" old links kept in front of a name', () => {
    expect(parseCommandUsers('twitch:@Bob,@carol')).toEqual([
      { platform: 'twitch', name: 'bob' },
      { platform: null, name: 'carol' },
    ]);
  });

  it('keeps the same name on both platforms as two users', () => {
    expect(parseCommandUsers('twitch:bob,kick:bob')).toHaveLength(2);
  });

  it('round-trips through formatCommandUsers', () => {
    const raw = 'twitch:bob,kick:ali,carol';
    expect(formatCommandUsers(parseCommandUsers(raw))).toBe(raw);
  });

  it('returns nothing for an empty param', () => {
    expect(parseCommandUsers(undefined)).toEqual([]);
    expect(parseCommandUsers('')).toEqual([]);
  });
});

describe('resolveCommandUsers', () => {
  it('only lets a name run commands on the platform it was saved with', () => {
    const { allowed } = resolveCommandUsers(parseCommandUsers('twitch:bob'), both);
    expect(allowed.has(commandUserKey('twitch', 'Bob'))).toBe(true);
    expect(allowed.has(commandUserKey('kick', 'bob'))).toBe(false);
  });

  it('gives an untagged name the only platform the link listens to', () => {
    const users = parseCommandUsers('bob');
    expect([...resolveCommandUsers(users, { twitch: true, kick: false }).allowed]).toEqual([
      'twitch:bob',
    ]);
    expect([...resolveCommandUsers(users, { twitch: false, kick: true }).allowed]).toEqual([
      'kick:bob',
    ]);
  });

  it('leaves untagged names out while both platforms are set up', () => {
    const { allowed, unassigned } = resolveCommandUsers(
      parseCommandUsers('bob,kick:ali'),
      both,
    );
    expect([...allowed]).toEqual(['kick:ali']);
    expect(unassigned).toEqual(['bob']);
  });
});

describe('command users edge cases', () => {
  it('matches a name however it is cased or padded in chat', () => {
    const { allowed } = resolveCommandUsers(parseCommandUsers('kick:Liliuy_56'), both);
    expect(allowed.has(commandUserKey('kick', ' LILIUY_56 '))).toBe(true);
  });

  it('keeps a Kick name on Kick when the link only listens to Twitch, instead of moving it', () => {
    const { allowed } = resolveCommandUsers(parseCommandUsers('kick:ali'), {
      twitch: true,
      kick: false,
    });
    expect(allowed.has(commandUserKey('twitch', 'ali'))).toBe(false);
  });

  it('lets no untagged name in while the link has no channel at all', () => {
    const none = { twitch: false, kick: false };
    expect(resolveCommandUsers(parseCommandUsers('bob'), none)).toEqual({
      allowed: new Set(),
      unassigned: [],
    });
    expect(summarizeCommandUsers(parseCommandUsers('bob'), none).unassigned).toEqual(['bob']);
  });

  it('reads a list with spaces and empty entries', () => {
    expect(parseCommandUsers(' twitch : bob ,, kick:, , @ ,kick: @Ali ')).toEqual([
      { platform: 'twitch', name: 'bob' },
      { platform: 'kick', name: 'ali' },
    ]);
  });
});

describe('summarizeCommandUsers', () => {
  it('splits users into active, not listened to and unassigned', () => {
    const users = parseCommandUsers('twitch:bob,kick:ali,carol');
    expect(summarizeCommandUsers(users, { twitch: true, kick: false })).toEqual({
      active: [
        { platform: 'twitch', name: 'bob' },
        { platform: 'twitch', name: 'carol' },
      ],
      notListening: [{ platform: 'kick', name: 'ali' }],
      unassigned: [],
    });
    expect(summarizeCommandUsers(users, both).unassigned).toEqual(['carol']);
  });
});
