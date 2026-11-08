import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, ThemeColors } from '../theme';

interface ThemeContextType {
  isDarkMode: boolean;
  theme: ThemeColors;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = '@notes_app_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved !== null) {
          setIsDarkMode(saved === 'dark');
        }
      } catch (err) {
        console.error('Error loading theme preference:', err);
      }
    };
    loadSavedTheme();
  }, []);

  const toggleTheme = useCallback(async () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      AsyncStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light').catch((err) =>
        console.error('Error saving theme preference:', err)
      );
      return next;
    });
  }, []);

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
