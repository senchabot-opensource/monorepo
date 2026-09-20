import { fireEvent, render, screen } from '@testing-library/react';
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

/**
 * jsdom gives every element a zero sized box, so the trigger and the panel get one each: the
 * trigger above, the panel below it with a gap in between, the way the header lays them out.
 */
const layOut = () => {
  const rect = (x: number, y: number, width: number, height: number) =>
    ({ left: x, right: x + width, top: y, bottom: y + height, x, y, width, height }) as DOMRect;
  trigger().getBoundingClientRect = () => rect(100, 0, 100, 40);
  (panel() as HTMLElement).getBoundingClientRect = () => rect(100, 70, 300, 200);
};

const movePointer = (clientX: number, clientY: number) =>
  fireEvent.pointerMove(document, { pointerType: 'mouse', clientX, clientY });

/** The tab going to the background: jsdom keeps visibilityState on the prototype. */
const hide = () => {
  const visibility = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
  Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
  fireEvent(document, new Event('visibilitychange'));
  if (visibility) Object.defineProperty(document, 'visibilityState', visibility);
};

describe('DropdownMenu', () => {
  it('keeps a hidden panel of links mounted, wired to the trigger', () => {
    render(<Menu />);
    expect(expanded()).toBe('false');
    expect(panel()?.hidden).toBe(true);
    expect(screen.queryByRole('link', { name: 'Chat Box' })).toBeNull();
  });

  it('opens on click and a second click leaves it open', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(trigger());
    expect(expanded()).toBe('true');
    expect(panel()?.hidden).toBe(false);
    expect(screen.getAllByRole('link')).toHaveLength(3);

    // Clicking a menu you just aimed at must not shut it under the cursor.
    await user.click(trigger());
    expect(expanded()).toBe('true');
  });

  it('opens when the mouse hovers the trigger and closes the moment it leaves', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.hover(trigger());
    expect(expanded()).toBe('true');

    layOut();
    movePointer(600, 400);
    expect(expanded()).toBe('false');
  });

  it('stays open in the gap between the trigger and the panel', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.hover(trigger());
    layOut();

    // Just under the trigger, on the way down to the panel, and just off its edge.
    movePointer(150, 55);
    expect(expanded()).toBe('true');
    movePointer(350, 200);
    expect(expanded()).toBe('true');
    movePointer(405, 200);
    expect(expanded()).toBe('true');
  });

  it('closes when the pointer moves to a neighbour in the same row', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.hover(trigger());
    layOut();

    // Beside the trigger, over the panel's columns but above the panel itself: the next nav
    // link sits there, and the gap between trigger and panel must not reach it.
    movePointer(350, 20);
    expect(expanded()).toBe('false');
  });

  it('closes on leaving even when a click, not a hover, opened it', () => {
    render(<Menu />);
    // The cursor was already resting on the trigger, so no pointerenter ever fires.
    fireEvent.pointerDown(trigger(), { pointerType: 'mouse' });
    fireEvent.click(trigger(), { detail: 1 });
    expect(expanded()).toBe('true');

    layOut();
    movePointer(600, 400);
    expect(expanded()).toBe('false');
  });

  it('lets a tap and the keyboard toggle it, having no hover to leave with', () => {
    render(<Menu />);
    fireEvent.pointerDown(trigger(), { pointerType: 'touch' });
    fireEvent.click(trigger(), { detail: 1 });
    expect(expanded()).toBe('true');
    fireEvent.pointerDown(trigger(), { pointerType: 'touch' });
    fireEvent.click(trigger(), { detail: 1 });
    expect(expanded()).toBe('false');

    // Enter on the focused button arrives as a click with no pointer behind it.
    fireEvent.click(trigger(), { detail: 0 });
    expect(expanded()).toBe('true');
    fireEvent.click(trigger(), { detail: 0 });
    expect(expanded()).toBe('false');
  });

  it('closes when the pointer leaves the page, which reports no move once it is gone', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.hover(trigger());
    expect(expanded()).toBe('true');

    // Straight up from the trigger into the browser's own chrome: every move until then was
    // still over the trigger, so only leaving the page says the menu was left.
    fireEvent.pointerLeave(document.documentElement);
    expect(expanded()).toBe('false');
  });

  it('closes when the tab goes to the background, so it is gone on the way back', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.hover(trigger());
    expect(expanded()).toBe('true');

    hide();
    expect(expanded()).toBe('false');
  });

  it('closes when another window takes the front', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.hover(trigger());
    fireEvent.blur(window);
    expect(expanded()).toBe('false');
  });

  it('leaves a tapped menu alone when the page goes away, having no hover to leave with', () => {
    render(<Menu />);
    fireEvent.pointerDown(trigger(), { pointerType: 'touch' });
    fireEvent.click(trigger(), { detail: 1 });

    hide();
    fireEvent.pointerLeave(document.documentElement);
    fireEvent.blur(window);
    expect(expanded()).toBe('true');
  });

  it('keeps a panel the keyboard has stepped into open, so focus is never stranded', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.hover(trigger());
    link('Emote Wall').focus();

    hide();
    fireEvent.pointerLeave(document.documentElement);
    expect(expanded()).toBe('true');
  });

  it('closes a clicked panel too once the pointer leaves it', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.hover(trigger());
    await user.click(trigger());
    expect(expanded()).toBe('true');

    layOut();
    movePointer(600, 400);
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
