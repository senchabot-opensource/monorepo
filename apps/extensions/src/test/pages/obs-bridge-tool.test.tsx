import { act, cleanup, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeWebSocket } from '#/test/browser';
import { OBSWebSocket } from '#/test/fake-obs-websocket';
import { button, en, inLocale, segment, textbox } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

vi.mock('obs-websocket-js', () => import('#/test/fake-obs-websocket'));

const TOOL = '/tools/obs-bridge';

beforeEach(() => {
  OBSWebSocket.instances = [];
  // Chat clients log their connection state, and the Kick lookup fails without a network.
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  // Unmount while console is still muted: the chat client logs its disconnect.
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/** A Twitch chat line from `name` reaching the tool's chat connection. */
function say(name: string, text: string) {
  const chat = FakeWebSocket.instances.find((ws) => ws.url.startsWith('wss://irc-ws.chat.twitch'));
  if (!chat) throw new Error('The tool never connected to Twitch chat');
  if (chat.readyState !== FakeWebSocket.OPEN) act(() => chat.open());
  const login = name.toLowerCase();
  act(() =>
    chat.receive(
      `@display-name=${name} :${login}!${login}@${login}.tmi.twitch.tv PRIVMSG #streamer :${text}\r\n`,
    ),
  );
}

const sceneSwitches = () =>
  OBSWebSocket.latest.calls
    .filter(([request]) => request === 'SetCurrentProgramScene')
    .map(([, data]) => (data as { sceneName: string }).sceneName);

async function connectWithScenes(scenes: string[]) {
  const obs = OBSWebSocket.latest;
  obs.scenes = scenes;
  await act(async () => obs.accept());
  await act(async () => obs.emit('Identified'));
}

describe('OBS Bridge tool', () => {
  it.each([
    'en',
    'tr',
  ] as const)('shows each connection state with a translated label (%s)', async (locale) => {
    const t = inLocale(locale);
    await renderRoute(`${TOOL}?twitch=streamer&lang=${locale}`);
    vi.useFakeTimers();
    const live = () =>
      within(
        screen.getByLabelText(t('obsBridge.tool.connection'), { selector: 'section' }),
      ).getByText((_, element) => element?.getAttribute('aria-live') === 'polite');

    expect(live().textContent).toBe(t('obsBridge.tool.status.connecting'));

    await act(async () => OBSWebSocket.latest.refuse());
    expect(live().textContent).toBe(t('obsBridge.tool.status.failed'));
    expect(screen.getByText(t('obsBridge.tool.failedHint'))).toBeTruthy();

    // It retries after 5s on the same client.
    act(() => vi.advanceTimersByTime(5000));
    expect(OBSWebSocket.latest.connectArgs).toHaveLength(2);
    await act(async () => OBSWebSocket.latest.accept());
    expect(live().textContent).toBe(t('obsBridge.tool.status.connected'));
    expect(screen.queryByText(t('obsBridge.tool.failedHint'))).toBeNull();

    act(() => OBSWebSocket.latest.emit('ConnectionClosed'));
    expect(live().textContent).toBe(t('obsBridge.tool.status.disconnected'));
  });

  it('connects with the URL and password from the link', async () => {
    await renderRoute(
      `${TOOL}?twitch=streamer&obsWebsocketUrl=ws%3A%2F%2F10.0.0.2%3A4455&obsWebsocketPassword=secret&lang=en`,
    );
    expect(OBSWebSocket.latest.connectArgs[0]).toEqual(['ws://10.0.0.2:4455', 'secret']);
  });

  it('lists the OBS scenes and saves Main and BRB picks in the page URL', async () => {
    const user = setupUser();
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    expect(screen.getByText(en('obsBridge.tool.scenesOffline'))).toBeTruthy();

    await connectWithScenes(['Just Chatting', 'Gaming', 'Be Right Back']);
    expect(
      screen.getByText(en('obsBridge.tool.scenes', { count: 3 }), { selector: 'h2' }),
    ).toBeTruthy();
    // Neither default scene name exists in this OBS.
    expect(
      screen.getByText(en('obsBridge.tool.assignMainBrbWarning', { brb: 'brb', back: 'back' })),
    ).toBeTruthy();

    await user.click(button(en('obsBridge.tool.setMain', { scene: 'Gaming' })));
    expect(new URL(window.location.href).searchParams.get('mainScene')).toBe('Gaming');
    const setMain = button(en('obsBridge.tool.setMain', { scene: 'Gaming' }));
    expect(setMain.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText(en('obsBridge.tool.assignBrbWarning', { brb: 'brb' }))).toBeTruthy();

    await user.click(button(en('obsBridge.tool.setBrb', { scene: 'Be Right Back' })));
    const params = new URL(window.location.href).searchParams;
    expect(params.get('brbScene')).toBe('Be Right Back');
    expect(params.get('twitch')).toBe('streamer');
    expect(screen.queryByText(/nowhere to go/)).toBeNull();
  });

  it('runs chat commands from authorized users against the picked scenes', async () => {
    const user = setupUser();
    await renderRoute(`${TOOL}?twitch=streamer&commandUser=twitch%3Amod&brbScene=AFK&lang=en`);
    await connectWithScenes(['Main Scene', 'Gaming', 'AFK']);

    say('Viewer', 'brb');
    say('Mod', 'brb');
    say('Mod', 'BACK');
    say('Mod', '!scene gam');
    say('Mod', '!startstream');
    expect(sceneSwitches()).toEqual(['AFK', 'Main Scene', 'Gaming']);
    expect(OBSWebSocket.latest.calls.map(([request]) => request)).toContain('StartStream');

    // A new BRB pick applies to the running bridge right away.
    await user.click(button(en('obsBridge.tool.setBrb', { scene: 'Gaming' })));
    say('Mod', 'brb');
    expect(sceneSwitches().at(-1)).toBe('Gaming');
  });

  it('copies the current URL, scene picks included', async () => {
    const user = setupUser();
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    await connectWithScenes(['Gaming', 'AFK']);
    await user.click(button(en('obsBridge.tool.setBrb', { scene: 'AFK' })));

    await user.click(button(en('obsBridge.tool.copyUrl')));
    const copied = await navigator.clipboard.readText();
    expect(copied).toBe(window.location.href);
    expect(new URL(copied).searchParams.get('brbScene')).toBe('AFK');
    expect(button(en('common.copied'))).toBeTruthy();
  });

  it('shows the URL to copy by hand when the clipboard is blocked', async () => {
    const user = setupUser();
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('denied'));
    await user.click(button(en('obsBridge.tool.copyUrl')));
    expect(textbox(en('obsBridge.tool.copyUrlManual')).value).toBe(window.location.href);
  });

  it('adds authorized users to the page URL', async () => {
    const user = setupUser();
    await renderRoute(`${TOOL}?twitch=streamer&kick=kicker&commandUser=twitch%3Amod&lang=en`);
    await user.click(segment(en('obsBridge.userPlatform'), 'Kick'));
    await user.type(textbox(en('obsBridge.tool.usersCount', { count: 1 })), 'kmod{Enter}');
    expect(new URL(window.location.href).searchParams.get('commandUser')).toBe(
      'twitch:mod,kick:kmod',
    );
    expect(textbox(en('obsBridge.tool.usersCount', { count: 2 })));
  });

  it('lists the configured chat commands', async () => {
    await renderRoute(`${TOOL}?twitch=streamer&cmdBrb=afk&cmdScene=!cam&lang=en`);
    const commands = screen
      .getByText(en('obsBridge.tool.commands'), { selector: 'h2' })
      .closest('details') as HTMLElement;
    const terms = within(commands)
      .getAllByRole('term', { hidden: true })
      .map((term) => term.textContent);
    expect(terms).toEqual([
      `!cam ${en('obsBridge.sceneArg')}`,
      'afk',
      'back',
      '!startstream',
      '!stopstream',
      '!startrecord',
      '!stoprecord',
    ]);
    expect(
      screen.getByText(
        en('obsBridge.tool.sceneHint', { command: `!cam ${en('obsBridge.sceneArg')}` }),
      ),
    ).toBeTruthy();
  });
});
