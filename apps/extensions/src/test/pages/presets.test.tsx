import { describe, expect, it } from 'vitest';
import { en } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

/** The picker's radio for a preset id, in any language. */
function choice(id: string) {
  const radio = document.querySelector(`fieldset input[type="radio"][value="${id}"]`);
  if (!(radio instanceof HTMLInputElement)) throw new Error(`No preset ${id} in the picker`);
  return radio;
}

describe('presets page links', () => {
  it('opens on the preset a shared link names', async () => {
    await renderRoute('/presets?preset=blocks');
    expect(choice('blocks').checked).toBe(true);
    // The game it's made for follows the name in the same heading.
    const title = en('presets.previewTitle', { name: 'Blocks' });
    const heading = [...document.querySelectorAll('h2')].find((h2) =>
      h2.textContent?.startsWith(title),
    );
    // Every widget card under it opens its setup page on Blocks.
    const setups = [...(heading?.closest('section')?.querySelectorAll('a') ?? [])];
    expect(setups.length).toBeGreaterThan(0);
    for (const link of setups) expect(new URL(link.href).searchParams.get('preset')).toBe('blocks');
  });

  it('puts the picked preset in the address bar, so the page can be shared on it', async () => {
    const user = setupUser();
    await renderRoute('/tr/presets');
    await user.click(choice('rift'));
    expect(window.location.pathname).toBe('/tr/presets');
    expect(window.location.search).toBe('?preset=rift');

    // Classic too: a link without the param opens on the visitor's own default.
    await user.click(choice('classic'));
    expect(window.location.search).toBe('?preset=classic');
  });

  it('opens on Classic from a Classic link, whatever the default', async () => {
    window.localStorage.setItem('preset', 'pizza');
    await renderRoute('/presets?preset=classic');
    expect(choice('classic').checked).toBe(true);
    window.localStorage.removeItem('preset');
  });
});
