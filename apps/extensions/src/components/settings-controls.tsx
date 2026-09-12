import { useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { LanguageSwitcher, ThemeToggle } from '#/components/site-controls';

export function SettingsControls() {
  const [mounted, setMounted] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Overlays render inside OBS browser sources; no settings controls there.
  if (!mounted || pathname.startsWith('/widgets/')) return null;

  return (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
}
