import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import { getThemeValues } from '../utils/themeUtils'; // Import from utils

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [mapStyle, setMapStyle] = useState(() => localStorage.getItem('mapStyle') || 'default');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('mapStyle', mapStyle);
  }, [mapStyle]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const setSpecificTheme = (newTheme) => ['light', 'dark', 'high-contrast'].includes(newTheme) && setTheme(newTheme);
  const setSpecificMapStyle = (newStyle) => ['default', 'satellite', 'terrain', 'night'].includes(newStyle) && setMapStyle(newStyle);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      mapStyle,
      toggleTheme, 
      setSpecificTheme,
      setSpecificMapStyle,
      themeValues: getThemeValues(theme)
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

