import 'intl-pluralrules';
import React, { useContext, useState, useEffect } from 'react';
import { View, Platform, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/homeScreens/HomeScreen';
import WebHomeScreen from '../screens/homeScreens/WebHomeScreen'; // Adjust the import path as necessary
import HomeChat from '../screens/chatScreens/HomeChat';
import ProfileScreen from '../screens/profileScreens/ProfileScreen';
import WebProfileScreen from '../screens/profileScreens/WebProfileScreen';
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
import { useDarkMode } from '../styles/DarkModeContext';
import CustomDrawerContent from './CustomDrawerContent';
import { AuthContext } from './AuthProvider';
import { database } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';
import SharePostScreen from '../screens/sharePostScreen/SharePostScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();



const FeedStack = ({ navigation, isHomeTabPressed }) => {
  const { isDarkMode } = useDarkMode();
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;
  // const { t } = useTranslation();

  const HomeComponent = Platform.OS === 'web' ? WebHomeScreen : HomeScreen;
  const ProfileComponent = Platform.OS === 'web' ? WebProfileScreen : ProfileScreen;

  console.log("FeedStack isHomeTabPressed:", isHomeTabPressed);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home Page"
        options={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: themeColors.headerColor,
          },
          headerStyle: {
            backgroundColor: themeColors.appBackGroundColor,
            shadowColor: themeColors.white,
            elevation: 0,
            opacity: 1
          },
          headerTitle: ()=>
            <View>
              <Image
                source={require('../assets/Images/logoHomePage.png')}
                resizeMode="contain"
                style={{ width: 180, height: 155}}
              />
          </View>
          ,
          headerLeft: () => (
            <Ionicons
              name="menu"
              size={25}
              color={themeColors.headerColor}
              style={{ marginLeft: 15 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      >
        {props => (
          <HomeComponent
            {...props}
            isHomeTabPressed={isHomeTabPressed}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="HomeProfile"
        component={ProfileComponent}
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
              <Ionicons name="arrow-back" size={25} color={themeColors.headerColor} />
            </View>
          ),
          headerTitleStyle: {
            color: themeColors.headerColor,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  const { isDarkMode } = useDarkMode();
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;
  // const { t } = useTranslation();

  const ProfileComponent = Platform.OS === 'web' ? WebProfileScreen : ProfileScreen;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileComponent}
        options={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: themeColors.headerColor,
          },
          headerTitle: ()=>
            <View>
              <Image
                source={require('../assets/Images/logoHomePage.png')}
                resizeMode="contain"
                style={{ width: 180, height: 155}}
              />
          </View>,
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
  const { isDarkMode } = useDarkMode();
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;
  // const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chat"
        component={HomeChat}
        options={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: themeColors.headerColor,
          },
          headerStyle: {
            backgroundColor: themeColors.appBackGroundColor,
            shadowColor: themeColors.white,
            elevation: 0,
          },
          headerTitle: ()=>
            <View>
              <Image
                source={require('../assets/Images/logoHomePage.png')}
                resizeMode="contain"
                style={{ width: 180, height: 155}}
              />
          </View>
        }}
      />
    </Stack.Navigator>
  );
};

const MapStack = () => {
  const { isDarkMode } = useDarkMode();
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;
  // const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: themeColors.headerColor,
          },
          headerStyle: {
            backgroundColor: themeColors.appBackGroundColor,
            shadowColor: themeColors.white,
            elevation: 0,
          },
          headerTitle: ()=>
            <View>
              <Image
                source={require('../assets/Images/logoHomePage.png')}
                resizeMode="contain"
                style={{ width: 180, height: 155}}
              />
          </View>,
        }}
      />
    </Stack.Navigator>
  );
};


const DrawerNavigator = ({ isHomeTabPressed }) => {
  const { isDarkMode } = useDarkMode();
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: themeColors.secondaryTheme,
        },
        drawerActiveTintColor: themeColors.headerColor,
        drawerInactiveTintColor: themeColors.primaryText,
        drawerActiveBackgroundColor: themeColors.secondaryTheme,
        drawerInactiveBackgroundColor: themeColors.appBackGroundColor,
      }}
    >
      <Drawer.Screen 
        name={t("Go Back")}
        options={{ headerShown: false }}
      >
        {props => (
          <FeedStack
            {...props}
            isHomeTabPressed={isHomeTabPressed}
          />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

const AppStack = () => {
  const { isDarkMode } = useDarkMode();
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;
  const { t } = useTranslation();
  const [isHomeTabPressed, setIsHomeTabPressed] = useState(false);

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
          options={{
            tabBarLabel: t('Home'),
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
          listeners={({ navigation, route }) => ({
            tabPress: e => {
              setIsHomeTabPressed(true);
              setTimeout(() => setIsHomeTabPressed(false), 1000); // Reset after 1 second
            },
          })}
        >
          {props => (
            <DrawerNavigator
              {...props}
              isHomeTabPressed={isHomeTabPressed}
            />
          )}
        </Tab.Screen>
        {Platform.OS !== 'web' && (
          <Tab.Screen
            name="MapTab"
            component={MapStack}
            options={{
              tabBarLabel: t('Map'),
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
        )}
        <Tab.Screen
          name="chatTab"
          component={ChatStack}
          options={{
            tabBarLabel: t('Chat'),
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
            tabBarLabel: t('Profile'),
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
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;

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
        <RootStack.Navigator>
          {isAdmin ? (
            <RootStack.Screen name="Admin" component={AdminScreen} options={{ headerShown: false }} />
          ) : (
            <>
              <RootStack.Screen name="Main" component={AppStack} options={{ headerShown: false }} />
              <RootStack.Screen
                name="Edit Profile"
                component={EditProfile}
                options={{
                  headerTitle: t("Edit Profile"),
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    color: themeColors.headerColor,
                  },
                  headerStyle: {
                    backgroundColor: themeColors.appBackGroundColor,
                    shadowColor: COLORS.white,
                    elevation: 0,
                  },
                  headerBackTitleVisible: false,
                  headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                      <Ionicons name="arrow-back" size={25} color={themeColors.headerColor} />
                    </View>
                  ),
                }}
              />
              <RootStack.Screen name="AddPost" component={AddPostScreen} options={{ headerShown: false }} />
              <RootStack.Screen
                name="SingleChat"
                component={SingleChat}
                options={({ route }) => ({
                  title: route.params.receiverData.receiver,
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    color: themeColors.headerColor,
                  },
                  headerStyle: {
                    backgroundColor: themeColors.appBackGroundColor,
                    shadowColor: COLORS.white,
                    elevation: 0,
                  },
                  headerBackTitleVisible: false,
                  headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                      <Ionicons name="arrow-back" size={25} color={themeColors.headerColor} />
                    </View>
                  ),
                })}
              />
              <RootStack.Screen
                name="SharePost"
                component={SharePostScreen}
                options={({ route }) => ({
                  headerTitle: t("post"),
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    color: themeColors.headerColor,
                  },
                  headerStyle: {
                    backgroundColor: themeColors.appBackGroundColor,
                    shadowColor: COLORS.white,
                    elevation: 0,
                  },
                  headerBackTitleVisible: false,
                  headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                      <Ionicons name="arrow-back" size={25} color={themeColors.headerColor} />
                    </View>
                  ),
                })}
              />
              <RootStack.Screen
                name="Edit Post"
                component={EditPostScreen}
                options={{
                  headerTitle: t("Edit Post"),
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    color: themeColors.headerColor,
                  },
                  headerStyle: {
                    backgroundColor: themeColors.appBackGroundColor,
                    shadowColor: COLORS.white,
                    elevation: 0,
                  },
                  headerBackTitleVisible: false,
                  headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                      <Ionicons name="arrow-back" size={25} color={themeColors.headerColor} />
                    </View>
                  ),
                }}
              />
              <RootStack.Screen
                name="Followers List"
                component={FollowersList}
                options={{
                  headerTitle: t("Followers List"),
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    color: themeColors.headerColor,
                  },
                  headerStyle: {
                    backgroundColor: themeColors.appBackGroundColor,
                    shadowColor: COLORS.white,
                    elevation: 0,
                  },
                  headerBackTitleVisible: false,
                  headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                      <Ionicons name="arrow-back" size={25} color={themeColors.headerColor} />
                    </View>
                  ),
                }}
              />
              <RootStack.Screen
                name="Following List"
                component={FollowingList}
                options={{
                  headerTitle: t("Following List"),
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    color: themeColors.headerColor,
                  },
                  headerStyle: {
                    backgroundColor: themeColors.appBackGroundColor,
                    shadowColor: COLORS.white,
                    elevation: 0,
                  },
                  headerBackTitleVisible: false,
                  headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                      <Ionicons name="arrow-back" size={25} color={themeColors.headerColor} />
                    </View>
                  ),
                }}
              />
              <RootStack.Screen
                name="Rating"
                component={Rating}
                options={{
                  headerTitle: t("Rating"),
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    color: themeColors.headerColor,
                  },
                  headerStyle: {
                    backgroundColor: themeColors.appBackGroundColor,
                    shadowColor: COLORS.white,
                    elevation: 0,
                  },
                  headerBackTitleVisible: false,
                  headerBackImage: () => (
                    <View style={{ marginLeft: 15 }}>
                      <Ionicons name="arrow-back" size={25} color={themeColors.headerColor} />
                    </View>
                  ),
                }}
              />
            </>
          )}
        </RootStack.Navigator>
    </I18nextProvider>
  );
};

export default RootStackScreen;
