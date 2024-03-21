import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HomeChat from '../screens/chat/HomeChat';
import SingleChat from '../screens/chat/SingleChat';
import HomeScreen from '../screens/HomeScreen';
// import ChatScreen from '../screens/ChatScreen ';
import ProfileScreen from '../screens/ProfileScreen';
// import MessagesScreen from '../screens/MessagesScreen';
import MapScreen from '../screens/MapScreen';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

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
      name="Chat"
      component={HomeChat}
      options={({route}) => ({
        headerTitleAlign: 'center',
        // title: route.params.userName,
        headerBackTitleVisible: true,
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
      <Stack.Screen 
        name="SingleChat" 
        component={SingleChat} 
        options={({route}) => ({
          // title: route.params.userName,
          headerTitleAlign: 'center',
          headerTitleStyle: { // Blue color for the title
            color: '#2e64e5',
          },
          headerStyle: {
            backgroundColor: '#f9fafd', // Set background color here
            shadowColor: '#fff',
            elevation: 0,
          },
        })} 
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
const getTabBarVisibility = (route) => {
    const routeName = route.state
    ? route.state.routes[route.state.index].name
    : '';

    if (routeName === 'Chat') {
    return false;
    }
    return true;
};

return (
    <Tab.Navigator
    initialRouteName="Home"
  activeColor="black"
  inactiveColor="black"
  theme={{colors: {secondaryContainer: '#CEF0D3'}}}

  barStyle={{ backgroundColor: '#f9fafd' }}
    tabBarOptions={{
        activeTintColor: '#2e64e5',
    }}>
    <Tab.Screen
        name="HomeTab"
        component={FeedStack}
        options={({route}) => ({
        tabBarLabel: 'Home',
        // tabBarVisible: route.state && route.state.index === 0,
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
        tabBarVisible: getTabBarVisibility(route),
        // Or Hide tabbar when push!
        // https://github.com/react-navigation/react-navigation/issues/7677
        // tabBarVisible: route.state && route.state.index === 0,
        // tabBarLabel: 'Home',
        tabBarIcon: ({color, size}) => (
            <Ionicons
            name="chatbox-ellipses-outline"
            color={color}
            size={25}
            />
        ),
        tabBarVisible: true,

        })}
    />
    <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" 
            color='black' 
            size={25}
            />
        ),
        }}
    />
    </Tab.Navigator>
);
};
  
const styles = StyleSheet.create({})

export default AppStack;
