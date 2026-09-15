import { describe, expect, it } from 'vitest';
import { parseCommandUsers } from '#/features/tools/command-users';
import {
  buildObsBridgeParams,
  DEFAULT_OBS_COMMANDS,
  OBS_COMMAND_KEYS,
  type ObsBridgeCustomCommands,
  type ObsBridgeSetup,
  resolveObsCommands,
} from '#/features/tools/obs-bridge-config';
import { getWidget } from '#/lib/widgets';
import { Route } from '#/routes/tools/obs-bridge';
import { asFixture, type FixtureCase, GROUPS, readWidgetSearch } from './contract';
import json from './fixtures/obs-bridge.json';

const fixture = asFixture<ObsBridgeSetup, Required<ObsBridgeCustomCommands>>(json);

// Mirrors toolUrl in routes/setup/obs-bridge.tsx, which assembles the URL inline.
const toolUrl = (setup: ObsBridgeSetup) => {
  if (!setup.twitch.trim() && !setup.kick.trim()) return '';
  return `${fixture.origin}${getWidget('obs-bridge').widgetPath}?${buildObsBridgeParams(setup).toString()}`;
};

const setup = (overrides: Partial<ObsBridgeSetup>): ObsBridgeSetup => ({
  twitch: 'foo',
  kick: '',
  commandUsers: [],
  commands: {},
  obsWebsocketUrl: '',
  obsWebsocketPassword: '',
  ...overrides,
});

const RULES = {
  channels: 'trims and lowercases channels, and builds no URL for whitespace-only ones',
  wsUrl: 'trims the WebSocket URL',
  blankCommand: 'omits a whitespace-only command',
  defaultCommand: 'omits a command equal to its default in any case or spacing',
} as const;

/**
 * Inputs whose URL the redesign changed on purpose, so the old output is not the contract. The
 * old page wrote these values untrimmed and compared commands to their default exactly.
 */
function intendedChange(input: ObsBridgeSetup): keyof typeof RULES | null {
  const normalized = (value: string) => value.trim().toLowerCase();
  if (input.twitch !== normalized(input.twitch) || input.kick !== normalized(input.kick)) {
    return 'channels';
  }
  if (input.obsWebsocketUrl !== input.obsWebsocketUrl.trim()) return 'wsUrl';
  for (const key of OBS_COMMAND_KEYS) {
    const value = input.commands[key];
    if (!value) continue;
    if (!value.trim()) return 'blankCommand';
    if (value !== DEFAULT_OBS_COMMANDS[key] && normalized(value) === DEFAULT_OBS_COMMANDS[key]) {
      return 'defaultCommand';
    }
  }
  return null;
}

describe('OBS Bridge setup URL', () => {
  it('keeps the default commands the old URLs rely on', () => {
    expect(DEFAULT_OBS_COMMANDS).toEqual(fixture.defaults);
  });

  it('keeps intentionally changed inputs out of the golden fixtures', () => {
    expect(fixture.cases.filter((c) => intendedChange(c.input) !== null)).toEqual([]);
  });

  it.each(GROUPS)('builds the pre-redesign URL for every "%s" fixture', (group) => {
    const cases = fixture.cases.filter((c) => c.group === group && !intendedChange(c.input));
    expect(cases.length).toBeGreaterThan(0);
    expect(cases.map((c) => ({ input: c.input, url: toolUrl(c.input) }))).toEqual(
      cases.map((c) => ({ input: c.input, url: c.expectedUrl })),
    );
  });
});

describe('OBS Bridge intended URL changes', () => {
  const base = `${fixture.origin}/tools/obs-bridge`;

  // `before` is what the pre-redesign page wrote for the same input.
  it.each([
    {
      rule: 'channels',
      input: setup({ twitch: '  MyChannel ', kick: 'KickName' }),
      url: `${base}?twitch=mychannel&kick=kickname`,
      before: `${base}?twitch=++MyChannel+&kick=KickName`,
    },
    {
      rule: 'channels',
      input: setup({ twitch: '   ', kick: 'bar' }),
      url: `${base}?kick=bar`,
      before: `${base}?twitch=+++&kick=bar`,
    },
    {
      rule: 'channels',
      input: setup({ twitch: '   ' }),
      url: '',
      before: `${base}?twitch=+++`,
    },
    {
      rule: 'wsUrl',
      input: setup({ obsWebsocketUrl: ' ws://host:4455 ' }),
      url: `${base}?obsWebsocketUrl=ws%3A%2F%2Fhost%3A4455&twitch=foo`,
      before: `${base}?obsWebsocketUrl=+ws%3A%2F%2Fhost%3A4455+&twitch=foo`,
    },
    {
      rule: 'blankCommand',
      input: setup({ commands: { cmdBrb: '   ' } }),
      url: `${base}?twitch=foo`,
      before: `${base}?twitch=foo&cmdBrb=`,
    },
    {
      rule: 'defaultCommand',
      input: setup({ commands: { cmdScene: '!SCENE' } }),
      url: `${base}?twitch=foo`,
      before: `${base}?twitch=foo&cmdScene=%21SCENE`,
    },
    {
      rule: 'defaultCommand',
      input: setup({ commands: { cmdBack: ' Back ' } }),
      url: `${base}?twitch=foo`,
      before: `${base}?twitch=foo&cmdBack=Back`,
    },
  ] as const)('$rule: $before', ({ rule, input, url, before }) => {
    expect(intendedChange(input)).toBe(rule);
    expect(toolUrl(input)).toBe(url);
    expect(url).not.toBe(before);
  });

  it(RULES.defaultCommand, () => {
    for (const key of OBS_COMMAND_KEYS) {
      const value = DEFAULT_OBS_COMMANDS[key];
      const capitalized = `${value[0].toUpperCase()}${value.slice(1)}`;
      for (const variant of [value.toUpperCase(), ` ${value} `, `\t${capitalized}`]) {
        expect(buildObsBridgeParams(setup({ commands: { [key]: variant } })).has(key)).toBe(false);
      }
    }
  });

  it(RULES.blankCommand, () => {
    for (const key of OBS_COMMAND_KEYS) {
      expect(buildObsBridgeParams(setup({ commands: { [key]: ' \t ' } })).has(key)).toBe(false);
    }
  });

  it('still writes a custom command trimmed and in its own case', () => {
    expect(toolUrl(setup({ commands: { cmdBrb: '  AFK ' } }))).toBe(
      `${base}?twitch=foo&cmdBrb=AFK`,
    );
  });
});

describe('OBS Bridge tool reads every setup URL', () => {
  const intended = ({ input }: FixtureCase<ObsBridgeSetup>) => ({
    twitch: input.twitch.trim().toLowerCase() || undefined,
    kick: input.kick.trim().toLowerCase() || undefined,
    commandUsers: input.commandUsers,
    commands: resolveObsCommands(input.commands),
    obsWebsocketUrl: input.obsWebsocketUrl.trim() || undefined,
    obsWebsocketPassword: input.obsWebsocketPassword || undefined,
    mainScene: 'Main Scene',
    brbScene: 'BRB Scene',
  });

  // What RouteComponent derives from its search.
  const effective = (search: Record<string, unknown>) => ({
    twitch: search.twitch,
    kick: search.kick,
    commandUsers: parseCommandUsers(search.commandUser as string | undefined),
    commands: resolveObsCommands(search as ObsBridgeCustomCommands),
    obsWebsocketUrl: search.obsWebsocketUrl,
    obsWebsocketPassword: search.obsWebsocketPassword,
    mainScene: search.mainScene,
    brbScene: search.brbScene,
  });

  it('parses every fixture URL into the setup it was built from', () => {
    const cases = fixture.cases.filter((c) => c.expectedUrl);
    expect(cases.map((c) => effective(readWidgetSearch(Route, c.expectedUrl)))).toEqual(
      cases.map(intended),
    );
  });
});
