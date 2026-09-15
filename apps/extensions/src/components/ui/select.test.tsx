import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MultiSelect } from './multi-select';
import { Select } from './select';

type Fruit = 'apple' | 'banana' | 'blueberry' | 'cherry';

const OPTIONS: { value: Fruit; label: string; hint?: string }[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', hint: 'yellow' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
];

function FruitSelect({ disabled, initial = 'apple' }: { disabled?: boolean; initial?: Fruit }) {
  const [value, setValue] = useState<Fruit>(initial);
  return (
    <>
      <span id="fruit-label">Fruit</span>
      <Select
        labelledBy="fruit-label"
        value={value}
        onChange={setValue}
        options={OPTIONS}
        disabled={disabled}
      />
      <output>{value}</output>
    </>
  );
}

const trigger = () => screen.getByRole('combobox', { name: /^Fruit/ });
const value = () => screen.getByRole('status').textContent;
const list = () => screen.queryByRole('listbox');
const activeOption = () =>
  document.getElementById(trigger().getAttribute('aria-activedescendant') ?? '')?.textContent;

afterEach(() => {
  vi.useRealTimers();
});

describe('Select', () => {
  it('names the trigger by its label and the current value', () => {
    render(<FruitSelect initial="banana" />);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(trigger().textContent).toBe('Bananayellow');
    expect(list()).toBeNull();
  });

  it('opens on click with the selected option marked, and a click picks an option', async () => {
    const user = userEvent.setup();
    render(<FruitSelect initial="blueberry" />);
    await user.click(trigger());

    const listbox = screen.getByRole('listbox');
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().getAttribute('aria-controls')).toBe(listbox.id);
    expect(within(listbox).getByRole('option', { selected: true }).textContent).toBe('Blueberry');
    expect(activeOption()).toBe('Blueberry');

    await user.click(within(listbox).getByRole('option', { name: 'Cherry' }));
    expect(value()).toBe('cherry');
    expect(list()).toBeNull();
    // The option swallows mousedown, so focus never leaves the trigger.
    expect(document.activeElement).toBe(trigger());
  });

  it('opens with ArrowDown, moves with the arrow keys, Home and End, and Enter commits', async () => {
    const user = userEvent.setup();
    render(<FruitSelect />);
    trigger().focus();
    await user.keyboard('{ArrowDown}');
    expect(list()).not.toBeNull();
    expect(activeOption()).toBe('Apple');

    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(activeOption()).toBe('Blueberry');
    await user.keyboard('{ArrowUp}');
    expect(activeOption()).toBe('Bananayellow');
    await user.keyboard('{End}{ArrowDown}');
    expect(activeOption()).toBe('Cherry');
    await user.keyboard('{Home}{ArrowUp}');
    expect(activeOption()).toBe('Apple');

    await user.keyboard('{ArrowDown}');
    expect(value()).toBe('apple');
    await user.keyboard('{Enter}');
    expect(value()).toBe('banana');
    expect(list()).toBeNull();
  });

  it('closes on Escape and on a press outside without changing the value', async () => {
    const user = userEvent.setup();
    render(<FruitSelect />);
    await user.click(trigger());
    await user.keyboard('{ArrowDown}{Escape}');
    expect(list()).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');

    await user.click(trigger());
    await user.click(document.body);
    expect(list()).toBeNull();
    expect(value()).toBe('apple');
  });

  it('closes on Tab so focus can move on', async () => {
    const user = userEvent.setup();
    render(<FruitSelect />);
    await user.click(trigger());
    await user.tab();
    expect(list()).toBeNull();
  });

  it('jumps to the next option starting with a typed letter, like a native select', async () => {
    // Only the clock: the typeahead window is measured with Date.now().
    vi.useFakeTimers({ toFake: ['Date'] });
    const user = userEvent.setup();
    render(<FruitSelect />);
    trigger().focus();

    await user.keyboard('b');
    expect(value()).toBe('banana');
    vi.advanceTimersByTime(600);
    await user.keyboard('b');
    expect(value()).toBe('blueberry');
    vi.advanceTimersByTime(600);
    await user.keyboard('b');
    expect(value()).toBe('banana');

    // Letters typed within half a second build one query.
    vi.advanceTimersByTime(600);
    await user.keyboard('bl');
    expect(value()).toBe('blueberry');

    vi.advanceTimersByTime(600);
    await user.keyboard('z');
    expect(value()).toBe('blueberry');
  });

  it('moves the highlight instead of the value when typing into the open list', async () => {
    const user = userEvent.setup();
    render(<FruitSelect />);
    await user.click(trigger());
    await user.keyboard('c');
    expect(activeOption()).toBe('Cherry');
    expect(value()).toBe('apple');
    await user.keyboard('{Enter}');
    expect(value()).toBe('cherry');
  });

  it('does not open or change when disabled', async () => {
    const user = userEvent.setup();
    render(<FruitSelect disabled />);
    expect((trigger() as HTMLButtonElement).disabled).toBe(true);
    await user.click(trigger());
    expect(list()).toBeNull();
    expect(value()).toBe('apple');
  });
});

type Provider = 'sevenTv' | 'bttv' | 'ffz';

function ProviderSelect() {
  const [value, setValue] = useState<Provider[]>(['sevenTv', 'ffz']);
  return (
    <>
      <span id="emotes-label">Emotes</span>
      <MultiSelect
        labelledBy="emotes-label"
        value={value}
        onChange={setValue}
        options={[
          { value: 'sevenTv', label: '7TV' },
          { value: 'bttv', label: 'BTTV' },
          { value: 'ffz', label: 'FFZ' },
        ]}
        summary={value.join(',') || 'none'}
      />
    </>
  );
}

describe('MultiSelect', () => {
  const multi = () => screen.getByRole('combobox', { name: /^Emotes/ });

  it('toggles options in option order and stays open', async () => {
    const user = userEvent.setup();
    render(<ProviderSelect />);
    expect(multi().textContent).toBe('sevenTv,ffz');
    await user.click(multi());

    const listbox = screen.getByRole('listbox');
    expect(listbox.getAttribute('aria-multiselectable')).toBe('true');
    const selected = within(listbox).getAllByRole('option', { selected: true });
    expect(selected.map((option) => option.textContent)).toEqual(['7TV', 'FFZ']);

    await user.click(within(listbox).getByRole('option', { name: 'BTTV' }));
    expect(multi().textContent).toBe('sevenTv,bttv,ffz');
    await user.click(within(listbox).getByRole('option', { name: '7TV' }));
    expect(multi().textContent).toBe('bttv,ffz');
    expect(screen.getByRole('listbox')).toBe(listbox);
  });

  it('toggles the highlighted option with Enter or Space and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<ProviderSelect />);
    multi().focus();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(multi().textContent).toBe('sevenTv,bttv,ffz');
    await user.keyboard(' ');
    expect(multi().textContent).toBe('sevenTv,ffz');

    await user.keyboard('{Escape}');
    expect(list()).toBeNull();
  });
});
