import React, {useState} from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import Chat from '../screens/chat/Chat';
import HomeChat from '../screens/chat/HomeChat';
import SingleChat from '../screens/chat/SingleChat';
import { Button } from 'react-native-elements';
 

const Stack = createStackNavigator();
const AppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='Chat' component={Chat} />
            <Stack.Screen name='HomeChat' component={HomeChat} />
            <Stack.Screen name='SingleChat' component={SingleChat}
                options={ ({route}) => ({
                    headerTitle: () => {
                        const receiverName = route.params?.receiverData?.firstName === ''? (route.params?.chatData?.name): (route.params?.receiverData?.firstName);
                        <Text>{receiverName}</Text>},
                })}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default AppStack;
