import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import Constants from 'expo-constants'; // Import Constants

const { width, height } = Dimensions.get('window');

const MapComponent = ({
  region,
  handleRegionChange,
  handleMapPress,
  userPosition, 
  locationMarkers, 
  handleMarkerPress, 
  postFromFeed, 
  mapRef, 
  postDestination 
}) => {
  const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey; // Retrieve the API key

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={handleRegionChange}
        style={styles.map}
        zoomEnabled={true}
        ref={mapRef}
        onPress={handleMapPress}
      >
        {userPosition && (
          <Marker
            coordinate={{ latitude: userPosition.latitude, longitude: userPosition.longitude }}
            title="You are here"
            pinColor="red"
            style={{ zIndex: 1 }}
          />
        )}
        {locationMarkers.map(post => (
          <Marker
            key={post.id}
            coordinate={{ latitude: post.latitude, longitude: post.longitude }}
            pinColor="green"
            onPress={() => handleMarkerPress(post)}
          />
        ))}
        {postFromFeed && (
          <Marker
            key={postFromFeed.id}
            coordinate={{ latitude: postFromFeed.latitude, longitude: postFromFeed.longitude }}
            pinColor="purple"
            style={{ zIndex: 1 }}
            onPress={() => handleMarkerPress(postFromFeed)}
          />
        )}
        {postDestination && (
          <MapViewDirections
            origin={userPosition}
            destination={postDestination}
            apikey={GOOGLE_MAPS_API_KEY} // Use the API key here
            strokeColor="#6644ff"
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    width,
    height,
  },
});

export default MapComponent;
