import { fireEvent, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREVIEW_CHANNEL } from '#/features/widgets/featured/use-featured';
import { buildFeaturedUrl, DEFAULT_FEATURED_SETTINGS } from '#/lib/featured-url';
import { withLayout } from '#/test/browser';
import {
  button,
  en,
  retype,
  segment,
  settingsTab,
  slider,
  textbox,
  toggle,
  tr,
} from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const urlField = () => textbox(en('common.widgetUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
const origin = () => window.location.origin;
const durationBox = (label: string, unit: string) =>
  within(screen.getByRole('group', { name: label })).getByLabelText(unit) as HTMLInputElement;

/** Collects what the setup page sends its preview. */
function listen() {
  const received: Record<string, unknown>[] = [];
  const channel = new BroadcastChannel(PREVIEW_CHANNEL);
  channel.onmessage = ({ data }) => received.push(data);
  return { received, close: () => channel.close() };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Featured Message setup', () => {
  it('builds the URL from its controls and reads a pasted one back', async () => {
    const user = setupUser();
    await renderRoute('/setup/featured-message');
    await user.type(twitchField(), 'streamer');
    expect(urlField().value).toBe(
      buildFeaturedUrl(origin(), DEFAULT_FEATURED_SETTINGS, 'streamer', '', 'en'),
    );
    expect(screen.getByText(en('featured.hideOff'))).toBeTruthy();

    await user.click(segment(en('featured.mode'), en('featured.modes.qa')));
    await retype(user, durationBox(en('featured.hide'), en('goal.unitSeconds')), '45');
    await user.click(toggle(en('featured.waiting')));
    await user.click(settingsTab(en('common.sectionAppearance')));
    fireEvent.change(slider(en('irlHud.size')), { target: { value: '120' } });
    const settings = {
      ...DEFAULT_FEATURED_SETTINGS,
      mode: 'qa' as const,
      hide: 45,
      waiting: false,
      size: 120,
    };
    const url = buildFeaturedUrl(origin(), settings, 'streamer', '', 'en');
    expect(urlField().value).toBe(url);
    expect(new URL(url).searchParams.get('waiting')).toBe('0');

    await user.clear(twitchField());
    expect(urlField().value).toBe('');
    await user.click(urlField());
    await user.paste(url);
    await user.tab();
    expect(urlField().value).toBe(url);
    expect(twitchField().value).toBe('streamer');
  }, 30_000);

  it('sends a viewer’s message and a mod’s !feature, a question and the Q&A commands', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const { received, close } = listen();
    await renderRoute('/setup/featured-message');
    await user.click(button(en('featured.testFeature')));
    await user.click(button(en('featured.testAsk')));
    await user.click(button(en('featured.testAsk')));
    await user.click(button(en('featured.testNext')));
    await user.click(button(en('featured.testHide')));
    await vi.waitFor(() => expect(received).toHaveLength(6));
    const viewer = en('goal.testViewer');
    expect(received.map(({ text, name, mod }) => [text, name, mod])).toEqual([
      [en('featured.testMessage'), viewer, false],
      [`!feature @${viewer}`, 'Mod', true],
      [`!q ${en('featured.testQuestion')}`, `${viewer}1`, false],
      [`!q ${en('featured.testQuestion')}`, `${viewer}2`, false],
      ['!q next', 'Mod', true],
      ['!feature off', 'Mod', true],
    ]);
    expect(received.every((message) => message.type === 'chat' && message.preview)).toBe(true);
    close();
  });

  it('offers only the buttons and commands of the picked mode', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const { received, close } = listen();
    await renderRoute('/setup/featured-message');
    expect(screen.getByText(`!feature @${en('featured.cmdNameExample')}`)).toBeTruthy();
    expect(screen.getByText('!q next')).toBeTruthy();

    await user.click(segment(en('featured.mode'), en('featured.modes.qa')));
    expect(screen.queryByText(`!feature @${en('featured.cmdNameExample')}`)).toBeNull();
    expect(screen.queryByText(en('featured.testFeature'), { selector: 'button' })).toBeNull();
    await user.click(button(en('featured.testHide')));
    await vi.waitFor(() => expect(received).toHaveLength(1));
    expect(received[0]).toMatchObject({ text: '!q off', mod: true });

    await user.click(segment(en('featured.mode'), en('featured.modes.feature')));
    expect(screen.queryByText('!q next')).toBeNull();
    expect(screen.queryByText(en('featured.testAsk'), { selector: 'button' })).toBeNull();
    expect(screen.queryByRole('switch', { name: en('featured.waiting') })).toBeNull();
    close();
  }, 30_000);

  it('reads the overlay’s settings and language from its URL', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    await renderRoute('/widgets/featured?simulate=1&mode=qa&waiting=0&size=120&lang=tr');
    const card = screen.getByTestId('featured-card');
    expect(screen.getByTestId('featured').dataset.mode).toBe('qa');
    expect(card.dataset.kind).toBe('question');
    expect(screen.getByTestId('featured-label').textContent).toBe(tr('featured.overlay.question'));
    expect(screen.queryByTestId('featured-waiting')).toBeNull();
    expect((card.parentElement as HTMLElement).style.fontSize).toBe('19.2px');
  });
});
