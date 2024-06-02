import * as Location from 'expo-location';
import { Platform, Alert, ToastAndroid } from 'react-native';

export const hasPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        if (Platform.OS === 'android') {
            ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
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
