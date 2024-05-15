import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';

const INITIAL_REGION = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};


const MapScreen = () => {
    const mapRef = useRef(null);
    const navigation = useNavigation();
    
    useEffect(() => {
        
    }, []);

    return (
        <View style={styles.container}>
            <MapView 
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={INITIAL_REGION}
              showUserLocation
              showsMyLocationButton
              ref={mapRef}
            />
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
    },
})

export default MapScreen;
