import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'nexora_theme';
const LEGACY_THEME_STORAGE_KEY = 'qr_studio_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
    return 'system';
  });

  const getSystemIsDark = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (saved === 'dark') return 'dark';
    if (saved === 'light') return 'light';
    return getSystemIsDark() ? 'dark' : 'light';
  });

  // Apply theme to document root
  const syncDocumentTheme = (mode: 'light' | 'dark') => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const evaluateAndApply = () => {
      let isDark = false;
      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'light') {
        isDark = false;
      } else {
        isDark = mediaQuery.matches;
      }

      const resolved = isDark ? 'dark' : 'light';
      setResolvedTheme(resolved);
      syncDocumentTheme(resolved);
    };

    evaluateAndApply();

    const systemChangeListener = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const resolved = e.matches ? 'dark' : 'light';
        setResolvedTheme(resolved);
        syncDocumentTheme(resolved);
      }
    };

    mediaQuery.addEventListener('change', systemChangeListener);
    return () => mediaQuery.removeEventListener('change', systemChangeListener);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {}

    let nextResolved: 'light' | 'dark';
    if (newTheme === 'dark') {
      nextResolved = 'dark';
    } else if (newTheme === 'light') {
      nextResolved = 'light';
    } else {
      nextResolved = getSystemIsDark() ? 'dark' : 'light';
    }

    setResolvedTheme(nextResolved);
    syncDocumentTheme(nextResolved);
  };

  const toggleTheme = () => {
    // Instant switch between dark and light
    const nextTheme: ThemeMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        resolvedTheme, 
        isDark: resolvedTheme === 'dark',
        setTheme, 
        toggleTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
