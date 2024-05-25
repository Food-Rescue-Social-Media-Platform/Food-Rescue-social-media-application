
// Function to slightly offset markers to avoid overlap
export const offsetMarkers = (markers) => {
    const offsetDistance = 0.0001; // adjust this value as needed
    return markers.map((marker, index) => {
        const offsetAngle = (index * 2 * Math.PI) / markers.length;
        const offsetLat = offsetDistance * Math.sin(offsetAngle);
        const offsetLng = offsetDistance * Math.cos(offsetAngle);
        return {
            ...marker,
            latitude: marker.latitude + offsetLat,
            longitude: marker.longitude + offsetLng,
        };
    });
};