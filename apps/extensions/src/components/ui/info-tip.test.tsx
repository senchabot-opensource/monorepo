import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '#/test/render';
import { InfoTip } from './info-tip';

const TEXT = 'Just the channel name, not the full link.';

async function renderTip(url = '/') {
  await renderWithProviders(
    <>
      <InfoTip text={TEXT} />
      <button type="button">Elsewhere</button>
    </>,
    url,
  );
  return screen.getByRole('button', { name: /^(More info|Daha fazla bilgi)$/ });
}

const tooltip = () => screen.queryByRole('tooltip');

describe('InfoTip', () => {
  it('is a button named in the page language', async () => {
    const button = await renderTip('/tr');
    expect(button.getAttribute('aria-label')).toBe('Daha fazla bilgi');
    expect(tooltip()).toBeNull();
  });

  it('shows the tooltip while the mouse is over it, and a click does not toggle it off', async () => {
    const user = userEvent.setup();
    const button = await renderTip();
    await user.hover(button);
    expect(tooltip()?.textContent).toBe(TEXT);
    expect(button.getAttribute('aria-describedby')).toBe(tooltip()?.id);

    await user.click(button);
    expect(tooltip()).not.toBeNull();

    await user.unhover(button);
    expect(tooltip()).toBeNull();
    expect(button.getAttribute('aria-describedby')).toBeNull();
  });

  it('shows on keyboard focus and hides on Escape and on blur', async () => {
    const user = userEvent.setup();
    const button = await renderTip();
    await user.tab();
    expect(document.activeElement).toBe(button);
    expect(tooltip()?.textContent).toBe(TEXT);

    await user.keyboard('{Escape}');
    expect(tooltip()).toBeNull();

    await user.tab({ shift: true });
    await user.tab();
    expect(tooltip()).not.toBeNull();
    await user.tab();
    expect(tooltip()).toBeNull();
  });

  it('toggles on tap, where there is no hover', async () => {
    const user = userEvent.setup();
    const button = await renderTip();
    await user.pointer({ keys: '[TouchA]', target: button });
    expect(tooltip()?.textContent).toBe(TEXT);
    await user.pointer({ keys: '[TouchA]', target: button });
    expect(tooltip()).toBeNull();
  });

  it('closes on a press outside', async () => {
    const user = userEvent.setup();
    const button = await renderTip();
    await user.pointer({ keys: '[TouchA]', target: button });
    await user.pointer({ keys: '[TouchA]', target: document.body });
    expect(tooltip()).toBeNull();
  });
});
