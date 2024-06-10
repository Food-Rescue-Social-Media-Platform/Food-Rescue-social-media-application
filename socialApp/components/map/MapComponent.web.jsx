import React from 'react';
import { GoogleMap, useJsApiLoader, Marker as WebMarker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const MapComponent = ({ region, handleRegionChange, handleMapPress, position, locationMarkers, handleMarkerPress, postFromFeed }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={region}
      zoom={10}
      onClick={handleMapPress}
      onCenterChanged={() => handleRegionChange(region)}
    >
      {position && <WebMarker position={{ lat: position.latitude, lng: position.longitude }} title="You are here" />}
      {locationMarkers.map(post => (
        <WebMarker
          key={post.id}
          position={{ lat: post.latitude, lng: post.longitude }}
          onClick={() => handleMarkerPress(post)}
        />
      ))}
      {postFromFeed && (
        <WebMarker
          key={postFromFeed.id}
          position={{ lat: postFromFeed.latitude, lng: postFromFeed.longitude }}
          onClick={() => handleMarkerPress(postFromFeed)}
        />
      )}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
};

export default MapComponent;
