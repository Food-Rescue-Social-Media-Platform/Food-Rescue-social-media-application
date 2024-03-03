import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import OnboardingScreen from './screens/OnboardingScreen';

const AppStack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AppStack.Navigator headerShown="none">
        <AppStack.Screen name="Onboarding" component={OnboardingScreen}/>
        <AppStack.Screen name="Login" component={LoginScreen}/>
      </AppStack.Navigator>
    </NavigationContainer>
  );
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
