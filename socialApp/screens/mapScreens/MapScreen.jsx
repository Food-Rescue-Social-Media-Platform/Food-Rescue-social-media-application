import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet ,ActivityIndicator, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { getPostsNearby } from '../../FirebaseFunctions/collections/post';
import { getDistance } from '../../hooks/helpersMap/getDistance';
import { watchLocation } from '../../hooks/helpersMap/watchLocation';
import { getLocation } from '../../hooks/helpersMap/getLocation';
import Feather from 'react-native-vector-icons/Feather';
import PostModal from '../../components/map/PostModal';
import SearchAddress from '../../components/map/SearchAddress';

const MapScreen = () => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const mapRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [postDestination, setPostDestination] = useState(null);
  const [locationMarkers, setLocationMarkers] = useState([]);
  const [region, setRegion] = useState();
  const [loading, setLoading] = useState(false);
  const [locationFromSearch, setLocationFromSearch] = useState(null);
  const [postFromFeed, setPostFromFeed] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [MapComponent, setMapComponent] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null); // for watching location
  const [initialPostsLoaded, setInitialPostsLoaded] = useState(false);
  const radiusInMeters = 10000;

  useEffect(() => {
    const loadMapComponent = async () => {
      if (Platform.OS === 'web') {
        const module = await import('../../components/map/MapComponent.web');
        setMapComponent(() => module.default);
      } else {
        const module = await import('../../components/map/MapComponent.android');
        setMapComponent(() => module.default);
      }
    };

    loadMapComponent();
  }, []);

  const fetchPosts = async (pos) => {
    if (!pos) return;
    setLoading(true);
    try {
        const posts = await getPostsNearby([pos.latitude, pos.longitude], radiusInMeters, null, true);
        setLocationMarkers(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
    } finally {
        setLoading(false);
    }
  };

  const fetchLocation = async () => {
    setLoading(true);
    await getLocation(setPosition, setRegion);
    if(position){
      const subscription = await watchLocation(setPosition, setRegion);
      setLocationSubscription(subscription);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      setPostFromFeed(route.params ? route.params : null);
      fetchLocation();
    } else {
      resetStates();
    }
  }, [isFocused]);

  useEffect(() => {
    if (position && !initialPostsLoaded) {
      fetchPosts(position);
      setInitialPostsLoaded(true);
    } else if (position && region) {
      const distance = getDistance(region.latitude, region.longitude, position.latitude, position.longitude);
      if (distance > radiusInMeters) {
        setRegion({
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta
        });
        fetchPosts(position);
      }
    }
  }, [position, initialPostsLoaded]);

  useEffect(() => {
    if (postFromFeed && isFocused) {
      mapRef.current?.animateToRegion({
        latitude: postFromFeed.latitude,
        longitude: postFromFeed.longitude,
        latitudeDelta: 0.0001,
        longitudeDelta: 0.0001,
      }, 500);
    }
  }, [postFromFeed]);

  useEffect(() => {
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [locationSubscription]);

  useEffect(() => {
    if (position && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  }, [position]);

  const resetStates = () =>{
     setPostDestination(null);
     setLocationFromSearch(null);
     setPostFromFeed(null);
     setSelectedPost(null);
     setModalVisible(false);
  }

  const zoomIn = () => {
    if (mapRef.current) {
      const currentRegion = {
        ...region,
        latitudeDelta: region.latitudeDelta / 2,
        longitudeDelta: region.longitudeDelta / 2,
      };
      mapRef.current.animateToRegion(currentRegion, 500);
      setRegion(currentRegion);
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      const currentRegion = {
        ...region,
        latitudeDelta: region.latitudeDelta * 2,
        longitudeDelta: region.longitudeDelta * 2,
      };
      mapRef.current.animateToRegion(currentRegion, 500);
      setRegion(currentRegion);
    }
  };

  const handleRegionChange = (newRegion) => {
    const distance = getDistance(region.latitude, region.longitude, newRegion.latitude, newRegion.longitude);
    if (distance > radiusInMeters) {
      setRegion(newRegion);
      fetchPosts({ latitude: newRegion.latitude, longitude: newRegion.longitude });
    }
  };

  const handleMarkerPress = (post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  
  const handleCurrentLocationPress = () => {
    if (position) {
      const currentRegion = {
        ...region,
        latitude: position.latitude,
        longitude: position.longitude,
      };
      mapRef.current.animateToRegion(currentRegion, 500);
      setRegion(currentRegion);
    }
  };
  
  const handleMapPress = (event) => {
    closeModal();
  };
  
  const closeModal = () => {
    setModalVisible(false);
    setSelectedPost(null);
  };
  
  const handleUserPressToNavigateToPost = (post) => {
    console.log("navigate to post", post);
    setPostDestination({latitude:post?.latitude, longitude:post?.longitude});
  }

  const handleAcceptLocationFromSearch = (data, details) => {
    const { geometry } = details;
    const { location } = geometry;
    console.log('\nlocation from user', location);
    setLocationFromSearch(location);
    const newRegion = {
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.01,    
      longitudeDelta: 0.01,   
    };
    
    setRegion(newRegion);
    if (isNaN(newRegion.latitude) || isNaN(newRegion.longitude)) {
      console.error('Invalid coordinates:', newRegion);
      return;
    }
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }

    // fetch posts near the selected location
    fetchPosts({ latitude: newRegion.latitude, longitude: newRegion.longitude });
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchAddress
          onLocationSelected={handleAcceptLocationFromSearch}
          containerStyle={styles.searchInputContainer}
        />
      </View>
      <View style={styles.mapContainer}>
        {MapComponent && position ? (
          <MapComponent
            region={region}
            handleRegionChange={handleRegionChange}
            handleMapPress={handleMapPress}
            userPosition={position}
            locationMarkers={locationMarkers}
            handleMarkerPress={handleMarkerPress}
            postFromFeed={postFromFeed}
            mapRef={mapRef}
            postDestination={postDestination}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        {(selectedPost) ? (
          <PostModal
            setVisible={setModalVisible}
            visible={isModalVisible}
            post={selectedPost}
            onClose={closeModal}
            userLocation={position}
            handleUserPosition={handleUserPressToNavigateToPost}
          />
        ) : null}

        <View style={styles.zoomButtons}>
          <TouchableOpacity onPress={zoomIn} style={styles.iconStyle}>
            <Feather name="zoom-in" size={27} color='black' />
          </TouchableOpacity>
          <TouchableOpacity onPress={zoomOut} style={styles.iconStyle}>
            <Feather name="zoom-out" size={27} color='black' />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCurrentLocationPress} style={styles.iconStyle}>
            <Feather name="navigation" size={24} color='black' />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButtons: {
    position: 'absolute',
    bottom: 65,
    right: 10,
    flexDirection: 'column',
  },
  iconStyle: {
    margin: 1,
    backgroundColor: 'white',
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
});


export default MapScreen;
