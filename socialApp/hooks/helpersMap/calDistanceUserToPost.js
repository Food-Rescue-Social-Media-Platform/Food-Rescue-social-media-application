import { getDistance } from "./getDistance";

export function calDistanceUserToPost(latitudeUser, longitudeUser, latitudePost, longitudePost, setDistance ){
    if (!latitudeUser || !longitudeUser || !latitudePost || !longitudePost) {
        return;
    }
    const distance = getDistance(latitudeUser, longitudeUser, latitudePost , longitudePost);
    setDistance(distanceToString(distance))
}


const distanceToString = ( distance) => {
    const distanceRounded = roundToOneDecimal(distance/1000);
    return `${distanceRounded} km`
} 

function roundToOneDecimal(number) {
   return Math.round(number * 10) / 10;
}
