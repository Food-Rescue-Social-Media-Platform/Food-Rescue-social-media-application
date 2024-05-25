import * as Location from 'expo-location';
import { ToastAndroid } from 'react-native';

export const hasPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
        return false;
    }
    return true;
};