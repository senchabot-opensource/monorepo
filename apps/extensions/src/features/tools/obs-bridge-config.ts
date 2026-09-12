import { type CommandUser, formatCommandUsers } from './command-users';

/** Chat commands, keyed by their tool URL param. */
export interface ObsBridgeCustomCommands {
  cmdBrb?: string;
  cmdBack?: string;
  cmdStartStream?: string;
  cmdStopStream?: string;
  cmdStartRecord?: string;
  cmdStopRecord?: string;
  cmdScene?: string;
}

export type ObsCommandKey = keyof ObsBridgeCustomCommands;

export const DEFAULT_OBS_COMMANDS: Required<ObsBridgeCustomCommands> = {
  cmdBrb: 'brb',
  cmdBack: 'back',
  cmdStartStream: '!startstream',
  cmdStopStream: '!stopstream',
  cmdStartRecord: '!startrecord',
  cmdStopRecord: '!stoprecord',
  cmdScene: '!scene',
};

/** The order the setup form and the command summaries list them in. */
export const OBS_COMMAND_KEYS: readonly ObsCommandKey[] = [
  'cmdScene',
  'cmdBrb',
  'cmdBack',
  'cmdStartStream',
  'cmdStopStream',
  'cmdStartRecord',
  'cmdStopRecord',
];

/** Every command as it runs: trimmed, with an empty one falling back to its default. */
export function resolveObsCommands(
  commands: ObsBridgeCustomCommands,
): Required<ObsBridgeCustomCommands> {
  const resolved = { ...DEFAULT_OBS_COMMANDS };
  for (const key of OBS_COMMAND_KEYS) {
    const value = commands[key]?.trim();
    if (value) resolved[key] = value;
  }
  return resolved;
}

export interface ObsBridgeSetup {
  twitch: string;
  kick: string;
  commandUsers: CommandUser[];
  commands: ObsBridgeCustomCommands;
  obsWebsocketUrl: string;
  obsWebsocketPassword: string;
}

/** Search params for /tools/obs-bridge. Defaults and empty values are left out. */
export function buildObsBridgeParams(setup: ObsBridgeSetup): URLSearchParams {
  const params = new URLSearchParams();
  if (setup.commandUsers.length > 0) {
    params.append('commandUser', formatCommandUsers(setup.commandUsers));
  }
  const obsUrl = setup.obsWebsocketUrl.trim();
  if (obsUrl) params.append('obsWebsocketUrl', obsUrl);
  if (setup.obsWebsocketPassword) params.append('obsWebsocketPassword', setup.obsWebsocketPassword);
  const twitch = setup.twitch.trim().toLowerCase();
  const kick = setup.kick.trim().toLowerCase();
  if (twitch) params.append('twitch', twitch);
  if (kick) params.append('kick', kick);
  // The tool matches commands case-insensitively, so "!Scene" is still the default.
  for (const key of OBS_COMMAND_KEYS) {
    const value = setup.commands[key]?.trim();
    if (value && value.toLowerCase() !== DEFAULT_OBS_COMMANDS[key]) params.append(key, value);
  }
  return params;
}
