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
