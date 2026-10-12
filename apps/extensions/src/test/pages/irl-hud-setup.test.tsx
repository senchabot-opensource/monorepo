import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { button, en, segment, textbox } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/irl-hud';

const urlField = () => textbox(en('common.widgetUrl'));
const widgetUrl = () => new URL(urlField().value);
const placeField = () => textbox(en('irlHud.place'));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('IRL HUD setup', () => {
  it('writes the mini-map style into the widget URL', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(textbox(en('common.twitchChannel')), 'streamer');
    expect(widgetUrl().searchParams.has('map')).toBe(false);

    await user.click(segment(en('irlHud.map'), en('irlHud.maps.park')));
    expect(widgetUrl().searchParams.get('map')).toBe('park');
    expect(screen.queryByLabelText(en('irlHud.place'), { selector: 'input' })).toBeNull();
  });

  it('takes pasted coordinates for a real place without searching', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(textbox(en('common.twitchChannel')), 'streamer');
    await user.click(segment(en('irlHud.map'), en('irlHud.maps.real')));
    expect(screen.getByText(en('irlHud.placeNeeded'))).toBeTruthy();

    await user.type(placeField(), '41.0256149, 28.9744{Enter}');
    expect(widgetUrl().searchParams.get('map')).toBe('real');
    expect(widgetUrl().searchParams.get('lat')).toBe('41.02561');
    expect(widgetUrl().searchParams.get('lon')).toBe('28.9744');
    expect(screen.getByText(en('irlHud.placePicked', { place: '41.02561, 28.9744' }))).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('searches OpenStreetMap for a place name and uses the one picked', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify([
          { lat: '41.0256149', lon: '28.9741658', display_name: 'Galata Tower, Istanbul' },
          { lat: '48.8584', lon: '2.2945', display_name: 'Eiffel Tower, Paris' },
        ]),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(textbox(en('common.twitchChannel')), 'streamer');
    await user.click(segment(en('irlHud.map'), en('irlHud.maps.real')));
    await user.type(placeField(), 'tower');
    await user.click(button(en('irlHud.placeSearch')));

    await user.click(await screen.findByRole('button', { name: 'Eiffel Tower, Paris' }));
    expect(widgetUrl().searchParams.get('lat')).toBe('48.8584');
    expect(widgetUrl().searchParams.get('lon')).toBe('2.2945');
    expect(
      screen.getByText(en('irlHud.placePicked', { place: 'Eiffel Tower, Paris' })),
    ).toBeTruthy();
    expect(String(fetchMock.mock.calls[0][0])).toContain('nominatim.openstreetmap.org');
  });

  it('says so when the search finds nothing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('[]')));
    const user = setupUser();
    await renderRoute(PAGE);
    await user.click(segment(en('irlHud.map'), en('irlHud.maps.real')));
    await user.type(placeField(), 'nowhere at all{Enter}');
    expect(await screen.findByText(en('irlHud.placeNone'))).toBeTruthy();
  });
});
