import { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';

class LocationManager {
  constructor() {
    this.locationObject = {
      latitude: 0,
      longitude: 0,
      timestamp: 0,
      accuracy: 0,
    };

    // Use state to manage location updates
    const [location, setLocation] = useState(this.locationObject);

    useEffect(() => {
      this.startLocationUpdates(setLocation);
    }, []); // Empty dependency array to run only once on component mount

    // Update internal state based on provided setter
    this.updateLocationObject = (newLocation) => setLocation(newLocation);
  }

  startLocationUpdates(setLocation) {
    Geolocation.watchPosition((position) => {
      this.updateLocationObject(position.coords); // Update state with new location data
      setLocation(position.coords); // Update state using provided setter
    }, (error) => {
      console.error('Location error:', error);
    });
  }

  getLocationObject() {
    return this.locationObject;
  }
}
