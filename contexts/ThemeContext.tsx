import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '../types';

const themes: Theme[] = [
  {
    name: 'blue',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#60A5FA',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    name: 'green',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    name: 'red',
    colors: {
      primary: '#EF4444',
      secondary: '#DC2626',
      accent: '#F87171',
      background: '#FEF2F2',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('social-theme');
    if (savedTheme) {
      const theme = themes.find((t) => t.name === savedTheme);
      if (theme) {
        setCurrentTheme(theme);
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--color-primary-50', currentTheme.colors.primary + '0D');
    root.style.setProperty('--color-primary-100', currentTheme.colors.primary + '1A');
    root.style.setProperty('--color-primary-200', currentTheme.colors.primary + '33');
    root.style.setProperty('--color-primary-300', currentTheme.colors.primary + '4D');
    root.style.setProperty('--color-primary-400', currentTheme.colors.primary + '66');
    root.style.setProperty('--color-primary-500', currentTheme.colors.primary);
    root.style.setProperty('--color-primary-600', currentTheme.colors.secondary);
    root.style.setProperty('--color-primary-700', currentTheme.colors.secondary + 'CC');
    root.style.setProperty('--color-primary-800', currentTheme.colors.secondary + '99');
    root.style.setProperty('--color-primary-900', currentTheme.colors.secondary + '66');
  }, [currentTheme]);

  const setTheme = (themeName: string) => {
    const theme = themes.find((t) => t.name === themeName);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('social-theme', themeName);
    }
  };

  const value: ThemeContextType = {
    currentTheme,
    themes,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}; 