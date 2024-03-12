import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import Chats from '../screens/chat/Chats';

const Stack = createStackNavigator();
const AppStack = () => {
    return (
        <Stack.Navigator>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Chats' component={Chats}/>
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default AppStack;
