import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { publishModCommand } from '#/lib/mod-commands';
import { FakeWebSocket } from '#/test/browser';
import { renderRoute } from '#/test/render';
import {
  chatPresetKey,
  presetNamed,
  readPresetCommand,
  useChatPreset,
  useChatPresetSettings,
} from './chat-preset';
import { findPreset } from './registry';

let nextId = 0;
const modSays = (text: string) =>
  act(() => publishModCommand({ platform: 'twitch', id: `say-${++nextId}`, text }));

/** The game a built-in preset is made for, as its data names it. */
const gameOf = (id: string) => findPreset(id)?.data.game ?? '';

afterEach(() => {
  localStorage.clear();
});

describe('readPresetCommand', () => {
  it('names a preset by its id, its name or the game it is made for, in any case', () => {
    expect(readPresetCommand('!preset blocks')).toEqual({ kind: 'pick', preset: 'blocks' });
    expect(readPresetCommand('!PRESET  Pizza ')).toEqual({ kind: 'pick', preset: 'pizza' });
    expect(readPresetCommand(`!preset ${gameOf('blocks')}`)).toEqual({
      kind: 'pick',
      preset: 'blocks',
    });
    // Spaces, dashes and case don't matter in a game's name.
    const spelled = gameOf('defuse').toUpperCase().replace(/\W+/g, '');
    expect(readPresetCommand(`!preset ${spelled}`)).toEqual({ kind: 'pick', preset: 'defuse' });
    expect(readPresetCommand('!preset classic')).toEqual({ kind: 'pick', preset: 'classic' });
    expect(readPresetCommand('!preset reset')).toEqual({ kind: 'reset' });
  });

  it.each([
    '!preset',
    '!preset nowhere',
    '!presets blocks',
    'preset blocks',
    'gg !preset blocks',
    '!hud map park',
  ])('reads nothing from "%s"', (text) => {
    expect(readPresetCommand(text)).toBeNull();
  });

  it('finds every built-in preset by its id and its name', () => {
    expect(presetNamed('Rift')).toBe('rift');
    expect(presetNamed('glitch')).toBe('glitch');
    expect(presetNamed('')).toBeNull();
  });
});

describe('useChatPreset', () => {
  const channels = { twitch: 'Streamer' };

  it("follows a mod's !preset, and keeps the pick through a reload until !preset reset", () => {
    const first = renderHook(() => useChatPreset('rift', channels));
    expect(first.result.current).toBe('rift');
    modSays('!preset blocks');
    expect(first.result.current).toBe('blocks');
    modSays('!preset nowhere');
    expect(first.result.current).toBe('blocks');
    first.unmount();

    const again = renderHook(() => useChatPreset('rift', channels));
    expect(again.result.current).toBe('blocks');
    modSays('!preset reset');
    expect(again.result.current).toBe('rift');
    expect(localStorage.getItem(chatPresetKey('rift', 'Streamer'))).toBeNull();
  });

  it('starts a URL set to another preset since on that preset', () => {
    const view = renderHook(({ preset }) => useChatPreset(preset, channels), {
      initialProps: { preset: 'rift' },
    });
    modSays('!preset blocks');
    view.rerender({ preset: 'pizza' });
    expect(view.result.current).toBe('pizza');
    view.rerender({ preset: 'rift' });
    expect(view.result.current).toBe('blocks');
  });

  it("drops the pick when chat names the URL's own preset", () => {
    const view = renderHook(() => useChatPreset('classic', channels));
    modSays('!preset pizza');
    expect(view.result.current).toBe('pizza');
    modSays('!preset classic');
    expect(view.result.current).toBe('classic');
    expect(localStorage.getItem(chatPresetKey('classic', 'Streamer'))).toBeNull();
  });

  it('listens only with a channel, and never when switched off', () => {
    const none = renderHook(() => useChatPreset('rift', {}));
    const off = renderHook(() => useChatPreset('rift', { ...channels, enabled: false }));
    modSays('!preset blocks');
    expect(none.result.current).toBe('rift');
    expect(off.result.current).toBe('rift');
  });
});

describe('useChatPresetSettings', () => {
  it('keeps the settings object until chat picks, and leaves setup previews and demos alone', () => {
    const settings = { preset: 'rift', size: 1 };
    const read = (query: string) => () =>
      useChatPresetSettings(settings, new URLSearchParams(query));
    const live = renderHook(read('twitch=streamer&preset=rift'));
    const preview = renderHook(read('twitch=streamer&preset=rift&preview=abc'));
    const demo = renderHook(read('twitch=streamer&preset=rift&simulate=1'));
    expect(live.result.current).toBe(settings);
    modSays('!preset storm');
    expect(live.result.current).toEqual({ preset: 'storm', size: 1 });
    expect(preview.result.current).toBe(settings);
    expect(demo.result.current).toBe(settings);
  });
});

describe('!preset in the overlays', () => {
  const twitchSays = (line: string) =>
    act(() => {
      const socket = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes('twitch'));
      if (!socket) throw new Error('No Twitch socket');
      socket.receive(line);
    });
  const say = (who: 'mod' | 'viewer', text: string) =>
    twitchSays(
      `@${who === 'mod' ? 'badges=moderator/1;mod=1;' : ''}id=line-${++nextId};room-id=1 :${who}!${who}@${who}.tmi.twitch.tv PRIVMSG #streamer :${text}`,
    );
  // Null in the classic look, which leaves the attribute out.
  const preset = () => document.querySelector('[data-preset]')?.getAttribute('data-preset') ?? null;

  it('redraws an overlay that reads chat for events in the preset a mod names', async () => {
    await renderRoute('/widgets/leaderboard?twitch=streamer&preset=rift');
    expect(preset()).toBe('rift');
    say('viewer', '!preset blocks');
    expect(preset()).toBe('rift');
    say('mod', '!preset blocks');
    expect(preset()).toBe('blocks');
    say('mod', '!preset reset');
    expect(preset()).toBe('rift');
  });

  it('redraws the Chat Box, which reads chat with a client of its own', async () => {
    await renderRoute('/widgets/chat-widget?twitch=streamer');
    expect(preset()).toBeNull();
    say('mod', '!preset pizza');
    expect(preset()).toBe('pizza');
  });
});
