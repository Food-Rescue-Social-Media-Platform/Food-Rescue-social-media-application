import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../styles/colors';

import LoginScreen from '../screens/authenticationScreens/LoginScreen';
import SignUpScreen from '../screens/authenticationScreens/SignUpScreen';
import OnboardingScreen from '../screens/onboardingScreens/OnboardingScreen';
import ForgotMyPasswordScreen from '../screens/authenticationScreens/ForgotMyPasswordScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);
  let routeName;

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
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
    routeName = 'Onboarding';
  }
  else{
    routeName = 'Login';
  }

  return(
    <Stack.Navigator initialRouteName={routeName}>
        {Platform.OS === 'android' || Platform.OS === 'ios' ? (
        <Stack.Screen
            name = "Onboarding"
            component={OnboardingScreen}
            options={{header: () => null}}
        />
        ) : null}        
        <Stack.Screen
            name = "Login"
            component={LoginScreen}
            
            options={({navigation}) => ({
            title:'',
            headerStyle: {
            backgroundColor: '#f2f2f2',
            elevation: 0,
          },
          })}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={({navigation}) => ({
            title:'',
            headerStyle: {
            backgroundColor: '#f2f2f2',
            elevation: 0,
          },
          })}/>
          <Stack.Screen 
          name="ForgotMyPasswordScreen" 
          component={ForgotMyPasswordScreen} 
          options={({navigation}) => ({
            title:'',
            headerStyle: {
            backgroundColor: '#f2f2f2',
            elevation: 0,
          },
          })}/>
    </Stack.Navigator>
  );
};

export default AuthStack;

// Move the StyleSheet.create outside of the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
