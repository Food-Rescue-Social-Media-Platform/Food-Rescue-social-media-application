import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps';
import {Markers} from './temp/markers';
import { COLORS } from '../../styles/colors';


const INITIAL_REGION = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};


const MapScreen = () => {
    const [ location, setLocation ] = useState(null);
    const [ region , setRegion ] = useState(INITIAL_REGION);
    const mapRef = useRef(null);
    const navigation = useNavigation();
    const [errorMsg, setErrorMsg] = useState(null);

    
    useEffect(() => {
        (async () => {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          const newRegion = {
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
          };    
          console.log("newRegion: ", newRegion);
          setRegion(newRegion);
        })();
      }, []);

    return (
        <View style={styles.container}>
            <MapView 
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={region}
              onRegionChangeComplete={(region) => setRegion(region)}
              showUserLocation={true}
              showsMyLocationButton={true}
              ref={mapRef}
            >
                {
                    Markers?.map((marker, index) => (
                        <Marker
                            key={index}
                            coordinate={marker}
                            pinColor= {COLORS.themeColor}
                        />
                    ))
                }
            </MapView>
            <Text style={styles.text}>Current latitude: {region.latitude}</Text>
            <Text style={styles.text}>Current longitude: {region.longitude}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
        ...StyleSheet.absoluteFillObject,
    },
})

export default MapScreen;
