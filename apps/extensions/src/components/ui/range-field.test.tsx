import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { RangeField } from './range-field';

function Opacity(props: {
  hideLabel?: boolean;
  layout?: 'stacked' | 'inline';
  disabled?: boolean;
}) {
  const [value, setValue] = useState('0.5');
  return (
    <>
      <RangeField
        {...props}
        label="Opacity"
        min={0}
        max={1}
        step={0.1}
        value={value}
        onChange={setValue}
        format={(n) => `${Math.round(n * 100)}%`}
      />
      <output>{value}</output>
    </>
  );
}

const slider = () => screen.getByRole('slider', { name: 'Opacity' }) as HTMLInputElement;

describe('RangeField', () => {
  it.each([
    ['stacked', {}],
    ['inline', { layout: 'inline' as const }],
    ['hidden-label', { hideLabel: true }],
  ])('names the slider by its label (%s layout)', (_, props) => {
    render(<Opacity {...props} />);
    expect(slider().min).toBe('0');
    expect(slider().max).toBe('1');
    expect(slider().step).toBe('0.1');
  });

  it('passes the native string value up and formats the readout', () => {
    render(<Opacity />);
    expect(slider().getAttribute('aria-valuetext')).toBe('50%');
    fireEvent.change(slider(), { target: { value: '0.8' } });
    expect(screen.getByRole('status').textContent).toBe('0.8');
    expect(slider().getAttribute('aria-valuetext')).toBe('80%');
    expect(screen.getByText('80%')).toBeTruthy();
  });

  it('can be disabled', () => {
    render(<Opacity disabled />);
    expect(slider().disabled).toBe(true);
  });
});
