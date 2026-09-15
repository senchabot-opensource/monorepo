import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { translate } from '#/lib/i18n';
import { renderWithProviders } from '#/test/render';
import { CopyUrlField } from './copy-url-field';

const URL = 'http://localhost:3000/widgets/chat-widget?twitch=streamer';
const t = (key: Parameters<typeof translate>[1], vars?: Record<string, string | number>) =>
  translate('en', key, vars);

const input = () => screen.getByRole('textbox', { name: 'Widget URL' }) as HTMLInputElement;
const copyButton = () =>
  screen.getByRole('button', { name: /^(Copy|Copied!)$/ }) as HTMLButtonElement;

// Paste-to-edit accepts any text starting with "http" and shows it back.
function EditableField() {
  const [url, setUrl] = useState(URL);
  return (
    <CopyUrlField
      url={url}
      onEdit={(text) => {
        if (!text.startsWith('http')) return false;
        setUrl(text);
        return true;
      }}
      invalidMessage="Not a widget URL"
    />
  );
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('CopyUrlField', () => {
  it('disables Copy until there is a URL', async () => {
    await renderWithProviders(<CopyUrlField url="" hint="Type a channel first" />);
    expect(copyButton().disabled).toBe(true);
    expect(input().value).toBe('');
    expect(input().readOnly).toBe(true);
    expect(screen.getByText('Type a channel first')).toBeTruthy();
  });

  it('copies the URL, says so, and shows the next steps with the recommended size', async () => {
    await renderWithProviders(
      <CopyUrlField url={URL} hint="Paste it into OBS" sourceSize={{ width: 400, height: 600 }} />,
    );
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await user.click(copyButton());
    expect(await navigator.clipboard.readText()).toBe(URL);
    expect(copyButton().textContent).toBe(t('common.copied'));
    expect(screen.getByText(t('common.nextSteps.title'))).toBeTruthy();
    expect(screen.getByText(t('common.nextSteps.size', { width: 400, height: 600 }))).toBeTruthy();
    expect(screen.getByText('Set the width to 400 and the height to 600.')).toBeTruthy();
    const testLink = screen.getByRole('link', { name: /Open the URL in a new tab/ });
    expect(testLink.getAttribute('href')).toBe(URL);
    expect(testLink.getAttribute('target')).toBe('_blank');
    // The steps replace the hint while they are open.
    expect(screen.queryByText('Paste it into OBS')).toBeNull();

    act(() => vi.advanceTimersByTime(2000));
    expect(copyButton().textContent).toBe(t('common.copy'));

    await user.click(screen.getByRole('button', { name: t('common.nextSteps.dismiss') }));
    expect(screen.queryByText(t('common.nextSteps.title'))).toBeNull();
    expect(screen.getByText('Paste it into OBS')).toBeTruthy();
  });

  it('uses custom next steps and leaves the size out for tools', async () => {
    const user = userEvent.setup();
    await renderWithProviders(<CopyUrlField url={URL} nextSteps={['Open it in a tab']} />);
    await user.click(copyButton());
    expect(await navigator.clipboard.readText()).toBe(URL);
    expect(screen.getByText('Open it in a tab')).toBeTruthy();
    expect(screen.queryByText(/Set the width/)).toBeNull();
  });

  it('selects the URL for a manual copy when the clipboard is blocked', async () => {
    await renderWithProviders(<CopyUrlField url={URL} />);
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('denied'));

    // fireEvent: user-event keeps its own selection model, which hides what select() did.
    await act(async () => {
      fireEvent.click(copyButton());
    });
    expect(input().selectionStart).toBe(0);
    expect(input().selectionEnd).toBe(URL.length);
    expect(copyButton().textContent).toBe(t('common.copy'));
    expect(screen.queryByText(t('common.nextSteps.title'))).toBeNull();
  });

  it('shows the page language', async () => {
    await renderWithProviders(<CopyUrlField url={URL} />, '/tr/setup/chat-widget');
    expect(screen.getByRole('textbox', { name: translate('tr', 'common.widgetUrl') })).toBeTruthy();
    expect(screen.getByRole('button', { name: translate('tr', 'common.copy') })).toBeTruthy();
  });

  it('applies pasted URLs it understands and flags anything else until blur', async () => {
    const user = userEvent.setup();
    await renderWithProviders(<EditableField />);
    expect(input().readOnly).toBe(false);

    await user.clear(input());
    await user.paste('not a url');
    expect(input().value).toBe('not a url');
    expect(input().getAttribute('aria-invalid')).toBe('true');
    const error = screen.getByText('Not a widget URL');
    expect(input().getAttribute('aria-describedby')).toBe(error.id);

    await user.tab();
    expect(input().value).toBe(URL);
    expect(input().getAttribute('aria-invalid')).toBe('false');

    const next = 'http://localhost:3000/widgets/chat-widget?twitch=other';
    await user.click(input());
    await user.clear(input());
    await user.paste(next);
    expect(input().value).toBe(next);
    expect(input().getAttribute('aria-invalid')).toBe('false');
  });
});
