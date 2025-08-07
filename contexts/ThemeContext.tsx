import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '../types';

const themes: Theme[] = [
  {
    name: 'C',
    colors: {
      primary: '#00B4D8',
      secondary: '#0077B6',
      accent: '#48CAE4',
      background: '#F0FDFF',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    name: 'M',
    colors: {
      primary: '#E91E63',
      secondary: '#C2185B',
      accent: '#F06292',
      background: '#FDF2F7',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    name: 'Y',
    colors: {
      primary: '#FFC107',
      secondary: '#FF8F00',
      accent: '#FFD54F',
      background: '#FFFDF0',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    name: 'K',
    colors: {
      primary: '#424242',
      secondary: '#212121',
      accent: '#757575',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    name: 'R',
    colors: {
      primary: '#F44336',
      secondary: '#D32F2F',
      accent: '#EF5350',
      background: '#FDF2F2',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    name: 'G',
    colors: {
      primary: '#4CAF50',
      secondary: '#388E3C',
      accent: '#66BB6A',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    name: 'B',
    colors: {
      primary: '#2196F3',
      secondary: '#1976D2',
      accent: '#42A5F5',
      background: '#F0F8FF',
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