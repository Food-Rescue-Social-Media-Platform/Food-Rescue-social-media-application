import * as Location from 'expo-location';
import { Platform, Alert } from 'react-native';

let ToastAndroid;
if (Platform.OS === 'android') {
    ToastAndroid = require('react-native').ToastAndroid;
}

export const hasPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        if (Platform.OS === 'android') {
            ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
        } else if (Platform.OS === 'web') {
            alert('Location permission denied by user.');
        } else {
            Alert.alert(
                "Permission Denied",
                "Location permission denied by user.",
                [{ text: "OK" }]
            );
        }
        return false;
    }
    return true;
};
