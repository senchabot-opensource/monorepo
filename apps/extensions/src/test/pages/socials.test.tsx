import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { buildSocialsUrl, DEFAULT_SOCIALS_SETTINGS } from '#/lib/socials-url';
import { en, segment, showPresetsButton, textbox } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const OVERLAY = '/widgets/socials';

const root = () => screen.getByTestId('socials');
const pill = () => screen.getByTestId('socials-pill');

afterEach(() => localStorage.clear());

describe('Socials overlay', () => {
  it('floats a round bubble in the middle by default, as before', async () => {
    await renderRoute(`${OVERLAY}?twitter=me&pillColor=%23112233`);
    expect(root().dataset.align).toBe('center');
    expect(root().dataset.preset).toBeUndefined();
    expect(pill().className).toContain('rounded-full');
    expect(pill().className).not.toMatch(/\b(left|right)-0\b/);
    expect(pill().style.backgroundColor).toBe('rgb(17, 34, 51)');
  });

  it.each([
    ['left', 'left-0', 'rounded-r-full'],
    ['right', 'right-0', 'rounded-l-full'],
  ])('sticks to the %s edge with square corners on that side', async (align, pin, radius) => {
    await renderRoute(`${OVERLAY}?twitter=me&align=${align}`);
    expect(root().dataset.align).toBe(align);
    const classes = pill().className.split(/\s+/);
    expect(classes).toContain(pin);
    expect(classes).toContain(radius);
    expect(classes).not.toContain('rounded-full');
  });

  it('reads an unknown align as center', async () => {
    await renderRoute(`${OVERLAY}?twitter=me&align=top`);
    expect(root().dataset.align).toBe('center');
  });

  it("draws the bubble in a preset's panel and colors instead of the color fields", async () => {
    await renderRoute(`${OVERLAY}?twitter=me&preset=rift&pillColor=%23112233&textColor=%23ff0000`);
    expect(root().dataset.preset).toBe('rift');
    expect(pill().style.backgroundColor).toBe('');
    expect(pill().style.color).not.toBe('rgb(255, 0, 0)');
    expect(pill().querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('cuts a preset bubble off at the edge it sticks to', async () => {
    await renderRoute(`${OVERLAY}?twitter=me&preset=realm&align=right`);
    expect(pill().style.clipPath).toBe('inset(-64px 0 -64px -64px)');
  });

  it("leaves the ornate frame's rivets and top gem off the bubble", async () => {
    await renderRoute(`${OVERLAY}?twitter=me&preset=realm`);
    expect(root().dataset.preset).toBe('realm');
    expect(pill().querySelector('[data-stud]')).toBeNull();
  });

  it('keeps the classic look for an unknown preset', async () => {
    await renderRoute(`${OVERLAY}?twitter=me&preset=gone`);
    expect(root().dataset.preset).toBeUndefined();
    expect(pill().className).toContain('rounded-full');
  });
});

describe('Socials setup', () => {
  const urlField = () => textbox(en('common.widgetUrl'));
  const presetRadio = (id: string) =>
    document.querySelector(`input[type="radio"][value="${id}"]`) as HTMLInputElement;

  it('puts the picked edge into the widget URL', async () => {
    const user = setupUser();
    await renderRoute('/setup/socials');
    await user.type(textbox('Twitter'), 'me');

    await user.click(segment(en('socials.align'), en('socials.aligns.left')));
    expect(urlField().value).toBe(
      buildSocialsUrl(window.location.origin, {
        ...DEFAULT_SOCIALS_SETTINGS,
        twitter: 'me',
        align: 'left',
      }),
    );
    expect(urlField().value).toContain('align=left');
  });

  it('hides the color fields while a preset is picked', async () => {
    const user = setupUser();
    await renderRoute('/setup/socials');
    expect(textbox(en('socials.pillColor'))).toBeTruthy();

    await user.click(showPresetsButton());
    await user.click(presetRadio('dynasty'));
    expect(screen.queryByLabelText(en('socials.pillColor'), { selector: 'input' })).toBeNull();
    expect(urlField().value).toContain('preset=dynasty');

    await user.click(presetRadio('classic'));
    expect(textbox(en('socials.pillColor'))).toBeTruthy();
    expect(urlField().value).not.toContain('preset=');
  });

  it('loads the edge and preset from a pasted URL', async () => {
    const user = setupUser();
    await renderRoute('/setup/socials');
    await user.click(urlField());
    await user.paste(`${window.location.origin}${OVERLAY}?twitter=me&align=right&preset=blocks`);
    expect(segment(en('socials.align'), en('socials.aligns.right')).checked).toBe(true);
    expect(presetRadio('blocks').checked).toBe(true);
  });
});
