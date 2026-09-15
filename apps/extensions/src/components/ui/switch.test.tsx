import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Switch } from './switch';

function Toggle({ disabled, initial = false }: { disabled?: boolean; initial?: boolean }) {
  const [checked, setChecked] = useState(initial);
  return <Switch label="Show badges" checked={checked} onChange={setChecked} disabled={disabled} />;
}

const toggle = () => screen.getByRole('switch', { name: 'Show badges' });

describe('Switch', () => {
  it('is a labelled role=switch button that reports its state', () => {
    render(<Toggle initial />);
    expect(toggle().tagName).toBe('BUTTON');
    expect(toggle().getAttribute('aria-checked')).toBe('true');
  });

  it('toggles from the button, its label and the keyboard', async () => {
    const user = userEvent.setup();
    render(<Toggle />);
    await user.click(toggle());
    expect(toggle().getAttribute('aria-checked')).toBe('true');
    await user.click(screen.getByText('Show badges'));
    expect(toggle().getAttribute('aria-checked')).toBe('false');
    await user.keyboard(' ');
    expect(toggle().getAttribute('aria-checked')).toBe('true');
  });

  it('stays put when disabled', async () => {
    const user = userEvent.setup();
    render(<Toggle disabled />);
    expect((toggle() as HTMLButtonElement).disabled).toBe(true);
    await user.click(toggle());
    await user.click(screen.getByText('Show badges'));
    expect(toggle().getAttribute('aria-checked')).toBe('false');
  });
});
