import React, { useEffect, useRef, useState, useContext } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ToastAndroid,
    PermissionsAndroid,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import GeoLocation from 'react-native-geolocation-service';
import { AuthContext } from '../../navigation/AuthProvider';
import { getDoc, doc } from 'firebase/firestore';
import { database } from '../../firebase';
import locations from './temp/locations.json'

const MapScreen = () => {
  const { user } = useContext(AuthContext);
  const mapRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [locationMarkers, setLocationMarkers] = useState([]);
  const navigation = useNavigation();
  const interval = useRef(null);

  const hasPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version < 23) {
          return true;
      }

      const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (hasPermission) {
          return true;
      }

      const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
      }

      if (status === PermissionsAndroid.RESULTS.DENIED) {
          ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
      } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
      }

      return false;
  };

  const getLocation = async () => {
      const userConnected = await fetchUser(user.uid);
      if (!userConnected) {
          console.error('User not found in database');
          return;
      }
      if(userConnected.location) {
          setPosition(userConnected.location);
          return;
      }
      const hasLocationPermission = await hasPermission();
      if (!hasLocationPermission) {
          console.log('Permission denied by user');
          return;
      }
      console.log('Permission granted by user');

      try {
          GeoLocation.getCurrentPosition(
              ({ coords }) => {
                  setPosition(coords);
                  console.log("getCurrentPosition, coords:", coords);
              },
              error => {
                  setPosition(null);
                  ToastAndroid.show(
                      "We couldn't fetch your location. Please check your device location service!",
                      ToastAndroid.LONG,
                  );
                  console.log(error);
              },
              {
                  accuracy: {
                      android: 'high',
                  },
                  enableHighAccuracy: false,
                  timeout: 30000,
                  maximumAge: 10000,
                  distanceFilter: 0,
                  forceRequestLocation: true,
                  forceLocationManager: false,
                  showLocationDialog: true,
              },
          );
      } catch (error) {
          console.error('Error getting location:', error);
      }
  };

  useEffect(() => {
      const focusListener = navigation.addListener('focus', () => {
          getLocation();
          setLocationMarkers(locations); 
      });

      return () => {
          focusListener();
          clearInterval(interval.current);
      };
  }, [navigation]);

  useEffect(() => {
      const blurListener = navigation.addListener('blur', () => {
          clearInterval(interval.current);
          interval.current = null;
      });

      return () => {
          blurListener();
      };
  }, [navigation]);

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <View style={styles.container}>
              <MapView
                  region={{
                      latitude: position?.latitude || 32.0853,
                      longitude: position?.longitude || 34.7818,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                  }}
                  minZoomLevel={18}
                  style={{ flex: 1, opacity: 0.6 }}
                  onPress={(e) => setPosition(e.nativeEvent.coordinate)}
              >
                  {locationMarkers.map(location => (
                      <Marker
                          key={location.id}
                          coordinate={{
                              latitude: location.latitude,
                              longitude: location.longitude,
                          }}
                          title={location.title}
                      />
                  ))}
              </MapView>
          </View>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { height: '100%', width: '100%' },
  mainContainer: {
      height: '100%',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 48,
  },
  toggleContainer: {
      padding: 12,
      borderWidth: 2,
      borderRadius: 28,
      borderColor: 'black',
      marginTop: 28,
      backgroundColor: 'pink',
  },
  toggleTitle: { fontSize: 16, fontWeight: 'bold' },
  bottomContainer: { justifyContent: 'space-between', alignItems: 'center' },
  avatarTitle: { fontSize: 28, color: 'yellow', fontWeight: 'bold' },
  avatarContainer: { backgroundColor: 'red' },
});

export default MapScreen;

const fetchUser = async (id) => {
  try {
      const docRef = doc(database, "users", id);
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