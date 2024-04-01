import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View} from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
import MapScreen from '../screens/MapScreen';
import EditProfile from '../screens/EditProfile';

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
      name="HomeProfile"
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

const MessageStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Messages"
      component={MessagesScreen}
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
    <Tab.Navigator 
      initialRouteName="Home"
      screenOptions={{
        elevation: 0,
        tabBarStyle: {
          backgroundColor: '#f9fafd',
          elevation: 0,
          height:55,
          borderTopWidth: 0,
        },
        tabBarItemStyle:{
          marginBottom:5,
          paddingBottom:5,
          marginLeft:12,
          marginRight:12,
          borderRadius:30,
          height:52,
          width:20,
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#000',
        tabBarActiveBackgroundColor:'#CEF0D3',
        
      }}>
      <Tab.Screen
        name="HomeTab"
        component={FeedStack}
        options={({ route }) => ({
          tabBarLabel: 'Home',
          tabBarLabelStyle: {
            fontWeight:'bold',
            fontSize:12,
          },
          headerShown: false ,
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#000',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={28}
            />
          ),
        })}
      />
      <Tab.Screen
        name="MapTab"
        component={MapStack}
        options={({ route }) => ({
          tabBarLabel: 'Map',
          tabBarLabelStyle: {
            fontWeight:'bold',
            fontSize:12,
          },
          headerShown: false ,
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#000',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="map-marker-outline"
              color={color}
              size={28}
            />
          ),
        })}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessageStack}
        options={({ route }) => ({
          tabBarLabel: 'Messages',
          tabBarLabelStyle: {
            fontWeight:'bold',
            fontSize:12,
          },
          headerShown: false ,
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#000',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="message-processing-outline"
              color={color}
              size={28}
            />
          ),
        })}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={({ route }) => ({
          tabBarLabel: 'Profile',
          tabBarLabelStyle: {
            fontWeight:'bold',
            fontSize:12,
          },
          headerShown: false ,
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#000',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person-outline" color={color} size={28}/>
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
    <RootStack.Screen name="Edit Profile" component={EditProfile} />

  </RootStack.Navigator>
);

export default RootStackScreen;
