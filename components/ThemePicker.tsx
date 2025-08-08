import React from 'react';
import { useTheme } from '../contexts/ThemeProvider';
import type { ThemeKey } from '../types/social';

const themes: ThemeKey[] = ['teal', 'pink', 'yellow', 'charcoal', 'red', 'green', 'blue'];

export const ThemePicker: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Tema</h3>
      <div className="flex space-x-3">
        {themes.map((theme) => (
          <button
            key={theme}
            onClick={() => setTheme(theme)}
            aria-pressed={currentTheme === theme}
            className={`
              h-10 w-10 rounded-full border shadow-sm transition-all duration-200
              ${currentTheme === theme 
                ? 'ring-2 ring-offset-2 ring-black/60' 
                : 'hover:scale-105'
              }
            `}
            style={{ background: `var(--color-${theme}, transparent)` }}
            title={theme}
            aria-label={`Cambiar tema a ${theme}`}
          />
        ))}
      </div>
    </div>
  );
};
