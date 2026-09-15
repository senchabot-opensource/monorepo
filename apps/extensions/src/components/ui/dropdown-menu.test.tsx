import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DropdownMenu } from './dropdown-menu';

function Menu() {
  return (
    <>
      <DropdownMenu label="Widgets" triggerClassName="">
        <a href="#chat">Chat Box</a>
        <a href="#emotes">Emote Wall</a>
        <a href="#sprout">Sub Sprout</a>
      </DropdownMenu>
      <button type="button">Outside</button>
    </>
  );
}

const trigger = () => screen.getByRole('button', { name: 'Widgets' });
const panel = () => document.getElementById(trigger().getAttribute('aria-controls') ?? '');
const expanded = () => trigger().getAttribute('aria-expanded');
const link = (name: string) => screen.getByRole('link', { name, hidden: true });

describe('DropdownMenu', () => {
  it('keeps a hidden panel of links mounted, wired to the trigger', () => {
    render(<Menu />);
    expect(expanded()).toBe('false');
    expect(panel()?.hidden).toBe(true);
    expect(screen.queryByRole('link', { name: 'Chat Box' })).toBeNull();
  });

  it('opens and closes on click', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(trigger());
    expect(expanded()).toBe('true');
    expect(panel()?.hidden).toBe(false);
    expect(screen.getAllByRole('link')).toHaveLength(3);

    await user.click(trigger());
    expect(expanded()).toBe('false');
  });

  it('opens with ArrowDown on the first link, and the arrows, Home and End move between links', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    trigger().focus();
    await user.keyboard('{ArrowDown}');
    expect(expanded()).toBe('true');
    expect(document.activeElement).toBe(link('Chat Box'));

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(link('Emote Wall'));
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(link('Sub Sprout'));
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(link('Chat Box'));
    await user.keyboard('{ArrowUp}');
    expect(document.activeElement).toBe(link('Sub Sprout'));
    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(link('Chat Box'));
  });

  it('closes on Escape and puts focus back on the trigger', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    trigger().focus();
    await user.keyboard('{ArrowDown}{ArrowDown}');
    await user.keyboard('{Escape}');
    expect(expanded()).toBe('false');
    expect(document.activeElement).toBe(trigger());
  });

  it('closes on a click outside', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(trigger());
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(expanded()).toBe('false');
  });

  it('closes when a link is clicked', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(trigger());
    await user.click(link('Emote Wall'));
    expect(expanded()).toBe('false');
  });

  it('closes when focus tabs out past the last link', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(trigger());
    await user.tab();
    expect(document.activeElement).toBe(link('Chat Box'));
    await user.tab();
    await user.tab();
    expect(expanded()).toBe('true');
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Outside' }));
    expect(expanded()).toBe('false');
  });
});
