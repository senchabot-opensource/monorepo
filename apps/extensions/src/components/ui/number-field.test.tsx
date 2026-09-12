import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { NumberField } from './number-field';

function Size({ initial = '18', disabled }: { initial?: string; disabled?: boolean }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <label htmlFor="size">Font size</label>
      <NumberField
        id="size"
        value={value}
        onChange={setValue}
        min={8}
        max={20}
        fallback={18}
        disabled={disabled}
      />
    </>
  );
}

const input = () => screen.getByLabelText('Font size') as HTMLInputElement;
const minus = () => screen.getByRole('button', { name: '−' }) as HTMLButtonElement;
const plus = () => screen.getByRole('button', { name: '+' }) as HTMLButtonElement;

describe('NumberField', () => {
  it('steps with the buttons and clamps to max and min', async () => {
    const user = userEvent.setup();
    render(<Size initial="19" />);
    await user.click(plus());
    expect(input().value).toBe('20');
    await user.click(plus());
    expect(input().value).toBe('20');

    await user.clear(input());
    await user.type(input(), '9');
    await user.click(minus());
    expect(input().value).toBe('8');
    await user.click(minus());
    expect(input().value).toBe('8');
  });

  it('steps with ArrowUp and ArrowDown in the input', async () => {
    const user = userEvent.setup();
    render(<Size />);
    await user.click(input());
    await user.keyboard('{ArrowUp}');
    expect(input().value).toBe('19');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(input().value).toBe('17');
  });

  it('lets the field sit empty or out of range while typing, keeping digits only', async () => {
    const user = userEvent.setup();
    render(<Size />);
    await user.clear(input());
    expect(input().value).toBe('');
    await user.type(input(), '1a2');
    expect(input().value).toBe('12');
    await user.clear(input());
    await user.type(input(), '99');
    expect(input().value).toBe('99');
  });

  it('steps from the fallback when the field is empty', async () => {
    const user = userEvent.setup();
    render(<Size />);
    await user.clear(input());
    await user.click(plus());
    expect(input().value).toBe('19');
  });

  it('disables the input and both steppers', () => {
    render(<Size disabled />);
    expect(input().disabled).toBe(true);
    expect(minus().disabled).toBe(true);
    expect(plus().disabled).toBe(true);
  });
});
