import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

const DARK_QUERY = '(prefers-color-scheme: dark)';

const THEME_COLORS: Record<Theme, string> = {
  light: '#fafafa',
  dark: '#09090b',
};

// Overlays stay theme-neutral. A color-scheme on an iframed overlay that no longer matches the
// embedding page (after a theme toggle) makes the browser paint an opaque backdrop behind it.
export const isOverlayPath = (pathname: string) => pathname.startsWith('/widgets/');

// Runs before first paint to avoid a flash of the wrong theme/language. Only overlays and tools
// take the language from ?lang= or storage; site pages render theirs from the path.
// Skips the theme on overlays (see isOverlayPath). The theme is the stored one if the visitor ever
// clicked the toggle, else the device's, which is what ThemeProvider resolves too: when the two
// disagreed, light-OS visitors flipped to dark at hydration.
export const THEME_INIT_SCRIPT = `(function(){try{var el=document.documentElement;var p=location.pathname;if(p.indexOf("/widgets/")===0||p.indexOf("/tools/")===0){var l=new URLSearchParams(location.search).get("lang")||localStorage.getItem("lang");if(l)el.lang=l}if(p.indexOf("/widgets/")===0)return;var s=localStorage.getItem("theme");var m=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)");var d=s==="light"?false:s==="dark"?true:!m||m.matches;el.classList.toggle("dark",d);el.style.colorScheme=d?"dark":"light";var m2=document.querySelector('meta[name="theme-color"]');if(m2)m2.setAttribute("content",d?"#09090b":"#fafafa")}catch(e){}})();`;

export function applyTheme(theme: Theme) {
  if (isOverlayPath(window.location.pathname)) return;
  const el = document.documentElement;
  el.classList.toggle('dark', theme === 'dark');
  el.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
}

function darkMedia(): MediaQueryList | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.matchMedia?.(DARK_QUERY) ?? null;
  } catch {
    return null;
  }
}

/** The device theme. No matchMedia (old browsers) means no signal: keep the dark default. */
function readSystemTheme(): Theme {
  const media = darkMedia();
  return media && !media.matches ? 'light' : 'dark';
}

/** The theme the visitor picked with the toggle, or null while they still follow their device. */
function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage unavailable
  }
  return null;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initial state matches the SSR output; synced from storage and the device after hydration.
  const [stored, setStored] = useState<Theme | null>(null);
  const [systemTheme, setSystemTheme] = useState<Theme>('dark');
  const theme = stored ?? systemTheme;

  // The theme the inline script in __root already painted: the stored one, or the device's. The
  // SSR default must not be applied on mount, that flashed dark for a light theme.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const storedTheme = readStoredTheme();
      const deviceTheme = readSystemTheme();
      setStored(storedTheme);
      setSystemTheme(deviceTheme);
      applyTheme(storedTheme ?? deviceTheme);
      return;
    }
    applyTheme(theme);
  }, [theme]);

  // Until the visitor clicks the toggle the page follows the device, live: an OS that turns dark
  // in the evening turns the page with it, with no reload.
  useEffect(() => {
    if (stored) return;
    const media = darkMedia();
    if (!media) return;
    const sync = () => setSystemTheme(media.matches ? 'dark' : 'light');
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [stored]);

  const setTheme = useCallback((next: Theme) => {
    setStored(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
