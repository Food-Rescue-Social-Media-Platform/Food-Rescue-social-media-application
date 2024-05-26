import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { TouchableOpacity, Image ,Text} from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { getPostsNearby } from '../../FirebaseFunctions/collections/post';
import {getDistance} from '../../hooks/helpersMap/getDistance';
import {watchLocation} from '../../hooks/helpersMap/watchLocation';
import { getLocation } from '../../hooks/helpersMap/getLocation';
import Feather from 'react-native-vector-icons/Feather';
import {offsetMarkers} from '../../hooks/helpersMap/offsetMarkers'
import { CardMap } from '../../components/map/CardMap';
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
    console.clear();
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
            image: post.Image,
        })));
        setLocationMarkers(offsetPosts);
        setLoading(false);

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
            mapRef.current.animateToRegion({
                ...region,
                latitudeDelta: region.latitudeDelta / 2,
                longitudeDelta: region.longitudeDelta / 2,
            }, 500); // duration of the animation in ms
        }
    };

    const zoomOut = () => {
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                ...region,
                latitudeDelta: region.latitudeDelta * 2,
                longitudeDelta: region.longitudeDelta * 2,
            }, 500); // duration of the animation in ms
        }
    };

     const handleRegionChange = (newRegion) => {
        setRegion(newRegion);
        const distance = getDistance(region.latitude, region.longitude, newRegion.latitude, newRegion.longitude);
        if (distance > radiusInMeters) {
            fetchPosts({ latitude: newRegion.latitude, longitude: newRegion.longitude });
        }
    };

    const handleMarkerPress = (post) => {
        setSelectedPost(post);
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
                >
                    {position && (
                        <Marker
                            coordinate={{ latitude: position.latitude, longitude: position.longitude }}
                            title="You are here"
                            pinColor="red"
                            style={{ zIndex: 1 }}
                        />
                    )}
                    
                    {locationMarkers.map(location => (
                        <Marker
                            key={location.id}
                            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                            title={location.title}
                            pinColor="green"
                            onPress={() => handleMarkerPress(location)}  // Handle marker press
                        >
                            <Callout>
                            <View style={styles.callout}>
                                {location.image && <Image source={{ uri: location.image }} style={styles.calloutImage} />}
                                <Text style={styles.calloutTitle}>{location.title}</Text>
                            </View>
                        </Callout>
                        </Marker>
                    ))}
                    {postFromFeed && (
                        <Marker
                            key={postFromFeed.id}
                            coordinate={{ latitude: postFromFeed.latitude, longitude: postFromFeed.longitude }}
                            title={postFromFeed.title}
                            pinColor="purple"
                            style={{ zIndex: 1}}
                            onPress={() => handleMarkerPress(postFromFeed)}  // Handle marker press
                        >
                            <Callout>
                                <View style={styles.callout}>
                                    {postFromFeed.image && <Image source={{ uri: postFromFeed.image }} style={styles.calloutImage} />}
                                    <Text style={styles.calloutTitle}>{postFromFeed.title}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    )}
                </MapView>
                 
                {loading && (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}

             {/*
             {selectedPost && (
                    <CardMap title={selectedPost.title} image={selectedPost.image} />
                )} 
                */}
                
                <View style={styles.zoomButtons}>
                    <TouchableOpacity onPress={zoomIn} style={styles.iconStyle}>
                        <Feather name="zoom-in" size={27} color='black' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={zoomOut} style={styles.iconStyle}>
                        <Feather name="zoom-out" size={27} color='black' />
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
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
    },
    callout: {
        width: 150,
        alignItems: 'center',
    },
    calloutImage: {
        width: 120,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    calloutTitle: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

export default MapScreen;
