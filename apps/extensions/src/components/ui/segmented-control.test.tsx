import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { SegmentedControl } from './segmented-control';

type Mode = 'calm' | 'chaos' | 'bounce';

function ModePicker({ disabled }: { disabled?: boolean }) {
  const [value, setValue] = useState<Mode>('calm');
  return (
    <>
      <span id="mode-label">Mode</span>
      <SegmentedControl
        labelledBy="mode-label"
        value={value}
        onChange={setValue}
        disabled={disabled}
        options={[
          { value: 'calm', label: 'Calm' },
          { value: 'chaos', label: 'Chaos' },
          { value: 'bounce', label: 'Bounce' },
        ]}
      />
      <output>{value}</output>
    </>
  );
}

const group = () => screen.getByRole('group', { name: 'Mode' });
const radio = (name: string) => within(group()).getByRole('radio', { name }) as HTMLInputElement;
const value = () => screen.getByRole('status').textContent;

describe('SegmentedControl', () => {
  it('is a labelled group of native radios sharing one name, one of them checked', () => {
    render(<ModePicker />);
    const radios = within(group()).getAllByRole('radio') as HTMLInputElement[];
    expect(radios.map((r) => r.value)).toEqual(['calm', 'chaos', 'bounce']);
    expect(new Set(radios.map((r) => r.name)).size).toBe(1);
    expect(radios.filter((r) => r.checked).map((r) => r.value)).toEqual(['calm']);
  });

  it('changes the value when a segment is clicked', async () => {
    const user = userEvent.setup();
    render(<ModePicker />);
    await user.click(screen.getByText('Chaos'));
    expect(value()).toBe('chaos');
    expect(radio('Chaos').checked).toBe(true);
    expect(radio('Calm').checked).toBe(false);
  });

  it('moves the value with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<ModePicker />);
    await user.click(screen.getByText('Calm'));
    expect(document.activeElement).toBe(radio('Calm'));

    await user.keyboard('{ArrowRight}');
    expect(value()).toBe('chaos');
    await user.keyboard('{ArrowDown}');
    expect(value()).toBe('bounce');
    await user.keyboard('{ArrowLeft}');
    expect(value()).toBe('chaos');
    expect(document.activeElement).toBe(radio('Chaos'));
  });

  it('ignores picks while the fieldset is disabled', async () => {
    const user = userEvent.setup();
    render(<ModePicker disabled />);
    expect((group() as HTMLFieldSetElement).disabled).toBe(true);
    expect(radio('Chaos').matches(':disabled')).toBe(true);
    await user.click(screen.getByText('Chaos'));
    expect(value()).toBe('calm');
  });
});
