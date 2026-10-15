import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChannelField } from '#/components/channel-field';
import { TYPING_PAUSE_MS } from '#/hooks/use-debounced-value';
import { en, segment, textbox } from '#/test/queries';
import { renderRoute, renderWithProviders, setupUser } from '#/test/render';

const urlField = () => textbox(en('common.widgetUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
const kickField = () => textbox(en('common.kickChannel'));
const dashHint = (name: string) =>
  screen.queryByText((_, element) =>
    Boolean(
      element?.matches('p') &&
        element.textContent === en('common.kickDashName', { link: `kick.com/${name}` }),
    ),
  );

const KICK_API = 'https://kick.com/api/v1/channels/';

/** Answers kick.com's channel lookups: 200 for the names given, 404 for the rest. */
function kickChannels(...names: string[]) {
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const url = String(input);
    const known = url.startsWith(KICK_API) && names.includes(url.slice(KICK_API.length));
    return new Response('{}', { status: known ? 200 : 404 });
  });
}

// The names looked up on kick.com, the emote picker's lookups of the typed name among them.
const kickLookups = () =>
  vi
    .mocked(fetch)
    .mock.calls.map(([input]) => String(input))
    .filter((url) => url.startsWith(KICK_API))
    .map((url) => url.slice(KICK_API.length));

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('channel fields', () => {
  it('keep the name of a pasted channel link, and the widget URL gets the name', async () => {
    const user = setupUser();
    await renderRoute('/setup/sub-goal');
    await user.click(twitchField());
    await user.paste('https://www.twitch.tv/senchabot/videos?filter=archives');
    await user.click(kickField());
    await user.paste('https://kick.com/popout/sencha-fan/chat');

    expect(twitchField().value).toBe('senchabot');
    expect(kickField().value).toBe('sencha-fan');
    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/goal?twitch=senchabot&kick=sencha-fan',
    );
  });

  it('turn the links in a pasted widget URL into names', async () => {
    const user = setupUser();
    await renderRoute('/setup/sub-goal');
    await user.click(urlField());
    await user.paste(
      'https://extensions.senchabot.com/widgets/goal?twitch=https%3A%2F%2Fwww.twitch.tv%2Fsenchabot&kick=kick.com%2Fsencha-fan&target=75',
    );

    expect(twitchField().value).toBe('senchabot');
    expect(kickField().value).toBe('sencha-fan');
    const params = new URL(urlField().value).searchParams;
    expect([params.get('twitch'), params.get('kick'), params.get('target')]).toEqual([
      'senchabot',
      'sencha-fan',
      '75',
    ]);
  });

  it('switch a Kick name with _ to its - spelling when only that one is a channel', async () => {
    kickChannels('sencha-fan');
    const user = setupUser();
    await renderRoute('/setup/sub-goal');
    await user.click(kickField());
    await user.paste('Sencha_Fan');

    await waitFor(() => expect(kickField().value).toBe('sencha-fan'));
    const lookups = kickLookups();
    expect(lookups.indexOf('sencha_fan')).toBeGreaterThan(-1);
    expect(lookups.indexOf('sencha-fan')).toBeGreaterThan(lookups.indexOf('sencha_fan'));
    expect(dashHint('sencha-fan')).toBeTruthy();
    expect(urlField().value).toBe('http://localhost:3000/widgets/goal?kick=sencha-fan');

    // The hint says why the name changed, until it changes again.
    await user.type(kickField(), '2');
    expect(dashHint('sencha-fan')).toBeNull();
  });

  it('keep a Kick name with _ that is a channel', async () => {
    kickChannels('sencha_fan', 'sencha-fan');
    const user = setupUser();
    await renderRoute('/setup/sub-goal');
    await user.click(kickField());
    await user.paste('sencha_fan');

    await waitFor(() => expect(kickLookups()).toContain('sencha_fan'));
    await act(async () => {});
    expect(kickLookups()).not.toContain('sencha-fan');
    expect(kickField().value).toBe('sencha_fan');
    expect(dashHint('sencha-fan')).toBeNull();
  });

  it("don't look up a Kick name once the field is turned off, e.g. for a Twitch-only widget", async () => {
    vi.useFakeTimers();
    kickChannels('sencha-fan');
    // A Kick field that the test turns off, the way picking Twitch under Platforms does.
    function Field() {
      const [value, setValue] = useState('sencha_fan');
      const [off, setOff] = useState(false);
      return (
        <>
          <ChannelField
            platform="kick"
            label="Kick"
            value={value}
            onChange={setValue}
            disabled={off}
          />
          <button type="button" onClick={() => setOff(true)}>
            off
          </button>
        </>
      );
    }
    const pause = async () => {
      await act(async () => {
        vi.advanceTimersByTime(TYPING_PAUSE_MS + 100);
      });
      await act(async () => {});
    };
    const field = () => screen.getByLabelText('Kick', { selector: 'input' }) as HTMLInputElement;

    const turnedOff = await renderWithProviders(<Field />);
    fireEvent.click(screen.getByRole('button', { name: 'off' }));
    await pause();
    expect(kickLookups()).toEqual([]);
    expect(field().value).toBe('sencha_fan');
    turnedOff.unmount();

    // Left on, the same name is looked up once typing pauses, and switches.
    await renderWithProviders(<Field />);
    await pause();
    expect(kickLookups()).toEqual(['sencha_fan', 'sencha-fan']);
    expect(field().value).toBe('sencha-fan');
  });

  it('take links on the OBS Bridge setup page too', async () => {
    const user = setupUser();
    await renderRoute('/setup/obs-bridge');
    await user.click(twitchField());
    await user.paste('twitch.tv/senchabot');
    await user.click(kickField());
    await user.paste('https://kick.com/sencha-fan');

    expect(textbox(en('common.toolUrl')).value).toBe(
      'http://localhost:3000/tools/obs-bridge?twitch=senchabot&kick=sencha-fan',
    );
  });

  it('take links in the Raffle channel field, for the platform picked', async () => {
    kickChannels('sencha-fan');
    const user = setupUser();
    await renderRoute('/setup/raffle');
    const channel = () => textbox(en('raffle.channelName'));
    await user.click(channel());
    await user.paste('https://www.twitch.tv/senchabot');
    expect(channel().value).toBe('senchabot');

    await user.click(segment(en('raffle.platform'), 'Kick'));
    await user.clear(channel());
    await user.paste('sencha_fan');
    await waitFor(() => expect(channel().value).toBe('sencha-fan'));
  });
});
