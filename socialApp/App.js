import React from "react";
import Providers from './navigation'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkModeProvider, useDarkMode } from './styles/DarkModeContext';

const App = () => {
  
  return (
      <SafeAreaProvider>
        <DarkModeProvider>
          <Providers/>
        </DarkModeProvider>
      </SafeAreaProvider>
  )
}

export default App;

