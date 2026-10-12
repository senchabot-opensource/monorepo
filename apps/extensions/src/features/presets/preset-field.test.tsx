import { act, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { en, showPresetsButton } from '#/test/queries';
import { renderWithProviders, setupUser } from '#/test/render';
import { PresetField } from './preset-field';
import { writeSitePreset } from './site-preset';

const radio = (id: string) =>
  document.querySelector(`input[type="radio"][value="${id}"]`) as HTMLInputElement;
const grid = () => radio('classic').closest('fieldset') as HTMLFieldSetElement;
const hideButton = () =>
  screen.getByText(en('presets.field.hide')).closest('button') as HTMLButtonElement;
const swatchFonts = () => document.querySelector('link[href*="text=Aa"]');

/** A setup page in miniature; "Paste" stands in for a pasted URL bringing its own preset. */
function Picker({ initial }: { initial: string }) {
  const [preset, setPreset] = useState(initial);
  return (
    <>
      <PresetField value={preset} onChange={setPreset} />
      <button type="button" onClick={() => setPreset('blocks')}>
        Paste
      </button>
    </>
  );
}

const renderPicker = (initial: string) =>
  renderWithProviders(<Picker initial={initial} />, '/setup/socials');

afterEach(() => localStorage.clear());

describe('PresetField', () => {
  it('starts folded in the classic look, without loading the swatch fonts', async () => {
    await renderPicker('classic');
    expect(grid().hidden).toBe(true);
    expect(showPresetsButton().getAttribute('aria-expanded')).toBe('false');
    expect(showPresetsButton().textContent).toContain(en('presets.classic'));
    expect(swatchFonts()).toBeNull();
  });

  it('opens on a click and folds again on the next', async () => {
    const user = setupUser();
    await renderPicker('classic');
    await user.click(showPresetsButton());
    expect(grid().hidden).toBe(false);
    expect(hideButton().getAttribute('aria-expanded')).toBe('true');
    expect(hideButton().getAttribute('aria-controls')).toBe(grid().id);
    expect(swatchFonts()).not.toBeNull();

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
    expect(showPresetsButton().textContent).toContain('Rift');
    expect(showPresetsButton().textContent).toContain('League of Legends');
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
});
