import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { getPostsNearby } from '../../FirebaseFunctions/collections/post';
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
    const [selectedPost, setSelectedPost] = useState(null);  // State to manage the selected post
    const [isModalVisible, setModalVisible] = useState(false);
    const radiusInMeters = 10000;
    
    const fetchPosts = async (pos) => {
        if (!pos) return;
        setLoading(true);
        const posts = await getPostsNearby([pos.latitude, pos.longitude], radiusInMeters);
        const offsetPosts = offsetMarkers(posts.map(post => ({
            id: post.id,
            latitude: post.coordinates.latitude,
            longitude: post.coordinates.longitude,
            title: post.title,
            image: post.image,
        })));
        console.log("posts", posts)
        setLocationMarkers(offsetPosts);
        setLoading(false);
        // setModalVisible(false);  // Close the modal when the posts are fetched

    };

    const fetchData = async () => {
        setLoading(true);
        await getLocation(setPosition, setRegion);
        watchLocation(setPosition, setRegion);
        setLoading(false);
    };

    useEffect(() => {
        if(isFocused){
          setPostFromFeed(route.params ? route.params : null);
          fetchData();
        }
        else {
          setPostFromFeed(null);
          setSelectedPost(null);  // Reset selected post when screen loses focus
        }  
    }, [isFocused]);
    
    useEffect(() => {
        if (position) {
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
            }, 500); // Duration of the animation in ms
        }
    }, [postFromFeed]);

    const zoomIn = () => {
        if (mapRef.current) {
            const currentRegion = {
                ...region,
                latitudeDelta: region.latitudeDelta / 2,
                longitudeDelta: region.longitudeDelta / 2,
            };
            mapRef.current.animateToRegion(currentRegion, 500); // duration of the animation in ms
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
            mapRef.current.animateToRegion(currentRegion, 500); // duration of the animation in ms
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
            mapRef.current.animateToRegion(currentRegion, 500); // duration of the animation in ms
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
                <MapView
                    region={region}
                    onRegionChangeComplete={handleRegionChange}
                    style={{ flex: 1, opacity: loading ? 0.6 : 1 }}
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
                            onPress={() => handleMarkerPress(post)}  // Handle marker press
                        />
                    ))}
                    {postFromFeed && (
                        <Marker
                            key={postFromFeed.id}
                            coordinate={{ latitude: postFromFeed.latitude, longitude: postFromFeed.longitude }}
                            pinColor="purple"
                            style={{ zIndex: 1 }}
                            onPress={() => handleMarkerPress(postFromFeed)}  // Handle marker press
                        />            
                    )}
                </MapView>

                { selectedPost ? (
                    <PostModal
                        setVisible={setModalVisible}
                        visible={isModalVisible}
                        post={selectedPost}
                        onClose={closeModal}
                        userLocation={position}
                    />
                ) : null }
                 
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
