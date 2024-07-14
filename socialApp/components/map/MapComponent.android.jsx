import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';
import { Dimensions } from "react-native";

const MapComponent = ({ region, handleRegionChange, handleMapPress, position, locationMarkers, handleMarkerPress, postFromFeed, mapRef, style }) => (
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
      {position && (
        <Marker
          coordinate={{ latitude: position.latitude, longitude: position.longitude }}
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
    </MapView>
  </View>)
  
  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  map: {
    flex:1,
    ...StyleSheet.absoluteFillObject,
    height: Dimensions.get('window').height,  },
  });

  
  export default MapComponent;