import { getDistance } from "./getDistance";

export function calDistanceUserToPost(latitudeUser, longitudeUser, latitudePost, longitudePost, setDistance ){
    if (!latitudeUser || !longitudeUser || !latitudePost || !longitudePost) {
        return;
    }

    console.info('User location:', longitudeUser, latitudeUser);
    console.info('Post location:', longitudePost, latitudePost);

    const distance = getDistance(latitudeUser, longitudeUser, latitudePost , longitudePost);
    console.info('Distance:', distance);
    
    // Check if the distance is less than 1 km
    if (distance < 1) {
        const distanceInMeters = distance * 1000; // Convert to meters
        setDistance(`${distanceInMeters.toFixed(0)} m`);
    } else {
        setDistance(`${distance.toFixed(2)} km`);
    }
}