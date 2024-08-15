import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, DARKCOLORS } from './colors';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadDarkMode = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem('isDarkMode');
        // console.log('Loaded dark mode:', savedDarkMode);
        if (savedDarkMode !== null) {
          const parsedDarkMode = JSON.parse(savedDarkMode);
          // console.log('Parsed dark mode:', parsedDarkMode, typeof parsedDarkMode);
          setIsDarkMode(parsedDarkMode);
        }
      } catch (error) {
        console.error('Failed to load dark mode', error);
      }
    };

    loadDarkMode();
  }, []);

  const handleSetIsDarkMode = async (value) => {
    try {
      // console.log('handleSetIsDarkMode called with:', value, typeof value);
      if (typeof value === 'boolean') {
        // console.log('Saving dark mode:', value);
        await AsyncStorage.setItem('isDarkMode', JSON.stringify(value));
        setIsDarkMode(value);
      } else {
        console.error('Invalid value for dark mode:', value, typeof value);
      }
    } catch (error) {
      console.error('Failed to save dark mode', error);
    }
  };

  const theme = isDarkMode ? DARKCOLORS : COLORS;

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode: handleSetIsDarkMode, theme }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
