import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen ';
import ProfileScreen from '../screens/ProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
import MapScreen from '../screens/MapScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const FeedStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomePage"
      component={HomeScreen}
      options={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#2e64e5', // Blue color
          // fontSize: 18,
        },
        headerStyle: {
          backgroundColor: '#f9fafd', // Set background color here
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#f9fafd', // Set background color here
          shadowColor: '#fff',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
        headerTitleStyle: { // Blue color for the title
          color: '#2e64e5',
        },
      }}
    />
  </Stack.Navigator>
);

const MessageStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Messages" 
      component={MessagesScreen} 
      options={{
        headerTitleAlign: 'center',
        headerTitleStyle: { // Blue color for the title
          color: '#2e64e5',
        },
        headerStyle: {
          backgroundColor: '#f9fafd', // Set background color here
          shadowColor: '#fff',
          elevation: 0,
        },
      }} 
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({route}) => ({
        headerTitleAlign: 'center',
        title: route.params.userName,
        headerBackTitleVisible: false,
        headerTitleStyle: { // Blue color for the title
          color: '#2e64e5',
        },
        headerStyle: {
          backgroundColor: '#f9fafd', // Set background color here
          shadowColor: '#fff',
          elevation: 0,
        },
      }
      )}
    />
  </Stack.Navigator>
);

const ProfileStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        headerTitleAlign: 'center',
        // headerShown: false,
        headerTitleStyle: { // Blue color for the title
          color: '#2e64e5',
        },
        headerStyle: {
          backgroundColor: '#f9fafd', // Set background color here
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
  </Stack.Navigator>
);

const MapStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Map"
      component={MapScreen}
      options={{

        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#2e64e5',
        },
        headerStyle: {
          backgroundColor: '#f9fafd', // Set background color here
          shadowColor: '#fff',
          elevation: 0,
        },
        
      }}
    />
  </Stack.Navigator>
);



const AppStack = () => {

return (
    <Tab.Navigator
    initialRouteName="Home">
    
    <Tab.Screen
        screenOptions={{headerShown:false}}
        name="HomeTab"
        component={FeedStack}
        options={({route}) => ({
        tabBarLabel: 'Home',
        headerShown: false ,
        tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
            name="home-outline"
            color={color}
            size={25}
            />
        ),
        })}
    />

    <Tab.Screen
      name="MapTab"
      component={MapStack}
      options={{
        tabBarLabel: 'Map',
        headerShown: false ,
        tabBarIcon: ({color, size}) => (
          <MaterialCommunityIcons
            name="map-marker-outline"
            color={color}
            size={25}
          />
        ),
        
      }}
    />

    <Tab.Screen
        name="MessagesTab"
        component={MessageStack}
        options={({route}) => ({
        tabBarLabel: 'Messages',
        headerShown: false ,

        tabBarIcon: ({color, size}) => (
            <Ionicons
            name="chatbox-ellipses-outline"
            color={color}
            size={25}
            />
        ),
        })}
    />
    <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={({route}) => ({
        tabBarLabel: 'Profile',
        headerShown: false ,
        tabBarStyle: {display: 'none'},
        
        tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" 
            color={color}
            size={25}
            />
        ),
        })}
    />
    </Tab.Navigator>
);
};
  
const styles = StyleSheet.create({})

export default AppStack;
