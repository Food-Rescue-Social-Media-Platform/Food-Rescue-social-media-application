import React, { useContext, useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../styles/colors';
import { database } from '../firebase';
import { AuthContext } from './AuthProvider';
import { doc, getDoc } from 'firebase/firestore';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View} from 'react-native';
import HomeScreen from '../screens/homeScreens/HomeScreen';
import HomeChat from '../screens/chatScreens/HomeChat';
import ProfileScreen from '../screens/profileScreens/ProfileScreen';
import MapScreen from '../screens/mapScreens/MapScreen';
import AddPostScreen from '../screens/createPostScreens/AddPostScreen';
import EditProfile from '../screens/profileScreens/EditProfile';
import SingleChat from '../screens/chatScreens/SingleChat';
import EditPostScreen from '../screens/editPost/EditPostScreen';
import FollowersList from '../screens/profileScreens/FollowersList';
import FollowingList from '../screens/profileScreens/FollowingList';
import AdminScreen from '../screens/AdminScreen'; // Import your AdminScreen component

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
          color: COLORS.blueHeaderText, // Blue color
        },
        headerStyle: {
          backgroundColor: COLORS.appBackGroundColor, // Set background color here
          shadowColor: COLORS.white,
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
          backgroundColor: COLORS.appBackGroundColor, // Set background color here
          shadowColor: COLORS.white,
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{ marginLeft: 15 }}>
            <Ionicons name="arrow-back" size={25} color= {COLORS.blueHeaderText} />
          </View>
        ),
        headerTitleStyle: {
          color: COLORS.blueHeaderText,
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
          color: COLORS.blueHeaderText,
        },
        headerStyle: {
          backgroundColor: COLORS.appBackGroundColor,
          shadowColor: COLORS.white,
          elevation: 0,
        },
      }}
    />
  </Stack.Navigator>
);

const ChatStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Chat"
      component={HomeChat}
      options={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: COLORS.blueHeaderText,
        },
        headerStyle: {
          backgroundColor: COLORS.appBackGroundColor,
          shadowColor: COLORS.white,
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
          color: COLORS.blueHeaderText,
        },
        headerStyle: {
          backgroundColor: COLORS.appBackGroundColor,
          shadowColor: COLORS.white,
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
          backgroundColor: COLORS.appBackGroundColor,
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
        tabBarActiveTintColor: COLORS.black,
        tabBarInactiveTintColor: COLORS.black,
        tabBarActiveBackgroundColor: COLORS.secondaryTheme,
        
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
          tabBarActiveTintColor: COLORS.black,
          tabBarInactiveTintColor: COLORS.black,
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
          tabBarActiveTintColor: COLORS.black,
          tabBarInactiveTintColor: COLORS.black,
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
        name="chatTab"
        component={ChatStack}
        options={({ route }) => ({
          tabBarLabel: 'Chat',
          tabBarLabelStyle: {
            fontWeight:'bold',
            fontSize:12,
          },
          headerShown: false ,
          tabBarActiveTintColor: COLORS.black,
          tabBarInactiveTintColor: COLORS.black,
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
          tabBarActiveTintColor: COLORS.black,
          tabBarInactiveTintColor: COLORS.black,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person-outline" color={color} size={28}/>
          ),
        })}
      />
    </Tab.Navigator>
  );
};

const RootStack = createStackNavigator();
const RootStackScreen = () => {
  const { user } = useContext(AuthContext); // Assuming you have access to the authenticated user
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUser = async (id) => {
    try {
        const docRef = doc(database, "users", id); // Use 'firestore' instead of 'database'
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return null;
        }
        return docSnap.data();
    } catch (error) {
        console.error("fetchUser, Error getting document:", error);
        return null;
    }
  }

  useEffect(() => {
    if (user) {
      fetchUser(user.uid).then((userData) => {
        if (userData && userData.isAdmin) {
          setIsAdmin(userData.isAdmin);
        }
      }).catch((error) => {
        console.error('Error fetching user data:', error);
      });
    }
  }, [user]);


  return (
    <RootStack.Navigator>
      {isAdmin ? (
        <RootStack.Screen name="Admin" component={AdminScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <RootStack.Screen name="Main" component={AppStack} options={{ headerShown: false }} />
          <RootStack.Screen name="Edit Profile" component={EditProfile} />
          <RootStack.Screen name="AddPost" component={AddPostScreen} options={{ headerShown: false}} />
          <RootStack.Screen
            name="SingleChat"
            component={SingleChat}
            options={({ route }) => ({
              title: route.params.receiverData.receiver,
              headerTitleAlign: 'center',
            })}
          />
          <RootStack.Screen name="Edit Post" component={EditPostScreen} />
          <RootStack.Screen name="Followers List" component={FollowersList} />
          <RootStack.Screen name="Following List" component={FollowingList} />
        </>
      )}
    </RootStack.Navigator>
  );
};

export default RootStackScreen;