import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  buildSubSproutUrl,
  DEFAULT_SUB_SPROUT_SETTINGS,
  type SubSproutSettings,
} from '#/lib/sub-sprout-url';
import { combobox, en, pickOption, segment, slider, textbox, toggle } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/sub-growing-plant';

const urlField = () => textbox(en('common.widgetUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
const kickField = () => textbox(en('common.kickChannel'));
const platforms = (option: string) => segment(en('common.platforms'), option);
const pick = (option: string) => segment(en('subSprout.selectionMode'), option);
const water = () => combobox(en('subSprout.wateringEffect'));
const potLabel = () => toggle(en('subSprout.showPotLabel'));

describe('Sub Sprout setup', () => {
  it('builds the widget URL from every kind of control', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    expect(urlField().value).toBe('');

    let settings: SubSproutSettings = { ...DEFAULT_SUB_SPROUT_SETTINGS };
    const expectUrl = (patch: Partial<SubSproutSettings>) => {
      settings = { ...settings, ...patch };
      expect(urlField().value).toBe(
        buildSubSproutUrl(window.location.origin, settings, 'Streamer', 'kicker'),
      );
    };

    await user.type(twitchField(), 'Streamer');
    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/sub-sprout-widget?twitch=streamer',
    );
    await user.type(kickField(), 'kicker');
    expectUrl({});

    await pickOption(user, en('subSprout.plantVariety'), en('plants.sunflower'));
    expectUrl({ variety: 'sunflower' });
    expect(combobox(en('subSprout.plantVariety')).textContent).toBe(
      `${en('plants.sunflower')}${en('subSprout.stagesSuffix', { stages: 7 })}`,
    );

    await pickOption(user, en('subSprout.wateringEffect'), en('plants.waterRain'));
    expectUrl({ water: 'rain' });

    await user.click(pick(en('subSprout.random')));
    expectUrl({ pick: 'random' });

    await user.click(toggle(en('subSprout.showSubCountEffect')));
    expectUrl({ countFx: false });
    await user.click(potLabel());
    expectUrl({ potLabel: true });

    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/sub-sprout-widget?twitch=streamer&kick=kicker' +
        '&variety=sunflower&pick=random&water=rain&countfx=0&potlabel=1',
    );
  });

  it('disables water and the pot label for a fixed Climbing Vine, which draws neither', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(twitchField(), 'streamer');

    await pickOption(user, en('subSprout.plantVariety'), en('plants.vine'));
    expect(pick(en('subSprout.fixed')).checked).toBe(true);
    expect(water().disabled).toBe(true);
    expect(potLabel().disabled).toBe(true);

    // In Order and Random never pick the vine next, so both settings apply again.
    await user.click(pick(en('subSprout.cycle')));
    expect(water().disabled).toBe(false);
    expect(potLabel().disabled).toBe(false);

    await user.click(pick(en('subSprout.fixed')));
    await pickOption(user, en('subSprout.plantVariety'), en('plants.rose'));
    expect(water().disabled).toBe(false);
    expect(potLabel().disabled).toBe(false);
  });

  it('speeds up only the preview, never the widget URL', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(twitchField(), 'streamer');
    const before = urlField().value;

    fireEvent.change(slider(en('subSprout.previewSpeed')), { target: { value: '3' } });

    expect(screen.getByText(en('subSprout.previewSpeedValue', { rate: 5 }))).toBeTruthy();
    expect(urlField().value).toBe(before);
  });

  it('disables the channel field of the platform that is not picked', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(twitchField(), 'streamer');
    await user.type(kickField(), 'kicker');

    await user.click(platforms('Twitch'));
    expect(kickField().disabled).toBe(true);
    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/sub-sprout-widget?twitch=streamer',
    );
    await user.click(platforms('Kick'));
    expect(twitchField().disabled).toBe(true);
    expect(urlField().value).toBe('http://localhost:3000/widgets/sub-sprout-widget?kick=kicker');
  });

  it('loads a pasted widget URL into the controls', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    const pasted = buildSubSproutUrl(
      window.location.origin,
      {
        platforms: 'twitch',
        variety: 'lotus',
        pick: 'cycle',
        water: 'sparkle',
        countFx: false,
        potLabel: true,
      },
      'streamer',
      '',
    );

    await user.click(urlField());
    await user.paste(pasted);

    expect(urlField().value).toBe(pasted);
    expect(twitchField().value).toBe('streamer');
    expect(platforms('Twitch').checked).toBe(true);
    expect(combobox(en('subSprout.plantVariety')).textContent).toContain(en('plants.lotus'));
    expect(water().textContent).toBe(en('plants.waterSparkle'));
    expect(pick(en('subSprout.cycle')).checked).toBe(true);
    expect(toggle(en('subSprout.showSubCountEffect')).getAttribute('aria-checked')).toBe('false');
    expect(potLabel().getAttribute('aria-checked')).toBe('true');
  });

  it('reads the old single-channel URLs and rebuilds them in the current format', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.click(urlField());
    await user.paste(
      'http://localhost:3000/widgets/sub-sprout-widget?channel=kicker&platform=kick&variety=vine',
    );
    expect(kickField().value).toBe('kicker');
    expect(platforms('Kick').checked).toBe(true);
    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/sub-sprout-widget?kick=kicker&variety=vine',
    );
  });

  it('flags a pasted URL it does not understand and changes nothing', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(twitchField(), 'streamer');
    const before = urlField().value;

    await user.click(urlField());
    await user.paste('sub sprout please');

    expect(urlField().getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText(en('subSprout.widgetUrlInvalid'))).toBeTruthy();
    expect(twitchField().value).toBe('streamer');
    await user.tab();
    expect(urlField().value).toBe(before);
  });
});
