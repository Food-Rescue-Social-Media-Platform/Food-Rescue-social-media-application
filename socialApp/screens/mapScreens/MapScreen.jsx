import React, { useEffect, useRef, useState, useContext } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ToastAndroid,
    Button,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {TouchableOpacity} from 'react-native'
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
                timeInterval: 10000, // עדכון כל 10 שניות
                distanceInterval: 10, // עדכון כל 10 מטרים
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

    useEffect(() => {
        const focusListener = navigation.addListener('focus', async () => {
            await getLocation();
            watchLocation();
            const posts = await getPostsNearby([position ? position.latitude : 37.4220737, position ? position.longitude : -122.084923], radiusInMeters);
            console.log('Nearby posts:', posts);
            setLocationMarkers(posts.map(post => ({
                id: post.id,
                latitude: post.coordinates.latitude,
                longitude: post.coordinates.longitude,
                title: post.title,
            })));
        });

        return () => {
            focusListener();
        };
    }, [navigation]);

    const zoomIn = () => {
        setRegion((prevRegion) => ({
            ...prevRegion,
            latitudeDelta: prevRegion.latitudeDelta / 2,
            longitudeDelta: prevRegion.longitudeDelta / 2,
        }));
    };

    const zoomOut = () => {
        setRegion((prevRegion) => ({
            ...prevRegion,
            latitudeDelta: prevRegion.latitudeDelta * 2,
            longitudeDelta: prevRegion.longitudeDelta * 2,
        }));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <View style={styles.container}>
                <MapView
                    region={region}
                    style={{ flex: 1, opacity: 0.6 }}
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
                            coordinate={{latitude: location.latitude, longitude: location.longitude}}
                            title={location.title}
                            pinColor='blue'
                        />
                    ))}
                </MapView>
                <View style={styles.zoomButtons}>
                    <TouchableOpacity onPress={zoomIn}>
                        <Feather name="zoom-in" size={22} color='black' style={styles.iconStyle} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={zoomOut}>
                        <Feather name="zoom-out" size={22} color='black' style={styles.iconStyle} />
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
    iconStyle :{
       margin: 5,
    }
});

export default MapScreen;
