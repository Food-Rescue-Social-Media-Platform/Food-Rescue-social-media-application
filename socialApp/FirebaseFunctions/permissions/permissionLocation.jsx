import { PermissionsAndroid } from 'react-native';

export const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'App needs access to your location to show your position on the map.',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission granted');
      // User granted permission, proceed with showing location
    } else {
      console.log('Location permission denied');
      // Handle permission denial (e.g., display an error message)
    }
  } catch (err) {
    console.error('Error requesting location permission:', err);
  }
};


