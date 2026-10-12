import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { en, textbox, toggle } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

// Confetti draws on a canvas, which jsdom doesn't have.
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const OVERLAY = '/widgets/spin-wheel';
const OPTIONS = 'o=Zelda|Tetris|Mario';

const root = () => screen.getByTestId('spin-wheel');
const presetRadio = (id: string) =>
  document.querySelector(`input[type="radio"][value="${id}"]`) as HTMLInputElement;

afterEach(() => localStorage.clear());

describe('Spin Wheel overlay', () => {
  it('keeps the classic gold wheel without a preset or with an unknown one', async () => {
    await renderRoute(`${OVERLAY}?${OPTIONS}`);
    expect(root().dataset.preset).toBeUndefined();
    await renderRoute(`${OVERLAY}?${OPTIONS}&preset=gone`);
    expect(root().dataset.preset).toBeUndefined();
  });

  it("draws in a preset's look and loads its fonts", async () => {
    await renderRoute(`${OVERLAY}?${OPTIONS}&preset=blocks`);
    expect(root().dataset.preset).toBe('blocks');
    expect(document.querySelector('link[href*="family=Jersey+10"]')).not.toBeNull();
  });

  it('spins the sample options in the demo, which brings none of its own', async () => {
    await renderRoute(`${OVERLAY}?demo=1&preset=rift`);
    expect(root().dataset.preset).toBe('rift');
    expect(screen.queryByText(en('spinWheel.overlayNeedTwo'))).toBeNull();
  });
});

describe('Spin Wheel setup', () => {
  const urlField = () => textbox(en('spinWheel.overlayUrl'));

  it('puts the picked preset into the overlay URL, and classic takes it out', async () => {
    const user = setupUser();
    await renderRoute('/setup/spin-wheel');
    await user.type(textbox(en('common.twitchChannel')), 'streamer');
    expect(urlField().value).not.toContain('preset=');

    await user.click(presetRadio('storm'));
    expect(urlField().value).toContain('preset=storm');

    await user.click(presetRadio('classic'));
    expect(urlField().value).not.toContain('preset=');
  });

  it('loads the preset and two colors from a pasted URL', async () => {
    const user = setupUser();
    await renderRoute('/setup/spin-wheel');
    await user.click(urlField());
    await user.paste(
      `${window.location.origin}${OVERLAY}?twitch=s&${OPTIONS}&colors=2&preset=village`,
    );
    expect(presetRadio('village').checked).toBe(true);
    expect(toggle(en('spinWheel.twoColors')).getAttribute('aria-checked')).toBe('true');
  });

  it('turns Two colors on with a preset, keeps it between presets and turns it off for classic', async () => {
    const user = setupUser();
    await renderRoute('/setup/spin-wheel');
    await user.type(textbox(en('common.twitchChannel')), 'streamer');
    const twoColors = () => toggle(en('spinWheel.twoColors')).getAttribute('aria-checked');
    expect(twoColors()).toBe('false');

    await user.click(presetRadio('rift'));
    expect(twoColors()).toBe('true');
    expect(urlField().value).not.toContain('colors=');

    await user.click(toggle(en('spinWheel.twoColors')));
    expect(urlField().value).toContain('colors=all');
    await user.click(presetRadio('blocks'));
    expect(twoColors()).toBe('false');

    await user.click(presetRadio('classic'));
    expect(twoColors()).toBe('false');
    expect(urlField().value).not.toContain('colors=');
  });

  it('starts with Two colors on when the default preset is set', async () => {
    localStorage.setItem('preset', 'storm');
    await renderRoute('/setup/spin-wheel');
    expect(presetRadio('storm').checked).toBe(true);
    expect(toggle(en('spinWheel.twoColors')).getAttribute('aria-checked')).toBe('true');
  });

  it('puts the two-color wheel into the overlay URL', async () => {
    const user = setupUser();
    await renderRoute('/setup/spin-wheel');
    await user.type(textbox(en('common.twitchChannel')), 'streamer');
    expect(urlField().value).not.toContain('colors=');

    await user.click(toggle(en('spinWheel.twoColors')));
    expect(urlField().value).toContain('colors=2');
  });
});
