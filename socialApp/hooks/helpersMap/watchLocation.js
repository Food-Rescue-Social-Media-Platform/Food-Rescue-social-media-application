import * as Location from "expo-location";
import { hasPermission } from "./hasPermission";

// the function to watch the location of the user
export const watchLocation = async (setPosition, setRegion) => {
    const hasLocationPermission = await hasPermission();
    if (!hasLocationPermission) {
        return;
    }

    Location.watchPositionAsync(
        {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 10,
        },
        (location) => {
            setPosition({ latitude: location.coords.latitude, longitude: location.coords.longitude });
            setRegion((prevRegion) => ({
                ...prevRegion,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            }));
            console.log("watchPosition, coords:", location.coords);
        }
    );
};