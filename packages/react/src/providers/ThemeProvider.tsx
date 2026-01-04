/**
 * Theme Provider for Werkcontext UI
 *
 * Optional provider that manages theme, mode, and density via data attributes.
 * Provides hooks for accessing and updating theme state.
 * Persists preferences to localStorage.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'werkcontext' | 'werkPress' | string;
export type Mode = 'light' | 'dark';
export type Density = 'comfortable' | 'compact';

export interface ThemeContextValue {
  theme: Theme;
  mode: Mode;
  density: Density;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
  setDensity: (density: Density) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultMode?: Mode;
  defaultDensity?: Density;
  storageKey?: string;
  attribute?: 'data-theme' | 'class';
}

/**
 * ThemeProvider - Manages theme state and applies data attributes
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme="werkcontext" defaultMode="light">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = 'werkcontext',
  defaultMode = 'light',
  defaultDensity = 'comfortable',
  storageKey = 'werk-ui-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    return (localStorage.getItem(`${storageKey}-theme`) as Theme) || defaultTheme;
  });

  const [mode, setModeState] = useState<Mode>(() => {
    if (typeof window === 'undefined') return defaultMode;
    return (localStorage.getItem(`${storageKey}-mode`) as Mode) || defaultMode;
  });

  const [density, setDensityState] = useState<Density>(() => {
    if (typeof window === 'undefined') return defaultDensity;
    return (localStorage.getItem(`${storageKey}-density`) as Density) || defaultDensity;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-mode', mode);
    root.setAttribute('data-density', density);
  }, [theme, mode, density]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(`${storageKey}-theme`, newTheme);
  };

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem(`${storageKey}-mode`, newMode);
  };

  const setDensity = (newDensity: Density) => {
    setDensityState(newDensity);
    localStorage.setItem(`${storageKey}-density`, newDensity);
  };

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextValue = {
    theme,
    mode,
    density,
    setTheme,
    setMode,
    setDensity,
    toggleMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * useTheme - Access theme context
 *
 * @example
 * ```tsx
 * const { theme, mode, setTheme, toggleMode } = useTheme();
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
