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
  ] as const)('shows the OBS state, why it failed and when it retries (%s)', async (locale) => {
    const t = inLocale(locale);
    await renderRoute(`${TOOL}?twitch=streamer&lang=${locale}`);
    vi.useFakeTimers();
    const card = () =>
      within(screen.getByLabelText(t('obsBridge.tool.connectionsTitle'), { selector: 'section' }));
    const badge = () =>
      card().getByText((_, element) => element?.getAttribute('aria-live') === 'polite');
    const url = 'ws://127.0.0.1:4455';

    expect(badge().textContent).toBe(t('obsBridge.tool.status.connecting'));
    expect(card().getByText(t('obsBridge.tool.obsConnecting', { url }))).toBeTruthy();

    await act(async () => OBSWebSocket.latest.refuse());
    expect(badge().textContent).toBe(t('obsBridge.tool.status.failed'));
    expect(card().getByText(t('obsBridge.tool.obsUnreachable', { url }))).toBeTruthy();
    expect(card().getByText(t('obsBridge.tool.retryIn', { seconds: 5, attempt: 2 }))).toBeTruthy();
    act(() => vi.advanceTimersByTime(2000));
    expect(card().getByText(t('obsBridge.tool.retryIn', { seconds: 3, attempt: 2 }))).toBeTruthy();

    // It retries after 5s on the same client.
    act(() => vi.advanceTimersByTime(3000));
    expect(OBSWebSocket.latest.connectArgs).toHaveLength(2);
    expect(card().getByText(t('obsBridge.tool.retrying'))).toBeTruthy();
    await act(async () => OBSWebSocket.latest.accept());
    expect(badge().textContent).toBe(t('obsBridge.tool.status.connected'));
    expect(card().queryByText(t('obsBridge.tool.obsUnreachable', { url }))).toBeNull();

    act(() => OBSWebSocket.latest.emit('ConnectionClosed', { code: 1001, message: '' }));
    expect(badge().textContent).toBe(t('obsBridge.tool.status.disconnected'));
    expect(card().getByText(t('obsBridge.tool.obsClosed'))).toBeTruthy();
  });

  it('tells a wrong password from a missing one', async () => {
    await renderRoute(`${TOOL}?twitch=streamer&obsWebsocketPassword=nope&lang=en`);
    await act(async () => OBSWebSocket.latest.refuse(4009, 'Authentication failed.'));
    expect(screen.getByText(en('obsBridge.tool.obsWrongPassword'))).toBeTruthy();
    cleanup();

    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    await act(async () => OBSWebSocket.latest.refuse(4009, 'missing authentication'));
    expect(screen.getByText(en('obsBridge.tool.obsNeedsPassword'))).toBeTruthy();
  });

  it('retries at once when asked instead of waiting', async () => {
    const user = setupUser();
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    const retry = () => button(en('obsBridge.tool.retryNow')) as HTMLButtonElement;
    await act(async () => OBSWebSocket.latest.refuse());
    await user.click(retry());
    expect(OBSWebSocket.latest.connectArgs).toHaveLength(2);
    // Nothing to skip while that attempt runs.
    expect(retry().disabled).toBe(true);
  });

  it('shows whether each chat is connected', async () => {
    await renderRoute(`${TOOL}?twitch=Streamer&lang=en`);
    const row = () => screen.getByText('streamer').closest('li') as HTMLElement;
    expect(within(row()).getByText(en('obsBridge.tool.chat.connecting'))).toBeTruthy();

    const chat = FakeWebSocket.instances.find((ws) =>
      ws.url.startsWith('wss://irc-ws.chat.twitch'),
    );
    act(() => chat?.open());
    expect(within(row()).getByText(en('obsBridge.tool.chat.connected'))).toBeTruthy();
  });

  it('says so when the Kick channel does not exist', async () => {
    // Without a network the channel lookup fails, as it does for an unknown name.
    await renderRoute(`${TOOL}?kick=nobody&lang=en`);
    expect(screen.getByText(en('obsBridge.tool.kickNotFound', { channel: 'nobody' }))).toBeTruthy();
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

    const log = within(
      screen.getByLabelText(en('obsBridge.tool.activityTitle'), { selector: 'section' }),
    );
    expect(log.getByText(en('obsBridge.tool.activityEmpty'))).toBeTruthy();

    say('Viewer', 'brb');
    say('Mod', 'brb');
    say('Mod', 'BACK');
    say('Mod', '!scene gam');
    say('Mod', '!startstream');
    say('Mod', '!scene nowhere');
    expect(sceneSwitches()).toEqual(['AFK', 'Main Scene', 'Gaming']);
    expect(OBSWebSocket.latest.calls.map(([request]) => request)).toContain('StartStream');

    // Newest first; the viewer isn't on the list, so nothing of theirs shows up.
    await act(async () => {});
    const outcomes = log
      .getAllByRole('listitem')
      .map((item) => item.querySelector('p')?.textContent);
    expect(outcomes).toEqual([
      `✕ ${en('obsBridge.tool.activityNoScene', { query: 'nowhere' })}`,
      `✓ ${en('obsBridge.tool.activityStartStream')}`,
      `✓ ${en('obsBridge.tool.activityScene', { scene: 'Gaming' })}`,
      `✓ ${en('obsBridge.tool.activityScene', { scene: 'Main Scene' })}`,
      `✓ ${en('obsBridge.tool.activityScene', { scene: 'AFK' })}`,
    ]);

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

describe('OBS Bridge tool in an OBS dock', () => {
  it('has no link or menu a stray click could follow away from the bridge', async () => {
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    const header = document.querySelector('header');
    expect(header).not.toBeNull();
    // The EN/TR links only swap ?lang= on the same page, so they're the one allowed kind.
    const leaving = [...(header?.querySelectorAll('a[href]') ?? [])].filter(
      (link) => !link.hasAttribute('hreflang'),
    );
    expect(leaving.map((link) => link.getAttribute('href'))).toEqual([]);
    expect(header?.querySelector('button[aria-controls]')).toBeNull();
    expect(document.querySelector('footer')).toBeNull();
  });
});
