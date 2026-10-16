import { act, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { SiteFont } from '#/lib/site-fonts';
import { combobox, en, pickOption, showPresetsButton, toggle } from '#/test/queries';
import { renderWithProviders, setupUser } from '#/test/render';
import { PresetField } from './preset-field';
import { findPreset, PRESETS } from './registry';
import { writeSitePreset } from './site-preset';

const radio = (id: string) =>
  document.querySelector(`input[type="radio"][value="${id}"]`) as HTMLInputElement;
const grid = () => radio('classic').closest('fieldset') as HTMLFieldSetElement;
const hideButton = () =>
  screen.getByText(en('presets.field.hide')).closest('button') as HTMLButtonElement;
/** A Google Fonts stylesheet on the page, which the picker never needs. */
const googleFonts = () => document.querySelector('link[href*="fonts.googleapis.com"]');
const effects = () => toggle(en('presets.field.effects'));
const dice = () => screen.getByRole('button', { name: en('presets.field.random') });
const picked = () =>
  (document.querySelector('input[type="radio"]:checked') as HTMLInputElement).value;
const noEffects = () =>
  screen.queryByLabelText(en('presets.field.effects'), { selector: '[role="switch"]' }) === null;

/** A setup page in miniature; "Paste" stands in for a pasted URL bringing its own preset. */
function Picker({ initial, onFxChange }: { initial: string; onFxChange?: (on: boolean) => void }) {
  const [preset, setPreset] = useState(initial);
  const [fx, setFx] = useState<boolean | undefined>();
  return (
    <>
      <PresetField
        value={preset}
        onChange={setPreset}
        fx={fx}
        onFxChange={(on) => {
          setFx(on);
          onFxChange?.(on);
        }}
      />
      <button type="button" onClick={() => setPreset('blocks')}>
        Paste
      </button>
    </>
  );
}

const renderPicker = (initial: string, onFxChange?: (on: boolean) => void) =>
  renderWithProviders(<Picker initial={initial} onFxChange={onFxChange} />, '/setup/socials');

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('PresetField', () => {
  it('starts folded in the classic look', async () => {
    await renderPicker('classic');
    expect(grid().hidden).toBe(true);
    expect(showPresetsButton().getAttribute('aria-expanded')).toBe('false');
    expect(showPresetsButton().textContent).toContain(en('presets.classic'));
  });

  it('opens on a click and folds again on the next', async () => {
    const user = setupUser();
    await renderPicker('classic');
    await user.click(showPresetsButton());
    expect(grid().hidden).toBe(false);
    expect(hideButton().getAttribute('aria-expanded')).toBe('true');
    expect(hideButton().getAttribute('aria-controls')).toBe(grid().id);

    await user.click(hideButton());
    expect(grid().hidden).toBe(true);
    expect(showPresetsButton().getAttribute('aria-expanded')).toBe('false');
  });

  it('starts open when the widget has a preset, and names it when folded', async () => {
    const user = setupUser();
    await renderPicker('rift');
    expect(grid().hidden).toBe(false);
    expect(radio('rift').checked).toBe(true);

    await user.click(hideButton());
    expect(grid().hidden).toBe(true);
    // Just the name, in the page's font like the badges.
    const bar = showPresetsButton();
    expect(bar.textContent).toContain('Rift');
    expect(bar.textContent).not.toContain('League of Legends');
    expect(bar.querySelector('span')?.style.fontFamily).toBe('');
  });

  it('turns All presets into more overlays with the picked preset, in a new tab', async () => {
    const user = setupUser();
    await renderPicker('pizza');
    const href = (link: HTMLElement) => new URL(link.getAttribute('href') ?? '', 'https://x.test');
    // One link, where All presets was: none under the picker.
    expect(screen.getAllByRole('link')).toHaveLength(1);
    const more = screen.getByRole('link', { name: en('presets.field.seeMore', { name: 'Pizza' }) });
    expect(href(more).pathname).toBe('/presets');
    expect(href(more).searchParams.get('preset')).toBe('pizza');
    // Opening it in the same tab would lose what this page has set up.
    expect(more.getAttribute('target')).toBe('_blank');

    await user.click(radio('classic'));
    const all = screen.getByRole('link', { name: en('presets.field.browse') });
    expect(href(all).pathname).toBe('/presets');
    expect(href(all).search).toBe('');
    expect(all.getAttribute('target')).toBe('_blank');
  });

  it("shows every preset as a badge with only its name, all in the page's font", async () => {
    await renderPicker('rift');
    const badge = (id: string) => radio(id).closest('label') as HTMLLabelElement;
    for (const { data } of [{ data: { id: 'classic', name: en('presets.classic') } }, ...PRESETS]) {
      expect(badge(data.id).textContent).toBe(data.name);
      const name = badge(data.id).querySelector('span:not([aria-hidden])') as HTMLElement;
      expect(name.style.fontFamily).toBe('');
    }
    // So no preset font is loaded for them.
    expect(googleFonts()).toBeNull();
  });

  it('opens when a pasted URL brings a preset', async () => {
    const user = setupUser();
    await renderPicker('classic');
    await user.click(screen.getByText('Paste'));
    expect(grid().hidden).toBe(false);
    expect(radio('blocks').checked).toBe(true);
  });

  it('stays open when the pick goes back to classic', async () => {
    const user = setupUser();
    await renderPicker('rift');
    await user.click(radio('classic'));
    expect(radio('classic').checked).toBe(true);
    expect(grid().hidden).toBe(false);
  });

  it('still offers to make classic the default while folded', async () => {
    act(() => writeSitePreset('rift'));
    await renderPicker('classic');
    expect(grid().hidden).toBe(true);
    expect(
      screen.getByText(en('presets.field.makeDefault', { name: en('presets.classic') })),
    ).toBeTruthy();
  });

  it('offers no Effects switch for classic, and one for every game preset', async () => {
    const user = setupUser();
    await renderPicker('classic');
    expect(noEffects()).toBe(true);
    await user.click(showPresetsButton());
    await user.click(radio('rift'));
    expect(effects().getAttribute('aria-checked')).toBe('true');
  });

  it('shows the Effects switch, on, for a preset with an effect', async () => {
    const user = setupUser();
    await renderPicker('glitch');
    expect(effects().getAttribute('aria-checked')).toBe('true');
    await user.click(radio('banner'));
    expect(effects().getAttribute('aria-checked')).toBe('true');
    await user.click(radio('classic'));
    expect(noEffects()).toBe(true);
  });

  it('keeps the Effects switch in reach while the presets are folded', async () => {
    const user = setupUser();
    await renderPicker('glitch');
    await user.click(hideButton());
    expect(grid().hidden).toBe(true);
    expect(effects().getAttribute('aria-checked')).toBe('true');
  });

  it('turns the effect off, and on again', async () => {
    const user = setupUser();
    const changes: boolean[] = [];
    await renderPicker('glitch', (on) => changes.push(on));
    await user.click(effects());
    expect(changes).toEqual([false]);
    expect(effects().getAttribute('aria-checked')).toBe('false');
    await user.click(effects());
    expect(changes).toEqual([false, true]);
    expect(effects().getAttribute('aria-checked')).toBe('true');
  });
});

describe('PresetField dice', () => {
  it('picks another preset at random, never classic', async () => {
    const user = setupUser();
    await renderPicker('classic');
    for (let roll = 0; roll < 12; roll++) {
      const before = picked();
      await user.click(dice());
      expect(picked()).not.toBe(before);
      expect(picked()).not.toBe('classic');
    }
  });

  it('reaches the last preset, then moves off it', async () => {
    const user = setupUser();
    await renderPicker('classic');
    // The last of the others: from classic that is the last preset of all.
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    await user.click(dice());
    expect(picked()).toBe(PRESETS.at(-1)?.data.id);
    // From there it can't stay, so the same roll lands on the one before it.
    await user.click(dice());
    expect(picked()).toBe(PRESETS.at(-2)?.data.id);
  });

  it('leaves the swatches folded, or open, as they were', async () => {
    const user = setupUser();
    await renderPicker('classic');
    await user.click(dice());
    expect(grid().hidden).toBe(true);
    expect(showPresetsButton().textContent).toContain(
      PRESETS.find((entry) => entry.data.id === picked())?.data.name,
    );

    await user.click(showPresetsButton());
    await user.click(dice());
    expect(grid().hidden).toBe(false);
  });

  it('brings the Effects switch along with a preset that has one', async () => {
    const user = setupUser();
    await renderPicker('classic');
    expect(noEffects()).toBe(true);
    vi.spyOn(Math, 'random').mockReturnValue(0);
    await user.click(dice());
    expect(picked()).toBe('rift');
    expect(effects().getAttribute('aria-checked')).toBe('true');
  });
});

describe('PresetField font', () => {
  const fontBox = () =>
    screen.queryByLabelText(en('presets.field.font'), { selector: '[role="combobox"]' });
  const ownFonts = (name: string) => en('presets.field.presetFonts', { name });

  /** A setup page that offers the font box, as every one but the Chat Box's does. */
  function FontPicker({
    initial,
    onFont,
  }: {
    initial: string;
    onFont?: (font: SiteFont | undefined) => void;
  }) {
    const [preset, setPreset] = useState(initial);
    const [font, setFont] = useState<SiteFont | undefined>();
    return (
      <PresetField
        value={preset}
        onChange={setPreset}
        fx={undefined}
        onFxChange={() => {}}
        font={font}
        onFontChange={(next) => {
          setFont(next);
          onFont?.(next);
        }}
      />
    );
  }
  const renderFonts = (initial: string, onFont?: (font: SiteFont | undefined) => void) =>
    renderWithProviders(<FontPicker initial={initial} onFont={onFont} />, '/setup/socials');

  it("offers no font box for classic, and one on the preset's own fonts for a preset", async () => {
    const user = setupUser();
    await renderFonts('classic');
    expect(fontBox()).toBeNull();
    await user.click(showPresetsButton());
    await user.click(radio('banner'));
    expect(fontBox()?.textContent).toContain(ownFonts('Banner'));
  });

  it("draws the widget in a picked font, and goes back to the preset's own", async () => {
    const user = setupUser();
    const picks: (SiteFont | undefined)[] = [];
    await renderFonts('banner', (font) => picks.push(font));
    expect(screen.getByText(en('presets.field.owns', { name: 'Banner' }))).toBeTruthy();

    await pickOption(user, en('presets.field.font'), 'Roboto');
    expect(picks).toEqual(['roboto']);
    expect(fontBox()?.textContent).toContain('Roboto');
    // The preset now brings only its colors.
    expect(screen.getByText(en('presets.field.ownsColors', { name: 'Banner' }))).toBeTruthy();

    await pickOption(user, en('presets.field.font'), en('chatWidget.fontSystem'));
    await pickOption(user, en('presets.field.font'), ownFonts('Banner'));
    expect(picks).toEqual(['roboto', 'system', undefined]);
    expect(screen.getByText(en('presets.field.owns', { name: 'Banner' }))).toBeTruthy();
  });

  it("names the preset's own fonts, and a family it uses twice only once", async () => {
    const user = setupUser();
    await renderFonts('banner');
    const banner = findPreset('banner')?.data.fonts;
    await user.click(combobox(en('presets.field.font')));
    const own = () =>
      screen.getByRole('option', { name: (name) => name.startsWith(ownFonts('Banner')) });
    expect(own().textContent).toContain(`${banner?.display.family} + ${banner?.body.family}`);
  });

  it('lists one family for a preset drawn in a single one', async () => {
    const user = setupUser();
    await renderFonts('blocks');
    await user.click(combobox(en('presets.field.font')));
    const own = screen.getByRole('option', { name: (name) => name.startsWith(ownFonts('Blocks')) });
    expect(own.textContent).toContain('Jersey 10');
    expect(own.textContent).not.toContain('+');
  });

  it('has no font box where the page picks fonts itself, like the Chat Box', async () => {
    await renderPicker('banner');
    expect(fontBox()).toBeNull();
  });
});
