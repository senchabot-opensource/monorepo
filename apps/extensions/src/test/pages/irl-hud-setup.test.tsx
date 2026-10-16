import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { TranslationKey } from '#/lib/i18n';
import {
  button,
  combobox,
  en,
  pickOption,
  section,
  segment,
  settingsTab,
  textbox,
} from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/irl-hud';

const urlField = () => textbox(en('common.widgetUrl'));
const widgetUrl = () => new URL(urlField().value);
const nameField = () => textbox(en('irlHud.placeName'));
const findField = () => textbox(en('irlHud.place'));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function openPage(tab: TranslationKey = 'irlHud.sectionMap') {
  const user = setupUser();
  await renderRoute(PAGE);
  await user.type(textbox(en('common.twitchChannel')), 'streamer');
  await user.click(settingsTab(en(tab)));
  return user;
}

describe('IRL HUD setup', () => {
  it('offers four styles in a dropdown and writes the one picked', async () => {
    const user = await openPage();
    await user.click(settingsTab(en('common.sectionAppearance')));
    expect(combobox(en('irlHud.style')).textContent).toBe(en('irlHud.styleRetro'));
    expect(widgetUrl().searchParams.has('style')).toBe(false);
    await pickOption(user, en('irlHud.style'), en('irlHud.styleMedieval'));
    expect(widgetUrl().searchParams.get('style')).toBe('medieval');
    await pickOption(user, en('irlHud.style'), en('irlHud.styleMmorpg'));
    expect(widgetUrl().searchParams.get('style')).toBe('mmorpg');
  });

  it('writes the mini-map style into the widget URL', async () => {
    const user = await openPage();
    expect(widgetUrl().searchParams.has('map')).toBe(false);
    await user.click(segment(en('irlHud.map'), en('irlHud.maps.park')));
    expect(widgetUrl().searchParams.get('map')).toBe('park');
  });

  it('saves named places from coordinates or a search, and orders and removes them', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify([
            { lat: '41.0256149', lon: '28.9741658', display_name: 'Galata Tower, Istanbul' },
          ]),
        ),
      );
    vi.stubGlobal('fetch', fetchMock);
    const user = await openPage();
    await user.click(segment(en('irlHud.map'), en('irlHud.maps.real')));
    expect(screen.getByText(en('irlHud.placeNeeded'))).toBeTruthy();

    // Pasted coordinates are saved at once, under the typed name, without a search.
    await user.type(nameField(), 'park1');
    await user.type(findField(), '41.0082, 28.9784{Enter}');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(widgetUrl().searchParams.get('places')).toBe('park1:41.0082,28.9784');
    expect(nameField().value).toBe('');

    // A found place with no typed name is named after it.
    await user.type(findField(), 'galata');
    await user.click(button(en('irlHud.placeSearch')));
    await user.click(await screen.findByRole('button', { name: 'Galata Tower, Istanbul' }));
    expect(widgetUrl().searchParams.get('places')).toBe(
      'park1:41.0082,28.9784;galata-tower:41.02561,28.97417',
    );
    expect(screen.getAllByText(en('irlHud.placeStartsHere'))).toHaveLength(1);

    await user.click(button(en('irlHud.placeStartHereLabel', { name: 'galata-tower' })));
    expect(widgetUrl().searchParams.get('places')).toBe(
      'galata-tower:41.02561,28.97417;park1:41.0082,28.9784',
    );
    await user.click(button(en('irlHud.placeRemoveLabel', { name: 'park1' })));
    expect(widgetUrl().searchParams.get('places')).toBe('galata-tower:41.02561,28.97417');
  });

  it('turns down a name chat could not use, or one already taken', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = await openPage();
    await user.type(nameField(), 'two words');
    await user.type(findField(), '1, 2{Enter}');
    expect(screen.getByRole('alert').textContent).toBe(en('irlHud.placeNameInvalid'));
    expect(widgetUrl().searchParams.has('places')).toBe(false);

    await user.clear(nameField());
    await user.type(nameField(), 'park');
    await user.type(findField(), '{Enter}');
    expect(screen.getByRole('alert').textContent).toBe(en('irlHud.placeNameInvalid'));

    await user.clear(nameField());
    await user.type(nameField(), 'home');
    await user.type(findField(), '{Enter}');
    expect(widgetUrl().searchParams.get('places')).toBe('home:1,2');
    await user.type(nameField(), 'HOME');
    await user.type(findField(), '3, 4{Enter}');
    expect(screen.getByRole('alert').textContent).toBe(en('irlHud.placeNameTaken'));
    expect(widgetUrl().searchParams.get('places')).toBe('home:1,2');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('writes how the arrow starts moving', async () => {
    const user = await openPage();
    await user.click(segment(en('irlHud.move'), en('irlHud.moves.stay')));
    expect(widgetUrl().searchParams.get('move')).toBe('stay');
  });

  it('builds the market from item names and prices', async () => {
    const user = await openPage('irlHud.sectionMarket');
    expect(screen.getByText(en('irlHud.itemsEmpty'))).toBeTruthy();
    await user.type(textbox(en('irlHud.itemName')), 'water');
    await user.click(button(en('irlHud.itemAdd')));
    expect(widgetUrl().searchParams.get('items')).toBe('water:100');

    await user.type(textbox(en('irlHud.itemName')), '  Energy   Drink ');
    const price = textbox(en('irlHud.itemPrice'));
    await user.clear(price);
    await user.type(price, '250{Enter}');
    await user.click(button(en('irlHud.itemAdd')));
    expect(widgetUrl().searchParams.get('items')).toBe('water:100;Energy Drink:250');

    await user.type(textbox(en('irlHud.itemName')), 'WATER{Enter}');
    expect(screen.getByRole('alert').textContent).toBe(en('irlHud.itemNameTaken'));
    await user.clear(textbox(en('irlHud.itemName')));
    await user.type(textbox(en('irlHud.itemName')), '42{Enter}');
    expect(screen.getByRole('alert').textContent).toBe(en('irlHud.itemNameInvalid'));

    await user.click(button(en('irlHud.itemRemoveLabel', { name: 'water' })));
    expect(widgetUrl().searchParams.get('items')).toBe('Energy Drink:250');
  });

  it('says so when the search finds nothing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('[]')));
    const user = await openPage();
    await user.type(findField(), 'nowhere at all{Enter}');
    expect(await screen.findByText(en('irlHud.placeNone'))).toBeTruthy();
  });

  it('splits the settings into tabs under the channel boxes', async () => {
    await openPage('common.sectionAppearance');
    const keys: TranslationKey[] = [
      'common.sectionAppearance',
      'irlHud.sectionMap',
      'irlHud.sectionMoney',
      'irlHud.sectionMarket',
      'irlHud.sectionIntegrations',
    ];
    const list = screen.getByRole('tablist', { name: en('common.settingsSections') });
    const tabs = [...list.querySelectorAll('[role="tab"]')].map((tab) => tab.textContent);
    expect(tabs).toEqual(keys.map((key) => en(key)));
    expect(textbox(en('common.twitchChannel')).closest('[role="tabpanel"]')).toBeNull();
  });

  it('keeps a half-typed place search across a tab switch', async () => {
    const user = await openPage();
    await user.type(findField(), 'galata');
    await user.click(settingsTab(en('irlHud.sectionMarket')));
    await user.click(settingsTab(en('irlHud.sectionMap')));
    expect(findField().value).toBe('galata');
  });

  it('lists the indoor commands, and tries them in the preview with one button', async () => {
    await openPage();
    const commands = section(en('irlHud.sectionCommands'));
    expect(commands.textContent).toContain('!hud indoor');
    expect(commands.textContent).toContain(en('irlHud.cmdIndoor'));
    expect(commands.textContent).toContain('!hud outdoor');
    expect(button(en('irlHud.testIndoor')).disabled).toBe(false);
  });

  it('turns the indoor test off on a real place, which stays outdoors', async () => {
    const user = await openPage();
    await user.click(segment(en('irlHud.map'), en('irlHud.maps.real')));
    expect(button(en('irlHud.testIndoor')).disabled).toBe(true);
  });

  it("warns about the map's corner under both corner pickers", async () => {
    const user = await openPage('common.sectionAppearance');
    const warnings = () => screen.queryAllByText(en('irlHud.radarSameCorner'));
    expect(warnings()).toHaveLength(0);
    // The map starts bottom left, so moving the HUD there puts them in the same corner.
    await user.click(segment(en('irlHud.corner'), en('irlHud.corners.bl')));
    const hidden = warnings().map((warning) =>
      warning.closest('[role="tabpanel"]')?.hasAttribute('hidden'),
    );
    expect(hidden).toEqual([false, true]);
  });
});

describe('IRL HUD setup integrations', () => {
  const testFollow = () => button(en('irlHud.testFollow'));

  it('connects follows with a pasted Follower Goal URL, and writes the token and the cash', async () => {
    const user = await openPage('irlHud.sectionIntegrations');
    expect(testFollow().disabled).toBe(true);
    expect(widgetUrl().searchParams.has('token')).toBe(false);

    const paste = textbox(en('followConnection.paste'));
    await user.type(paste, 'two words');
    await user.click(button(en('followConnection.connect')));
    expect(screen.getByText(en('followConnection.invalid'))).toBeTruthy();

    await user.clear(paste);
    await user.click(paste);
    await user.paste('https://extensions.senchabot.com/widgets/follower-goal?token=abc123');
    await user.click(button(en('followConnection.connect')));
    expect(widgetUrl().searchParams.get('token')).toBe('abc123');
    expect(testFollow().disabled).toBe(false);

    const perFollow = textbox(en('irlHud.perFollow'));
    await user.clear(perFollow);
    await user.type(perFollow, '50');
    expect(widgetUrl().searchParams.get('follow')).toBe('50');

    await user.click(button(en('followConnection.disconnect')));
    expect(widgetUrl().searchParams.has('token')).toBe(false);
    expect(testFollow().disabled).toBe(true);
  });

  it('starts connected when the Dashboard opens it with a token', async () => {
    const user = setupUser();
    await renderRoute(`${PAGE}?token=xyz789`);
    await user.type(textbox(en('common.twitchChannel')), 'streamer');
    expect(widgetUrl().searchParams.get('token')).toBe('xyz789');
  });
});
