import { useEffect } from 'react';
import { useSettingsStore } from '../state/useSettingsStore';

export function useTheme() {
  const { theme, accentColor } = useSettingsStore((s) => s.settings);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
    root.style.setProperty('--accent-color', accentColor);
  }, [theme, accentColor]);
}
