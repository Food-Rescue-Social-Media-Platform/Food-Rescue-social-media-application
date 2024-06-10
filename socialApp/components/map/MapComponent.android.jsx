import React from 'react';
import MapView, { Marker } from 'react-native-maps';


const MapComponent = ({ region, handleRegionChange, handleMapPress, position, locationMarkers, handleMarkerPress, postFromFeed, mapRef, style }) => (
  <MapView
      region={region}
      onRegionChangeComplete={handleRegionChange}
      style={style}
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
);

export default MapComponent;
