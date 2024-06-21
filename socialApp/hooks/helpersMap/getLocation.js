import * as Location from 'expo-location';
import { Platform, Alert } from 'react-native';

let ToastAndroid;
if (Platform.OS === 'android') {
    ToastAndroid = require('react-native').ToastAndroid;
}

import { hasPermission } from './hasPermission';

export const getLocation = async (setPosition, setRegion = null) => {
    const hasLocationPermission = await hasPermission();

    if (!hasLocationPermission) {
        setPosition(null);
        if (setRegion) {
            setRegion(null);
        }
        // return null;
    }

    try {
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });
        setPosition({ latitude: location.coords.latitude, longitude: location.coords.longitude });
        if (setRegion) {
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
            // return true;
        }
    } catch (error) {
        if (Platform.OS === 'android') {
            ToastAndroid.show(
                "We couldn't fetch your location. Please check your device location service!",
                ToastAndroid.LONG,
            );
        } else if (Platform.OS === 'web') {
            alert("We couldn't fetch your location. Please check your device location service!");
        } else {
            Alert.alert(
                "Error",
                "We couldn't fetch your location. Please check your device location service!",
                [{ text: "OK" }]
            );
        }
    }
};
