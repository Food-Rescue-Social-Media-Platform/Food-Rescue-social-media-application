import 'intl-pluralrules';
import React, { useContext, useState, useEffect } from 'react';
import { Text, View, Switch } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
import AdminScreen from '../screens/adminScreens/AdminScreen';
import Rating from '../screens/profileScreens/Rating';
import { COLORS, DARKCOLORS } from '../styles/colors';
import { DarkModeProvider, useDarkMode } from '../styles/DarkModeContext';
import CustomDrawerContent from './CustomDrawerContent';
import { AuthContext } from './AuthProvider';
import { database } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const FeedStack = ({ navigation }) => {
  const { isDarkMode, theme } = useDarkMode();
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home Page"
        component={HomeScreen}
        options={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: themeColors.blueHeaderText,
          },
          headerStyle: {
            backgroundColor: themeColors.appBackGroundColor,
            shadowColor: themeColors.white,
            elevation: 0,
          },
          headerLeft: () => (
            <Ionicons
              name="menu"
              size={25}
              color={themeColors.blueHeaderText}
              style={{ marginLeft: 15 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="HomeProfile"
        component={ProfileScreen}
        options={{
          title: '',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: themeColors.appBackGroundColor,
            shadowColor: themeColors.white,
            elevation: 0,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <View style={{ marginLeft: 15 }}>
              <Ionicons name="arrow-back" size={25} color={themeColors.blueHeaderText} />
            </View>
          ),
          headerTitleStyle: {
            color: themeColors.blueHeaderText,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  const { isDarkMode, theme } = useDarkMode();
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: themeColors.blueHeaderText,
          },
          headerStyle: {
            backgroundColor: themeColors.appBackGroundColor,
            shadowColor: themeColors.white,
            elevation: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const ChatStack = () => {
  const { isDarkMode, theme } = useDarkMode();
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chat"
        component={HomeChat}
        options={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: themeColors.blueHeaderText,
          },
          headerStyle: {
            backgroundColor: themeColors.appBackGroundColor,
            shadowColor: themeColors.white,
            elevation: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const MapStack = () => {
  const { isDarkMode, theme } = useDarkMode();
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: themeColors.blueHeaderText,
          },
          headerStyle: {
            backgroundColor: themeColors.appBackGroundColor,
            shadowColor: themeColors.white,
            elevation: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  const { isDarkMode, theme } = useDarkMode();
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: themeColors.appBackGroundColor,
        },
      }}
    >
      <Drawer.Screen name="Go Back" component={FeedStack} />
    </Drawer.Navigator>
  );
};

const AppStack = () => {
  const { isDarkMode, theme } = useDarkMode();
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        elevation: 0,
        tabBarStyle: {
          backgroundColor: themeColors.appBackGroundColor,
          elevation: 0,
          height: 55,
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          marginBottom: 5,
          paddingBottom: 5,
          marginLeft: 12,
          marginRight: 12,
          borderRadius: 30,
          height: 52,
          width: 20,
        },
        tabBarActiveTintColor: themeColors.black,
        tabBarInactiveTintColor: themeColors.black,
        tabBarActiveBackgroundColor: themeColors.secondaryTheme,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={DrawerNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 12,
          },
          headerShown: false,
          tabBarActiveTintColor: themeColors.black,
          tabBarInactiveTintColor: themeColors.black,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapStack}
        options={{
          tabBarLabel: 'Map',
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 12,
          },
          headerShown: false,
          tabBarActiveTintColor: themeColors.black,
          tabBarInactiveTintColor: themeColors.black,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map-marker-outline" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="chatTab"
        component={ChatStack}
        options={{
          tabBarLabel: 'Chat',
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 12,
          },
          headerShown: false,
          tabBarActiveTintColor: themeColors.black,
          tabBarInactiveTintColor: themeColors.black,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="message-processing-outline" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 12,
          },
          headerShown: false,
          tabBarActiveTintColor: themeColors.black,
          tabBarInactiveTintColor: themeColors.black,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person-outline" color={color} size={28} />
          ),
        }}
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
  };

  useEffect(() => {
    if (user) {
      fetchUser(user.uid)
        .then((userData) => {
          if (userData && userData.isAdmin) {
            setIsAdmin(userData.isAdmin);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [user]);

  return (
    <I18nextProvider i18n={i18n}>
      <DarkModeProvider>
        <RootStack.Navigator>
          {isAdmin ? (
            <RootStack.Screen name="Admin" component={AdminScreen} options={{ headerShown: false }} />
          ) : (
            <>
              <RootStack.Screen name="Main" component={AppStack} options={{ headerShown: false }} />
              <RootStack.Screen name="Edit Profile" component={EditProfile} />
              <RootStack.Screen name="AddPost" component={AddPostScreen} options={{ headerShown: false }} />
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
              <RootStack.Screen name="Rating" component={Rating} />
            </>
          )}
        </RootStack.Navigator>
      </DarkModeProvider>
    </I18nextProvider>

  );
};

export default RootStackScreen;
