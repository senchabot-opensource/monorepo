import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type CreditsSettings, DEFAULT_CREDITS_SETTINGS } from '#/lib/credits-url';
import { FakeWebSocket } from '#/test/browser';
import { renderWithProviders } from '#/test/render';
import { storageKey } from './credits-state';
import { CreditsWidget } from './credits-widget';

const kickLookup = vi.hoisted(() => vi.fn());
vi.mock('#/lib/kick', async (importOriginal) => ({
  ...(await importOriginal<typeof import('#/lib/kick')>()),
  getKickChannelInfo: kickLookup,
}));

const twitchSockets = () => FakeWebSocket.instances.filter((ws) => ws.url.includes('twitch'));
// Both Twitch readers get every line, as both connections would.
const receive = (line: string) =>
  act(() => {
    for (const ws of twitchSockets()) ws.receive(line);
  });
const say = (tags: string, login: string, text: string) =>
  receive(
    `@${tags};room-id=1 :${login}!${login}@${login}.tmi.twitch.tv PRIVMSG #streamer :${text}`,
  );

const sections = () =>
  screen.queryAllByTestId('credits-section').map((section) => ({
    section: section.dataset.section,
    names: [...section.querySelectorAll('[data-testid="credits-name"]')].map(
      (name) => name.textContent,
    ),
  }));

const { platforms: _, ...DEFAULTS } = DEFAULT_CREDITS_SETTINGS;
const settings = (overrides: Partial<Omit<CreditsSettings, 'platforms'>> = {}) => ({
  ...DEFAULTS,
  ...overrides,
});
const render = (ui: React.ReactNode) => renderWithProviders(ui, '/widgets/credits');

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  delete (window as { obsstudio?: unknown }).obsstudio;
});

describe('CreditsWidget', () => {
  it('collects supporters and chatters, and rolls them, title first', async () => {
    await render(<CreditsWidget twitchChannel="streamer" settings={settings({ outro: 'Bye!' })} />);
    say('display-name=MoonLit;badges=', 'moonlit', 'hello');
    say('display-name=Mod;badges=moderator/1;mod=1', 'mod', 'hi chat');
    receive(
      '@display-name=Subber;msg-id=sub;msg-param-sub-plan=1000;msg-param-cumulative-months=1;room-id=1 :tmi.twitch.tv USERNOTICE #streamer',
    );
    receive(
      '@display-name=Cheery;bits=250;room-id=1 :cheery!cheery@cheery.tmi.twitch.tv PRIVMSG #streamer :Cheer250',
    );
    // A new roll picks the names up.
    say('badges=moderator/1;mod=1', 'mod', '!credits');

    expect(screen.getByTestId('credits-title').textContent).toBe('Thanks for watching!');
    expect(sections()).toEqual([
      { section: 'subs', names: ['Subber'] },
      { section: 'cheers', names: ['Cheery250'] },
      { section: 'mods', names: ['Mod'] },
      { section: 'chatters', names: ['MoonLit', 'Mod', 'Cheery'] },
    ]);
    expect(screen.getByTestId('credits-outro').textContent).toBe('Bye!');
  });

  it('leaves out turned-off sections and saves the names', async () => {
    await render(
      <CreditsWidget
        twitchChannel="streamer"
        settings={settings({ sections: { ...DEFAULTS.sections, chatters: false } })}
      />,
    );
    say('display-name=MoonLit;badges=', 'moonlit', 'hello');
    say('badges=moderator/1;mod=1', 'mod', '!credits');
    expect(sections()).toEqual([{ section: 'mods', names: ['mod'] }]);
    act(() => vi.advanceTimersByTime(2500));
    const saved = JSON.parse(localStorage.getItem(storageKey('streamer')) ?? 'null');
    expect(saved.chatters.map((entry: { name: string }) => entry.name)).toEqual(['MoonLit', 'mod']);
  });

  it('starts over when a mod resets it, and hides on !credits stop', async () => {
    await render(<CreditsWidget twitchChannel="streamer" settings={settings()} />);
    say('display-name=MoonLit;badges=', 'moonlit', 'hello');
    say('badges=moderator/1;mod=1', 'mod', '!credits reset');
    say('badges=moderator/1;mod=1', 'mod', '!credits');
    // MoonLit is gone; the mod chatted after the reset, so they're in.
    expect(sections()).toEqual([
      { section: 'mods', names: ['mod'] },
      { section: 'chatters', names: ['mod'] },
    ]);
    say('badges=moderator/1;mod=1', 'mod', '!credits stop');
    expect(screen.getByTestId('credits').dataset.rolling).toBe('false');
  });

  it('waits in OBS until its scene goes live', async () => {
    (window as { obsstudio?: unknown }).obsstudio = {};
    await render(<CreditsWidget twitchChannel="streamer" settings={settings()} />);
    expect(screen.getByTestId('credits').dataset.rolling).toBe('false');
    act(() => {
      window.dispatchEvent(new CustomEvent('obsSourceActiveChanged', { detail: { active: true } }));
    });
    expect(screen.getByTestId('credits').dataset.rolling).toBe('true');
    act(() => {
      window.dispatchEvent(
        new CustomEvent('obsSourceActiveChanged', { detail: { active: false } }),
      );
    });
    expect(screen.getByTestId('credits').dataset.rolling).toBe('false');
  });

  it('rolls sample names in a preview without connecting', async () => {
    await render(<CreditsWidget settings={settings()} simulate />);
    expect(FakeWebSocket.instances).toHaveLength(0);
    expect(sections().map((section) => section.section)).toEqual([
      'subs',
      'gifts',
      'cheers',
      'raids',
      'mods',
      'chatters',
    ]);
  });
});
