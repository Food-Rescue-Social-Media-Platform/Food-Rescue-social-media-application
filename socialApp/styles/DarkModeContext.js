import React, { createContext, useState, useContext } from 'react';
import { COLORS, DARKCOLORS } from './colors';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = isDarkMode ? DARKCOLORS : COLORS;

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode, theme }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
