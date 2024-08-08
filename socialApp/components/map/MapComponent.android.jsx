import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');

const MapComponent = 
         ({ region,
            handleRegionChange,
            handleMapPress,
            userPosition, 
            locationMarkers, 
            handleMarkerPress, 
            postFromFeed, 
            mapRef, 
            postDestination 
          }) => 
 (
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
            coordinate={{ latitude: postFromFeed.latitude, longitude: postFromFeed.longitude }}
            pinColor="blue"
            title={postFromFeed.title}
            description={postFromFeed.description}
          />
        )}
        {postDestination && (
          <MapViewDirections
            origin={userPosition}
            destination={postDestination}
            apikey={'AIzaSyDsrEf0oqU7R84Ta6WvGf29klHMQbVBCJY'}
            strokeColor="#6644ff"
            strokeWidth={4}
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
      width,
      height,
    },
  });

  
  export default MapComponent;