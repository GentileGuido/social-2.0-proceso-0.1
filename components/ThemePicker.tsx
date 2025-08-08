import React from 'react';
import { useTheme } from '../contexts/ThemeProvider';
import type { ThemeKey } from '../types/social';

const themes: ThemeKey[] = ['teal', 'pink', 'yellow', 'charcoal', 'red', 'green', 'blue'];

const themeColors: Record<ThemeKey, string> = {
  teal: '#0ea5b7',
  pink: '#f43f5e',
  yellow: '#f59e0b',
  charcoal: '#374151',
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
};

export const ThemePicker: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();

  const handleThemeChange = (theme: ThemeKey) => {
    console.log('Changing theme to:', theme);
    setTheme(theme);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Tema</h3>
      <div className="flex space-x-3">
        {themes.map((theme) => (
          <button
            key={theme}
            onClick={() => handleThemeChange(theme)}
            aria-pressed={currentTheme === theme}
            className={`
              w-10 h-10 rounded-full border-2 shadow-sm transition-all duration-200
              ${currentTheme === theme 
                ? 'ring-2 ring-offset-2 ring-black/60 scale-110' 
                : 'hover:scale-105'
              }
            `}
            style={{ 
              backgroundColor: themeColors[theme],
              borderColor: currentTheme === theme ? themeColors[theme] : '#e5e7eb'
            }}
            title={theme}
            aria-label={`Cambiar tema a ${theme}`}
          />
        ))}
      </div>
    </div>
  );
};
