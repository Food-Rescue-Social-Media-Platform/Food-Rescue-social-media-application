import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
import MapScreen from '../screens/MapScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const FeedStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomePage"
      component={HomeScreen}
      options={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#2e64e5', // Blue color
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
          <View style={{ marginLeft: 15 }}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
        headerTitleStyle: {
          color: '#2e64e5',
        },
      }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#2e64e5',
        },
        headerStyle: {
          backgroundColor: '#f9fafd',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
  </Stack.Navigator>
);

const MapStack = () => (
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
          backgroundColor: '#f9fafd',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
  </Stack.Navigator>
);

const AppStack = () => {
  return (
    <Tab.Navigator initialRouteName="Home"
    screenOptions={{
      elevation: 0,
      
      tabBarStyle: {
        backgroundColor: '#f9fafd',
        elevation: 0,
        height:55,
        borderTopWidth: 0,

      },
      tabBarItemStyle:{
      marginBottom:10,
    },
      activeTintColor: 'green',
      inactiveTintColor: '#000',
    }}>
      <Tab.Screen
        name="HomeTab"
        component={FeedStack}
        options={({ route }) => ({
          tabBarLabel: 'Home',
          headerShown: false ,
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: '#000',
          tabBarIcon: ({ color, size }) => (
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
        options={({ route }) => ({
          tabBarLabel: 'Map',
          headerShown: false ,
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: '#000',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="map-marker-outline"
              color={color}
              size={25}
            />
          ),
        })}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagesScreen}
        options={({ route }) => ({
          tabBarLabel: 'Messages',
          headerShown: false ,
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: '#000',
          tabBarIcon: ({ color, size }) => (
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
        options={({ route }) => ({
          tabBarLabel: 'Profile',
          headerShown: false ,
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: '#000',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={25} />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

const RootStack = createStackNavigator();

const RootStackScreen = () => (
  <RootStack.Navigator>
    <RootStack.Screen name="Main" component={AppStack} options={{ headerShown: false }}/>
    <RootStack.Screen name="Chat" component={ChatScreen} />
  </RootStack.Navigator>
);

export default RootStackScreen;
