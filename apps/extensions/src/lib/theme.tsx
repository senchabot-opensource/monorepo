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

const THEME_COLORS: Record<Theme, string> = {
  light: '#fafafa',
  dark: '#09090b',
};

// Overlays stay theme-neutral. A color-scheme on an iframed overlay that no longer matches the
// embedding page (after a theme toggle) makes the browser paint an opaque backdrop behind it.
export const isOverlayPath = (pathname: string) => pathname.startsWith('/widgets/');

// Runs before first paint to avoid a flash of the wrong theme/language. Only overlays and tools
// take the language from ?lang= or storage; site pages render theirs from the path.
// Skips the theme on overlays (see isOverlayPath). The theme is dark unless "light"
// is stored, as ThemeProvider reads it: following the OS here flipped light-OS visitors to dark
// at hydration.
export const THEME_INIT_SCRIPT = `(function(){try{var el=document.documentElement;var p=location.pathname;if(p.indexOf("/widgets/")===0||p.indexOf("/tools/")===0){var l=new URLSearchParams(location.search).get("lang")||localStorage.getItem("lang");if(l)el.lang=l}if(p.indexOf("/widgets/")===0)return;var d=localStorage.getItem("theme")!=="light";el.classList.toggle("dark",d);el.style.colorScheme=d?"dark":"light";var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",d?"#09090b":"#fafafa")}catch(e){}})();`;

export function applyTheme(theme: Theme) {
  if (isOverlayPath(window.location.pathname)) return;
  const el = document.documentElement;
  el.classList.toggle('dark', theme === 'dark');
  el.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
}

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage unavailable
  }
  return 'dark';
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initial state matches the SSR output; synced from storage after hydration.
  const [theme, setThemeState] = useState<Theme>('dark');

  // The stored theme, which the inline script in __root already painted. The SSR default must
  // not be applied on mount: that flashed dark for a stored light theme.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const stored = readStoredTheme();
      setThemeState(stored);
      applyTheme(stored);
      return;
    }
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
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
