import React, { useEffect, useRef, useState, useContext } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ToastAndroid,
    ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../navigation/AuthProvider';
import { getPostsNearby } from '../../FirebaseFunctions/collections/post';
import * as Location from 'expo-location';
import Feather from 'react-native-vector-icons/Feather';

const MapScreen = () => {
    const { user, login } = useContext(AuthContext);
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

    const hasPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
            return false;
        }
        return true;
    };

    const getLocation = async () => {
        const hasLocationPermission = await hasPermission();

        if (!hasLocationPermission) {
            console.log('Permission denied by user');
            return;
        }
        console.log('Permission granted by user');

        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            setPosition({ latitude: location.coords.latitude, longitude: location.coords.longitude });
            console.log('Location:', location);
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
            console.log("getCurrentPosition, coords:", location.coords);
        } catch (error) {
            console.error('Error getting location:', error);
            ToastAndroid.show(
                "We couldn't fetch your location. Please check your device location service!",
                ToastAndroid.LONG,
            );
        }
    };

    const watchLocation = async () => {
        const hasLocationPermission = await hasPermission();
        if (!hasLocationPermission) {
            return;
        }

        Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 10000,
                distanceInterval: 10,
            },
            (location) => {
                setPosition({ latitude: location.coords.latitude, longitude: location.coords.longitude });
                setRegion((prevRegion) => ({
                    ...prevRegion,
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                }));
                console.log("watchPosition, coords:", location.coords);
            }
        );
    };

    // Function to slightly offset markers to avoid overlap
    const offsetMarkers = (markers) => {
        const offsetDistance = 0.0001; // adjust this value as needed
        return markers.map((marker, index) => {
            const offsetAngle = (index * 2 * Math.PI) / markers.length;
            const offsetLat = offsetDistance * Math.sin(offsetAngle);
            const offsetLng = offsetDistance * Math.cos(offsetAngle);
            return {
                ...marker,
                latitude: marker.latitude + offsetLat,
                longitude: marker.longitude + offsetLng,
            };
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await getLocation();
            watchLocation();
            if (position) {
                const posts = await getPostsNearby([position.latitude, position.longitude], radiusInMeters);
                // Apply offset to markers to prevent overlap
                const offsetPosts = offsetMarkers(posts.map(post => ({
                    id: post.id,
                    latitude: post.coordinates.latitude,
                    longitude: post.coordinates.longitude,
                    title: post.title,
                })));
                setLocationMarkers(offsetPosts);
                console.log('Posts:', offsetPosts);
            }
            setLoading(false);
        };

        const focusListener = navigation.addListener('focus', fetchData);

        return () => {
            focusListener();
        };
    }, [navigation, position]);

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
