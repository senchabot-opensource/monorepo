import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CommandUser } from '#/features/tools/command-users';
import {
  buildObsBridgeParams,
  type ObsBridgeCustomCommands,
} from '#/features/tools/obs-bridge-config';
import { button, en, section, segment, textbox, tr } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/obs-bridge';

const urlField = () => textbox(en('common.toolUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
const kickField = () => textbox(en('common.kickChannel'));
const usersField = () => textbox(en('obsBridge.usersLabel'));
const userPlatform = (option: string) => segment(en('obsBridge.userPlatform'), option);
const summary = () => section(en('obsBridge.summaryCommands'));

describe('OBS Bridge setup', () => {
  it('builds the tool URL from channels, users, commands and the connection', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    expect(urlField().value).toBe('');
    expect((button(en('obsBridge.openTool')) as HTMLButtonElement).disabled).toBe(true);

    await user.type(twitchField(), 'Streamer');
    expect(urlField().value).toBe('http://localhost:3000/tools/obs-bridge?twitch=streamer');

    // With one channel, a new user goes to that platform.
    await user.type(usersField(), '@Mod{Enter}');
    expect(urlField().value).toBe(
      'http://localhost:3000/tools/obs-bridge?commandUser=twitch%3Amod&twitch=streamer',
    );

    await user.type(kickField(), 'kicker');
    await user.click(userPlatform('Kick'));
    await user.type(usersField(), 'kmod{Enter}');

    const commands: ObsBridgeCustomCommands = {};
    await user.type(textbox(en('obsBridge.label.cmdScene')), '!cam');
    commands.cmdScene = '!cam';
    // Same as the default apart from case, so it stays out of the URL.
    await user.type(textbox(en('obsBridge.label.cmdBrb')), 'BRB');
    commands.cmdBrb = 'BRB';
    await user.type(textbox(en('obsBridge.label.cmdStopStream')), '!end');
    commands.cmdStopStream = '!end';

    await user.click(textbox(en('obsBridge.wsUrl')));
    await user.paste('ws://192.168.1.5:4455');
    await user.click(textbox(en('obsBridge.wsPassword')));
    await user.paste('hunter2');

    const users: CommandUser[] = [
      { platform: 'twitch', name: 'mod' },
      { platform: 'kick', name: 'kmod' },
    ];
    const params = buildObsBridgeParams({
      twitch: 'Streamer',
      kick: 'kicker',
      commandUsers: users,
      commands,
      obsWebsocketUrl: 'ws://192.168.1.5:4455',
      obsWebsocketPassword: 'hunter2',
    });
    expect(urlField().value).toBe(`http://localhost:3000/tools/obs-bridge?${params}`);
    expect(urlField().value).toBe(
      'http://localhost:3000/tools/obs-bridge?commandUser=twitch%3Amod%2Ckick%3Akmod' +
        '&obsWebsocketUrl=ws%3A%2F%2F192.168.1.5%3A4455&obsWebsocketPassword=hunter2' +
        '&twitch=streamer&kick=kicker&cmdScene=%21cam&cmdStopStream=%21end',
    );

    await user.click(button(en('obsBridge.removeUser', { name: 'mod' })));
    expect(urlField().value).toContain('commandUser=kick%3Akmod&');
  });

  it('summarizes what the link will do', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    expect(screen.getByText(en('obsBridge.summaryNobody'))).toBeTruthy();

    await user.type(twitchField(), 'streamer');
    await user.type(textbox(en('obsBridge.label.cmdScene')), '!cam');
    await user.click(userPlatform('Kick'));
    await user.type(usersField(), 'kmod{Enter}');

    const codes = within(summary())
      .getAllByRole('term')
      .map((term) => term.textContent);
    expect(codes).toEqual([
      `!cam ${en('obsBridge.sceneArg')}`,
      'brb',
      'back',
      '!startstream',
      '!stopstream',
      '!startrecord',
      '!stoprecord',
    ]);
    expect(
      screen.getByText(en('obsBridge.summaryNotListening', { platform: 'Kick', names: 'kmod' })),
    ).toBeTruthy();
    expect(screen.queryByText(en('obsBridge.summaryNobody'))).toBeNull();
  });

  it('opens the tool in the page language but copies the URL without one', async () => {
    const user = setupUser();
    await renderRoute(`/tr${PAGE}`);
    await user.type(textbox(tr('common.twitchChannel')), 'streamer');

    const copied = textbox(tr('common.toolUrl')).value;
    expect(copied).toBe('http://localhost:3000/tools/obs-bridge?twitch=streamer');
    const open = screen.getByText(tr('obsBridge.openTool'), { selector: 'a' });
    expect(open.getAttribute('href')).toBe(`${copied}&lang=tr`);

    await user.click(button(tr('common.copy')));
    expect(await navigator.clipboard.readText()).toBe(copied);
    expect(screen.getByText(tr('obsBridge.nextOpen'))).toBeTruthy();
  });
});
