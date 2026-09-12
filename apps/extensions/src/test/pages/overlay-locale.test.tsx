import { waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { renderRoute } from '#/test/render';

// Own file: the overlay locale is read once per page load, i.e. once per module instance.
it('keeps the pre-redesign rule for overlays: Turkish anywhere in the browser list wins', async () => {
  // The chat demo logs its activity and the badge fetch failing offline.
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US', 'tr-TR']);
  await renderRoute('/widgets/chat-widget?mock=true');
  await waitFor(() => expect(document.documentElement.lang).toBe('tr'));
});
