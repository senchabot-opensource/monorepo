import { screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREVIEW_CHANNEL } from '#/features/widgets/poll/use-poll';
import { buildPollUrl, DEFAULT_POLL_SETTINGS, type PollSettings } from '#/lib/poll-url';
import { withLayout } from '#/test/browser';
import { button, en, retype, segment, textbox, toggle } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/chat-poll';

const urlField = () => textbox(en('common.widgetUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
const option = (n: number) => textbox(en('poll.optionLabel').replace('{n}', String(n)));
const removeOption = (n: number) => button(en('poll.removeOption').replace('{n}', String(n)));
const color = (name: string) =>
  within(screen.getByLabelText(en('poll.color'), { selector: 'fieldset' })).getByLabelText(
    name,
  ) as HTMLInputElement;
const previewSrc = () =>
  new URL((screen.getByTitle(en('poll.previewIframeTitle')) as HTMLIFrameElement).src);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Chat Poll setup', () => {
  it('builds the widget URL from every control', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    expect(urlField().value).toBe('');

    let settings: PollSettings = { ...DEFAULT_POLL_SETTINGS };
    const expectUrl = (patch: Partial<PollSettings>) => {
      settings = { ...settings, ...patch };
      expect(urlField().value).toBe(
        buildPollUrl(window.location.origin, settings, 'streamer', '', 'en'),
      );
    };

    await user.type(twitchField(), 'Streamer');
    expect(urlField().value).toBe('http://localhost:3000/widgets/poll?twitch=streamer&lang=en');

    await retype(user, textbox(en('poll.question')), 'Next game?');
    expectUrl({ question: 'Next game?' });
    await retype(user, option(1), 'Minecraft');
    await retype(user, option(2), 'Valorant');
    await user.click(button(en('poll.addOption')));
    await retype(user, option(3), 'GTA');
    expectUrl({ options: ['Minecraft', 'Valorant', 'GTA'] });
    await user.click(removeOption(2));
    expectUrl({ options: ['Minecraft', 'GTA'] });

    await user.click(segment(en('poll.voters'), en('poll.votersSubs')));
    expectUrl({ subsOnly: true });
    await user.click(toggle(en('poll.change')));
    expectUrl({ change: false });
    await user.click(toggle(en('poll.blind')));
    expectUrl({ blind: true });
    await retype(user, textbox(en('poll.delay')), '12');
    expectUrl({ delay: 12 });
    await user.click(color(en('subathon.colors.gold')));
    expectUrl({ color: 'gold' });
    await user.click(segment(en('poll.position'), en('poll.positionBottom')));
    expectUrl({ position: 'bottom' });
    await user.click(segment(en('poll.language'), 'Türkçe'));
    expect(urlField().value).toContain('lang=tr');

    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/poll?twitch=streamer&q=Next+game%3F&o=Minecraft%7CGTA&delay=12&subs=1&change=0&blind=1&color=gold&pos=bottom&lang=tr',
    );
  });

  it('keeps between two and six options, and sub votes only count extra for everyone polls', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    expect(removeOption(1).hasAttribute('disabled')).toBe(true);
    for (let i = 0; i < 4; i++) await user.click(button(en('poll.addOption')));
    expect(option(6)).toBeTruthy();
    expect(button(en('poll.addOption')).hasAttribute('disabled')).toBe(true);

    // A disabled fieldset disables its radios without setting their own property.
    const weights = () => segment(en('poll.subWeight'), '2×').closest('fieldset');
    expect(weights()?.disabled).toBe(false);
    await user.click(segment(en('poll.voters'), en('poll.votersSubs')));
    expect(weights()?.disabled).toBe(true);
  });

  it('loads a pasted widget URL back into the controls', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.click(urlField());
    await user.paste(
      'https://extensions.senchabot.com/widgets/poll?kick=kicker&q=Best+map%3F&o=Dust%7CMirage%7CInferno&subx=3&lang=tr',
    );

    expect(textbox(en('common.kickChannel')).value).toBe('kicker');
    expect(segment(en('common.platforms'), 'Kick').checked).toBe(true);
    expect(textbox(en('poll.question')).value).toBe('Best map?');
    expect(option(3).value).toBe('Inferno');
    expect(segment(en('poll.subWeight'), '3×').checked).toBe(true);
    expect(segment(en('poll.language'), 'Türkçe').checked).toBe(true);
  });

  it("plays the ready-made poll from the overlay's URL through the router", async () => {
    // The router rebuilds the search string, which once dropped repeated option params.
    await renderRoute('/widgets/poll?simulate=1&lang=en&q=1e3&o=Minecraft%7CValorant%7C2026');
    await vi.waitFor(
      () => {
        const card = screen.getByTestId('poll-card').textContent ?? '';
        expect(card).toContain('1e3');
        expect(card).not.toContain('1000');
        expect(card).toContain('Valorant');
        expect(card).toContain('2026');
      },
      { timeout: 4000 },
    );
  });

  it('pairs the preview with the page and sends test events to it', async () => {
    // The preview frame only mounts once its box has a size.
    withLayout(800, 700);
    const user = setupUser();
    const received: unknown[] = [];
    const listener = new BroadcastChannel(PREVIEW_CHANNEL);
    listener.onmessage = ({ data }) => received.push(data);
    await renderRoute(PAGE);

    const preview = previewSrc().searchParams.get('preview');
    expect(previewSrc().searchParams.get('simulate')).toBe('1');
    expect(preview).toBeTruthy();

    await user.click(button(en('poll.testEnd')));
    await user.click(button(en('poll.testVotes').replace('{count}', '10')));
    await vi.waitFor(() => expect(received).toHaveLength(11));
    expect(received[0]).toMatchObject({
      type: 'event',
      preview,
      event: { kind: 'message', mod: true, text: '!poll end' },
    });
    expect(received[1]).toMatchObject({ event: { kind: 'message', mod: false } });
    listener.close();
  });
});
