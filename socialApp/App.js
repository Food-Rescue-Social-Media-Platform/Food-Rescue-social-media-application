import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/LoginScreen';
import OnboardingScreen from './screens/OnboardingScreen';

const AppStack = createStackNavigator();

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if(value == null){
        AsyncStorage.setItem('alreadyLaunched','true');
        setIsFirstLaunch(true);
      }
      else{
        setIsFirstLaunch(false);
      }
    })
  },[]);

  if(isFirstLaunch=== null){
    return null;
  }
  else if( isFirstLaunch === true){
    return (
      <NavigationContainer>
        <AppStack.Navigator 
          screenOptions={{
            headerShown: false
          }}
          >
          {Platform.OS === 'android' || Platform.OS === 'ios' ? (
            <AppStack.Screen name="Onboarding" component={OnboardingScreen}/>
          ) : null}
          <AppStack.Screen name="Login" component={LoginScreen}/>
        </AppStack.Navigator>
      </NavigationContainer>
    );
  }
  else{
    return <LoginScreen/>
  }
}

// Move the StyleSheet.create outside of the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
