import React, { useEffect, useRef, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { getPostsWithFilters } from '../../FirebaseFunctions/collections/post';
import { getDistance } from '../../hooks/helpersMap/getDistance';
import { watchLocation } from '../../hooks/helpersMap/watchLocation';
import { getLocation } from '../../hooks/helpersMap/getLocation';
import Feather from 'react-native-vector-icons/Feather';
import { offsetMarkers } from '../../hooks/helpersMap/offsetMarkers';
import PostModal from '../../components/map/PostModal';

const MapScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const mapRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [locationMarkers, setLocationMarkers] = useState([]);
  const [region, setRegion] = useState({
    latitude: 37.4220737,
    longitude: -122.084923,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [loading, setLoading] = useState(false);
  const [postFromFeed, setPostFromFeed] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [MapComponent, setMapComponent] = useState(null);
  const [ hasLocationPermission, setHasLocationPermission ] = useState(false);
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
    if (!pos || hasLocationPermission) return;
    setLoading(true);
    const posts = await getPostsWithFilters([pos.latitude, pos.longitude], radiusInMeters, true);
    const offsetPosts = offsetMarkers(posts.map(post => ({
      id: post.id,
      latitude: post.coordinates.latitude,
      longitude: post.coordinates.longitude,
      title: post.title,
      image: post.image,
    })));
    setLocationMarkers(offsetPosts);
    setLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    const loc = await getLocation(setPosition, setRegion);
    if(loc){
      watchLocation(setPosition, setRegion);
      setLoading(false);
      setHasLocationPermission(true);
    }
    else{
      setHasLocationPermission(false);
    }

  };

  useEffect(() => {
    if (isFocused) {
      setPostFromFeed(route.params ? route.params : null);
      fetchData();
    } else {
      setSelectedPost(null);
      setPostFromFeed(null);

    }
  }, [isFocused]);

  useEffect(() => {
    if (hasLocationPermission && position) {
      fetchPosts(position);
    }
  }, [position]);

  useEffect(() => {
    if (postFromFeed && isFocused) {
      mapRef.current?.animateToRegion({
        latitude: postFromFeed.latitude,
        longitude: postFromFeed.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      }, 500);
    }
  }, [postFromFeed]);

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

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPost(null);
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
    const { coordinate } = event.nativeEvent;
    const pressedMarker = locationMarkers.find(marker =>
      marker.latitude === coordinate.latitude && marker.longitude === coordinate.longitude
    );
    if (!pressedMarker) {
      closeModal();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.container}>
        {MapComponent ? (
          <MapComponent
            region={region}
            handleRegionChange={handleRegionChange}
            handleMapPress={handleMapPress}
            position={position}
            locationMarkers={locationMarkers}
            handleMarkerPress={handleMarkerPress}
            postFromFeed={postFromFeed}
            mapRef={mapRef}
            style={{ flex: 1, opacity: loading ? 0.6 : 1 }}
            />
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
        {selectedPost ? (
          <PostModal
            setVisible={setModalVisible}
            visible={isModalVisible}
            post={selectedPost}
            onClose={closeModal}
            userLocation={position}
          />
        ) : null}

        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { height: '100%', width: '100%' },
  zoomButtons: {
    position: 'absolute',
    bottom: 20,
    right: 20,
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
    elevation: 5,
  },
  loading: {
    position: 'absolute',
    top: '17%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default MapScreen;
