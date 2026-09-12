import { screen, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { type Locale, type TranslationKey, translate } from '#/lib/i18n';

/**
 * Finds the house form controls by the label a user sees. Label and text lookups, with the
 * role pinned by a selector: role queries with a name compute every accessible name on the
 * page, which costs ~100ms per query on a full setup page in jsdom.
 */

type Vars = Record<string, string | number>;

export const en = (key: TranslationKey, vars?: Vars) => translate('en', key, vars);
export const tr = (key: TranslationKey, vars?: Vars) => translate('tr', key, vars);
export const inLocale = (locale: Locale) => (key: TranslationKey, vars?: Vars) =>
  translate(locale, key, vars);

/** Text of every heading of one level, in page order. */
export const headings = (level: 1 | 2 | 3 | 4) =>
  [...document.querySelectorAll(`h${level}`)].map((heading) => heading.textContent);

/** The section a heading with this text labels. */
export function section(title: string) {
  const found = screen.getByText(title, { selector: 'h1, h2, h3' }).closest('section');
  if (!found) throw new Error(`No section is titled "${title}"`);
  return found as HTMLElement;
}

/** A text, URL or password input, by its <label>. */
export const textbox = (label: string) =>
  screen.getByLabelText(label, { selector: 'input' }) as HTMLInputElement;

/** A Select or MultiSelect trigger; its label is the first of its aria-labelledby ids. */
export const combobox = (label: string) =>
  screen.getByLabelText(label, { selector: '[role="combobox"]' }) as HTMLButtonElement;

export const toggle = (label: string) =>
  screen.getByLabelText(label, { selector: '[role="switch"]' }) as HTMLButtonElement;

export const slider = (label: string) =>
  screen.getByLabelText(label, { selector: 'input[type="range"]' }) as HTMLInputElement;

/** One segment of a SegmentedControl, found through the group's label. */
export function segment(groupLabel: string, option: string) {
  const group = screen.getByLabelText(groupLabel, { selector: 'fieldset' });
  return within(group).getByLabelText(option, {
    selector: 'input[type="radio"]',
  }) as HTMLInputElement;
}

/** The one button named `name`, by its aria-label or its own text. */
export function button(name: string) {
  const found = new Set([
    ...screen.queryAllByLabelText(name, { selector: 'button' }),
    ...screen.queryAllByText(name, { selector: 'button' }),
  ]);
  if (found.size !== 1) throw new Error(`Expected one "${name}" button, found ${found.size}`);
  return [...found][0] as HTMLButtonElement;
}

function openList(trigger: HTMLElement) {
  const list = document.getElementById(trigger.getAttribute('aria-controls') ?? '');
  if (!list) throw new Error('The list is not open');
  return list;
}

// Option names run the label and its hint together ("BTTVTwitch"), so match the start.
const optionNamed = (list: HTMLElement, option: string) =>
  within(list).getByRole('option', { name: (name) => name.startsWith(option) });

export async function pickOption(user: UserEvent, label: string, option: string) {
  const trigger = combobox(label);
  await user.click(trigger);
  await user.click(optionNamed(openList(trigger), option));
}

/** Ticks or unticks MultiSelect options, then closes the list. */
export async function toggleOptions(user: UserEvent, label: string, options: string[]) {
  const trigger = combobox(label);
  await user.click(trigger);
  for (const option of options) await user.click(optionNamed(openList(trigger), option));
  await user.keyboard('{Escape}');
}

/** The −/+ steppers next to a NumberField input. */
export function steppers(input: HTMLElement) {
  const box = input.parentElement as HTMLElement;
  return {
    minus: within(box).getByText('−', { selector: 'button' }) as HTMLButtonElement,
    plus: within(box).getByText('+', { selector: 'button' }) as HTMLButtonElement,
  };
}

/** Replaces a text input's value by typing, the way a user edits it. */
export async function retype(user: UserEvent, input: HTMLElement, text: string) {
  await user.clear(input);
  if (text) await user.type(input, text);
}
