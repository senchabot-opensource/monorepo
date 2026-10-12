import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { setupUser } from '#/test/render';
import { Tabs } from './tabs';

type Part = 'alpha' | 'beta' | 'gamma';

const TABS = [
  { value: 'alpha' as const, label: 'Alpha' },
  { value: 'beta' as const, label: 'Beta' },
  { value: 'gamma' as const, label: 'Gamma' },
];

function Picker({ keepMounted }: { keepMounted: boolean }) {
  const [part, setPart] = useState<Part>('alpha');
  return keepMounted ? (
    <Tabs
      tabs={TABS}
      value={part}
      onChange={setPart}
      label="Parts"
      panels={{
        alpha: <input aria-label="Alpha note" />,
        beta: <p>Beta panel</p>,
        gamma: <p>Gamma panel</p>,
      }}
    />
  ) : (
    <Tabs tabs={TABS} value={part} onChange={setPart} label="Parts">
      <p>{part} panel</p>
    </Tabs>
  );
}

const tab = (name: string) => screen.getByRole('tab', { name });
const panels = () => [...document.querySelectorAll<HTMLElement>('[role="tabpanel"]')];

describe('Tabs', () => {
  it('keeps every panel mounted, hides all but the picked one, and ties each to its tab', async () => {
    const user = setupUser();
    render(<Picker keepMounted />);
    expect(panels().map((panel) => panel.hidden)).toEqual([false, true, true]);
    for (const [index, panel] of panels().entries()) {
      const owner = tab(TABS[index].label);
      expect(owner.getAttribute('aria-controls')).toBe(panel.id);
      expect(panel.getAttribute('aria-labelledby')).toBe(owner.id);
    }

    await user.click(tab('Beta'));
    expect(panels().map((panel) => panel.hidden)).toEqual([true, false, true]);
    expect(tab('Beta').getAttribute('aria-selected')).toBe('true');
  });

  it('keeps what a hidden panel holds', async () => {
    const user = setupUser();
    render(<Picker keepMounted />);
    await user.type(screen.getByLabelText('Alpha note'), 'half typed');
    await user.click(tab('Gamma'));
    await user.click(tab('Alpha'));
    expect((screen.getByLabelText('Alpha note') as HTMLInputElement).value).toBe('half typed');
  });

  it('renders only the picked panel otherwise, under one id', async () => {
    const user = setupUser();
    render(<Picker keepMounted={false} />);
    expect(panels()).toHaveLength(1);
    const ids = new Set(TABS.map(({ label }) => tab(label).getAttribute('aria-controls')));
    expect([...ids]).toEqual([panels()[0].id]);

    await user.click(tab('Gamma'));
    expect(panels()[0].textContent).toBe('gamma panel');
  });

  it('moves and picks with the arrow keys, Home and End, wrapping at the ends', async () => {
    const user = setupUser();
    render(<Picker keepMounted />);
    tab('Alpha').focus();
    const picked = () => document.activeElement?.textContent;

    await user.keyboard('{ArrowLeft}');
    expect(picked()).toBe('Gamma');
    expect(tab('Gamma').getAttribute('aria-selected')).toBe('true');
    await user.keyboard('{ArrowRight}');
    expect(picked()).toBe('Alpha');
    await user.keyboard('{End}');
    expect(picked()).toBe('Gamma');
    await user.keyboard('{Home}');
    expect(picked()).toBe('Alpha');
    expect(panels().map((panel) => panel.hidden)).toEqual([false, true, true]);
  });
});
