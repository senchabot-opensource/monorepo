import { describe, expect, it } from 'vitest';
import {
  buildObsBridgeParams,
  DEFAULT_OBS_COMMANDS,
  type ObsBridgeSetup,
  resolveObsCommands,
} from './obs-bridge-config';

const setup = (overrides: Partial<ObsBridgeSetup> = {}): ObsBridgeSetup => ({
  twitch: '',
  kick: '',
  commandUsers: [],
  commands: {},
  obsWebsocketUrl: '',
  obsWebsocketPassword: '',
  ...overrides,
});

describe('buildObsBridgeParams', () => {
  it('trims and lowercases channels like the other widgets', () => {
    const params = buildObsBridgeParams(setup({ twitch: '  MyChannel ', kick: 'KickName ' }));
    expect(params.get('twitch')).toBe('mychannel');
    expect(params.get('kick')).toBe('kickname');
  });

  it('leaves out empty values and default commands', () => {
    const params = buildObsBridgeParams(
      setup({ twitch: 'me', commands: { cmdScene: ' !Scene ', cmdBrb: '', cmdBack: 'back' } }),
    );
    expect(params.toString()).toBe('twitch=me');
  });

  it('keeps the existing param names and the commandUser format', () => {
    const params = buildObsBridgeParams(
      setup({
        twitch: 'me',
        kick: 'me',
        commandUsers: [
          { platform: 'twitch', name: 'bob' },
          { platform: 'kick', name: 'ali' },
        ],
        commands: { cmdBrb: ' afk ', cmdStartStream: 'start' },
        obsWebsocketUrl: ' ws://192.168.1.5:4455 ',
        obsWebsocketPassword: ' se cret',
      }),
    );
    expect(Object.fromEntries(params)).toEqual({
      commandUser: 'twitch:bob,kick:ali',
      obsWebsocketUrl: 'ws://192.168.1.5:4455',
      obsWebsocketPassword: ' se cret',
      twitch: 'me',
      kick: 'me',
      cmdBrb: 'afk',
      cmdStartStream: 'start',
    });
  });
});

describe('resolveObsCommands', () => {
  it('falls back to the default for empty or blank commands', () => {
    expect(resolveObsCommands({ cmdBrb: '  ', cmdBack: ' home ' })).toEqual({
      ...DEFAULT_OBS_COMMANDS,
      cmdBack: 'home',
    });
  });
});
