import * as Location from "expo-location";
import { hasPermission } from "./hasPermission";

// the function to watch the location of the user
export const watchLocation = async (setPosition, setRegion = null) => {
    try{
        const hasLocationPermission = await hasPermission();
        if (!hasLocationPermission) {
            console.log("No location permission");
            return;
        }

        const locationSubscription = Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 10000,
                distanceInterval: 10,
            },
            (location) => {
                setPosition({ latitude: location.coords.latitude, longitude: location.coords.longitude });
                console.log("watchPosition, coords:", location.coords);
                if(setRegion) {
                    setRegion((prevRegion) => ({
                    ...prevRegion,
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }));
                }
                console.log("watchPosition, coords:", location.coords);
            }
        );

        return locationSubscription; // return the subscription to be able to stop it later
    } catch (error) {
        console.error("Error watching location:", error);
        return null;
    }
};