import { hasPermission } from "./hasPermission";
import { ToastAndroid} from 'react-native'
import * as Location from 'expo-location';

export const getLocation = async ( setPosition, setRegion ) => {
    const hasLocationPermission = await hasPermission();

    if (!hasLocationPermission) {
        console.log('Permission denied by user');
        return;
    }
    console.log('Permission granted by user');

    try {
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });
        setPosition({ latitude: location.coords.latitude, longitude: location.coords.longitude });
        setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
        console.log("getCurrentPosition, coords:", location.coords);
    } catch (error) {
        console.error('Error getting location:', error);
        ToastAndroid.show(
            "We couldn't fetch your location. Please check your device location service!",
            ToastAndroid.LONG,
        );
    }
};
