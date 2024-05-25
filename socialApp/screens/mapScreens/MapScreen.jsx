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
import { useNavigation } from '@react-navigation/native';
import { getPostsNearby } from '../../FirebaseFunctions/collections/post';
import {getDistance} from '../../hooks/helpersMap/getDistance';
import {watchLocation} from '../../hooks/helpersMap/watchLocation';
import { getLocation } from '../../hooks/helpersMap/getLocation';
import Feather from 'react-native-vector-icons/Feather';
import {offsetMarkers} from '../../hooks/helpersMap/offsetMarkers'

const MapScreen = () => {
    const mapRef = useRef(null);
    const [position, setPosition] = useState(null);
    const [locationMarkers, setLocationMarkers] = useState([]);
    const [region, setRegion] = useState({
        latitude: 37.4220737,
        longitude: -122.084923,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const radiusInMeters = 10000;

    const fetchPosts = async (pos) => {
        if (!pos) return;
        const posts = await getPostsNearby([pos.latitude, pos.longitude], radiusInMeters);
        const offsetPosts = offsetMarkers(posts.map(post => ({
            id: post.id,
            latitude: post.coordinates.latitude,
            longitude: post.coordinates.longitude,
            title: post.title,
        })));
        setLocationMarkers(offsetPosts);
    };


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await getLocation(setPosition, setRegion);
            watchLocation(setPosition, setRegion);
            setLoading(false);
        };

        const focusListener = navigation.addListener('focus', fetchData);

        return () => {
            focusListener();
        };
    }, [navigation]);

    
    useEffect(() => {
        if (position) {
            console.trace() 
            fetchPosts(position);
        }
    }, [position]);

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
                            pinColor="blue"
                        />
                    ))}
                </MapView>
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
    }
});

export default MapScreen;
