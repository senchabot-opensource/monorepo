import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { button, en, segment, textbox, toggle } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/weather';

const urlField = () => textbox(en('common.widgetUrl'));
const widgetUrl = () => new URL(urlField().value);
const findField = () => textbox(en('weather.place'));
const nameField = () => textbox(en('weather.placeName'));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function openPage() {
  const user = setupUser();
  await renderRoute(PAGE);
  return user;
}

describe('Weather setup', () => {
  it('has no URL until a place is picked, and takes pasted coordinates without a search', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = await openPage();
    expect(urlField().value).toBe('');
    expect(screen.getByText(en('weather.placeNeeded'))).toBeTruthy();

    await user.type(findField(), '41.008238, 28.978359{Enter}');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(Object.fromEntries(widgetUrl().searchParams)).toEqual({
      lat: '41.0082',
      lon: '28.9784',
      lang: 'en',
    });
    expect(
      screen.getByText(en('weather.placePicked', { coords: '41.0082, 28.9784' })),
    ).toBeTruthy();
    // Coordinates have no name, so the overlay shows none until one is typed.
    expect(nameField().value).toBe('');
    await user.type(nameField(), 'Home Town');
    expect(widgetUrl().searchParams.get('place')).toBe('Home Town');
  });

  it("names a found place after its first part, and keeps the user's name for pasted coordinates", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            lat: '40.9903',
            lon: '29.0290',
            display_name: 'Kadıköy, Istanbul, Marmara Region, Türkiye',
          },
        ]),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);
    const user = await openPage();

    await user.type(findField(), 'kadikoy');
    await user.click(button(en('irlHud.placeSearch')));
    expect(String(fetchMock.mock.calls[0][0])).toContain('nominatim.openstreetmap.org');
    await user.click(
      await screen.findByRole('button', { name: 'Kadıköy, Istanbul, Marmara Region, Türkiye' }),
    );
    expect(nameField().value).toBe('Kadıköy');
    expect(Object.fromEntries(widgetUrl().searchParams)).toMatchObject({
      lat: '40.9903',
      lon: '29.029',
      place: 'Kadıköy',
    });

    await user.type(findField(), '41.0082, 28.9784{Enter}');
    expect(nameField().value).toBe('Kadıköy');
    expect(widgetUrl().searchParams.get('lat')).toBe('41.0082');
  });

  it('writes the look and the forecast into the URL, and hides what a pill has no room for', async () => {
    const user = await openPage();
    await user.type(findField(), '41.0082, 28.9784{Enter}');

    await user.click(segment(en('weather.units'), en('weather.unitOptions.imperial')));
    await user.click(segment(en('weather.theme'), en('weather.themes.light')));
    await user.click(segment(en('weather.corner'), en('irlHud.corners.br')));
    await user.click(segment(en('weather.forecast'), en('weather.forecasts.days')));
    await user.click(toggle(en('weather.details')));
    expect(Object.fromEntries(widgetUrl().searchParams)).toMatchObject({
      units: 'imperial',
      theme: 'light',
      corner: 'br',
      forecast: 'days',
      details: '0',
    });
    // 12-hour times are for the hours row only.
    expect(screen.queryByText(en('weather.clock12'))).toBeNull();
    await user.click(segment(en('weather.forecast'), en('weather.forecasts.hours')));
    await user.click(toggle(en('weather.clock12')));
    expect(widgetUrl().searchParams.get('h12')).toBe('1');

    await user.click(segment(en('weather.layout'), en('weather.layouts.pill')));
    expect(widgetUrl().searchParams.get('layout')).toBe('pill');
    expect(screen.queryByText(en('weather.forecast'))).toBeNull();
    expect(screen.queryByText(en('weather.details'))).toBeNull();
  });

  it('opens an existing URL with its settings and language', async () => {
    const user = await openPage();
    await user.click(urlField());
    await user.paste(
      `${window.location.origin}/widgets/weather?lat=35.6762&lon=139.6503&place=Tokyo&layout=pill&lang=ja`,
    );
    expect(nameField().value).toBe('Tokyo');
    expect(segment(en('weather.layout'), en('weather.layouts.pill')).checked).toBe(true);
    expect(Object.fromEntries(widgetUrl().searchParams)).toMatchObject({
      lat: '35.6762',
      lon: '139.6503',
      lang: 'ja',
    });
  });

  it('turns down a URL of another widget', async () => {
    const user = await openPage();
    await user.click(urlField());
    await user.paste(`${window.location.origin}/widgets/irl-hud?twitch=streamer`);
    expect(screen.getByText(en('weather.widgetUrlInvalid'))).toBeTruthy();
  });
});
