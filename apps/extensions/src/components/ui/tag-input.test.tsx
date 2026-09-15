import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { TagInput } from './tag-input';

function Users() {
  const [names, setNames] = useState<string[]>([]);
  return (
    <TagInput
      label="Usernames"
      items={names.map((name) => ({ id: name, content: name, removeLabel: `Remove ${name}` }))}
      onAdd={(name) =>
        setNames((current) => (current.includes(name) ? current : [...current, name]))
      }
      onRemove={(id) => setNames((current) => current.filter((name) => name !== id))}
      addLabel="Add"
      placeholder="username"
      emptyText="Nobody yet"
    />
  );
}

const input = () => screen.getByRole('textbox', { name: 'Usernames' }) as HTMLInputElement;
const addButton = () => screen.getByRole('button', { name: 'Add' }) as HTMLButtonElement;
const chips = () =>
  within(screen.getByRole('list', { name: 'Usernames' }))
    .getAllByRole('listitem')
    .map((item) => item.textContent);

describe('TagInput', () => {
  it('shows the empty text until something is added', () => {
    render(<Users />);
    expect(screen.getByText('Nobody yet')).toBeTruthy();
    expect(screen.queryByRole('list')).toBeNull();
    expect(addButton().disabled).toBe(true);
  });

  it('adds the trimmed text on Enter and on Add, then clears the input', async () => {
    const user = userEvent.setup();
    render(<Users />);
    await user.type(input(), '  alice {Enter}');
    expect(chips()).toEqual(['alice']);
    expect(input().value).toBe('');

    await user.type(input(), 'bob');
    expect(addButton().disabled).toBe(false);
    await user.click(addButton());
    expect(chips()).toEqual(['alice', 'bob']);
    expect(screen.queryByText('Nobody yet')).toBeNull();
  });

  it('ignores blank input', async () => {
    const user = userEvent.setup();
    render(<Users />);
    await user.type(input(), '   ');
    expect(addButton().disabled).toBe(true);
    await user.keyboard('{Enter}');
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('removes a chip with its labelled button and puts focus back in the input', async () => {
    const user = userEvent.setup();
    render(<Users />);
    await user.type(input(), 'alice{Enter}bob{Enter}');
    await user.click(screen.getByRole('button', { name: 'Remove alice' }));
    expect(chips()).toEqual(['bob']);
    expect(document.activeElement).toBe(input());
  });
});
